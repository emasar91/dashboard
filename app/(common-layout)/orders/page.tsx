import dynamic from "next/dynamic"
import OrdersList from "@/components/OrdersList"
import { StatCard } from "@/components/StateCard"
import { getDashboardData } from "@/services/dashboardData"
import { QueryClient } from "@tanstack/react-query"
import { Handbag, Receipt, Package, FileUser } from "lucide-react"
import CartDetail from "@/components/CartDetail"
import { getTranslations } from "next-intl/server"
import { NoSSR } from "@/components/NoSSR"

const LazyPieChartCustom = dynamic(() =>
  import("@/components/PieChart").then((m) => m.PieChartCustom),
)

interface OrdersPageProps {
  searchParams: {
    cartId?: string
  }
}

async function OrdersPage({ searchParams }: OrdersPageProps) {
  const queryClient = new QueryClient()

  const [t, data, params] = await Promise.all([
    getTranslations("orders"),
    getDashboardData(),
    searchParams,
    queryClient.prefetchQuery({
      queryKey: ["dashboard-data"],
      queryFn: getDashboardData,
    }),
  ])

  const selectedCartId = params?.cartId
  const selectedCart =
    data.carts.find((c) => c.id.toString() === selectedCartId) || data.carts[0]

  const financeData = [
    { name: t("netSales"), value: data.totalSales },
    { name: t("discounts"), value: data.totalDiscounts },
  ]

  return (
    <div className="max-w-7xl space-y-3 md:space-y-4 mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
        <StatCard
          title="totalOrders"
          value={data.totalOrders}
          change="+22.1%"
          changeType="positive"
          icon={Handbag}
          type="number"
          since="since"
          trend="up"
          intl="orders.statsOrders"
        />
        <StatCard
          title="totalProducts"
          value={data.productsSold}
          change="+7.8%"
          changeType="positive"
          icon={Package}
          type="number"
          since="since"
          trend="up"
          intl="orders.statsOrders"
        />
        <StatCard
          title="avgValue"
          value={data.avgCartValue}
          change="+3.1%"
          changeType="negative"
          icon={Receipt}
          type="currency"
          since="since"
          trend="down"
          intl="orders.statsOrders"
        />
        <StatCard
          title="usersWithOrders"
          value={data.usersWithOrders}
          change="+22.1%"
          changeType="positive"
          icon={FileUser}
          type="number"
          since="since"
          trend="up"
          intl="orders.statsOrders"
        />
      </div>
      <div>
        <OrdersList categories={data.allStatus} orders={data.carts} />
      </div>
      <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <NoSSR>
            <LazyPieChartCustom
              data={financeData}
              title={t("titleChart")}
              subtitle={t("subtitleChart")}
              className="h-full"
            />
          </NoSSR>
        </div>
        <div className="col-span-2 flex ">
          <CartDetail cart={selectedCart} />
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
