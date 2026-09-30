export function usePermohonanType(permohonan: any, formData: any, lingkup: any, id?: string) {
  const noOrder = permohonan?.no_permohonan || permohonan?.kode_order || `#REQ-${id?.slice(0, 8)}`
  const status = permohonan?.status_workflow || "PERMOHONAN"
  const isRevisi = status === "REVISI"
  const isDraft = status === "DRAFT"
  const isDone = status === "DONE" || status === "SELESAI"

  // Info Pemohon & Perusahaan
  const userPelanggan = permohonan?.creator?.pelanggan
  const detailPerusahaan = userPelanggan?.detail || {}
  const listPabrik = (userPelanggan?.pabrik && userPelanggan.pabrik.length > 0) ? userPelanggan.pabrik : null

  const namaPemohon =
    detailPerusahaan?.nama_perusahaan ||
    formData?.nama_perusahaan ||
    formData?.nama_lengkap ||
    formData?.nama_instansi ||
    permohonan?.creator?.name ||
    "Pemohon"
  const npwp = detailPerusahaan?.npwp || formData?.npwp || "-"
  const nib = detailPerusahaan?.nib || formData?.nib || "-"
  const noAkta = detailPerusahaan?.nomor_akta_pendirian || formData?.no_akta || "-"
  const namaPimpinan = detailPerusahaan?.nama_pimpinan || formData?.nama_pimpinan || "-"
  const wakilManajemen = detailPerusahaan?.nama_wakil_manajemen || formData?.nama_wakil_manajemen || "-"
  const pic = formData?.kontak_person || formData?.nama_pic || detailPerusahaan?.nama_pic || formData?.nama_lengkap || "-"
  const phone = formData?.no_whatsapp || formData?.no_telp || detailPerusahaan?.nomor_telp || "-"
  const email = formData?.email || detailPerusahaan?.email || permohonan?.creator?.email || "-"
  const alamat = detailPerusahaan?.alamat_kantor || formData?.alamat_kantor || formData?.alamat_instansi || formData?.alamat || "-"
  const totalKaryawan = detailPerusahaan?.total_karyawan_tetap || detailPerusahaan?.jumlah_karyawan || "-"

  const layananName =
    lingkup?.lingkup ||
    lingkup?.nama ||
    (noOrder.startsWith("CERT")
      ? "Sertifikasi Produk & Sistem (LSPro)"
      : noOrder.startsWith("LSP")
        ? "Sertifikasi Profesi (LSP)"
        : noOrder.startsWith("REG") || noOrder.startsWith("TRN") || noOrder.startsWith("UMK")
          ? "Bimbingan Teknis & Pelatihan"
          : noOrder.startsWith("VAL")
            ? "Validasi Gas Rumah Kaca (GRK)"
            : noOrder.startsWith("GRK")
              ? "Verifikasi Gas Rumah Kaca (GRK)"
              : noOrder.startsWith("PUP")
                ? "Penyelenggara Uji Profisiensi (PUP)"
                : noOrder.includes("LABKAL") || noOrder.startsWith("KLB") || noOrder.startsWith("KAL") || noOrder.startsWith("CAL")
                  ? "Kalibrasi Alat"
                  : noOrder.startsWith("UJI") || noOrder.startsWith("TEST")
                    ? "Pengujian Laboratorium"
                    : noOrder.includes("HLL") || noOrder.startsWith("HAL")
                      ? "Sertifikasi Halal (LPH BBSPJIKKP)"
                      : "Layanan BBSPJIKKP")

  // Deteksi Tipe / Lingkup Permohonan Secara Akurat (Strict)
  const isPup = Boolean(
    noOrder.startsWith("PUP") ||
    permohonan?.formable_type?.includes("FormPup") ||
    Boolean(formData?.nama_lab_kalibrasi) ||
    (Array.isArray(permohonan?.form_pup) && permohonan.form_pup.length > 0) ||
    (Array.isArray(permohonan?.formPup) && permohonan.formPup.length > 0)
  )

  const isLsp = Boolean(
    !isPup && (
      noOrder.startsWith("LSP") ||
      permohonan?.formable_type?.includes("FormLsp") ||
      lingkup?.slug?.includes("lsp")
    )
  )

  const isPelatihan = Boolean(
    !isPup && !isLsp && (
      noOrder.startsWith("REG") ||
      noOrder.startsWith("TRN") ||
      noOrder.startsWith("UMK") ||
      permohonan?.formable_type?.includes("FormPelatihan") ||
      lingkup?.slug?.includes("pelatihan")
    )
  )

  const isGrk = Boolean(
    !isPup && !isLsp && !isPelatihan && (
      noOrder.startsWith("VAL") ||
      noOrder.startsWith("GRK") ||
      permohonan?.formable_type?.includes("FormGrk") ||
      lingkup?.slug?.includes("grk")
    )
  )

  const isGrkValidasi = Boolean(
    isGrk && (
      noOrder.startsWith("VAL") ||
      permohonan?.formable_type?.includes("FormGrkValidasi") ||
      lingkup?.slug?.includes("validasi") ||
      lingkup?.nama_layanan?.toLowerCase()?.includes("validasi")
    )
  )

  const isKalibrasi = Boolean(
    !isPup && !isLsp && !isPelatihan && !isGrk && (
      noOrder.includes("LABKAL") ||
      noOrder.startsWith("KLB") ||
      noOrder.startsWith("KAL") ||
      noOrder.startsWith("CAL") ||
      permohonan?.formable_type?.includes("FormKalibrasi") ||
      Boolean(formData?.hasil_kalibrasi_untuk) ||
      (Array.isArray(permohonan?.form_kalibrasi) && permohonan.form_kalibrasi.length > 0) ||
      (Array.isArray(permohonan?.formKalibrasi) && permohonan.formKalibrasi.length > 0)
    )
  )

  const isInspeksi = Boolean(
    !isPup && !isLsp && !isPelatihan && !isGrk && !isKalibrasi && (
      noOrder.includes("INSP") ||
      noOrder.startsWith("INS") ||
      permohonan?.formable_type?.includes("FormInspeksi") ||
      lingkup?.slug?.includes("inspeksi") ||
      Boolean(formData?.penerima_hasil_nama) ||
      (Array.isArray(permohonan?.form_inspeksi) && permohonan.form_inspeksi.length > 0) ||
      (Array.isArray(permohonan?.formInspeksi) && permohonan.formInspeksi.length > 0)
    )
  )

  const isPengujian = Boolean(
    !isPup && !isLsp && !isPelatihan && !isGrk && !isKalibrasi && !isInspeksi && (
      noOrder.startsWith("UJI") ||
      noOrder.startsWith("TEST") ||
      permohonan?.formable_type?.includes("FormPengujian") ||
      lingkup?.slug?.includes("pengujian") ||
      (Array.isArray(permohonan?.form_pengujian) && permohonan.form_pengujian.length > 0) ||
      (Array.isArray(permohonan?.formPengujian) && permohonan.formPengujian.length > 0)
    )
  )

  const isHalal = Boolean(
    !isPup && !isLsp && !isPelatihan && !isGrk && !isKalibrasi && !isInspeksi && !isPengujian && (
      noOrder.includes("HLL") ||
      noOrder.startsWith("HAL") ||
      permohonan?.formable_type?.includes("FormHalal") ||
      lingkup?.slug?.includes("halal") ||
      Boolean(formData?.jalur_pendaftaran) ||
      (Array.isArray(permohonan?.form_halal) && permohonan.form_halal.length > 0) ||
      (Array.isArray(permohonan?.formHalal) && permohonan.formHalal.length > 0)
    )
  )

  const isMiniplant = Boolean(
    !isPup && !isLsp && !isPelatihan && !isGrk && !isKalibrasi && !isInspeksi && !isPengujian && !isHalal && (
      noOrder.startsWith("MINI") ||
      noOrder.includes("MKP") ||
      noOrder.startsWith("MNP") ||
      noOrder.startsWith("F") ||
      noOrder.startsWith("RK") ||
      noOrder.startsWith("PA") ||
      permohonan?.formable_type?.includes("FormMiniplant") ||
      lingkup?.slug?.includes("miniplant") ||
      lingkup?.nama_layanan?.toLowerCase()?.includes("miniplant") ||
      Boolean(formData?.jasa_diminta) ||
      (Array.isArray(permohonan?.form_miniplant) && permohonan.form_miniplant.length > 0) ||
      (Array.isArray(permohonan?.formMiniplant) && permohonan.formMiniplant.length > 0)
    )
  )

  const isSertifikasi = Boolean(!isPup && !isLsp && !isPelatihan && !isGrk && !isKalibrasi && !isPengujian && !isInspeksi && !isHalal && !isMiniplant)

  return {
    noOrder,
    status,
    isRevisi,
    isDraft,
    isDone,
    layananName,
    isPup,
    isLsp,
    isPelatihan,
    isGrk,
    isGrkValidasi,
    isKalibrasi,
    isInspeksi,
    isPengujian,
    isHalal,
    isMiniplant,
    isSertifikasi,
    namaPemohon,
    npwp,
    nib,
    noAkta,
    namaPimpinan,
    wakilManajemen,
    pic,
    phone,
    email,
    alamat,
    totalKaryawan,
    userPelanggan,
    detailPerusahaan,
    listPabrik,
  }
}
