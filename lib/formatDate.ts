export const formatDate = (date: string, lang: string): string => {
  const [year, month, day] = date.split("-")
  const mm = month.padStart(2, "0")
  const dd = day.padStart(2, "0")

  return lang === "en" ? `${year}/${mm}/${dd}` : `${dd}/${mm}/${year}`
}
