"use client"

import { useThemeColors } from "@/hooks/useThemeColor"

import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { useLocale } from "next-intl"
import { formatCurrency } from "@/lib/formatCurrency"
import { truncateText } from "@/lib/truncateText"

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
        <span className="text-xs text-muted-foreground capitalize">
          {entry.name}
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold text-card-foreground">
        {formatCurrency(entry.value, locale)}
      </p>
    </div>
  )
}

interface ChartDataEntry {
  name: string
  value: number
}

interface PieChartProps {
  data: ChartDataEntry[]
  title?: string
  subtitle?: string
  className?: string
  showTooltip?: boolean
  textCenter?: string
}

interface ViewBox {
  width: number
  height: number
  lowerWidth: number
  lowerHeight: number
  x: number
  y: number
}

export function PieChartCustom({
  data,
  title,
  subtitle,
  className,
  showTooltip = true,
  textCenter = "Total",
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
      className={`flex flex-col rounded-xl border border-border bg-card p-4 lg:p-5 ${className} [&_*:focus]:outline-none [&_*:focus]:box-shadow-none w-full`}
    >
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex flex-1 flex-col items-center gap-2 min-h-0">
        <div className="relative h-full w-full min-h-[200px] sm:min-h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart
              style={{ outline: "none" }} // CSS inline para mayor seguridad
            >
              {/* Solo mostramos Tooltip si la prop lo permite */}
              {showTooltip && (
                <Tooltip content={<CustomTooltip locale={locale} />} />
              )}

              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="90%"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                isAnimationActive={true} // Desactiva la animación si sigue sin aparecer
              >
                {data.map((item, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={chartColors[i % chartColors.length]}
                    style={{ outline: "none" }}
                  />
                ))}

                {/* ETIQUETA CENTRAL MEJORADA */}
                <Label
                  position="center"
                  content={({ viewBox }) => {
                    const { width, height, x, y } = viewBox as ViewBox

                    const centerX = (x || 0) + (width || 0) / 2
                    const centerY = (y || 0) + (height || 0) / 2
                    const maxTextWidth = width * 0.1
                    return (
                      <g>
                        <text
                          x={centerX}
                          y={centerY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={centerX}
                            y={centerY - 5}
                            className="fill-foreground text-lg font-bold"
                          >
                            {formatCurrency(total, locale)}
                          </tspan>
                          <tspan
                            x={centerX}
                            y={centerY + 15}
                            className={`fill-muted-foreground sm:text-[10px] text-[8px] uppercase tracking-wider font-medium w-fulltext`}
                          >
                            {truncateText(textCenter, maxTextWidth)}
                          </tspan>
                        </text>
                      </g>
                    )
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LEYENDA ADAPTATIVA */}
        <div className="w-full max-w-md">
          {data.map((item, i) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2 border-b border-border/20 last:border-0 pb-1 sm:pb-0 sm:border-0 "
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: chartColors[i % chartColors.length],
                  }}
                />
                <span className="truncate text-[10px] text-muted-foreground italic capitalize">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {formatCurrency(item.value, locale)}
                </span>
                <span className="text-[11px] font-bold text-primary min-w-[35px] text-right">
                  {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
