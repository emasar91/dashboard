"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TablePagination } from "./TablePagination"
import { cn } from "@/lib/utils"

export interface Column<T> {
  accessorKey: keyof T | string
  header: string
  cell?: (item: T) => React.ReactNode
  align?: "text-left" | "text-center" | "text-right"
  width?: string
}

interface TableCustomProps<T extends { id: string | number }> {
  data: T[]
  columns: Column<T>[]
  initialPageSize?: number
  emptyMessage?: string
  currentPage?: number
  onPageChange?: (page: number) => void
  pagination?: boolean
  onRowClick?: (item: T) => void
}

export function TableCustom<T extends { id: string | number }>({
  data,
  columns,
  initialPageSize = 10,
  emptyMessage = "No data available",
  currentPage = 1,
  onPageChange = () => {},
  pagination = true,
  onRowClick,
}: TableCustomProps<T>) {
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalItems = data.length
  const startIndex = (currentPage - 1) * pageSize
  const currentData = data.slice(startIndex, startIndex + pageSize)

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    onPageChange?.(1)
  }

  return (
    <div className="w-full space-y-4 mt-7">
      <div className="rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
        <Table className="w-full table-fixed">
          <TableHeader className="bg-gray-50 dark:bg-slate-900/50">
            <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-slate-800">
              {columns.map((column) => (
                <TableHead
                  key={column.header}
                  className={cn(
                    "h-12 px-2 text-slate-500 font-semibold",
                    column.align,
                    column.width,
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-gray-100 dark:bg-[#16181d] dark:border-slate-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.header}
                      className={cn(
                        "px-2 py-2 font-medium text-slate-700 dark:text-slate-300",
                        column.align,
                      )}
                    >
                      {column.cell
                        ? column.cell(item)
                        : (item[
                            column.accessorKey as keyof T
                          ] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground dark:bg-[#16181d]"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <TablePagination
          totalItems={totalItems}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={onPageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}
