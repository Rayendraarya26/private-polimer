/**
 * Helper untuk mengambil data formulir GRK (Validasi / Verifikasi)
 * dengan prioritas: formData langsung -> relasi array -> fallback formData
 */
export const resolveGrkFormData = (permohonan: any, formData: any, isGrk: boolean, isGrkValidasi: boolean) => {
  if (!isGrk) return null

  if (isGrkValidasi) {
    if (
      formData?.jumlah_emisi_proyek_kgco2e !== undefined ||
      formData?.jumlah_emisi_baseline_kgco2e !== undefined ||
      formData?.batasan_proyek ||
      formData?.jenis_proyek_grk
    ) {
      return formData
    }

    const validasiSources = [
      permohonan?.form_grk_validasi,
      permohonan?.formGrkValidasi,
    ]
    for (const src of validasiSources) {
      if (Array.isArray(src) && src.length > 0) return src[0]
      if (src && typeof src === "object") return src
    }

    return formData || null
  }

  // GRK Verifikasi
  if (
    formData?.total_emisi_ton_co2e !== undefined ||
    formData?.tingkat_jaminan ||
    formData?.organization_boundary ||
    Array.isArray(formData?.emisi)
  ) {
    return formData
  }

  const verifikasiSources = [
    permohonan?.form_grk_verifikasi,
    permohonan?.formGrkVerifikasi,
  ]
  for (const src of verifikasiSources) {
    if (Array.isArray(src) && src.length > 0) return src[0]
    if (src && typeof src === "object") return src
  }

  return formData || null
}
