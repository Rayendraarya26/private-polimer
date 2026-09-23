import api from "../utils/api"
import { FormHalalPayload } from "../types/halal"

export const submitPermohonanHalal = async (payload: FormHalalPayload) => {
  const formData = new FormData()

  // 1. Data Pengajuan
  formData.append("dataPengajuan", JSON.stringify(payload.dataPengajuan))

  // 2. Data Pelaku Usaha
  formData.append("dataPelakuUsaha", JSON.stringify(payload.dataPelakuUsaha))

  // 3. Data Fasilitas (Pabrik & Outlet)
  formData.append("dataFasilitas", JSON.stringify(payload.dataFasilitas))

  // 4. Data Penyelia Halal
  formData.append("dataPenyelia", JSON.stringify(payload.dataPenyelia))

  // 5. Data Bahan
  formData.append("dataBahan", JSON.stringify(payload.dataBahan))

  // 6. Data Produk
  formData.append(
    "dataProduk",
    JSON.stringify(
      payload.dataProduk.map((p) => ({
        klasifikasi: p.klasifikasi,
        rincian: p.rincian,
        nama_produk: p.nama_produk,
        merk: p.merk,
      }))
    )
  )

  // 7. Berkas Upload
  if (payload.file_denah_lokasi) {
    formData.append("file_denah_lokasi", payload.file_denah_lokasi)
  }
  if (payload.file_sk_penyelia) {
    formData.append("file_sk_penyelia", payload.file_sk_penyelia)
  }
  if (payload.file_ktp_penyelia) {
    formData.append("file_ktp_penyelia", payload.file_ktp_penyelia)
  }
  if (payload.file_sertifikat_penyelia) {
    formData.append("file_sertifikat_penyelia", payload.file_sertifikat_penyelia)
  }
  if (payload.file_alur_proses) {
    formData.append("file_alur_proses", payload.file_alur_proses)
  }
  if (payload.file_surat_permohonan) {
    formData.append("file_surat_permohonan", payload.file_surat_permohonan)
  }
  if (payload.file_manual_sjph) {
    formData.append("file_manual_sjph", payload.file_manual_sjph)
  }

  // 8. Pernyataan & Integritas
  formData.append("pernyataan_bebas_babi", payload.pernyataan_bebas_babi ? "1" : "0")
  formData.append("pernyataan_komitmen_sjph", payload.pernyataan_komitmen_sjph ? "1" : "0")

  const response = await api.post("/eksternal/halal", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const getPermohonanHalal = async (id: string) => {
  const response = await api.get(`/eksternal/halal/${id}`)
  return response.data
}
