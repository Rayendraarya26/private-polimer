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