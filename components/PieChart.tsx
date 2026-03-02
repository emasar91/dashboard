"use client"

import { useThemeColors } from "@/hooks/useThemeColor"
import { useLocale } from "next-intl"
import { formatCurrency } from "@/lib/formatCurrency"
import dynamic from "next/dynamic"
import type { ChartDataEntry } from "./charts/PieChartInternal"

interface PieChartProps {
  data: ChartDataEntry[]
  title?: string
  subtitle?: string
  className?: string
  showTooltip?: boolean
  textCenter?: string
}

// 2. Wrap it with dynamic() to avoid the static import check from react-doctor
const DynamicRecharts = dynamic(() => import("./charts/PieChartInternal"), {
  ssr: false,
})

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
          <DynamicRecharts
            data={data}
            colors={colors}
            locale={locale}
            showTooltip={showTooltip}
            textCenter={textCenter}
          />
        </div>

        <div className="w-full max-w-md">
          {data.map((item, i) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2 border-b border-border/20 last:border-0 pb-1 sm:pb-0 sm:border-0"
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
