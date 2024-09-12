import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { getErrorMessage } from "../utils/error"
import { getSummaryLayanan } from "../services/dashboard"
import { StatisticLayanan } from "../types/dashboard"

type LoadingStates = {
  statistic: boolean
}

export default () => {
  const [loading, setLoading] = useState<LoadingStates>({
    statistic: false
  })
  const [statisticData, setStatisticData] = useState<StatisticLayanan | null>(null)

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

  return {
    loading,
    statisticData,
    getStatisticData,
  }
}