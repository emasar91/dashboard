"use client"

import { type ThemeColors } from "@/hooks/useThemeColor"
import { formatCurrency } from "@/lib/formatCurrency"
import { truncateText } from "@/lib/truncateText"
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

export interface ChartDataEntry {
  name: string
  value: number
}

interface PieTooltipEntry {
  name: string
  value: number
  payload: { fill: string }
}

interface ViewBox {
  width: number
  height: number
  x: number
  y: number
}

export default function RechartsInternal({
  data,
  colors,
  locale,
  showTooltip,
  textCenter,
}: {
  data: ChartDataEntry[]
  colors: ThemeColors
  locale: string
  showTooltip: boolean
  textCenter: string
}) {
  const chartColors = [
    colors.chart1,
    colors.chart2,
    colors.chart3,
    colors.chart4,
    colors.chart5,
  ]

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart style={{ outline: "none" }}>
        {showTooltip && (
          <Tooltip
            content={({
              active,
              payload,
            }: {
              active?: boolean
              payload?: readonly unknown[]
            }) => {
              if (!active || !payload?.[0]) return null
              const entry = payload[0] as unknown as PieTooltipEntry
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
            }}
          />
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
          isAnimationActive={true}
        >
          {data.map((item, i) => (
            <Cell
              key={`cell-${item.name}`}
              fill={chartColors[i % chartColors.length]}
              style={{ outline: "none" }}
            />
          ))}

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
                      className={`fill-muted-foreground sm:text-[10px] text-[8px] uppercase tracking-wider font-medium`}
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
  )
}
