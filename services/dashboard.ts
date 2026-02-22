import { api } from "@/lib/api-client"
import {
  Cart,
  CartsResponse,
  UsersResponse,
  ProductsResponse,
  DashboardData,
  CartProduct,
} from "@/types/dashboard"

export async function getDashboardData(): Promise<DashboardData> {
  const [cartsRes, usersRes, productsRes] = await Promise.all([
    api.get<CartsResponse>("/carts"),
    api.get<UsersResponse>("/users?limit=1"),
    api.get<ProductsResponse>(
      "/products?limit=10&sortBy=discountPercentage&order=desc",
    ),
  ])

  const carts = cartsRes.data.carts
  const totalSales = carts.reduce((acc: number, c: Cart) => acc + c.total, 0)

  return {
    stats: {
      totalSales,
      totalUsers: usersRes.data.total,
      totalOrders: cartsRes.data.total,
      avgValue: totalSales / cartsRes.data.total,
    },
    carts, // Para el gráfico y la tabla
    discounts: productsRes.data.products, // Para DiscountsCard
  }
}

export const transformCartData = (
  carts: Cart[],
  t: (key: string) => string,
) => {
  const months = [
    t("month.jan"),
    t("month.feb"),
    t("month.mar"),
    t("month.apr"),
    t("month.may"),
    t("month.jun"),
    t("month.jul"),
    t("month.aug"),
    t("month.sep"),
    t("month.oct"),
    t("month.nov"),
    t("month.dec"),
  ]
  const groupedData = []

  // Recorremos los meses
  for (let i = 0; i < months.length; i++) {
    // Calculamos el índice inicial para este mes (0, 2, 4...)
    const startIndex = i * 2

    // Si ya no hay más carritos, dejamos de procesar
    if (startIndex >= carts.length) break

    // Tomamos los 2 carritos correspondientes a este mes
    // (o los que queden si es el último grupo, como los 5 finales)
    const isLastMonthWithData = startIndex + 2 >= carts.length
    const currentCarts = isLastMonthWithData
      ? carts.slice(startIndex) // Toma todos los sobrantes (de 24 a 29)
      : carts.slice(startIndex, startIndex + 2)

    // Sumamos los valores de los carritos del mes
    const monthStats = currentCarts.reduce(
      (acc, cart) => ({
        revenue: acc.revenue + cart.total,
        orders: acc.orders + cart.totalQuantity,
      }),
      { revenue: 0, orders: 0 },
    )

    groupedData.push({
      month: months[i],
      ...monthStats,
    })
  }

  return groupedData
}

export const getTopSellingProducts = (carts: Cart[]) => {
  const productMap: Record<
    number,
    { name: string; sales: number; totalRevenue: number }
  > = {}

  // Recorremos todos los carritos y sus productos
  carts.forEach((cart) => {
    cart.products.forEach((product: CartProduct) => {
      if (!productMap[product.id]) {
        productMap[product.id] = {
          name: product.title,
          sales: 0,
          totalRevenue: 0,
        }
      }
      productMap[product.id].sales += product.quantity
      productMap[product.id].totalRevenue += product.total
    })
  })

  // Convertimos a array, ordenamos por ventas y tomamos los top 5
  return Object.values(productMap)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      sales: p.sales,
      revenue: `$${p.totalRevenue.toFixed(2)}`,
      // Como la API no da tendencia, simulamos una basada en el ID (par/impar)
      trend:
        p.sales % 2 === 0
          ? `+${(p.sales % 15) + 2}%`
          : `-${(p.sales % 5) + 1}%`,
    }))
}
