import { DefaultApiResponse } from "../types/api"
import { FeedbackItem, FeedbacksListQuery, FeedbackStructure } from "../types/feedbacks"
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

export const getFeedbackDetail = async (uuid: string) => {
  try {
    const { data } = await api.get<DefaultApiResponse<FeedbackStructure[]>>(`/eksternal/layanan/${uuid}/feedback`)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const submitFeedback = async (uuid: string, feedbacks: object) => {
  try {
    const { data } = await api.post<DefaultApiResponse<unknown>>(`/eksternal/layanan/${uuid}/feedback`, { feedbacks })
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}