import { useCallback, useState } from "react"
import Swal from "sweetalert2"
// Pastikan import instance api sesuai dengan struktur folder
import api from "../utils/api" 

export default function usePembayaran() {
  const [loading, setLoading] = useState(false)

  // Fungsi helper untuk mengambil PDF via Axios (dengan token) lalu membukanya
  const fetchAndOpenPdf = async (url: string, title: string) => {
    try {
      setLoading(true)
      
      // Tampilkan loading state agar user tahu proses sedang berjalan
      Swal.fire({
        title: `Memuat ${title}...`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      // Gunakan responseType 'blob' agar Axios membaca response sebagai file binary
      const response = await api.get(url, { responseType: 'blob' })
      
      // Buat URL lokal sementara (Blob URL) dari response data
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const blobUrl = window.URL.createObjectURL(blob)

      // Tutup loading dan buka file di tab baru
      Swal.close()
      window.open(blobUrl, "_blank")

      // Opsional: Hapus blob URL setelah beberapa saat untuk melegakan memori browser
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000)

    } catch (error: any) {
      console.error(`Gagal memuat ${title}:`, error)
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.status === 403 
          ? "Anda tidak memiliki akses untuk membuka dokumen ini." 
          : `Terjadi kesalahan saat memuat dokumen ${title}.`,
      })
    } finally {
      setLoading(false)
    }
  }

  const openInvoice = useCallback((item: any) => {
    if (!item?.invoice_file) {
      Swal.fire({
        icon: "info",
        title: "Invoice belum tersedia",
        text: "Silakan tunggu hingga invoice diproses oleh sistem",
      })
      return
    }

    // Panggil helper fetch Blob (Sesuaikan path endpoint dengan route API Laravel)
    fetchAndOpenPdf(`/eksternal/pembayaran/${item.id}/stream-invoice`, 'Invoice')
  }, [])

    const openKuitansi = useCallback((item: any) => {

    if (!item?.kuitansi_file) {
      Swal.fire({
        icon: "info",
        title: "Kuitansi belum tersedia",
        text: "Kuitansi akan muncul setelah pembayaran diproses",
      })
      return
    }
    // LANGSUNG BUKA TANPA SWEETALERT
    window.open(`/storage/${item.kuitansi_file}`, "_blank")
  }, [])

  return {
    loading,
    setLoading,
    openInvoice,
    openKuitansi
  }
}