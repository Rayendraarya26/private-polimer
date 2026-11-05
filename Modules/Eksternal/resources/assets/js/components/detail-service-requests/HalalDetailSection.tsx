import React, { useState } from "react"
import Swal from "sweetalert2"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import {
  Award,
  Building2,
  User,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Store,
  Boxes,
  Package,
  Layers,
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Eye,
  X,
  CreditCard,
  Receipt,
  ShieldCheck,
} from "lucide-react"
import { getFileUrl } from "../../utils/fileHelpers"
import { formatIndoDate as defaultFormatIndoDate } from "../../utils/formatIndoDate"

export interface HalalDetailSectionProps {
  permohonan: any
  formHalal?: any
  formatIndoDate?: (dateStr?: string | null, withTime?: boolean, shortMonth?: boolean) => string
  openInvoice?: (item: any) => void
  openKuitansi?: (item: any) => void
  openSuratPenawaran?: (item: any) => void
  openPdfDoc?: (url: string, title?: string, filename?: string) => void
}

export const HalalDetailSection: React.FC<HalalDetailSectionProps> = ({
  permohonan,
  formHalal,
  formatIndoDate = defaultFormatIndoDate,
  openInvoice,
  openKuitansi,
  openSuratPenawaran,
  openPdfDoc,
}) => {
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null)

  // 1. Resolve Data Halal
  const data =
    formHalal ||
    permohonan?.form_halal?.[0] ||
    permohonan?.formHalal?.[0] ||
    permohonan?.form_halal ||
    permohonan?.formHalal ||
    permohonan?.form_data ||
    permohonan?.detailPermohonan?.[0]?.formable ||
    {}

  const noOrder = permohonan?.no_permohonan || permohonan?.kode_order || "-"
  const isReguler = (data?.jalur_pendaftaran || "reguler") === "reguler"

  const pabrikList: any[] = Array.isArray(data?.pabrik_json)
    ? data.pabrik_json
    : typeof data?.pabrik_json === "string"
      ? JSON.parse(data.pabrik_json || "[]")
      : []

  const outletList: any[] = Array.isArray(data?.outlet_json)
    ? data.outlet_json
    : typeof data?.outlet_json === "string"
      ? JSON.parse(data.outlet_json || "[]")
      : []

  const bahanList: any[] = Array.isArray(data?.bahan_json)
    ? data.bahan_json
    : typeof data?.bahan_json === "string"
      ? JSON.parse(data.bahan_json || "[]")
      : []

  const produkList: any[] = Array.isArray(data?.produk_json)
    ? data.produk_json
    : typeof data?.produk_json === "string"
      ? JSON.parse(data.produk_json || "[]")
      : []

  const totalBiaya = Number(permohonan?.total_harga || permohonan?.harga_permohonan || 0)
  const isLunas = permohonan?.status_bayar === "LUNAS"
  const hasPenawaran = Boolean(
    permohonan?.file_surat_penawaran ||
    (permohonan?.catatan_admin && (
      permohonan.catatan_admin.endsWith(".pdf") ||
      permohonan.catatan_admin.includes("penawaran/") ||
      permohonan.catatan_admin.includes("surat_penawaran/")
    ))
  )

  const formatDate = (dateStr?: string | null, withTime = false) => {
    if (!dateStr) return "-"
    try {
      return formatIndoDate(dateStr, withTime)
    } catch {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    }
  }

  const handlePreviewFile = (fileRelPath?: string | null, title?: string) => {
    if (!fileRelPath) return
    const url = getFileUrl(fileRelPath)
    if (!url) return

    const lower = fileRelPath.toLowerCase()
    if (lower.endsWith(".pdf") && openPdfDoc) {
      openPdfDoc(url, title || "Dokumen Halal", fileRelPath.split("/").pop() || "dokumen.pdf")
    } else if (
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".png") ||
      lower.endsWith(".webp")
    ) {
      setPreviewImage({ url, title: title || "Preview Dokumen" })
    } else {
      window.open(url, "_blank")
    }
  }

  // Berkas penyelia halal
  const berkasPenyelia = [
    {
      id: "file_sk_penyelia",
      nama: "SK Penetapan Penyelia Halal",
      filePath: data?.file_sk_penyelia,
    },
    {
      id: "file_ktp_penyelia",
      nama: "KTP Penyelia Halal",
      filePath: data?.file_ktp_penyelia,
    },
    {
      id: "file_sertifikat_penyelia",
      nama: "Sertifikat Pelatihan Penyelia",
      filePath: data?.file_sertifikat_penyelia,
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* ── BARIS 1: INFORMASI USAHA & PENANGGUNG JAWAB (Sesuai Struktur Admin) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Kiri: Informasi Pelaku Usaha & Pengajuan */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Informasi Pelaku Usaha & Pengajuan
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Jalur Pendaftaran</span>
              <span className="sm:col-span-2 font-bold text-brand-700">
                {isReguler ? "Reguler (LPH BBSPJIKKP)" : "Self Declare (SEHATI UMK)"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Jenis Pendaftaran</span>
              <span className="sm:col-span-2 font-semibold text-slate-800 capitalize">
                {data?.jenis_pendaftaran || "Baru"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Nama Pelaku Usaha</span>
              <span className="sm:col-span-2 font-bold text-slate-900 text-sm">
                {data?.nama_usaha || permohonan?.creator?.pelanggan?.detail?.nama_perusahaan || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">NIB</span>
              <span className="sm:col-span-2 font-mono font-semibold text-slate-800">
                {data?.nib || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">NPWP Perusahaan</span>
              <span className="sm:col-span-2 font-mono font-semibold text-slate-800">
                {data?.npwp || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Skala Usaha</span>
              <span className="sm:col-span-2 font-semibold text-slate-800 capitalize">
                {data?.skala_usaha || "Mikro"}
              </span>
            </div>

            {data?.kode_fasilitasi && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Kode Fasilitasi</span>
                <span className="sm:col-span-2 font-mono font-bold text-brand-700">
                  {data.kode_fasilitasi}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Nomor Permohonan</span>
              <span className="sm:col-span-2 font-mono font-bold text-slate-900">
                {noOrder}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5">
              <span className="text-slate-500 font-medium">Tanggal Pengajuan</span>
              <span className="sm:col-span-2 font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(permohonan?.created_at || permohonan?.tgl_order, true)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Kanan: Penanggung Jawab Usaha */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Penanggung Jawab Usaha
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Nama Penanggung Jawab</span>
              <span className="sm:col-span-2 font-bold text-slate-900 text-sm">
                {data?.pj_nama || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Kontak / WhatsApp</span>
              <span className="sm:col-span-2 font-semibold text-brand-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                {data?.pj_kontak || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Email PJ</span>
              <span className="sm:col-span-2 font-semibold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {data?.pj_email || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5">
              <span className="text-slate-500 font-medium">Alamat Usaha</span>
              <span className="sm:col-span-2 font-medium text-slate-800 leading-relaxed">
                {data?.pj_alamat || "-"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── BARIS 2: PENYELIA HALAL & DOKUMEN BERKAS (Sesuai Struktur Admin) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Kiri: Data Penyelia Halal */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Data Penyelia Halal
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Nama Penyelia</span>
              <span className="sm:col-span-2 font-bold text-slate-900 text-sm">
                {data?.penyelia_nama || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">NIK / No. KTP</span>
              <span className="sm:col-span-2 font-mono font-semibold text-slate-800">
                {data?.penyelia_nik || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Agama</span>
              <span className="sm:col-span-2 font-semibold text-slate-800">
                {data?.penyelia_agama || "Islam"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Kontak / WA Penyelia</span>
              <span className="sm:col-span-2 font-semibold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {data?.penyelia_kontak || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Nomor SK Penetapan</span>
              <span className="sm:col-span-2 font-mono font-semibold text-slate-800">
                {data?.penyelia_no_sk || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Tanggal SK Penetapan</span>
              <span className="sm:col-span-2 font-semibold text-slate-800">
                {formatDate(data?.penyelia_tgl_sk)}
              </span>
            </div>

            {data?.penyelia_no_sertifikat && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">No. Sertifikat Pelatihan</span>
                <span className="sm:col-span-2 font-mono font-semibold text-slate-800">
                  {data.penyelia_no_sertifikat}
                </span>
              </div>
            )}

            {data?.penyelia_tgl_sertifikat && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5">
                <span className="text-slate-500 font-medium">Tgl. Sertifikat Pelatihan</span>
                <span className="sm:col-span-2 font-semibold text-slate-800">
                  {formatDate(data.penyelia_tgl_sertifikat)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Kanan: Dokumen Berkas Penyelia */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Dokumen Berkas Penyelia
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            {berkasPenyelia.map((b) => {
              const hasFile = Boolean(b.filePath)
              return (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{b.nama}</span>
                    {hasFile ? (
                      <span className="text-[11px] font-mono text-slate-500 block truncate max-w-xs mt-0.5">
                        {b.filePath?.split("/").pop()}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic block mt-0.5">
                        Tidak dilampirkan
                      </span>
                    )}
                  </div>

                  {hasFile && (
                    <div className="shrink-0 flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2.5 text-xs text-brand-700 border-brand-200 hover:bg-brand-50"
                        leftIcon={<Eye className="w-3 h-3" />}
                        onClick={() => handlePreviewFile(b.filePath, b.nama)}
                      >
                        Lihat
                      </Button>
                      <a
                        href={getFileUrl(b.filePath!)}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 h-7 px-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Unduh File"
                      >
                        <Download className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* ── BARIS 3: FASILITAS PRODUKSI & OUTLET PENJUALAN (Sesuai Struktur Admin) ── */}
      <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Fasilitas Produksi & Denah Lokasi
            </CardTitle>
          </div>
          {data?.file_denah_lokasi && (
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2.5 text-xs text-brand-700 border-brand-200 hover:bg-brand-50"
                leftIcon={<Eye className="w-3 h-3" />}
                onClick={() => handlePreviewFile(data.file_denah_lokasi, "Denah Lokasi Pabrik")}
              >
                Lihat Denah
              </Button>
              <a
                href={getFileUrl(data.file_denah_lokasi)}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 h-7 px-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Unduh Denah"
              >
                <Download className="w-3 h-3" />
              </a>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4 w-72">Nama Fasilitas Pabrik</th>
                  <th className="py-3 px-4 w-44">Status Kepemilikan</th>
                  <th className="py-3 px-4">Alamat Lokasi Produksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pabrikList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400 italic">
                      Tidak ada data fasilitas pabrik
                    </td>
                  </tr>
                ) : (
                  pabrikList.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {p.nama || `Fasilitas #${idx + 1}`}
                      </td>
                      <td className="py-3 px-4">
                        {p.status_pabrik || "Milik Sendiri"}
                      </td>
                      <td className="py-3 px-4 text-slate-700 leading-relaxed">
                        {p.alamat || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Outlet Penjualan jika ada */}
          {outletList.length > 0 && (
            <div className="p-5 pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-brand-600" />
                <span>Daftar Outlet / Tempat Penjualan ({outletList.length})</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4 w-12 text-center">No</th>
                      <th className="py-2.5 px-4 w-72">Nama Outlet</th>
                      <th className="py-2.5 px-4">Alamat Outlet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {outletList.map((out, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{out.nama || "-"}</td>
                        <td className="py-2.5 px-4 text-slate-700">{out.alamat || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── BARIS 4: DAFTAR BAHAN & KEMASAN (Sesuai Struktur Admin) ── */}
      <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-brand-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Daftar Bahan & Kemasan ({bahanList.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4 w-36">Kategori</th>
                  <th className="py-3 px-4 w-56">Nama Bahan</th>
                  <th className="py-3 px-4 w-60">Produsen / Supplier</th>
                  <th className="py-3 px-4">Status Sertifikat Halal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bahanList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-400 italic">
                      Tidak ada data bahan
                    </td>
                  </tr>
                ) : (
                  bahanList.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {b.jenis_bahan || "Bahan Baku"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{b.nama_bahan || "-"}</td>
                      <td className="py-3 px-4 text-slate-700">
                        <div>{b.produsen || "-"}</div>
                        {b.supplier && (
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Pemasok: {b.supplier}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {b.is_bersertifikat ? (
                          <div>
                            <span className="text-emerald-700 font-bold font-mono text-[11px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Bersertifikat: {b.no_sertifikat || "-"}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {b.lembaga_penerbit || "BPJPH"}
                              {b.tgl_berlaku && ` (s/d ${formatDate(b.tgl_berlaku)})`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            Tidak Bersertifikat (Bahan Alami)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── BARIS 5: DAFTAR PRODUK YANG DIAJUKAN (Sesuai Struktur Admin) ── */}
      <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Daftar Produk yang Diajukan ({produkList.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4 w-40">Klasifikasi</th>
                  <th className="py-3 px-4 w-44">Merk Dagang</th>
                  <th className="py-3 px-4 w-60">Nama Produk & Varian</th>
                  <th className="py-3 px-4">Rincian / Komposisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produkList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-400 italic">
                      Tidak ada data produk
                    </td>
                  </tr>
                ) : (
                  produkList.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4 text-slate-700">{prod.klasifikasi || "Makanan"}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{prod.merk || "-"}</td>
                      <td className="py-3 px-4 font-semibold text-brand-700">{prod.nama_produk || "-"}</td>
                      <td className="py-3 px-4 text-slate-600 leading-relaxed text-[11px]">
                        {prod.rincian || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── BARIS 6: ALUR PROSES PRODUKSI & DOKUMEN PERSYARATAN (Sesuai Struktur Admin) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Kiri: Alur Proses Produksi Halal (PPH) */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Alur Proses Produksi Halal (PPH)
              </CardTitle>
            </div>
            {data?.file_alur_proses && (
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-xs text-brand-700 border-brand-200 hover:bg-brand-50"
                  leftIcon={<Eye className="w-3 h-3" />}
                  onClick={() => handlePreviewFile(data.file_alur_proses, "Bagan Alur PPH")}
                >
                  Lihat Bagan
                </Button>
                <a
                  href={getFileUrl(data.file_alur_proses)}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 h-7 px-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Unduh Bagan"
                >
                  <Download className="w-3 h-3" />
                </a>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {data?.alur_proses || "Belum ada uraian narasi alur proses produksi halal."}
          </CardContent>
        </Card>

        {/* Kanan: Dokumen Persyaratan & Komitmen SJPH */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Dokumen Persyaratan & Pernyataan
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            {/* Surat Permohonan */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-800 block">Surat Permohonan</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Surat permohonan sertifikasi resmi
                </span>
              </div>
              {data?.file_surat_permohonan ? (
                <div className="shrink-0 flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2.5 text-xs text-brand-700 border-brand-200 hover:bg-brand-50"
                    leftIcon={<Eye className="w-3 h-3" />}
                    onClick={() => handlePreviewFile(data.file_surat_permohonan, "Surat Permohonan Halal")}
                  >
                    Lihat
                  </Button>
                  <a
                    href={getFileUrl(data.file_surat_permohonan)}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 h-7 px-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Unduh Surat"
                  >
                    <Download className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <span className="text-slate-400 italic text-[11px]">-</span>
              )}
            </div>

            {/* Manual SJPH */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-800 block">Manual SJPH</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Dokumen manual sistem jaminan produk halal
                </span>
              </div>
              {data?.file_manual_sjph ? (
                <div className="shrink-0 flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2.5 text-xs text-brand-700 border-brand-200 hover:bg-brand-50"
                    leftIcon={<Eye className="w-3 h-3" />}
                    onClick={() => handlePreviewFile(data.file_manual_sjph, "Manual SJPH")}
                  >
                    Lihat
                  </Button>
                  <a
                    href={getFileUrl(data.file_manual_sjph)}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 h-7 px-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Unduh Manual"
                  >
                    <Download className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <span className="text-slate-400 italic text-[11px]">-</span>
              )}
            </div>

            {/* Pernyataan Bebas Babi */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <span className="font-medium text-slate-700">Pernyataan Bebas Babi</span>
              {data?.pernyataan_bebas_babi ? (
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Disetujui
                </span>
              ) : (
                <span className="text-slate-400 font-medium">Belum Disetujui</span>
              )}
            </div>

            {/* Komitmen SJPH */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <span className="font-medium text-slate-700">Komitmen SJPH</span>
              {data?.pernyataan_komitmen_sjph ? (
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Berkomitmen
                </span>
              ) : (
                <span className="text-slate-400 font-medium">Belum Berkomitmen</span>
              )}
            </div>

            {data?.pernyataan_at && (
              <div className="pt-2 text-[11px] text-slate-400 text-right">
                Waktu Pernyataan: {formatDate(data.pernyataan_at, true)} WIB
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── CARD STATUS PEMBAYARAN & DOKUMEN TRANSAKSI (Sesuai Style Permohonan Lain) ── */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Status Pembiayaan & Dokumen Transaksi
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-slate-400 block font-medium">Status Pembiayaan:</span>
              <span className="mt-1 inline-block">
                <Badge
                  variant={isLunas || !isReguler ? "success" : "neutral"}
                  className="text-xs px-2.5 py-0.5 font-bold"
                >
                  {!isReguler
                    ? "GRATIS (FASILITASI SEHATI)"
                    : permohonan?.status_bayar || "MENUNGGU PEMBAYARAN"}
                </Badge>
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Nomor Invoice:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block font-mono">
                {permohonan?.invoice_number || permohonan?.tagihan?.nomor_invoice || (!isReguler ? "Fasilitasi SEHATI" : "Belum Diterbitkan")}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Nomor Virtual Account:</span>
              <span className="font-bold text-brand-700 mt-0.5 block font-mono text-sm">
                {permohonan?.va || permohonan?.tagihan?.va || (!isReguler ? "-" : "Belum Terbit")}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Total Tarif / Biaya:</span>
              <span className="font-bold text-slate-900 mt-0.5 block text-sm">
                {!isReguler
                  ? "Rp 0 (Fasilitasi SEHATI UMK)"
                  : totalBiaya > 0
                    ? `Rp ${totalBiaya.toLocaleString("id-ID")}`
                    : "Kajian Biaya LPH"}
              </span>
            </div>
          </div>

          {/* Tombol Dokumen Finansial (Hanya muncul jika file tersedia) */}
          {isReguler && (
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
              {hasPenawaran && openSuratPenawaran && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
                  leftIcon={<FileText className="w-3.5 h-3.5 text-indigo-600" />}
                  onClick={() => openSuratPenawaran(permohonan)}
                >
                  Surat Penawaran Biaya
                </Button>
              )}

              {permohonan?.pdf_tte && openInvoice && (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Receipt className="w-3.5 h-3.5" />}
                  onClick={() => openInvoice(permohonan)}
                >
                  Invoice
                </Button>
              )}

              {isLunas && openKuitansi && (
                <Button
                  size="sm"
                  variant="success"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  onClick={() => {
                    if (!permohonan?.kuitansi_pdf_tte) {
                      Swal.fire({
                        icon: "info",
                        title: "Kuitansi Belum Tersedia",
                        text: "Kuitansi pembayaran sedang diproses oleh Bendahara.",
                        confirmButtonColor: "#0270c7",
                      })
                      return
                    }
                    openKuitansi(permohonan)
                  }}
                >
                  Kuitansi
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── MODAL PREVIEW GAMBAR ── */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-bold text-slate-800 truncate">{previewImage.title}</span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-slate-100 max-h-[70vh] overflow-auto">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="px-5 py-3 border-t border-slate-100 bg-white flex justify-end gap-2">
              <a
                href={previewImage.url}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File</span>
              </a>
              <Button size="sm" variant="outline" onClick={() => setPreviewImage(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Backward compatibility exports
export const HalalDetailPermohonanTab = HalalDetailSection
export default HalalDetailSection
