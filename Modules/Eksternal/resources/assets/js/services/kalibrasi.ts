import api from "../utils/api"

export const getMasterKalibrasi = async () => {
    const response = await api.get("/eksternal/kalibrasi/master")
    const items = response.data?.data || []
    ;(items as any).is_internal = Boolean(response.data?.is_internal)
    return items
}