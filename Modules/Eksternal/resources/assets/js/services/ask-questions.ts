import { DefaultApiResponse } from "../types/api"
import { AskQuestionsListQuery, SubmitQuestionPayload, SubmitResponsePayload } from "../types/ask-questions"
import api from "../utils/api"

export const getAllQuestions = async (params: AskQuestionsListQuery) => {
  try {
    const { data } = await api.get<DefaultApiResponse<{
      data: unknown[]
      total: number
    }>>('/v1/questions', {params})
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const submitQuestion = async (payload: SubmitQuestionPayload) => {
  try {
    const { data } = await api.post<DefaultApiResponse<unknown>>('/v1/questions', payload)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getQuestionDetail = async (uuid: string) => {
  try {
    const { data } = await api.get<DefaultApiResponse<unknown>>(`/v1/questions/${uuid}`)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getQuestionResponses = async (uuid: string) => {
  try {
    const { data } = await api.get<DefaultApiResponse<unknown[]>>(`/v1/questions/${uuid}/response`)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const submitQuestionResponse = async (uuid: string, payload: SubmitResponsePayload) => {
  try {
    const { data } = await api.post<DefaultApiResponse<unknown>>(`/v1/questions/${uuid}/response`, payload)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}