"use client"

import { type ThemeColors } from "@/hooks/useThemeColor"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export interface TooltipEntry {
  value: number
  dataKey: string
  color: string
}

export default function RechartsAreaInternal({
  data,
  colors,
  xKey,
  primaryKey,
  secondaryKey,
  t,
}: {
  data: { name?: string; revenue?: number; orders?: number; month?: string }[]
  colors: ThemeColors
  xKey: string
  primaryKey: string
  secondaryKey?: string
  t: (key: string) => string
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minHeight={220}
      minWidth={300}
      debounce={100}
    >
      <AreaChart
        data={data}
        margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
            <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
          </linearGradient>
          {secondaryKey && (
            <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
            </linearGradient>
          )}
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke={colors.grid}
          vertical={false}
        />

        <XAxis
          dataKey={xKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: colors.tick, fontSize: 10 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
          tickFormatter={(value) =>
            value.length > 10
              ? `${value.replaceAll("-", " ").substring(0, 8)}...`
              : value.replaceAll("-", " ")
          }
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: colors.tick, fontSize: 11 }}
          tickFormatter={(v) =>
            primaryKey === "revenue" ? `$${v / 1000}k` : v
          }
        />

        <Tooltip
          content={({
            active,
            payload,
            label,
          }: {
            active?: boolean
            payload?: readonly unknown[]
            label?: string | number
          }) => {
            if (!active || !payload) return null
            return (
              <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
                <p className="mb-2 text-xs font-medium text-muted-foreground capitalize">
                  {String(label || "").replaceAll("-", " ")}
                </p>
                {(payload as TooltipEntry[]).map((entry: TooltipEntry) => (
                  <div key={entry.dataKey} className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs capitalize text-muted-foreground">
                      {t(entry.dataKey.toLocaleLowerCase())}:
                    </span>
                    <span className="text-xs font-semibold text-card-foreground">
                      {entry.dataKey === "revenue"
                        ? `$${entry.value.toLocaleString()}`
                        : entry.value}
                    </span>
                  </div>
                ))}
              </div>
            )
          }}
        />

        <Area
          type="monotone"
          dataKey={primaryKey}
          stroke={colors.primary}
          strokeWidth={2}
          fill="url(#colorPrimary)"
        />

        {secondaryKey && (
          <Area
            type="monotone"
            dataKey={secondaryKey}
            stroke={colors.accent}
            strokeWidth={2}
            fill="url(#colorSecondary)"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}
