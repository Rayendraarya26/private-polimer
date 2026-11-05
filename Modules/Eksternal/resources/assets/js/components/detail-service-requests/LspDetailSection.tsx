import React, { useState } from "react"
import Swal from "sweetalert2"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import {
  User,
  Building2,
  FileText,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Eye,
  Download,
  X,
  CreditCard,
  Receipt,
  CheckCircle2,
  Calendar,
  Award,
} from "lucide-react"
import { getFileUrl } from "../../utils/fileHelpers"
import { formatIndoDate as defaultFormatIndoDate } from "../../utils/formatIndoDate"

export interface LspDetailData {
  id?: string
  permohonan_id?: string
  nama_lengkap?: string
  gender?: string
  tempat_lahir?: string
  nik_peserta?: string
  tanggal_lahir?: string
  kewarganegaraan?: string
  kode_pos?: string
  pendidikan?: string
  whatsapp?: string
  email?: string
  alamat_peserta?: string
  ktp_peserta?: string
  ijazah?: string
  apl_01?: string
  apl_02?: string
  upload_lainya?: string
  nama_instansi?: string
  alamat_instansi?: string
  jenis_produk?: string
  jabatan?: string
  pengalaman_kerja?: string
  setuju_syarat?: boolean
}

export interface LspDetailSectionProps {
  permohonan: any
  formLsp?: LspDetailData | any
  formatIndoDate?: (dateStr?: string | null, withTime?: boolean, shortMonth?: boolean) => string
  openInvoice?: (item: any) => void
  openKuitansi?: (item: any) => void
  openSuratPenawaran?: (item: any) => void
  openPdfDoc?: (url: string, title?: string, filename?: string) => void
}

