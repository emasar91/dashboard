"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Buscamos el elemento que tiene el scroll.
    // Si usaste las correcciones anteriores, es probable que sea el 'main' o un div con overflow-y-auto.
    const scrollContainer = document.querySelector("main") || window

    scrollContainer.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Animación fluida estilo Apple
    })
  }, [pathname]) // Se dispara cada vez que cambia la ruta

  return null
}
