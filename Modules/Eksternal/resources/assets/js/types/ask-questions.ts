import { PaginationQuery } from "./core"

export type AskQuestionsListQuery = PaginationQuery & {
  search?: string
}

export type SubmitQuestionPayload = {
  pertanyaan: string
}

export type SubmitResponsePayload = {
  response: string
}