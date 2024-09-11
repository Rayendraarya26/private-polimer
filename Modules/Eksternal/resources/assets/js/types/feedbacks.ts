import { PaginationQuery } from "./core"

export type FeedbacksListQuery = PaginationQuery & {
  search?: string
  status?: FeedbackItemStatusOrder
}

export enum FeedbackItemStatusOrder {
  PERMOHONAN = 'permohonan',
  PEMBAYARAN = 'pembayaran',
  PROCESS = 'proses' ,
  IN_REVIEW = 'review',
  DONE = 'selesai',
}

export type FeedbackItem = {
  id: string
  layanan_id: string
  layanan: string
  fullname: string
  kode_order: string
  status_order: FeedbackItemStatusOrder
  file_attachment: string | null
  is_given_feedback: boolean
  feedback_json: unknown | null
  created_at: string
}

export enum FeedbackInputType {
  NUMBER = 'number',
  RANGE = 'range',
  TEXTAREA= 'textarea'
}

export type FeedbackStructure = {
  id: string
  input_type: FeedbackInputType | null
  order: number
  question: string
  focused: string
  required: boolean
  child: FeedbackStructure[] | null
  value: string | number | null
}
