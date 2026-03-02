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
  maidenName?: string // Opcional porque no todos lo tienen
  age: number
  gender: "male" | "female" | "other"
  email: string
  phone: string
  username: string
  password?: string
  birthDate: string
  image: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: Hair
  ip: string
  address: Address
  macAddress: string
  university: string
  bank: Bank
  company: Company
  ein: string
  ssn: string
  userAgent: string
  crypto: Crypto
  role: "admin" | "moderator" | "user"
}

export interface Hair {
  color: string
  type: string
}

export interface Address {
  address: string
  city: string
  state: string
  stateCode: string
  postalCode: string
  coordinates: Coordinates
  country: string
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface Bank {
  cardExpire: string
  cardNumber: string
  cardType: string
  currency: string
  iban: string
}

export interface Company {
  department: string
  name: string
  title: string
  address: Address // Reutiliza la interfaz Address
}

export interface Crypto {
  coin: string
  wallet: string
  network: string
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
  discountedPrice: number
  minimumOrderQuantity: number
  dimensions: Dimensions
  weight: number
  shippingInformation: string
  returnPolicy: string
  warrantyInformation: string
}

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface DashboardData {
  carts: Cart[]
  users: User[]
  allProducts: Product[]
  allCategories: string[]
  stats: Stats
  dashboardKpis: DashboardKpis
  categoryKpis: CategoryKpis
  productKpis: ProductKpis
  orderKpis: OrderKpis
  customerKpis: CustomerKpis
  discountKpis: DiscountKpis
  categoriesAreaChart: CategoriesAreaChart[]
  revenueByMonthChart: RevenueByMonthChart[]
  topSellingProducts: TopSellingProduct[]
  categoriesPieChart: CategoriesPieChart[]
  recentActivity: Activity[]
  discountsData: Product[]
  recentsOrders: Cart[]
  categoryDetails: Record<string, CategoryDetail>
}

export interface CategoriesPieChart {
  name: string
  value: number
}

export interface TopSellingProduct {
  name: string
  sales: number
  revenue: string
  trend: string
}

export interface RevenueByMonthChart {
  month: string
  revenue: number
  orders: number
}

export interface CategoriesAreaChart {
  name: string
  revenue: number
  orders: number
}

export interface DiscountKpis {
  productsWithDiscount: { value: number; trend: TrendData }
  averageDiscount: { value: number; trend: TrendData }
  maxDiscount: { value: number; trend: TrendData }
  totalSavingsAmount: { value: number; trend: TrendData }
}

export interface CustomerKpis {
  totalUsers: { value: number; trend: TrendData }
  usersActive: { value: number; trend: TrendData }
  newCustomers: { value: number; trend: TrendData }
}

export interface OrderKpis {
  totalOrders: { value: number; trend: TrendData }
  totalProducts: { value: number; trend: TrendData }
  avgValue: { value: number; trend: TrendData }
  usersWithOrders: { value: number; trend: TrendData }
}

export interface CategoryStat {
  name: string
  count: number
  avgDiscount: number
  featuredImage: string
}

export interface Stats {
  categoryStats: CategoryStat[]
  totalSales: number
  productsSold: number
  totalDiscounts: number
  usersWithOrders: number
  allStatus: string[]
}

export interface DashboardKpis {
  totalSales: { value: number; trend: TrendData }
  totalUsers: { value: number; trend: TrendData }
  totalOrders: { value: number; trend: TrendData }
  avgCartValue: { value: number; trend: TrendData }
}

export interface CategoryKpis {
  totalCategories: { value: number; trend: TrendData }
  averageDiscount: { value: number; trend: TrendData }
  highStock: {
    name: string
    total: number
    trend: TrendData
  }
  lowStock: {
    name: string
    total: number
    trend: TrendData
  }
}

export interface ProductKpis {
  totalProducts: { value: number; trend: TrendData }
  lowStock: { value: number; trend: TrendData }
  totalCategories: { value: number; trend: TrendData }
}

export interface Activity {
  icon: string
  iconBg: string
  iconColor: string
  text: string
  time: string
}

export interface TrendData {
  change: string
  changeType: "positive" | "negative"
  trend: "up" | "down"
}

export interface CategoryDetail {
  name: string
  stats: CategoryStats
  topProducts: Product[]
  lowStockAlerts: Product[]
}

export interface CategoryStats {
  revenue: number
  itemsSold: number
  totalStock: number
  inventoryValue: number
  avgPrice: string // Viene como string según tu JSON ("29.18")
}
