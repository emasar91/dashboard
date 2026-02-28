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
