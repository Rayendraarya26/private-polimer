import axios from "axios"

const API_URL = "/api/eksternal/lsp-transformasi-industri/lsp-transformasiIndustri"

//  Terima FormData yang sudah dibangun dari useLSP — tidak rebuild
export const storeLSPTransformasiIndustri = async (formData: FormData) => {
  const response = await axios.post(API_URL, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
  return response.data
}

export const getDetailLSP = async (id: string) => {
  const response = await axios.get(
    `/api/eksternal/lsp-transformasi-industri/${id}`,
    {
      withCredentials: true,
      headers: { "X-Requested-With": "XMLHttpRequest" },
    }
  )
  return response.data
}

export const updateLSPTransformasiIndustri = async (id: string, data: any) => {
  // update masih pakai flat object, bangun FormData di sini
  const formData = new FormData()
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key])
    }
  })

  const response = await axios.post(
    `/api/eksternal/lsp-transformasi-industri/${id}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  )
  return response.data
}

export const getSkemalsp = async () => {
  const response = await axios.get("/api/eksternal/skema-lsp", {
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest" },
  })
  return response.data
}