export const LspDetailSection: React.FC<LspDetailSectionProps> = ({
  permohonan,
  formLsp,
  formatIndoDate = defaultFormatIndoDate,
  openInvoice,
  openKuitansi,
  openSuratPenawaran,
  openPdfDoc,
}) => {
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null)

  // 1. Resolve Data LSP
  const lspData: LspDetailData =
    formLsp ||
    permohonan?.form_lsp?.[0] ||
    permohonan?.formLsp?.[0] ||
    permohonan?.form_lsp ||
    permohonan?.formLsp ||
    permohonan?.form_data ||
    permohonan?.detailPermohonan?.[0]?.formable ||
    {}

  const noOrder = permohonan?.no_permohonan || permohonan?.kode_order || "-"
  const namaAsesi = lspData?.nama_lengkap || permohonan?.creator?.name || "-"
  const skemaSertifikasi = lspData?.jenis_produk || "Sertifikasi Kompetensi Profesi"
  const jabatan = lspData?.jabatan || "-"
  const pengalamanKerja = lspData?.pengalaman_kerja || "-"
  const namaInstansi = lspData?.nama_instansi || permohonan?.creator?.pelanggan?.detail?.nama_perusahaan || "-"
  const alamatInstansi = lspData?.alamat_instansi || permohonan?.creator?.pelanggan?.detail?.alamat_kantor || "-"

  const totalBiaya = Number(
    permohonan?.harga_permohonan ||
    permohonan?.total_harga ||
    0
  )
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
      openPdfDoc(url, title || "Dokumen Asesi", fileRelPath.split("/").pop() || "dokumen.pdf")
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

  // Daftar berkas persyaratan sama persis dengan modul admin LSP
  const fileItems = [
    {
      id: "ktp_peserta",
      nama: "KTP",
      deskripsi: "Kartu Tanda Penduduk Peserta",
      filePath: lspData?.ktp_peserta,
    },
    {
      id: "ijazah",
      nama: "Ijazah",
      deskripsi: "Ijazah Pendidikan Terakhir",
      filePath: lspData?.ijazah,
    },
    {
      id: "apl_01",
      nama: "APL 01",
      deskripsi: "Formulir Permohonan Sertifikasi Kompetensi",
      filePath: lspData?.apl_01,
    },
    {
      id: "apl_02",
      nama: "APL 02",
      deskripsi: "Formulir Asesmen Mandiri",
      filePath: lspData?.apl_02,
    },
    {
      id: "upload_lainya",
      nama: "File Lainnya",
      deskripsi: "Portofolio / Bukti Kompetensi Pendukung",
      filePath: lspData?.upload_lainya,
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* ── GRID 2 KOLOM: Identitas Peserta & Data Instansi/Pekerjaan (Sesuai Struktur Admin) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Kolom Kiri: Identitas Peserta */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-800">
                  Identitas Peserta
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Nama</span>
              <span className="sm:col-span-2 font-bold text-slate-900 text-sm">
                {namaAsesi}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">NIK</span>
              <span className="sm:col-span-2 font-mono font-semibold text-slate-800">
                {lspData?.nik_peserta || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Tempat, Tgl Lahir</span>
              <span className="sm:col-span-2 font-semibold text-slate-800">
                {lspData?.tempat_lahir || "-"}, {lspData?.tanggal_lahir ? formatDate(lspData.tanggal_lahir) : "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Jenis Kelamin</span>
              <span className="sm:col-span-2 font-semibold text-slate-800">
                {lspData?.gender || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Kewarganegaraan</span>
              <span className="sm:col-span-2 font-semibold text-slate-800">
                {lspData?.kewarganegaraan || "Indonesia"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Email</span>
              <span className="sm:col-span-2 font-semibold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {lspData?.email || permohonan?.creator?.email || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">WhatsApp</span>
              <span className="sm:col-span-2 font-semibold text-brand-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                {lspData?.whatsapp || permohonan?.creator?.phone || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Alamat</span>
              <span className="sm:col-span-2 font-medium text-slate-800 leading-relaxed">
                {lspData?.alamat_peserta || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Kode Pos</span>
              <span className="sm:col-span-2 font-mono font-semibold text-slate-800">
                {lspData?.kode_pos || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5">
              <span className="text-slate-500 font-medium">Pendidikan</span>
              <span className="sm:col-span-2 font-semibold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                {lspData?.pendidikan || "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Kolom Kanan: Data Instansi / Pekerjaan */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-800">
                  Data Instansi / Pekerjaan
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Nama Instansi</span>
              <span className="sm:col-span-2 font-bold text-slate-900 text-sm">
                {namaInstansi}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Alamat Instansi</span>
              <span className="sm:col-span-2 font-medium text-slate-800 leading-relaxed">
                {alamatInstansi}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Jenis Produk</span>
              <span className="sm:col-span-2 font-bold text-brand-700">
                {skemaSertifikasi}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Jabatan</span>
              <span className="sm:col-span-2 font-semibold text-slate-800">
                {jabatan}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Pengalaman Kerja</span>
              <span className="sm:col-span-2 font-semibold text-slate-800">
                {pengalamanKerja}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Setuju Syarat</span>
              <span className="sm:col-span-2 font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {lspData?.setuju_syarat !== undefined
                  ? lspData.setuju_syarat
                    ? "Ya, Menyetujui Persyaratan"
                    : "Tidak"
                  : "Ya"}
              </span>
            </div>

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
      </div>

      {/* ── CARD FILE PENDUKUNG (Sesuai Struktur Admin) ── */}
      <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              File Pendukung
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4 w-40">Nama File</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4 text-right w-48">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fileItems.map((item, idx) => {
                  const hasFile = Boolean(item.filePath)
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-center font-medium text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {item.nama}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span>{item.deskripsi}</span>
                        {hasFile && (
                          <span className="block text-[11px] font-mono text-slate-400 mt-0.5 truncate max-w-sm">
                            {item.filePath?.split("/").pop()}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {hasFile ? (
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2.5 text-xs text-brand-700 border-brand-200 hover:bg-brand-50"
                              leftIcon={<Eye className="w-3 h-3" />}
                              onClick={() => handlePreviewFile(item.filePath, item.nama)}
                            >
                              Lihat File
                            </Button>
                            <a
                              href={getFileUrl(item.filePath!)}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 h-7 px-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              title="Unduh File"
                            >
                              <Download className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── CARD STATUS PEMBAYARAN & DOKUMEN TRANSAKSI (Sesuai Style Permohonan Lain) ── */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Status Pembayaran & Dokumen Transaksi
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-slate-400 block font-medium">Nomor Invoice:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block font-mono">
                {permohonan?.invoice_number || permohonan?.tagihan?.nomor_invoice || "Belum Diterbitkan"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Nomor Virtual Account:</span>
              <span className="font-bold text-brand-700 mt-0.5 block font-mono text-sm">
                {permohonan?.va || permohonan?.tagihan?.va || "Belum Terbit"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Total Tarif PNBP:</span>
              <span className="font-bold text-slate-900 mt-0.5 block text-sm">
                {totalBiaya > 0 ? `Rp ${totalBiaya.toLocaleString("id-ID")}` : "Menunggu Penetapan Tarif"}
              </span>
            </div>
          </div>

          {/* Tombol Dokumen Finansial (Hanya muncul jika file tersedia) */}
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

export default LspDetailSection
