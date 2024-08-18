export const getAvatar = (
  url: string | null | undefined,
  title: string | null | undefined,
  rounded?: boolean
): string => {
  rounded = rounded ?? true
  const defaultAvatar = `https://ui-avatars.com/api/?format=svg&rounded=${rounded}&name=${
    (title || '').trim() || 'User'
  }&background=random`
  if ((url || '').startsWith('https://ui-avatars.com')) return defaultAvatar
  if (url) return url
  return defaultAvatar
}
