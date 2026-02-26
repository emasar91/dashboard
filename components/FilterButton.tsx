import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buttonStyles, itemsSelectStyles } from "@/constant"
import { ListFilter } from "lucide-react"
import { useTranslations } from "next-intl"

// Estructura para manejar múltiples grupos de filtros
interface FilterGroup {
  label: string // "Género", "Edad", etc.
  key: string // "gender", "ageRange"
  options: string[]
}

interface FilterButtonProps {
  groups: FilterGroup[]
  selectedFilters: Record<string, string[]> // Ejemplo: { gender: ['male'], ageRange: ['20-29'] }
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void // <-- Nueva prop para limpiar
  intlKey: string
}

export function FilterButton({
  groups,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  intlKey,
}: FilterButtonProps) {
  const t = useTranslations(intlKey)

  // Contamos cuántos filtros hay activos para mostrar en el botón
  // Solo contamos los elementos que NO sean "all"
  const activeCount = Object.values(selectedFilters)
    .flat()
    .filter((value) => value !== "all").length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`gap-2 cursor-pointer ${buttonStyles}`}
        >
          <ListFilter className="size-4" />
          <span>{t("title")}</span>
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 max-h-[400px] overflow-y-auto">
        {/* Botón para limpiar todo al principio del menú si hay filtros */}
        {activeCount > 0 && (
          <>
            <Button
              variant="ghost"
              className="w-full text-center text-xs h-9 text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/10 justify-center font-bold cursor-pointer"
              onClick={onClearFilters}
            >
              {t("all")}
            </Button>
            <DropdownMenuSeparator />
          </>
        )}

        {groups.map((group, index) => (
          <div key={group.key}>
            <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {group.label}
            </DropdownMenuLabel>
            {group.options.map((option) => (
              <DropdownMenuCheckboxItem
                key={option}
                className={`capitalize cursor-pointer ${itemsSelectStyles(selectedFilters[group.key]?.includes(option))}`}
                checked={selectedFilters[group.key]?.includes(option)}
                // Evita que el menú se cierre al clickear
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => onFilterChange(group.key, option)}
              >
                {option.replace("-", " ")}
              </DropdownMenuCheckboxItem>
            ))}
            {index + 1 < groups.length && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
