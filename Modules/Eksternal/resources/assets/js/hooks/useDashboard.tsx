import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { getErrorMessage } from "../utils/error"
import { getAllLayanan, getAllSliders, getSummaryLayanan } from "../services/dashboard"
import { StatisticLayanan } from "../types/dashboard"
import { useDispatch } from "react-redux"
import { setLayanan, setLoadingLayanan, setSliders } from "../store/dashboard"
import { useSelector } from "react-redux"
import { RootState } from "../store"

type LoadingStates = {
  statistic: boolean
}

export default () => {
  const dispatch = useDispatch()
  const { loadingLayanan, layanan, sliders } = useSelector(({ dashboard }: RootState) => dashboard)
  const [loading, setLoading] = useState<LoadingStates>({ statistic: false })
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

  return {
    loading,
    loadingLayanan,
    statisticData,
    layanan,
    sliders,
    getStatisticData,
    getLayanan,
    getSliders
  }
}