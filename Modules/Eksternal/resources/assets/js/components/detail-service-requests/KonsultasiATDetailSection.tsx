import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import {
  User,
  Phone,
  Mail,
  MapPin,
  Cpu,
  FileText,
  Download,
  CreditCard,
  Receipt,
  CheckCircle2,
  FileCheck2,
  Calendar,
  Layers,
  Sparkles,
  Eye,
  X,
} from "lucide-react"
import { getFileUrl } from "../../utils/fileHelpers"

export interface KonsultasiATDetailSectionProps {
  permohonan: any
  formKonsultasiAt?: any
  formatIndoDate?: (dateStr?: string | null, withTime?: boolean, shortMonth?: boolean) => string
  openInvoice?: (item: any) => void
  openKuitansi?: (item: any) => void
  openSuratPenawaran?: (item: any) => void
  openPdfDoc?: (url: string, title?: string, filename?: string) => void
}

export const KonsultasiATDetailSection: React.FC<KonsultasiATDetailSectionProps> = ({
  permohonan,
  formKonsultasiAt,
  formatIndoDate,
  openInvoice,
  openKuitansi,
  openSuratPenawaran,
  openPdfDoc,
}) => {
  // 1. Data Form Konsultasi & Audit Teknologi
  const form =
    formKonsultasiAt ||
    permohonan?.form_konsultasi_at ||
    permohonan?.formKonsultasiAt ||
    permohonan?.formable ||
    null

  // 2. Data Identitas Pemohon
  const namaPemohon = form?.nama_pemohon || permohonan?.creator?.name || "-"
  const noTelp = form?.no_telp || permohonan?.creator?.phone || "-"
  const emailPemohon = form?.email_pemohon || permohonan?.creator?.email || "-"
  const alamatPemohon = form?.alamat_pemohon || "-"

  // 3. Data Layanan
  const layananKode = form?.layanan_kode || "-"
  const layananNama = form?.layanan_nama || "-"
  const layananLainnya = form?.layanan_lainnya || null
  const catatanDokumen = form?.catatan_dokumen || null
  const statusLayanan = form?.status_layanan || "pengajuan"

  // 4. Data Berkas / Dokumen
  const dokumenList: any[] = Array.isArray(form?.dokumen)
    ? form.dokumen
    : Array.isArray(form?.dokumen_list)
      ? form.dokumen_list
      : Array.isArray(permohonan?.formKonsultasiAt?.[0]?.dokumen)
        ? permohonan.formKonsultasiAt[0].dokumen
        : Array.isArray(permohonan?.form_konsultasi_at?.[0]?.dokumen)
          ? permohonan.form_konsultasi_at[0].dokumen
          : Array.isArray(permohonan?.form_data?.dokumen)
            ? permohonan.form_data.dokumen
            : []

  // 5. Data Status & Finansial Permohonan
  const statusBayar = permohonan?.status_bayar || "-"
  const tglOrder = permohonan?.created_at || permohonan?.tgl_order || null
  const isLunas = statusBayar === "LUNAS"

  const grandTotalBiaya = Number(
    permohonan?.harga_permohonan ||
    permohonan?.total_harga ||
    0
  )

  const hasPenawaran = Boolean(
    permohonan?.file_surat_penawaran ||
    (permohonan?.catatan_admin && (
      permohonan.catatan_admin.endsWith(".pdf") ||
      permohonan.catatan_admin.includes("penawaran/") ||
      permohonan.catatan_admin.includes("surat_penawaran/")
    ))
  )

  const defaultFormatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-"
    if (formatIndoDate) return formatIndoDate(dateStr, false, true)
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return "-"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // State fallback untuk modal preview PDF jika openPdfDoc tidak diinjeksi
  const [localPreviewModal, setLocalPreviewModal] = useState<{
    isOpen: boolean
    url: string
    title: string
    filename: string
  }>({ isOpen: false, url: "", title: "", filename: "" })

  const isPdfDoc = (doc: any) => {
    const ext = (doc.file_extension || "").toLowerCase()
    const name = (doc.nama_file_asli || "").toLowerCase()
    const mime = (doc.file_mime_type || "").toLowerCase()
    return ext === "pdf" || name.endsWith(".pdf") || mime.includes("pdf")
  }

  const handleOpenDoc = (doc: any) => {
    const fileUrl = doc.file_path ? getFileUrl(doc.file_path) : null
    if (!fileUrl) return

    const title = doc.nama_file_asli || "Pratinjau Dokumen PDF"
    const filename = doc.nama_file_asli || `${title}.pdf`

    if (openPdfDoc) {
      openPdfDoc(fileUrl, title, filename)
    } else {
      setLocalPreviewModal({
        isOpen: true,
        url: fileUrl,
        title,
        filename,
      })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. GRID INFORMASI UTAMA: Identitas Pemohon & Detail Layanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Identitas Pemohon */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Identitas Pemohon
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nama Pemohon:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block text-sm">
                {namaPemohon}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">No. Telepon / WhatsApp:</span>
                <span className="font-semibold text-slate-800 mt-0.5 inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {noTelp}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Email:</span>
                <span className="font-semibold text-slate-800 mt-0.5 inline-flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {emailPemohon}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block font-medium">Alamat Pemohon:</span>
              <span className="font-medium text-slate-800 mt-0.5 block leading-relaxed">
                {alamatPemohon}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Detail Layanan Konsultasi & Audit Teknologi */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Detail Permohonan
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Layanan yang Dipilih:</span>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-sm">
                  {layananNama}
                </span>
              </div>
            </div>

            {layananLainnya && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block font-medium">Rincian Layanan Lainnya:</span>
                <span className="font-semibold text-brand-700 mt-0.5 block">
                  {layananLainnya}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 2. CATATAN DOKUMEN / KEBUTUHAN PEMOHON */}
      {catatanDokumen && (
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Catatan / Keterangan Tambahan Pemohon
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
              {catatanDokumen}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 3. BERKAS DOKUMEN PERMOHONAN */}
      <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3 bg-slate-50/60 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Berkas & Dokumen Permohonan
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          {dokumenList.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              Belum ada berkas dokumen yang dilampirkan.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dokumenList.map((doc: any, idx: number) => {
                const fileName = doc.nama_file_asli || `Dokumen #${idx + 1}`
                const fileSize = formatFileSize(doc.file_size)
                const fileUrl = doc.file_path ? getFileUrl(doc.file_path) : null

                return (
                  <div
                    key={doc.id || idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 transition-all flex items-center justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="p-2 rounded-lg bg-brand-50 text-brand-600 shrink-0">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 block truncate" title={fileName}>
                          {fileName}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Ukuran: {fileSize} {doc.file_extension ? `• .${doc.file_extension.toUpperCase()}` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {fileUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDoc(doc)}
                          className="h-8 px-2.5 text-xs text-brand-700 bg-brand-50/60 hover:bg-brand-100 hover:text-brand-800 border-brand-200 shadow-2xs font-medium"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          {isPdfDoc(doc) ? "Pratinjau" : "Buka"}
                        </Button>
                      )}

                      {fileUrl && (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={fileName}
                          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-xs font-semibold shrink-0"
                          title="Unduh Berkas"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Unduh</span>
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. INFORMASI PEMBAYARAN & DOKUMEN FINANSIAL (Jika Sudah Ada Penawaran / Invoice) */}
      {(permohonan?.invoice_number || permohonan?.va || hasPenawaran || grandTotalBiaya > 0) && (
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3 bg-slate-50/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-800">
                  Informasi Pembayaran & Dokumen Finansial
                </CardTitle>
              </div>
              <Badge
                variant={isLunas ? "success" : "warning"}
                className="font-bold text-[11px]"
              >
                {isLunas ? "Lunas" : "Menunggu Pembayaran"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-400 block font-medium">Nomor Invoice:</span>
                <span className="font-semibold text-slate-900 mt-0.5 block font-mono">
                  {permohonan?.invoice_number || "Belum Diterbitkan"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Virtual Account BNI:</span>
                <span className="font-bold text-brand-700 mt-0.5 block font-mono text-sm">
                  {permohonan?.va || "Belum Terbit"}
                </span>
                {permohonan?.va_expired_at && (
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Berlaku s/d: {defaultFormatDate(permohonan.va_expired_at)}
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Total Tagihan:</span>
                <span className="font-bold text-slate-900 mt-0.5 block text-sm">
                  Rp {grandTotalBiaya.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Tombol Dokumen Finansial */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
              {hasPenawaran && openSuratPenawaran && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
                  leftIcon={<FileText className="w-3.5 h-3.5 text-indigo-600" />}
                  onClick={() => openSuratPenawaran(permohonan)}
                >
                  Lihat Surat Penawaran Biaya
                </Button>
              )}

              {permohonan?.invoice_number && openInvoice && (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Receipt className="w-3.5 h-3.5" />}
                  onClick={() => openInvoice(permohonan)}
                >
                  Buka Invoice Resmi
                </Button>
              )}

              {isLunas && openKuitansi && (
                <Button
                  size="sm"
                  variant="success"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  onClick={() => openKuitansi(permohonan)}
                >
                  Buka Kuitansi Resmi
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback Modal Preview PDF jika openPdfDoc dari parent tidak tersedia */}
      {localPreviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                <h3 className="text-sm font-bold text-slate-800 truncate">
                  {localPreviewModal.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={localPreviewModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={localPreviewModal.filename}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-brand-700 hover:bg-slate-100 transition-colors border border-slate-200 bg-white"
                  title="Unduh / Buka di Tab Baru"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLocalPreviewModal({ isOpen: false, url: "", title: "", filename: "" })}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100">
              <iframe
                src={localPreviewModal.url}
                className="w-full h-full border-0"
                title={localPreviewModal.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default KonsultasiATDetailSection
