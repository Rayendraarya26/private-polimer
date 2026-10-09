import { resolveGrkFormData } from "../../utils/grkHelpers"

interface PermohonanTypes {
  isAset?: boolean
  isPup: boolean
  isKalibrasi: boolean
  isInspeksi: boolean
  isPengujian: boolean
  isHalal: boolean
  isMiniplant: boolean
  isGrk: boolean
  isGrkValidasi: boolean
}

export function useFormDataResolver(
  permohonan: any,
  formData: any,
  types: PermohonanTypes,
  listPabrik?: any
) {
  const formAsetData = types.isAset
    ? (formData?.jenis_sewa
      ? formData
      : (Array.isArray(permohonan?.form_aset) && permohonan.form_aset.length > 0
        ? permohonan.form_aset[0]
        : (Array.isArray(permohonan?.formAset) && permohonan.formAset.length > 0
          ? permohonan.formAset[0]
          : formData)))
    : null

  const formPupData = types.isPup
    ? (formData?.nama_lab_kalibrasi
      ? formData
      : (Array.isArray(permohonan?.form_pup) && permohonan.form_pup.length > 0
        ? permohonan.form_pup[0]
        : (Array.isArray(permohonan?.formPup) && permohonan.formPup.length > 0
          ? permohonan.formPup[0]
          : formData)))
    : null

  const formKalibrasiData = types.isKalibrasi
    ? (formData?.hasil_kalibrasi_untuk
      ? formData
      : (Array.isArray(permohonan?.form_kalibrasi) && permohonan.form_kalibrasi.length > 0
        ? permohonan.form_kalibrasi[0]
        : (Array.isArray(permohonan?.formKalibrasi) && permohonan.formKalibrasi.length > 0
          ? permohonan.formKalibrasi[0]
          : formData)))
    : null

  const formInspeksiData = types.isInspeksi
    ? (formData?.penerima_hasil_nama
      ? formData
      : (Array.isArray(permohonan?.form_inspeksi) && permohonan.form_inspeksi.length > 0
        ? permohonan.form_inspeksi[0]
        : (Array.isArray(permohonan?.formInspeksi) && permohonan.formInspeksi.length > 0
          ? permohonan.formInspeksi[0]
          : formData)))
    : null

  const formPengujianData = types.isPengujian
    ? (Array.isArray(formData?.samples)
      ? formData
      : (Array.isArray(permohonan?.form_pengujian) && permohonan.form_pengujian.length > 0
        ? permohonan.form_pengujian[0]
        : (Array.isArray(permohonan?.formPengujian) && permohonan.formPengujian.length > 0
          ? permohonan.formPengujian[0]
          : formData)))
    : null

  const formHalalData = types.isHalal
    ? (formData?.jalur_pendaftaran
      ? formData
      : (Array.isArray(permohonan?.form_halal) && permohonan.form_halal.length > 0
        ? permohonan.form_halal[0]
        : (Array.isArray(permohonan?.formHalal) && permohonan.formHalal.length > 0
          ? permohonan.formHalal[0]
          : formData)))
    : null

  const formMiniplantData = types.isMiniplant
    ? (formData?.jasa_diminta || formData?.jenis_barang
      ? formData
      : (Array.isArray(permohonan?.form_miniplant) && permohonan.form_miniplant.length > 0
        ? permohonan.form_miniplant[0]
        : (Array.isArray(permohonan?.formMiniplant) && permohonan.formMiniplant.length > 0
          ? permohonan.formMiniplant[0]
          : formData)))
    : null

  const formGrkData = resolveGrkFormData(permohonan, formData, types.isGrk, types.isGrkValidasi)

  // Parse Items / Komoditas
  const parseItems = () => {
    let raw: any[] = []
    if (types.isPup && Array.isArray(formPupData?.items) && formPupData.items.length > 0) {
      raw = formPupData.items
    } else if (Array.isArray(formData?.items) && formData.items.length > 0) {
      raw = formData.items
    } else if (formData?.komoditas_json) {
      raw = Array.isArray(formData.komoditas_json)
        ? formData.komoditas_json
        : typeof formData.komoditas_json === "string"
          ? JSON.parse(formData.komoditas_json || "[]")
          : [formData.komoditas_json]
    } else if (Array.isArray(formData?.komoditis) && formData.komoditis.length > 0) {
      raw = formData.komoditis
    } else if (formData?.kuesioner_kelayakan?.komoditas) {
      raw = Array.isArray(formData.kuesioner_kelayakan.komoditas)
        ? formData.kuesioner_kelayakan.komoditas
        : [formData.kuesioner_kelayakan.komoditas]
    } else if (permohonan?.komoditi || formData?.komoditi) {
      const kVal = permohonan?.komoditi || formData?.komoditi
      raw = Array.isArray(kVal) ? kVal : [{ nama_produk: kVal }]
    }

    return (raw || []).map((it: any, index: number) => {
      if (typeof it === "string") {
        return {
          id: index,
          nama_produk: it,
          standar_sni_iso: null,
          merk_dagang: null,
          tipe_jenis: null,
          estimasi_tarif: 0,
        }
      }
      return {
        id: it.id || index,
        nama_produk: it.nama_produk || it.nama_skema || it.nama_komoditi || it.komoditi_nama || it.nama || it.komoditi || "Produk Terdaftar",
        standar_sni_iso: it.standar_sni_iso || it.metode_kalibrasi_acuan || it.sni || it.standar_sni || it.standar || null,
        merk_dagang: it.merk_dagang || it.kode_skema || it.merk || it.merek || null,
        tipe_jenis: it.tipe_jenis || (it.is_in_situ ? "In Situ (Yogyakarta)" : null) || it.tipe || it.jenis || null,
        estimasi_tarif: it.estimasi_tarif || it.tarif_pnbp || it.tarif || it.biaya || 0,
      }
    })
  }

  const items = parseItems()

  // Parse Pabrik / Fasilitas
  const parsePabriks = () => {
    if (listPabrik && listPabrik.length > 0) {
      return listPabrik
    }
    let raw: any[] = []
    if (Array.isArray(formData?.pabrik) && formData.pabrik.length > 0) {
      raw = formData.pabrik
    } else if (formData?.pabrik_json) {
      raw = Array.isArray(formData.pabrik_json)
        ? formData.pabrik_json
        : typeof formData.pabrik_json === "string"
          ? JSON.parse(formData.pabrik_json || "[]")
          : [formData.pabrik_json]
    } else if (Array.isArray(formData?.pabriks) && formData.pabriks.length > 0) {
      raw = formData.pabriks
    }
    return raw || []
  }

  const pabriks = parsePabriks()

  // Parse Dokumen Persyaratan
  const parseDocs = () => {
    const d: Record<string, string> = {}
    if (formData?.dokumen_persyaratan && typeof formData.dokumen_persyaratan === "object") {
      Object.entries(formData.dokumen_persyaratan).forEach(([k, v]) => {
        if (typeof v === "string" && v.trim()) d[k] = v
      })
    }
    const legacyFields: { key: string; label: string; val: any }[] = [
      { key: "surat_permohonan", label: "Surat Permohonan Sertifikasi", val: formData?.file_surat_permohonan },
      { key: "manual_mutu", label: "Manual Mutu / Dokumentasi SM", val: formData?.file_manual_mutu },
      { key: "proses_produksi", label: "Diagram Alir Proses Produksi", val: formData?.file_proses_produksi },
      { key: "denah_lokasi", label: "Denah / Tata Letak Pabrik", val: formData?.file_denah_lokasi },
      { key: "daftar_peralatan", label: "Daftar Peralatan & Kalibrasi", val: formData?.file_daftar_peralatan },
      { key: "pertanyaan_tambahan", label: "Kuesioner Kelayakan & Asesmen", val: formData?.file_pertanyaan_tambahan },
      { key: "dokumen_legalitas", label: "Dokumen Legalitas Perusahaan (NIB/NPWP/Akta)", val: formData?.dok_legalitas || formData?.file_dokumen_pendukung },
    ]
    legacyFields.forEach(({ key, val }) => {
      if (typeof val === "string" && val.trim() && !d[key]) {
        d[key] = val
      }
    })
    return d
  }

  const docs = parseDocs()

  // Dokumen Persetujuan Operator LS (Pernyataan Persetujuan)
  const pernyataanAttachment = Array.isArray(permohonan?.file_attachment)
    ? permohonan.file_attachment.find(
      (f: any) =>
        f?.kode === "PERNYATAAN_PERSETUJUAN" ||
        f?.nama?.toLowerCase().includes("pernyataan") ||
        f?.nama?.toLowerCase().includes("persetujuan")
    )
    : null

  const pernyataanFile =
    pernyataanAttachment?.file_url ||
    pernyataanAttachment?.path ||
    permohonan?.mohon_pernyataan_persetujuan_file ||
    null

  // Data Tracking Log & Jadwal Audit dari SIS
  const trackingLogs: any[] = Array.isArray(permohonan?.tracking_logs)
    ? permohonan.tracking_logs
    : Array.isArray(permohonan?.trackingLogs)
      ? permohonan.trackingLogs
      : []

  const jadwalTahap1Log = trackingLogs.find(
    (log: any) =>
      log?.milestone_code === "JADWAL_AUDIT_TAHAP_1" ||
      log?.judul?.toLowerCase().includes("jadwal audit tahap 1") ||
      log?.judul?.toLowerCase().includes("tahap 1")
  )
  const jadwalTahap1Meta = typeof jadwalTahap1Log?.metadata === "string"
    ? JSON.parse(jadwalTahap1Log.metadata || "{}")
    : (jadwalTahap1Log?.metadata || {})

  const tglMulaiThp1 = jadwalTahap1Meta?.tanggal_mulai || permohonan?.aud_thp1_tanggal_mulai || null
  const tglSelesaiThp1 = jadwalTahap1Meta?.tanggal_selesai || permohonan?.aud_thp1_tanggal_selesai || null
  const timAuditorThp1 = jadwalTahap1Meta?.tim_auditor || null
  const isJadwalThp1Ditetapkan = Boolean(tglMulaiThp1 || jadwalTahap1Log)

  // Tracking Log Milestone Siklus Audit Tahap 1 (SIS & Polimer)
  const temuanRevisiThp1Log = trackingLogs.find(
    (log: any) =>
      log?.milestone_code === "AUDIT_TAHAP_1_TEMUAN_REVISI" ||
      log?.judul?.toLowerCase().includes("temuan verifikasi dokumen")
  )

  const temuanDisetujuiLog = trackingLogs.find(
    (log: any) =>
      log?.milestone_code === "AUDIT_TAHAP_1_TEMUAN_DISETUJUI" ||
      log?.judul?.toLowerCase().includes("tindak lanjut & perbaikan temuan") ||
      log?.judul?.toLowerCase().includes("persetujuan temuan tahap 1")
  )

  const laporanTahap1Log = trackingLogs.find(
    (log: any) =>
      log?.milestone_code === "LAPORAN_AUDIT_TAHAP_1_SUBMITTED" ||
      log?.judul?.toLowerCase().includes("laporan audit tahap 1 selesai")
  )

  return {
    formAsetData,
    formPupData,
    formKalibrasiData,
    formInspeksiData,
    formPengujianData,
    formHalalData,
    formMiniplantData,
    formGrkData,
    items,
    pabriks,
    docs,
    pernyataanFile,
    trackingLogs,
    jadwalTahap1Meta,
    jadwalTahap1Log,
    tglMulaiThp1,
    tglSelesaiThp1,
    timAuditorThp1,
    isJadwalThp1Ditetapkan,
    temuanRevisiThp1Log,
    temuanDisetujuiLog,
    laporanTahap1Log,
  }
}
