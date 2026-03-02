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
import { ScrollArea } from "@/components/ui/scroll-area"
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

export function CategoryDetail({
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
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl overflow-hidden flex flex-col h-full">
          <DrawerHeader className="border-b border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl capitalize">
                  {name.replaceAll("-", " ")}
                </DrawerTitle>
                <DrawerDescription>{t("subtitle")}</DrawerDescription>
              </div>
              <Badge variant="secondary" className="h-6">
                {stats.totalStock} {t("stock")}
              </Badge>
            </div>
          </DrawerHeader>

          <ScrollArea className="flex-1 p-6">
            {/* Grid de Stats Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

            {/* Alertas de Stock Bajo */}
            {lowStockAlerts.length > 0 && (
              <section className="mb-8">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {t("lowStockAlerts")}
                </h4>
                <div className="space-y-2">
                  {lowStockAlerts.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                    >
                      <span className="text-sm font-medium">{p.title}</span>
                      <Badge variant="destructive" className="text-[10px]">
                        {p.stock > 0
                          ? t("lowStock", {
                              stock: p.stock,
                            })
                          : t("outOfStock")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Top Productos */}
            <section>
              <h4 className="text-sm font-semibold mb-3">{t("topProducts")}</h4>
              <div className="rounded-xl border border-border overflow-hidden">
                {topProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className={`flex items-center gap-4 p-3 ${i !== topProducts.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg object-cover bg-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(product.price, locale)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {product.rating}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>
          </ScrollArea>

          <DrawerFooter className="border-t border-border/50">
            <DrawerClose asChild>
              <Button
                variant="outline"
                onClick={onClose}
                className={buttonStyles}
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

export default CategoryDetail

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
    <div className="p-3 rounded-xl border border-border bg-card/50">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
          {label}
        </span>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
