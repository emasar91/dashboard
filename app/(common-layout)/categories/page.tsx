import { StatCard } from "@/components/StateCard"
import { QueryClient } from "@tanstack/react-query"
import { getDashboardData } from "@/services/dashboardData"
import { AlertTriangle, Layers, Percent, TrendingUp } from "lucide-react"
import ListCategories from "@/components/ListCategories"
import { NoSSR } from "@/components/NoSSR"
import dynamic from "next/dynamic"
import { getLocale, getTranslations } from "next-intl/server"

const LazyChartOverTime = dynamic(() =>
  import("@/components/AreaChart").then((m) => m.AreaChartComponent),
)

async function CategoriesPage() {
  const locale = await getLocale()
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => getDashboardData(locale),
  })

  const data = await getDashboardData(locale)
  const { categoryKpis, stats, categoriesAreaChart, categoryDetails } = data
  const t = await getTranslations("categories.chart")

  return (
    <div className="max-w-7xl space-y-3 md:space-y-4 mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
        <StatCard
          title="totalCategories"
          value={categoryKpis.totalCategories.value}
          change={categoryKpis.totalCategories.trend.change}
          changeType={categoryKpis.totalCategories.trend.changeType}
          icon={Layers}
          type="number"
          since="since"
          trend={categoryKpis.totalCategories.trend.trend}
          intl="categories.statsCategories"
        />
        <StatCard
          title="categoryHighStock" // "Categoría Alta"
          value={categoryKpis.highStock.name} // "furniture" (ahora soporta string)
          type="string" // Nuevo tipo
          change={`${categoryKpis.highStock.total}`} // El número va aquí abajo
          changeType={categoryKpis.highStock.trend.changeType}
          trend={categoryKpis.highStock.trend.trend}
          icon={TrendingUp}
          since="currentInventory" // "Inventario actual"
          intl="categories.statsCategories"
        />
        <StatCard
          title="categoryLowStock" // "Categoría Alta"
          value={categoryKpis.lowStock.name} // "furniture" (ahora soporta string)
          type="string" // Nuevo tipo
          change={`${categoryKpis.lowStock.total}`} // El número va aquí abajo
          changeType={categoryKpis.lowStock.trend.changeType}
          trend={categoryKpis.lowStock.trend.trend}
          icon={AlertTriangle}
          since="currentInventory" // "Inventario actual"
          intl="categories.statsCategories"
        />
        <StatCard
          title="averageDiscount"
          value={categoryKpis.averageDiscount.value}
          change={categoryKpis.averageDiscount.trend.change}
          changeType={categoryKpis.averageDiscount.trend.changeType}
          icon={Percent}
          type="percentage"
          since="since"
          trend={categoryKpis.averageDiscount.trend.trend}
          intl="categories.statsCategories"
        />
      </div>
      <ListCategories
        categories={stats.categoryStats}
        categoryDetails={categoryDetails}
      />
      <div className="mt-8">
        <NoSSR>
          <LazyChartOverTime
            data={categoriesAreaChart}
            xKey="name"
            primaryKey="revenue"
            title={t("title")}
            subtitle={t("subtitle")}
            primaryLabel={t("primaryLabel")}
            intl="categories.chart"
          />
        </NoSSR>
      </div>
    </div>
  )
}

export default CategoriesPage
