export type SertifikasiTipePengajuan = 'BARU' | 'PERPANJANG' | 'PERUBAHAN' | 'SURVEILANS'

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
}

export interface SertifikasiFormData {
  skema_id: string
  tipe_pengajuan: SertifikasiTipePengajuan
  referensi_sertifikasi_id?: string
  nama_perusahaan: string
  alamat_kantor: string
  kontak_person: string
  no_telp: string
  no_whatsapp: string
  email: string
  pabrik: SertifikasiPabrikItem[]
  items: SertifikasiProductItem[]
  dok_legalitas?: File | null
  dok_manual_mutu?: File | null
  dok_diagram_alir?: File | null
  dok_lainnya?: File | null
  kuesioner_kelayakan?: Record<string, any>
  setuju_syarat: boolean
}

export const emptyPabrik = (id: number | string = 0): SertifikasiPabrikItem => ({
  id,
  nama_pabrik: '',
  alamat_pabrik: '',
  kontak_pabrik: '',
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
})

export const initialSertifikasiFormData: SertifikasiFormData = {
  skema_id: '',
  tipe_pengajuan: 'BARU',
  nama_perusahaan: '',
  alamat_kantor: '',
  kontak_person: '',
  no_telp: '',
  no_whatsapp: '',
  email: '',
  pabrik: [emptyPabrik(0)],
  items: [emptyProductItem(0)],
  dok_legalitas: null,
  dok_manual_mutu: null,
  dok_diagram_alir: null,
  dok_lainnya: null,
  kuesioner_kelayakan: {
    sistem_mutu_berjalan: true,
    tersedia_peralatan_uji: true,
  },
  setuju_syarat: false,
}
