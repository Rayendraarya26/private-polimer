import React, { useEffect, useState, useMemo } from "react"
import {
  Receipt,
  FileCheck,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  ExternalLink,
  Search,
} from "lucide-react"
import Head from "../../components/common/Head"
import api from "../../utils/api"
import Swal from "sweetalert2"
import usePembayaran from "../../hooks/usePembayaran"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { DataTable, Column } from "../../components/ui/DataTable"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { StatsCard } from "../../components/ui/StatsCard"

export type PembayaranItem = {
  id: string
  nama_permohonan: string
  no_permohonan: string
  tgl_order: string
  total_tagihan: number
  status_bayar: string
  va?: string | null
  va_trx_id?: string | null
  va_expired_at?: string | null
  va_status?: string | null
  invoice_number?: string | null
  invoice_file?: string | null
  pdf_tte?: string | null
  tte_invoice_requested?: boolean
  tte_invoice_requested_at?: string | null
  kuitansi_number?: string | null
  kuitansi_file?: string | null
  kuitansi_pdf_tte?: string | null
  tte_kuitansi_requested?: boolean
  tte_kuitansi_requested_at?: string | null
}

const PembayaranPage: React.FC = () => {
  const [data, setData] = useState<PembayaranItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [requestingTteId, setRequestingTteId] = useState<string | null>(null)

  const { openInvoice, openKuitansi, PdfPreviewModal } = usePembayaran()

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await api.get("/eksternal/pembayaran")

      const mapped = (res.data.data || []).map((item: any) => ({
        id: item.id,
        nama_permohonan: item.nama_permohonan || "-",
        no_permohonan: item.no_permohonan || "-",
        tgl_order: item.tgl_order || "-",
        total_tagihan: Number(item.total_tagihan || 0),
        status_bayar: item.status_bayar || "BELUM",
        va: item.va || null,
        va_trx_id: item.va_trx_id || null,
        va_expired_at: item.va_expired_at || null,
        va_status: item.va_status || "PENDING",
        invoice_number: item.invoice_number || null,
        invoice_file: item.invoice_file || null,
        pdf_tte: item.pdf_tte || null,
        tte_invoice_requested: Boolean(item.tte_invoice_requested),
        tte_invoice_requested_at: item.tte_invoice_requested_at || null,
        kuitansi_number: item.kuitansi_number || null,
        kuitansi_file: item.kuitansi_file || null,
        kuitansi_pdf_tte: item.kuitansi_pdf_tte || null,
        tte_kuitansi_requested: Boolean(item.tte_kuitansi_requested),
        tte_kuitansi_requested_at: item.tte_kuitansi_requested_at || null,
      }))

      setData(mapped)
    } catch (error) {
      console.error("Gagal mengambil data pembayaran:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRequestTteInvoice = async (row: PembayaranItem) => {
    const result = await Swal.fire({
      title: "Minta TTE BSrE Invoice?",
      text: `Ajukan permohonan tanda tangan elektronik (TTE BSrE) resmi Bendahara untuk Invoice ${row.invoice_number || row.no_permohonan}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Ajukan TTE",
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
        text: res?.data?.message || "Permintaan TTE BSrE Invoice telah diteruskan ke Bendahara.",
        confirmButtonColor: "#0270c7",
      })
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengajukan permintaan TTE Invoice")
    } finally {
      setRequestingTteId(null)
    }
  }

  const handleRequestTteKuitansi = async (row: PembayaranItem) => {
    const result = await Swal.fire({
      title: "Minta TTE BSrE Kuitansi?",
      text: `Ajukan permohonan tanda tangan elektronik (TTE BSrE) resmi Bendahara untuk Kuitansi ${row.kuitansi_number || row.no_permohonan}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Ajukan TTE",
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
        text: res?.data?.message || "Permintaan TTE BSrE Kuitansi telah diteruskan ke Bendahara.",
        confirmButtonColor: "#10b981",
      })
      fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengajukan permintaan TTE Kuitansi")
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

  // Summary Metrics
  const summary = useMemo(() => {
    const totalTagihan = data.reduce((acc, curr) => acc + curr.total_tagihan, 0)
    const belumBayar = data.filter((d) => d.status_bayar === "BELUM").length
    const lunas = data.filter((d) => d.status_bayar === "LUNAS").length

    return { totalTagihan, belumBayar, lunas, totalCount: data.length }
  }, [data])

  const columns: Column<PembayaranItem>[] = [
    {
      key: "tgl_order",
      header: "Tanggal Order",
      sortable: true,
      render: (row) => (
        <span className="text-slate-600 font-medium">{formatDate(row.tgl_order)}</span>
      ),
    },
    {
      key: "no_permohonan",
      header: "No. Permohonan & BNI VA",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-slate-900">{row.no_permohonan}</span>
          {row.va ? (
            <div className="inline-flex items-center gap-1 text-xs text-primary-700 font-mono font-medium">
              <span>VA: {row.va}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">VA: Belum terbit</span>
          )}
        </div>
      ),
    },
    {
      key: "nama_permohonan",
      header: "Layanan / Komoditas",
      sortable: true,
      render: (row) => (
        <div className="font-medium text-slate-800 line-clamp-1 max-w-xs">
          {row.nama_permohonan}
        </div>
      ),
    },
    {
      key: "total_tagihan",
      header: "Total Tagihan PNBP",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-slate-900">
          {formatCurrency(row.total_tagihan)}
        </span>
      ),
    },
    {
      key: "status_bayar",
      header: "Status Pembayaran",
      sortable: true,
      className: "text-center",
      headerClassName: "text-center",
      render: (row) => {
        switch (row.status_bayar) {
          case "LUNAS":
            return <Badge variant="success" dot>Lunas</Badge>
          case "BELUM":
            return <Badge variant="warning" dot>Menunggu Pembayaran</Badge>
          case "EXPIRED":
            return <Badge variant="danger" dot>Kadaluarsa</Badge>
          case "BATAL":
            return <Badge variant="danger" dot>Batal</Badge>
          default:
            return <Badge variant="neutral">{row.status_bayar}</Badge>
        }
      },
    },
    {
      key: "actions",
      header: "Aksi & Dokumen Finansial",
      className: "text-right",
      headerClassName: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2 flex-wrap whitespace-nowrap">
          {/* Invoice Button & TTE Request */}
          <div className="inline-flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Receipt className="w-3.5 h-3.5" />}
              onClick={() => openInvoice(row)}
            >
              Invoice
            </Button>
            {!row.pdf_tte && (
              row.tte_invoice_requested ? (
                <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200 rounded-lg">
                  TTE Diminta
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRequestTteInvoice(row)}
                  disabled={requestingTteId === `inv-${row.id}`}
                  className="px-2 py-1 text-[10px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-colors"
                  title="Minta TTE BSrE Resmi Bendahara"
                >
                  Minta TTE
                </button>
              )
            )}
            {row.pdf_tte && (
              <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg">
                TTE BSrE Sah
              </span>
            )}
          </div>

          {/* Kuitansi Button & TTE Request */}
          <div className="inline-flex items-center gap-1">
            <Button
              size="sm"
              variant={row.status_bayar === "LUNAS" ? "success" : "secondary"}
              leftIcon={<FileCheck className="w-3.5 h-3.5" />}
              onClick={() => {
                if (row.status_bayar !== "LUNAS" && !row.kuitansi_file) {
                  showInfo(
                    "Kuitansi Belum Tersedia",
                    "Kuitansi resmi akan diterbitkan otomatis setelah pembayaran lunas terverifikasi."
                  )
                  return
                }
                openKuitansi(row)
              }}
            >
              Kuitansi
            </Button>

            {row.status_bayar === "LUNAS" && (
              !row.kuitansi_pdf_tte ? (
                row.tte_kuitansi_requested ? (
                  <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200 rounded-lg">
                    TTE Diminta
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRequestTteKuitansi(row)}
                    disabled={requestingTteId === `kwt-${row.id}`}
                    className="px-2 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                    title="Minta TTE BSrE Resmi Bendahara"
                  >
                    Minta TTE
                  </button>
                )
              ) : (
                <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg">
                  TTE BSrE Sah
                </span>
              )
            )}
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Head title="Manajemen Pembayaran & Invoice" />

      {/* Header Page */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Riwayat Pembayaran & Invoice
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pantau status tagihan PNBP, akses instruksi Virtual Account BNI, dan pratinjau kuitansi resmi ber-TTE.
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
          subtitle="Kuitansi resmi tersedia"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="success"
        />
        <StatsCard
          title="Total Tagihan PNBP"
          value={formatCurrency(summary.totalTagihan)}
          subtitle={`Dari ${summary.totalCount} transaksi`}
          icon={<CreditCard className="w-5 h-5" />}
          variant="primary"
        />
      </div>

      {/* DataTable Card */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Daftar Tagihan & Invoice</CardTitle>
            <CardDescription>
              Klik tombol invoice untuk melihat rincian pembayaran atau kuitansi untuk bukti pembayaran sah.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={data}
            isLoading={loading}
            searchable
            searchPlaceholder="Cari nomor permohonan / layanan..."
            emptyMessage="Belum ada catatan tagihan pembayaran."
          />
        </CardContent>
      </Card>

      {/* PDF Preview Modal */}
      {PdfPreviewModal}
    </div>
  )
}

export default PembayaranPage