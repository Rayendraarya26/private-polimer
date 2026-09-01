export type SertifikasiTipePengajuan = 'baru' | 'lama'

export interface DokumenPersyaratanItem {
  id: string
  nama: string
  keterangan: string
  wajib: boolean
  file: File | null
  fileName?: string
  fileUrl?: string
  fileSize?: string
  isFromProfile?: boolean
  templateUrl?: string
}

export interface SertifikasiPabrikItem {
  id: number | string
  nama_pabrik: string
  alamat_pabrik: string
  negara?: string
  provinsi_id?: string
  kabupaten_id?: string
  kecamatan_id?: string
  kode_pos?: string
  kontak_pabrik?: string
  no_hp?: string
  fax?: string
  email_pabrik?: string
  kegiatan_utama?: string
  jumlah_karyawan?: number
  luas_tanah?: number | string
  luas_bangunan?: number | string
  luas_fasilitas?: string
}

export interface SertifikasiProductItem {
  id: number | string
  komoditi_id?: number
  nama_produk: string
  merk_dagang?: string
  tipe_jenis?: string
  ukuran?: string
  standar_sni_iso?: string
  ruang_lingkup?: string
  satuan_produksi?: string
  kapasitas_produksi?: string
  estimasi_tarif?: number
  keterangan?: string
}

export interface SertifikasiPengajuanItem {
  id: number | string
  jenis_pengajuan: SertifikasiTipePengajuan
  sertifikat_lama_id?: string
  sertifikat_lama_text?: string
  skema_id: string
  items: SertifikasiProductItem[]
  dokumen_list?: DokumenPersyaratanItem[]
  dok_legalitas?: File | null
  dok_manual_mutu?: File | null
  dok_diagram_alir?: File | null
  dok_lainnya?: File | null
}

export interface SertifikasiFormData {
  pengajuan: SertifikasiPengajuanItem[]
  nama_perusahaan: string
  badan_hukum?: string
  jenis_perusahaan?: string
  nomor_akta_pendirian?: string
  nama_pemilik?: string
  nama_pimpinan?: string
  nama_wakil_manajemen?: string
  alamat_kantor: string
  negara?: string
  provinsi?: string
  kabupaten?: string
  kecamatan?: string
  kode_pos?: string
  kontak_person: string
  no_telp: string
  no_whatsapp: string
  fax?: string
  email: string
  // Ketenagakerjaan
  jumlah_karyawan_total?: number
  jumlah_manajemen?: number
  jumlah_administrasi?: number
  jumlah_operasional?: number
  jumlah_part_time?: number
  jumlah_non_permanen?: number
  jumlah_shift?: number
  jumlah_shift_1?: number
  jumlah_shift_2?: number
  jumlah_shift_3?: number
  jumlah_bagian?: number
  luas_tanah?: number | string
  luas_bangunan?: number | string
  file_berkas_gabungan?: File | null
  pabrik: SertifikasiPabrikItem[]
  kuesioner_kelayakan?: Record<string, any>
  setuju_syarat: boolean
}

