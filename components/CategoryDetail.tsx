"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Package, Star, TrendingUp, Wallet } from "lucide-react"
import { type CategoryDetail } from "@/types/dashboard"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { formatCurrency } from "@/lib/formatCurrency"
import { buttonStyles } from "@/constant"

interface CategoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  categoryData: CategoryDetail | null
}

function CategoryDetailComponent({
  isOpen,
  onClose,
  categoryData,
}: CategoryDrawerProps) {
  const t = useTranslations("categories.categoryDetail")
  const locale = useLocale()

  if (!categoryData) return null

  const { stats, topProducts, lowStockAlerts, name } = categoryData

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 1. Solo el Content lleva la altura máxima */}
      <DrawerContent className="h-[96dvh] max-h-[96dvh]">
        {/* 2. El wrapper principal debe ser flex y ocupar el alto disponible */}
        <div className="mx-auto w-full max-w-2xl flex flex-col h-full overflow-hidden">
          <DrawerHeader className="border-b border-border/50 shrink-0 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl capitalize">
                  {name.replaceAll("-", " ")}
                </DrawerTitle>
                <DrawerDescription>{t("subtitle")}</DrawerDescription>
              </div>
              <Badge variant="secondary" className="h-6 shrink-0">
                {stats.totalStock} {t("stock")}
              </Badge>
            </div>
          </DrawerHeader>
          {/* 3. Área de scroll optimizada para móvil */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 touch-pan-y">
            {/* Grid de Stats - 2 columnas fijas en móvil */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatItem
                icon={<TrendingUp className="h-4 w-4 text-primary" />}
                label={t("stats.revenue")}
                value={`$${stats.revenue.toLocaleString()}`}
              />
              <StatItem
                icon={<Package className="h-4 w-4 text-primary" />}
                label={t("stats.sold")}
                value={stats.itemsSold}
              />
              <StatItem
                icon={<Wallet className="h-4 w-4 text-primary" />}
                label={t("stats.inventoryValue")}
                value={`$${Number(stats.inventoryValue).toFixed(0)}`}
              />
              <StatItem
                icon={<AlertCircle className="h-4 w-4 text-primary" />}
                label={t("stats.priceAvg")}
                value={`$${stats.avgPrice}`}
              />
            </div>

            {/* Alertas de Stock */}
            {lowStockAlerts.length > 0 && (
              <section>
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-destructive uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4" />
                  {t("lowStockAlerts")}
                </h4>
                <div className="space-y-2">
                  {lowStockAlerts.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center p-3 rounded-xl bg-destructive/5 border border-destructive/10"
                    >
                      <span className="text-sm font-medium truncate pr-2">
                        {p.title}
                      </span>
                      <Badge
                        variant="destructive"
                        className="text-[10px] shrink-0"
                      >
                        {p.stock > 0
                          ? t("lowStock", { stock: p.stock })
                          : t("outOfStock")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Top Productos - Lista limpia */}
            <section className="pb-6">
              <h4 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">
                {t("topProducts")}
              </h4>
              <div className="rounded-2xl border border-border bg-card/30 divide-y divide-border overflow-hidden">
                {topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative h-12 w-12 shrink-0">
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="rounded-lg object-cover bg-muted"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(product.price, locale)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full shrink-0">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-[10px] font-bold text-yellow-600">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <DrawerFooter className="border-t border-border/50 shrink-0 p-6 bg-background/80 backdrop-blur-md">
            <DrawerClose asChild>
              <Button
                variant="outline"
                onClick={onClose}
                className={`w-full h-12 ${buttonStyles}`}
              >
                {t("close")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CategoryDetailComponent

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="p-3 rounded-2xl border border-border bg-card/40 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">
          {label}
        </span>
      </div>
      <p className="text-base font-bold tracking-tight">{value}</p>
    </div>
  )
}
