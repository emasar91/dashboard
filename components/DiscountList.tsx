"use client"

import { useMemo, useState } from "react"
import SearchBar from "@/components/SearchBar"
import { FilterButton } from "@/components/FilterButton"
import { useTranslations } from "next-intl"
import { TableCustom, Column } from "./Table"
import { useRouter } from "next/navigation"
import { Product } from "@/types/dashboard"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/formatCurrency"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { truncateText } from "@/lib/truncateText"
import { useLocale } from "next-intl"
import { calculateDiscountedPrice } from "@/lib/calculateDiscount"

interface DiscountListProps {
  products: Product[]
  categories: string[]
}

export default function DiscountList({
  products,
  categories,
}: DiscountListProps) {
  const t = useTranslations("discounts")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const locale = useLocale()

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    rangeDiscount: ["all"],
    stock: ["all"],
    category: ["all"],
  })

  const filterGroups = [
    {
      label: t("filter.rangeDiscount.title"),
      key: "rangeDiscount",
      options: [
        { label: t("filter.rangeDiscount.low"), value: "0-10" }, // "Hasta 10%"
        { label: t("filter.rangeDiscount.mid"), value: "10-30" }, // "10% a 30%"
        { label: t("filter.rangeDiscount.high"), value: "30-100" }, // "Más de 30%"
      ],
    },
    {
      label: t("filter.stock.title"),
      key: "stock",
      options: [
        { label: t("filter.stock.empty"), value: "0-0" }, // "Sin Stock"
        { label: t("filter.stock.low"), value: "1-20" }, // "Stock Bajo (1-20)"
        { label: t("filter.stock.ok"), value: "21-50" }, // "Suficiente (21-50)"
        { label: t("filter.stock.high"), value: "51-999" }, // "Abundante (+50)"
      ],
    },
    {
      label: t("filter.category"),
      key: "category",
      options: categories,
    },
  ]

  const router = useRouter()
  const selectProduct = (id: number) => {
    router.push(`?discountId=${id}`, { scroll: false })
  }

  const handleFilterChange = (groupKey: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[groupKey] || []

      // 1. Si estaba en "all", al elegir otra cosa, limpiamos el "all" primero
      const baseFilters = current.filter((item) => item !== "all")

      // 2. Lógica de Toggle (Quitar si existe, agregar si no)
      const newFilters = baseFilters.includes(value)
        ? baseFilters.filter((item) => item !== value)
        : [...baseFilters, value]

      // 3. Si el array queda vacío, podrías volver a poner "all" o dejarlo vacío
      // Dejarlo vacío es mejor para la lógica del .filter
      return {
        ...prev,
        [groupKey]: newFilters,
      }
    })
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedFilters({
      rangeDiscount: ["all"],
      stock: ["all"],
      category: ["all"],
    })
    setCurrentPage(1)
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Filtro de Búsqueda (Título, SKU o ID)
      const query = searchQuery.toLowerCase().trim()
      const matchesQuery =
        query === "" ||
        product.title.toLowerCase().includes(query) ||
        product.id.toString() === query // Permite buscar por ID exacto

      // 2. Filtro de Categoría
      const selectedCats = selectedFilters.category
      const matchesCategory =
        selectedCats.includes("all") ||
        selectedCats.length === 0 ||
        selectedCats.some(
          (cat) => cat.toLowerCase() === product.category.toLowerCase(),
        )

      // 3. Filtro de Rango de Descuento
      const selectedDiscounts = selectedFilters.rangeDiscount
      const matchesDiscount =
        selectedDiscounts.includes("all") ||
        selectedDiscounts.length === 0 ||
        selectedDiscounts.some((range) => {
          const [min, max] = range.split("-").map(Number)
          return (
            product.discountPercentage >= min &&
            product.discountPercentage <= max
          )
        })

      // 4. Filtro de Rango de Stock
      const selectedStock = selectedFilters.stock
      const matchesStock =
        selectedStock.includes("all") ||
        selectedStock.length === 0 ||
        selectedStock.some((range) => {
          const [min, max] = range.split("-").map(Number)
          return product.stock >= min && product.stock <= max
        })

      // El producto debe cumplir TODAS las condiciones (AND)
      return matchesQuery && matchesCategory && matchesDiscount && matchesStock
    })
  }, [selectedFilters, searchQuery, products])

  const discountColumns: Column<Product>[] = [
    {
      accessorKey: "id",
      header: t("table.id"),
      align: "text-left",
      width: "w-[25px]",
      cell: (item: Product) => <span className="capitalize">{item.id}</span>,
    },

    {
      accessorKey: "title",
      header: t("table.name"),
      align: "text-left",
      width: "w-[250px]",
      cell: (item: Product) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="capitalize max-w-[200px]!">
              {truncateText(item.title, 30)}
            </span>
          </TooltipTrigger>
          {item.title.length > 30 && (
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
      width: "w-[210px]",
      cell: (item: Product) => (
        <span className="capitalize flex items-center justify-center">
          {item.category.replace("-", " ")}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: t("table.price"),
      align: "text-center",
      width: "w-[100px]",
      cell: (item: Product) => (
        <span className="text-xs font-medium flex items-center justify-center">
          {formatCurrency(item.price, locale)}
        </span>
      ),
    },
    {
      accessorKey: "discountPercentage",
      header: t("table.discount"),
      align: "text-center",
      width: "w-[100px]!",
      cell: (item: Product) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium flex items-center justify-center">
          {item.discountPercentage}%
        </span>
      ),
    },
    {
      accessorKey: "finalPrice",
      header: t("table.finalPrice"),
      align: "text-center",
      width: "w-[100px]!",
      cell: (item: Product) => {
        const final = calculateDiscountedPrice(
          item.price,
          item.discountPercentage,
        )
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium flex items-center justify-center">
            {formatCurrency(final, locale)}
          </span>
        )
      },
    },
    {
      accessorKey: "stock",
      header: t("table.stock"),
      align: "text-center",
      width: "w-[80px]!",
      cell: (item: Product) => (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium flex items-center justify-center",
            item.stock > 50 && "text-green-500 bg-green-500/10",
            item.stock <= 50 &&
              item.stock > 20 &&
              "text-yellow-500 bg-yellow-500/10",
            item.stock <= 20 && "text-red-500 bg-red-500/10",
          )}
        >
          {item.stock}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-4">
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
          intlKey="customers.filter"
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      <TableCustom
        data={filteredProducts}
        columns={discountColumns}
        emptyMessage={t("emptyMessage")}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onRowClick={(product) => selectProduct(product.id)}
      />
    </div>
  )
}
