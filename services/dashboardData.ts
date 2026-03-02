import { AxiosResponse } from "axios"
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
  Product,
  TrendData,
  CategoryDetail,
} from "@/types/dashboard"
import { categoriesEs, monthsEn, monthsEs, statusEs } from "@/constant"

export async function getDashboardData(
  locale?: string,
  t?: (key: string, values?: Record<string, string | number>) => string,
): Promise<DashboardData> {
  const [cartsRes, usersRes, discountProductsRes, allProductsRes] =
    await Promise.all([
      api.get<CartsResponse>("/carts"),
      // Pedimos los usuarios necesarios para el cruce de datos
      api.get<UsersResponse>("/users?limit=0"),
      // Top descuentos para la sección de "Top Deals"
      api.get<ProductsResponse>(
        "/products?limit=10&sortBy=discountPercentage&order=desc",
      ),
      // Todos los productos para el lookup de categorías y stock
      api.get<ProductsResponse>("/products?limit=0"),
    ])

  const allProducts = allProductsRes.data.products.map((p) => {
    return {
      ...p,
      category: locale === "es" ? categoriesEs[p.category] : p.category,
    }
  })
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
    status:
      locale === "es"
        ? statusEs[cart.id % 4]
        : ["Shipped", "Processing", "Cancelled", "Delivered"][cart.id % 4],
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

  const usersWithOrders = new Set(carts.map((cart) => cart.userId)).size

  const allCategories = [...new Set(allProducts.map((p) => p.category))]

  const categoryStats = allCategories.map((cat) => {
    const productsInCat = allProducts.filter((p) => p.category === cat)
    const avgDiscount =
      productsInCat.reduce((acc, p) => acc + p.discountPercentage, 0) /
      productsInCat.length

    return {
      name: cat,
      count: productsInCat.length,
      avgDiscount: Math.round(avgDiscount),
      featuredImage: productsInCat[0]?.thumbnail, // Usamos el primer producto como portada
    }
  })

  return {
    carts: cartsWithData,
    users: usersRes.data.users,
    allProducts,
    allCategories,
    stats: {
      categoryStats,
      totalSales,
      productsSold: carts.reduce(
        (acc: number, c: Cart) => acc + c.totalQuantity,
        0,
      ),
      totalDiscounts: totalDiscountCash,
      usersWithOrders,
      allStatus,
    },
    topSellingProducts: getTopSellingProducts(cartsWithData),

    categoryKpis: getCategoryKpis(allProducts),
    productKpis: getProductKpis(allProducts, allCategories),
    dashboardKpis: getDashboardKpis(usersRes, cartsRes, totalSales),
    orderKpis: getOrdersKpis(carts, usersWithOrders),
    customerKpis: getCustomerKpis(carts, usersRes),
    discountKpis: getDiscountKpis(allProducts),
    revenueByMonthChart: getRevenueByMonthChartData(cartsWithData, locale),
    categoriesAreaChart: getCategoryChartData(cartsWithData),
    categoriesPieChart: getCategoryPieData(cartsWithData),
    recentActivity: getRecentActivity(cartsWithData, usersRes.data.users, t),
    discountsData: discountProductsRes.data.products,
    recentsOrders: cartsWithData.slice(0, 15),
    categoryDetails: getCategoryDetails(
      allProducts,
      allCategories,
      cartsWithData,
    ),
  }
}

