import { DefaultApiResponse } from "../types/api"
import { FeedbackItem, FeedbacksListQuery } from "../types/feedbacks"
import api from "../utils/api"

export const getAllFeedbacks = async (params: FeedbacksListQuery) => {
  try {
    const { data } = await api.get<DefaultApiResponse<{
      data: FeedbackItem[]
      total: number
    }>>('/eksternal/layanan', {params})
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getFeedbackRequest = async (uuid: string) => {
  try {
    const { data } = await api.get<DefaultApiResponse<FeedbackItem>>(`/eksternal/pertanyaan/detail/${uuid}`)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}