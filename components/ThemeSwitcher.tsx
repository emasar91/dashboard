"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "lucide-react"
import { Button } from "./ui/button"

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Evita errores de hidratación (espera a que el cliente esté listo)
  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center p-2 rounded-lg transition-colors bg-gray-50 dark:bg-[#262626] hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer border"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? (
        <SunIcon className="h-5 w-5 text-yellow-500" />
      ) : (
        <MoonIcon className="h-5 w-5 text-slate-950" />
      )}
    </Button>
  )
}
