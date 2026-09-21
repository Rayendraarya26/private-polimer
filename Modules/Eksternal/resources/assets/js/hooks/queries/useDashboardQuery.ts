import { useQuery } from "@tanstack/react-query"
import api from "../../utils/api"

/**
 * Hook TanStack Query untuk Statistik Dashboard (per tahun)
 * Cache 3 menit — data statistik tidak sering berubah.
 */
export function useDashboardStatsQuery(tahun: number) {
  return useQuery({
    queryKey: ["dashboard", "stats", tahun],
    queryFn: async () => {
      const { data } = await api.get("/eksternal/permohonan/statistik", {
        params: { tahun },
      })
      return data.results
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 15,
  })
}

/**
 * Hook TanStack Query untuk Slider/Banner Dashboard
 * Cache 10 menit — banner jarang berubah.
 */
export function useSlidersQuery() {
  return useQuery({
    queryKey: ["dashboard", "sliders"],
    queryFn: async () => {
      const { data } = await api.get("/eksternal/dashboard/banner")
      return data.results || []
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}

/**
 * Hook TanStack Query untuk Daftar Layanan (sidebar / dashboard)
 * Cache 10 menit — master layanan stabil.
 */
export function useLayananQuery() {
  return useQuery({
    queryKey: ["dashboard", "layanan"],
    queryFn: async () => {
      const { data } = await api.get("/eksternal/dashboard/layanan")
      return data.results || []
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}

/**
 * Hook TanStack Query untuk Sidebar Counts
 * Cache 2 menit.
 */
export function useSidebarCountsQuery() {
  return useQuery({
    queryKey: ["dashboard", "sidebarCounts"],
    queryFn: async () => {
      const { data } = await api.get("/eksternal/dashboard/sidebar-counts")
      return data.results || data.data || {}
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  })
}

/**
 * Hook TanStack Query untuk Riwayat Permohonan di Dashboard
 * Cache 3 menit — list permohonan aktif.
 */
export function useDashboardPermohonanQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["dashboard", "permohonanList", params],
    queryFn: async () => {
      const { data } = await api.get("/eksternal/permohonan", { params })
      return data?.results || { data: [], total: 0, page: 1, totalPages: 1 }
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 15,
  })
}

/**
 * Hook TanStack Query untuk Feedbacks (Survey Kepuasan) — paginated
 * Cache 3 menit.
 */
export function useFeedbacksQuery(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["feedbacks", params],
    queryFn: async () => {
      const { data } = await api.get("/eksternal/permohonan", { params })
      return data?.results || { data: [], total: 0 }
    },
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 10,
  })
}
