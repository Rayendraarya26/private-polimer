export type SertifikasiTipePengajuan = 'baru' | 'lama'

export interface SertifikasiPabrikItem {
  id: number | string
  nama_pabrik: string
  alamat_pabrik: string
  provinsi_id?: string
  kabupaten_id?: string
  kecamatan_id?: string
  kontak_pabrik?: string
  email_pabrik?: string
  jumlah_karyawan?: number
  luas_fasilitas?: string
}

export interface SertifikasiProductItem {
  id: number | string
  komoditi_id?: number
  nama_produk: string
  merk_dagang?: string
  tipe_jenis?: string
  standar_sni_iso?: string
  ruang_lingkup?: string
  estimasi_tarif?: number
  kapasitas_produksi?: string
}

export interface SertifikasiPengajuanItem {
  id: number | string
  jenis_pengajuan: SertifikasiTipePengajuan
  sertifikat_lama_id?: string
  sertifikat_lama_text?: string
  skema_id: string
  items: SertifikasiProductItem[]
  dok_legalitas?: File | null
  dok_manual_mutu?: File | null
  dok_diagram_alir?: File | null
  dok_lainnya?: File | null
}

export interface SertifikasiFormData {
  pengajuan: SertifikasiPengajuanItem[]
  nama_perusahaan: string
  nomor_akta_pendirian?: string
  nama_pemilik?: string
  nama_pimpinan?: string
  nama_wakil_manajemen?: string
  alamat_kantor: string
  kontak_person: string
  no_telp: string
  no_whatsapp: string
  email: string
  pabrik: SertifikasiPabrikItem[]
  kuesioner_kelayakan?: Record<string, any>
  setuju_syarat: boolean
}

export const emptyPabrik = (id: number | string = 0): SertifikasiPabrikItem => ({
  id,
  nama_pabrik: '',
  alamat_pabrik: '',
  kontak_pabrik: '',
  email_pabrik: '',
  jumlah_karyawan: 0,
  luas_fasilitas: '',
})

export const emptyProductItem = (id: number | string = 0): SertifikasiProductItem => ({
  id,
  nama_produk: '',
  merk_dagang: '',
  tipe_jenis: '',
  standar_sni_iso: 'SNI',
  ruang_lingkup: '',
  estimasi_tarif: 0,
  kapasitas_produksi: '',
})

export const emptyPengajuan = (id: number | string = 0): SertifikasiPengajuanItem => ({
  id,
  jenis_pengajuan: 'baru',
  sertifikat_lama_id: '',
  sertifikat_lama_text: '',
  skema_id: '',
  items: [emptyProductItem(0)],
  dok_legalitas: null,
  dok_manual_mutu: null,
  dok_diagram_alir: null,
  dok_lainnya: null,
})

export const initialSertifikasiFormData: SertifikasiFormData = {
  pengajuan: [emptyPengajuan(0)],
  nama_perusahaan: '',
  nomor_akta_pendirian: '',
  nama_pemilik: '',
  nama_pimpinan: '',
  nama_wakil_manajemen: '',
  alamat_kantor: '',
  kontak_person: '',
  no_telp: '',
  no_whatsapp: '',
  email: '',
  pabrik: [emptyPabrik(0)],
  kuesioner_kelayakan: {
    sistem_mutu_berjalan: true,
    tersedia_peralatan_uji: true,
  },
  setuju_syarat: false,
}
