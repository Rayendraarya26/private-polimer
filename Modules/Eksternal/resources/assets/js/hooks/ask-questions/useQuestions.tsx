import { useCallback, useEffect, useMemo, useState } from "react"
import useDebounceValue from "../useDebounceValue"
import { getAllQuestions } from "../../services/ask-questions"
import { getErrorMessage } from "../../utils/error"
import toast from "react-hot-toast"
import { Question } from "../../types/ask-questions"

type Options = {
  defaultRowSize?: number
  useLoadMore?: boolean
}

export default (options?: Options) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<Question[]>([])
  const [page, setPage] = useState<number>(1)
  const [rows] = useState<number>(options?.defaultRowSize || 20)
  const [total, setTotal] = useState<number>(0)
  const [search, setSearch] = useState<string>('')
  const debouncedSearch = useDebounceValue<string>(search, 500)

  useEffect(() => {
    setData([])
    setTotal(0)
  }, [debouncedSearch])

  const getQuestions = useCallback(
    async () => {
      try {
        setLoading(true)
        const results = await getAllQuestions({
          page,
          rows,
          ...(search ? {search} : {})
        })
        setData(current => {
          if (options?.useLoadMore) {
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
    getQuestions,
    changeSearch
  }
}