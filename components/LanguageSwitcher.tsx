"use client"

import { setLocale } from "@/actions/setLocale"
import { useRouter } from "next/navigation"
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "./ui/menubar"
import { useLocale } from "next-intl"
import { useTranslations } from "next-intl"
import { Globe, ChevronDown } from "lucide-react"
import { useSidebar } from "@/providers/SidebarProvider"
import { cn } from "@/lib/utils"

type LANG = "es" | "en"

export function LanguageSwitcher() {
  const router = useRouter()
  const { openSidebar } = useSidebar()

  const t = useTranslations("sidebar.languageSwitcher")

  const locale = useLocale()

  const changeLanguage = async (locale: LANG) => {
    await setLocale(locale)
    router.refresh()
  }

  return (
    <Menubar className="cursor-pointer bg-gray-50 dark:bg-[#262626] hover:bg-gray-200 dark:hover:bg-slate-700">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer dark:data-[state=open]:bg-transparent dark:data-[state=open]:text-white  data-[state=open]:bg-transparent data-[state=open]:text-black focus:bg-transparent  focus:text-black dark:focus:text-white dark:focus:bg-transparent">
          {openSidebar && <Globe className="w-4 h-4 mr-2" />}
          {locale.toUpperCase()}
          {openSidebar && <ChevronDown className="w-4 h-4 ml-2" />}
        </MenubarTrigger>
        <MenubarContent className="min-w-4 bg-white dark:bg-[#262626]">
          {[
            { id: "es", label: t("es") },
            { id: "en", label: t("en") },
          ].map((lang) => (
            <MenubarItem
              key={lang.id}
              onClick={() => changeLanguage(lang.id as LANG)}
              className={cn(
                "cursor-pointer transition-colors",
                "hover:bg-gray-200! dark:hover:bg-slate-700!", // Tus clases de fondo originales
                locale === lang.id
                  ? "text-primary data-highlighted:text-primary" // Activo: Siempre azul
                  : "text-black dark:text-white data-highlighted:text-black dark:data-highlighted:text-white", // Inactivo: Negro en light / Blanco en dark
              )}
            >
              {lang.label}
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
