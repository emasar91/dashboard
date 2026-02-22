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
  initialState,
}: {
  children: ReactNode
  initialState: boolean
}) => {
  const [openSidebar, setOpenSidebar] = useState(initialState)

  // Sincronizamos el estado con la cookie cada vez que cambie
  useEffect(() => {
    document.cookie = `sidebar_state=${openSidebar}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 días
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
