import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Download,
  Calendar,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import api from "../../utils/api"
import { getDateDisplay } from "../../utils/date"
import { getFilenameFromContentDisposition } from "../../utils/common"
import { FeedbackItemStatusOrder, SertifikatItem } from "../../types/feedbacks"
import useDashboard from "../../hooks/useDashboard"
import useFeedbacks from "../../hooks/feedback/useFeedbacks"
import usePelatihan from "../../hooks/service-requests/usePelatihan"
import { useLSP } from "../../hooks/service-requests/useLSP"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { StatsCard } from "../../components/ui/StatsCard"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { Modal } from "../../components/ui/Modal"

const currentYear = new Date().getFullYear()

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    loading,
    statisticData,
    sliders,
    getStatisticData,
    getSliders,
    ajukanPermohonan,
    submittedIds,
  } = useDashboard()

  const { deletePelatihan } = usePelatihan()
  const { deleteLSP } = useLSP()

  const {
    loading: loadingHistory,
    data,
    page,
    total,
    totalPages,
    status,
    getFeedbacks,
    setPage,
    changeStatus,
  } = useFeedbacks({ useLoadMore: true })

  const [modalFile, setModalFile] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [selectedStatisticYear, setSelectedStatisticYear] = useState<number>(currentYear)

  useEffect(() => {
    getSliders()
  }, [])

  useEffect(() => {
    getFeedbacks()
  }, [page, status])

  useEffect(() => {
    getStatisticData(selectedStatisticYear)
  }, [selectedStatisticYear])

  // Auto rotate banner carousel
  useEffect(() => {
    if (!sliders || sliders.length <= 1) return
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliders.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [sliders])

  const getFileUrl = (path: string) => {
    if (!path) return ""
    if (path.startsWith("http")) return path
    return `${window.location.origin}/storage/${path}`
  }

  const handleCatatanClick = (value: string) => {
    if (!value) return
    const isFile =
      value.includes("/") ||
      value.includes(".pdf") ||
      value.includes(".png") ||
      value.includes(".jpg")
    if (isFile) {
      setModalFile(value)
      setShowModal(true)
    }
  }

  const onDownloadCertificate = useCallback(async (data: SertifikatItem) => {
    if (!data) return
    const toastId = toast.loading("Mengunduh sertifikat...")
    try {
      const res = await api.get(data.download_link, { responseType: "blob" })
      const blob = new Blob([res.data], { type: res?.headers?.["content-type"] })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const filename = getFilenameFromContentDisposition(res?.headers?.["content-disposition"] || "")
      if (filename) link.download = filename
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(url)
      link.parentNode?.removeChild(link)
    } catch (error) {
      const err = error as AxiosError
      if (err?.response?.headers["content-type"] === "application/json") {
        const reader = new FileReader()
        reader.readAsText(err?.response?.data as Blob)
        reader.onload = () => {
          const errorData = JSON.parse(reader.result as string)
          toast.error(errorData?.message || "Gagal mengunduh berkas")
        }
      }
    } finally {
      toast.remove(toastId)
    }
  }, [])

  const onReapply = async (item: any) => {
    const confirmAjukan = confirm(`Yakin ingin mengajukan ulang permohonan ${item.kode_order}?`)
    if (!confirmAjukan) return
    const toastId = toast.loading("Mengajukan ulang permohonan...")
    try {
      await api.post(`/eksternal/pelatihan/${item.id}/ajukan-ulang`)
      toast.success("Permohonan berhasil diajukan ulang")
      getFeedbacks()
    } catch (error: any) {
      const message = error?.response?.data?.message || "Gagal mengajukan ulang permohonan"
      toast.error(message)
    } finally {
      toast.remove(toastId)
    }
  }

  const onDelete = async (item: any) => {
    const isLSP =
      item.layanan_slug?.includes("lsp") || item.layanan?.toLowerCase().includes("lsp")
    if (isLSP) {
      await deleteLSP(item, getFeedbacks)
      return
    }
    await deletePelatihan(item, getFeedbacks)
  }

  const statisticYearOptions = useMemo<number[]>(
    () => [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4],
    []
  )

  const historyStatusOptions = useMemo(
    () => [
      { value: undefined, label: "Semua Status" },
      { value: FeedbackItemStatusOrder.DRAFT, label: "Draft" },
      { value: FeedbackItemStatusOrder.PERMOHONAN, label: "Permohonan Masuk" },
      { value: FeedbackItemStatusOrder.REVISI, label: "Revisi Berkas" },
      { value: FeedbackItemStatusOrder.IN_REVIEW, label: "Dalam Review" },
      { value: FeedbackItemStatusOrder.PEMBAYARAN, label: "Menunggu Pembayaran" },
      { value: FeedbackItemStatusOrder.PROCESS, label: "Dalam Pengujian" },
      { value: FeedbackItemStatusOrder.DONE, label: "Selesai" },
    ],
    []
  )

  const getStatusBadge = (orderStatus: FeedbackItemStatusOrder | string) => {
    switch (orderStatus) {
      case FeedbackItemStatusOrder.DONE:
        return <Badge variant="success" dot>Selesai</Badge>
      case FeedbackItemStatusOrder.PROCESS:
        return <Badge variant="info" dot>Dalam Proses</Badge>
      case FeedbackItemStatusOrder.PEMBAYARAN:
        return <Badge variant="warning" dot>Menunggu Pembayaran</Badge>
      case FeedbackItemStatusOrder.REVISI:
        return <Badge variant="danger" dot>Perlu Revisi</Badge>
      case FeedbackItemStatusOrder.IN_REVIEW:
        return <Badge variant="primary" dot>Dalam Review</Badge>
      case FeedbackItemStatusOrder.DRAFT:
        return <Badge variant="neutral">Draft</Badge>
      default:
        return <Badge variant="neutral">{orderStatus || 'Permohonan'}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Head title="Dashboard Pelanggan" />

      {/* Top Banner Slider */}
      {sliders.length > 0 && (
        <div className="relative w-full rounded-2xl overflow-hidden shadow-soft border border-slate-200/80 bg-slate-900 aspect-[21/6] max-h-72">
          {sliders.map((r, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                i === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={r.image}
                alt={r.description || "Banner BBKKP"}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 sm:p-8">
                {r.description && (
                  <div className="text-white max-w-xl space-y-1">
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2">
                      {r.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Slider Indicators */}
          {sliders.length > 1 && (
            <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
              {sliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeSlide ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Actions & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Portal Layanan Pelanggan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola pengajuan permohonan pengujian laboratorium, kalibrasi, pelatihan, dan sertifikasi industri.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate("/service-requests/input")}
        >
          Ajukan Permohonan Baru
        </Button>
      </div>

      {/* Statistics Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Statistik Permohonan
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatisticYear}
              disabled={loading.statistic}
              onChange={(e) => setSelectedStatisticYear(parseInt(e.target.value))}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
            >
              {statisticYearOptions.map((year) => (
                <option key={year} value={year}>
                  Tahun {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatsCard
            title="Total Permohonan"
            value={statisticData?.total_all || 0}
            icon={<FileText className="w-5 h-5" />}
            variant="primary"
          />
          <StatsCard
            title="Belum Dibayar"
            value={statisticData?.total_pembayaran || 0}
            icon={<CreditCard className="w-5 h-5" />}
            variant="warning"
          />
          <StatsCard
            title="Dalam Proses"
            value={statisticData?.total_proses || 0}
            icon={<Clock className="w-5 h-5" />}
            variant="default"
          />
          <StatsCard
            title="Selesai / Terbit"
            value={statisticData?.total_selesai || 0}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="success"
          />
          <StatsCard
            title="Ditolak / Draf"
            value={statisticData?.total_ditolak || 0}
            icon={<XCircle className="w-5 h-5" />}
            variant="danger"
          />
        </div>
      </div>

      {/* Riwayat Permohonan Section */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle>Riwayat Permohonan Terkini</CardTitle>
            <CardDescription>
              Menampilkan {data.length} dari total {total} permohonan
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={status || ""}
              onChange={(e) =>
                changeStatus((e.target.value || undefined) as FeedbackItemStatusOrder | undefined)
              }
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {historyStatusOptions.map((opt, i) => (
                <option key={i} value={opt.value || ""}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3">Kode Order</th>
                  <th className="px-5 py-3">Jenis Layanan</th>
                  <th className="px-5 py-3">Tanggal Pengajuan</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingHistory ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Memuat riwayat permohonan...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      Belum ada riwayat permohonan layanan.
                    </td>
                  </tr>
                ) : (
                  data.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {item.kode_order || item.nomor_order || `#${item.id}`}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-slate-800 block">
                          {item.layanan || item.nama_layanan || 'Uji & Kalibrasi'}
                        </span>
                        {item.komoditi && (
                          <span className="text-[11px] text-slate-500 block">{item.komoditi}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {getDateDisplay(item.tanggal_order || item.created_at || item.tanggal_permohonan)}
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(item.status_order || item.status)}
                      </td>
                      <td className="px-5 py-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* Detail / Tracking */}
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => navigate(`/permohonan/detail/${item.id}`)}
                        >
                          Detail
                        </Button>

                        {/* Download Certificate if Done */}
                        {item.sertifikat && (
                          <Button
                            variant="success"
                            size="sm"
                            leftIcon={<Download className="w-3.5 h-3.5" />}
                            onClick={() => onDownloadCertificate(item.sertifikat)}
                          >
                            Sertifikat
                          </Button>
                        )}

                        {/* Reapply if rejected */}
                        {item.status_order === FeedbackItemStatusOrder.REVISI && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                            onClick={() => onReapply(item)}
                          >
                            Ajukan Ulang
                          </Button>
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

      {/* Modal File Viewer */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Pratinjau Berkas"
        size="lg"
      >
        {modalFile && (
          <div className="w-full h-96 flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden">
            {modalFile.endsWith(".pdf") ? (
              <iframe
                src={getFileUrl(modalFile)}
                className="w-full h-full border-0"
                title="Preview PDF"
              />
            ) : (
              <img
                src={getFileUrl(modalFile)}
                alt="Preview Document"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default memo(DashboardPage)
