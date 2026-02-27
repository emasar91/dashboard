"use client"

import { useQuery } from "@tanstack/react-query"
import { getDashboardData, getRecentActivity } from "@/services/dashboardData"
import {
  ShoppingCart,
  UserPlus,
  Star,
  Package,
  CreditCard,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import LoadingData from "./LoadingData"

const IconMap: Record<string, LucideIcon> = {
  ShoppingCart,
  UserPlus,
  Star,
  Package,
  CreditCard,
}

export function ActivityCard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  })
  const t = useTranslations("activityCard")

  const activities = dashboardData
    ? getRecentActivity(dashboardData.carts, dashboardData.users || [], t)
    : []

  if (isLoading) {
    return <LoadingData title={t("loading")} className="min-h-[560px]" />
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5 min-h-[560px]">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          {t("title")}
        </h3>
        <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="flex-1 overflow-auto space-y-1 pr-1">
        {activities.map((activity) => {
          const Icon = IconMap[activity.icon] || Package

          return (
            <div
              key={activity.text}
              className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
            >
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${activity.iconBg} ${activity.iconColor}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-card-foreground leading-relaxed">
                  {activity.text}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground italic">
                  {activity.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
