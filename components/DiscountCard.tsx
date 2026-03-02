"use client"

import { Percent, ArrowDown, ShoppingBag } from "lucide-react"
import { useTranslations } from "next-intl"
import { Product } from "@/types/dashboard"

interface DiscountsCardProps {
  data: Product[]
}

export function DiscountsCard({ data }: DiscountsCardProps) {
  const t = useTranslations("discountsCard")

  // Tomamos los productos con más descuento que ya vienen del servicio
  const flashOffers = data || []

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">
          {t("title")}
        </h3>
        <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-auto pr-1">
        {flashOffers.slice(0, 7).map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-3 rounded-lg bg-secondary/30 p-2.5 transition-colors hover:bg-secondary/60 group"
          >
            {/* Icono dinámico según el nivel de descuento */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
              {product.discountPercentage > 15 ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <Percent className="h-4 w-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="truncate text-[11px] font-semibold text-card-foreground">
                  {product.title}
                </p>
                <span className="shrink-0 rounded-full bg-accent/10 text-accent px-2 py-0.5 text-[10px] font-bold ">
                  -{Math.round(product.discountPercentage)}%
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground capitalize">
                  {product.category}
                </p>
                <div className="flex items-center gap-1 text-[10px] font-medium  ">
                  <ShoppingBag className="h-3 w-3 text-primary" />
                  <span className="text-primary">
                    {t("stock")}: {product.stock}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
