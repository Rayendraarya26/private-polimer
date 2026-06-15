export interface ParticipantLSP {
  id: number
  nama_lengkap: string
  gender: string
  tempat_lahir: string
  tanggal_lahir: string
  nik_peserta: string
  kewarganegaraan: string
  kode_pos: string
  pendidikan: string
  whatsapp: string
  email: string
  alamat_peserta: string
  jabatan: string
  pengalaman_kerja: string
  ktp_peserta: File | null
  ijazah: File | null
  apl_01: File | null
  apl_02: File | null
  upload_lainya: File | null
}

export interface SharedDataLSP {
  nama_instansi: string
  alamat_instansi: string
  jenis_produk: string
  setuju_syarat: boolean
  billing_type: 'together' | 'split'
}

export const emptyParticipantLSP = (id: number): ParticipantLSP => ({
  id,
  nama_lengkap: '',
  gender: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  nik_peserta: '',
  kewarganegaraan: '',
  kode_pos: '',
  pendidikan: '',
  whatsapp: '',
  email: '',
  alamat_peserta: '',

  jabatan: '',
  pengalaman_kerja: '',


  ktp_peserta: null,
  ijazah: null,
  apl_01: null,
  apl_02: null,
  upload_lainya: null,
})


export const initialSharedDataLSP: SharedDataLSP = {
  nama_instansi: '',
  alamat_instansi: '',
  jenis_produk: '',
  setuju_syarat: false,
  billing_type: 'together'
}

