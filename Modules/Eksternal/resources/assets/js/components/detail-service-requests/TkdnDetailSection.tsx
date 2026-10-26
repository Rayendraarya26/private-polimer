import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import {
  Building2,
  Calendar,
  CreditCard,
  FileText,
  MapPin,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Briefcase,
  Layers,
} from 'lucide-react'
import { formatIndoDate as defaultFormatIndoDate } from '../../utils/formatIndoDate'

export interface TkdnDetailSectionProps {
  permohonan: any
  formTkdn?: any
  formatIndoDate?: (dateStr?: string | null, withTime?: boolean, shortMonth?: boolean) => string
}

export const TkdnDetailSection: React.FC<TkdnDetailSectionProps> = ({
  permohonan,
  formTkdn,
  formatIndoDate = defaultFormatIndoDate,
}) => {
  const tkdnData =
    formTkdn ||
    permohonan?.form_tkdn?.[0] ||
    permohonan?.formTkdn?.[0] ||
    permohonan?.form_tkdn ||
    permohonan?.formTkdn ||
    permohonan?.form_data ||
    permohonan?.detailPermohonan?.[0]?.formable ||
    {}

  const noOrder = permohonan?.no_permohonan || permohonan?.kode_order || '-'
  const namaPerusahaan = tkdnData?.nama_perusahaan || permohonan?.creator?.name || '-'
  const alamat = tkdnData?.alamat || '-'
  const wilayah =
    [tkdnData?.kabupaten_nama, tkdnData?.provinsi_nama].filter(Boolean).join(', ') || '-'
  const uraianPekerjaan = tkdnData?.uraian_pekerjaan || '-'
  const biaya = Number(tkdnData?.biaya || permohonan?.harga_permohonan || 0)
  const tanggalBayar = tkdnData?.tanggal_bayar || permohonan?.tgl_order || null
  const pencatat = tkdnData?.pencatat || permohonan?.creator || null
  const namaPencatat = pencatat?.name || 'Bendahara Balai'
  const emailPencatat = pencatat?.email || '-'
  const tglPencatatan = tkdnData?.created_at || permohonan?.created_at || null

  const formatCurrency = (val: number) => {
    return `Rp ${val.toLocaleString('id-ID')}`
  }

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    try {
      return formatIndoDate(dateStr)
    } catch {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* ── HEADER BANNER (SERAGAM DENGAN LAYANAN LAINNYA) ── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-indigo-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Verifikasi Tingkat Komponen Dalam Negeri (TKDN)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {namaPerusahaan}
            </h2>
            <p className="text-xs text-indigo-100/90 max-w-2xl leading-relaxed">
              Pencatatan resmi penerimaan negara bukan pajak (PNBP) untuk verifikasi penilaian capaian Tingkat Komponen Dalam Negeri (TKDN).
            </p>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-white/15 pt-3 sm:pt-0 sm:pl-5 shrink-0">
            <span className="text-[11px] text-indigo-200 block font-medium">Nilai PNBP TKDN:</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-monospace tracking-tight">
              {formatCurrency(biaya)}
            </span>
            <span className="text-[10px] text-indigo-200/80 mt-0.5">Status: LUNAS & SELESAI</span>
          </div>
        </div>
      </div>

      {/* ── STATS HIGHLIGHT ROW (SERAGAM DENGAN GRK & KALIBRASI) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium uppercase tracking-wider">Nilai Transaksi</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-emerald-700 font-monospace">
            {formatCurrency(biaya)}
          </p>
          <span className="text-[10px] text-slate-400 block">Tarif Penerimaan PNBP</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium uppercase tracking-wider">Tanggal Pembayaran</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm font-bold text-slate-800 mt-0.5">
            {formatDate(tanggalBayar)}
          </p>
          <span className="text-[10px] text-slate-400 block">Dikonfirmasi Lunas</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium uppercase tracking-wider">Status Pencatatan</span>
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
          </div>
          <div className="pt-0.5">
            <Badge variant="success" className="text-xs px-2 py-0.5 font-semibold">
              LUNAS / SELESAI
            </Badge>
          </div>
          <span className="text-[10px] text-slate-400 block">Selesai diverifikasi</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium uppercase tracking-wider">Petugas Pencatat</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-sm font-bold text-slate-800 truncate" title={namaPencatat}>
            {namaPencatat}
          </p>
          <span className="text-[10px] text-slate-400 block truncate" title={emailPencatat}>
            {emailPencatat}
          </span>
        </div>
      </div>

      {/* ── GRID RINCIAN INFORMASI ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Kiri: Identitas Perusahaan Pemohon */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>Identitas Perusahaan Pemohon</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nama Perusahaan</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {namaPerusahaan}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Wilayah Administratif</span>
              <span className="font-semibold text-slate-800 mt-0.5 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                {wilayah}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Alamat Lengkap Perusahaan</span>
              <p className="font-medium text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                {alamat}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block font-medium">Nomor Registrasi</span>
                <span className="font-bold font-monospace text-slate-800 mt-0.5 block">
                  {noOrder}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Jenis Layanan</span>
                <span className="font-bold text-brand-700 mt-0.5 block">
                  Penerimaan PNBP TKDN
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kanan: Detail Pembayaran & Informasi Pencatatan */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Informasi Verifikasi & Finansial</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Total Biaya Penerimaan</span>
              <span className="font-extrabold text-emerald-700 text-base font-monospace mt-0.5 block">
                {formatCurrency(biaya)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Tanggal Diterima / Bayar</span>
              <span className="font-semibold text-slate-800 mt-0.5 block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                {formatDate(tanggalBayar)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Dicatat Oleh (Operator/Bendahara)</span>
              <div className="mt-0.5 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block text-xs">{namaPencatat}</span>
                  {emailPencatat !== '-' && (
                    <span className="text-[11px] text-slate-500 block">{emailPencatat}</span>
                  )}
                </div>
              </div>
            </div>

            {tglPencatatan && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block font-medium">Waktu Transaksi Dicatat</span>
                <span className="font-medium text-slate-700 mt-0.5 block">
                  {formatDate(tglPencatatan)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── CARD FULL WIDTH: RINCIAN PEKERJAAN VERIFIKASI TKDN ── */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-600" />
            <span>Rincian Uraian Pekerjaan Verifikasi TKDN</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 text-xs space-y-3">
          <div>
            <span className="text-slate-400 block font-medium mb-1.5">Deskripsi / Uraian Pekerjaan:</span>
            <div
              className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-sans text-xs sm:text-sm whitespace-pre-wrap selection:bg-brand-100"
            >
              {uraianPekerjaan}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              Transaksi TKDN ini diinputkan langsung oleh petugas admin/bendahara dan telah disinkronkan dengan status lunas.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TkdnDetailSection
