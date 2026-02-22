import { ActivityCard } from "@/components/ActivityCard"
import { CategoryCard } from "@/components/CategoryCard"
import { ChartOverTime } from "@/components/ChartOverTimer"
import { DiscountsCard } from "@/components/DiscountCard"
import { OrdersTable } from "@/components/OrdersTable"
import { StatCard } from "@/components/StateCard"
import { TopSelling } from "@/components/TopSelling"
import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react"
import { QueryClient } from "@tanstack/react-query"
import { getDashboardData } from "@/services/dashboard"

export default async function Home() {
  const queryClient = new QueryClient()

  // Hacemos prefetch para que React Query ya tenga los datos al renderizar
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
          value={data.stats.totalSales}
          change="+14.2%"
          changeType="positive"
          icon={DollarSign}
          type="currency"
          since="since"
        />
        <StatCard
          title="totalUsers"
          value={data.stats.totalUsers}
          change="+7.8%"
          changeType="positive"
          icon={Users}
          type="number"
          since="since"
        />
        <StatCard
          title="totalOrders"
          value={data.stats.totalOrders}
          change="+22.1%"
          changeType="positive"
          icon={ShoppingBag}
          type="number"
          since="since"
        />
        <StatCard
          title="avgValue"
          value={data.stats.avgValue}
          change="-3.1%"
          changeType="negative"
          icon={TrendingUp}
          type="currency"
          since="since"
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
