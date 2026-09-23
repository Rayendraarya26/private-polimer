import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import {
  PackageCheck,
  CheckCircle2,
  MapPin,
  Sparkles,
  Phone,
  User,
  ShieldCheck,
  Calendar,
  Building2,
  Languages,
  FileText,
  Download,
  Target,
  Layers,
  Wallet,
} from "lucide-react"

interface InspeksiDetailSectionProps {
  permohonan: any
  formInspeksi: any
  formatIndoDate: (dateStr?: string | null, withTime?: boolean) => string
}

export const InspeksiDetailPermohonanTab: React.FC<InspeksiDetailSectionProps> = ({
  permohonan,
  formInspeksi,
  formatIndoDate,
}) => {
  const jenisInspeksi: string[] = Array.isArray(formInspeksi?.jenis_inspeksi)
    ? formInspeksi.jenis_inspeksi
    : []

  const totalBiaya = Number(permohonan?.total_harga || 0)

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header Banner Lembaga Inspeksi */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-sky-900 text-white shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-brand-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Lembaga Inspeksi BBSPJIKKP (Balai Besar Kulit, Karet dan Plastik)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {formInspeksi?.komoditas ? `Jasa Inspeksi ${formInspeksi.komoditas}` : "Jasa Inspeksi Kemasan Karung Plastik"}
            </h3>
            <p className="text-xs text-brand-100/90 max-w-2xl leading-relaxed">
              Pemeriksaan mutu kuantitas & kualitas kemasan pangan on-site sesuai standar teknis resmi
              BBSPJIKKP.
            </p>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-white/15 pt-3 sm:pt-0 sm:pl-5 shrink-0">
            <span className="text-[11px] text-brand-200 block font-medium">Status Penawaran:</span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {totalBiaya > 0 ? `Rp ${totalBiaya.toLocaleString("id-ID")}` : "Kajian Teknis"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Informasi Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Spesifikasi Objek Karung */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Spesifikasi Karung & Lingkup Inspeksi
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Jenis Inspeksi yang Diminta:</span>
              <div className="flex flex-wrap gap-1.5">
                {jenisInspeksi.map((jenis, idx) => (
                  <Badge
                    key={idx}
                    variant="neutral"
                    className="bg-brand-50 text-brand-700 border-brand-200 uppercase font-semibold text-[11px]"
                  >
                    Inspeksi {jenis}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block">Komoditas:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formInspeksi?.komoditas || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Kapasitas Karung:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formInspeksi?.kapasitas_karung || "-"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block">Jumlah Partai / Lot:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formInspeksi?.jumlah_partai_lot || 1} Partai
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Bahasa Laporan:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block capitalize">
                  Bahasa {formInspeksi?.bahasa_laporan || "indonesia"}
                </span>
              </div>
            </div>

            {formInspeksi?.spesifikasi_dimensi && (
              <div className="pt-1 border-t border-slate-100">
                <span className="text-slate-400 block">Rincian Dimensi / Karakteristik:</span>
                <p className="font-medium text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {formInspeksi.spesifikasi_dimensi}
                </p>
              </div>
            )}

            {formInspeksi?.tujuan_inspeksi && (
              <div className="pt-1 border-t border-slate-100">
                <span className="text-slate-400 block">Tujuan Inspeksi:</span>
                <p className="font-medium text-slate-700 mt-0.5 leading-relaxed">
                  {formInspeksi.tujuan_inspeksi}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Pelaksanaan Lapangan & Berkas */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Rencana Pelaksanaan Lapangan
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block">Rencana Tanggal Inspeksi:</span>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="font-semibold text-slate-800 text-sm">
                  {formatIndoDate(formInspeksi?.tgl_rencana_inspeksi)}
                </span>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-100">
              <span className="text-slate-400 block">Lokasi Gudang / Pabrik Inspeksi:</span>
              <div className="flex items-start gap-2 mt-1">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="font-medium text-slate-700 leading-relaxed">
                  {formInspeksi?.lokasi_inspeksi || "-"}
                </span>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-100">
              <span className="text-slate-400 block">Surat Pengantar Pemohon:</span>
              <div className="mt-1 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-800 block">
                    No: {formInspeksi?.no_surat_pemohon || "Tanpa Nomor"}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Tgl: {formatIndoDate(formInspeksi?.tgl_surat_pemohon)}
                  </span>
                </div>

                {formInspeksi?.file_surat_permohonan && (
                  <a
                    href={`/storage/${formInspeksi.file_surat_permohonan}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Lihat Surat</span>
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Pihak Terkait: Penerima & Penanggung Biaya */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hasil Dibuat Untuk */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Hasil Inspeksi Dibuat Untuk
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block">Nama Instansi / Lembaga:</span>
              <span className="font-bold text-slate-900 text-sm block mt-0.5 text-brand-700">
                {formInspeksi?.penerima_hasil_nama || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Alamat Instansi:</span>
              <span className="font-medium text-slate-700 block mt-0.5">
                {formInspeksi?.penerima_hasil_alamat || "-"}
              </span>
            </div>
            {formInspeksi?.penerima_hasil_email && (
              <div>
                <span className="text-slate-400 block">Email Instansi:</span>
                <span className="font-medium text-slate-700 block mt-0.5">
                  {formInspeksi.penerima_hasil_email}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Biaya Ditanggung Oleh */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Biaya Inspeksi Ditanggung Oleh
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block">Nama Perusahaan Penanggung Biaya:</span>
              <span className="font-bold text-slate-900 text-sm block mt-0.5">
                {formInspeksi?.biaya_nama || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Alamat Perusahaan:</span>
              <span className="font-medium text-slate-700 block mt-0.5">
                {formInspeksi?.biaya_alamat || "-"}
              </span>
            </div>
            {formInspeksi?.biaya_email && (
              <div>
                <span className="text-slate-400 block">Email Penanggung Biaya:</span>
                <span className="font-medium text-slate-700 block mt-0.5">
                  {formInspeksi.biaya_email}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const InspeksiDetailPelangganTab: React.FC<InspeksiDetailSectionProps> = ({
  permohonan,
  formInspeksi,
  formatIndoDate,
}) => {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-soft">
      <CardHeader className="border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-brand-600" />
          <CardTitle className="text-sm font-bold text-slate-800">
            Identitas Pemohon & Kontak PIC Inspeksi
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-slate-400 block">Nama Personel PIC:</span>
            <span className="font-bold text-slate-900 text-sm block mt-0.5">
              {formInspeksi?.pemohon_pic_nama || permohonan?.creator?.name || "-"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block">Nomor Kontak / WhatsApp PIC:</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-slate-800">
                {formInspeksi?.pemohon_pic_kontak || "-"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <span className="text-slate-400 block">Alamat Pemohon / PIC:</span>
          <div className="flex items-start gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="font-medium text-slate-700">
              {formInspeksi?.pemohon_pic_alamat || "-"}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <span className="text-slate-400 block">Waktu Pengajuan Formulir:</span>
          <span className="font-semibold text-slate-800">
            {formatIndoDate(formInspeksi?.created_at || permohonan?.tgl_order, true)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
