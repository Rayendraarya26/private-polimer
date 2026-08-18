import React, { memo, Suspense, useEffect } from "react"
import { AppShell } from "../components/layouts/AppShell"
import { useDispatch } from "react-redux"
import { setWindowWidth } from "../store/common"
import useProfile from "../hooks/useProfile"
import useDashboard from "../hooks/useDashboard"
import { Loader2 } from "lucide-react"

const FallbackLoader: React.FC = () => (
  <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-400">
    <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
    <span className="text-xs font-medium text-slate-500">Memuat halaman...</span>
  </div>
)

import { checkProfileStatus } from "../services/permohonan"
import { queryClient } from "../lib/queryClient"

const PrivateLayout: React.FC = () => {
  const dispatch = useDispatch()
  const { getMyProfile } = useProfile()
  const { getLayanan, getSliders } = useDashboard()

  useEffect(() => {
    getMyProfile()
    getLayanan()
    getSliders()
    // Prefetch status profil akun di background sehingga saat user klik layanan, verifikasi 0ms instan
    queryClient.prefetchQuery({
      queryKey: ["profileStatus"],
      queryFn: checkProfileStatus,
      staleTime: 1000 * 60 * 10,
    })
    const resize = () => dispatch(setWindowWidth(window.innerWidth))
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return <AppShell />
}

export default memo(PrivateLayout)