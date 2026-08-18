import { useQuery } from "@tanstack/react-query"
import { regionService, RegionBase } from "../../services/region-service"

/**
 * High-performance cached Region Hook using TanStack Query.
 * All provinces, regencies, and districts are cached in memory for instant dropdown response.
 */
const useRegions = (provId?: string | null, kabId?: string | null) => {
  // Query Provinsi (Cached for 24 Hours)
  const provincesQuery = useQuery<RegionBase[]>({
    queryKey: ["regions", "provinces"],
    queryFn: async () => {
      return await regionService.getProvinces()
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 jam
    gcTime: 1000 * 60 * 60 * 24,
  })

  // Query Kabupaten (Cached by provId for 24 Hours)
  const regenciesQuery = useQuery<RegionBase[]>({
    queryKey: ["regions", "regencies", provId],
    queryFn: async () => {
      if (!provId) return []
      return await regionService.getRegencies(provId)
    },
    enabled: Boolean(provId),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  })

  // Query Kecamatan (Cached by kabId for 24 Hours)
  const districtsQuery = useQuery<RegionBase[]>({
    queryKey: ["regions", "districts", kabId],
    queryFn: async () => {
      if (!kabId) return []
      return await regionService.getDistricts(kabId)
    },
    enabled: Boolean(kabId),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  })

  return {
    provinces: provincesQuery.data || [],
    regencies: regenciesQuery.data || [],
    districts: districtsQuery.data || [],
    loading:
      provincesQuery.isLoading ||
      regenciesQuery.isLoading ||
      districtsQuery.isLoading,
  }
}

export default useRegions