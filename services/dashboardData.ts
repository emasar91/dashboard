import { api } from "@/lib/api-client"
import {
  Cart,
  CartsResponse,
  UsersResponse,
  ProductsResponse,
  DashboardData,
  CartProduct,
  User,
  Activity,
} from "@/types/dashboard"

export async function getDashboardData(): Promise<DashboardData> {
  const [cartsRes, usersRes, discountProductsRes, allProductsRes] =
    await Promise.all([
      api.get<CartsResponse>("/carts"),
      // Pedimos los usuarios necesarios para el cruce de datos
      api.get<UsersResponse>(
        "/users?limit=0&select=id,firstName,lastName,image,email",
      ),
      // Top descuentos para la sección de "Top Deals"
      api.get<ProductsResponse>(
        "/products?limit=10&sortBy=discountPercentage&order=desc",
      ),
      // Todos los productos para el lookup de categorías y stock
      api.get<ProductsResponse>("/products?limit=0"),
    ])

  const allProducts = allProductsRes.data.products
  const carts = cartsRes.data.carts

  // 1. Creación de Mapas (Lookups) para rendimiento O(1)
  const userLookup: Record<number, User> = {}
  usersRes.data.users.forEach((u) => {
    userLookup[u.id] = u
  })

  const categoryLookup: Record<number, string> = {}
  allProducts.forEach((p) => {
    categoryLookup[p.id] = p.category
  })

  // 2. Enriquecer los carritos (Cruce de datos Carts + Users + Categories)
  const cartsWithData = carts.map((cart) => ({
    ...cart,
    customerName: userLookup[cart.userId]
      ? `${userLookup[cart.userId].firstName} ${userLookup[cart.userId].lastName}`
      : `User #${cart.userId}`,
    customerImage: userLookup[cart.userId]?.image || "",
    customerEmail: userLookup[cart.userId]?.email || "",
    // Inyectamos la categoría a cada producto dentro del carrito
    products: cart.products.map((prod) => ({
      ...prod,
      category: categoryLookup[prod.id] || "Other",
    })),
    // Asignamos un estado aleatorio pero consistente basado en el ID
    status: ["Shipped", "Processing", "Cancelled", "Delivered"][cart.id % 4],
  }))

  // 3. Cálculos Financieros Corregidos
  // Total Sales: El dinero real que entró (valor con descuento)
  const totalSales = carts.reduce(
    (acc: number, c: Cart) => acc + c.discountedTotal,
    0,
  )

  // Total Gross: Lo que valían los productos originalmente
  const totalGross = carts.reduce((acc: number, c: Cart) => acc + c.total, 0)

  // Ahorro total (Dinero real de descuentos)
  const totalDiscountCash = totalGross - totalSales

  const allStatus = Array.from(
    new Set(
      cartsWithData.map((cart: Cart) => {
        return cart.status
      }),
    ),
  )

  return {
    totalSales,
    totalUsers: usersRes.data.total,
    totalOrders: cartsRes.data.total,
    avgCartValue: totalSales / cartsRes.data.total, // Ticket promedio real

    carts: cartsWithData,
    productsSold: carts.reduce(
      (acc: number, c: Cart) => acc + c.totalQuantity,
      0,
    ),
    totalDiscounts: totalDiscountCash,

    // Conteo real de clientes únicos con pedidos
    usersWithOrders: new Set(carts.map((cart) => cart.userId)).size,
    allStatus,
    users: usersRes.data.users,
    discounts: discountProductsRes.data.products,
    allProducts,
    allCategories: [...new Set(allProducts.map((p) => p.category))],
    lowStockProducts: allProducts.filter((p) => p.stock < 10),

    // Datos listos para la gráfica de distribución
    // categoryRevenue: categoryStats,
  }
}

export const transformCartData = (
  carts: Cart[],
  t: (key: string, values?: Record<string, string | number>) => string,
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

export const getCategoryData = (carts: Cart[]) => {
  const categoryMap: Record<string, number> = {}

  carts.forEach((cart) => {
    cart.products.forEach((product: CartProduct) => {
      const cat = product.category // Ahora sí existe
      categoryMap[cat] = (categoryMap[cat] || 0) + product.total
    })
  })

  return Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
}

export const getRecentActivity = (
  carts: Cart[],
  users: User[],
  t: (key: string, values?: Record<string, string | number>) => string,
) => {
  const activities: Activity[] = []

  // 1. Agregamos actividades de "Pagos Recibidos" usando los carritos
  carts.slice(0, 3).forEach((cart, i) => {
    activities.push({
      icon: "CreditCard",
      text: t("paymentReceived", {
        name: cart.customerName,
        amount: `$${cart.total}`,
      }),
      time: `${i * 15 + 2} min ago`,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    })
  })

  // 2. Agregamos "Nuevos Usuarios" usando la lista de usuarios
  users.slice(5, 7).forEach((user, i) => {
    activities.push({
      icon: "UserPlus",
      text: t("newCustomer", {
        name: `${user.firstName} ${user.lastName}`,
      }),
      time: `${(i + 1) * 45} min ago`,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    })
  })

  // 3. Agregamos "Pedidos Enviados"
  carts.slice(3, 5).forEach((cart, i) => {
    activities.push({
      icon: "Package",
      text: t("orderShipped", {
        name: cart.customerName,
        amount: `$${cart.total}`,
      }),
      time: `${i + 2} hr ago`,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
    })
  })

  return activities.sort((a, b) => a.time.localeCompare(b.time)) // Un sort simple
}
