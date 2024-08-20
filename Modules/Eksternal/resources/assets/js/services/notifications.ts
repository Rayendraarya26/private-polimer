import { DefaultApiResponse } from '../types/api'
import { PaginationQuery } from '../types/core'
import { NotificationItem } from '../types/notifications'
import api from '../utils/api'

export const fetchNotifications = async (params: PaginationQuery) => {
  try {
    const { data } = await api.get<DefaultApiResponse<{
      data: NotificationItem[]
      unread: number
      total: number
    }>>('/eksternal/notifications', {params})

    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const markAllNotificationsAsRead = async () => {
  try {
    const { data } = await api.post<DefaultApiResponse<unknown>>('/eksternal/notifications/mark-all-as-read')
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}