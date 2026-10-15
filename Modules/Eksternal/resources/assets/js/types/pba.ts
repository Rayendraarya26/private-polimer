export interface PbaProductItem {
  id: string
  nama: string
  deskripsi: string
  standar?: string
  satuan?: string
  is_featured?: boolean
}

export interface FormPbaPayload {
  nama_perusahaan: string
  alamat_perusahaan: string
  alamat_pengiriman: string
  provinsi_id?: string
  provinsi_nama?: string
  kabupaten_id?: string
  kabupaten_nama?: string
  contact_person: string
  no_kontak: string
  email: string
  produk_pesanan: string
  produk_lainnya?: string
  jumlah: number
  satuan?: string
  catatan?: string
  file_surat_permohonan?: File | null
  pernyataan_konfirmasi: boolean
}

export interface FormPbaDetail {
  id: string
  permohonan_id: string
  nama_perusahaan: string
  alamat_perusahaan: string
  alamat_pengiriman: string
  provinsi_id?: string
  provinsi_nama?: string
  kabupaten_id?: string
  kabupaten_nama?: string
  contact_person: string
  no_kontak: string
  email: string
  produk_pesanan: string
  produk_lainnya?: string
  jumlah: number
  satuan: string
  keterangan?: string
  catatan?: string
  file_surat_permohonan?: string
  pernyataan_konfirmasi: boolean
  disetujui_pada?: string
  created_at?: string
  updated_at?: string
}
