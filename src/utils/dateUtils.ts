import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function toLocaleDateTime(date: Date) {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return new Date(Date.UTC(year, month, day, hours, minutes, seconds))
}

export function formatDateTime(date: Date | string | undefined | null): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  // Ensure that a UTC timestamp (e.g. saved as `2025-11-27 16:03:26+00`) is
  // interpreted as UTC and then converted to local timezone for display.
  return dayjs(d).format('YYYY-MM-DD HH:mm')
}

export function getTimestamp(): string {
  const now = toLocaleDateTime(new Date())
  return dayjs(now).format('YYYYMMDD_HHmmss')
}

export function convertFromIsoToDatetimeMUI(
  dataISO: string | undefined | null,
) {
  if (dataISO) {
    const data = new Date(dataISO)
    const year = data.getFullYear()
    const month = (data.getMonth() + 1).toString().padStart(2, '0')
    const day = data.getDate().toString().padStart(2, '0')
    const hours = data.getHours().toString().padStart(2, '0')
    const minutes = data.getMinutes().toString().padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
  } else return ''
}

export function formatDateFromIso(
  dataISO: string | undefined | null,
  stringFormat: string,
) {
  return dataISO ? dayjs(dataISO).format(stringFormat) : ''
}
