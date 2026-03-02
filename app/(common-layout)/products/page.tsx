import ProductList from "@/components/ProductList"
import { StatCard } from "@/components/StateCard"
import { getDashboardData } from "@/services/dashboardData"
import { QueryClient } from "@tanstack/react-query"
import { Package, Shapes, TriangleAlert } from "lucide-react"
import { getLocale } from "next-intl/server"

async function ProductsPage() {
  const queryClient = new QueryClient()
  const locale = await getLocale()

  // Hacemos prefetch para que React Query ya tenga los datos al renderizar
  await queryClient.prefetchQuery({
    queryKey: ["dashboard-data", locale],
    queryFn: () => getDashboardData(locale),
  })

  const data = await getDashboardData(locale)
  const { productKpis, allCategories, allProducts } = data

  return (
    <div className="max-w-7xl space-y-3 md:space-y-4 mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-3 ">
        <StatCard
          title="totalProducts"
          value={productKpis.totalProducts.value}
          change={productKpis.totalProducts.trend.change}
          changeType={productKpis.totalProducts.trend.changeType}
          icon={Package}
          type="number"
          since="since"
          trend={productKpis.totalProducts.trend.trend}
          intl="statsProducts"
        />
        <StatCard
          title="lowStock"
          value={productKpis.lowStock.value}
          change={productKpis.lowStock.trend.change}
          changeType={productKpis.lowStock.trend.changeType}
          icon={TriangleAlert}
          type="number"
          since="since"
          trend={productKpis.lowStock.trend.trend}
          intl="statsProducts"
        />
        <StatCard
          title="totalCategories"
          value={productKpis.totalCategories.value}
          change={productKpis.totalCategories.trend.change}
          changeType={productKpis.totalCategories.trend.changeType}
          icon={Shapes}
          type="number"
          since="since"
          trend={productKpis.totalCategories.trend.trend}
          intl="statsProducts"
        />
      </div>
      <ProductList categories={allCategories} products={allProducts} />
    </div>
  )
}

export default ProductsPage
