"use client"
import { Card, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

interface GridCategoriesProps {
  category: string
  productCount: number
  avgDiscount: number
  thumbnail: string
  onClick: (category: string) => void
}

function GridCategories({
  category,
  productCount,
  avgDiscount,
  thumbnail,
  onClick,
}: GridCategoriesProps) {
  const t = useTranslations("categories")

  return (
    <Card
      className="group relative h-48 overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
      onClick={() => onClick(category)}
    >
      {/* Fondo con la imagen del primer producto */}
      <div className="absolute inset-0 z-0">
        <Image
          src={thumbnail}
          fill
          className="object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
          alt={category}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
      </div>

      <CardHeader className="relative z-10 h-full flex flex-col justify-end p-4">
        <CardTitle className="text-xl capitalize flex justify-between items-center">
          {category?.replace("-", " ")}
          <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </CardTitle>
        <div className="flex gap-3 mt-2">
          <Badge variant="secondary" className="text-[10px]">
            {productCount} {t("productCount")}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] border-primary/50 text-primary"
          >
            {t("avgDiscount", { discount: avgDiscount })}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  )
}

export default GridCategories
