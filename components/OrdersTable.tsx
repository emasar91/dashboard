"use client"

import { useQuery } from "@tanstack/react-query"
import { getDashboardData } from "@/services/dashboard"
import { formatCurrency } from "@/lib/formatCurrency"
import { useLocale, useTranslations } from "next-intl"

const statusOptions = ["Delivered", "Shipped", "Processing", "Cancelled"]

const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-500/10 text-emerald-500",
  Shipped: "bg-blue-500/10 text-blue-500",
  Processing: "bg-amber-500/10 text-amber-500",
  Cancelled: "bg-rose-500/10 text-rose-500",
}

export function OrdersTable() {
  const locale = useLocale()
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  })

  const t = useTranslations("ordersTable")
  const orders = dashboardData?.carts || []

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          {t("title")}
        </h3>
        <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex-1 overflow-auto -mx-4 lg:-mx-5">
        <table className="w-full min-w-[450px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-2  pb-2 text-[10px] font-medium uppercase text-muted-foreground">
                {t("orderId")}
              </th>
              <th className="pb-2 text-[10px] font-medium uppercase text-muted-foreground">
                {t("customer")}
              </th>
              <th className="pb-2 text-[10px] font-medium uppercase text-muted-foreground">
                {t("product")}
              </th>
              <th className="pb-2 text-right text-[10px] font-medium uppercase text-muted-foreground">
                {t("amount")}
              </th>
              <th className="px-3 pb-2 text-right text-[10px] font-medium uppercase text-muted-foreground">
                {t("status.title")}
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map((cart) => {
              // Simulamos un status basado en el ID para que sea consistente
              const status = statusOptions[cart.id % statusOptions.length]

              return (
                <tr
                  key={cart.id}
                  className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/30"
                >
                  <td className="px-2  py-2.5 text-xs font-mono font-medium text-card-foreground">
                    #{cart.id}
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground">
                    {cart.customerName}
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground truncate max-w-[150px]">
                    {cart.products[0]?.title}
                    {cart.products.length > 1 && (
                      <span className="text-[9px] ml-1">
                        (+{cart.products.length - 1})
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-right text-xs font-medium text-card-foreground">
                    {formatCurrency(cart.total, locale)}
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[status]}`}
                    >
                      {t(`status.${status.toLowerCase()}`)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
