"use client"
import { useMemo, useState } from "react"
import SearchBar from "./SearchBar"
import { FilterButton } from "./FilterButton"
import { CategoryStat } from "@/types/dashboard"
import GridCategories from "./GridCategories"
import { useTranslations } from "next-intl"
import { CategoryDetail } from "./CategoryDetail"
import { type CategoryDetail as CategoryDetailType } from "@/types/dashboard"

type ListCategoriesProps = {
  categories: CategoryStat[]
  categoryDetails: Record<string, CategoryDetailType>
}

const ListCategories = ({
  categories,
  categoryDetails,
}: ListCategoriesProps) => {
  const t = useTranslations("categories")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryDetailType | null>(null)
  console.log("🚀 ~ selectedCategory:", selectedCategory)

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
      options: categories.map((cat) => cat.name),
    },
  ]

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
  }

  const handleClearFilters = () => {
    setSelectedFilters({
      rangeDiscount: ["all"],
      stock: ["all"],
      category: ["all"],
    })
  }

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      // 1. Filtro de Búsqueda (Título, SKU o ID)
      const query = searchQuery.toLowerCase().trim()
      const matchesQuery =
        query === "" || category.name.toLowerCase().includes(query)

      // 2. Filtro de Categoría
      const selectedCats = selectedFilters.category
      const matchesCategory =
        selectedCats.includes("all") ||
        selectedCats.length === 0 ||
        selectedCats.some(
          (cat) => cat.toLowerCase() === category.name.toLowerCase(),
        )

      // 3. Filtro de Rango de Descuento
      const selectedDiscounts = selectedFilters.rangeDiscount
      const matchesDiscount =
        selectedDiscounts.includes("all") ||
        selectedDiscounts.length === 0 ||
        selectedDiscounts.some((range) => {
          const [min, max] = range.split("-").map(Number)
          return category.avgDiscount >= min && category.avgDiscount <= max
        })

      // 4. Filtro de Rango de Stock
      const selectedStock = selectedFilters.stock
      const matchesStock =
        selectedStock.includes("all") ||
        selectedStock.length === 0 ||
        selectedStock.some((range) => {
          const [min, max] = range.split("-").map(Number)
          return category.count >= min && category.count <= max
        })

      // El producto debe cumplir TODAS las condiciones (AND)
      return matchesQuery && matchesCategory && matchesDiscount && matchesStock
    })
  }, [selectedFilters, searchQuery, categories])

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 items-end justify-between">
        <SearchBar
          placeholder={t("searchPlaceholder")}
          title={t("searchTitle")}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
        />
        <FilterButton
          groups={filterGroups}
          selectedFilters={selectedFilters}
          intlKey="products.filter"
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>
      {filteredCategories.length === 0 ? (
        <div className="flex items-center justify-center h-[620px] bg-card rounded-lg">
          <p className="text-muted-foreground">{t("emptyMessage")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[620px] overflow-y-auto">
          {filteredCategories.map((cat) => (
            <GridCategories
              key={cat.name}
              category={cat.name?.replaceAll("-", " ")}
              productCount={cat.count}
              avgDiscount={cat.avgDiscount}
              thumbnail={cat.featuredImage}
              onClick={() => setSelectedCategory(categoryDetails[cat.name])}
            />
          ))}
        </div>
      )}
      <CategoryDetail
        categoryData={selectedCategory}
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </div>
  )
}

export default ListCategories