export const defaultDokumenList: DokumenPersyaratanItem[] = [
  {
    id: "surat_permohonan",
    nama: "Surat Permohonan Sertifikasi (SPPT SNI)",
    keterangan: "Format PDF maks. 5MB (Ditandatangani pimpinan/direktur)",
    wajib: true,
    file: null,
    templateUrl: "/files/pengajuan/sertifikasi/F.01.01_Formulir_Permohonan_Sertifikasi_Rev_17.docx",
  },
  {
    id: "legalitas_perusahaan",
    nama: "Akta Pendirian Perusahaan & SK Kemenkumham / SK Nomenklatur",
    keterangan: "Format PDF maks. 10MB",
    wajib: true,
    file: null,
  },
  {
    id: "nib_iui",
    nama: "Nomor Induk Berusaha (NIB) / Izin Usaha Industri (IUI/IUP)",
    keterangan: "Format PDF maks. 5MB",
    wajib: true,
    file: null,
  },
  {
    id: "npwp_perusahaan",
    nama: "Nomor Pokok Wajib Pajak (NPWP)",
    keterangan: "Format PDF maks. 5MB",
    wajib: true,
    file: null,
  },
  {
    id: "sertifikat_merek",
    nama: "Sertifikat Merek / Bukti Pendaftaran Merek (DJKI)",
    keterangan: "Format PDF maks. 5MB (Surat pelimpahan jika merek pihak lain)",
    wajib: true,
    file: null,
  },
  {
    id: "sistem_mutu",
    nama: "Sertifikat Sistem Manajemen Mutu (ISO 9001) / Manual Mutu",
    keterangan: "Format PDF maks. 10MB",
    wajib: false,
    file: null,
    templateUrl: "/files/pengajuan/sertifikasi/F.01.02_Daftar_Pertanyaan_Penilaian_Mandiri_Rev_13.docx",
  },
  {
    id: "alur_produksi",
    nama: "Diagram Alir Proses Produksi & Denah/Layout Pabrik",
    keterangan: "Format PDF maks. 5MB",
    wajib: false,
    file: null,
  },
]

export const emptyPabrik = (id: number | string = 0): SertifikasiPabrikItem => ({
  id,
  nama_pabrik: '',
  alamat_pabrik: '',
  negara: 'Indonesia',
  kontak_pabrik: '',
  no_hp: '',
  fax: '',
  email_pabrik: '',
  kegiatan_utama: '',
  jumlah_karyawan: 0,
  luas_tanah: '',
  luas_bangunan: '',
  luas_fasilitas: '',
})

export const emptyProductItem = (id: number | string = 0): SertifikasiProductItem => ({
  id,
  nama_produk: '',
  merk_dagang: '',
  tipe_jenis: '',
  ukuran: '',
  standar_sni_iso: 'SNI',
  ruang_lingkup: '',
  satuan_produksi: 'Unit/Tahun',
  kapasitas_produksi: '',
  estimasi_tarif: 0,
  keterangan: '',
})

export const emptyPengajuan = (id: number | string = 0): SertifikasiPengajuanItem => ({
  id,
  jenis_pengajuan: 'baru',
  sertifikat_lama_id: '',
  sertifikat_lama_text: '',
  skema_id: '',
  items: [],
  dokumen_list: defaultDokumenList.map((d) => ({ ...d })),
  dok_legalitas: null,
  dok_manual_mutu: null,
  dok_diagram_alir: null,
  dok_lainnya: null,
})

export const initialSertifikasiFormData: SertifikasiFormData = {
  pengajuan: [emptyPengajuan(0)],
  nama_perusahaan: '',
  badan_hukum: 'PT',
  jenis_perusahaan: 'Swasta Nasional',
  nomor_akta_pendirian: '',
  nama_pemilik: '',
  nama_pimpinan: '',
  nama_wakil_manajemen: '',
  alamat_kantor: '',
  negara: 'Indonesia',
  provinsi: '',
  kabupaten: '',
  kecamatan: '',
  kode_pos: '',
  kontak_person: '',
  no_telp: '',
  no_whatsapp: '',
  fax: '',
  email: '',
  jumlah_karyawan_total: 0,
  jumlah_manajemen: 0,
  jumlah_administrasi: 0,
  jumlah_operasional: 0,
  jumlah_part_time: 0,
  jumlah_non_permanen: 0,
  jumlah_shift: 1,
  jumlah_shift_1: 0,
  jumlah_shift_2: 0,
  jumlah_shift_3: 0,
  jumlah_bagian: 1,
  luas_tanah: '',
  luas_bangunan: '',
  file_berkas_gabungan: null,
  pabrik: [emptyPabrik(0)],
  kuesioner_kelayakan: {
    sistem_mutu_berjalan: true,
    tersedia_peralatan_uji: true,
  },
  setuju_syarat: false,
}
