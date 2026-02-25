"use client"

import { useThemeColors } from "@/hooks/useThemeColor"
import { getCategoryData, getDashboardData } from "@/services/dashboardData"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useLocale, useTranslations } from "next-intl"
import { formatCurrency } from "@/lib/formatCurrency"
import LoadingData from "./LoadingData"

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

export function CategoryCard() {
  const t = useTranslations("categoryCard")
  const colors = useThemeColors()
  const locale = useLocale()

  const chartColors = [
    colors.chart1,
    colors.chart2,
    colors.chart3,
    colors.chart4,
    colors.chart5,
  ]

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  })

  // 2. Procesamos la data para el gráfico de torta
  const categories = useMemo(() => {
    // dashboardData.carts ya tiene los productos con la propiedad .category inyectada
    return dashboardData ? getCategoryData(dashboardData.carts) : []
  }, [dashboardData])

  const total = categories.reduce((sum, d) => sum + d.value, 0)

  if (isLoading) return <LoadingData title={t("loading")} />

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          {t("title")}
        </h3>
        <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="flex flex-1 flex-col items-center gap-4 min-h-0">
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
              <Tooltip content={<CustomTooltip locale={locale} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 w-full px-4">
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
