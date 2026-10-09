import api from '../utils/api'
import { FormAsetPayload, JenisSewaOption, FormAsetDetail } from '../types/aset'
import { DefaultApiResponse } from '../types/api'

/**
 * Mengambil daftar pilihan jenis sewa aset balai
 */
export const getJenisSewaAset = async (): Promise<JenisSewaOption[]> => {
  const { data } = await api.get<DefaultApiResponse<JenisSewaOption[]>>('/eksternal/aset/jenis-sewa')
  return (data as any)?.data || []
}

/**
 * Mengirim formulir permohonan pengajuan sewa aset baru
 */
export const submitPermohonanAset = async (form: FormAsetPayload): Promise<any> => {
  const formData = new FormData()

  formData.append('jenis_sewa', form.jenis_sewa)
  formData.append('tanggal_mulai', form.tanggal_mulai)
  formData.append('tanggal_selesai', form.tanggal_selesai)
  if (form.durasi_hari) {
    formData.append('durasi_hari', String(form.durasi_hari))
  }
  formData.append('keperluan_penggunaan', form.keperluan_penggunaan)
  if (form.catatan_tambahan) {
    formData.append('catatan_tambahan', form.catatan_tambahan)
  }

  if (form.pemohon_nama) formData.append('pemohon_nama', form.pemohon_nama)
  if (form.pemohon_nik_nib) formData.append('pemohon_nik_nib', form.pemohon_nik_nib)
  if (form.pemohon_alamat) formData.append('pemohon_alamat', form.pemohon_alamat)
  if (form.pemohon_telepon) formData.append('pemohon_telepon', form.pemohon_telepon)
  if (form.pemohon_email) formData.append('pemohon_email', form.pemohon_email)

  formData.append('setuju_pernyataan', form.setuju_pernyataan ? '1' : '0')

  if (form.file_surat_permohonan) {
    formData.append('file_surat_permohonan', form.file_surat_permohonan)
  }

  const { data } = await api.post<DefaultApiResponse<any>>('/eksternal/aset', formData)
  return data
}

/**
 * Mengambil detail data permohonan sewa aset
 */
export const getDetailAset = async (id: string): Promise<FormAsetDetail> => {
  const { data } = await api.get<DefaultApiResponse<FormAsetDetail>>(`/eksternal/aset/${id}`)
  return (data as any)?.data || data?.results
}

/**
 * Memperbarui data permohonan sewa aset (saat revisi / draft)
 */
export const updatePermohonanAset = async (id: string, form: Partial<FormAsetPayload>): Promise<any> => {
  const formData = new FormData()

  if (form.jenis_sewa) formData.append('jenis_sewa', form.jenis_sewa)
  if (form.tanggal_mulai) formData.append('tanggal_mulai', form.tanggal_mulai)
  if (form.tanggal_selesai) formData.append('tanggal_selesai', form.tanggal_selesai)
  if (form.durasi_hari) formData.append('durasi_hari', String(form.durasi_hari))
  if (form.keperluan_penggunaan) formData.append('keperluan_penggunaan', form.keperluan_penggunaan)
  if (form.catatan_tambahan !== undefined) formData.append('catatan_tambahan', form.catatan_tambahan || '')

  if (form.pemohon_nama) formData.append('pemohon_nama', form.pemohon_nama)
  if (form.pemohon_nik_nib) formData.append('pemohon_nik_nib', form.pemohon_nik_nib)
  if (form.pemohon_alamat) formData.append('pemohon_alamat', form.pemohon_alamat)
  if (form.pemohon_telepon) formData.append('pemohon_telepon', form.pemohon_telepon)
  if (form.pemohon_email) formData.append('pemohon_email', form.pemohon_email)

  if (form.file_surat_permohonan) {
    formData.append('file_surat_permohonan', form.file_surat_permohonan)
  }

  const { data } = await api.post<DefaultApiResponse<any>>(`/eksternal/aset/${id}`, formData)
  return data
}

/**
 * Mengajukan ulang permohonan sewa aset setelah perbaikan berkas
 */
export const reapplyPermohonanAset = async (id: string): Promise<any> => {
  const { data } = await api.post<DefaultApiResponse<any>>(`/eksternal/aset/${id}/ajukan-ulang`)
  return data
}
