/**
 * Date formatting utilities for Indonesian locale.
 * Extracted from DetailPermohonanPage.tsx — Phase 1 refactor.
 */

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
const LONG_MONTHS  = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

/**
 * Formats a date string into a human-readable Indonesian date.
 *
 * @param dateStr   - ISO date string or any parseable date value
 * @param withTime  - If true, appends HH:mm (also switches to short month names by default)
 * @param shortMonth - Override month name style; when omitted, follows `withTime`
 * @returns Formatted string, e.g. "25 Sep 2026, 13:23" or "25 September 2026"
 *
 * @example
 * formatIndoDate("2026-09-25T13:23:00Z", true)  // "25 Sep 2026, 13:23"
 * formatIndoDate("2026-09-25")                   // "25 September 2026"
 */
export const formatIndoDate = (
  dateStr?: string | null,
  withTime: boolean = false,
  shortMonth?: boolean
): string => {
  if (!dateStr || dateStr === "-" || dateStr === "null") return "-"
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr

    const useShort = shortMonth !== undefined ? shortMonth : withTime
    const months   = useShort ? SHORT_MONTHS : LONG_MONTHS

    const day      = d.getDate()
    const month    = months[d.getMonth()]
    const year     = d.getFullYear()
    const datePart = `${day} ${month} ${year}`

    if (withTime) {
      const hours   = String(d.getHours()).padStart(2, "0")
      const minutes = String(d.getMinutes()).padStart(2, "0")
      return `${datePart}, ${hours}:${minutes}`
    }
    return datePart
  } catch {
    return dateStr
  }
}
