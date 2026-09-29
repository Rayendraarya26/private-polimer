import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import api from "../../utils/api"
import toast from "react-hot-toast"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PermohonanDetail {
  permohonan: any
  formData: any
  lingkup: any
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook 1: useDetailPermohonan
 *
 * Bertanggung jawab atas:
 * - Fetching & caching data permohonan (dua endpoint: permohonan + sertifikasi)
 * - State data: permohonan, formData, lingkup, loading
 * - State modal: reject penawaran & persetujuan temuan tahap 1
 * - Handler aksi API: TTE invoice/kuitansi, approval penawaran, simulasi bayar,
 *   approve temuan tahap 1
 *
 * @param id  - ID permohonan dari URL params
 */
export const useDetailPermohonan = (id: string | undefined) => {
  const queryClient = useQueryClient()

  // ── Data state ────────────────────────────────────────────────────────────
  const [loading, setLoading]       = useState<boolean>(true)
  const [permohonan, setPermohonan] = useState<any>(null)
  const [formData, setFormData]     = useState<any>(null)
  const [lingkup, setLingkup]       = useState<any>(null)

  // ── Loading / submitting flags ────────────────────────────────────────────
  const [requestingTte, setRequestingTte]       = useState<"invoice" | "kuitansi" | null>(null)
  const [approvalLoading, setApprovalLoading]   = useState<boolean>(false)
  const [bayarLoading, setBayarLoading]         = useState<boolean>(false)
  const [temuanSubmitting, setTemuanSubmitting] = useState<boolean>(false)

  // ── Modal: Reject / Negosiasi Penawaran Biaya ─────────────────────────────
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false)
  const [rejectCatatan, setRejectCatatan]     = useState<string>("")

  // ── Modal: Setujui Temuan & Upload Berkas Perbaikan Tahap 1 ───────────────
  const [showTemuanModal, setShowTemuanModal] = useState<boolean>(false)
  const [temuanCatatan, setTemuanCatatan]     = useState<string>("")
  const [temuanFile, setTemuanFile]           = useState<File | null>(null)

  // ── Fetch data ────────────────────────────────────────────────────────────

  /**
   * Mengambil detail permohonan dari dua endpoint (permohonan + sertifikasi)
   * dan menggabungkan hasilnya. Memanfaatkan React Query sebagai in-memory cache
   * untuk menampilkan data lama secara instan sambil menyegarkan di background.
   */
  const fetchData = async () => {
    if (!id) return

    try {
      // Tampilkan data cache dulu jika ada (UX: instant paint)
      const cached = queryClient.getQueryData<PermohonanDetail>(["permohonanDetail", id])
      if (cached) {
        setPermohonan(cached.permohonan)
        setFormData(cached.formData)
        setLingkup(cached.lingkup)
        setLoading(false)
      } else {
        setLoading(true)
      }

      let detailData: any = null
      let formDetail: any = null

      // Endpoint utama: permohonan
      try {
        const res = await api.get(`/eksternal/permohonan/${id}`)
        detailData = res?.data?.results?.detail || res?.data?.data || res?.data
        formDetail = detailData?.form_data
      } catch (permohonanErr) {
        console.warn("Mencoba fallback endpoint sertifikasi:", permohonanErr)
      }

      // Endpoint fallback/enrichment: sertifikasi
      try {
        const certRes = await api.get(`/eksternal/sertifikasi/${id}`)
        const cData = certRes?.data?.data || certRes?.data?.results
        if (cData?.permohonan) {
          detailData = { ...detailData, ...cData.permohonan }
        }
        if (cData?.form) {
          formDetail = { ...formDetail, ...cData.form }
        }
      } catch {
        // Endpoint sertifikasi opsional — abaikan error
      }

      if (detailData) {
        const finalForm   = formDetail || detailData?.form_data
        const finalLingkup = detailData?.lingkup_layanan

        setPermohonan(detailData)
        setFormData(finalForm)
        setLingkup(finalLingkup)

        // Simpan ke cache React Query
        queryClient.setQueryData(["permohonanDetail", id], {
          permohonan: detailData,
          formData: finalForm,
          lingkup: finalLingkup,
        } satisfies PermohonanDetail)
      } else if (!cached) {
        toast.error("Data permohonan tidak ditemukan")
      }
    } catch (err: any) {
      console.error("Gagal memuat detail permohonan:", err)
      toast.error("Gagal memuat detail permohonan")
    } finally {
      setLoading(false)
    }
  }

  // Muat data saat id berubah
  useEffect(() => {
    fetchData()
  }, [id])

  // ── Handlers: TTE BSrE ────────────────────────────────────────────────────

  const handleRequestTteInvoice = async () => {
    if (!id) return
    try {
      setRequestingTte("invoice")
      const res = await api.post(`/eksternal/permohonan/${id}/request-tte-invoice`)
      toast.success(res?.data?.message || "Permintaan TTE BSrE Invoice telah dikirim ke Bendahara.")
      setPermohonan((prev: any) => ({ ...prev, tte_invoice_requested: true }))
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengajukan permintaan TTE Invoice")
    } finally {
      setRequestingTte(null)
    }
  }

  const handleRequestTteKuitansi = async () => {
    if (!id) return
    try {
      setRequestingTte("kuitansi")
      const res = await api.post(`/eksternal/permohonan/${id}/request-tte-kuitansi`)
      toast.success(res?.data?.message || "Permintaan TTE BSrE Kuitansi telah dikirim ke Bendahara.")
      setPermohonan((prev: any) => ({ ...prev, tte_kuitansi_requested: true }))
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengajukan permintaan TTE Kuitansi")
    } finally {
      setRequestingTte(null)
    }
  }

  // ── Handler: Approval Penawaran Biaya ─────────────────────────────────────

  /**
   * Mengirim persetujuan atau penolakan/negosiasi terhadap penawaran biaya.
   * Secara otomatis menutup modal reject dan mereset catatan setelah berhasil.
   */
  const handleApprovalPenawaran = async (keputusan: "SETUJU" | "TOLAK") => {
    if (!id) return
    try {
      setApprovalLoading(true)
      const res = await api.post(`/eksternal/sertifikasi/${id}/approval-penawaran`, {
        keputusan,
        catatan: keputusan === "TOLAK" ? rejectCatatan : null,
      })
      toast.success(
        res?.data?.message ||
        (keputusan === "SETUJU"
          ? "Penawaran biaya berhasil disetujui."
          : "Tanggapan penawaran biaya berhasil dikirimkan.")
      )
      setShowRejectModal(false)
      setRejectCatatan("")
      await fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal memproses persetujuan penawaran biaya")
    } finally {
      setApprovalLoading(false)
    }
  }

  // ── Handler: Simulasi Bayar (mode testing) ────────────────────────────────

  const handleSimulasiBayar = async () => {
    if (!id) return
    const confirmed = window.confirm(
      "Konfirmasi simulasi pembayaran untuk pengujian?\n\n" +
      "Permohonan akan berstatus LUNAS, Kuitansi Digital terbit otomatis, " +
      "dan status LUNAS disinkronkan ke SIS."
    )
    if (!confirmed) return

    try {
      setBayarLoading(true)
      const res = await api.post(`/eksternal/sertifikasi/${id}/simulasi-bayar`)
      toast.success(res?.data?.message || "Simulasi pembayaran berhasil! Status kini LUNAS.")
      await fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal melakukan simulasi pembayaran")
    } finally {
      setBayarLoading(false)
    }
  }

  // ── Handler: Approve Temuan & Upload Berkas Perbaikan Tahap 1 ─────────────

  /**
   * Mengirim persetujuan temuan beserta berkas perbaikan (multipart/form-data)
   * ke endpoint SIS. Modal ditutup dan state direset setelah berhasil.
   */
  const handleApproveTemuanTahap1 = async () => {
    if (!id) return
    try {
      setTemuanSubmitting(true)

      const formDataToSend = new FormData()
      formDataToSend.append("status", "setuju")
      if (temuanCatatan.trim()) {
        formDataToSend.append("catatan", temuanCatatan)
      }
      if (temuanFile) {
        formDataToSend.append("file_perbaikan", temuanFile)
      }

      const res = await api.post(
        `/eksternal/sertifikasi/${id}/approve-temuan-tahap1`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      toast.success(
        res?.data?.message ||
        "Persetujuan & berkas perbaikan temuan berhasil dikirim ke Tim Auditor."
      )
      setShowTemuanModal(false)
      setTemuanCatatan("")
      setTemuanFile(null)
      await fetchData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengirim persetujuan temuan")
    } finally {
      setTemuanSubmitting(false)
    }
  }

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    // Data
    loading,
    permohonan,
    formData,
    lingkup,
    refetch: fetchData,

    // Loading flags
    requestingTte,
    approvalLoading,
    bayarLoading,
    temuanSubmitting,

    // Modal: Reject Penawaran
    showRejectModal,
    setShowRejectModal,
    rejectCatatan,
    setRejectCatatan,

    // Modal: Temuan Tahap 1
    showTemuanModal,
    setShowTemuanModal,
    temuanCatatan,
    setTemuanCatatan,
    temuanFile,
    setTemuanFile,

    // Handlers
    handleRequestTteInvoice,
    handleRequestTteKuitansi,
    handleApprovalPenawaran,
    handleSimulasiBayar,
    handleApproveTemuanTahap1,
  }
}