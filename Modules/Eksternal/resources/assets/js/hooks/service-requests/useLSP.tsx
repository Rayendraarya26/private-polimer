import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import Swal from "sweetalert2"


import {
  storeLSPTransformasiIndustri,
  getDetailLSP,
  updateLSPTransformasiIndustri
} from "../../services/lsp"
import api from "../../utils/api"


export const useLSP = () => {


  const [submitting, setSubmitting] = useState(false)


  /* ===============================
     ERROR HANDLER
  =============================== */
  const handleErrorResponse = (error: any) => {


    const response = error?.response?.data


    // VALIDATION ERROR
    if (response?.errors && typeof response.errors === "object") {


      Object.entries(response.errors).forEach(([field, messages]) => {


        const msgList = Array.isArray(messages)
          ? messages
          : [messages]


        msgList.forEach(msg => {
          toast.error(`${field}: ${msg}`)
        })


      })


      return
    }


    // GENERAL MESSAGE
    if (response?.message) {
      toast.error(response.message)
      return
    }


    // FALLBACK
    toast.error(
      error?.message ||
      "Terjadi kesalahan sistem"
    )
  }


const createPendaftaran = async (
  payload: any,
  callback?: () => void,
  skipConfirm = false,
  skipToast = false
) => {
  if (!skipConfirm) {
    const result = await Swal.fire({
      title: "Konfirmasi Pengajuan",
      text: "Apakah Anda yakin semua data sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Kirim Sekarang",
      cancelButtonText: "Periksa Kembali",
      reverseButtons: true
    })
    if (!result.isConfirmed) return
  }

  setSubmitting(true)
  try {
    const formData = new FormData()
    const { participants, ...shared } = payload

    //  Shared fields
    Object.entries(shared).forEach(([key, value]) => {
      if (value === null || value === undefined) return
      if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0')
      } else {
        formData.append(key, String(value))
      }
    })

    // Participants array dengan file nested
    if (Array.isArray(participants)) {
      participants.forEach((p: any, index: number) => {
        Object.entries(p).forEach(([key, value]) => {
          if (key === 'id') return
          if (value === null || value === undefined) return
          if (value instanceof File) {
            formData.append(`participants[${index}][${key}]`, value)
          } else if (typeof value === 'boolean') {
            formData.append(`participants[${index}][${key}]`, value ? '1' : '0')
          } else {
            formData.append(`participants[${index}][${key}]`, String(value))
          }
        })
      })
    }

    const res = await storeLSPTransformasiIndustri(formData)
    const response = res?.data ?? res

    if (response?.success) {
      if (!skipToast) toast.success(response.message || "Pendaftaran LSP berhasil!")
      if (callback) callback()
    } else {
      toast.error(response?.message || "Gagal menyimpan data")
    }

    return response
  } catch (error: any) {
    const msg = error?.response?.data?.message || error?.message || "Terjadi kesalahan sistem"
    toast.error(msg)
  } finally {
    setSubmitting(false)
  }
}


  /* ===============================
     GET DETAIL
  =============================== */
  const getDetail = useCallback(async (id: string) => {


    try {


      return await getDetailLSP(id)


    } catch (error) {


      console.error("Error Get Detail LSP:", error)


      toast.error("Gagal mengambil data LSP")


      return null
    }


  }, [])


  /* ===============================
     UPDATE LSP
  =============================== */
  const updateLSP = useCallback(
    async (
      id: string,
      formData: any,
      callback?: () => void
    ) => {


      // =========================
      // SWEET ALERT
      // =========================
      const result = await Swal.fire({
        title: "Konfirmasi Update",
        text: "Apakah Anda yakin ingin memperbarui data LSP ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Update",
        cancelButtonText: "Batal",
        reverseButtons: true
      })


      if (!result.isConfirmed) return


      try {


        setSubmitting(true)


        const res = await updateLSPTransformasiIndustri(id, formData)


        const response = res?.data ?? res


        if (response?.success) {


          toast.success(
            response.message ||
            "Update berhasil"
          )


          if (callback) {
            callback()
          }


        } else {


          toast.error(
            response?.message ||
            "Update gagal"
          )
        }


        return response


      } catch (error: any) {


        handleErrorResponse(error)


        console.error("Error Update LSP:", error)


      } finally {


        setSubmitting(false)
      }


    },
    []
  )


const deleteLSP = useCallback(
    async (
      item: any,
      callback?: () => void
    ) => {


      const result = await Swal.fire({
        title: "Konfirmasi Hapus",
        text: "Yakin ingin menghapus permohonan ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
        reverseButtons: true
      })


      if (!result.isConfirmed) return


      const toastId = toast.loading(
        "Menghapus permohonan..."
      )


      try {


        setSubmitting(true)


        const res = await api.delete(
          `/eksternal/lsp-transformasi-industri/${item.id}`
        )


        const response = res?.data ?? res


        toast.success(
          response?.message ||
          "Permohonan berhasil dihapus"
        )


        if (callback) {
          callback()
        }


        return response


      } catch (error: any) {


        toast.error(
          error?.response?.data?.message ||
          "Gagal menghapus permohonan"
        )


        console.error(
          "Error Delete LSP:",
          error
        )


        return {
          success: false
        }


      } finally {


        toast.remove(toastId)


        setSubmitting(false)


      }


    },
    []
  )


  return {
    submitting,
    createPendaftaran,
    getDetailLSP: getDetail,
    updateLSP,
    deleteLSP
  }

}

