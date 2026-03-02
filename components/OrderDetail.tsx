"use client"
import { formatCurrency } from "@/lib/formatCurrency"
import { Cart, CartProduct } from "@/types/dashboard"
import { Handbag } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { statusStyles } from "@/constant"
import { Column, TableCustom } from "./Table"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { truncateText } from "@/lib/truncateText"

interface OrderDetailProps {
  cart: Cart | null
}

const OrderDetail = ({ cart }: OrderDetailProps) => {
  const t = useTranslations("products")
  const t2 = useTranslations("orders")
  const locale = useLocale()

  const productColumns: Column<CartProduct>[] = [
    {
      accessorKey: "thumbnail",
      header: t("table.image"),
      align: "text-center",
      width: "w-[82px]",
      cell: (item: CartProduct) => (
        <div className="flex items-center justify-center">
          <Image
            src={item.thumbnail}
            alt={item.title}
            width={50}
            height={50}
            className="h-12 w-12 rounded-lg object-cover bg-muted"
          />
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: t("table.name"),
      align: "text-center",
      width: "w-[80px]",
      cell: (item: CartProduct) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="capitalize max-w-[200px]!">
              {truncateText(item.title, 10)}
            </span>
          </TooltipTrigger>
          {item.title.length > 10 && (
            <TooltipContent side="right">
              <p>{item.title}</p>
            </TooltipContent>
          )}
        </Tooltip>
      ),
    },
    {
      accessorKey: "category",
      header: t("table.category"),
      align: "text-center",
      width: "w-[120px]",
      cell: (item: CartProduct) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="capitalize max-w-[200px]!">
              {truncateText(item.category.replaceAll("-", " "), 10)}
            </span>
          </TooltipTrigger>
          {item.category.length > 10 && (
            <TooltipContent side="right">
              <p>{item.category.replaceAll("-", " ")}</p>
            </TooltipContent>
          )}
        </Tooltip>
      ),
    },
    {
      accessorKey: "price",
      header: t("table.price"),
      align: "text-center",
      width: "w-[90px]",
      cell: (item: CartProduct) => (
        <span>{formatCurrency(item.price, locale)}</span>
      ),
    },
    {
      accessorKey: "quantity",
      header: t("table.quantity"),
      align: "text-center",
      width: "w-[80px]",
      cell: (item: CartProduct) => <span>{item.quantity}</span>,
    },
  ]

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 lg:p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 w-full">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xl font-medium tracking-wide text-muted-foreground">
            {t2("idOrder")} #{cart?.id}
          </p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground lg:text-3xl">
            {t2("total")}: {formatCurrency(cart?.total, locale)}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary lg:h-10 lg:w-10">
          <Handbag className="h-4 w-4 lg:h-5 lg:w-5" />
        </div>
      </div>
      <span
        className={`inline-flex rounded-full px-2 py-0.5 text-xs capitalize font-medium ${statusStyles[cart?.status.toLowerCase() as keyof typeof statusStyles]}`}
      >
        {cart?.status}
      </span>
      <p className="text-xl font-medium tracking-wide text-muted-foreground mt-2">
        {t2("itemsList")}
      </p>
      <div className="h-[300px] overflow-y-auto">
        <TableCustom
          data={cart?.products || []}
          columns={productColumns}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default OrderDetail
