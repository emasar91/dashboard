"use client"

import { useThemeColors } from "@/hooks/useThemeColor"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"

interface DynamicChartProps {
  data: { name?: string; revenue?: number; orders?: number; month?: string }[]
  xKey: string
  primaryKey: string
  secondaryKey?: string
  title: string
  subtitle: string
  primaryLabel: string
  secondaryLabel?: string
  intl: string
}

// 2. Wrap with dynamic to ensure Recharts is lazy loaded and satisfies react-doctor
const DynamicAreaChart = dynamic(() => import("./charts/AreaChartInternal"), {
  ssr: false,
})

export function AreaChartComponent({
  data,
  xKey,
  primaryKey,
  secondaryKey,
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  intl,
}: DynamicChartProps) {
  const colors = useThemeColors()
  const t = useTranslations(intl)

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">
              {primaryLabel}
            </span>
          </div>
          {secondaryLabel && (
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-xs text-muted-foreground">
                {secondaryLabel}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <DynamicAreaChart
          data={data}
          colors={colors}
          xKey={xKey}
          primaryKey={primaryKey}
          secondaryKey={secondaryKey}
          t={t}
        />
      </div>
    </div>
  )
}
