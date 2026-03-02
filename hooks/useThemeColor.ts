"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export interface ThemeColors {
  primary: string
  accent: string
  grid: string
  tick: string
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
}

const SERVER_DEFAULTS: ThemeColors = {
  primary: "oklch(0.65 0.2 250)",
  accent: "oklch(0.72 0.19 160)",
  grid: "oklch(0.30 0.01 260)",
  tick: "oklch(0.6 0.01 260)",
  chart1: "oklch(0.65 0.2 250)",
  chart2: "oklch(0.72 0.19 160)",
  chart3: "oklch(0.75 0.15 55)",
  chart4: "oklch(0.65 0.22 340)",
  chart5: "oklch(0.7 0.18 30)",
}

function getComputedColors(): ThemeColors {
  if (typeof window === "undefined") {
    return SERVER_DEFAULTS
  }

  const styles = getComputedStyle(document.documentElement)
  const getVar = (name: string) => styles.getPropertyValue(name).trim()

  return {
    primary: getVar("--primary") || SERVER_DEFAULTS.primary,
    accent: getVar("--accent") || SERVER_DEFAULTS.accent,
    grid: getVar("--chart-grid") || SERVER_DEFAULTS.grid,
    tick: getVar("--chart-tick") || SERVER_DEFAULTS.tick,
    chart1: getVar("--chart-1") || SERVER_DEFAULTS.chart1,
    chart2: getVar("--chart-2") || SERVER_DEFAULTS.chart2,
    chart3: getVar("--chart-3") || SERVER_DEFAULTS.chart3,
    chart4: getVar("--chart-4") || SERVER_DEFAULTS.chart4,
    chart5: getVar("--chart-5") || SERVER_DEFAULTS.chart5,
  }
}

export function useThemeColors(): ThemeColors {
  const { theme } = useTheme()
  const [colors, setColors] = useState<ThemeColors>(SERVER_DEFAULTS)

  useEffect(() => {
    // Initial load and theme changes
    const updateColors = () => {
      setColors(getComputedColors())
    }

    // Small delay to let CSS vars update after theme class change
    const timer = setTimeout(updateColors, 50)
    return () => clearTimeout(timer)
  }, [theme])

  return colors
}
