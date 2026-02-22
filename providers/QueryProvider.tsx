"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"

export default function Providers({ children }: { children: ReactNode }) {
  // Usamos useState para que el cliente sea el mismo durante todo el ciclo de vida de la app
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
