import React from "react"
import { useNavigate } from "react-router-dom"
import {
  ClipboardList,
  Clock,
  FlaskConical,
  FileCheck2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Receipt,
  Users,
  CheckCircle2,
  XCircle,
  Building2,
  Search,
  Filter,
  Boxes,
  Layers,
  ExternalLink,
} from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { StatsCard } from "../../../components/ui/StatsCard"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { defaultSsoApps, renderSsoAppIcon } from "../../../components/common/AppLauncherDropdown"

// Static Mock Data KPI (declared outside component to prevent garbage collection on re-render)
const URGENT_PERMOHONAN = [
  {
    id: "REQ-2026-0819",
    pelanggan: "PT Indorubber Global Tech",
    layanan: "Uji Tarik & Vulkanisasi Karet",
    jenis: "Pengujian Lab",
    sla_hours: 4,
    status: "Menunggu Verifikasi",
    deadline: "Hari ini, 16:00",
  },
  {
    id: "REQ-2026-0818",
    pelanggan: "CV Polyplast Mandiri",
    layanan: "Sertifikasi Kompetensi Ekstrusi",
    jenis: "LSP BNSP",
    sla_hours: 8,
    status: "Verifikasi Berkas APL",
    deadline: "Hari ini, 18:00",
  },
  {
    id: "REQ-2026-0815",
    pelanggan: "Dinas Perindustrian Jateng",
    layanan: "Bimtek Formulasi Polimer Hijau",
    jenis: "Pelatihan",
    sla_hours: 24,
    status: "Menunggu Approval Invoice",
    deadline: "Besok, 12:00",
  },
]

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <Head title="Admin Workspace Dashboard" />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-200 border border-brand-400/30 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Workspace Operasional BBKKP</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Selamat Datang di Command Center Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Pantau antrean permohonan layanan, disposisi tim verifikator, validasi pengujian laboratorium, dan penagihan invoice PNBP dalam satu dasbor terpadu.
          </p>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Permohonan Masuk"
          value={48}
          subtitle="Total antrean bulan ini"
          icon={<ClipboardList className="w-5 h-5 text-brand-600" />}
          trend={{ value: "+14%", isPositive: true }}
        />
        <StatsCard
          title="Menunggu Verifikasi"
          value={12}
          subtitle="Perlu tindakan segera"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
        />
        <StatsCard
          title="Sedang Uji Lab / Asesmen"
          value={19}
          subtitle="Proses pengerjaan teknis"
          icon={<FlaskConical className="w-5 h-5 text-sky-600" />}
        />
        <StatsCard
          title="Siap Terbit Sertifikat TTE"
          value={8}
          subtitle="Menunggu sign BSrE"
          icon={<FileCheck2 className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Main Grid: Urgent SLA vs Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent SLA Table */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Antrean Mendesak (Batas Waktu SLA)</span>
                </CardTitle>
                <CardDescription>
                  Permohonan yang memerlukan review verifikasi sebelum tenggat waktu
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/permohonan")}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">No. Order & Pemohon</th>
                      <th className="py-3 px-4 font-semibold">Layanan</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Sisa Waktu</th>
                      <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {URGENT_PERMOHONAN.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-brand-700">{item.id}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                            {item.pelanggan}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-800">{item.layanan}</p>
                          <span className="text-[10px] text-slate-400 font-semibold">{item.jenis}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge variant="warning">{item.status}</Badge>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-rose-600">
                          {item.deadline} ({item.sla_hours} jam)
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => navigate(`/admin/permohonan/detail/${item.id}`)}
                          >
                            Proses
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Distribution Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="w-4 h-4 text-brand-600" />
                <span>Realisasi PNBP Bulan Ini</span>
              </CardTitle>
              <CardDescription>Penerimaan Negara Bukan Pajak BBKKP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">Rp 148.650.000</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Mencapai 82% dari target bulanan</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-600 to-sky-500 rounded-full w-[82%]" />
              </div>

              {/* Mini Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Pengujian Kulit & Karet:</span>
                  <span className="font-semibold text-slate-800">Rp 64.200.000</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Sertifikasi Profesi LSP:</span>
                  <span className="font-semibold text-slate-800">Rp 48.000.000</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Bimtek & Pelatihan:</span>
                  <span className="font-semibold text-slate-800">Rp 36.450.000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Action Card */}
          <Card className="bg-gradient-to-br from-brand-50 to-white border-brand-200">
            <CardContent className="p-5 space-y-3">
              <h4 className="text-xs font-bold text-brand-900 uppercase tracking-wider">
                Aksi Cepat Petugas
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-xs text-left justify-start"
                  onClick={() => navigate("/admin/permohonan")}
                >
                  Verifikasi Berkas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-xs text-left justify-start"
                  onClick={() => navigate("/admin/finance/invoice")}
                >
                  Buat Invoice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-xs text-left justify-start"
                  onClick={() => navigate("/admin/sertifikasi/hasil-uji")}
                >
                  Input Hasil Uji
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-xs text-left justify-start"
                  onClick={() => navigate("/admin/helpdesk/pertanyaan")}
                >
                  Balas Tiket
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ekosistem Aplikasi Terintegrasi BBKKP Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-700" />
              <span>Daftar Aplikasi Ekosistem BBKKP (9 Sistem SSO)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Sistem operasional, laboratorium, sertifikasi produk, arsip digital, dan analitik eksekutif
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/ekosistem-aplikasi")}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Lihat Katalog
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {defaultSsoApps.map((item) => {
              const isPelayanan = item.category === "Pelayanan";
              const isEksekutif = item.category === "Eksekutif";

              const badgeColor = isPelayanan
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : isEksekutif
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-indigo-50 text-indigo-700 border-indigo-200";

              const iconBg = isPelayanan
                ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white"
                : isEksekutif
                ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white"
                : "bg-gradient-to-br from-indigo-700 to-slate-800 text-white";

              return (
                <div
                  key={item.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                        {item.category}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 transition-colors" />
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl ${iconBg} shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        {renderSsoAppIcon(item.id, "w-5 h-5")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 truncate">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          SSO Integrated
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
                      {item.name_full}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-brand-600 text-slate-700 hover:text-white text-xs font-semibold border border-slate-200 hover:border-brand-600 transition-all shadow-2xs group/btn"
                    >
                      <span>Buka Sistem</span>
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AdminDashboardPage)
