import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { getErrorMessage } from "../utils/error"
import { getAllLayanan, getSummaryLayanan } from "../services/dashboard"
import { LayananItem, StatisticLayanan } from "../types/dashboard"

type LoadingStates = {
  statistic: boolean
  layanan: boolean
}

export default () => {
  const [loading, setLoading] = useState<LoadingStates>({
    statistic: false,
    layanan: false
  })
  const [statisticData, setStatisticData] = useState<StatisticLayanan | null>(null)
  const [layanan, setLayanan] = useState<LayananItem[]>([])

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
        setLoading(c => ({...c, layanan: true}))
        const results = await getAllLayanan()
        setLayanan(results)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(c => ({...c, layanan: false}))
      }
    },
    []
  )

  return {
    loading,
    statisticData,
    layanan,
    getStatisticData,
    getLayanan,
  }
}