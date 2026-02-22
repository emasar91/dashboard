"use client"

import { useThemeColors } from "@/hooks/useThemeColor"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const categories = [
  { name: "Electronics", value: 4200 },
  { name: "Clothing", value: 3100 },
  { name: "Home & Garden", value: 2400 },
  { name: "Sports", value: 1800 },
  { name: "Books", value: 1200 },
]

interface PieTooltipEntry {
  name: string
  value: number
  payload: { fill: string }
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: PieTooltipEntry[]
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
        ${entry.value.toLocaleString()}
      </p>
    </div>
  )
}

export function CategoryCard() {
  const colors = useThemeColors()
  const total = categories.reduce((sum, d) => sum + d.value, 0)

  const chartColors = [
    colors.chart1,
    colors.chart2,
    colors.chart3,
    colors.chart4,
    colors.chart5,
  ]

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          Sales by Category
        </h3>
        <p className="text-xs text-muted-foreground">Revenue distribution</p>
      </div>
      <div className="flex flex-1 items-center gap-4 min-h-0">
        <div className="h-full w-1/2 min-h-[120px]">
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {categories.map((_, i) => (
                  <Cell key={categories[i].name} fill={chartColors[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {categories.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: chartColors[i] }}
              />
              <span className="flex-1 truncate text-[11px] text-muted-foreground">
                {item.name}
              </span>
              <span className="text-[11px] font-medium text-card-foreground">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
