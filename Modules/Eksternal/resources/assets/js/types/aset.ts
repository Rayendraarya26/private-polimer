export type JenisSewaValue =
  | 'sewa_lapangan'
  | 'sewa_bangunan'
  | 'sewa_alat'
  | 'sewa_mobil'
  | 'sewa_ruangan'

export interface JenisSewaOption {
  value: JenisSewaValue | string
  label: string
  desc?: string
}

export interface FormAsetPayload {
  jenis_sewa: string
  tanggal_mulai: string
  tanggal_selesai: string
  durasi_hari?: number
  keperluan_penggunaan: string
  catatan_tambahan?: string

  // Snapshot Identitas Pemohon
  pemohon_nama?: string
  pemohon_nik_nib?: string
  pemohon_alamat?: string
  pemohon_telepon?: string
  pemohon_email?: string

  // Berkas & Integritas
  file_surat_permohonan?: File | null
  setuju_pernyataan: boolean
}

export interface FormAsetDetail {
  id: string
  permohonan_id: string
  jenis_sewa: string
  tanggal_mulai: string
  tanggal_selesai: string
  durasi_hari: number
  keperluan_penggunaan: string
  catatan_tambahan?: string | null

  pemohon_nama: string
  pemohon_nik_nib?: string | null
  pemohon_alamat?: string | null
  pemohon_telepon?: string | null
  pemohon_email?: string | null

  file_surat_permohonan?: string | null
  setuju_pernyataan: boolean
  pernyataan_at?: string | null

  created_at?: string
  updated_at?: string

  permohonan?: {
    id: string
    no_permohonan: string
    status_workflow: string
    status_bayar: string
    total_harga?: number
    created_at?: string
    tgl_order?: string
    trackingLogs?: Array<{
      id: string
      milestone_code: string
      judul: string
      deskripsi: string
      created_at: string
    }>
    [key: string]: any
  }
}
