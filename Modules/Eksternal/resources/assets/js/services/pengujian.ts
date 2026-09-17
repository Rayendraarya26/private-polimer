import api from "../utils/api"
import { MasterKomoditi, MasterParameterUji } from "../types/pengujian"
import { DefaultApiResponse } from "../types/api"

/**
 * Mengambil daftar master komoditas pengujian aktif dari backend
 */
export const getMasterKomoditiPengujian = async (): Promise<MasterKomoditi[]> => {
  try {
    const { data } = await api.get("/eksternal/pengujian/master-komoditi")
    return data?.results || data?.data || []
  } catch (error) {
    console.warn("Failed to fetch master komoditi from API, falling back to empty list", error)
    return []
  }
}

/**
 * Mengambil daftar parameter uji berdasarkan ID komoditas
 */
export const getParametersByKomoditi = async (komoditiId: number): Promise<MasterParameterUji[]> => {
  try {
    const { data } = await api.get(`/eksternal/pengujian/komoditi/${komoditiId}/parameters`)
    return data?.results || data?.data || []
  } catch (error) {
    console.warn(`Failed to fetch parameters for komoditi ${komoditiId}`, error)
    return []
  }
}

/**
 * Mengirimkan formulir permohonan pengujian laboratorium (Multipart Form-Data)
 */
export const submitPermohonanPengujian = async (formData: FormData): Promise<any> => {
  try {
    const { data } = await api.post<DefaultApiResponse<any>>(
      "/eksternal/pengujian/permohonan",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Mengambil detail permohonan pengujian berdasarkan ID
 */
export const getDetailPengujian = async (id: string | number): Promise<any> => {
  try {
    const { data } = await api.get(`/eksternal/pengujian/${id}`)
    return data?.results || data?.data
  } catch (error) {
    return Promise.reject(error)
  }
}
