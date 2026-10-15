import React, { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { ExternalLink } from "lucide-react"
import api from "../../utils/api"
import { cn } from "../../utils/cn"
import { defaultSsoApps, renderSsoAppIcon } from "../common/AppLauncherDropdown"

export interface SsoAppsSectionProps {
  className?: string
}

export const SsoAppsSection: React.FC<SsoAppsSectionProps> = ({ className }) => {
  const { data: ssoAppsData } = useQuery<any[]>({
    queryKey: ["dashboard", "sso-hub"],
    queryFn: async () => {
      const { data } = await api.get("/eksternal/dashboard/sso-hub")
      return data?.results || []
    },
    staleTime: 1000 * 60 * 10,
  })

  const ssoApps = useMemo(() => {
    const rawApps = ssoAppsData && ssoAppsData.length > 0 ? ssoAppsData : defaultSsoApps

    // Filter aplikasi layanan publik khusus pelanggan
    const customerApps = rawApps.filter((app: any) => {
      const name = (app.name || "").toUpperCase()
      if (["SER", "SIL", "PUK"].includes(name)) return true
      if (app.accessibility === "public") return true
      if (app.category === "Pelayanan") return true
      return false
    })

    // Pastikan SER berada di urutan pertama
    return customerApps.sort((a: any, b: any) => {
      if (a.name?.toUpperCase() === "SER") return -1
      if (b.name?.toUpperCase() === "SER") return 1
      return (a.name || "").localeCompare(b.name || "")
    })
  }, [ssoAppsData])

  return (
    <div className={cn("bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900">Daftar Aplikasi Layanan</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pintasan akses single sign-on ke portal layanan sertifikasi, laboratorium, dan pelatihan BBKKP
          </p>
        </div>
        <span className="text-xs font-medium text-slate-500 self-start sm:self-auto px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60">
          {ssoApps.length} Layanan Terhubung
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ssoApps.map((app: any) => {
          const isSer = app.name?.toUpperCase() === "SER"
          return (
            <div
              key={app.id || app.name}
              className={cn(
                "bg-white rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all",
                isSer
                  ? "border-brand-500 shadow-xs ring-1 ring-brand-500/10"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100/60 flex items-center justify-center text-brand-600 mb-3">
                  {renderSsoAppIcon(app.name || app.id, "w-5 h-5")}
                </div>
                <h4 className="text-sm font-bold text-slate-900">{app.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5 mb-4 line-clamp-2 min-h-[2.4em]">
                  {app.name_full || "Sistem Informasi Layanan BBKKP"}
                </p>
              </div>
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-colors",
                  isSer
                    ? "bg-brand-600 hover:bg-brand-700 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                )}
              >
                <span>Buka Layanan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SsoAppsSection
