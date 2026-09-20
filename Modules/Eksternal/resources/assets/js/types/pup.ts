export interface PupSkemaItem {
  kode_skema: string
  slug: string
  nama: string
  kategori: string
  harga_normal: number
  harga_promo: number
  is_in_situ: boolean
  requires_equipment: boolean
  equipment_group: 'termometer' | 'autoclave' | 'pressure_gauge' | 'digital_caliper' | 'stopwatch' | 'spektrofotometer' | null
  bundle_eligible?: boolean
  image: string
}

export interface SelectedSkemaItem {
  kode_skema: string
  slug: string
  nama_skema: string
  metode_kalibrasi_acuan: string
  is_in_situ: boolean
  tarif_pnbp: number
}

export interface PupEquipmentConfirmation {
  termometer?: {
    ice_point: boolean | null
    media_kalibrasi: string[]
    media_kalibrasi_lainnya?: string
    kedalaman_sensor_cm?: string
    rentang_suhu?: string
  }
  autoclave?: {
    metode_suhu: string
    metode_suhu_lainnya?: string
    metode_tekanan: string
    metode_tekanan_lainnya?: string
  }
  pressure_gauge?: {
    kemampuan_tekanan: string[]
    media_tekanan: string[]
    media_tekanan_lainnya?: string
    pernyataan_media: boolean
  }
  digital_caliper?: {
    alat_standar: string[]
    alat_standar_lainnya?: string
  }
  stopwatch?: {
    alat_standar: string[]
    alat_standar_lainnya?: string
    u95_cmc_detik: string
  }
  spektrofotometer?: {
    filter_holmium: string
    puncak_holmium: string[]
    puncak_holmium_lainnya?: string
    filter_didymium: string
    puncak_didymium: string[]
    puncak_didymium_lainnya?: string
    kalibrasi_akurasi_590nm: boolean | null
    filter_fotometrik: string[]
    filter_fotometrik_lainnya?: string
    titik_ukur_590nm: string[]
    titik_ukur_lainnya?: string
  }
}

export interface PupFormData {
  nama_pengisi: string
  email_pemohon: string
  nama_narahubung: string
  no_wa_narahubung: string
  nama_lab_kalibrasi: string
  alamat_lab_kalibrasi: string
  provinsi_lab?: string
  kota_kabupaten_lab: string
  email_official_lab: string
  nama_personil_pengesah: string
  jabatan_personil_pengesah: string
  periode_pendaftaran: string
  skema_items: SelectedSkemaItem[]
  konfirmasi_equipment: PupEquipmentConfirmation
  pernyataan_en_score: boolean
  pernyataan_proposal: boolean
}
