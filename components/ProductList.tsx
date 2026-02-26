"use client"

import { useEffect, useState } from "react"
import SearchBar from "@/components/SearchBar"
import { FilterButton } from "@/components/FilterButton"
import { useTranslations } from "next-intl"
import { TableCustom, Column } from "./Table"
import { Product } from "@/types/dashboard"
import { StarIcon } from "lucide-react"
import Image from "next/image"
import { formatCurrency } from "@/lib/formatCurrency"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { truncateText } from "@/lib/truncateText"

export default function ProductListContainer({
  categories,
  products,
}: {
  categories: string[]
  products: Product[]
}) {
  const t = useTranslations("products")
  const locale = useLocale()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const filtered = products.filter((product) => {
      // 1. Filtro de Categoría:
      // Si es "all", pasa siempre (true). Si no, comparamos.
      const matchesCategory =
        selectedCategory === "all" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase()

      // 2. Filtro de Búsqueda (Title o SKU):
      // Si no hay query, pasa siempre. Si hay, buscamos en ambos campos.
      const query = searchQuery.toLowerCase().trim()
      const matchesQuery =
        query === "" ||
        product.title.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)

      // Solo si cumple ambos criterios se incluye en el resultado
      return matchesCategory && matchesQuery
    })
    //eslint-disable-next-line
    setFilteredProducts(filtered)
  }, [selectedCategory, searchQuery, products])

  const productColumns: Column<Product>[] = [
    {
      accessorKey: "thumbnail",
      header: t("table.image"),
      align: "text-center",
      width: "w-[82px]",
      cell: (item: Product) => (
        <Image
          src={item.thumbnail}
          alt={item.title}
          width={50}
          height={50}
          className="rounded"
        />
      ),
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
      accessorKey: "description",
      header: t("table.description"),
      align: "text-left",
      width: "w-[250px]",
      cell: (item: Product) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="capitalize max-w-[200px]!">
              {truncateText(item.description, 30)}
            </span>
          </TooltipTrigger>
          {item.description.length > 30 && (
            <TooltipContent side="right" className="max-w-[200px]">
              <p>{item.description}</p>
            </TooltipContent>
          )}
        </Tooltip>
      ),
    },
    {
      accessorKey: "sku",
      header: t("table.sku"),
      align: "text-left",
      width: "w-[95px]",
      cell: (item: Product) => (
        <span className="capitalize">
          {item.sku.split("-").slice(0, 2).join("-")}
        </span>
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
    {
      accessorKey: "rating",
      header: t("table.rating"),
      align: "text-center",
      width: "w-[100px]!",
      cell: (item: Product) => (
        <div className="flex items-center gap-1 w-full justify-center">
          <StarIcon className="text-yellow-500 size-4" /> {item.rating}
        </div>
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
          selectedCategory={selectedCategory}
          intlKey="products.filter"
          onCategoryChange={(category) => {
            setSelectedCategory(category)
            setCurrentPage(1)
          }}
        />
      </div>
      <TableCustom
        data={filteredProducts}
        columns={productColumns}
        emptyMessage={t("emptyMessage")}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