const getRevenueByMonthChartData = (
  carts: Cart[],
  locale: string | undefined,
) => {
  const months = locale === "es" ? monthsEs : monthsEn
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

const getTopSellingProducts = (carts: Cart[]) => {
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
    .slice(0, 7)
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

const getRecentActivity = (
  carts: Cart[],
  users: User[],
  t?: (key: string, values?: Record<string, string | number>) => string,
) => {
  const activities: Activity[] = []

  // 1. Agregamos actividades de "Pagos Recibidos" usando los carritos
  carts.slice(0, 3).forEach((cart, i) => {
    activities.push({
      icon: "CreditCard",
      text: t
        ? t("paymentReceived", {
            name: cart.customerName,
            amount: `$${cart.total}`,
          })
        : `Payment received from ${cart.customerName}: $${cart.total}`,
      time: `${i * 15 + 2} min ago`,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    })
  })

  // 2. Agregamos "Nuevos Usuarios" usando la lista de usuarios
  users.slice(5, 7).forEach((user, i) => {
    activities.push({
      icon: "UserPlus",
      text: t
        ? t("newCustomer", {
            name: `${user.firstName} ${user.lastName}`,
          })
        : `New customer: ${user.firstName} ${user.lastName}`,
      time: `${(i + 1) * 45} min ago`,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    })
  })

  // 3. Agregamos "Pedidos Enviados"
  carts.slice(3, 5).forEach((cart, i) => {
    activities.push({
      icon: "Package",
      text: t
        ? t("orderShipped", {
            name: cart.customerName,
            amount: `$${cart.total}`,
          })
        : `Order shipped for ${cart.customerName}: $${cart.total}`,
      time: `${i + 2} hr ago`,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
    })
  })

  return activities.sort((a, b) => a.time.localeCompare(b.time)) // Un sort simple
}

const getDashboardKpis = (
  usersRes: AxiosResponse<UsersResponse>,
  cartsRes: AxiosResponse<CartsResponse>,
  totalSales: number,
) => {
  return {
    totalSales: {
      value: totalSales,
      trend: calculateTrend(totalSales, "totalSales"),
    },
    totalUsers: {
      value: usersRes.data.total,
      trend: calculateTrend(usersRes.data.total, "totalUsers"),
    },
    totalOrders: {
      value: cartsRes.data.total,
      trend: calculateTrend(cartsRes.data.total, "totalOrders"),
    },
    avgCartValue: {
      value: totalSales / cartsRes.data.total,
      trend: calculateTrend(totalSales / cartsRes.data.total, "avgCartValue"),
    },
  }
}

const getCategoryKpis = (allProducts: Product[]) => {
  const categoryStats: Record<string, { count: number; stock: number }> = {}
  let totalDiscountSum = 0

  allProducts.forEach((p) => {
    const categoryName = p.category
    // 1. Agrupar por categoría para encontrar stock
    if (!categoryStats[categoryName]) {
      categoryStats[categoryName] = { count: 0, stock: 0 }
    }
    categoryStats[categoryName].count++
    categoryStats[categoryName].stock += p.stock

    // 2. Sumar descuentos para el promedio general
    totalDiscountSum += p.discountPercentage
  })

  const categoriesArray = Object.entries(categoryStats)

  // Encontrar categoría con más stock (High)
  const highStock = categoriesArray.reduce((prev, curr) =>
    curr[1].stock > prev[1].stock ? curr : prev,
  )

  // Encontrar categoría con menos stock (Low)
  const lowStock = categoriesArray.reduce((prev, curr) =>
    curr[1].stock < prev[1].stock ? curr : prev,
  )

  return {
    totalCategories: {
      value: categoriesArray.length,
      trend: calculateTrend(categoriesArray.length, "totalCategories"),
    },
    averageDiscount: {
      value: totalDiscountSum / allProducts.length,
      trend: calculateTrend(
        totalDiscountSum / allProducts.length,
        "averageDiscount",
      ),
    },
    highStock: {
      name: highStock[0],
      total: highStock[1].stock,
      trend: calculateTrend(highStock[1].stock, "highStock"),
    },
    lowStock: {
      name: lowStock[0],
      total: lowStock[1].stock,
      trend: calculateTrend(lowStock[1].stock, "lowStock"),
    },
  }
}

const getProductKpis = (allProducts: Product[], allCategories: string[]) => {
  return {
    totalProducts: {
      value: allProducts.length,
      trend: calculateTrend(allProducts.length, "totalProducts"),
    },
    lowStock: {
      value: allProducts.filter((p) => p.stock < 10).length,
      trend: calculateTrend(
        allProducts.filter((p) => p.stock < 10).length,
        "lowStock",
      ),
    },
    totalCategories: {
      value: allCategories.length,
      trend: calculateTrend(allCategories.length, "totalCategories"),
    },
  }
}

const getOrdersKpis = (carts: Cart[], usersWithOrders: number) => {
  return {
    totalOrders: {
      value: carts.length,
      trend: calculateTrend(carts.length, "totalOrders"),
    },
    totalProducts: {
      value: carts.reduce((acc: number, c: Cart) => acc + c.totalQuantity, 0),
      trend: calculateTrend(
        carts.reduce((acc: number, c: Cart) => acc + c.totalQuantity, 0),
        "totalProducts",
      ),
    },
    avgValue: {
      value: carts.reduce((acc, cart) => acc + cart.total, 0) / carts.length,
      trend: calculateTrend(
        carts.reduce((acc, cart) => acc + cart.total, 0) / carts.length,
        "avgValue",
      ),
    },
    usersWithOrders: {
      value: usersWithOrders,
      trend: calculateTrend(usersWithOrders, "usersWithOrders"),
    },
  }
}

const getCustomerKpis = (
  carts: Cart[],
  usersRes: AxiosResponse<UsersResponse>,
) => {
  return {
    totalUsers: {
      value: usersRes.data.total,
      trend: calculateTrend(usersRes.data.total, "totalUsers"),
    },
    usersActive: {
      value: carts.length,
      trend: calculateTrend(carts.length, "usersActive"),
    },
    newCustomers: {
      value: usersRes.data.total / 4,
      trend: calculateTrend(usersRes.data.total / 4, "newCustomers"),
    },
  }
}

const getDiscountKpis = (allProducts: Product[]) => {
  const stats = allProducts.reduce(
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
  const totalProducts = allProducts.length
  const averageDiscount =
    totalProducts > 0 ? stats.totalPercentageSum / totalProducts : 0

  return {
    productsWithDiscount: {
      value: stats.productsWithDiscount,
      trend: calculateTrend(stats.productsWithDiscount, "productsWithDiscount"),
    },
    averageDiscount: {
      value: averageDiscount,
      trend: calculateTrend(averageDiscount, "averageDiscount"),
    },
    maxDiscount: {
      value: stats.maxDiscount,
      trend: calculateTrend(stats.maxDiscount, "maxDiscount"),
    },
    totalSavingsAmount: {
      value: stats.totalSavingsAmount,
      trend: calculateTrend(stats.totalSavingsAmount, "totalSavingsAmount"),
    },
  }
}

const getCategoryChartData = (carts: Cart[]) => {
  const categoryMap: Record<
    string,
    { name: string; revenue: number; orders: number }
  > = {}

  carts.forEach((cart) => {
    cart.products.forEach((product) => {
      const catName = product.category

      if (!categoryMap[catName]) {
        categoryMap[catName] = {
          name: catName,
          revenue: 0,
          orders: 0,
        }
      }

      // Sumamos el total de dinero y la cantidad de unidades vendidas
      categoryMap[catName].revenue += product.total
      categoryMap[catName].orders += product.quantity
    })
  })

  // Convertimos el mapa a un array y lo ordenamos por ingresos (revenue) de mayor a menor
  // Opcional: .slice(0, 8) para no saturar el gráfico si hay demasiadas categorías
  return Object.values(categoryMap)
    .sort((a, b) => b.revenue - a.revenue)
    .map((cat) => ({
      ...cat,
      // Redondeamos el revenue para evitar decimales infinitos en el gráfico
      revenue: Number(cat.revenue.toFixed(2)),
    }))
}

export const getCategoryPieData = (carts: Cart[]) => {
  const categoryMap: Record<
    string,
    { name: string; revenue: number; orders: number }
  > = {}

  carts.forEach((cart) => {
    cart.products.forEach((product) => {
      const catName = product.category

      if (!categoryMap[catName]) {
        categoryMap[catName] = {
          name: catName,
          revenue: 0,
          orders: 0,
        }
      }

      // Sumamos el total de dinero y la cantidad de unidades vendidas
      categoryMap[catName].revenue += product.total
      categoryMap[catName].orders += product.quantity
    })
  })

  // Convertimos el mapa a un array y lo ordenamos por ingresos (revenue) de mayor a menor
  // Opcional: .slice(0, 8) para no saturar el gráfico si hay demasiadas categorías
  return Object.values(categoryMap)
    .sort((a, b) => b.revenue - a.revenue)
    .map((cat) => ({
      name: cat.name.replaceAll("-", " "),
      // Redondeamos el revenue para evitar decimales infinitos en el gráfico
      value: Number(cat.revenue.toFixed(2)),
    }))
}

const calculateTrend = (current: number, seed: string): TrendData => {
  // 1. Creamos una variación basada en la longitud del nombre o un código
  // Esto genera un "ruido" entre 0.05 y 0.20 (5% y 20%)
  const noise = (seed.length % 10) / 50 + 0.05

  // 2. Determinamos si es positivo o negativo según la primera letra
  const isPositive = seed.charCodeAt(0) % 2 === 0

  const factor = isPositive ? 1 - noise : 1 + noise
  const prevValue = current * factor

  const diff = current - prevValue
  const percentageValue = Math.abs((diff / prevValue) * 100)

  return {
    change: `${isPositive ? "+" : "-"}${percentageValue.toFixed(1)}%`,
    changeType: isPositive ? "positive" : "negative",
    trend: isPositive ? "up" : "down",
  }
}

const getCategoryDetails = (
  allProducts: Product[],
  allCategories: string[],
  cartsWithData: Cart[],
) => {
  const categoryDetails = allCategories.reduce(
    (acc, catName) => {
      // 1. Filtrar productos de esta categoría
      const productsInCategory = allProducts.filter(
        (p) => p.category === catName,
      )

      // 2. Calcular stock total y valor del inventario
      const totalStock = productsInCategory.reduce((sum, p) => sum + p.stock, 0)
      const inventoryValue = productsInCategory.reduce(
        (sum, p) => sum + p.price * p.stock,
        0,
      )

      // 3. Ventas de la categoría (recorriendo los carritos enriquecidos)
      let categoryRevenue = 0
      let itemsSold = 0

      cartsWithData.forEach((cart) => {
        cart.products.forEach((p) => {
          if (p.category === catName) {
            categoryRevenue += p.total
            itemsSold += p.quantity
          }
        })
      })

      acc[catName] = {
        name: catName,
        stats: {
          revenue: categoryRevenue,
          itemsSold,
          totalStock,
          inventoryValue,
          avgPrice: (inventoryValue / (totalStock || 1)).toFixed(2),
        },
        topProducts: productsInCategory
          .sort((a, b) => b.rating - a.rating) // O por ventas si tuvieras el dato
          .slice(0, 5),
        lowStockAlerts: productsInCategory.filter((p) => p.stock < 10),
      }

      return acc
    },
    {} as Record<string, CategoryDetail>,
  )

  return categoryDetails
}
