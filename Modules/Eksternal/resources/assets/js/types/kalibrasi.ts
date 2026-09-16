export interface KalibrasiItem {
  id: number
  nama_alat: string
  merek: string
  tipe_model: string
  no_seri: string
  kapasitas_rentang: string
  resolusi: string
  jumlah: number
  satuan: string
  ruang_lingkup: string // e.g. Suhu, Massa, Tekanan, Dimensi, Kelistrikan, Volumetrik, Gaya
  kondisi_alat: string // e.g. "Baik / Normal", "Perlu Penyesuaian"
  keterangan?: string
  dokumen_pendukung?: File | null
}

export interface KalibrasiSharedData {
  nama_pemohon: string
  nama_instansi: string
  tipe_pelanggan?: string
  email: string
  whatsapp: string
  alamat_lengkap: string
  lokasi_kalibrasi: "in_lab" | "on_site" // In-Lab di BBSPJIKKP vs On-Site di Pabrik Pelanggan
  metode_penyerahan: "antar_langsung" | "ekspedisi" | "onsite_petugas"
  tanggal_rencana?: string
  catatan_khusus?: string
  setuju_syarat: boolean
}

export const emptyKalibrasiItem = (id: number): KalibrasiItem => ({
  id,
  nama_alat: "",
  merek: "",
  tipe_model: "",
  no_seri: "",
  kapasitas_rentang: "",
  resolusi: "",
  jumlah: 1,
  satuan: "Unit",
  ruang_lingkup: "Suhu",
  kondisi_alat: "Baik / Normal",
  keterangan: "",
  dokumen_pendukung: null,
})

export const initialKalibrasiSharedData: KalibrasiSharedData = {
  nama_pemohon: "",
  nama_instansi: "",
  email: "",
  whatsapp: "",
  alamat_lengkap: "",
  lokasi_kalibrasi: "in_lab",
  metode_penyerahan: "antar_langsung",
  tanggal_rencana: "",
  catatan_khusus: "",
  setuju_syarat: false,
}
