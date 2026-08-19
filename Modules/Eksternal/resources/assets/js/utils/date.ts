export const getDateDisplay = (date?: string | null | Date, includeTime?: boolean) => {
  if (!date) return '-'
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'

    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(includeTime ? {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      } : {})
    }).format(d)
  } catch {
    return '-'
  }
}