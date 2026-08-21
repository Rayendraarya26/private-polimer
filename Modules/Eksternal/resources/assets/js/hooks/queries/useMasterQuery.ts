import { useQuery } from "@tanstack/react-query"
import api from "../../utils/api"
import { getSkemalsp } from "../../services/lsp"
import { getSkemaPelatihan } from "../../services/pelatihan"
import { getSkemaSertifikasi } from "../../services/sertifikasi"

/**
 * Hook TanStack Query untuk Daftar Skema Sertifikasi Produk & Sistem (LSPro)
 */
export function useSertifikasiSkemaQuery() {
  return useQuery({
    queryKey: ["master", "skemaSertifikasi"],
    queryFn: async () => {
      return await getSkemaSertifikasi()
    },
    staleTime: 1000 * 60 * 30,
  })
}

/**
 * Hook TanStack Query untuk Daftar Skema Sertifikasi LSP
 */
export function useLspSkemaQuery() {
  return useQuery({
    queryKey: ["master", "skemaLSP"],
    queryFn: async () => {
      return await getSkemalsp()
    },
    staleTime: 1000 * 60 * 30, // 30 menit master data
  })
}

/**
 * Hook TanStack Query untuk Daftar Skema Pelatihan
 */
export function usePelatihanSkemaQuery() {
  return useQuery({
    queryKey: ["master", "skemaPelatihan"],
    queryFn: async () => {
      return await getSkemaPelatihan()
    },
    staleTime: 1000 * 60 * 30,
  })
}

/**
 * Hook TanStack Query untuk Wilayah (Provinsi, Kabupaten, Kecamatan)
 */
export function useProvincesQuery() {
  return useQuery({
    queryKey: ["master", "provinces"],
    queryFn: async () => {
      const response = await api.get("/eksternal/regions/provinces")
      return response.data?.data || []
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 jam untuk provinsi
  })
}

export function useRegenciesQuery(provinceId?: string) {
  return useQuery({
    queryKey: ["master", "regencies", provinceId],
    queryFn: async () => {
      if (!provinceId) return []
      const response = await api.get(`/eksternal/regions/regencies/${provinceId}`)
      return response.data?.data || []
    },
    enabled: Boolean(provinceId),
    staleTime: 1000 * 60 * 60 * 24,
  })
}

export function useDistrictsQuery(regencyId?: string) {
  return useQuery({
    queryKey: ["master", "districts", regencyId],
    queryFn: async () => {
      if (!regencyId) return []
      const response = await api.get(`/eksternal/regions/districts/${regencyId}`)
      return response.data?.data || []
    },
    enabled: Boolean(regencyId),
    staleTime: 1000 * 60 * 60 * 24,
  })
}
