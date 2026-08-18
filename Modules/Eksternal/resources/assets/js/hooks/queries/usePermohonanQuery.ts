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

/**
 * Hook TanStack Query untuk Riwayat Pembayaran & Invoice
 */
export function usePembayaranQuery() {
  return useQuery({
    queryKey: ["pembayaranList"],
    queryFn: async () => {
      const res = await api.get("/eksternal/pembayaran")
      return (res.data.data || []).map((item: any) => ({
        id: item.id,
        nama_permohonan: item.nama_permohonan || "-",
        no_permohonan: item.no_permohonan || "-",
        tgl_order: item.tgl_order || "-",
        total_tagihan: Number(item.total_tagihan || 0),
        status_bayar: item.status_bayar || "BELUM",
        invoice_file: item.invoice_file || null,
        kuitansi_file: item.kuitansi_file || null,
      }))
    },
    staleTime: 1000 * 60 * 3,
  })
}
