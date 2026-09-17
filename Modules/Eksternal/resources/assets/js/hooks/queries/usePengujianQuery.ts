import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getMasterKomoditiPengujian,
  getParametersByKomoditi,
  submitPermohonanPengujian,
  getDetailPengujian,
} from "../../services/pengujian"
import { MasterKomoditi, MasterParameterUji } from "../../types/pengujian"

/**
 * Hook TanStack Query untuk Daftar Master Komoditas Pengujian
 */
export function useMasterKomoditiQuery() {
  return useQuery<MasterKomoditi[]>({
    queryKey: ["pengujian", "masterKomoditi"],
    queryFn: async () => {
      return await getMasterKomoditiPengujian()
    },
    staleTime: 1000 * 60 * 30, // 30 menit caching master data
  })
}

/**
 * Hook TanStack Query untuk Daftar Parameter Uji per Komoditas
 */
export function useParametersByKomoditiQuery(komoditiId?: number | null) {
  return useQuery<MasterParameterUji[]>({
    queryKey: ["pengujian", "parameters", komoditiId],
    queryFn: async () => {
      if (!komoditiId) return []
      return await getParametersByKomoditi(komoditiId)
    },
    enabled: Boolean(komoditiId),
    staleTime: 1000 * 60 * 30, // 30 menit caching
  })
}

/**
 * Hook TanStack Query untuk Detail Permohonan Pengujian
 */
export function usePengujianDetailQuery(id?: string | number) {
  return useQuery({
    queryKey: ["pengujian", "detail", id],
    queryFn: async () => {
      if (!id) return null
      return await getDetailPengujian(id)
    },
    enabled: Boolean(id),
  })
}

/**
 * Hook Mutation untuk Pengajuan Permohonan Pengujian Baru
 */
export function useSubmitPengujianMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await submitPermohonanPengujian(formData)
    },
    onSuccess: () => {
      // Invalidate permohonan list dan statistik agar ter-refresh
      queryClient.invalidateQueries({ queryKey: ["permohonan"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
