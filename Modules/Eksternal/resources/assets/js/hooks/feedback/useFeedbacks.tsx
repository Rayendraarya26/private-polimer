import { useCallback, useEffect, useMemo, useState } from "react"
import useDebounceValue from "../useDebounceValue"
import { getErrorMessage } from "../../utils/error"
import toast from "react-hot-toast"
import { getAllFeedbacks } from "../../services/feedbacks"
import { FeedbackItem } from "../../types/feedbacks"

type Options = {
  defaultRowSize?: number
  useLoadMore?: boolean
}

export default (options?: Options) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<FeedbackItem[]>([])
  const [page, setPage] = useState<number>(1)
  const [rows] = useState<number>(options?.defaultRowSize || 20)
  const [total, setTotal] = useState<number>(0)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounceValue<string>(search, 500)

  useEffect(() => {
    setData([])
    setTotal(0)
  }, [debouncedSearch])

  const getFeedbacks = useCallback(
    async () => {
      try {
        if (page === 1) setData([])
        setLoading(true)
        const results = await getAllFeedbacks({
          page,
          rows,
          ...(search ? {search} : {})
        })
        setData(current => {
          if (options?.useLoadMore) {
            if (page === 1) return results.data || []
            return [...current, ...results.data]
          }
          return results.data || []
        })
        setTotal(results.total || 0)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    },
    [page, rows, search, options]
  )

  const changeSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  return {
    loading,
    data,
    search,
    total,
    page,
    totalPages: useMemo(() => Math.ceil(total/rows), [total, rows]),
    setPage,
    rows,
    debouncedSearch,
    getFeedbacks,
    changeSearch,
    setData
  }
}