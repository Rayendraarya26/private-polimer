import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import {
  Building2,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  ShieldCheck,
  Download,
  ExternalLink,
  Layers,
  Wrench,
  Car,
} from 'lucide-react'
import { getFileUrl } from '../../utils/fileHelpers'

export interface AsetDetailSectionProps {
  permohonan: any
  formAset: any
  formatIndoDate?: (dateStr?: string | null, withTime?: boolean, shortMonth?: boolean) => string
}

const getAsetLabel = (jenis: string) => {
  switch (jenis) {
    case 'sewa_lapangan':
      return { label: 'Sewa Lapangan', icon: Layers, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
    case 'sewa_bangunan':
      return { label: 'Sewa Bangunan / Gedung', icon: Building2, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' }
    case 'sewa_alat':
      return { label: 'Sewa Alat Laboratorium', icon: Wrench, color: 'text-amber-700 bg-amber-50 border-amber-200' }
    case 'sewa_mobil':
      return { label: 'Sewa Kendaraan Operasional', icon: Car, color: 'text-sky-700 bg-sky-50 border-sky-200' }
    case 'sewa_ruangan':
      return { label: 'Sewa Ruangan / Aula Rapat', icon: Building2, color: 'text-violet-700 bg-violet-50 border-violet-200' }
    default:
      return { label: 'Pemanfaatan & Sewa Aset', icon: Building2, color: 'text-brand-700 bg-brand-50 border-brand-200' }
  }
}

export const AsetDetailSection: React.FC<AsetDetailSectionProps> = ({
  permohonan,
  formAset,
  formatIndoDate,
}) => {
  const asetData = formAset || permohonan?.form_aset || permohonan?.formAset?.[0] || {}
  const { label, icon: Icon, color } = getAsetLabel(asetData?.jenis_sewa || '')

  const fileSurat = asetData?.file_surat_permohonan
  const fileUrl = fileSurat ? getFileUrl(fileSurat) : null

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    if (formatIndoDate) return formatIndoDate(dateStr)
    return dateStr
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. KARTU RINCIAN PEMANFAATAN FASILITAS ASET */}
      <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <Building2 className="w-4 h-4 text-brand-600" />
            <span>Rincian Pemanfaatan & Sewa Aset Balai</span>
          </CardTitle>
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${color}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-4 text-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <span className="text-slate-400 block font-medium">Kategori Fasilitas:</span>
              <span className="font-bold text-slate-900 mt-0.5 block text-sm">{label}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Tanggal Mulai Sewa:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                {formatDate(asetData?.tanggal_mulai)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Tanggal Selesai Sewa:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                {formatDate(asetData?.tanggal_selesai)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Durasi Pemanfaatan:</span>
              <span className="font-bold text-brand-700 mt-0.5 block text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                {asetData?.durasi_hari || 1} Hari Kalender
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Status Pengajuan:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {permohonan?.status_workflow || 'PERMOHONAN'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Biaya Retribusi PNBP:</span>
              <span className="font-bold text-slate-900 mt-0.5 block text-sm">
                {permohonan?.total_harga
                  ? `Rp ${Number(permohonan.total_harga).toLocaleString('id-ID')}`
                  : 'Menunggu Penetapan Tarif'}
              </span>
            </div>
          </div>

          {/* Keperluan Penggunaan */}
          {asetData?.keperluan_penggunaan && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 mt-2">
              <span className="text-slate-500 font-bold block mb-1 text-[11px] uppercase tracking-wider">
                Keperluan Penggunaan / Maksud Pemanfaatan:
              </span>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {asetData.keperluan_penggunaan}
              </p>
            </div>
          )}

          {/* Catatan Tambahan */}
          {asetData?.catatan_tambahan && (
            <div className="p-3.5 bg-brand-50/40 rounded-xl border border-brand-200/60 mt-2">
              <span className="text-brand-900 font-bold block mb-1 text-[11px] uppercase tracking-wider">
                Catatan Tambahan / Fasilitas Khusus:
              </span>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {asetData.catatan_tambahan}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. KARTU DATA PEMOHON RESMI */}
      <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <User className="w-4 h-4 text-brand-600" />
            <span>Data Pemohon & Penanggung Jawab</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <span className="text-slate-400 block font-medium">Nama Pemohon:</span>
              <span className="font-bold text-slate-900 mt-0.5 block text-sm">
                {asetData?.pemohon_nama || permohonan?.user?.name || '-'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">NIK / NIB:</span>
              <span className="font-mono font-semibold text-slate-800 mt-0.5 block">
                {asetData?.pemohon_nik_nib || '-'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Kontak WhatsApp / Telepon:</span>
              <span className="font-semibold text-brand-700 mt-0.5 block flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {asetData?.pemohon_telepon || '-'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Alamat Email:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {asetData?.pemohon_email || permohonan?.user?.email || '-'}
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-slate-400 block font-medium">Alamat Domisili / Kantor:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{asetData?.pemohon_alamat || '-'}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. KARTU BERKAS & INTEGRITAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Berkas Surat Permohonan */}
        <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>Surat Resmi Permohonan Sewa</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-xs">
            {fileUrl ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">
                    Surat_Permohonan_Aset.pdf
                  </span>
                </div>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 shrink-0 px-2.5 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Berkas</span>
                </a>
              </div>
            ) : (
              <p className="text-slate-400 italic">Tidak ada berkas surat yang diunggah.</p>
            )}
          </CardContent>
        </Card>

        {/* Pernyataan & Waktu Konfirmasi */}
        <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Pernyataan Integritas & Ketentuan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Pernyataan Telah Disetujui Pemohon</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Pemohon menyatakan bersedia mematuhi tata tertib pemanfaatan aset serta ketentuan retribusi PNBP BBSPJIKKP.
            </p>
            {asetData?.pernyataan_at && (
              <p className="text-[11px] text-slate-400">
                Waktu persetujuan: {formatDate(asetData.pernyataan_at)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AsetDetailSection
