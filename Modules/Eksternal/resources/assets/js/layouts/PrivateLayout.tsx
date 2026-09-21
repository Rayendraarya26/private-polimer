import React, { memo, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Loader2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { AppShell } from "../components/layouts/AppShell"
import { setWindowWidth } from "../store/common"
import useProfile from "../hooks/useProfile"
import { checkProfileStatus } from "../services/permohonan"
import { regionService } from "../services/region-service"
import api from "../utils/api"

export const FallbackLoader: React.FC = () => (
  <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
    <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
    <span className="text-xs font-medium text-slate-500">Memuat halaman...</span>
  </div>
)

const PrivateLayout: React.FC = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { getMyProfile } = useProfile()

  useEffect(() => {
    // Profile masih via Redux (dibutuhkan banyak komponen via useSelector)
    getMyProfile()

    // Prefetch semua data master & dashboard ke TanStack Query cache
    // Ini berjalan di background saat login, sehingga navigasi ke halaman manapun instant
    if (queryClient) {
      // Profile status (dipakai oleh useProfileStatus guard)
      queryClient.prefetchQuery({
        queryKey: ["profileStatus"],
        queryFn: checkProfileStatus,
        staleTime: 1000 * 60 * 10,
      })

      // Master Provinsi (dipakai dropdown profil & form PUP/Sertifikasi)
      queryClient.prefetchQuery({
        queryKey: ["regions", "provinces"],
        queryFn: () => regionService.getProvinces(),
        staleTime: 1000 * 60 * 60 * 24,
      })

      // Dashboard Sliders (banner carousel)
      queryClient.prefetchQuery({
        queryKey: ["dashboard", "sliders"],
        queryFn: async () => {
          const { data } = await api.get("/eksternal/dashboard/banner")
          return data.results || []
        },
        staleTime: 1000 * 60 * 10,
      })

      // Dashboard Layanan (sidebar menu + katalog)
      queryClient.prefetchQuery({
        queryKey: ["dashboard", "layanan"],
        queryFn: async () => {
          const { data } = await api.get("/eksternal/dashboard/layanan")
          return data.results || []
        },
        staleTime: 1000 * 60 * 10,
      })
    }

    const resize = () => dispatch(setWindowWidth(window.innerWidth))
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [queryClient])

  return <AppShell />
}

export default memo(PrivateLayout)