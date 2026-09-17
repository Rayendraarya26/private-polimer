// =============================================================================
// Type Definitions — Form Permohonan Pengujian Laboratorium Sisi Klien
// Balai Besar Kulit, Karet, dan Plastik (BBKKP)
// =============================================================================

export type BahasaLaporan = "id" | "en"
export type CaraPembayaran = "tunai" | "transfer" | "dibayar_di_belakang"
export type KategoriTarif = "umum" | "mahasiswa_pp54"
export type JenisUji = "regular" | "profisiensi" | "banding_lab"

export type BentukSampel =
  | "Serbuk"
  | "Butiran / Granul"
  | "Lembaran / Film"
  | "Cairan"
  | "Barang Jadi"
  | "Lainnya"

export type KondisiSampel = "Baik" | "Rusak" | "Tersegel" | "Terbuka"

/**
 * Model Master Parameter Uji (Metode, Satuan, & Tarif PNBP)
 */
export interface MasterParameterUji {
  id: number
  komoditi_id: number
  kode: string
  nama: string
  metode_uji: string
  satuan: string
  tarif_umum: number
  tarif_mahasiswa: number
  deskripsi?: string
  is_active?: boolean
}

/**
 * Model Master Komoditas / Ruang Lingkup Laboratorium
 */
export interface MasterKomoditi {
  id: number
  kode: string
  nama: string
  ruang_lingkup: string
  parameters_count?: number
  parameters?: MasterParameterUji[]
  is_active?: boolean
}

/**
 * Data Item Sampel Individual (Multi-Sample Builder)
 */
export interface PengujianSampleItem {
  id: number // Client-side tracking ID
  nama_sampel: string
  bentuk_sampel: string
  jumlah_sampel: number
  satuan_sampel: string
  no_lot_bets: string
  kondisi_sampel: string
  master_komoditi_id: number | null
  komoditi_nama?: string
  selected_parameters: MasterParameterUji[]
  foto_sampel: File | null
  foto_sampel_preview?: string
  catatan_khusus?: string
}

/**
 * Data Bersama & Administratif Formulir Pengujian
 */
export interface PengujianSharedData {
  // Step 1: Bahasa Laporan
  bahasa_laporan: BahasaLaporan

  // Step 2: Data Permintaan & Administrasi
  tanggal_permohonan: string
  biaya_ditanggung_oleh: string
  laporan_dialamatkan_kepada: string
  permintaan_evaluasi: boolean
  catatan_evaluasi: string
  menyaksikan_uji: boolean
  catatan_menyaksikan: string
  cara_pembayaran: CaraPembayaran
  kategori_tarif: KategoriTarif
  jenis_uji: JenisUji
  keterangan_uji: string

  // Step 4: Tambahan Berkas & Konfirmasi
  no_surat_pengantar: string
  tgl_surat_pengantar: string
  file_surat_pengantar: File | null
  file_ktm: File | null // Wajib jika kategori_tarif === 'mahasiswa_pp54'
  setuju_syarat: boolean
}

/**
 * Factory untuk membuat baris sampel baru yang bersih
 */
export const emptyPengujianSample = (id: number): PengujianSampleItem => ({
  id,
  nama_sampel: "",
  bentuk_sampel: "Lembaran / Film",
  jumlah_sampel: 1,
  satuan_sampel: "Pcs",
  no_lot_bets: "",
  kondisi_sampel: "Baik",
  master_komoditi_id: null,
  komoditi_nama: "",
  selected_parameters: [],
  foto_sampel: null,
  foto_sampel_preview: undefined,
  catatan_khusus: "",
})

/**
 * Format tanggal hari ini dalam format YYYY-MM-DD
 */
export const getTodayDateString = (): string => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Nilai inisialisasi awal formulir data bersama
 */
export const initialPengujianSharedData: PengujianSharedData = {
  bahasa_laporan: "id",
  tanggal_permohonan: getTodayDateString(),
  biaya_ditanggung_oleh: "",
  laporan_dialamatkan_kepada: "",
  permintaan_evaluasi: false,
  catatan_evaluasi: "",
  menyaksikan_uji: false,
  catatan_menyaksikan: "",
  cara_pembayaran: "transfer",
  kategori_tarif: "umum",
  jenis_uji: "regular",
  keterangan_uji: "",
  no_surat_pengantar: "",
  tgl_surat_pengantar: "",
  file_surat_pengantar: null,
  file_ktm: null,
  setuju_syarat: false,
}

/**
 * Helper menghitung subtotal tarif satu sampel berdasarkan kategori tarif pemohon
 */
export const calculateSampleSubtotal = (
  sample: PengujianSampleItem,
  kategoriTarif: KategoriTarif
): number => {
  if (!sample.selected_parameters || sample.selected_parameters.length === 0) return 0
  const multiplier = sample.jumlah_sampel > 0 ? sample.jumlah_sampel : 1
  const paramSum = sample.selected_parameters.reduce((sum, param) => {
    const rate = kategoriTarif === "mahasiswa_pp54" ? param.tarif_mahasiswa : param.tarif_umum
    return sum + (rate || 0)
  }, 0)
  return paramSum * multiplier
}

/**
 * Helper menghitung grand total seluruh sampel
 */
export const calculateGrandTotal = (
  samples: PengujianSampleItem[],
  kategoriTarif: KategoriTarif
): number => {
  return samples.reduce((acc, sample) => acc + calculateSampleSubtotal(sample, kategoriTarif), 0)
}
