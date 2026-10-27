import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import {
  GraduationCap,
  Users,
  Building2,
  FileText,
  User,
  Phone,
  Mail,
  Eye,
  Download,
  CreditCard,
  Receipt,
  FileCheck2,
  BookOpen,
  X,
  Info,
  ShieldCheck,
} from "lucide-react"
import { getFileUrl } from "../../utils/fileHelpers"

export interface BimtekPeserta {
  id?: string
  nama_lengkap?: string
  nik_peserta?: string
  gender?: string
  tempat_lahir?: string
  tanggal_lahir?: string
  agama?: string
  pendidikan?: string
  whatsapp?: string
  email?: string
  alamat_peserta?: string
  pengalaman_kerja?: string
  ktp_peserta?: string
  foto_peserta?: string
}

export interface BimtekDetailData {
  id?: string
  nama_instansi?: string
  alamat_instansi?: string
  jenis_produk?: string
  program?: string
  masalah_materi?: string
  hal_dipelajari?: string
  setuju_syarat?: boolean
  peserta?: BimtekPeserta[]
  participants?: BimtekPeserta[]
  // Single-participant direct fields fallback:
  nama_lengkap?: string
  nik_peserta?: string
  gender?: string
  tempat_lahir?: string
  tanggal_lahir?: string
  agama?: string
  pendidikan?: string
  whatsapp?: string
  email?: string
  alamat_peserta?: string
  pengalaman_kerja?: string
  ktp_peserta?: string
  foto_peserta?: string
}

export interface BimtekDetailSectionProps {
  permohonan: any
  formPelatihan?: BimtekDetailData | any
  formatIndoDate?: (dateStr?: string | null, withTime?: boolean, shortMonth?: boolean) => string
  openInvoice?: (item: any) => void
  openKuitansi?: (item: any) => void
  openSuratPenawaran?: (item: any) => void
  openPdfDoc?: (url: string, title?: string, filename?: string) => void
}

