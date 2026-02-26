"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { buttonStyles, itemsSelectStyles } from "@/constant"
import { useTranslations } from "next-intl"

interface Props {
  totalItems: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: string) => void
}

export function TablePagination({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const t = useTranslations("pagination")

  return (
    <div className="flex items-center justify-between gap-4 mt-4 px-2">
      {/* Selector de filas por página */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {t("rowsPerPage")}
        </span>
        <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
          <SelectTrigger
            className={`w-[70px] h-8 cursor-pointer ${buttonStyles}`}
            id="select-rows-per-page"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start" className="min-w-[10px]!">
            <SelectGroup>
              <SelectItem
                value="10"
                className={itemsSelectStyles(pageSize === 10)}
              >
                10
              </SelectItem>
              <SelectItem
                value="25"
                className={itemsSelectStyles(pageSize === 25)}
              >
                25
              </SelectItem>
              <SelectItem
                value="50"
                className={itemsSelectStyles(pageSize === 50)}
              >
                50
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Info de estado de página */}
      <div className="text-sm text-muted-foreground">
        {t("page")} {currentPage} {t("of")} {totalPages || 1}
      </div>

      {/* Navegación */}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text={t("prev")}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) onPageChange(currentPage - 1)
              }}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : `cursor-pointer ${buttonStyles}`
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              text={t("next")}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) onPageChange(currentPage + 1)
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : `cursor-pointer ${buttonStyles}`
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
