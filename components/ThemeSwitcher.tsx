"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "lucide-react"
import { Button } from "./ui/button"

const emptySubscribe = () => () => {}

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center p-2 rounded-lg transition-colors bg-gray-50 dark:bg-[#262626] hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer border"
      aria-label="Cambiar tema"
    >
      {/* Renderizamos un div con las mismas dimensiones que el icono 
        mientras no esté montado para evitar que el botón cambie de tamaño 
      */}
      {!mounted ? (
        <div className="h-5 w-5" />
      ) : theme === "dark" ? (
        <SunIcon className="h-5 w-5 text-yellow-500" />
      ) : (
        <MoonIcon className="h-5 w-5 text-slate-950" />
      )}
    </Button>
  )
}
