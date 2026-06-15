import { DefaultApiResponse } from "../types/api"
import api from "../utils/api"

export interface PelatihanPayload {
  skema_id: string

  nama_lengkap: string
  gender: string
  tempat_lahir: string
  tanggal_lahir: string
  pendidikan: string

  whatsapp: string
  email: string
  agama: string

  alamat_peserta: string
  nik_peserta: string

  nama_instansi: string
  alamat_instansi: string

  jenis_produk: string
  pengalaman_kerja?: string

  masalah_materi: string
  hal_dipelajari: string

  setuju_syarat: boolean

  // upload file
  ktp_peserta?: File
  foto_peserta?: File
}

export const submitPelatihan = async (payload: FormData) => {
  try {

    const { data } = await api.post<DefaultApiResponse<any>>(
      "/eksternal/pelatihan",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    )

    return data

  } catch (error) {

    return Promise.reject(error)

  }
}

export const getSkemaPelatihan = async () => {
  try {

    const { data } = await api.get("/eksternal/skema-pelatihan")

    return data.results

  } catch (error) {

    return Promise.reject(error)

  }
}

export const getPelatihanDetail = async (id: string) => {
  try {

    const { data } = await api.get(`/eksternal/pelatihan/${id}`)

    return data.results

  } catch (error) {

    return Promise.reject(error)

  }
}
