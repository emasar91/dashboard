"use client"

import { Sidebar } from "@/components/SideBar"

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar />

      <main className="w-full min-h-screen bg-background p-3 md:p-4 lg:p-6 ml-15 sm:ml-0">
        <div className="mb-4 mx-auto w-full max-w-7xl">
          <h1 className="text-xl font-bold text-card-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your business
          </p>
        </div>
        {children}
      </main>
    </div>
  )
}

export default Layout
