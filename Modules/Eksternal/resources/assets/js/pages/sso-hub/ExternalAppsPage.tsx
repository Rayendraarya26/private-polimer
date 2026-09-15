import React, { useState } from "react"
import {
  ExternalLink,
  Search,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Boxes,
  Building2,
  Lock,
} from "lucide-react"
import Head from "../../components/common/Head"
import { defaultSsoApps, SsoAppItem, renderSsoAppIcon } from "../../components/common/AppLauncherDropdown"

export const ExternalAppsPage: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredApps = defaultSsoApps.filter((app) => {
    const matchCategory = filterCategory === "ALL" || app.category === filterCategory
    const matchSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.name_full.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  // Category Theme Config
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "Pelayanan":
        return {
          badge: "bg-blue-50 text-blue-700 border-blue-200",
          iconBg: "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-blue-500/20",
          tag: "Pelayanan Publik",
        }
      case "Eksekutif":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          iconBg: "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-emerald-500/20",
          tag: "Eksekutif & Analitik",
        }
      case "Internal":
      default:
        return {
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
          iconBg: "bg-gradient-to-br from-indigo-700 to-slate-800 text-white shadow-indigo-500/20",
          tag: "Operasional Balai",
        }
    }
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto font-sans">
      <Head title="Daftar Aplikasi SSO Hub - BBKKP Polimer" />

      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-950 p-6 sm:p-10 text-white shadow-xl overflow-hidden border border-brand-800/40">
        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-brand-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Single Sign-On (SSO) Portal Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ekosistem Aplikasi Terintegrasi BBKKP
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Akses langsung ke seluruh sistem operasional industri, sertifikasi SNI, pengujian laboratorium terakreditasi KAN, arsip digital, dan visualisasi capaian PNBP dengan satu akun terpadu.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
              <Boxes className="w-3.5 h-3.5 text-brand-300" />
              <strong>9 Sistem</strong> Aktif
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <strong>OAuth 2.0</strong> SSO Terpusat
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <strong>1-Click</strong> Direct Login
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Live Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "ALL", label: "Semua Sistem", count: 9 },
            { id: "Pelayanan", label: "Pelayanan Publik", count: 3 },
            { id: "Internal", label: "Operasional Balai", count: 4 },
            { id: "Eksekutif", label: "Eksekutif & Analitik", count: 2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap select-none ${
                filterCategory === tab.id
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/20 font-bold"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90 shadow-2xs"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  filterCategory === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode atau nama sistem..."
            className="w-full pl-10 pr-3.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      {/* 4-Column Modern Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredApps.map((app) => {
          const theme = getCategoryTheme(app.category)

          return (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-brand-300 transition-all duration-300 flex flex-col justify-between p-6 relative overflow-hidden group"
            >
              {/* Top Accent Line on hover */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header Row: Category Badge + External Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${theme.badge}`}>
                    {theme.tag}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 transition-colors" />
                </div>

                {/* Center Icon */}
                <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} shadow-md flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform`}>
                  {renderSsoAppIcon(app.id, "w-7 h-7")}
                </div>

                {/* App Code Title */}
                <h3 className="text-lg font-bold text-slate-900 text-center tracking-tight group-hover:text-brand-700 transition-colors">
                  {app.name}
                </h3>

                {/* Full Description */}
                <p className="text-xs text-slate-500 text-center mt-1.5 min-h-[38px] flex items-center justify-center leading-relaxed">
                  {app.name_full}
                </p>
              </div>

              {/* Action Button CTA */}
              <div className="mt-5 pt-3.5 border-t border-slate-100">
                <a
                  href={app.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-50 hover:bg-brand-600 text-slate-700 hover:text-white text-xs font-bold border border-slate-200 hover:border-brand-600 transition-all shadow-2xs group/btn"
                >
                  <span>Buka Aplikasi</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ExternalAppsPage
