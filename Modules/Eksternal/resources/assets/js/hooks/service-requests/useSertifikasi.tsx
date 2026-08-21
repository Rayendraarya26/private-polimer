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
    formData.append('nama_perusahaan', payload.nama_perusahaan)
    if (payload.nomor_akta_pendirian) formData.append('nomor_akta_pendirian', payload.nomor_akta_pendirian)
    if (payload.nama_pemilik) formData.append('nama_pemilik', payload.nama_pemilik)
    if (payload.nama_pimpinan) formData.append('nama_pimpinan', payload.nama_pimpinan)
    if (payload.nama_wakil_manajemen) formData.append('nama_wakil_manajemen', payload.nama_wakil_manajemen)
    formData.append('alamat_kantor', payload.alamat_kantor)
    if (payload.kontak_person) formData.append('kontak_person', payload.kontak_person)
    if (payload.no_telp) formData.append('no_telp', payload.no_telp)
    formData.append('no_whatsapp', payload.no_whatsapp)
    formData.append('email', payload.email)
    formData.append('setuju_syarat', payload.setuju_syarat ? '1' : '0')

    // Multi-Pengajuan
    payload.pengajuan.forEach((p, pIdx) => {
      formData.append(`pengajuan[${pIdx}][jenis_pengajuan]`, p.jenis_pengajuan)
      if (p.sertifikat_lama_id) formData.append(`pengajuan[${pIdx}][sertifikat_lama_id]`, p.sertifikat_lama_id)
      if (p.sertifikat_lama_text) formData.append(`pengajuan[${pIdx}][sertifikat_lama_text]`, p.sertifikat_lama_text)
      formData.append(`pengajuan[${pIdx}][skema_id]`, p.skema_id)

      // Uploaded files per pengajuan
      if (p.dok_legalitas) formData.append(`pengajuan[${pIdx}][dok_legalitas]`, p.dok_legalitas)
      if (p.dok_manual_mutu) formData.append(`pengajuan[${pIdx}][dok_manual_mutu]`, p.dok_manual_mutu)
      if (p.dok_diagram_alir) formData.append(`pengajuan[${pIdx}][dok_diagram_alir]`, p.dok_diagram_alir)
      if (p.dok_lainnya) formData.append(`pengajuan[${pIdx}][dok_lainnya]`, p.dok_lainnya)

      // Items per pengajuan
      p.items.forEach((item, itemIdx) => {
        formData.append(`pengajuan[${pIdx}][items][${itemIdx}][nama_produk]`, item.nama_produk)
        if (item.komoditi_id) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][komoditi_id]`, String(item.komoditi_id))
        if (item.merk_dagang) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][merk_dagang]`, item.merk_dagang)
        if (item.tipe_jenis) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][tipe_jenis]`, item.tipe_jenis)
        if (item.standar_sni_iso) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][standar_sni_iso]`, item.standar_sni_iso)
        if (item.ruang_lingkup) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][ruang_lingkup]`, item.ruang_lingkup)
        if (item.estimasi_tarif) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][estimasi_tarif]`, String(item.estimasi_tarif))
      })
    })

    // Factories
    payload.pabrik.forEach((f, fIdx) => {
      formData.append(`pabrik[${fIdx}][nama_pabrik]`, f.nama_pabrik)
      formData.append(`pabrik[${fIdx}][alamat_pabrik]`, f.alamat_pabrik)
      if (f.provinsi_id) formData.append(`pabrik[${fIdx}][provinsi_id]`, f.provinsi_id)
      if (f.kabupaten_id) formData.append(`pabrik[${fIdx}][kabupaten_id]`, f.kabupaten_id)
      if (f.kontak_pabrik) formData.append(`pabrik[${fIdx}][kontak_pabrik]`, f.kontak_pabrik)
      if (f.email_pabrik) formData.append(`pabrik[${fIdx}][email_pabrik]`, f.email_pabrik)
      if (f.jumlah_karyawan) formData.append(`pabrik[${fIdx}][jumlah_karyawan]`, String(f.jumlah_karyawan))
      if (f.luas_fasilitas) formData.append(`pabrik[${fIdx}][luas_fasilitas]`, f.luas_fasilitas)
    })

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
        return null
      } finally {
        setSubmitting(false)
      }
    },
    []
  )

  const downloadSertifikat = useCallback(async (id: string, filename = 'sertifikat-sppt-sni.pdf') => {
    try {
      const response = await api.get(`/eksternal/sertifikasi/${id}/download-sertifikat`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Sertifikat berhasil diunduh.')
    } catch (error: any) {
      toast.error('Gagal mengunduh sertifikat resmi.')
    }
  }, [])

  return {
    submitting,
    createPermohonanSertifikasi,
    downloadSertifikat,
  }
}

export default useSertifikasi
