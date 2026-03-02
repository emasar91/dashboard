"use client"

import { useMemo, useState } from "react"
import SearchBar from "@/components/SearchBar"
import { FilterButton } from "@/components/FilterButton"
import { useTranslations } from "next-intl"
import { TableCustom, Column } from "./Table"
import { useRouter } from "next/navigation"
import { User } from "@/types/dashboard"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function CustomersList({ users }: { users: User[] }) {
  const t = useTranslations("customers")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({
    gender: ["all"],
    age: ["all"],
  })

  const filterGroups = [
    {
      label: t("filter.gender"),
      key: "gender",
      options: ["male", "female"],
    },
    {
      label: t("filter.ageRange"),
      key: "age",
      options: ["20-29", "30-39", "40-49"],
    },
  ]

  const router = useRouter()
  const selectUser = (id: number) => {
    router.push(`?userId=${id}`, { scroll: false })
  }

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

  const handleClearFilters = () => {
    setSelectedFilters({ gender: ["all"], age: ["all"] })
    setCurrentPage(1)
  }

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase().trim()
      const matchesQuery =
        query === "" ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toString().includes(query)

      const matchesGender =
        selectedFilters.gender.includes("all") ||
        selectedFilters.gender.includes(user.gender.toLowerCase())

      const matchesAge =
        selectedFilters.age.includes("all") ||
        selectedFilters.age.some((range) => {
          const [min, max] = range.split("-").map(Number)
          return user.age >= min && user.age <= max
        })

      return matchesQuery && matchesGender && matchesAge
    })
  }, [selectedFilters, searchQuery, users])

  const customerColumns: Column<User>[] = [
    {
      accessorKey: "id",
      header: t("table.id"),
      align: "text-center",
      width: "w-[50px]",
      cell: (item) => (
        <span className="text-xs text-muted-foreground">#{item.id}</span>
      ),
    },
    {
      accessorKey: "name",
      header: t("table.customer"),
      align: "text-left",
      width: "w-[200px]",
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Image
            src={item.image}
            alt={item.username}
            width={32}
            height={32}
            className="h-12 w-12 rounded-lg object-cover bg-muted"
          />
          <div className="flex flex-col">
            <span className="font-medium text-sm leading-none">
              {item.firstName} {item.lastName}
            </span>
            <span className="text-[10px] text-muted-foreground italic">
              @{item.username}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: t("table.contact"),
      align: "text-left",
      width: "w-[250px]",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="text-sm truncate">{item.email}</span>
          <span className="text-[10px] text-muted-foreground">
            {item.phone}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "demographics",
      header: t("table.info"),
      align: "text-center",
      width: "w-[100px]",
      cell: (item) => (
        <div className="flex flex-row items-center gap-3 justify-center">
          <span className="text-xs">{item.age} años</span>
          <span
            className={cn(
              "text-[9px] px-2 py-0.5 rounded-full uppercase font-bold",
              item.gender === "female"
                ? "bg-pink-100 text-pink-600"
                : "bg-blue-100 text-blue-600",
            )}
          >
            {item.gender === "female" ? "F" : "M"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: t("table.location"),
      align: "text-left",
      width: "w-[150px]",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.address.city}</span>
          <span className="text-[10px] text-muted-foreground">
            {item.address.country}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: t("table.role.title"),
      align: "text-center",
      width: "w-[55px]",
      cell: (item) => (
        <span
          className={cn(
            "px-2 py-1 capitalize  rounded-full text-xs font-medium flex items-center justify-center",
            item.role === "admin" && "text-green-500 bg-green-500/10",
            item.role === "moderator" && "text-yellow-500 bg-yellow-500/10",
            item.role === "user" && "text-blue-500 bg-blue-500/10",
          )}
        >
          {item.role.toLocaleLowerCase()}
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
        data={filteredUsers}
        columns={customerColumns}
        emptyMessage={t("emptyMessage")}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onRowClick={(user) => selectUser(user.id)}
      />
    </div>
  )
}
