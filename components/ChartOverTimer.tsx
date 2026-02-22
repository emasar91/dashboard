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
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getDashboardData, transformCartData } from "@/services/dashboard"
import { useTranslations } from "next-intl"
import LoadingData from "./LoadingData"

interface TooltipEntry {
  value: number
  dataKey: string
  color: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs capitalize text-muted-foreground">
            {entry.dataKey}:
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

export function ChartOverTime() {
  const colors = useThemeColors()
  const t = useTranslations("revenueChart")

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  })

  // Usamos el helper dentro de un useMemo para no recalcular
  // la data si el gráfico se redibuja por el sidebar
  const chartData = useMemo(() => {
    return dashboardData ? transformCartData(dashboardData.carts, t) : []
  }, [dashboardData, t])

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingData title={t("loading")} className="w-full" />
      </div>
    )

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">
            {t("title")}
          </h3>
          <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">
              {t("revenue")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs text-muted-foreground">{t("orders")}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%" debounce={100}>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors.primary}
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.tick, fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.tick, fontSize: 11 }}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={colors.primary}
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke={colors.accent}
              strokeWidth={2}
              fill="url(#colorOrders)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
