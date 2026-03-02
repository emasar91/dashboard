import { ActivityCard } from "@/components/ActivityCard"
import { DiscountsCard } from "@/components/DiscountCard"
import { OrdersTable } from "@/components/OrdersTable"
import { StatCard } from "@/components/StateCard"
import { TopSelling } from "@/components/TopSelling"
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react"
import { QueryClient } from "@tanstack/react-query"
import { getDashboardData } from "@/services/dashboardData"
import { NoSSR } from "@/components/NoSSR"
import dynamic from "next/dynamic"
import { getLocale, getTranslations } from "next-intl/server"

const LazyChartOverTime = dynamic(() =>
  import("@/components/AreaChart").then((m) => m.AreaChartComponent),
)

const LazyPieChartCustom = dynamic(() =>
  import("@/components/PieChart").then((m) => m.PieChartCustom),
)

async function DashboardPage() {
  const queryClient = new QueryClient()
  const locale = await getLocale()
  const t = await getTranslations("dashboard.recentActivity")
  const t2 = await getTranslations("dashboard")

  await queryClient.prefetchQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => getDashboardData(locale, t),
  })
  const data = await getDashboardData(locale, t)

  const {
    dashboardKpis,
    revenueByMonthChart,
    topSellingProducts,
    categoriesPieChart,
    recentActivity,
    discountsData,
    recentsOrders,
  } = data

  return (
    <div className="max-w-7xl space-y-3 md:space-y-4 mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4 ">
        <StatCard
          title="totalSales"
          value={dashboardKpis.totalSales.value}
          change={dashboardKpis.totalSales.trend.change}
          changeType={dashboardKpis.totalSales.trend.changeType}
          icon={DollarSign}
          type="currency"
          since="since"
          trend={dashboardKpis.totalSales.trend.trend}
          intl="stats"
        />
        <StatCard
          title="totalUsers"
          value={dashboardKpis.totalUsers.value}
          change={dashboardKpis.totalUsers.trend.change}
          changeType={dashboardKpis.totalUsers.trend.changeType}
          icon={Users}
          type="number"
          since="since"
          trend={dashboardKpis.totalUsers.trend.trend}
          intl="stats"
        />
        <StatCard
          title="totalOrders"
          value={dashboardKpis.totalOrders.value}
          change={dashboardKpis.totalOrders.trend.change}
          changeType={dashboardKpis.totalOrders.trend.changeType}
          icon={ShoppingBag}
          type="number"
          since="since"
          trend={dashboardKpis.totalOrders.trend.trend}
          intl="stats"
        />
        <StatCard
          title="avgValue"
          value={dashboardKpis.avgCartValue.value}
          change={dashboardKpis.avgCartValue.trend.change}
          changeType={dashboardKpis.avgCartValue.trend.changeType}
          icon={TrendingUp}
          type="currency"
          since="since"
          trend={dashboardKpis.avgCartValue.trend.trend}
          intl="stats"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-8 md:gap-4">
        <div className="min-h-[300px] md:col-span-2 lg:col-span-3 lg:min-h-[350px]">
          <NoSSR>
            <LazyChartOverTime
              data={revenueByMonthChart}
              xKey="month"
              primaryKey="revenue"
              secondaryKey="orders"
              title={t2("title")}
              subtitle={t2("subtitle")}
              primaryLabel={t2("primaryLabel")}
              secondaryLabel={t2("secondaryLabel")}
              intl="dashboard.chart"
            />
          </NoSSR>
        </div>

        <div className="min-h-[280px] lg:col-span-3">
          <TopSelling data={topSellingProducts} />
        </div>

        <div className="min-h-[240px] lg:col-span-2">
          <NoSSR>
            <LazyPieChartCustom
              data={categoriesPieChart.slice(0, 5)}
              title={t2("chart.title")}
              subtitle={t2("chart.subtitle")}
              className="h-full"
              textCenter={t2("chart.textCenter")}
            />
          </NoSSR>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-8 md:gap-4">
        <div className="min-h-[280px] md:col-span-2 lg:col-span-3">
          <OrdersTable data={recentsOrders} />
        </div>
        <div className="min-h-[280px] lg:col-span-3">
          <DiscountsCard data={discountsData} />
        </div>
        <div className="min-h-[280px] lg:col-span-2">
          <ActivityCard data={recentActivity} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
