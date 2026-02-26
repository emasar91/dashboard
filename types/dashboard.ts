export interface Cart {
  id: number
  products: CartProduct[]
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  totalQuantity: number
  customerName: string
  status: string
  customerEmail: string
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
  image: string
  email: string
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
  totalSales: number
  totalUsers: number
  totalOrders: number
  avgCartValue: number
  carts: Cart[]
  users: User[]
  discounts: Product[]
  allProducts: Product[]
  allCategories: string[]
  lowStockProducts: Product[]
  usersWithOrders: number
  productsSold: number
  totalDiscounts: number
  allStatus: string[]
}

export interface Activity {
  icon: string
  iconBg: string
  iconColor: string
  text: string
  time: string
}
