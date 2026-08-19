import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import Swal from "sweetalert2"
import api from "../../utils/api"
import { getErrorMessage } from "../../utils/error"
import { SertifikasiFormData } from "../../types/sertifikasi"

export const useSertifikasi = () => {
  const [submitting, setSubmitting] = useState<boolean>(false)

  const handleErrorResponse = (error: any) => {
    const response = error?.response?.data
    if (response?.errors && typeof response.errors === "object") {
      Object.entries(response.errors).forEach(([field, messages]) => {
        const msgList = Array.isArray(messages) ? messages : [messages]
        msgList.forEach((msg) => {
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
      error?.message || getErrorMessage(error) || "Terjadi kesalahan pada sistem."
    )
  }

  const buildFormData = (payload: SertifikasiFormData & { aksi: 'draft' | 'ajukan' }): FormData => {
    const formData = new FormData()

    formData.append('aksi', payload.aksi)
    formData.append('skema_id', payload.skema_id)
    formData.append('tipe_pengajuan', payload.tipe_pengajuan)
    if (payload.referensi_sertifikasi_id) {
      formData.append('referensi_sertifikasi_id', payload.referensi_sertifikasi_id)
    }
    formData.append('nama_perusahaan', payload.nama_perusahaan)
    formData.append('alamat_kantor', payload.alamat_kantor)
    if (payload.kontak_person) formData.append('kontak_person', payload.kontak_person)
    if (payload.no_telp) formData.append('no_telp', payload.no_telp)
    formData.append('no_whatsapp', payload.no_whatsapp)
    formData.append('email', payload.email)
    formData.append('setuju_syarat', payload.setuju_syarat ? '1' : '0')

    // Factories
    payload.pabrik.forEach((p, idx) => {
      formData.append(`pabrik[${idx}][nama_pabrik]`, p.nama_pabrik)
      formData.append(`pabrik[${idx}][alamat_pabrik]`, p.alamat_pabrik)
      if (p.provinsi_id) formData.append(`pabrik[${idx}][provinsi_id]`, p.provinsi_id)
      if (p.kabupaten_id) formData.append(`pabrik[${idx}][kabupaten_id]`, p.kabupaten_id)
      if (p.kontak_pabrik) formData.append(`pabrik[${idx}][kontak_pabrik]`, p.kontak_pabrik)
      if (p.email_pabrik) formData.append(`pabrik[${idx}][email_pabrik]`, p.email_pabrik)
      if (p.jumlah_karyawan) formData.append(`pabrik[${idx}][jumlah_karyawan]`, String(p.jumlah_karyawan))
      if (p.luas_fasilitas) formData.append(`pabrik[${idx}][luas_fasilitas]`, p.luas_fasilitas)
    })

    // Items
    payload.items.forEach((item, idx) => {
      formData.append(`items[${idx}][nama_produk]`, item.nama_produk)
      if (item.komoditi_id) formData.append(`items[${idx}][komoditi_id]`, String(item.komoditi_id))
      if (item.merk_dagang) formData.append(`items[${idx}][merk_dagang]`, item.merk_dagang)
      if (item.tipe_jenis) formData.append(`items[${idx}][tipe_jenis]`, item.tipe_jenis)
      if (item.standar_sni_iso) formData.append(`items[${idx}][standar_sni_iso]`, item.standar_sni_iso)
      if (item.ruang_lingkup) formData.append(`items[${idx}][ruang_lingkup]`, item.ruang_lingkup)
      if (item.estimasi_tarif) formData.append(`items[${idx}][estimasi_tarif]`, String(item.estimasi_tarif))
    })

    // Uploaded Files
    if (payload.dok_legalitas) formData.append('dok_legalitas', payload.dok_legalitas)
    if (payload.dok_manual_mutu) formData.append('dok_manual_mutu', payload.dok_manual_mutu)
    if (payload.dok_diagram_alir) formData.append('dok_diagram_alir', payload.dok_diagram_alir)
    if (payload.dok_lainnya) formData.append('dok_lainnya', payload.dok_lainnya)

    return formData
  }

  const createPermohonanSertifikasi = useCallback(
    async (
      payload: SertifikasiFormData & { aksi: 'draft' | 'ajukan' },
      callback?: () => void
    ) => {
      try {
        setSubmitting(true)
        const formData = buildFormData(payload)
        const res = await api.post('/eksternal/sertifikasi', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        const response = res?.data ?? res
        if (response?.success) {
          toast.success(response.message || 'Permohonan sertifikasi berhasil disimpan!')
          if (callback) callback()
          return response
        } else {
          toast.error(response?.message || 'Gagal mengajukan sertifikasi.')
        }
        return response
      } catch (error: any) {
        handleErrorResponse(error)
        console.error('Error Store Sertifikasi:', error)
        return { success: false }
      } finally {
        setSubmitting(false)
      }
    },
    []
  )

  const getDetailSertifikasi = useCallback(async (id: string) => {
    try {
      const res = await api.get(`/eksternal/sertifikasi/${id}`)
      return res?.data?.data ?? res?.data
    } catch (error) {
      console.error('Error get detail sertifikasi:', error)
      throw error
    }
  }, [])

  const deleteSertifikasi = useCallback(
    async (id: string, callback?: () => void) => {
      const confirm = await Swal.fire({
        title: 'Hapus Draf Permohonan?',
        text: 'Draf sertifikasi yang dihapus tidak dapat dipulihkan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e11d48',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Ya, Hapus Draf',
        cancelButtonText: 'Batal',
      })
      if (!confirm.isConfirmed) return

      try {
        setSubmitting(true)
        const res = await api.delete(`/eksternal/sertifikasi/${id}`)
        toast.success(res?.data?.message || 'Draf sertifikasi berhasil dihapus.')
        if (callback) callback()
        return res?.data
      } catch (error) {
        handleErrorResponse(error)
      } finally {
        setSubmitting(false)
      }
    },
    []
  )

  return {
    submitting,
    createPermohonanSertifikasi,
    getDetailSertifikasi,
    deleteSertifikasi,
  }
}

export default useSertifikasi
