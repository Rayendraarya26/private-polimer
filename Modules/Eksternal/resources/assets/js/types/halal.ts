export type JalurPendaftaran = "reguler" | "self_declare"
export type JenisPendaftaran = "baru" | "pengembangan"
export type SkalaUsaha = "mikro" | "kecil" | "menengah" | "besar" | "luar_negeri"

export interface PabrikItem {
  id: string
  nama: string
  alamat: string
  status_pabrik: string // "Milik Sendiri" | "Sewa" | "Kerjasama"
}

export interface OutletItem {
  id: string
  nama: string
  alamat: string
}

export interface BahanHalalItem {
  id: string
  jenis_bahan: string // "Bahan Baku" | "Bahan Tambahan/Penolong" | "Cleaning Agent" | "Kemasan"
  nama_bahan: string
  produsen: string
  supplier?: string
  lembaga_penerbit?: string // misal: "BPJPH", "MUI", dll.
  no_sertifikat?: string
  tgl_berlaku?: string
  is_bersertifikat?: boolean
}

export interface ProdukHalalItem {
  id: string
  klasifikasi: string // "Makanan", "Minuman", "Barang Gunaan", dll.
  rincian: string
  nama_produk: string
  merk?: string
  foto?: File | null
  foto_url?: string
}

export interface KuesionerSelfDeclare {
  is_mikro_kecil: boolean
  is_produk_tidak_berisiko: boolean
  is_bahan_pasti_halal: boolean
  is_proses_sederhana: boolean
  is_alat_manual_semi: boolean
  is_bebas_najis: boolean
}

export interface FormHalalPayload {
  // 1. Data Pengajuan & Profil Usaha
  dataPengajuan: {
    jalur_pendaftaran: JalurPendaftaran
    jenis_pendaftaran: JenisPendaftaran
    kode_fasilitasi?: string
  }
  kuesionerSelfDeclare: KuesionerSelfDeclare
  dataPelakuUsaha: {
    nama_usaha: string
    skala_usaha: SkalaUsaha
    nib: string
    npwp: string
    pj_nama: string
    pj_kontak: string
    pj_email: string
    pj_alamat: string
  }

  // 2. Data Fasilitas Pabrik & Outlet
  dataFasilitas: {
    pabrik: PabrikItem[]
    outlet: OutletItem[]
  }
  file_denah_lokasi: File | null

  // 3. Data Penyelia Halal
  dataPenyelia: {
    penyelia_nama: string
    penyelia_nik: string
    penyelia_agama: string
    penyelia_kontak: string
    penyelia_no_sk: string
    penyelia_tgl_sk: string
    penyelia_no_sertifikat: string
    penyelia_tgl_sertifikat: string
  }
  file_sk_penyelia: File | null
  file_ktp_penyelia: File | null
  file_sertifikat_penyelia: File | null

  // 4. Data Bahan & Produk
  dataBahan: BahanHalalItem[]
  dataProduk: ProdukHalalItem[]
  alur_proses: string
  file_alur_proses: File | null

  // 5. Berkas & Pernyataan
  file_surat_permohonan: File | null
  file_manual_sjph: File | null
  pernyataan_bebas_babi: boolean
  pernyataan_komitmen_sjph: boolean
}

export const initialFormHalalPayload: FormHalalPayload = {
  dataPengajuan: {
    jalur_pendaftaran: "reguler",
    jenis_pendaftaran: "baru",
    kode_fasilitasi: "",
  },
  kuesionerSelfDeclare: {
    is_mikro_kecil: true,
    is_produk_tidak_berisiko: true,
    is_bahan_pasti_halal: true,
    is_proses_sederhana: true,
    is_alat_manual_semi: true,
    is_bebas_najis: true,
  },
  dataPelakuUsaha: {
    nama_usaha: "",
    skala_usaha: "mikro",
    nib: "",
    npwp: "",
    pj_nama: "",
    pj_kontak: "",
    pj_email: "",
    pj_alamat: "",
  },
  dataFasilitas: {
    pabrik: [
      {
        id: "pabrik-1",
        nama: "Fasilitas Produksi Utama",
        alamat: "",
        status_pabrik: "Milik Sendiri",
      },
    ],
    outlet: [],
  },
  file_denah_lokasi: null,
  dataPenyelia: {
    penyelia_nama: "",
    penyelia_nik: "",
    penyelia_agama: "Islam",
    penyelia_kontak: "",
    penyelia_no_sk: "",
    penyelia_tgl_sk: "",
    penyelia_no_sertifikat: "",
    penyelia_tgl_sertifikat: "",
  },
  file_sk_penyelia: null,
  file_ktp_penyelia: null,
  file_sertifikat_penyelia: null,
  dataBahan: [
    {
      id: "bahan-1",
      jenis_bahan: "Bahan Baku",
      nama_bahan: "",
      produsen: "",
      supplier: "",
      lembaga_penerbit: "BPJPH",
      no_sertifikat: "",
      tgl_berlaku: "",
      is_bersertifikat: true,
    },
    {
      id: "bahan-2",
      jenis_bahan: "Cleaning Agent",
      nama_bahan: "Sabun Pembersih Food Grade",
      produsen: "",
      supplier: "",
      lembaga_penerbit: "BPJPH",
      no_sertifikat: "",
      tgl_berlaku: "",
      is_bersertifikat: true,
    },
    {
      id: "bahan-3",
      jenis_bahan: "Kemasan",
      nama_bahan: "Plastik Kemasan Pangan Primer",
      produsen: "",
      supplier: "",
      lembaga_penerbit: "",
      no_sertifikat: "",
      tgl_berlaku: "",
      is_bersertifikat: false,
    },
  ],
  dataProduk: [
    {
      id: "prod-1",
      klasifikasi: "Makanan",
      rincian: "Produk Olahan",
      nama_produk: "",
      merk: "",
      foto: null,
    },
  ],
  alur_proses: "",
  file_alur_proses: null,
  file_surat_permohonan: null,
  file_manual_sjph: null,
  pernyataan_bebas_babi: true,
  pernyataan_komitmen_sjph: true,
}
