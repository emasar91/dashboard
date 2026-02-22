export const formatCurrency = (value: number, locale: string = "en") => {
  const settings = {
    en: { locale: "en-US", currency: "USD" },
    es: { locale: "es-AR", currency: "ARS" },
  }

  // Buscamos la configuración según el locale, por defecto usamos USD
  const { locale: localeId, currency } =
    settings[locale as keyof typeof settings] || settings.en

  return new Intl.NumberFormat(localeId, {
    style: "currency",
    currency: currency,
    // Opcional: Para ARS a veces se prefiere forzar 0 decimales si son montos grandes
    // minimumFractionDigits: 0,
  }).format(value)
}
