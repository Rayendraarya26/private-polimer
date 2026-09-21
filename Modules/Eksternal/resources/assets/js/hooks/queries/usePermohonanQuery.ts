import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../utils/api"

export const PERMOHONAN_QUERY_KEY = ["permohonanList"]

/**
 * Hook TanStack Query untuk Daftar Permohonan Layanan & Tracking
 */
export function usePermohonanQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: [...PERMOHONAN_QUERY_KEY, params],
    queryFn: async () => {
      const response = await api.get("/eksternal/permohonan", { params })
      return response.data?.data || response.data?.results || []
    },
    staleTime: 1000 * 60 * 3, // 3 menit
  })
}

export type PembayaranItem = {
  id: string
  nama_permohonan: string
  no_permohonan: string
  tgl_order: string
  total_tagihan: number
  status_bayar: string
  va?: string | null
  va_trx_id?: string | null
  va_expired_at?: string | null
  va_status?: string | null
  invoice_number?: string | null
  invoice_file?: string | null
  pdf_tte?: string | null
  tte_invoice_requested?: boolean
  tte_invoice_requested_at?: string | null
  kuitansi_number?: string | null
  kuitansi_file?: string | null
  kuitansi_pdf_tte?: string | null
  tte_kuitansi_requested?: boolean
  tte_kuitansi_requested_at?: string | null
}

/**
 * Hook TanStack Query untuk Riwayat Pembayaran & Invoice
 */
export function usePembayaranQuery() {
  return useQuery<PembayaranItem[]>({
    queryKey: ["pembayaranList"],
    queryFn: async () => {
      const res = await api.get("/eksternal/pembayaran")
      return (res.data.data || []).map((item: any) => ({
        id: String(item.id),
        nama_permohonan: item.nama_permohonan || "-",
        no_permohonan: item.no_permohonan || "-",
        tgl_order: item.tgl_order || "-",
        total_tagihan: Number(item.total_tagihan || 0),
        status_bayar: item.status_bayar || "BELUM",
        va: item.va || null,
        va_trx_id: item.va_trx_id || null,
        va_expired_at: item.va_expired_at || null,
        va_status: item.va_status || "PENDING",
        invoice_number: item.invoice_number || null,
        invoice_file: item.invoice_file || null,
        pdf_tte: item.pdf_tte || null,
        tte_invoice_requested: Boolean(item.tte_invoice_requested),
        tte_invoice_requested_at: item.tte_invoice_requested_at || null,
        kuitansi_number: item.kuitansi_number || null,
        kuitansi_file: item.kuitansi_file || null,
        kuitansi_pdf_tte: item.kuitansi_pdf_tte || null,
        tte_kuitansi_requested: Boolean(item.tte_kuitansi_requested),
        tte_kuitansi_requested_at: item.tte_kuitansi_requested_at || null,
      }))
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 15,
  })
}

/**
 * Hook TanStack Query untuk Detail Permohonan (by ID)
 * Cache 5 menit — menghindari refetch saat user klik detail → kembali → klik lagi.
 */
export function usePermohonanDetailQuery(id?: string) {
  return useQuery({
    queryKey: ["permohonanDetail", id],
    queryFn: async () => {
      if (!id) return null
      const response = await api.get(`/eksternal/permohonan/${id}`)
      return response.data?.results || response.data?.data || response.data
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  })
}
