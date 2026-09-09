import api from "../utils/api"

export const getSkemaSertifikasi = async () => {
  const response = await api.get("/eksternal/sertifikasi/skema")
  return response.data?.data || []
}

export const getDetailSertifikasi = async (id: string) => {
  const response = await api.get(`/eksternal/sertifikasi/${id}`)
  return response.data
}
