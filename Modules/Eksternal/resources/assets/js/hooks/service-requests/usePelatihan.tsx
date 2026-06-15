import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import api from "../../utils/api"
import { submitPelatihan, getPelatihanDetail } from "../../services/pelatihan"
import { getErrorMessage } from "../../utils/error"

export default () => {

  const [submitting, setSubmitting] = useState<boolean>(false)
  const handleErrorResponse = (error: any) => {
    const response = error?.response?.data
    if (response?.errors && typeof response.errors === "object") {
      Object.entries(response.errors).forEach(([field, messages]) => {
        const msgList = Array.isArray(messages) ? messages : [messages]
        msgList.forEach(msg => {
          toast.error(`${field}: ${msg}`)
        })
      })
      return
    }
    if (response?.message) {
      toast.error(response.message)
      return
    }
    toast.error(
      error?.message ||
      getErrorMessage(error) ||
      "Terjadi kesalahan sistem"
    )
  }

  const buildFormData = (payload: any): FormData => {
    const formData = new FormData()
    const { participants, ...shared } = payload

    Object.entries(shared).forEach(([key, value]) => {
      if (value === null || value === undefined) return
      if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0')
      } else if (value instanceof File) {
        formData.append(key, value)
      } else {
        formData.append(key, String(value))
      }
    })


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

    return formData
  }
  const createPendaftaran = useCallback(
    async (
      payload: any,
      callback?: () => void,
      skipConfirm: boolean = false,
      skipToast: boolean = false
    ) => {
   if (!skipConfirm) {
        const confirm = await Swal.fire({
          title: "Konfirmasi Pengajuan",
          text: "Apakah Anda yakin semua data pendaftaran pelatihan sudah benar?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ya, Kirim Sekarang",
          cancelButtonText: "Periksa Kembali",
          reverseButtons: true
        })
        if (!confirm.isConfirmed) {
          return {
            success: false,
            cancelled: true
          }
        }
      }
      try {
        setSubmitting(true)
        const formData = buildFormData(payload)
        const res = await submitPelatihan(formData)
        const response = res?.data ?? res
        if (response?.success) {
          if (!skipToast) {
            toast.success(
              response.message ||
              "Pendaftaran pelatihan berhasil dikirim!"
            )
          }
          if (callback) {
            callback()
          }
        } else {
          toast.error(
            response?.message ||
            "Gagal menyimpan data"
          )
        }
        return response
      } catch (error: any) {
        handleErrorResponse(error)
        console.error("Error Store Pelatihan:", error)
        return {
          success: false
        }
      } finally {
        setSubmitting(false)
      }
    },
    []
  )
  const getDetailPelatihan = useCallback(async (id: string) => {
    try {
      return await getPelatihanDetail(id)
    } catch (error) {
      console.error("Error get detail pelatihan:", error)
      throw error
    }
  }, [])
  const updatePelatihan = useCallback(
    async (
      id: string,
      payload: any,
      callback?: () => void
    ) => {
      const confirm = await Swal.fire({
        title: "Konfirmasi Update",
        text: "Apakah Anda yakin ingin memperbarui data pelatihan ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Update",
        cancelButtonText: "Batal",
        reverseButtons: true
      })
      if (!confirm.isConfirmed) return
      try {
        setSubmitting(true)
        const formData = buildFormData(payload)
        const res = await api.post(
          `/eksternal/pelatihan/${id}?_method=PUT`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        const response = res?.data ?? res
        if (response?.success) {
          toast.success(
            response.message ||
            "Data berhasil diperbarui"
          )
          if (callback) {
            callback()
          }
        } else {
          toast.error(
            response?.message ||
            "Gagal update data"
          )
        }
        return response
      } catch (error: any) {
        handleErrorResponse(error)
        console.error("Error Update Pelatihan:", error)
      } finally {
        setSubmitting(false)
      }
    },
    []
  )
  const deletePelatihan = useCallback(
    async (
      item: any,
      callback?: () => void
    ) => {


      const confirmDelete = await Swal.fire({
        title: "Konfirmasi Hapus",
        text: "Apakah Anda yakin ingin menghapus permohonan ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
        reverseButtons: true
      })


      if (!confirmDelete.isConfirmed) return


      const toastId = toast.loading("Menghapus permohonan...")


      try {


        setSubmitting(true)


        const res = await api.delete(
          `/eksternal/pelatihan/${item.id}`
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


        console.error("Error Delete Pelatihan:", error)


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
    getDetailPelatihan,
    updatePelatihan,
    deletePelatihan
  }

}