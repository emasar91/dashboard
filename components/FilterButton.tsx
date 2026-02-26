import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ListFilter } from "lucide-react"
import { useTranslations } from "next-intl"

interface FilterButtonProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  intlKey: string
}

export function FilterButton({
  categories,
  selectedCategory,
  onCategoryChange,
  intlKey,
}: FilterButtonProps) {
  const t = useTranslations(intlKey)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className=" bg-gray-50  hover:bg-gray-200 hover:text-primary dark:hover:bg-slate-700 cursor-pointer border"
        >
          <ListFilter className="size-4" />
          {selectedCategory === "all"
            ? t("title")
            : selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-4 max-h-[200px] ">
        <DropdownMenuLabel>{t("placeholder")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={selectedCategory}
          onValueChange={onCategoryChange}
        >
          <DropdownMenuRadioItem
            value="all"
            className={cn(
              "capitalize",
              selectedCategory === "all"
                ? "bg-primary/20 text-primary dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/10 dark:hover:text-primary! hover:bg-primary/20! hover:text-primary!"
                : "dark:hover:bg-primary/10 dark:hover:text-white! hover:bg-primary/10! hover:text-black!",
            )}
          >
            {t("all")}
          </DropdownMenuRadioItem>
          {categories.map((cat) => (
            <DropdownMenuRadioItem
              key={cat}
              value={cat}
              className={cn(
                "capitalize",
                selectedCategory === cat
                  ? "bg-primary/20 text-primary dark:text-primary dark:bg-primary/20 hover:bg-primary/20! hover:text-primary!"
                  : "hover:bg-primary/10! hover:text-black! dark:hover:bg-primary/10 dark:hover:text-white!",
              )}
            >
              {cat}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
