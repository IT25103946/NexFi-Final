const rupees = new Intl.NumberFormat('en-LK', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const rupeesShort = new Intl.NumberFormat('en-LK', { maximumFractionDigits: 0 })

const dayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })
const fullDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/** Rs. 1,250,000.00 */
export function formatMoney(value) {
  const amount = Number(value ?? 0)
  return `Rs. ${rupees.format(Number.isFinite(amount) ? amount : 0)}`
}

/** Rs. 1,250,000 — for cards and chart axes. */
export function formatMoneyShort(value) {
  const amount = Number(value ?? 0)
  return `Rs. ${rupeesShort.format(Number.isFinite(amount) ? amount : 0)}`
}

export function formatAxisMoney(value) {
  const amount = Number(value ?? 0)
  if (!Number.isFinite(amount)) return '0'
  const sign = amount < 0 ? '-' : ''
  const absolute = Math.abs(amount)
  if (absolute >= 1000000) return `${sign}${rupeesShort.format(absolute / 1000000)}M`
  if (absolute >= 1000) return `${sign}${rupeesShort.format(absolute / 1000)}k`
  return `${sign}${rupeesShort.format(absolute)}`
}

export function parseDate(value) {
  if (!value) return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  // Handles Jackson array serialization [2026, 10, 1]
  if (Array.isArray(value)) {
    const [year, month, day] = value
    if (year && month && day) {
      return new Date(Number(year), Number(month) - 1, Number(day))
    }
    return null
  }
  if (typeof value === 'number') {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [year, month, day] = trimmed.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    const d = new Date(trimmed)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
}

/** 12 Oct 2026 */
export function formatDate(value) {
  const date = parseDate(value)
  return date && !Number.isNaN(date.getTime()) ? fullDate.format(date) : '—'
}

/** 12 Oct */
export function formatDayMonth(value) {
  const date = parseDate(value)
  return date && !Number.isNaN(date.getTime()) ? dayMonth.format(date) : '—'
}

/** 2026-10-12, for date inputs. */
export function todayIso() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

export function addDaysIso(isoDate, days) {
  const date = parseDate(isoDate) ?? new Date()
  date.setDate(date.getDate() + days)
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

/** "in 4 days" / "6 days overdue" / "due today" */
export function describeDueDate(daysUntilDue) {
  if (daysUntilDue === null || daysUntilDue === undefined) return ''
  if (daysUntilDue === 0) return 'due today'
  if (daysUntilDue === 1) return 'due tomorrow'
  if (daysUntilDue > 1) return `in ${daysUntilDue} days`
  if (daysUntilDue === -1) return '1 day overdue'
  return `${Math.abs(daysUntilDue)} days overdue`
}

/** 1 -> "1st", 22 -> "22nd" */
export function dueDayLabel(dayOfMonth) {
  const day = Number(dayOfMonth)
  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? 'th'
      : day % 10 === 1
        ? 'st'
        : day % 10 === 2
          ? 'nd'
          : day % 10 === 3
            ? 'rd'
            : 'th'
  return `${day}${suffix}`
}

export const TRANSACTION_CATEGORIES = [
  'Sales',
  'Suppliers',
  'Rent',
  'Salaries',
  'Utilities',
  'Transport',
  'Marketing',
  'Services',
  'Other',
]

export const STATUS_LABELS = {
  SAFE: 'Safe',
  WARNING: 'Warning',
  SHORTAGE: 'Shortage',
}
