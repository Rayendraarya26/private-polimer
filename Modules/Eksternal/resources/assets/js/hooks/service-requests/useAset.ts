import { useState, useCallback, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  getJenisSewaAset,
  submitPermohonanAset,
  getDetailAset,
  updatePermohonanAset,
  reapplyPermohonanAset,
} from '../../services/aset'
import { FormAsetPayload, JenisSewaOption, FormAsetDetail } from '../../types/aset'

export const useAset = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoadingJenisSewa, setIsLoadingJenisSewa] = useState<boolean>(false)
  const [jenisSewaOptions, setJenisSewaOptions] = useState<JenisSewaOption[]>([
    { value: 'sewa_lapangan', label: 'Sewa Lapangan', desc: 'Lapangan upacara, olahraga, dan area terbuka balai' },
    { value: 'sewa_bangunan', label: 'Sewa Bangunan', desc: 'Gedung pertemuan, aula serbaguna, dan bangunan fisik balai' },
    { value: 'sewa_alat',     label: 'Sewa Alat',     desc: 'Peralatan uji laboratorium dan instrumen teknis' },
    { value: 'sewa_mobil',    label: 'Sewa Mobil',    desc: 'Kendaraan dinas dan operasional balai' },
    { value: 'sewa_ruangan',  label: 'Sewa Ruangan',  desc: 'Ruang rapat, ruang pelatihan, dan ruang kerja sementara' },
  ])

  // Fetch jenis sewa dari API
  const fetchJenisSewa = useCallback(async () => {
    setIsLoadingJenisSewa(true)
    try {
      const data = await getJenisSewaAset()
      if (Array.isArray(data) && data.length > 0) {
        setJenisSewaOptions(data)
      }
    } catch (err) {
      console.warn('Gagal memuat jenis sewa aset dari server, memakai fallback opsi default', err)
    } finally {
      setIsLoadingJenisSewa(false)
    }
  }, [])

  useEffect(() => {
    fetchJenisSewa()
  }, [fetchJenisSewa])

  // Kalkulasi durasi hari
  const calculateDuration = useCallback((startStr: string, endStr: string): number => {
    if (!startStr || !endStr) return 1
    try {
      const start = new Date(startStr)
      const end = new Date(endStr)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return Math.max(1, diffDays + 1)
    } catch {
      return 1
    }
  }, [])

  // Submit permohonan baru
  const createPermohonan = useCallback(
    async (payload: FormAsetPayload, onSuccess?: (result: any) => void) => {
      setIsSubmitting(true)
      const toastId = toast.loading('Mengirim permohonan sewa aset...')
      try {
        const response = await submitPermohonanAset(payload)
        toast.success(response?.message || 'Permohonan sewa aset berhasil diajukan!')
        if (onSuccess) {
          onSuccess(response?.data || response)
        }
        return response
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Terjadi kesalahan saat mengajukan sewa aset'
        toast.error(errorMsg)
        throw error
      } finally {
        toast.remove(toastId)
        setIsSubmitting(false)
      }
    },
    []
  )

  // Update permohonan (saat revisi)
  const updatePermohonan = useCallback(
    async (id: string, payload: Partial<FormAsetPayload>, onSuccess?: (result: any) => void) => {
      setIsSubmitting(true)
      const toastId = toast.loading('Menyimpan perubahan permohonan sewa aset...')
      try {
        const response = await updatePermohonanAset(id, payload)
        toast.success(response?.message || 'Perubahan berhasil disimpan!')
        if (onSuccess) {
          onSuccess(response?.data || response)
        }
        return response
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Gagal memperbarui permohonan sewa aset'
        toast.error(errorMsg)
        throw error
      } finally {
        toast.remove(toastId)
        setIsSubmitting(false)
      }
    },
    []
  )

  // Ajukan ulang permohonan
  const ajukanUlang = useCallback(
    async (id: string, onSuccess?: () => void) => {
      setIsSubmitting(true)
      const toastId = toast.loading('Mengajukan ulang permohonan sewa aset...')
      try {
        const response = await reapplyPermohonanAset(id)
        toast.success(response?.message || 'Permohonan berhasil diajukan ulang!')
        if (onSuccess) {
          onSuccess()
        }
        return response
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Gagal mengajukan ulang permohonan'
        toast.error(errorMsg)
        throw error
      } finally {
        toast.remove(toastId)
        setIsSubmitting(false)
      }
    },
    []
  )

  return {
    isSubmitting,
    isLoadingJenisSewa,
    jenisSewaOptions,
    calculateDuration,
    createPermohonan,
    updatePermohonan,
    ajukanUlang,
    getDetailAset,
  }
}

export default useAset
