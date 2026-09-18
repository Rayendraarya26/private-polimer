import api from "../utils/api"

export const getMasterKalibrasi = async () => {
    const response = await api.get("/eksternal/kalibrasi/master")
    return response.data?.data || []
}