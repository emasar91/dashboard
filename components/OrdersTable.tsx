"use client"

import { formatCurrency } from "@/lib/formatCurrency"
import { useLocale, useTranslations } from "next-intl"
import { Cart } from "@/types/dashboard"
import { Column, TableCustom } from "./Table"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { truncateText } from "@/lib/truncateText"
import { statusStyles } from "@/constant"

interface OrdersTableProps {
  data: Cart[]
}

export function OrdersTable({ data }: OrdersTableProps) {
  const t = useTranslations("ordersTable")
  const locale = useLocale()
  const orders = data

  const ordersColumns: Column<Cart>[] = [
    {
      accessorKey: "id",
      header: t("id"),
      align: "text-center",
      width: "w-[40px]",
      cell: (item: Cart) => <span>{item.id}</span>,
    },
    {
      accessorKey: "customerName",
      header: t("customerName"),
      align: "text-left",
      width: "w-[120px]",
      cell: (item: Cart) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="capitalize max-w-[200px]!">
              {truncateText(item.customerName, 30)}
            </span>
          </TooltipTrigger>
          {item.customerName.length > 30 && (
            <TooltipContent side="right">
              <p>{item.customerName}</p>
            </TooltipContent>
          )}
        </Tooltip>
      ),
    },
    {
      accessorKey: "products",
      header: t("products"),
      align: "text-left",
      width: "w-[240px]",
      cell: (item: Cart) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="capitalize max-w-[200px]!">
              {truncateText(item.products[0]?.title, 25)}
              {item.products.length > 1 && (
                <span className="text-[9px] ml-1">
                  (+{item.products.length - 1})
                </span>
              )}
            </span>
          </TooltipTrigger>
          {item.products.length > 1 && (
            <TooltipContent side="right" className="max-w-2xs">
              <p>{item.products.map((product) => product.title).join(", ")}</p>
            </TooltipContent>
          )}
        </Tooltip>
      ),
    },
    {
      accessorKey: "total",
      header: t("total"),
      align: "text-center",
      width: "w-[100px]",
      cell: (item: Cart) => <span>{formatCurrency(item.total, locale)}</span>,
    },
    {
      accessorKey: "status",
      header: t("status.title"),
      align: "text-center",
      width: "w-[85px]",
      cell: (item: Cart) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[item.status.toLowerCase() as keyof typeof statusStyles]}`}
        >
          {item.status}
        </span>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card ">
      <div className="p-4 lg:p-5">
        <h3 className="text-sm font-semibold text-card-foreground">
          {t("title")}
        </h3>
        <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
      </div>

      <TableCustom
        data={orders}
        columns={ordersColumns}
        emptyMessage={""}
        currentPage={1}
        onPageChange={() => {}}
        onRowClick={() => {}}
        pagination={false}
        initialPageSize={12}
      />
    </div>
  )
}
