import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getMasterKomoditiPengujian,
  getParametersByKomoditi,
  submitPermohonanPengujian,
  getDetailPengujian,
} from "../../services/pengujian"
import { MasterKomoditi, MasterParameterUji } from "../../types/pengujian"

/**
 * Hook TanStack Query untuk Daftar Master Komoditas Pengujian (Cached 24 Jam)
 */
export function useMasterKomoditiQuery() {
  return useQuery<MasterKomoditi[]>({
    queryKey: ["pengujian", "masterKomoditi"],
    queryFn: async () => {
      return await getMasterKomoditiPengujian()
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 jam caching master komoditi
    gcTime: 1000 * 60 * 60 * 24,
  })
}

/**
 * Hook TanStack Query untuk Daftar Parameter Uji per Komoditas (Cached 24 Jam)
 */
export function useParametersByKomoditiQuery(komoditiId?: number | null) {
  const normalizedId = komoditiId ? Number(komoditiId) : undefined

  return useQuery<MasterParameterUji[]>({
    queryKey: ["pengujian", "parameters", normalizedId],
    queryFn: async () => {
      if (!normalizedId) return []
      return await getParametersByKomoditi(normalizedId)
    },
    enabled: Boolean(normalizedId),
    staleTime: 1000 * 60 * 60 * 24, // 24 jam caching per komoditas
    gcTime: 1000 * 60 * 60 * 24,
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
