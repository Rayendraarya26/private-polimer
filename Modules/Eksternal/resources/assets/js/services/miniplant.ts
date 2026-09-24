import api from "../utils/api"

export interface MasterMiniplantItem {
    id: number | string
    kode: string
    jenis_jasa?: "proses" | "mesin"
    nama: string
    satuan: string
    biaya: number
}

export const getMasterMiniplant = async (kode?: string): Promise<MasterMiniplantItem[]> => {
    const response = await api.get("/eksternal/miniplant/master", {
        params: kode ? { kode } : undefined,
    })
    return response.data?.data || []
}

export const submitMiniplant = async (payload: any) => {
    const response = await api.post("/eksternal/miniplant", payload)
    return response.data
}
