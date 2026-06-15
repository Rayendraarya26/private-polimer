import { PaginationQuery } from "./core"

export type FeedbacksListQuery = PaginationQuery & {
  search?: string
  status?: FeedbackItemStatusOrder
}

export enum FeedbackItemStatusOrder {
  DRAFT = 'draft',
  PERMOHONAN = 'permohonan',
  REVISI = 'revisi',
  PEMBAYARAN = 'pembayaran',
  PROCESS = 'proses' ,
  IN_REVIEW = 'review',
  DONE = 'selesai',
  DITOLAK = 'ditolak',
}

export type SertifikatItem = {
  kode: string
  nama: string
  ref_code: string | null
  download_link: string
}

export type FeedbackItem = {
  id: string
  layanan_id: string
  layanan: string
  fullname: string
  kode_order: string
  status_order: FeedbackItemStatusOrder
  file_attachment: Array<SertifikatItem>
  is_given_feedback: boolean
  feedback_json: unknown | null
  created_at: string
  persentase_order: number
  tanggal_order: string
  catatan_admin?: string | null
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
