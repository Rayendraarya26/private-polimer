import { useCallback, useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import useDebounceValue from "../useDebounceValue"
import { getAllFeedbacks } from "../../services/feedbacks"
import { FeedbackItem, FeedbackItemStatusOrder } from "../../types/feedbacks"

type Options = {
  defaultRowSize?: number
  useLoadMore?: boolean
  defaultStatus?: FeedbackItemStatusOrder
}

export default (options?: Options) => {
  const [page, setPage] = useState<number>(1)
  const [rows] = useState<number>(options?.defaultRowSize || 20)
  const [search, setSearch] = useState<string>('')
  const [status, setStatus] = useState<FeedbackItemStatusOrder | undefined>(options?.defaultStatus || undefined)
  const debouncedSearch = useDebounceValue<string>(search, 500)
  const [accumulatedData, setAccumulatedData] = useState<FeedbackItem[]>([])

  // Reset page dan accumulated data saat filter search / status berubah
  useEffect(() => {
    setPage(1)
    setAccumulatedData([])
  }, [debouncedSearch, status])

  const {
    data: queryResult,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["feedbacks", { page, rows, search: debouncedSearch, status }],
    queryFn: async () => {
      const results = await getAllFeedbacks({
        page,
        rows,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
        ...(status ? { status } : {}),
      })
      return results || { data: [], total: 0 }
    },
    staleTime: 1000 * 60 * 3, // Cache 3 menit
    gcTime: 1000 * 60 * 15,
  })

  // Akumulasi data untuk infinite scroll / load more
  useEffect(() => {
    if (!queryResult?.data) return
    if (!options?.useLoadMore || page === 1) {
      setAccumulatedData(queryResult.data)
    } else {
      setAccumulatedData((prev) => {
        const existingIds = new Set(prev.map((item) => item.id))
        const newItems = queryResult.data.filter((item) => !existingIds.has(item.id))
        return [...prev, ...newItems]
      })
    }
  }, [queryResult?.data, page, options?.useLoadMore])

  const data = useMemo(() => {
    if (options?.useLoadMore && page > 1) {
      return accumulatedData
    }
    return queryResult?.data || accumulatedData || []
  }, [options?.useLoadMore, page, accumulatedData, queryResult?.data])

  const total = queryResult?.total ?? 0

  const getFeedbacks = useCallback(async () => {
    await refetch()
  }, [refetch])

  const changeSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const changeStatus = useCallback((value: FeedbackItemStatusOrder | undefined) => {
    setPage(1)
    setStatus(value)
  }, [])

  const setData = useCallback((updater: React.SetStateAction<FeedbackItem[]>) => {
    setAccumulatedData(updater)
  }, [])

  return {
    loading: isLoading && data.length === 0,
    isFetching,
    data,
    search,
    total,
    page,
    totalPages: useMemo(() => Math.ceil(total / (rows || 1)), [total, rows]),
    setPage,
    rows,
    debouncedSearch,
    status,
    getFeedbacks,
    changeSearch,
    changeStatus,
    setData,
  }
}