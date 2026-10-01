/**
 * Utilitas manipulasi string yang dapat digunakan di seluruh project.
 */

/**
 * Mengubah karakter pertama menjadi huruf kapital (uppercase).
 *
 * @param str String input
 * @param lowerRest Apakah sisa karakter diubah menjadi lowercase (default: true)
 * @example
 * capitalizeFirst("permohonan") // => "Permohonan"
 * capitalizeFirst("DRAFT") // => "Draft"
 * capitalizeFirst("dRaFt", false) // => "DRaFt"
 */
export const capitalizeFirst = (str?: string | null, lowerRest: boolean = true): string => {
  if (!str) return ""
  const trimmed = String(str).trim()
  if (!trimmed) return ""
  const first = trimmed.charAt(0).toUpperCase()
  const rest = lowerRest ? trimmed.slice(1).toLowerCase() : trimmed.slice(1)
  return first + rest
}

/**
 * Mengubah setiap kata menjadi huruf kapital (Title Case),
 * serta mengganti pemisah seperti underscore (_) atau tanda hubung (-) menjadi spasi.
 *
 * @param str String input
 * @example
 * titleCase("in_review") // => "In Review"
 * titleCase("menunggu_persetujuan") // => "Menunggu Persetujuan"
 * titleCase("draft permohonan") // => "Draft Permohonan"
 * titleCase("DALAM_PROSES") // => "Dalam Proses"
 */
export const titleCase = (str?: string | null): string => {
  if (!str) return ""
  return String(str)
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/**
 * Alias untuk capitalizeFirst jika pengguna terbiasa dengan nama `ucfirst`
 */
export const ucfirst = capitalizeFirst
