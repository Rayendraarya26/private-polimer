/**
 * Workflow step definitions per service type.
 * Each step has a `key` (matching backend status), `label`, and `desc`.
 */
export interface WorkflowStep {
  key: string
  label: string
  desc: string
}

export const WORKFLOW_STEPS: Record<string, WorkflowStep[]> = {
  sertifikasi: [
    { key: "PERMOHONAN",     label: "Pengajuan",         desc: "Formulir & Dokumen" },
    { key: "KAJIAN_TEKNIS",  label: "Kajian Teknis",     desc: "Review LSPro & PJT" },
    { key: "PENAWARAN_BIAYA",label: "Penawaran Biaya",   desc: "Persetujuan Tarif" },
    { key: "PEMBAYARAN",     label: "Pembayaran",        desc: "Invoice & Kuitansi" },
    { key: "PROCESS",        label: "Audit & Sertifikat",desc: "Penjadwalan & SNI" },
  ],
  pup: [
    { key: "PERMOHONAN",     label: "Pendaftaran",       desc: "Formulir & Pilihan Skema" },
    { key: "KAJIAN_TEKNIS",  label: "Verifikasi Berkas", desc: "Review Teknis Panitia UP" },
    { key: "PEMBAYARAN",     label: "Pembayaran PNBP",   desc: "Invoice & Virtual Account" },
    { key: "PROCESS",        label: "Sirkulasi Artefak", desc: "Distribusi & Kalibrasi" },
    { key: "DONE",           label: "Evaluasi En",       desc: "Laporan Hasil & Nilai En" },
  ],
  pelatihan: [
    { key: "PERMOHONAN",     label: "Pendaftaran",       desc: "Formulir & Peserta" },
    { key: "KAJIAN_TEKNIS",  label: "Verifikasi",        desc: "Kajian Kebutuhan Bimtek" },
    { key: "PENAWARAN_BIAYA",label: "Penawaran Biaya",   desc: "Estimasi Biaya" },
    { key: "PEMBAYARAN",     label: "Pembayaran",        desc: "Invoice & Billing" },
    { key: "PROCESS",        label: "Pelaksanaan",       desc: "Bimtek & E-Sertifikat" },
  ],
  lsp: [
    { key: "PERMOHONAN",     label: "Pendaftaran",       desc: "Formulir & Portofolio" },
    { key: "KAJIAN_TEKNIS",  label: "Pra-Asesmen",       desc: "Verifikasi Berkas APL" },
    { key: "PENAWARAN_BIAYA",label: "Biaya Asesmen",     desc: "Tarif Uji Kompetensi" },
    { key: "PEMBAYARAN",     label: "Pembayaran",        desc: "Invoice & Billing" },
    { key: "PROCESS",        label: "Uji Kompetensi",    desc: "Asesmen & Sertifikat BNSP" },
  ],
  grk: [
    { key: "PERMOHONAN",     label: "Pengajuan",         desc: "Data Proyek & Emisi" },
    { key: "KAJIAN_TEKNIS",  label: "Kajian Awal",       desc: "Metodologi & Lingkup" },
    { key: "PENAWARAN_BIAYA",label: "Penawaran Biaya",   desc: "Biaya Verifikasi" },
    { key: "PEMBAYARAN",     label: "Pembayaran",        desc: "Invoice & Billing" },
    { key: "PROCESS",        label: "Validasi/Verifikasi",desc: "Audit Emisi & Laporan Opini" },
  ],
  kalibrasi: [
    { key: "PERMOHONAN",     label: "Pengajuan",              desc: "Formulir & Daftar Alat" },
    { key: "KAJIAN_TEKNIS",  label: "Kajian Teknis",          desc: "Review Kemampuan Labkal" },
    { key: "PENAWARAN_BIAYA",label: "Penawaran Biaya",        desc: "Estimasi Biaya PNBP" },
    { key: "PEMBAYARAN",     label: "Pembayaran",             desc: "Invoice & Billing" },
    { key: "PROCESS",        label: "Pelaksanaan Kalibrasi",  desc: "Pengukuran & Kalibrasi" },
    { key: "DONE",           label: "Sertifikat Terbit",      desc: "Sertifikat Kalibrasi Resmi" },
  ],
  inspeksi: [
    { key: "PERMOHONAN",     label: "Pengajuan",              desc: "Formulir & Dokumen Karung" },
    { key: "KAJIAN_TEKNIS",  label: "Kajian Teknis",          desc: "Review Tim Inspektur" },
    { key: "PENAWARAN_BIAYA",label: "Penawaran Biaya",        desc: "Estimasi Biaya" },
    { key: "PEMBAYARAN",     label: "Pembayaran",             desc: "Invoice & Billing" },
    { key: "PROCESS",        label: "Pelaksanaan Inspeksi",   desc: "Pemeriksaan Lapangan" },
    { key: "DONE",           label: "Laporan Terbit",         desc: "Sertifikat Hasil Inspeksi" },
  ],
  pengujian: [
    { key: "PERMOHONAN",     label: "Pengajuan",         desc: "Formulir & Daftar Sampel" },
    { key: "KAJIAN_TEKNIS",  label: "Kajian Teknis",     desc: "Kaji Ulang Permintaan Lab" },
    { key: "PENAWARAN_BIAYA",label: "Penawaran Biaya",   desc: "Estimasi Biaya PNBP" },
    { key: "PEMBAYARAN",     label: "Pembayaran",        desc: "Invoice & Billing" },
    { key: "PROCESS",        label: "Pengujian Lab",     desc: "Pengujian Fisika & Kimia" },
    { key: "DONE",           label: "LHU Terbit",        desc: "Laporan Hasil Uji (LHU) Resmi" },
  ],
  halal: [
    { key: "PERMOHONAN",     label: "Pengajuan",              desc: "Formulir & Dokumen Pelaku Usaha" },
    { key: "KAJIAN_TEKNIS",  label: "Verifikasi Berkas",      desc: "Verifikasi Kelayakan & Dokumen" },
    { key: "PENAWARAN_BIAYA",label: "Penawaran Biaya",        desc: "Kajian Biaya LPH (Jika Reguler)" },
    { key: "PEMBAYARAN",     label: "Pembayaran",             desc: "Invoice / Fasilitasi SEHATI" },
    { key: "PROCESS",        label: "Pemeriksaan / Audit",    desc: "Audit Lapangan & Sidang Fatwa" },
    { key: "DONE",           label: "Sertifikat Terbit",      desc: "Ketetapan Halal & Sertifikat BPJPH" },
  ],
  miniplant: [
    { key: "PERMOHONAN",     label: "Pengajuan",              desc: "Formulir & Daftar Perlakuan" },
    { key: "KAJIAN_TEKNIS",  label: "Kajian Teknis",          desc: "Review Tim Miniplant" },
    { key: "PENAWARAN_BIAYA",label: "Penawaran Biaya",        desc: "Estimasi Biaya PNBP" },
    { key: "PEMBAYARAN",     label: "Pembayaran",             desc: "Invoice & Billing" },
    { key: "PROCESS",        label: "Pelaksanaan Miniplant",  desc: "Pengolahan & Pengerjaan Mesin" },
    { key: "DONE",           label: "Selesai",                desc: "Barang Selesai Diproses" },
  ],
}

/**
 * Returns the appropriate workflow steps array based on service type flags.
 */
export const getWorkflowSteps = (flags: {
  isPup: boolean
  isPelatihan: boolean
  isLsp: boolean
  isGrk: boolean
  isKalibrasi: boolean
  isInspeksi: boolean
  isPengujian: boolean
  isHalal: boolean
  isMiniplant: boolean
}): WorkflowStep[] => {
  if (flags.isPup)       return WORKFLOW_STEPS.pup
  if (flags.isPelatihan) return WORKFLOW_STEPS.pelatihan
  if (flags.isLsp)       return WORKFLOW_STEPS.lsp
  if (flags.isGrk)       return WORKFLOW_STEPS.grk
  if (flags.isKalibrasi) return WORKFLOW_STEPS.kalibrasi
  if (flags.isInspeksi)  return WORKFLOW_STEPS.inspeksi
  if (flags.isPengujian) return WORKFLOW_STEPS.pengujian
  if (flags.isHalal)     return WORKFLOW_STEPS.halal
  if (flags.isMiniplant) return WORKFLOW_STEPS.miniplant
  return WORKFLOW_STEPS.sertifikasi
}
