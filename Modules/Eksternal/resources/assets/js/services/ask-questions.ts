import { DefaultApiResponse } from "../types/api"
import { AskQuestionsListQuery, Question, QuestionDetail, QuestionTopic, SubmitQuestionPayload, SubmitResponsePayload } from "../types/ask-questions"
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
    const { data } = await api.post<DefaultApiResponse<unknown>>('/eksternal/pertanyaan/new-pertanyaan', payload)
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