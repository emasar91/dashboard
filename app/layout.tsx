import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import IntlProvider from "@/providers/IntlProvider"
import { SidebarProvider } from "@/providers/SidebarProvider"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cookies } from "next/headers"
import QueryProvider from "@/providers/QueryProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get("sidebar_state")

  // Si no existe la cookie, por defecto es 'true'
  const initialState = sidebarCookie ? sidebarCookie.value === "true" : true
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <IntlProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <TooltipProvider>
                <SidebarProvider initialState={initialState}>
                  {children}
                </SidebarProvider>
              </TooltipProvider>
            </ThemeProvider>
          </IntlProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
