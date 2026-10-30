export const getAvatar = (
  url: string | null | undefined,
  title: string | null | undefined,
  rounded?: boolean
): string => {
  rounded = rounded ?? true
  const name = encodeURIComponent((title || '').trim() || 'User')
  // Warna brand utama balai (#4E8ABC) dengan teks putih (#FFFFFF) sesuai standar git awal
  const defaultAvatar = `https://ui-avatars.com/api/?format=svg&rounded=${rounded}&name=${name}&background=4E8ABC&color=ffffff`
  if (!url || url.includes('default.png') || url.startsWith('https://ui-avatars.com')) {
    return defaultAvatar
  }
  return url
}
