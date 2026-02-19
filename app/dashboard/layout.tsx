"use client"

import { Sidebar } from "@/components/SideBar"

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 flex overflow-y-auto justify-center h-dvh bg-[url('/assets/images/pattern.svg'),_linear-gradient(309deg,_rgba(209,214,141,1)_0%,_rgba(143,187,141,1)_45%,_rgba(143,187,141,1)_56%,_rgba(209,214,141,1)_100%)] bg-size-[450px,cover] bg-position-[repeat,no-repeat] bg-[local,fixed]">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
