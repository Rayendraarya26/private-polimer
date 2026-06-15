export interface ParticipantData {
  id: number
  nama_lengkap: string
  gender: string
  tempat_lahir: string
  tanggal_lahir: string
  pendidikan: string
  whatsapp: string
  alamat_peserta: string
  email: string
  nik_peserta: string
  agama: string
  ktp_peserta: File | null
  foto_peserta: File | null

  // Tambahan Field LSP (Jadikan opsional jika tidak selalu ada)
  kewarganegaraan?: string;
  kode_pos?: string;
  jabatan?: string;
  pengalaman_kerja?: string;
  ijazah?: File | null;
  apl_01?: File | null;
  apl_02?: File | null;
  upload_lainya?: File | null;
}

export interface SharedData {
  nama_instansi: string
  alamat_instansi: string
  jenis_produk: string
  masalah_materi: string
  hal_dipelajari: string
  program: string
  setuju_syarat: boolean
  billing_type: "together" | "split"
}

export const emptyParticipant = (id: number): ParticipantData => ({
  id,
  nama_lengkap: '', gender: '', tempat_lahir: '', tanggal_lahir: '',
  pendidikan: '', whatsapp: '', alamat_peserta: '', email: '',
  nik_peserta: '', agama: '', ktp_peserta: null, foto_peserta: null,
  kewarganegaraan: undefined, kode_pos: undefined, jabatan: undefined, pengalaman_kerja: undefined, ijazah: undefined, apl_01: undefined, apl_02: undefined, upload_lainya: undefined,
})

export const initialSharedData: SharedData = {
  nama_instansi: '', alamat_instansi: '', jenis_produk: '',
  masalah_materi: '', hal_dipelajari: '', program: '', setuju_syarat: false, billing_type: 'together',
}