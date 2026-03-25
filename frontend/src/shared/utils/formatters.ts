/** Format a number as Hungarian-style currency: "370 370 100,00 Ft" */
export function formatHuf(amount: number): string {
  return `${formatSpaced(amount)},00 Ft`
}

/** Format a number with space-separated thousands: "1 234 567" */
export function formatSpaced(n: number): string {
  return n.toLocaleString('hu-HU').replace(/,/g, ' ')
}
