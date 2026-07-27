const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Formats a date string as "DD-MMM-YYYY" (e.g. "15-Mar-1990").
// Accepts either ISO ("YYYY-MM-DD") or the app's other raw convention ("DD/MM/YYYY").
export function formatDate(input) {
  if (!input) return '—'
  let y, m, d
  if (input.includes('-')) {
    [y, m, d] = input.split('-')
  } else if (input.includes('/')) {
    [d, m, y] = input.split('/')
  } else {
    return input
  }
  if (!y || !m || !d || Number(m) < 1 || Number(m) > 12) return input
  return `${d.padStart(2, '0')}-${MONTHS[Number(m) - 1]}-${y}`
}

// A campaign is "open" until its end date has passed — covers both a
// not-yet-started (Scheduled) and a currently-running (Active) campaign.
// Dates are ISO ("YYYY-MM-DD"), which sorts/compares correctly as strings.
export function isCampaignOpen(endDate) {
  if (!endDate) return true
  const today = new Date().toISOString().slice(0, 10)
  return endDate >= today
}
