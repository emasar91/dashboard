"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { useThemeColors } from "@/hooks/useThemeColor"
import { useTranslations } from "next-intl"
import { useMemo } from "react"

interface TooltipEntry {
  value: number
  dataKey: string
  color: string
}

function CustomTooltip({
  active,
  payload,
  label,
  t,
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
  t: (key: string) => string
}) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="mb-2 text-xs font-medium text-muted-foreground capitalize">
        {label?.replaceAll("-", " ")}
      </p>
      {payload.map((entry) => (
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
}

interface DynamicChartProps {
  data: { name?: string; revenue?: number; orders?: number; month?: string }[]
  xKey: string // Ej: "month" o "name" (categoría)
  primaryKey: string // Ej: "revenue"
  secondaryKey?: string // Ej: "orders" (opcional)
  title: string
  subtitle: string
  primaryLabel: string
  secondaryLabel?: string
  intl: string
}

export function AreaChartComponent({
  data,
  xKey,
  primaryKey,
  secondaryKey,
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  intl,
}: DynamicChartProps) {
  const colors = useThemeColors()
  const chartData = data
  const t = useTranslations(intl)

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">
              {primaryLabel}
            </span>
          </div>
          {secondaryLabel && (
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-xs text-muted-foreground">
                {secondaryLabel}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minHeight={220}
          minWidth={300}
          debounce={100}
        >
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors.primary}
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
              {secondaryKey && (
                <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.accent}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.accent}
                    stopOpacity={0}
                  />
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
              tick={{ fill: colors.tick, fontSize: 10 }} // Bajamos un poco el tamaño
              interval={0} // <--- FUERZA a mostrar todos los ticks
              angle={-45} // <--- ROTACIÓN para que quepan
              textAnchor="end" // Alinea el texto rotado correctamente
              height={60} // <--- Importante: damos espacio extra abajo para el texto rotado
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
              // Formateador condicional: si es dinero usa 'k', si no, el valor real
              tickFormatter={(v) =>
                primaryKey === "revenue" ? `$${v / 1000}k` : v
              }
            />

            <Tooltip content={<CustomTooltip t={t} />} />

            {/* Área Principal */}
            <Area
              type="monotone"
              dataKey={primaryKey} // <--- DINÁMICO
              stroke={colors.primary}
              strokeWidth={2}
              fill="url(#colorPrimary)"
            />

            {/* Área Secundaria (Solo si existe) */}
            {secondaryKey && (
              <Area
                type="monotone"
                dataKey={secondaryKey} // <--- DINÁMICO
                stroke={colors.accent}
                strokeWidth={2}
                fill="url(#colorSecondary)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
