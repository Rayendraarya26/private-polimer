import { DefaultApiResponse } from "../types/api"
import { AskQuestionsListQuery, Question, QuestionDetail, QuestionResponse, QuestionTopic, SubmitQuestionPayload, SubmitResponsePayload } from "../types/ask-questions"
import api from "../utils/api"

export const getQuestionTopics = async () => {
  try {
    const { data } = await api.get<DefaultApiResponse<QuestionTopic[]>>("/eksternal/pertanyaan/topik")
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getAllQuestions = async (params: AskQuestionsListQuery) => {
  try {
    const { data } = await api.get<DefaultApiResponse<{
      data: Question[]
      total: number
    }>>('/eksternal/pertanyaan', {params})
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const submitQuestion = async (payload: SubmitQuestionPayload) => {
  try {
    const { data } = await api.post<DefaultApiResponse<Question>>('/eksternal/pertanyaan/new-pertanyaan', payload)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getQuestionDetail = async (uuid: string) => {
  try {
    const { data } = await api.get<DefaultApiResponse<QuestionDetail>>(`/eksternal/pertanyaan/detail/${uuid}`)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getQuestionResponses = async (uuid: string) => {
  try {
    const { data } = await api.get<DefaultApiResponse<QuestionResponse[]>>(`/eksternal/pertanyaan/${uuid}`)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const submitCloseQuestion = async (uuid: string) => {
  try {
    const { data } = await api.post<DefaultApiResponse<QuestionResponse[]>>(`/eksternal/pertanyaan/${uuid}/closed`)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const submitReviewQuestion = async (uuid: string, payload: { rating: number, testimoni: string }) => {
  try {
    const { data } = await api.post<DefaultApiResponse<Question>>(`/eksternal/pertanyaan/${uuid}/review`, payload)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const submitQuestionResponse = async (uuid: string, payload: SubmitResponsePayload) => {
  try {
    const { data } = await api.post<DefaultApiResponse<QuestionResponse>>(`/eksternal/pertanyaan/${uuid}`, { pesan: payload.response })
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}