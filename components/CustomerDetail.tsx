"use client"
import { User } from "@/types/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  User as UserIcon,
  Briefcase,
  CreditCard,
  MapPin,
  Cpu,
  LucideIcon,
  Check,
  Copy,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useState } from "react"
import { buttonStyles } from "@/constant"
import { useLocale, useTranslations } from "next-intl"
import { formatDate } from "@/lib/formatDate"

const SectionTitle = ({
  icon: Icon,
  title,
}: {
  icon: LucideIcon
  title: string
}) => (
  <div className="flex items-center gap-2 mb-4 text-primary border-b border-slate-800 pb-2">
    <Icon className="size-4" />
    <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
  </div>
)

const InfoRow = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] text-muted-foreground uppercase">{label}</span>
    <span className="text-sm font-medium truncate">{value || "—"}</span>
  </div>
)

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-6 w-6 text-muted-foreground hover:text-primary transition-colors cursor-pointer ${buttonStyles}`}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="size-3 text-green-500" />
      ) : (
        <Copy className="size-3 text-primary" />
      )}
    </Button>
  )
}

export default function CustomerDetail({ user }: { user: User }) {
  const t = useTranslations("customers.customerDetail")
  const locale = useLocale()

  return (
    <Card className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 lg:p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 w-full">
      <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-6 space-y-0 text-center sm:text-left">
        {/* CONTENEDOR DE IMAGEN */}
        <div className="relative inline-block shrink-0">
          <Image
            src={user.image}
            alt={user.username}
            width={80} // Un poco más grande para que luzca mejor en móvil
            height={80}
            className="rounded-full bg-muted border-2 border-primary/20"
          />
          <Badge
            className={cn(
              "py-1 rounded-full text-xs font-medium flex items-center justify-center absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[9px] uppercase whitespace-nowrap px-2 text-white shadow-lg",
              user.role === "admin" && "bg-green-500/90",
              user.role === "moderator" && "bg-yellow-500/90",
              user.role === "user" && "bg-blue-500/90",
            )}
          >
            {t(`role.${user.role}`)}
          </Badge>
        </div>

        {/* CONTENEDOR DE TEXTO */}
        <div className="flex flex-col items-center sm:items-start w-full">
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {user.firstName} {user.lastName}
          </CardTitle>

          {/* EMAIL Y USERNAME */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1 text-muted-foreground text-sm italic mt-1">
            <span className="font-semibold text-primary/80">
              @{user.username}
            </span>
          </div>
          <div className="flex items-center gap-1.5px-2 py-0.5 rounded-md border border-transparent">
            <span className="dark:text-slate-300 text-slate-600 font-medium lowercase">
              {user.email}
            </span>
            <CopyButton text={user.email} />
          </div>

          {/* TELÉFONO */}
          <div className="flex items-center gap-2 pr-3 py-1 ">
            <span className="text-sm font-medium dark:text-slate-300 text-slate-600">
              {user.phone}
            </span>
            <CopyButton text={user.phone} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* SECCIÓN PERSONAL */}
          <div>
            <SectionTitle icon={UserIcon} title={t("personalInfo.title")} />
            <div className="grid grid-cols-2 gap-4">
              <InfoRow
                label={t("personalInfo.age")}
                value={`${user.age} ${t("personalInfo.years")}`}
              />
              <InfoRow
                label={t("personalInfo.gender.title")}
                value={t(`personalInfo.gender.${user.gender}`)}
              />

              <InfoRow
                label={t("personalInfo.birthDate")}
                value={formatDate(user.birthDate, locale)}
              />
              <InfoRow
                label={t("personalInfo.bloodGroup")}
                value={user.bloodGroup}
              />
            </div>
          </div>

          {/* SECCIÓN PROFESIONAL */}
          <div>
            <SectionTitle icon={Briefcase} title={t("workInfo.title")} />
            <div className="flex flex-col gap-4">
              <div className="p-2 rounded border border-slate-800">
                <p className="text-xs font-bold text-primary">
                  {user.company.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {user.company.title} - {user.company.department}
                </p>
              </div>
              <InfoRow
                label={t("workInfo.university")}
                value={user.university}
              />
            </div>
          </div>

          {/* SECCIÓN FINANCIERA & CRYPTO */}
          <div>
            <SectionTitle icon={CreditCard} title={t("financialInfo.title")} />
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {user.bank.cardType}
                </Badge>
                <span className="text-sm font-mono tracking-tighter">
                  **** {user.bank.cardNumber.slice(-4)}
                </span>
              </div>
              <InfoRow label={t("financialInfo.iban")} value={user.bank.iban} />
            </div>
          </div>

          {/* SECCIÓN TÉCNICA / UBICACIÓN */}
          <div>
            <SectionTitle icon={MapPin} title={t("locationInfo")} />
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm italic">{user.address.address}</span>
                <span className="text-xs text-muted-foreground">
                  {user.address.city}, {user.address.state} (
                  {user.address.postalCode})
                </span>
              </div>
              <div className="pt-2">
                <SectionTitle icon={Cpu} title={t("deviceInfo")} />
                <p className="text-[10px] text-muted-foreground leading-tight truncate">
                  {user.userAgent.split(")")[0] + ")"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
