import { formatCurrency } from "@/lib/formatCurrency"
import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

interface StatCardProps {
  title: string
  value: number
  change: string
  changeType: "positive" | "negative"
  icon: LucideIcon
  type: "currency" | "number"
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

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 lg:p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t(title)}
          </p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground lg:text-3xl">
            {type === "currency" ? formatCurrency(value, locale) : value}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary lg:h-10 lg:w-10">
          <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}