export const BimtekDetailSection: React.FC<BimtekDetailSectionProps> = ({
  permohonan,
  formPelatihan,
  formatIndoDate,
  openInvoice,
  openKuitansi,
  openSuratPenawaran,
  openPdfDoc,
}) => {
  // Modal Preview Image State
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null)
  const [selectedPesertaIdx, setSelectedPesertaIdx] = useState<number>(0)

  // 1. Resolve Form Data & Group Participants
  const form: BimtekDetailData =
    formPelatihan ||
    (Array.isArray(permohonan?.form_pelatihan) && permohonan.form_pelatihan[0]) ||
    (Array.isArray(permohonan?.formPelatihan) && permohonan.formPelatihan[0]) ||
    permohonan?.formable ||
    {}

  // Collect participants list if multiple exist
  let pesertaList: BimtekPeserta[] = []
  if (Array.isArray(form?.peserta) && form.peserta.length > 0) {
    pesertaList = form.peserta
  } else if (Array.isArray(form?.participants) && form.participants.length > 0) {
    pesertaList = form.participants
  } else if (Array.isArray(permohonan?.form_pelatihan) && permohonan.form_pelatihan.length > 1) {
    pesertaList = permohonan.form_pelatihan
  } else if (Array.isArray(permohonan?.formPelatihan) && permohonan.formPelatihan.length > 1) {
    pesertaList = permohonan.formPelatihan
  } else if (form?.nama_lengkap || form?.nik_peserta) {
    pesertaList = [
      {
        id: form.id,
        nama_lengkap: form.nama_lengkap,
        nik_peserta: form.nik_peserta,
        gender: form.gender,
        tempat_lahir: form.tempat_lahir,
        tanggal_lahir: form.tanggal_lahir,
        agama: form.agama,
        pendidikan: form.pendidikan,
        whatsapp: form.whatsapp,
        email: form.email,
        alamat_peserta: form.alamat_peserta,
        pengalaman_kerja: form.pengalaman_kerja,
        ktp_peserta: form.ktp_peserta,
        foto_peserta: form.foto_peserta,
      },
    ]
  }

  const activePeserta = pesertaList[selectedPesertaIdx] || pesertaList[0] || {}

  const defaultFormatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-"
    if (formatIndoDate) return formatIndoDate(dateStr, false, true)
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const isSplit = Boolean(permohonan?.is_split_bill)
  const isLunas = permohonan?.status_bayar === "LUNAS"
  const totalBiaya = Number(
    permohonan?.total_harga ||
      permohonan?.harga_permohonan ||
      permohonan?.detail_pembayaran?.reduce?.((acc: number, d: any) => acc + Number(d.subtotal || 0), 0) ||
      0
  )

  const handlePreviewFile = (fileRelPath?: string | null, title?: string) => {
    if (!fileRelPath) return
    const url = getFileUrl(fileRelPath)
    if (!url) return

    const lower = fileRelPath.toLowerCase()
    if (lower.endsWith(".pdf") && openPdfDoc) {
      openPdfDoc(url, title || "Dokumen Peserta", fileRelPath.split("/").pop() || "dokumen.pdf")
    } else {
      setPreviewImage({ url, title: title || "Berkas Peserta" })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* ── 1. STATISTIC HIGHLIGHT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card: Fokus / Bidang Bimtek */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5 mb-1.5">
            <GraduationCap className="w-3.5 h-3.5" /> Fokus / Bidang
          </span>
          <h4 className="text-sm font-bold text-slate-900 truncate" title={form?.jenis_produk || "Bimbingan Teknis"}>
            {form?.jenis_produk || "Bimtek Industri"}
          </h4>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {form?.program ? `Program: ${form.program}` : "Pelatihan Teknis Balai"}
          </span>
        </div>

        {/* Card: Total Peserta */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 mb-1.5">
            <Users className="w-3.5 h-3.5" /> Total Peserta
          </span>
          <div className="flex items-baseline gap-2">
            <h4 className="text-xl font-bold text-slate-900">
              {pesertaList.length > 0 ? pesertaList.length : 1}
            </h4>
            <span className="text-xs text-slate-500 font-medium">Orang Peserta</span>
          </div>
          <span className="text-[11px] text-blue-600 font-medium mt-1 block">
            {isSplit ? "Tagihan Terpisah (Split Bill)" : "Tagihan Kolektif (Together)"}
          </span>
        </div>

        {/* Card: Instansi Pengusul */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5 mb-1.5">
            <Building2 className="w-3.5 h-3.5" /> Instansi / Usaha
          </span>
          <h4 className="text-sm font-bold text-slate-900 truncate" title={form?.nama_instansi || permohonan?.creator?.name || "-"}>
            {form?.nama_instansi || permohonan?.creator?.pelanggan?.detail?.nama_perusahaan || permohonan?.creator?.name || "-"}
          </h4>
          <span className="text-[11px] text-slate-500 mt-1 block truncate">
            {form?.alamat_instansi || "Alamat terverifikasi"}
          </span>
        </div>

        {/* Card: Status & Total Biaya */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 mb-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Biaya Layanan
          </span>
          <h4 className="text-base font-bold text-emerald-900">
            {totalBiaya > 0 ? `Rp ${totalBiaya.toLocaleString("id-ID")}` : "Menunggu Penawaran"}
          </h4>
          <div className="mt-1 flex items-center gap-1.5">
            <Badge
              variant={isLunas ? "success" : "neutral"}
              className="text-[10px] px-2 py-0.2"
            >
              {permohonan?.status_bayar || "BELUM LUNAS"}
            </Badge>
          </div>
        </div>
      </div>

      {/* ── 2. GRID UTAMA: IDENTITAS INSTANSI & KEBUTUHAN KURIKULUM ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Kolom Kiri (5/12): Profil Instansi & Data Permohonan */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="rounded-2xl border-slate-200 shadow-soft h-full">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-800">
                  Profil Usaha / Instansi Pengusul
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Nama Usaha / Instansi:</span>
                <span className="font-bold text-slate-900 mt-0.5 block text-sm">
                  {form?.nama_instansi || permohonan?.creator?.pelanggan?.detail?.nama_perusahaan || permohonan?.creator?.name || "-"}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block font-medium">Fokus / Bidang Usaha:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {form?.jenis_produk || "Bimbingan Teknis & Pelatihan Industri"}
                </span>
              </div>

              {form?.program && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block font-medium">Program Pelatihan:</span>
                  <span className="font-semibold text-brand-700 mt-0.5 block">
                    {form.program}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block font-medium">Alamat Usaha / Instansi:</span>
                <span className="font-medium text-slate-800 mt-0.5 block leading-relaxed">
                  {form?.alamat_instansi || permohonan?.creator?.pelanggan?.detail?.alamat || "-"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Tanggal Registrasi:</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {defaultFormatDate(permohonan?.tgl_order || permohonan?.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Persetujuan Syarat:</span>
                  <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-emerald-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Disetujui
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan (7/12): Kebutuhan Kurikulum & Pembahasan */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="rounded-2xl border-slate-200 shadow-soft h-full flex flex-col">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-800">
                  Kebutuhan Kurikulum & Topik Bimbingan Teknis
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 flex-1 text-xs">
              {/* Masalah Materi */}
              <div>
                <span className="text-slate-500 font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5 mb-1.5">
                  Kendala / Permasalahan yang Dihadapi:
                </span>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap pl-5 font-normal">
                  {form?.masalah_materi || "Tidak ada rincian kendala khusus yang dicantumkan."}
                </p>
              </div>

              {/* Hal yang Ingin Dipelajari */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-slate-500 font-bold uppercase text-[11px] tracking-wider flex items-center gap-1.5 mb-1.5">
                  Materi Khusus / Kompetensi yang Ingin Dikuasai:
                </span>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap pl-5 font-normal">
                  {form?.hal_dipelajari || "Mempelajari materi standar bimbingan teknis sesuai kurikulum balai."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5 pl-1">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Materi akan diselaraskan oleh instruktur balai sesuai dengan kebutuhan dan kapabilitas peserta bimbingan teknis.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── 3. DATA PESERTA BIMBINGAN TEKNIS (MULTI-PESERTA SUPPORT) ── */}
      <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Daftar Peserta Bimbingan Teknis ({pesertaList.length} Peserta Terdaftar)
            </CardTitle>
          </div>

          {/* Tab Selector if Multi Participants */}
          {pesertaList.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {pesertaList.map((p, idx) => (
                <button
                  key={p.id || idx}
                  type="button"
                  onClick={() => setSelectedPesertaIdx(idx)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedPesertaIdx === idx
                      ? "bg-brand-600 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  Peserta {idx + 1}: {p.nama_lengkap?.split(" ")[0] || `P#${idx + 1}`}
                </button>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-5">
          {/* Active Participant Details */}
          <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-brand-100/70 border border-brand-200 flex items-center justify-center text-brand-800 font-bold text-base shrink-0 overflow-hidden">
                  {activePeserta.foto_peserta ? (
                    <img
                      src={getFileUrl(activePeserta.foto_peserta)}
                      alt={activePeserta.nama_lengkap || "Peserta"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLElement).style.display = "none"
                      }}
                    />
                  ) : (
                    <User className="w-6 h-6 text-brand-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {activePeserta.nama_lengkap || permohonan?.creator?.name || "Nama Peserta Belum Diisi"}
                    </h3>
                    <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 font-semibold">
                      {activePeserta.gender || "Laki-laki / Perempuan"}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                    NIK: {activePeserta.nik_peserta || "-"}
                  </span>
                </div>
              </div>

              {/* Berkas Pendukung Peserta (KTP & Foto) */}
              <div className="flex items-center gap-2">
                {activePeserta.ktp_peserta && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold gap-1.5 border-slate-200 hover:border-brand-500"
                    onClick={() => handlePreviewFile(activePeserta.ktp_peserta, `KTP - ${activePeserta.nama_lengkap}`)}
                  >
                    <Eye className="w-3.5 h-3.5 text-brand-600" /> KTP Peserta
                  </Button>
                )}
                {activePeserta.foto_peserta && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold gap-1.5 border-slate-200 hover:border-brand-500"
                    onClick={() => handlePreviewFile(activePeserta.foto_peserta, `Foto 3x4 - ${activePeserta.nama_lengkap}`)}
                  >
                    <Eye className="w-3.5 h-3.5 text-brand-600" /> Pas Foto 3x4
                  </Button>
                )}
              </div>
            </div>

            {/* Grid Detail Peserta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Tempat, Tanggal Lahir:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {activePeserta.tempat_lahir || "-"},{" "}
                  {activePeserta.tanggal_lahir ? defaultFormatDate(activePeserta.tanggal_lahir) : "-"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Agama:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {activePeserta.agama || "-"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Pendidikan Terakhir:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {activePeserta.pendidikan || "-"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Kontak WhatsApp:</span>
                <span className="font-semibold text-brand-700 mt-0.5 inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {activePeserta.whatsapp || permohonan?.creator?.phone || "-"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Email Peserta:</span>
                <span className="font-semibold text-slate-800 mt-0.5 inline-flex items-center gap-1 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {activePeserta.email || permohonan?.creator?.email || "-"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Pengalaman Kerja Terkait:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {activePeserta.pengalaman_kerja || "-"}
                </span>
              </div>

              <div className="sm:col-span-2 md:col-span-3 pt-2 border-t border-slate-100">
                <span className="text-slate-400 block font-medium">Alamat Domisili Peserta:</span>
                <span className="font-medium text-slate-800 mt-0.5 block leading-relaxed">
                  {activePeserta.alamat_peserta || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Tabel Ringkasan Peserta jika > 1 */}
          {pesertaList.length > 1 && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <span className="font-bold text-xs text-slate-700 block mb-2.5">
                Daftar Ringkas Seluruh Peserta:
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3.5 text-center w-12">No</th>
                      <th className="py-2.5 px-3.5">Nama Lengkap</th>
                      <th className="py-2.5 px-3.5">NIK</th>
                      <th className="py-2.5 px-3.5">Pendidikan</th>
                      <th className="py-2.5 px-3.5">WhatsApp</th>
                      <th className="py-2.5 px-3.5 text-center">Berkas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pesertaList.map((p, idx) => (
                      <tr
                        key={p.id || idx}
                        className={`hover:bg-slate-50 cursor-pointer ${
                          selectedPesertaIdx === idx ? "bg-brand-50/40 font-medium" : ""
                        }`}
                        onClick={() => setSelectedPesertaIdx(idx)}
                      >
                        <td className="py-2.5 px-3.5 text-center text-slate-400">{idx + 1}</td>
                        <td className="py-2.5 px-3.5 font-bold text-slate-800">{p.nama_lengkap || "-"}</td>
                        <td className="py-2.5 px-3.5 font-mono text-slate-600">{p.nik_peserta || "-"}</td>
                        <td className="py-2.5 px-3.5 text-slate-700">{p.pendidikan || "-"}</td>
                        <td className="py-2.5 px-3.5 text-brand-700 font-medium">{p.whatsapp || "-"}</td>
                        <td className="py-2.5 px-3.5 text-center">
                          <span className="text-[11px] text-slate-500">
                            {[p.ktp_peserta ? "KTP" : null, p.foto_peserta ? "Foto" : null]
                              .filter(Boolean)
                              .join(" & ") || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── 4. AKSI ADMINISTRASI & PENAWARAN BIAYA ── */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-brand-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Dokumen Pembayaran & Administrasi Bimbingan Teknis
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="font-bold text-slate-800 block text-xs">
                Dokumen Tagihan (Invoice / Kuitansi / Surat Penawaran)
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Akses surat penawaran biaya resmi dan dokumen perpajakan/kuitansi digital BBKKP.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {openSuratPenawaran && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => openSuratPenawaran(permohonan)}
                >
                  <FileText className="w-3.5 h-3.5 text-brand-600" /> Surat Penawaran
                </Button>
              )}

              {openInvoice && permohonan?.pdf_tte && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => openInvoice(permohonan)}
                >
                  <Receipt className="w-3.5 h-3.5 text-blue-600" /> Invoice
                </Button>
              )}

              {openKuitansi && isLunas && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  onClick={() => openKuitansi(permohonan)}
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" /> Kuitansi Lunas
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── IMAGE PREVIEW MODAL ── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-4 shadow-xl border border-slate-200 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-800">{previewImage.title}</span>
              <button
                type="button"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                onClick={() => setPreviewImage(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center max-h-[70vh] overflow-hidden rounded-xl bg-slate-50 p-2">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[65vh] max-w-full object-contain rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <a
                href={previewImage.url}
                target="_blank"
                rel="noreferrer"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Dokumen
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Backward-compatible exports
export const BimtekDetailPermohonanTab = BimtekDetailSection
export const PelatihanDetailSection = BimtekDetailSection
export default BimtekDetailSection
