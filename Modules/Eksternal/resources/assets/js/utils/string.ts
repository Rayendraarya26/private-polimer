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

const UPPERCASE_ABBREVIATIONS = new Set([
  "PT",
  "CV",
  "UD",
  "TBK",
  "PD",
  "FA",
  "RT",
  "RW",
  "DKI",
  "DIY",
  "RI",
  "LHU",
])

/**
 * Memformat string alamat agar tidak full kapital (Title Case),
 * sambil mempertahankan tanda hubung, singkatan umum (PT, CV, RT, RW, dll.),
 * serta merapikan koma berulang.
 */
export const formatAddress = (str?: string | null): string => {
  if (!str) return ""
  const cleaned = String(str)
    .replace(/,{2,}/g, ",")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim()

  if (!cleaned) return ""

  return cleaned
    .split(" ")
    .map((token) => {
      const upper = token.replace(/[.,/()]+$/g, "").toUpperCase()
      if (UPPERCASE_ABBREVIATIONS.has(upper)) {
        return token.toUpperCase()
      }
      return token
        .split("-")
        .map((part) =>
          part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part
        )
        .join("-")
    })
    .join(" ")
}
