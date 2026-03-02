import dynamic from "next/dynamic"
import OrdersList from "@/components/OrdersList"
import { StatCard } from "@/components/StateCard"
import { getDashboardData } from "@/services/dashboardData"
import { QueryClient } from "@tanstack/react-query"
import { Handbag, Receipt, Package, FileUser } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { NoSSR } from "@/components/NoSSR"
import { getLocale } from "next-intl/server"
import OrderDetail from "@/components/OrderDetail"

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
  const locale = await getLocale()

  const [t, data, params] = await Promise.all([
    getTranslations("orders"),
    getDashboardData(locale),
    searchParams,
    queryClient.prefetchQuery({
      queryKey: ["dashboard-data"],
      queryFn: () => getDashboardData(locale),
    }),
  ])

  const { orderKpis, carts, stats } = data

  const selectedCartId = params?.cartId
  const selectedCart =
    carts.find((c) => c.id.toString() === selectedCartId) || carts[0]

  const financeData = [
    { name: t("netSales"), value: data.stats.totalSales },
    { name: t("discounts"), value: data.stats.totalDiscounts },
  ]

  return (
    <div className="max-w-7xl space-y-3 md:space-y-4 mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
        <StatCard
          title="totalOrders"
          value={orderKpis.totalOrders.value}
          change={orderKpis.totalOrders.trend.change}
          changeType={orderKpis.totalOrders.trend.changeType}
          icon={Handbag}
          type="number"
          since="since"
          trend={orderKpis.totalOrders.trend.trend}
          intl="orders.statsOrders"
        />
        <StatCard
          title="totalProducts"
          value={orderKpis.totalProducts.value}
          change={orderKpis.totalProducts.trend.change}
          changeType={orderKpis.totalProducts.trend.changeType}
          icon={Package}
          type="number"
          since="since"
          trend={orderKpis.totalProducts.trend.trend}
          intl="orders.statsOrders"
        />
        <StatCard
          title="avgValue"
          value={orderKpis.avgValue.value}
          change={orderKpis.avgValue.trend.change}
          changeType={orderKpis.avgValue.trend.changeType}
          icon={Receipt}
          type="currency"
          since="since"
          trend={orderKpis.avgValue.trend.trend}
          intl="orders.statsOrders"
        />
        <StatCard
          title="usersWithOrders"
          value={orderKpis.usersWithOrders.value}
          change={orderKpis.usersWithOrders.trend.change}
          changeType={orderKpis.usersWithOrders.trend.changeType}
          icon={FileUser}
          type="number"
          since="since"
          trend={orderKpis.usersWithOrders.trend.trend}
          intl="orders.statsOrders"
        />
      </div>
      <div>
        <OrdersList categories={stats.allStatus} orders={carts} />
      </div>
      <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <NoSSR>
            <LazyPieChartCustom
              data={financeData}
              title={t("titleChart")}
              subtitle={t("subtitleChart")}
              textCenter={t("textCenter")}
              className="h-full"
            />
          </NoSSR>
        </div>
        <div className="col-span-2 flex ">
          <OrderDetail cart={selectedCart} />
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
