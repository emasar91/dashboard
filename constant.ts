import { cn } from "./lib/utils"

export const statusStyles: Record<string, string> = {
  delivered: "bg-emerald-500/10 text-emerald-500",
  shipped: "bg-blue-500/10 text-blue-500",
  processing: "bg-amber-500/10 text-amber-500",
  cancelled: "bg-rose-500/10 text-rose-500",

  entregado: "bg-emerald-500/10 text-emerald-500",
  enviado: "bg-blue-500/10 text-blue-500",
  procesando: "bg-amber-500/10 text-amber-500",
  cancelado: "bg-rose-500/10 text-rose-500",
}

export const buttonStyles =
  "cursor-pointer dark:hover:bg-gray-800! dark:hover:text-white! hover:bg-gray-200! hover:text-black!"

export const itemsSelectStyles = (active: boolean) =>
  cn(
    "hover:bg-gray-100! text-black! dark:hover:bg-gray-800! dark:text-white! cursor-pointer",
    active && "bg-gray-100! dark:bg-gray-800! text-primary! dark:text-primary!",
  )

export const categoriesEs: Record<string, string> = {
  beauty: "belleza",
  fragrances: "fragancias",
  furniture: "muebles",
  groceries: "comestibles",
  "home-decoration": "decoración-del-hogar",
  "kitchen-accessories": "accesorios-de-cocina",
  laptops: "laptops",
  "mens-shirts": "camisas-de-hombre",
  "mens-shoes": "zapatos-de-hombre",
  "womens-watches": "relojes-de-mujer",
  "mobile-accessories": "accesorios-móviles",
  motorcycle: "motocicletas",
  "skin-care": "cuidado-de-la-piel",
  smartphones: "smartphones",
  "sports-accessories": "accesorios-deportivos",
  sunglasses: "gafas-de-sol",
  tablets: "tablets",
  tops: "tops",
  vehicle: "vehículos",
  "womens-bags": "bolsos-de-mujer",
  "womens-dresses": "vestidos-de-mujer",
  "womens-jewellery": "joyería-de-mujer",
  "womens-shoes": "zapatos-de-mujer",
  "mens-watches": "relojes-de-hombre",
}

export const statusEs: string[] = [
  "Enviado",
  "Procesando",
  "Cancelado",
  "Entregado",
]

export const monthsEs = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
]

export const monthsEn = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
