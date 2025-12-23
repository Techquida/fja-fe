"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  className?: string
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  className,
  emptyMessage = "No data available",
  onRowClick,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0
    const aValue = a[sortColumn as keyof T]
    const bValue = b[sortColumn as keyof T]
    if (aValue === bValue) return 0
    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : 1
    }
    return aValue > bValue ? -1 : 1
  })

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                  column.sortable && "cursor-pointer hover:text-foreground transition-colors",
                  column.className,
                )}
                onClick={() => column.sortable && handleSort(String(column.key))}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable &&
                    sortColumn === String(column.key) &&
                    (sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr
                key={row.id ?? index}
                className={cn(
                  "border-b border-border/50 transition-colors",
                  onRowClick && "cursor-pointer hover:bg-secondary/50",
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className={cn("px-4 py-4 text-sm", column.className)}>
                    {column.render ? column.render(row) : String(row[column.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
