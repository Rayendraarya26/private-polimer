export const getDateDisplay = (date: string, includeTime?: boolean) => {
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
  }).format(new Date(date))
}