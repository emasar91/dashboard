export interface Cart {
  id: number
  products: CartProduct[]
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  totalQuantity: number
  customerName: string
}

export interface CartProduct {
  id: number
  title: string
  price: number
  quantity: number
  total: number
  discountPercentage: number
  discountedPrice: number
  thumbnail: string
  category: string
}

export interface CartsResponse {
  carts: Cart[]
  total: number
  skip: number
  limit: number
}

export interface User {
  id: number
  firstName: string
  lastName: string
  // Add other fields as needed, though for dashboard we mainly use total
}

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  sku: string
  availabilityStatus: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface DashboardData {
  stats: {
    totalSales: number
    totalUsers: number
    totalOrders: number
    avgValue: number
  }
  carts: Cart[]
  users: User[]
  discounts: Product[]
  allProducts: Product[]
  allCategories: string[]
  lowStockProducts: Product[]
}

export interface Activity {
  icon: string
  iconBg: string
  iconColor: string
  text: string
  time: string
}
