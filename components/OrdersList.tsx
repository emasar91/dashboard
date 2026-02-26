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

export default function OrdersList({
  categories,
  orders,
}: {
  categories: string[]
  orders: Cart[]
}) {
  const t = useTranslations("orders")
  const locale = useLocale()
  const router = useRouter()

  // 1. Estado de filtros múltiples (igual que en productos)
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    status: ["all"],
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOrders, setFilteredOrders] = useState(orders)
  const [currentPage, setCurrentPage] = useState(1)

  const selectCart = (id: number) => {
    router.push(`?cartId=${id}`, { scroll: false })
  }

  // 2. Definición del grupo para el FilterButton
  const filterGroups = [
    {
      label: t("filter.placeholder"),
      key: "status",
      options: categories,
    },
  ]

  // 3. Función para manejar el cambio de filtros (Toggle logic)
  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentGroup = prev[key] || []
      let newGroup: string[]

      if (value === "all") {
        newGroup = ["all"]
      } else {
        const cleanGroup = currentGroup.filter((v) => v !== "all")
        newGroup = cleanGroup.includes(value)
          ? cleanGroup.filter((v) => v !== value)
          : [...cleanGroup, value]

        if (newGroup.length === 0) newGroup = ["all"]
      }

      return { ...prev, [key]: newGroup }
    })
    setCurrentPage(1)
  }

  // 4. Función para limpiar filtros
  const handleClearFilters = () => {
    setSelectedFilters({ status: ["all"] })
    setCurrentPage(1)
  }

  // 5. useEffect de filtrado actualizado para multiselección
  useEffect(() => {
    const filtered = orders.filter((order) => {
      // Filtro por Status (soporta múltiples estados)
      const selectedStatus = selectedFilters.status
      const matchesStatus =
        selectedStatus.includes("all") ||
        selectedStatus.some(
          (s) => s.toLowerCase() === order.status.toLowerCase(),
        )

      // Filtro por Búsqueda (Nombre de cliente o ID de orden)
      const query = searchQuery.toLowerCase().trim()
      const matchesQuery =
        query === "" ||
        order.customerName.toLowerCase().includes(query) ||
        order.id.toString().includes(query)

      return matchesStatus && matchesQuery
    })
    //eslint-disable-next-line
    setFilteredOrders(filtered)
  }, [selectedFilters, searchQuery, orders])

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
                className="cursor-pointer block truncate text-sm hover:text-primary transition-colors"
                onClick={() => selectCart(item.id)}
              >
                {item.products[0]?.title}
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
                    <span className="">• {p.title}</span>
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
          groups={filterGroups}
          selectedFilters={selectedFilters}
          intlKey="orders.filter"
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
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
