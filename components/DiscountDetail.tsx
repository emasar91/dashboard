"use client"
import { Product } from "@/types/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LucideIcon, Tag, Package, Truck, Box, Info } from "lucide-react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { formatCurrency } from "@/lib/formatCurrency"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

const SectionTitle = ({
  icon: Icon,
  title,
}: {
  icon: LucideIcon
  title: string
}) => (
  <div className="flex items-center gap-2 mb-4 text-primary border-b border-slate-800 pb-2">
    <Icon className="size-4" />
    <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
  </div>
)

const InfoRow = ({
  label,
  value,
}: {
  label: string
  value: string | number | React.ReactNode
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] text-muted-foreground uppercase">{label}</span>
    <span className="text-sm font-medium truncate">{value || "—"}</span>
  </div>
)

interface DiscountDetailProps {
  product: Product
}

export default function DiscountDetail({ product }: DiscountDetailProps) {
  const t = useTranslations("discounts.discountDetail")
  const locale = useLocale()

  return (
    <Card className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 lg:p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 w-full">
      <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-6 space-y-0 text-center sm:text-left">
        {/* CONTENEDOR DE IMAGEN */}
        <div className="relative inline-block shrink-0">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={80} // Un poco más grande para que luzca mejor en móvil
            height={80}
            className="rounded-full bg-muted border-2 border-primary/20"
          />
        </div>

        {/* CONTENEDOR DE TEXTO */}
        <div className="flex flex-col items-center sm:items-start w-full">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {product.title}
          </CardTitle>

          {/* EMAIL Y USERNAME */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 text-muted-foreground text-sm italic mt-1">
            <span className="font-semibold text-primary/80">
              {product.brand}
            </span>
          </div>
          <div className="flex items-center gap-1.5px-2 py-0.5 rounded-md border border-transparent">
            <span className="dark:text-slate-300 text-slate-600 font-medium capitalize">
              {product.category}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 1. SECCIÓN DE PRECIOS */}
          <div>
            <SectionTitle icon={Tag} title={t("product.pricing")} />
            <div className="grid grid-cols-2 gap-4">
              <InfoRow
                label={t("product.basePrice")}
                value={formatCurrency(product.price, locale)}
              />
              <InfoRow
                label={t("product.discount")}
                value={
                  <span className="text-red-500">
                    -{product.discountPercentage}%
                  </span>
                }
              />
              <InfoRow
                label={t("product.rating")}
                value={`${product.rating} / 5`}
              />
              <InfoRow
                label={t("product.savings")}
                value={formatCurrency(
                  (product.price * product.discountPercentage) / 100,
                  locale,
                )}
              />
            </div>
          </div>

          {/* 2. SECCIÓN DE INVENTARIO */}
          <div>
            <SectionTitle icon={Package} title={t("inventory.title")} />
            <div className="flex flex-col gap-4">
              <div className="p-2 rounded border border-slate-800">
                <p className="text-xs font-bold text-primary">
                  {product.availabilityStatus}
                </p>
                <p className="text-[11px] text-muted-foreground uppercase">
                  {t("inventory.sku")} {product.sku}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <InfoRow label={t("product.stock")} value={product.stock} />
                <InfoRow
                  label={t("product.minOrder")}
                  value={product.minimumOrderQuantity}
                />
              </div>
            </div>
          </div>

          {/* 3. SECCIÓN DE ENVÍO Y GARANTÍA */}
          <div>
            <SectionTitle icon={Truck} title={t("logistics.title")} />
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {product.warrantyInformation}
                </Badge>
              </div>
              <InfoRow
                label={t("product.shipping")}
                value={product.shippingInformation}
              />
              <InfoRow
                label={t("product.returnPolicy")}
                value={product.returnPolicy}
              />
            </div>
          </div>

          {/* 4. SECCIÓN TÉCNICA (Dimensiones) */}
          <div>
            <SectionTitle icon={Box} title={t("product.specs")} />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm italic">
                  {product.dimensions.width} x {product.dimensions.height} x{" "}
                  {product.dimensions.depth} cm
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("product.weight")}: {product.weight} kg
                </span>
              </div>
              <div className="pt-2 border-t border-border/50">
                <SectionTitle icon={Info} title={t("product.description")} />
                <Tooltip>
                  <TooltipTrigger>
                    <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                      {product.description}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{product.description}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
