import { PaginationQuery } from "./core"

export type FeedbacksListQuery = PaginationQuery & {
  search?: string
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