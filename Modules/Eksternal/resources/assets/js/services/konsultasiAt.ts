import api from "../utils/api"

export interface MasterKonsultasiAtItem {
    id: number
    kode: string
    kategori: "konsultasi" | "audit_teknologi" | "indi_4_0" | "lainnya"
    nama: string
    deskripsi?: string | null
    urutan: number
}

export const getMasterKonsultasiAt = async (): Promise<MasterKonsultasiAtItem[]> => {
    const response = await api.get("/eksternal/konsultasi-at/master")
    return response.data?.data || []
}

export interface SubmitKonsultasiAtPayload {
    layananKode: string
    layananLainnya?: string
    catatanDokumen?: string
    files: File[]
}

export const submitKonsultasiAt = async (payload: SubmitKonsultasiAtPayload) => {
    const formData = new FormData()
    formData.append("layanan_kode", payload.layananKode)
    if (payload.layananLainnya) formData.append("layanan_lainnya", payload.layananLainnya)
    if (payload.catatanDokumen) formData.append("catatan_dokumen", payload.catatanDokumen)
    payload.files.forEach((file) => formData.append("dokumen[]", file))

    const response = await api.post("/eksternal/konsultasi-at", formData)
    return response.data
}
