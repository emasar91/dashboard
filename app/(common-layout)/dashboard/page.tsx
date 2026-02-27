import dynamic from "next/dynamic"
import { ActivityCard } from "@/components/ActivityCard"
import { DiscountsCard } from "@/components/DiscountCard"
import { OrdersTable } from "@/components/OrdersTable"
import { StatCard } from "@/components/StateCard"
import { TopSelling } from "@/components/TopSelling"
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react"
import { QueryClient } from "@tanstack/react-query"
import { getDashboardData } from "@/services/dashboardData"

const CategoryCard = dynamic(
  () => import("@/components/CategoryCard").then((m) => ({ default: m.CategoryCard })),
  { ssr: false },
)

const ChartOverTime = dynamic(
  () => import("@/components/ChartOverTimer").then((m) => ({ default: m.ChartOverTime })),
  { ssr: false },
)

async function DashboardPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  })

  const data = await getDashboardData()

  return (
    <div className="max-w-7xl space-y-3 md:space-y-4 mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4 ">
        <StatCard
          title="totalSales"
          value={data.totalSales}
          change="+14.2%"
          changeType="positive"
          icon={DollarSign}
          type="currency"
          since="since"
          trend="up"
          intl="stats"
        />
        <StatCard
          title="totalUsers"
          value={data.totalUsers}
          change="+7.8%"
          changeType="positive"
          icon={Users}
          type="number"
          since="since"
          trend="up"
          intl="stats"
        />
        <StatCard
          title="totalOrders"
          value={data.totalOrders}
          change="+22.1%"
          changeType="positive"
          icon={ShoppingBag}
          type="number"
          since="since"
          trend="up"
          intl="stats"
        />
        <StatCard
          title="avgValue"
          value={data.avgCartValue}
          change="-3.1%"
          changeType="negative"
          icon={TrendingUp}
          type="currency"
          since="since"
          trend="down"
          intl="stats"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-8 md:gap-4">
        <div className="min-h-[300px] md:col-span-2 lg:col-span-3 lg:min-h-[350px]">
          <ChartOverTime />
        </div>

        <div className="min-h-[280px] lg:col-span-3">
          <TopSelling carts={data.carts} />
        </div>

        <div className="min-h-[240px] lg:col-span-2">
          <CategoryCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-8 md:gap-4">
        <div className="min-h-[280px] md:col-span-2 lg:col-span-3">
          <OrdersTable />
        </div>
        <div className="min-h-[280px] lg:col-span-3">
          <DiscountsCard />
        </div>
        <div className="min-h-[280px] lg:col-span-2">
          <ActivityCard />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
