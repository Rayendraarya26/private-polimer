import { PaginationQuery } from "./core"

export type AskQuestionsListQuery = PaginationQuery & {
  search?: string
}

export type SubmitQuestionPayload = {
  topik: string
  pertanyaan: string
  layanan?: string
}

export type SubmitResponsePayload = {
  response: string
}

export enum QuestionStatus {
  OPENED = 'opened',
  CLOSED = 'closed'
}

export type Question = {
  id: string
  topik: string
  layanan: string
  status: QuestionStatus
  is_review: 'yes' | 'no'
  created_at: string
  total_pesan: number
  new_reply: number
}

export type QuestionDetail = {
  id: string
  pelanggan_id: string
  topik: string
  layanan: string
  status: QuestionStatus
  is_review: 'yes' | 'no'
  rating: string
  testimoni: string
  closed_by: string
  closed_by_name: string
  created_at: string
  updated_at: string
}

export type QuestionTopic = {
  id: string
  name: string
  desc: string
  created_at: string
  updated_at: string
}

export type QuestionResponse = {
  id: string
  pesan: string
  is_replied: "yes" | "no"
  is_author: boolean
  created_by: string
  created_at: string
}