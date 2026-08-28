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
    if (payload.badan_hukum) formData.append('badan_hukum', payload.badan_hukum)
    if (payload.jenis_perusahaan) formData.append('jenis_perusahaan', payload.jenis_perusahaan)
    if (payload.nomor_akta_pendirian) formData.append('nomor_akta_pendirian', payload.nomor_akta_pendirian)
    if (payload.nama_pemilik) formData.append('nama_pemilik', payload.nama_pemilik)
    if (payload.nama_pimpinan) formData.append('nama_pimpinan', payload.nama_pimpinan)
    if (payload.nama_wakil_manajemen) formData.append('nama_wakil_manajemen', payload.nama_wakil_manajemen)
    formData.append('alamat_kantor', payload.alamat_kantor)
    if (payload.negara) formData.append('negara', payload.negara)
    if (payload.provinsi) formData.append('provinsi', payload.provinsi)
    if (payload.kabupaten) formData.append('kabupaten', payload.kabupaten)
    if (payload.kecamatan) formData.append('kecamatan', payload.kecamatan)
    if (payload.kode_pos) formData.append('kode_pos', payload.kode_pos)
    if (payload.kontak_person) formData.append('kontak_person', payload.kontak_person)
    if (payload.no_telp) formData.append('no_telp', payload.no_telp)
    formData.append('no_whatsapp', payload.no_whatsapp)
    if (payload.fax) formData.append('fax', payload.fax)
    formData.append('email', payload.email)
    formData.append('setuju_syarat', payload.setuju_syarat ? '1' : '0')

    // Data Ketenagakerjaan
    if (payload.jumlah_karyawan_total !== undefined) formData.append('jumlah_karyawan_total', String(payload.jumlah_karyawan_total))
    if (payload.jumlah_manajemen !== undefined) formData.append('jumlah_manajemen', String(payload.jumlah_manajemen))
    if (payload.jumlah_administrasi !== undefined) formData.append('jumlah_administrasi', String(payload.jumlah_administrasi))
    if (payload.jumlah_operasional !== undefined) formData.append('jumlah_operasional', String(payload.jumlah_operasional))
    if (payload.jumlah_part_time !== undefined) formData.append('jumlah_part_time', String(payload.jumlah_part_time))
    if (payload.jumlah_non_permanen !== undefined) formData.append('jumlah_non_permanen', String(payload.jumlah_non_permanen))
    if (payload.jumlah_shift !== undefined) formData.append('jumlah_shift', String(payload.jumlah_shift))
    if (payload.jumlah_shift_1 !== undefined) formData.append('jumlah_shift_1', String(payload.jumlah_shift_1))
    if (payload.jumlah_shift_2 !== undefined) formData.append('jumlah_shift_2', String(payload.jumlah_shift_2))
    if (payload.jumlah_shift_3 !== undefined) formData.append('jumlah_shift_3', String(payload.jumlah_shift_3))
    if (payload.jumlah_bagian !== undefined) formData.append('jumlah_bagian', String(payload.jumlah_bagian))
    if (payload.luas_tanah) formData.append('luas_tanah', String(payload.luas_tanah))
    if (payload.luas_bangunan) formData.append('luas_bangunan', String(payload.luas_bangunan))
    if (payload.file_berkas_gabungan) formData.append('file_berkas_gabungan', payload.file_berkas_gabungan)

    // Multi-Pengajuan
    payload.pengajuan.forEach((p, pIdx) => {
      formData.append(`pengajuan[${pIdx}][jenis_pengajuan]`, p.jenis_pengajuan)
      if (p.sertifikat_lama_id) formData.append(`pengajuan[${pIdx}][sertifikat_lama_id]`, p.sertifikat_lama_id)
      if (p.sertifikat_lama_text) formData.append(`pengajuan[${pIdx}][sertifikat_lama_text]`, p.sertifikat_lama_text)
      formData.append(`pengajuan[${pIdx}][skema_id]`, p.skema_id)

      // Uploaded files per pengajuan from dokumen_list
      if (p.dokumen_list && p.dokumen_list.length > 0) {
        p.dokumen_list.forEach((doc) => {
          if (doc.file) {
            formData.append(`pengajuan[${pIdx}][${doc.id}]`, doc.file)
          }
        })
      }
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
        if (item.ukuran) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][ukuran]`, item.ukuran)
        if (item.standar_sni_iso) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][standar_sni_iso]`, item.standar_sni_iso)
        if (item.satuan_produksi) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][satuan_produksi]`, item.satuan_produksi)
        if (item.kapasitas_produksi) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][kapasitas_produksi]`, item.kapasitas_produksi)
        if (item.ruang_lingkup) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][ruang_lingkup]`, item.ruang_lingkup)
        if (item.estimasi_tarif) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][estimasi_tarif]`, String(item.estimasi_tarif))
        if (item.keterangan) formData.append(`pengajuan[${pIdx}][items][${itemIdx}][keterangan]`, item.keterangan)
      })
    })

    // Factories
    payload.pabrik.forEach((f, fIdx) => {
      formData.append(`pabrik[${fIdx}][nama_pabrik]`, f.nama_pabrik)
      formData.append(`pabrik[${fIdx}][alamat_pabrik]`, f.alamat_pabrik)
      if (f.negara) formData.append(`pabrik[${fIdx}][negara]`, f.negara)
      if (f.provinsi_id) formData.append(`pabrik[${fIdx}][provinsi_id]`, f.provinsi_id)
      if (f.kabupaten_id) formData.append(`pabrik[${fIdx}][kabupaten_id]`, f.kabupaten_id)
      if (f.kode_pos) formData.append(`pabrik[${fIdx}][kode_pos]`, f.kode_pos)
      if (f.kontak_pabrik) formData.append(`pabrik[${fIdx}][kontak_pabrik]`, f.kontak_pabrik)
      if (f.no_hp) formData.append(`pabrik[${fIdx}][no_hp]`, f.no_hp)
      if (f.fax) formData.append(`pabrik[${fIdx}][fax]`, f.fax)
      if (f.email_pabrik) formData.append(`pabrik[${fIdx}][email_pabrik]`, f.email_pabrik)
      if (f.kegiatan_utama) formData.append(`pabrik[${fIdx}][kegiatan_utama]`, f.kegiatan_utama)
      if (f.jumlah_karyawan) formData.append(`pabrik[${fIdx}][jumlah_karyawan]`, String(f.jumlah_karyawan))
      if (f.luas_tanah) formData.append(`pabrik[${fIdx}][luas_tanah]`, String(f.luas_tanah))
      if (f.luas_bangunan) formData.append(`pabrik[${fIdx}][luas_bangunan]`, String(f.luas_bangunan))
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
