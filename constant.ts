import { cn } from "./lib/utils"

export const statusStyles: Record<string, string> = {
  delivered: "bg-emerald-500/10 text-emerald-500",
  shipped: "bg-blue-500/10 text-blue-500",
  processing: "bg-amber-500/10 text-amber-500",
  cancelled: "bg-rose-500/10 text-rose-500",
}

export const buttonStyles =
  "cursor-pointer dark:hover:bg-gray-800! dark:hover:text-white! hover:bg-gray-200! hover:text-black!"

export const itemsSelectStyles = (active: boolean) =>
  cn(
    "hover:bg-gray-100! text-black! dark:hover:bg-gray-800! dark:text-white! cursor-pointer",
    active && "bg-gray-100! dark:bg-gray-800! text-primary! dark:text-primary!",
  )
