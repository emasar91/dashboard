"use client"

import { type ThemeColors } from "@/hooks/useThemeColor"

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
  // Mantenemos el require para evitar errores de react-doctor y SSR
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const recharts = require("recharts")
  const {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } = recharts

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      minHeight={220}
      minWidth={250}
      debounce={100}
    >
      <AreaChart
        data={data}
        // Ajustamos márgenes para que la curva use todo el espacio al no haber ejes
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
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
          opacity={0.1} // Más sutil para look Apple
        />

        {/* XAxis con hide para limpiar la base */}
        <XAxis dataKey={xKey} hide={true} />

        {/* YAxis con hide para limpiar el lateral */}
        <YAxis hide={true} domain={["auto", "auto"]} />

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
              <div className="rounded-xl border border-border bg-card/80 backdrop-blur-md p-3 shadow-2xl">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
          strokeWidth={3} // Un poco más grueso para compensar la falta de ejes
          fill="url(#colorPrimary)"
          dot={false} // Limpieza visual
          activeDot={{ r: 4, strokeWidth: 0 }}
        />

        {secondaryKey && (
          <Area
            type="monotone"
            dataKey={secondaryKey}
            stroke={colors.accent}
            strokeWidth={3}
            fill="url(#colorSecondary)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}
