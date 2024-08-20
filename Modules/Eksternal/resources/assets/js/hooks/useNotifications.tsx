import { useCallback, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { fetchNotifications, markAllNotificationsAsRead } from "../services/notifications"
import { getErrorMessage } from "../utils/error"
import { useDispatch } from "react-redux"
import { setUnreadNotifCount } from "../store/profile"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { NotificationItem } from "../types/notifications"

type Options = {
  useLoadMore?: boolean
}

export default (options?: Options) => {
  const dispatch = useDispatch()
  const { unreadNotifCount } = useSelector(({ profile }: RootState) => profile)
  const [loading, setLoading] = useState<boolean>(false)
  const [marking, setMarking] = useState<boolean>(false)
  const [data, setData] = useState<NotificationItem[]>([])
  const [page, setPage] = useState<number>(1)
  const [rows] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)

  const getNotifications = useCallback(
    async () => {
      try {
        setLoading(true)
        const { total, unread, data } = await fetchNotifications({ page, rows })
        setTotal(total)
        setData(current => {
          if (options?.useLoadMore) {
            return [...current, ...data]
          }
          return data || []
        })
        dispatch(setUnreadNotifCount(unread))
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    },
    [page, rows]
  )

  const markAllAsRead = useCallback(
    async () => {
      try {
        setMarking(true)
        await markAllNotificationsAsRead()
        setPage(1)
        setData([])
        getNotifications()
        // fetchCounter(CounterType.NOTIFICATIONS)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setMarking(false)
      }
    },
    [page, rows]
  )

  return {
    loading,
    marking,
    data,
    page,
    rows,
    total,
    totalPages: useMemo(() => Math.ceil(total/rows), [total, rows]),
    unreadCount: unreadNotifCount,
    getNotifications,
    setPage,
    markAllAsRead
  }
}