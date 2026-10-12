
const timeFmt = new Intl.DateTimeFormat([], {
  hour: 'numeric',
  minute: '2-digit',
})

export const formatTime = (date) => timeFmt.format(date)

export const formatRange = (start, end) =>
  `${timeFmt.format(start)} – ${timeFmt.format(end)}`

export function formatCountdown(ms) {
  const mins = Math.max(0, Math.round(ms / 60000))

  if (mins < 1) return 'Under a minute'
  if (mins < 60) return `${mins} min`

  const hours = Math.floor(mins / 60)
  const remainingMinutes = mins % 60

  return remainingMinutes
    ? `${hours} h ${remainingMinutes} min`
    : `${hours} h`
}

/**
 * Convert a date value into a valid Date.
 * Returns null for missing or invalid values.
 */
export function asDate(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * Format a task due date for a compact action-item list.
 * Returns null when no due date is supplied.
 */
export function formatDueDate(value, now = new Date()) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  // Date-only values are parsed locally to avoid UTC date shifts.
  const textValue = String(value)
  const date = value instanceof Date
    ? asDate(value)
    : /^\d{4}-\d{2}-\d{2}$/.test(textValue)
      ? asDate(new Date(
          Number(textValue.slice(0, 4)),
          Number(textValue.slice(5, 7)) - 1,
          Number(textValue.slice(8, 10)),
        ))
      : asDate(value)

  if (!date) {
    return textValue
  }

  const currentDate = asDate(now) ?? new Date()

  const todayStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
  )

  const dateStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )

  const diffDays = Math.round(
    (dateStart.getTime() - todayStart.getTime()) / 86400000,
  )

  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays === -1) return 'Due yesterday'

  return `Due ${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)}`
}

/**
 * Format a due date as a calendar date, including the year
 * only when it differs from the current year.
 */
export function formatDueDateLong(value, now = new Date()) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'No due date'
  }

  const textValue = String(value)

  const date = value instanceof Date
    ? asDate(value)
    : /^\d{4}-\d{2}-\d{2}$/.test(textValue)
      ? asDate(new Date(
          Number(textValue.slice(0, 4)),
          Number(textValue.slice(5, 7)) - 1,
          Number(textValue.slice(8, 10)),
        ))
      : asDate(value)

  if (!date) {
    return textValue
  }

  const currentDate = asDate(now) ?? new Date()

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year:
      date.getFullYear() !== currentDate.getFullYear()
        ? 'numeric'
        : undefined,
  }).format(date)
}


export function formatDate(value) {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}