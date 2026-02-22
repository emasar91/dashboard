"use client"

import {
  BadgePercent,
  ChartBarStacked,
  Handbag,
  LayoutDashboard,
  Package,
  PanelLeftClose,
  PanelRightClose,
  User,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { useTranslations } from "next-intl"
import { useSidebar } from "@/providers/SidebarProvider"
import { LanguageSwitcher } from "./LanguageSwitcher"
import ThemeSwitcher from "./ThemeSwitcher"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export function Sidebar() {
  const t = useTranslations("sidebar")
  const { openSidebar, setOpenSidebar } = useSidebar()

  const items = [
    {
      title: "dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="size-7 shrink-0" />,
    },
    {
      title: "products",
      href: "/products",
      icon: <Package className="size-7 shrink-0" />,
    },
    {
      title: "orders",
      href: "/orders",
      icon: <Handbag className="size-7 shrink-0" />,
    },
    {
      title: "costumers",
      href: "/costumers",
      icon: <Users className="size-7 shrink-0" />,
    },
    {
      title: "discounts",
      href: "/discounts",
      icon: <BadgePercent className="size-7 shrink-0" />,
    },
    {
      title: "categories",
      href: "/categories",
      icon: <ChartBarStacked className="size-7 shrink-0" />,
    },
  ]

  return (
    <>
      {/* Overlay para mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 sm:hidden ",
          openSidebar ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpenSidebar(false)}
      />

      {/* Contenedor del Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-dvh transition-all duration-300 ease-in-out border-r overflow-hidden flex flex-col",
          // Desktop: Controlamos el margen izquierdo para que el contenido de la derecha se desplace
          "sm:relative sm:z-0",
          openSidebar
            ? "w-[350px] translate-x-0" // Abierto: ancho completo
            : "w-[64px]! translate-x-0", // Cerrado: solo espacio para iconos
        )}
      >
        {/* Contenido interno con ancho FIJO para que NO se deforme al cerrar */}
        <div className="w-full flex flex-col h-full shrink-0 bg-t bg-[#fafafa] dark:bg-[#1e1e1e] ">
          <div className="flex h-[72px] shrink-0 items-center justify-between p-4">
            <div
              className={cn(
                "flex items-center gap-2 w-full transition-all duration-700 ease-in-out ",
                !openSidebar ? "justify-end" : "justify-between",
              )}
            >
              <span
                className={cn(
                  "transition-opacity duration-700 ease-in-out overflow-hidden whitespace-nowrap",
                  openSidebar
                    ? "opacity-100 w-full"
                    : "opacity-0 w-0 pointer-events-none",
                )}
              >
                {t("nameApp")}
              </span>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0! cursor-pointer dark:hover:bg-transparent hover:bg-transparent hover:text-primary"
                    onClick={() => setOpenSidebar(!openSidebar)}
                  >
                    {openSidebar ? (
                      <PanelLeftClose className="size-6" />
                    ) : (
                      <PanelRightClose className="size-6" />
                    )}
                  </Button>
                </TooltipTrigger>
                {!openSidebar && (
                  <TooltipContent side="right">
                    {t("openSidebar")}
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>

          <Separator className="shrink-0" />

          <div className="flex h-[72px] shrink-0 p-2 flex-1">
            <div className="flex gap-6 w-full flex-col items-start">
              {items.map((item) => (
                <Tooltip
                  key={item.title}
                  delayDuration={0}
                  open={openSidebar ? false : undefined}
                >
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex gap-4 dark:hover:bg-slate-700 hover:bg-gray-200 w-full rounded-lg p-2 transition-opacity duration-300 items-center hover:text-primary",
                        openSidebar
                          ? ""
                          : "hover:bg-transparent dark:hover:bg-transparent",
                      )}
                    >
                      {/* Contenedor para asegurar que el icono no se deforme */}
                      <div className="shrink-0">{item.icon}</div>

                      <span
                        className={cn(
                          "transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap",
                          openSidebar
                            ? "opacity-100 w-full"
                            : "opacity-0 w-0 pointer-events-none",
                        )}
                      >
                        {t(item.title)}
                      </span>
                    </Link>
                  </TooltipTrigger>

                  {!openSidebar && (
                    <TooltipContent side="right" sideOffset={10}>
                      {t(item.title)}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          </div>

          <div
            className={cn(
              "flex h-[72px] shrink-0 items-center justify-between p-4",
              !openSidebar && "h-[100px]",
            )}
          >
            <div
              className={cn(
                "flex items-start gap-2 w-full",
                !openSidebar && "flex-col items-center justify-start",
              )}
            >
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>

          <Separator className="shrink-0" />

          <div className="flex h-[72px] shrink-0 items-center gap-2 p-2">
            <div className="flex items-center gap-2 border rounded-full p-2 border-primary">
              <User />
            </div>
            <span
              className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap",
                openSidebar
                  ? "opacity-100 w-auto"
                  : "opacity-0 w-0 pointer-events-none",
              )}
            >
              {t("user")}
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}
