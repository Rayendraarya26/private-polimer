import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { getErrorMessage } from "../utils/error"
import { getAllLayanan, getAllSliders, getSummaryLayanan } from "../services/dashboard"
import { StatisticLayanan } from "../types/dashboard"
import { useDispatch } from "react-redux"
import { setLayanan, setLoadingLayanan, setSliders } from "../store/dashboard"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import api from "../utils/api"
import Swal from "sweetalert2"

type LoadingStates = {
  statistic: boolean
}

export default () => {
  const dispatch = useDispatch()
  const { loadingLayanan, layanan, sliders } = useSelector(({ dashboard }: RootState) => dashboard)
  const [loading, setLoading] = useState<LoadingStates>({ statistic: false })
  const [statisticData, setStatisticData] = useState<StatisticLayanan | null>(null)
  const [submittedIds, setSubmittedIds] = useState<string[]>([])

  const getStatisticData = useCallback(
    async (year: number) => {
      try {
        setLoading(c => ({...c, statistic: true}))
        const results = await getSummaryLayanan({ tahun: year })
        setStatisticData(results)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(c => ({...c, statistic: false}))
      }
    },
    []
  )

  const getLayanan = useCallback(
    async () => {
      try {
        dispatch(setLoadingLayanan(true))
        const results = await getAllLayanan()
        dispatch(setLayanan(results))
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        dispatch(setLoadingLayanan(false))
      }
    },
    []
  )

  const getSliders = useCallback(
    async () => {
      try {
        const results = await getAllSliders()
        dispatch(setSliders(results))
      } catch (error) {
        toast.error(getErrorMessage(error))
      }
    },
    []
  )
  const ajukanPermohonan = useCallback(
    async (id: string, callback?: () => void) => {
      const confirm = await Swal.fire({
        title: 'Konfirmasi Pengajuan',
        text: 'Apakah Anda yakin ingin mengajukan permohonan ini?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Ajukan',
        cancelButtonText: 'Batal',
        reverseButtons: true
      })
      if (!confirm.isConfirmed) return
      const toastId = toast.loading("Mengajukan permohonan...")
      try {
        const res = await api.post(`/eksternal/permohonan/${id}/ajukan`)
        const response = res?.data ?? res
        if (response?.success) {
          toast.success(response.message || "Berhasil diajukan")
          setSubmittedIds(prev => [...prev, id]) // 🔥 INI PENTING
          if (callback) callback()
        } else {
          toast.error(response?.message || "Gagal mengajukan")
        }
        return response
      } catch (error: any) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Terjadi kesalahan sistem"
        toast.error(msg)
      } finally {
        toast.dismiss(toastId)
      }
    },
    []
  )

  return {
    loading,
    loadingLayanan,
    statisticData,
    layanan,
    sliders,
    getStatisticData,
    getLayanan,
    getSliders,
    ajukanPermohonan,
    submittedIds,
    setSubmittedIds
  }
}