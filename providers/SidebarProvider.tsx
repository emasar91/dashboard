"use client"

import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
} from "react"

interface SidebarContextType {
  openSidebar: boolean
  setOpenSidebar: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider = ({
  children,
  defaultOpen = true, // Mantenemos el prop por si lo necesitas luego
}: {
  children: ReactNode
  defaultOpen?: boolean
}) => {
  // 1. Iniciamos SIEMPRE en false (Cerrado por defecto)
  const [openSidebar, setOpenSidebar] = useState(false)

  useEffect(() => {
    // 2. Al montar en el cliente, verificamos el ancho
    const isDesktop = window.innerWidth >= 1024 // Umbral típico de escritorio (lg)

    if (isDesktop) {
      // 3. Si es escritorio, revisamos la cookie.
      // Si no hay cookie, usamos el 'defaultOpen' (true)
      const sidebarCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sidebar_state="))
        ?.split("=")[1]

      const shouldOpen = sidebarCookie ? sidebarCookie === "true" : defaultOpen

      if (shouldOpen) {
        //eslint-disable-next-line
        setOpenSidebar(true)
      }
    }
    // En mobile ( < 1024px ), no entra al IF y se queda en 'false'
  }, [defaultOpen])

  // 4. Sincronizamos cambios manuales con la cookie
  useEffect(() => {
    document.cookie = `sidebar_state=${openSidebar}; path=/; max-age=${60 * 60 * 24 * 30}`
  }, [openSidebar])

  const value = useMemo(() => ({ openSidebar, setOpenSidebar }), [openSidebar])

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar debe usarse dentro de un SidebarProvider")
  }
  return context
}
