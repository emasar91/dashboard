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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
      {/* Grupo Izquierdo: Selector e Info de página */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        {/* Selector de filas */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {t("rowsPerPage")}
          </span>
          <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
            <SelectTrigger
              className={`w-[65px] h-8 cursor-pointer ${buttonStyles}`}
              id="select-rows-per-page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" className="min-w-[10px]!">
              <SelectGroup>
                {[10, 25, 50].map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className={itemsSelectStyles(pageSize === size)}
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Info de estado - Solo visible en mobile como separador o pegado al selector */}
        <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
          {t("page")} {currentPage} {t("of")} {totalPages || 1}
        </div>
      </div>

      {/* Navegación - En mobile ocupará el ancho completo o se alineará */}
      <Pagination className="mx-0 w-full sm:w-auto justify-center sm:justify-end">
        <PaginationContent className="gap-1 sm:gap-2">
          <PaginationItem>
            <PaginationPrevious
              // El componente original suele mostrar el texto.
              // En mobile podrías pasarle un string vacío o usar CSS para ocultar el span interno
              text={t("prev")}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) onPageChange(currentPage - 1)
              }}
              className={`${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : `cursor-pointer ${buttonStyles}`
              } h-9 px-2 sm:px-4`}
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
              className={`${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : `cursor-pointer ${buttonStyles}`
              } h-9 px-2 sm:px-4`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
