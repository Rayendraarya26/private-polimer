// =============================================================================
// Type Definitions — Form Permohonan Jasa Inspeksi Karung Plastik (Banpang)
// Balai Besar Standardisasi dan Pelayanan Jasa Industri Kulit, Karet dan Plastik
// =============================================================================

export type JenisInspeksi = "kuantitas" | "kualitas"
export type BahasaLaporan = "indonesia" | "inggris"

export interface InspeksiDataPermohonan {
  no_surat_pemohon: string
  tgl_surat_pemohon: string
  tujuan_inspeksi: string
}

export interface InspeksiDataSpesifikasi {
  jenis_inspeksi: JenisInspeksi[]
  komoditas: string
  kapasitas_karung: string
  spesifikasi_dimensi: string
  jumlah_partai_lot: number
}

export interface InspeksiDataPelaksanaan {
  tgl_rencana_inspeksi: string
  lokasi_inspeksi: string
  bahasa_laporan: BahasaLaporan
}

export interface InspeksiDataPenerima {
  penerima_hasil_nama: string
  penerima_hasil_alamat: string
  penerima_hasil_email: string
}

export interface InspeksiDataBiaya {
  biaya_sama_dengan_pemohon: boolean
  biaya_nama: string
  biaya_alamat: string
  biaya_email: string
}

export interface InspeksiDataPic {
  pemohon_pic_nama: string
  pemohon_pic_kontak: string
  pemohon_pic_alamat: string
}

export interface InspeksiFormData {
  dataPermohonan: InspeksiDataPermohonan
  dataSpesifikasi: InspeksiDataSpesifikasi
  dataPelaksanaan: InspeksiDataPelaksanaan
  dataPenerima: InspeksiDataPenerima
  dataBiaya: InspeksiDataBiaya
  dataPic: InspeksiDataPic
  file_surat_permohonan: File | null
  setuju_pernyataan: boolean
}

export const getTodayDateString = (): string => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export const initialInspeksiFormData = (): InspeksiFormData => ({
  dataPermohonan: {
    no_surat_pemohon: "",
    tgl_surat_pemohon: getTodayDateString(),
    tujuan_inspeksi: "Membuktikan mampu produksi kemasan beras bantuan pangan",
  },
  dataSpesifikasi: {
    jenis_inspeksi: ["kuantitas", "kualitas"],
    komoditas: "Karung Plastik Beras Bantuan Pangan",
    kapasitas_karung: "10 kg",
    spesifikasi_dimensi: "Kemasan beras 10kg, dimensi dan gramatur sesuai standar kemasan pangan",
    jumlah_partai_lot: 1,
  },
  dataPelaksanaan: {
    tgl_rencana_inspeksi: "",
    lokasi_inspeksi: "",
    bahasa_laporan: "indonesia",
  },
  dataPenerima: {
    penerima_hasil_nama: "Perum BULOG",
    penerima_hasil_alamat: "Jl. Jenderal Gatot Subroto Kav. 49, Jakarta Selatan",
    penerima_hasil_email: "",
  },
  dataBiaya: {
    biaya_sama_dengan_pemohon: true,
    biaya_nama: "",
    biaya_alamat: "",
    biaya_email: "",
  },
  dataPic: {
    pemohon_pic_nama: "",
    pemohon_pic_kontak: "",
    pemohon_pic_alamat: "",
  },
  file_surat_permohonan: null,
  setuju_pernyataan: false,
})
