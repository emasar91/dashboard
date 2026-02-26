"use client"

import { useEffect, useState } from "react"
import SearchBar from "@/components/SearchBar"
import { FilterButton } from "@/components/FilterButton"
import { useTranslations } from "next-intl"
import { TableCustom, Column } from "./Table"
import { Cart, CartProduct } from "@/types/dashboard"
import { formatCurrency } from "@/lib/formatCurrency"
import { useLocale } from "next-intl"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { truncateText } from "@/lib/truncateText"
import { useRouter } from "next/navigation"
import { statusStyles } from "@/constant"

export default function ProductListContainer({
  categories,
  orders,
}: {
  categories: string[]
  orders: Cart[]
}) {
  const t = useTranslations("orders")
  const locale = useLocale()
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOrders, setFilteredOrders] = useState(orders)
  const [currentPage, setCurrentPage] = useState(1)

  const router = useRouter()
  const selectCart = (id: number) => {
    router.push(`?cartId=${id}`, { scroll: false })
  }

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesCategory =
        selectedStatus === "all" ||
        order.status.toLowerCase() === selectedStatus.toLowerCase()

      const query = searchQuery.toLowerCase().trim()
      const matchesQuery =
        query === "" ||
        order.customerName.toLowerCase().includes(query) ||
        order.id.toString().includes(query)

      return matchesCategory && matchesQuery
    })
    //eslint-disable-next-line
    setFilteredOrders(filtered)
  }, [selectedStatus, searchQuery, orders])

  const productColumns: Column<Cart>[] = [
    {
      accessorKey: "id",
      header: t("table.id"),
      align: "text-center",
      width: "w-[40px]",
      cell: (item: Cart) => <span>{item.id}</span>,
    },
    {
      accessorKey: "userId",
      header: t("table.userId"),
      align: "text-center",
      width: "w-[82px]",
      cell: (item: Cart) => <span>{item.userId}</span>,
    },
    {
      accessorKey: "customerName",
      header: t("table.customerName"),
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
      accessorKey: "customerEmail",
      header: t("table.customerEmail"),
      align: "text-left",
      width: "w-[240px]",
      cell: (item: Cart) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="capitalize max-w-[200px]!">
              {truncateText(item.customerEmail, 30)}
            </span>
          </TooltipTrigger>
          {item.customerEmail.length > 30 && (
            <TooltipContent side="right">
              <p>{item.customerEmail}</p>
            </TooltipContent>
          )}
        </Tooltip>
      ),
    },
    {
      accessorKey: "items",
      header: t("table.items"),
      align: "text-left",
      width: "w-[300px]",
      cell: (item: Cart) => {
        const extraCount = item.products.length - 1
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className="cursor-pointer block truncate text-sm"
                onClick={() => selectCart(item.id)}
              >
                {item.products[0]?.title}, {item.products[1]?.title}
                {extraCount > 0 && (
                  <span className="text-blue-400 font-medium ml-1">
                    (+{extraCount})
                  </span>
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="flex flex-col gap-1">
                <p className="font-bold border-b border-slate-700 pb-1 mb-1 text-blue-400">
                  {t("itemsList")}
                </p>
                {item.products.map((p: CartProduct) => (
                  <div
                    key={p.id}
                    className="text-xs flex justify-between gap-4"
                  >
                    <span className="dark:text-black text-white">
                      • {p.title}
                    </span>
                    <span className="text-primary">x{p.quantity}</span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: "total",
      header: t("table.total"),
      align: "text-center",
      width: "w-[100px]",
      cell: (item: Cart) => <span>{formatCurrency(item.total, locale)}</span>,
    },
    {
      accessorKey: "status",
      header: t("table.status.title"),
      align: "text-center",
      width: "w-[85px]",
      cell: (item: Cart) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyles[item.status.toLowerCase() as keyof typeof statusStyles]}`}
        >
          {t(`table.status.${item.status.toLowerCase()}`)}
        </span>
      ),
    },
  ]

  return (
    <div>
      <div className="flex gap-4 items-end justify-between">
        <SearchBar
          placeholder={t("searchPlaceholder")}
          title={t("searchTitle")}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
        <FilterButton
          categories={categories}
          selectedCategory={selectedStatus}
          intlKey="orders.filter"
          onCategoryChange={(category) => {
            setSelectedStatus(category)
            setCurrentPage(1)
          }}
        />
      </div>
      <TableCustom
        data={filteredOrders}
        columns={productColumns}
        emptyMessage={t("emptyMessage")}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
