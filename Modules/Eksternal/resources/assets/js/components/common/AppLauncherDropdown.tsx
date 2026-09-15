import React, { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Grid,
  ExternalLink,
  Archive,
  Landmark,
  BarChart3,
  Building2,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  FlaskConical,
  TrendingUp,
  Layers,
} from "lucide-react"

export interface SsoAppItem {
  id: string
  name: string
  name_full: string
  url: string
  category: "Pelayanan" | "Internal" | "Eksekutif"
}

export const renderSsoAppIcon = (appId: string, className = "w-5 h-5") => {
  switch (appId.toLowerCase()) {
    case "ars":
      return <Archive className={className} />
    case "bmn":
      return <Landmark className={className} />
    case "das":
      return <BarChart3 className={className} />
    case "eof":
      return <Building2 className={className} />
    case "puk":
      return <GraduationCap className={className} />
    case "puk_bo":
      return <UserCheck className={className} />
    case "ser":
      return <ShieldCheck className={className} />
    case "sil":
      return <FlaskConical className={className} />
    case "pnbp":
      return <TrendingUp className={className} />
    default:
      return <Layers className={className} />
  }
}

export const defaultSsoApps: SsoAppItem[] = [
  {
    id: "ars",
    name: "ARS",
    name_full: "Management Arsip",
    url: "http://localhost:4600/auth/sso/login",
    category: "Internal",
  },
  {
    id: "bmn",
    name: "BMN",
    name_full: "Barang Milik Negara",
    url: "http://localhost:4100/auth/sso/redirect.php",
    category: "Internal",
  },
  {
    id: "das",
    name: "DAS",
    name_full: "Dashboard Eksekutif",
    url: "http://localhost:4200/auth/sso/redirect",
    category: "Eksekutif",
  },
  {
    id: "eof",
    name: "EOF",
    name_full: "Internal Office",
    url: "http://localhost:10010/auth/sso/redirect.php",
    category: "Internal",
  },
  {
    id: "puk",
    name: "PUK",
    name_full: "Pelatihan dan Uji Kompetensi (Pelanggan)",
    url: "http://localhost:4400/auth/sso/redirect",
    category: "Pelayanan",
  },
  {
    id: "puk_bo",
    name: "PUK BO",
    name_full: "Management Pelatihan dan Uji Kompetensi",
    url: "http://localhost:4300/auth/sso/redirect",
    category: "Internal",
  },
  {
    id: "ser",
    name: "SER",
    name_full: "Sistem Informasi Sertifikasi",
    url: "http://localhost:4800/auth/sso/redirect",
    category: "Pelayanan",
  },
  {
    id: "sil",
    name: "SIL",
    name_full: "Sistem Informasi Labolatorium",
    url: "http://localhost:4900/auth/sso/redirect",
    category: "Pelayanan",
  },
  {
    id: "pnbp",
    name: "PNBP",
    name_full: "Monitoring Capaian PNBP",
    url: "https://lookerstudio.google.com/u/0/reporting/413af404-7305-44e6-9914-b3d2ef0e0ab7/page/JAy8D",
    category: "Eksekutif",
  },
]

export const AppLauncherDropdown: React.FC = () => {
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const directoryUrl = '/admin/ekosistem-aplikasi'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 9-Dots Grid Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-slate-500 hover:text-brand-700 hover:bg-slate-100 transition-colors flex items-center justify-center"
        title="Daftar Aplikasi SSO BBKKP"
      >
        <Grid className="w-5 h-5" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 p-4 space-y-3 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Daftar Aplikasi Terintegrasi</h4>
              <p className="text-[10px] text-slate-500">Ekosistem SSO BBKKP Kemenperin</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full border border-brand-200">
              9 Aplikasi
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {defaultSsoApps.map((app) => (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200/70 hover:border-brand-300 hover:bg-brand-50/40 transition-all group"
              >
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors shrink-0">
                  {renderSsoAppIcon(app.id, "w-4 h-4 text-brand-700 group-hover:text-brand-600")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-brand-700 truncate">
                      {app.name}
                    </p>
                    <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-brand-600 shrink-0" />
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {app.name_full}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              to={directoryUrl}
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 transition-colors inline-flex items-center gap-1"
            >
              Lihat Direktori Seluruh Aplikasi →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppLauncherDropdown
