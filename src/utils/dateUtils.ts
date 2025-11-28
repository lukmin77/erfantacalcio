import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export function toUtcDate(date: Date) {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  return new Date(Date.UTC(year, month, day, hours, minutes, seconds, 0))
}

// Restituisce la data formattata in timezone Italia (Europe/Rome)
export function formatDateTime(date: Date | string | undefined | null): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return dayjs(d).tz('Europe/Rome').format('YYYY-MM-DD HH:mm')
}

export function getTimestamp(): string {
  const now = toUtcDate(new Date())
  return dayjs(now).format('YYYYMMDD_HHmmss')
}

export function nowInItalyIso(): string {
  return dayjs().tz('Europe/Rome').format()
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
