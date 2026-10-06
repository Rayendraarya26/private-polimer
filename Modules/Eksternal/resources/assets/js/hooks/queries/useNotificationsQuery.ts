import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../../services/notifications"
import { setUnreadNotifCount } from "../../store/profile"
import { NotificationItem } from "../../types/notifications"

export interface NotificationsResponse {
  data: NotificationItem[]
  unread: number
  total: number
}

/**
 * Hook TanStack Query untuk Notifikasi Dashboard Pelanggan
 * Mengambil data notifikasi terbaru, menyinkronkan counter ke Redux,
 * dan melakukan refetch saat window aktif atau interval 60 detik.
 */
export function useNotificationsQuery(params?: { row?: number }) {
  const dispatch = useDispatch()
  const row = params?.row ?? 10

  return useQuery({
    queryKey: ["notifications", { row }],
    queryFn: async () => {
      const results = await fetchNotifications({ page: 1, rows: row })
      if (results) {
        dispatch(setUnreadNotifCount(results.unread || 0))
      }
      return (results || { data: [], unread: 0, total: 0 }) as NotificationsResponse
    },
    staleTime: 1000 * 30, // 30 detik
    refetchInterval: 1000 * 60, // 1 menit polling otomatis
    refetchOnWindowFocus: true,
  })
}

/**
 * Mutation untuk menandai seluruh notifikasi telah dibaca
 */
export function useMarkAllNotificationsMutation() {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      dispatch(setUnreadNotifCount(0))
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

/**
 * Mutation untuk menandai 1 notifikasi spesifik telah dibaca
 */
export function useMarkNotificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}
