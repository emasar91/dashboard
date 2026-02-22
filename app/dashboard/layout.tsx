"use client"

import { Sidebar } from "@/components/SideBar"
import { useTranslations } from "next-intl"

function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("dashboard")
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar />

      <main className="w-full min-h-screen bg-background p-3 md:p-4 lg:p-6 ml-15 sm:ml-0 overflow-y-auto">
        <div className="mb-4 mx-auto w-full max-w-7xl">
          <h1 className="text-xl font-bold text-card-foreground">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        {children}
      </main>
    </div>
  )
}

export default Layout
