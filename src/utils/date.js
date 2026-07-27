const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Formats an ISO date string ("YYYY-MM-DD") as "DD-MMM-YYYY" (e.g. "15-Mar-1990").
export function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}-${MONTHS[Number(m) - 1]}-${y}`
}
