import DiscountDetail from "@/components/DiscountDetail"
import DiscountList from "@/components/DiscountList"
import { NoSSR } from "@/components/NoSSR"
import { StatCard } from "@/components/StateCard"
import { getDashboardData } from "@/services/dashboardData"
import { QueryClient } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import {
  BanknoteX,
  CirclePercent,
  PackageCheck,
  PackageMinus,
} from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

const LazyPieChartCustom = dynamic(() =>
  import("@/components/PieChart").then((m) => m.PieChartCustom),
)

interface DiscountsPageProps {
  searchParams: Promise<{
    discountId?: string
  }>
}

async function DiscountsPage({ searchParams }: DiscountsPageProps) {
  const queryClient = new QueryClient()
  const t = await getTranslations("discounts")
  const locale = await getLocale()

  // Hacemos prefetch para que React Query ya tenga los datos al renderizar
  await queryClient.prefetchQuery({
    queryKey: ["dashboard-data"],
    queryFn: () => getDashboardData(locale),
  })

  const data = await getDashboardData(locale)
  const params = await searchParams

  const { discountKpis, allProducts, allCategories } = data

  const selectedDiscountId = params?.discountId
  const selectedDiscount =
    allProducts.find((c) => c.id.toString() === selectedDiscountId) ||
    allProducts[0] // Por defecto el primero o null

  const discountAmount =
    (selectedDiscount.price * selectedDiscount.discountPercentage) / 100
  const finalPrice = selectedDiscount.price - discountAmount

  const discountData = [
    {
      name: t("chart.finalPrice"), // Ej: "Precio Final"
      value: finalPrice,
    },
    {
      name: t("chart.discountAmount"), // Ej: "Ahorro"
      value: discountAmount,
    },
  ]

  return (
    <div className="max-w-7xl space-y-3 md:space-y-4 mx-auto">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
        <StatCard
          title="productsWithDiscount"
          value={discountKpis.productsWithDiscount.value}
          change={discountKpis.productsWithDiscount.trend.change}
          changeType={discountKpis.productsWithDiscount.trend.changeType}
          icon={PackageMinus}
          type="number"
          since="since"
          trend={discountKpis.productsWithDiscount.trend.trend}
          intl="discounts.statsDiscounts"
        />
        <StatCard
          title="averageDiscount"
          value={discountKpis.averageDiscount.value}
          change={discountKpis.averageDiscount.trend.change}
          changeType={discountKpis.averageDiscount.trend.changeType}
          icon={CirclePercent}
          type="percentage"
          since="since"
          trend={discountKpis.averageDiscount.trend.trend}
          intl="discounts.statsDiscounts"
        />
        <StatCard
          title="maxDiscount"
          value={discountKpis.maxDiscount.value}
          change={discountKpis.maxDiscount.trend.change}
          changeType={discountKpis.maxDiscount.trend.changeType}
          icon={PackageCheck}
          type="percentage"
          since="since"
          trend={discountKpis.maxDiscount.trend.trend}
          intl="discounts.statsDiscounts"
        />
        <StatCard
          title="totalSavingsAmount"
          value={discountKpis.totalSavingsAmount.value}
          change={discountKpis.totalSavingsAmount.trend.change}
          changeType={discountKpis.totalSavingsAmount.trend.changeType}
          icon={BanknoteX}
          type="currency"
          since="since"
          trend={discountKpis.totalSavingsAmount.trend.trend}
          intl="discounts.statsDiscounts"
        />
      </div>
      <div>
        <DiscountList products={allProducts} categories={allCategories} />
      </div>
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4  ">
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 w-full">
          <NoSSR>
            <LazyPieChartCustom
              data={discountData}
              title={t("chart.title")}
              subtitle={t("chart.subtitle")}
              className="h-full"
              textCenter={t("chart.textCenter")}
            />
          </NoSSR>
        </div>
        <div className="col-span-3 flex min-h-[440px]">
          <DiscountDetail product={selectedDiscount} />
        </div>
      </div>
    </div>
  )
}

export default DiscountsPage
