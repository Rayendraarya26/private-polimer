import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../utils/api"
import { toast } from "react-hot-toast"

export const PROFILE_QUERY_KEY = ["userProfile"]

export interface UserProfileResponse {
  nama: string
  surel: string
  whatsapp: string
  alamat: string
  detail?: any
  jenis_pelanggan?: string
}

/**
 * Hook TanStack Query untuk Profil Pengguna
 */
export function useProfileQuery() {
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const response = await api.get("/eksternal/user")
      return response.data?.results || response.data?.data || response.data
    },
    staleTime: 1000 * 60 * 5, // 5 menit cache segar
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: FormData | Record<string, any>) => {
      const response = await api.post("/eksternal/profile/update", payload)
      return response.data
    },
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui")
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal memperbarui profil"
      toast.error(message)
    },
  })

  return {
    ...profileQuery,
    profile: profileQuery.data,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  }
}
