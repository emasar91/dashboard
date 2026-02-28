export const calculateDiscountedPrice = (
  price: string | number,
  discount: number,
): number => {
  const p = Number(price)
  if (isNaN(p)) return 0

  const totalDiscount = (p / 100) * discount
  const finalPrice = p - totalDiscount

  return Math.round(finalPrice * 100) / 100
}
