import React, { useCallback, useState, useEffect } from "react"
import {
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react"
import Swal from "sweetalert2"
import api from "../utils/api"
import { Button } from "../components/ui/Button"

interface PreviewState {
  isOpen: boolean
  title: string
  filename: string
  blobUrl: string | null
  loading: boolean
}

export function usePembayaran() {
  const [previewState, setPreviewState] = useState<PreviewState>({
    isOpen: false,
    title: "",
    filename: "",
    blobUrl: null,
    loading: false,
  })

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  // Tutup modal preview dan bersihkan memory blob URL
  const closePreview = useCallback(() => {
    setIsFullscreen(false)
    setPreviewState((prev) => {
      if (prev.blobUrl) {
        window.URL.revokeObjectURL(prev.blobUrl)
      }
      return {
        isOpen: false,
        title: "",
        filename: "",
        blobUrl: null,
        loading: false,
      }
    })
  }, [])

  // Keyboard shortcut listener (Escape to close) & lock background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && previewState.isOpen) {
        if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          closePreview()
        }
      }
    }

    if (previewState.isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [previewState.isOpen, isFullscreen, closePreview])

  // Fungsi untuk mengambil PDF dan membuka modal pratinjau
  const fetchAndOpenPdf = useCallback(
    async (url: string, title: string, filename?: string) => {
      const docFilename = filename || `${title}.pdf`

      // Buka modal dengan status loading terlebih dahulu
      setPreviewState({
        isOpen: true,
        title,
        filename: docFilename,
        blobUrl: null,
        loading: true,
      })

      try {
        const response = await api.get(url, { responseType: "blob" })
        const blob = new Blob([response.data], { type: "application/pdf" })
        const blobUrl = window.URL.createObjectURL(blob)

        setPreviewState({
          isOpen: true,
          title,
          filename: docFilename,
          blobUrl,
          loading: false,
        })
      } catch (error: any) {
        console.error(`Gagal memuat ${title}:`, error)
        closePreview()

        Swal.fire({
          icon: "error",
          title: "Gagal Membuka Dokumen",
          text:
            error.response?.status === 403
              ? "Anda tidak memiliki izin untuk melihat dokumen ini."
              : `Dokumen ${title} belum dapat dimuat atau terjadi gangguan koneksi.`,
          confirmButtonColor: "#0270c7",
        })
      }
    },
    [closePreview]
  )

  const openInvoice = useCallback(
    (item: any) => {
      if (!item?.id) return
      const filename = `Invoice-${item.no_permohonan || item.id}.pdf`
      fetchAndOpenPdf(`/eksternal/pembayaran/${item.id}/stream-invoice`, "Invoice", filename)
    },
    [fetchAndOpenPdf]
  )

  const openKuitansi = useCallback(
    (item: any) => {
      if (!item?.id) return
      const filename = `Kuitansi-${item.no_permohonan || item.id}.pdf`
      fetchAndOpenPdf(`/eksternal/pembayaran/${item.id}/stream-kuitansi`, "Kuitansi", filename)
    },
    [fetchAndOpenPdf]
  )

  const openLhu = useCallback(
    (item?: any) => {
      const permohonanId = item?.id || (typeof item === "string" ? item : "default")
      const noPermohonan = item?.no_permohonan || item?.no_order || item?.kode_order || "SNI-06-0001"
      const filename = `LHU-${noPermohonan}.pdf`
      fetchAndOpenPdf(
        `/eksternal/sertifikasi/preview-hasil-uji/${permohonanId}`,
        "Laporan Hasil Pengujian (LHU)",
        filename
      )
    },
    [fetchAndOpenPdf]
  )

  const onDownloadCertificate = useCallback(
    (id: any) => {
      const permohonanId = typeof id === "object" ? id?.id : id
      if (!permohonanId) return
      fetchAndOpenPdf(
        `/eksternal/sertifikasi/${permohonanId}/download-sertifikat`,
        "Sertifikat Produk & Sistem SNI",
        `Sertifikat-${permohonanId}.pdf`
      )
    },
    [fetchAndOpenPdf]
  )

  // Download manual ketika tombol 'Unduh PDF' diklik dari dalam modal
  const handleDownload = useCallback(() => {
    if (!previewState.blobUrl) return
    const link = document.createElement("a")
    link.href = previewState.blobUrl
    link.download = previewState.filename || "Dokumen.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [previewState.blobUrl, previewState.filename])

  // Buka di tab baru jika user menginginkan view layar penuh terpisah
  const handleOpenNewTab = useCallback(() => {
    if (!previewState.blobUrl) return
    window.open(previewState.blobUrl, "_blank")
  }, [previewState.blobUrl])

  // Komponen Modal Pratinjau PDF yang proporsional dengan overlay latar belakang hitam
  const PdfPreviewModal = previewState.isOpen ? (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isFullscreen ? "p-0" : "p-3 sm:p-4 md:p-6"
      } animate-in fade-in duration-150`}
    >
      {/* Backdrop Overlay Hitam */}
      <div
        className="fixed inset-0 transition-opacity"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(2px)" }}
        onClick={closePreview}
      />

      {/* Modal Dialog Box - Lebar standar (880px) & Tinggi proporsional (82vh) */}
      <div
        className={`relative bg-white ${
          isFullscreen ? "rounded-none border-0" : "rounded-2xl border border-slate-200/90 shadow-2xl"
        } overflow-hidden flex flex-col z-10 transition-all duration-150`}
        style={{
          width: isFullscreen ? "100vw" : "min(880px, 94vw)",
          height: isFullscreen ? "100vh" : "82vh",
          minHeight: isFullscreen ? "100vh" : "520px",
          maxHeight: isFullscreen ? "100vh" : "84vh",
        }}
      >
        {/* Compact Header Toolbar (48px) */}
        <div
          className="px-4 md:px-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0"
          style={{ height: "48px", minHeight: "48px" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Pratinjau {previewState.title}
              </h3>
              <p className="text-[10px] text-slate-500 truncate font-mono hidden sm:block">
                {previewState.filename}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {!previewState.loading && previewState.blobUrl && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hidden sm:inline-flex px-2 text-slate-600 hover:text-slate-900"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? "Kecilkan Tampilan" : "Layar Penuh"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  onClick={handleOpenNewTab}
                  title="Buka dokumen di tab browser baru"
                >
                  Tab Baru
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={handleDownload}
                >
                  Unduh PDF
                </Button>
              </>
            )}
            <button
              onClick={closePreview}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-0.5"
              title="Tutup Pratinjau (Esc)"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Full-Height PDF Viewer Container */}
        <div
          className="w-full bg-slate-100 p-0 relative overflow-hidden flex flex-col"
          style={{
            height: "calc(100% - 48px)",
            minHeight: "calc(100% - 48px)",
            flex: "1 1 auto",
          }}
        >
          {previewState.loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-500 py-28">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
              <p className="text-xs sm:text-sm font-medium">
                Menyiapkan pratinjau dokumen {previewState.title}...
              </p>
            </div>
          ) : previewState.blobUrl ? (
            <object
              data={`${previewState.blobUrl}#view=FitH`}
              type="application/pdf"
              style={{
                width: "100%",
                height: "100%",
                minHeight: "100%",
                border: "none",
                display: "block",
              }}
            >
              <iframe
                src={`${previewState.blobUrl}#view=FitH`}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "100%",
                  border: "none",
                  display: "block",
                }}
                title={previewState.title}
              />
            </object>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 py-16">
              <p className="text-xs">Dokumen tidak dapat ditampilkan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null

  return {
    loading: previewState.loading,
    openInvoice,
    openKuitansi,
    openLhu,
    onDownloadCertificate,
    fetchAndOpenPdf,
    closePreview,
    PdfPreviewModal,
  }
}

export default usePembayaran