import ProductList from "@/components/ProductList"
import { StatCard } from "@/components/StateCard"
import { getDashboardData } from "@/services/dashboardData"
import { QueryClient } from "@tanstack/react-query"
import { Box, Shapes, TriangleAlert } from "lucide-react"

async function page() {
  const queryClient = new QueryClient()

  // Hacemos prefetch para que React Query ya tenga los datos al renderizar
  await queryClient.prefetchQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  })

  const data = await getDashboardData()

  return (
    <div className="max-w-7xl space-y-3 md:space-y-4 mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-3 ">
        <StatCard
          title="totalProducts"
          value={data.allProducts.length}
          change="+14.2%"
          changeType="positive"
          icon={Box}
          type="number"
          since="since"
          trend="up"
          intl="statsProducts"
        />
        <StatCard
          title="lowStock"
          value={data.lowStockProducts.length}
          change="+7.8%"
          changeType="positive"
          icon={TriangleAlert}
          type="number"
          since="since"
          trend="up"
          intl="statsProducts"
        />
        <StatCard
          title="totalCategories"
          value={data.allCategories.length}
          change="+22.1%"
          changeType="positive"
          icon={Shapes}
          type="number"
          since="since"
          trend="up"
          intl="statsProducts"
        />
      </div>
      <div>
        <ProductList
          categories={data.allCategories}
          products={data.allProducts}
        />
      </div>
    </div>
  )
}

export default page
