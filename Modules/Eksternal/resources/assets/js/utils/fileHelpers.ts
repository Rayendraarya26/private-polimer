/**
 * File/storage URL helpers.
 * Extracted from DetailPermohonanPage.tsx — Phase 1 refactor.
 */

/**
 * Converts a relative storage path to an absolute URL.
 * Paths that already start with "http" are returned as-is.
 *
 * @example
 * getFileUrl("uploads/doc.pdf")   // "https://app.example.com/storage/uploads/doc.pdf"
 * getFileUrl("https://...")       // "https://..."
 */
export const getFileUrl = (path: string): string => {
  if (!path) return ""
  if (path.startsWith("http")) return path
  return `${window.location.origin}/storage/${path}`
}

/**
 * Document key → human-readable label map for persyaratan documents.
 * Falls back to a prettified version of the key when not found in the map.
 */
const DOC_LABEL_MAP: Record<string, string> = {
  surat_permohonan:    "Surat Permohonan Sertifikasi",
  manual_mutu:         "Manual Mutu / Dokumentasi SM",
  proses_produksi:     "Diagram Alir Proses Produksi",
  denah_lokasi:        "Denah / Tata Letak Pabrik",
  daftar_peralatan:    "Daftar Peralatan & Kalibrasi",
  pertanyaan_tambahan: "Kuesioner Kelayakan & Asesmen",
  dokumen_legalitas:   "Dokumen Legalitas Perusahaan (NIB/NPWP/Akta)",
}

/**
 * Returns the human-readable label for a document key.
 * Unknowns keys are prettified by replacing underscores and uppercasing.
 */
export const getDocLabel = (key: string): string =>
  DOC_LABEL_MAP[key] ?? key.replace(/_/g, " ").toUpperCase()
