import { formatCurrency } from "@/lib/formatCurrency"
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

interface StatCardProps {
  title: string
  // Cambiamos value para que soporte string (nombre de categoría) o number
  value: number | string
  change: string
  changeType: "positive" | "negative"
  icon: LucideIcon
  // Añadimos "string" a los tipos posibles
  type: "currency" | "number" | "percentage" | "string"
  since: string
  trend: "up" | "down"
  intl: string
}

export async function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  type,
  since,
  trend,
  intl,
}: StatCardProps) {
  const locale = await getLocale()
  const t = await getTranslations(intl)

  // Función auxiliar para renderizar el valor según el tipo
  const renderValue = () => {
    if (type === "string") {
      return (
        <span className="capitalize text-lg font-bold tracking-tight text-card-foreground lg:text-xl">
          {String(value).replaceAll("-", " ")}
        </span>
      )
    }

    if (typeof value === "number") {
      if (type === "currency") return formatCurrency(value, locale)
      if (type === "percentage") return `${value.toFixed(2)}%`
      return value
    }

    return value // Fallback
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 lg:p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t(title)}
          </p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground lg:text-3xl">
            {renderValue()}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary lg:h-10 lg:w-10">
          <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
        </div>
      </div>

      {/* Sección inferior: cambio y temporalidad */}
      <div className="mt-3 flex items-center gap-1.5 ">
        <span
          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold gap-1 ${
            changeType === "positive"
              ? "bg-accent/10 text-accent"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp className="size-4" />
          ) : (
            <TrendingDown className="size-4" />
          )}
          {change}
        </span>
        <span className="text-xs text-muted-foreground">{t(since)}</span>
      </div>
    </div>
  )
}
