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
import { getTranslations } from "next-intl/server"

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

  // Hacemos prefetch para que React Query ya tenga los datos al renderizar
  await queryClient.prefetchQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  })

  const data = await getDashboardData()
  const params = await searchParams

  const selectedDiscountId = params?.discountId
  const selectedDiscount =
    data.allProducts.find((c) => c.id.toString() === selectedDiscountId) ||
    data.allProducts[0] // Por defecto el primero o null

  const stats = data.allProducts.reduce(
    (acc, p) => {
      // 1. Cantidad de productos que tienen algún descuento
      const hasDiscount = p.discountPercentage > 0
      if (hasDiscount) {
        acc.productsWithDiscount += 1
      }

      // 2. Suma de porcentajes para el promedio
      acc.totalPercentageSum += p.discountPercentage

      // 3. Buscar el mayor descuento activo
      if (p.discountPercentage > acc.maxDiscount) {
        acc.maxDiscount = p.discountPercentage
      }

      // 4. Cantidad total de dinero descontado (Ahorro total)
      // Fórmula: (Precio * Porcentaje) / 100
      const amountSaved = (Number(p.price) * p.discountPercentage) / 100
      acc.totalSavingsAmount += amountSaved

      return acc
    },
    {
      productsWithDiscount: 0,
      totalPercentageSum: 0,
      maxDiscount: 0,
      totalSavingsAmount: 0,
    },
  )

  // Cálculos finales fuera del loop
  const totalProducts = data.allProducts.length
  const averageDiscount =
    totalProducts > 0 ? stats.totalPercentageSum / totalProducts : 0

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
          value={stats.productsWithDiscount}
          change="+7.8%"
          changeType="positive"
          icon={PackageMinus}
          type="number"
          since="since"
          trend="up"
          intl="discounts.statsDiscounts"
        />
        <StatCard
          title="averageDiscount"
          value={averageDiscount}
          change="+22.1%"
          changeType="positive"
          icon={CirclePercent}
          type="percentage"
          since="since"
          trend="up"
          intl="discounts.statsDiscounts"
        />
        <StatCard
          title="maxDiscount"
          value={stats.maxDiscount}
          change="+3.1%"
          changeType="negative"
          icon={PackageCheck}
          type="percentage"
          since="since"
          trend="down"
          intl="discounts.statsDiscounts"
        />
        <StatCard
          title="totalSavingsAmount"
          value={stats.totalSavingsAmount}
          change="+3.1%"
          changeType="negative"
          icon={BanknoteX}
          type="currency"
          since="since"
          trend="down"
          intl="discounts.statsDiscounts"
        />
      </div>
      <div>
        <DiscountList
          products={data.allProducts}
          categories={data.allCategories}
        />
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
