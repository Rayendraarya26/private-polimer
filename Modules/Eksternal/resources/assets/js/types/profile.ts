import { YesNoOption } from "./core"

export type ProfileType = {
  id: string
  name: string
  nip: string | null
  email: string
  force_update_password: boolean
  picture: string | null
  last_login: string
  group?: {
    id: string
    name: string
  }
  detail?: {
    type: ProfileClientType
    nama?: string
    pimpinan?: string
    alamat?: string
    telepon?: string
    fax?: string
    surel?: string
    whatsapp?: string
    npwp?: string
    nib?: string
    sk_nomenklatur?: string
    badan_hukum?: string
    iup?: string
    jenis?: string
    no_akta_pendirian?: string
    pemilik?: string
    pj_nama?: string
    pj_whatsapp?: string
    pj_surel?: string
    dok_npwp?: string | null
    dok_nib?: string | null
    dok_sk_nomenklatur?: string | null
    dok_akta_pendirian?: string | null
    dok_iup?: string | null
    dok_lainnya?: string | null
    jenis_kelamin?: PelangganGender
    kewarganegaraan?: string | null
    nik?: number | null
    pendidikan_terakhir?: string | null
    tempat_lahir?: string | null
    tanggal_lahir?: string | null
    whatsapp_verified?: YesNoOption
    pj_whatsapp_verified?: YesNoOption
  }
}

export enum ProfileClientType {
  BADAN_USAHA = 'Badan Usaha',
  INSTANSI_PEMERINTAH = 'Instansi Pemerintah',
  PERORANGAN = 'Perorangan',
}

export enum PerusahaanBadanHukumType {
  PT = 'PT',
  CV = 'CV',
  KOPERASI = 'Koperasi',
  OTHER = 'Lainnya'
}

export enum PerusahaanJenisType {
  PMA = 'PMA',
  PMDN = 'PMDN',
  BUMN = 'BUMN',
  SWASTA = 'Swasta',
  OTHER = 'Lainnya'
}

export enum PelangganGender {
  MALE = 'Laki-laki',
  FEMALE = 'Perempuan'
}