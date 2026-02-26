"use client"

import { useThemeColors } from "@/hooks/useThemeColor"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useLocale } from "next-intl"
import { formatCurrency } from "@/lib/formatCurrency"

interface PieTooltipEntry {
  name: string
  value: number
  payload: { fill: string }
}

function CustomTooltip({
  active,
  payload,
  locale,
}: {
  active?: boolean
  payload?: PieTooltipEntry[]
  locale: string
}) {
  if (!active || !payload?.[0]) return null
  const entry = payload[0]
  return (
    <div className="rounded-lg border border-border bg-card p-2.5 shadow-xl">
      <div className="flex items-center gap-2">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: entry.payload.fill }}
        />
        <span className="text-xs text-muted-foreground">{entry.name}</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-card-foreground">
        ${formatCurrency(entry.value, locale)}
      </p>
    </div>
  )
}

// Definimos la interfaz para la data
export interface ChartDataEntry {
  name: string
  value: number
}

interface PieChartProps {
  data: ChartDataEntry[]
  title?: string
  subtitle?: string
  className?: string // Para el h-full que hablamos antes
}

export function PieChartCustom({
  data,
  title,
  subtitle,
  className,
}: PieChartProps) {
  const colors = useThemeColors()
  const locale = useLocale()

  const chartColors = [
    colors.chart1,
    colors.chart2,
    colors.chart3,
    colors.chart4,
    colors.chart5,
  ]

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div
      className={`flex flex-col rounded-xl border border-border bg-card p-4 lg:p-5 ${className} w-full`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex flex-1 flex-col items-center gap-4 min-h-0">
        <div className="h-full w-full min-h-[160px]">
          {" "}
          {/* Subí el ancho a full para aprovechar el grid */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="85%"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={chartColors[i % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip locale={locale} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 gap-2 w-full px-2">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: chartColors[i % chartColors.length] }}
              />
              <span className="flex-1 truncate text-[11px] text-muted-foreground italic">
                {item.name}
              </span>
              <span className="text-[11px] font-bold text-card-foreground">
                {total > 0 ? Math.round((item.value / total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
