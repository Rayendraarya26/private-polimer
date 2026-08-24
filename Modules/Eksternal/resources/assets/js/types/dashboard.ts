export type ParamsStatisticLayanan = {
  tahun: number
}

export type StatisticLayanan = {
  total_all: number
  total_pembayaran: number
  total_proses: number
  total_selesai: number
  total_ditolak: number
}

export type LayananItem = {
  nama_layanan: string
  url: string
}

export type SliderItem = {
  description: string
  order: number
  url: string
  image: string
}

export type AdminDashboardKpi = {
  permohonan_masuk: number
  permohonan_growth: string
  menunggu_verifikasi: number
  sedang_uji: number
  siap_terbit: number
}

export type AdminUrgentPermohonan = {
  id: string
  raw_id: string
  pelanggan: string
  layanan: string
  jenis: string
  sla_hours: number
  status: string
  status_workflow: string
  deadline: string
}

export type AdminPnbpSummary = {
  realisasi_bulan_ini: number
  target_bulan_ini: number
  persentase_capaian: number
  breakdown: {
    pengujian_dan_sertifikasi: number
    sertifikasi_lsp: number
    bimtek_pelatihan: number
  }
}

export type AdminDashboardSummaryResponse = {
  kpi: AdminDashboardKpi
  urgent_permohonan: AdminUrgentPermohonan[]
  pnbp: AdminPnbpSummary
}