import api from "../utils/api"
import { InspeksiFormData } from "../types/inspeksi"
import { DefaultApiResponse } from "../types/api"

/**
 * Mengirim formulir permohonan jasa inspeksi ke backend API
 */
export const submitPermohonanInspeksi = async (form: InspeksiFormData): Promise<any> => {
  const formData = new FormData()

  formData.append("dataPermohonan", JSON.stringify(form.dataPermohonan))
  formData.append("dataSpesifikasi", JSON.stringify(form.dataSpesifikasi))
  formData.append("dataPelaksanaan", JSON.stringify(form.dataPelaksanaan))
  formData.append("dataPenerima", JSON.stringify(form.dataPenerima))
  formData.append("dataBiaya", JSON.stringify(form.dataBiaya))
  formData.append("dataPic", JSON.stringify(form.dataPic))
  formData.append("setuju_pernyataan", form.setuju_pernyataan ? "1" : "0")

  if (form.file_surat_permohonan) {
    formData.append("file_surat_permohonan", form.file_surat_permohonan)
  }

  const { data } = await api.post<DefaultApiResponse<any>>("/eksternal/inspeksi", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return data
}

/**
 * Mengambil detail permohonan inspeksi berdasarkan UUID
 */
export const getDetailInspeksi = async (id: string): Promise<any> => {
  const { data } = await api.get<DefaultApiResponse<any>>(`/eksternal/inspeksi/${id}`)
  return data?.data || data?.results
}
