import React, { useState, useMemo } from "react"
import {
  Receipt,
  FileCheck,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Search,
  Calendar,
  Inbox,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react"
import Head from "../../components/common/Head"
import api from "../../utils/api"
import Swal from "sweetalert2"
import usePembayaran from "../../hooks/usePembayaran"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { StatsCard } from "../../components/ui/StatsCard"
import toast from "react-hot-toast"
import { usePembayaranQuery, PembayaranItem } from "../../hooks/queries/usePermohonanQuery"
import { cn } from "../../utils/cn"
import { TextInput } from "../../components/forms"

export type { PembayaranItem }

type StatusFilter = "ALL" | "BELUM" | "LUNAS"

const PAGE_SIZE = 8

const PembayaranPage: React.FC = () => {
  const [requestingTteId, setRequestingTteId] = useState<string | null>(null)
  const [copiedVa, setCopiedVa] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
  const [currentPage, setCurrentPage] = useState(1)

  const { data: rawData = [], isLoading: loading, refetch: fetchData } = usePembayaranQuery()
  const { openInvoice, openKuitansi, openSuratPenawaran, PdfPreviewModal } = usePembayaran()

  const handleCopyVa = (va: string) => {
    navigator.clipboard.writeText(va)
    setCopiedVa(va)
    toast.success("Nomor Virtual Account disalin")
    setTimeout(() => setCopiedVa(null), 2000)
  }

  const data = useMemo(() => {
    return rawData.filter((item) => {
      const wf = (item.status_workflow || "").toUpperCase()
      const sp = (item.status_penawaran || "").toUpperCase()
      const sb = (item.status_bayar || "").toUpperCase()

      const isRejectedOrCancelled =
        ["DITOLAK", "BATAL", "REJECTED"].includes(wf) ||
        ["TOLAK", "DITOLAK", "REJECTED"].includes(sp) ||
        sb === "BATAL"

      if (isRejectedOrCancelled) {
        return false
      }

      // Tampilkan jika sudah tahap pembayaran, lunas/proses/selesai, atau sudah memiliki tagihan/invoice/VA
      return (
        ["PEMBAYARAN", "PROSES", "PROCESS", "DONE", "SELESAI"].includes(wf) ||
        sb === "LUNAS" ||
        Boolean(item.invoice_number) ||
        Boolean(item.va) ||
        (typeof item.total_tagihan === "number" && item.total_tagihan > 0)
      )
    })
  }, [rawData])

  // Summary Metrics
  const summary = useMemo(() => {
    const totalTagihan = data.reduce((acc, curr) => acc + curr.total_tagihan, 0)
    const belumBayar = data.filter((d) => d.status_bayar === "BELUM").length
    const lunas = data.filter((d) => d.status_bayar === "LUNAS").length

    return { totalTagihan, belumBayar, lunas, totalCount: data.length }
  }, [data])

  // Filtered Data (Search + Status Tab)
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (statusFilter !== "ALL" && item.status_bayar !== statusFilter) {
        return false
      }

      if (!search.trim()) return true
      const term = search.toLowerCase()
      return (
        (item.no_permohonan || "").toLowerCase().includes(term) ||
        (item.nama_permohonan || "").toLowerCase().includes(term) ||
        (item.va || "").toLowerCase().includes(term) ||
        (item.invoice_number || "").toLowerCase().includes(term)
      )
    })
  }, [data, statusFilter, search])

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredData.slice(start, start + PAGE_SIZE)
  }, [filteredData, currentPage])

  const handleRequestTteInvoice = async (row: PembayaranItem) => {
    const result = await Swal.fire({
      title: "Minta Tanda Tangan Invoice?",
      text: `Ajukan permohonan tanda tangan resmi Bendahara untuk Invoice ${row.invoice_number || row.no_permohonan}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Ajukan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#0270c7",
    })

    if (!result.isConfirmed) return

    try {
      setRequestingTteId(`inv-${row.id}`)
      const res = await api.post(`/eksternal/permohonan/${row.id}/request-tte-invoice`)
      Swal.fire({
        icon: "success",
        title: "Permintaan Terkirim",
        text: res?.data?.message || "Permintaan tanda tangan invoice telah diteruskan ke Bendahara.",
        confirmButtonColor: "#0270c7",
      })
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengajukan permintaan tanda tangan invoice")
    } finally {
      setRequestingTteId(null)
    }
  }

  const handleRequestTteKuitansi = async (row: PembayaranItem) => {
    const result = await Swal.fire({
      title: "Minta Tanda Tangan Kuitansi?",
      text: `Ajukan permohonan tanda tangan resmi Bendahara untuk Kuitansi ${row.kuitansi_number || row.no_permohonan}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Ajukan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#10b981",
    })

    if (!result.isConfirmed) return

    try {
      setRequestingTteId(`kwt-${row.id}`)
      const res = await api.post(`/eksternal/permohonan/${row.id}/request-tte-kuitansi`)
      Swal.fire({
        icon: "success",
        title: "Permintaan Terkirim",
        text: res?.data?.message || "Permintaan tanda tangan kuitansi telah diteruskan ke Bendahara.",
        confirmButtonColor: "#10b981",
      })
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengajukan permintaan tanda tangan kuitansi")
    } finally {
      setRequestingTteId(null)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: string) => {
    if (!date || date === "-") return "-"
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const showInfo = (title: string, message: string) => {
    Swal.fire({
      icon: "info",
      title,
      text: message,
      confirmButtonColor: "#0270c7",
    })
  }

  const renderStatusBadge = (statusBayar: string) => {
    switch (statusBayar) {
      case "LUNAS":
        return (
          <Badge variant="success" size="sm" dot className="whitespace-nowrap">
            Lunas
          </Badge>
        )
      case "BELUM":
        return (
          <Badge variant="warning" size="sm" dot className="whitespace-nowrap">
            Menunggu Pembayaran
          </Badge>
        )
      case "EXPIRED":
        return (
          <Badge variant="danger" size="sm" dot className="whitespace-nowrap">
            Kadaluarsa
          </Badge>
        )
      case "BATAL":
        return (
          <Badge variant="danger" size="sm" dot className="whitespace-nowrap">
            Batal
          </Badge>
        )
      default:
        return (
          <Badge variant="neutral" size="sm" className="whitespace-nowrap">
            {statusBayar}
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Head title="Manajemen Pembayaran & Invoice" />

      {/* Header Page */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Riwayat Pembayaran & Invoice
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pantau status tagihan PNBP, akses instruksi Virtual Account BNI, dan pratinjau dokumen pembayaran resmi ber-TTE.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Menunggu Pembayaran"
          value={summary.belumBayar}
          subtitle="Tagihan aktif belum lunas"
          icon={<Clock className="w-5 h-5" />}
          variant="warning"
        />
        <StatsCard
          title="Pembayaran Lunas"
          value={summary.lunas}
          subtitle="Kuitansi tersedia"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="success"
        />
        <StatsCard
          title="Total Tagihan"
          value={formatCurrency(summary.totalTagihan)}
          subtitle={`Dari ${summary.totalCount} transaksi`}
          icon={<CreditCard className="w-5 h-5" />}
          variant="primary"
        />
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "ALL" as StatusFilter, label: "Semua", count: summary.totalCount },
            { id: "BELUM" as StatusFilter, label: "Menunggu Pembayaran", count: summary.belumBayar },
            { id: "LUNAS" as StatusFilter, label: "Lunas", count: summary.lunas },
          ].map((tab) => {
            const active = statusFilter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id)
                  setCurrentPage(1)
                }}
                className={cn(
                  "h-[42px] px-3.5 sm:px-4 rounded-xl text-xs transition-all inline-flex items-center gap-2 whitespace-nowrap border border-slate-200 select-none",
                  active
                    ? "bg-white text-slate-900 border-slate-300 shadow-2xs font-semibold"
                    : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 font-medium"
                )}
              >
                <span>{tab.label}</span>  
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums",
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-80">
          <TextInput
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Cari no. permohonan, layanan, VA..."
            isClearable
            onClear={() => {
              setSearch("")
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      {/* Transaction Cards List */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card py-16 flex flex-col items-center justify-center gap-2.5 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-brand-600" />
          <span className="text-xs font-medium text-slate-500">Memuat daftar transaksi pembayaran...</span>
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-card py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Inbox className="w-10 h-10 stroke-1 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">Tidak ada transaksi ditemukan</p>
          <p className="text-xs text-slate-400">
            {search || statusFilter !== "ALL"
              ? "Coba ubah kata kunci pencarian atau filter status pembayaran."
              : "Belum ada catatan tagihan pembayaran pada akun Anda."}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {paginatedData.map((row) => {
            const hasPenawaran = Boolean(row.file_surat_penawaran)
            const isInvoiceReady = Boolean(row.pdf_tte || row.invoice_file)
            const isPaid = row.status_bayar === "LUNAS"
            const isKuitansiReady = isPaid && Boolean(row.kuitansi_pdf_tte || row.kuitansi_file)
            const hasAnyDocument = hasPenawaran || isInvoiceReady || isKuitansiReady

            const pendingDocs: string[] = []
            if (!isInvoiceReady) {
              pendingDocs.push("Invoice")
            }
            if (isPaid && !isKuitansiReady) {
              pendingDocs.push("Kuitansi")
            }

            return (
              <div
                key={row.id}
                className="bg-white rounded-xl border border-slate-200/80 shadow-card hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Card Top Bar: Metadata & Status */}
                <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(row.tgl_order)}
                    </span>
                    {row.invoice_number && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200/70">
                          {row.invoice_number}
                        </span>
                      </>
                    )}
                  </div>

                  <div>{renderStatusBadge(row.status_bayar)}</div>
                </div>

                {/* Card Body: Nomor Permohonan, Layanan & Total Tagihan */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Nomor Permohonan & Layanan */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {row.no_permohonan}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-slate-600">
                      {row.nama_permohonan}
                    </p>
                  </div>

                  {/* Right: Total Tagihan */}
                  <div className="sm:text-right shrink-0">
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Total Tagihan
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-900 tabular-nums mt-0.5">
                      {formatCurrency(row.total_tagihan)}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Document Action Buttons */}
                <div className="px-4 sm:px-5 py-3 bg-slate-50/40 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center flex-wrap gap-2.5">
                    {pendingDocs.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Dokumen {pendingDocs.join(" dan ")} sedang dalam proses penerbitan</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center flex-wrap justify-end gap-2 ml-auto">
                    {/* Surat Penawaran - hanya muncul jika file surat penawaran sudah ada */}
                    {hasPenawaran && (
                      <button
                        type="button"
                        onClick={() => openSuratPenawaran(row)}
                        title="Lihat Surat Penawaran Biaya Resmi"
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-slate-200/90 bg-white text-slate-700 hover:bg-indigo-50/50 hover:border-indigo-300 hover:text-indigo-700 transition-all shadow-2xs active:scale-[0.98]"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Surat Penawaran</span>
                      </button>
                    )}

                    {/* Invoice - hanya muncul jika invoice sudah ada / siap */}
                    {isInvoiceReady && (
                      <button
                        type="button"
                        onClick={() => openInvoice(row)}
                        title="Buka Invoice Resmi TTE"
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-slate-200/90 bg-white text-slate-700 hover:bg-brand-50/50 hover:border-brand-300 hover:text-brand-700 shadow-2xs transition-all active:scale-[0.98]"
                      >
                        <Receipt className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span>Invoice</span>
                      </button>
                    )}

                    {/* Kuitansi - hanya muncul jika sudah lunas dan kuitansi sudah ada / siap */}
                    {isKuitansiReady && (
                      <button
                        type="button"
                        onClick={() => openKuitansi(row)}
                        title="Buka Kuitansi Resmi TTE"
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/80 hover:border-emerald-300 shadow-2xs transition-all active:scale-[0.98]"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Kuitansi</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Pagination Footer */}
          {filteredData.length > PAGE_SIZE && (
            <div className="px-4 py-3 bg-white rounded-xl border border-slate-200/80 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Menampilkan{" "}
                <span className="font-semibold text-slate-700">
                  {(currentPage - 1) * PAGE_SIZE + 1}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-slate-700">
                  {Math.min(currentPage * PAGE_SIZE, filteredData.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-slate-700">
                  {filteredData.length}
                </span>{" "}
                transaksi
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="h-7 w-7"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <span className="px-2 font-medium text-slate-700">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="h-7 w-7"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PDF Preview Modal */}
      {PdfPreviewModal}
    </div>
  )
}

export default PembayaranPage
