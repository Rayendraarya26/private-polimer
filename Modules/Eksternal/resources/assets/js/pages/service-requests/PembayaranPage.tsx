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
  kuitansi_number?: string | null
  kuitansi_file?: string | null
}

const PembayaranPage: React.FC = () => {
  const [data, setData] = useState<PembayaranItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

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
        kuitansi_number: item.kuitansi_number || null,
        kuitansi_file: item.kuitansi_file || null,
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
      header: "Aksi / Dokumen",
      className: "text-right",
      headerClassName: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Receipt className="w-3.5 h-3.5" />}
            onClick={() => openInvoice(row)}
          >
            Invoice
          </Button>

          <Button
            size="sm"
            variant={row.status_bayar === "LUNAS" ? "success" : "secondary"}
            leftIcon={<FileCheck className="w-3.5 h-3.5" />}
            onClick={() => {
              if (row.status_bayar !== "LUNAS" && !row.kuitansi_file) {
                showInfo(
                  "Kuitansi Belum Tersedia",
                  "Kuitansi resmi bertanda tangan elektronik akan diterbitkan otomatis setelah pembayaran lunas terverifikasi."
                )
                return
              }
              openKuitansi(row)
            }}
          >
            Kuitansi
          </Button>
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