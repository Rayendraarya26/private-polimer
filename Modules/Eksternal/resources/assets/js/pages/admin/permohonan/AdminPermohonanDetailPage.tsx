import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  XCircle,
  UserCheck,
  FileText,
  Download,
  Building2,
  Mail,
  Phone,
  Calendar,
  Layers,
  FileCheck2,
  Clock,
  ExternalLink,
  Loader2,
  PackageCheck,
  Factory,
  CreditCard,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  Globe,
  MapPin,
  Send,
} from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { AdminApprovalModal } from "../../../components/admin/AdminApprovalModal"
import { usePembayaran } from "../../../hooks/usePembayaran"
import api from "../../../utils/api"
import toast from "react-hot-toast"

export const AdminPermohonanDetailPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { openInvoice, openKuitansi, openLhu, PdfPreviewModal } = usePembayaran()

  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<
    "overview" | "komoditas" | "pabrik" | "dokumen" | "keuangan" | "tte" | "integrasi"
  >("overview")

  const [permohonan, setPermohonan] = useState<any>(null)
  const [formData, setFormData] = useState<any>(null)
  const [lingkup, setLingkup] = useState<any>(null)

  // Bendahara TTE States
  const [passphraseInvoice, setPassphraseInvoice] = useState("")
  const [signingInvoice, setSigningInvoice] = useState(false)
  const [passphraseKuitansi, setPassphraseKuitansi] = useState("")
  const [signingKuitansi, setSigningKuitansi] = useState(false)

  // SIS Sync State
  const [syncingSis, setSyncingSis] = useState(false)

  const [modalState, setModalState] = useState<{
    show: boolean
    action: "approve" | "revisi" | "reject" | "disposisi" | null
  }>({ show: false, action: null })

  const fetchDetail = async () => {
    if (!id) return
    try {
      setLoading(true)
      const res = await api.get(`/eksternal/permohonan/${id}`)
      const detail = res?.data?.results?.detail
      setPermohonan(detail)
      setFormData(detail?.form_data)
      setLingkup(detail?.lingkup_layanan)

      // If it's a sertifikasi form, also fetch items & factories
      if (detail?.formable_type?.toLowerCase().includes("sertifikasi")) {
        try {
          const certRes = await api.get(`/eksternal/sertifikasi/${id}`)
          if (certRes?.data?.data?.form) {
            setFormData(certRes.data.data.form)
          }
        } catch (e) {
          console.error("Gagal load detail sertifikasi:", e)
        }
      }
    } catch (err: any) {
      console.error("Gagal memuat detail permohonan:", err)
      toast.error("Gagal memuat detail permohonan")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  const handleSignInvoiceTte = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passphraseInvoice) {
      toast.error("Passphrase BSrE Bendahara wajib diisi")
      return
    }
    setSigningInvoice(true)
    try {
      const res = await api.post(`/permohonan/layanan/${id}/approval-invoice`, {
        passphrase: passphraseInvoice,
      })
      toast.success(res?.data?.message || "Invoice berhasil ditandatangani secara elektronik (TTE BSrE)")
      setPassphraseInvoice("")
      fetchDetail()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal menandatangani Invoice TTE")
    } finally {
      setSigningInvoice(false)
    }
  }

  const handleSignKuitansiTte = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passphraseKuitansi) {
      toast.error("Passphrase BSrE Bendahara wajib diisi")
      return
    }
    setSigningKuitansi(true)
    try {
      const res = await api.post(`/permohonan/layanan/${id}/approval-kuitansi-tte`, {
        passphrase: passphraseKuitansi,
      })
      toast.success(res?.data?.message || "Kuitansi berhasil ditandatangani secara elektronik (TTE BSrE)")
      setPassphraseKuitansi("")
      fetchDetail()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal menandatangani Kuitansi TTE")
    } finally {
      setSigningKuitansi(false)
    }
  }

  const handleManualSyncSis = async () => {
    setSyncingSis(true)
    try {
      const res = await api.post(`/integrasi/sync-manual-sis/${id}`)
      toast.success(res?.data?.message || "Sinkronisasi ke SIS berhasil dijalankan.")
      fetchDetail()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Sinkronisasi ke SIS gagal")
    } finally {
      setSyncingSis(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <span className="text-xs font-medium text-slate-500">Memuat detail berkas permohonan...</span>
      </div>
    )
  }

  const noOrder = permohonan?.no_permohonan || permohonan?.kode_order || `#REQ-${id}`
  const rawPermohonan = permohonan?.permohonan || permohonan
  const namaPelanggan = formData?.nama_perusahaan || formData?.nama_lengkap || formData?.nama_instansi || permohonan?.creator?.name || "Pelanggan"
  const alamat = formData?.alamat_kantor || formData?.alamat_instansi || formData?.alamat || "-"
  const kontakPic = formData?.kontak_person || formData?.nama_pic || formData?.nama_lengkap || permohonan?.creator?.name || "-"
  const phone = formData?.no_whatsapp || formData?.no_telp || formData?.no_hp || permohonan?.creator?.no_hp || "-"
  const email = formData?.email || permohonan?.creator?.email || "-"
  const layananName = lingkup?.lingkup || (noOrder.startsWith("CERT") ? "Sertifikasi Produk & Sistem (LSPro)" : "Layanan BBKKP")

  const items = formData?.items || []
  const pabriks = formData?.pabrik || []
  const pembayarans = permohonan?.pembayaran || rawPermohonan?.detail_pembayaran || []
  const totalBiaya = pembayarans.reduce((acc: number, curr: any) => acc + Number(curr.subtotal || 0), 0)

  const statusWorkflow = permohonan?.status_workflow || rawPermohonan?.status_workflow || "PERMOHONAN"
  const statusBayar = permohonan?.status_bayar || rawPermohonan?.status_bayar || "BELUM"

  const getWorkflowBadge = () => {
    switch (statusWorkflow) {
      case "DRAFT":
        return <Badge variant="secondary">Draft</Badge>
      case "PERMOHONAN":
        return <Badge variant="warning">Menunggu Verifikasi</Badge>
      case "REVISI":
        return <Badge variant="warning">Perlu Revisi</Badge>
      case "PEMBAYARAN":
        return <Badge variant="info">Menunggu Pembayaran</Badge>
      case "PROCESS":
        return <Badge variant="info">Sedang Diproses</Badge>
      case "DONE":
        return <Badge variant="success">Selesai</Badge>
      case "DITOLAK":
        return <Badge variant="danger">Ditolak</Badge>
      default:
        return <Badge variant="secondary">{statusWorkflow}</Badge>
    }
  }

  const getBayarBadge = () => {
    switch (statusBayar) {
      case "LUNAS":
        return <Badge variant="success">Lunas</Badge>
      case "BATAL":
        return <Badge variant="danger">Batal</Badge>
      default:
        return <Badge variant="warning">Belum Bayar</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Head title={`Detail Permohonan — ${noOrder}`} />

      {/* Top Header Navigation (3 Rows Layout) */}
      <div className="space-y-3 pb-4 border-b border-slate-200">
        {/* Row 1: Back Button */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/permohonan")}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Kembali
          </Button>
        </div>

        {/* Row 2: Detail Header (Title, Badges & Subtitle) */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{noOrder}</h1>
            {getWorkflowBadge()}
            {getBayarBadge()}
          </div>
          <p className="text-xs text-slate-500">
            {layananName} • Diajukan pada {permohonan?.created_at || "-"}
          </p>
        </div>

        {/* Row 3: Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
          {Boolean(rawPermohonan?.invoice_number || rawPermohonan?.invoice_file) && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FileText className="w-3.5 h-3.5 text-brand-600" />}
              onClick={() => openInvoice({ id, no_permohonan: noOrder })}
            >
              Pratinjau Invoice
            </Button>
          )}

          {Boolean(
            rawPermohonan?.has_lhu ||
              (Array.isArray(rawPermohonan?.file_attachment) &&
                rawPermohonan.file_attachment.some(
                  (f: any) => f.nama?.toLowerCase().includes("lhu") || f.kode === "LHU"
                ))
          ) && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />}
              onClick={() => openLhu({ id, no_permohonan: noOrder })}
            >
              Pratinjau LHU
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            leftIcon={<UserCheck className="w-3.5 h-3.5" />}
            onClick={() => setModalState({ show: true, action: "disposisi" })}
          >
            Disposisi Petugas
          </Button>

          {statusWorkflow === "PERMOHONAN" && (
            <>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-600" />}
                onClick={() => setModalState({ show: true, action: "revisi" })}
              >
                Minta Revisi
              </Button>
              <Button
                size="sm"
                variant="danger"
                leftIcon={<XCircle className="w-3.5 h-3.5" />}
                onClick={() => setModalState({ show: true, action: "reject" })}
              >
                Tolak
              </Button>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                onClick={() => setModalState({ show: true, action: "approve" })}
              >
                Verifikasi & Tetapkan Biaya
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-px" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`whitespace-nowrap py-2.5 px-3 border-b-2 font-medium text-xs rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "overview"
                ? "border-brand-600 text-brand-600 bg-brand-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Identitas & Pemohon</span>
          </button>

          {items.length > 0 && (
            <button
              onClick={() => setActiveTab("komoditas")}
              className={`whitespace-nowrap py-2.5 px-3 border-b-2 font-medium text-xs rounded-t-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "komoditas"
                  ? "border-brand-600 text-brand-600 bg-brand-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>Komoditas ({items.length})</span>
            </button>
          )}

          {pabriks.length > 0 && (
            <button
              onClick={() => setActiveTab("pabrik")}
              className={`whitespace-nowrap py-2.5 px-3 border-b-2 font-medium text-xs rounded-t-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "pabrik"
                  ? "border-brand-600 text-brand-600 bg-brand-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <Factory className="w-4 h-4" />
              <span>Lokasi Pabrik ({pabriks.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("keuangan")}
            className={`whitespace-nowrap py-2.5 px-3 border-b-2 font-medium text-xs rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "keuangan"
                ? "border-brand-600 text-brand-600 bg-brand-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Keuangan & Tagihan</span>
          </button>

          <button
            onClick={() => setActiveTab("tte")}
            className={`whitespace-nowrap py-2.5 px-3 border-b-2 font-medium text-xs rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "tte"
                ? "border-brand-600 text-brand-600 bg-brand-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>TTE Bendahara</span>
            {(rawPermohonan?.tte_invoice_requested || rawPermohonan?.tte_kuitansi_requested) && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("integrasi")}
            className={`whitespace-nowrap py-2.5 px-3 border-b-2 font-medium text-xs rounded-t-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "integrasi"
                ? "border-brand-600 text-brand-600 bg-brand-50/50"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Integrasi SIS & BSKJI</span>
          </button>
        </nav>
      </div>

      {/* TAB CONTENT: Overview (Identitas Pemohon) */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-600" />
                  <span>Identitas Pemohon / Perusahaan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Nama Pemohon / Perusahaan:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{namaPelanggan}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Email Akun:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{email}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Kontak PIC:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {kontakPic} ({phone})
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Nomor Akta / NIB:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {formData?.kuesioner_kelayakan?.nomor_akta_pendirian || formData?.nib || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Negara:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{formData?.negara || "Indonesia"}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Wilayah Administratif:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {formData?.kecamatan ? `Kec. ${formData.kecamatan}, ` : ""}
                    {formData?.kabupaten ? `${formData.kabupaten}, ` : ""}
                    {formData?.provinsi || "-"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-medium">Alamat Domisili Kantor:</span>
                  <p className="font-medium text-slate-700 mt-0.5">{alamat}</p>
                </div>
              </CardContent>
            </Card>

            {/* Informasi Sertifikasi Tambahan jika Sertifikasi */}
            {formData?.jenis_permohonan && (
              <Card>
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-600" />
                    <span>Parameter Sertifikasi Produk</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Jenis Permohonan:</span>
                    <p className="font-bold text-slate-800 mt-0.5 capitalize">{formData?.jenis_permohonan}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Tipe Sistem Sertifikasi:</span>
                    <p className="font-bold text-brand-700 mt-0.5">{formData?.sistem_sertifikasi || "Tipe 5 (SNI)"}</p>
                  </div>
                  {formData?.sertifikat_lama_nomor && (
                    <div className="sm:col-span-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-amber-700 font-medium">Sertifikat Lama (Resertifikasi):</span>
                      <p className="font-bold text-amber-900 mt-0.5">{formData?.sertifikat_lama_nomor}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Timeline & Quick Status Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Riwayat Status Permohonan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <div className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-brand-600 ring-4 ring-brand-100" />
                    <p className="text-xs font-bold text-slate-800">Permohonan Masuk</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Berkas berhasil diinput oleh pemohon</p>
                  </div>
                  {statusWorkflow === "PEMBAYARAN" && (
                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-purple-600 ring-4 ring-purple-100" />
                      <p className="text-xs font-bold text-slate-800">Invoice Diterbitkan</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Menunggu pembayaran BNI Virtual Account</p>
                    </div>
                  )}
                  {statusBayar === "LUNAS" && (
                    <div className="relative">
                      <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                      <p className="text-xs font-bold text-slate-800">Pembayaran Terverifikasi</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Kuitansi terbit & data disinkronkan ke SIS</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Komoditas */}
      {activeTab === "komoditas" && (
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-brand-600" />
              <span>Daftar Komoditi & Produk ({items.length} Item)</span>
            </CardTitle>
            <CardDescription className="text-xs">Rincian produk sertifikasi SPPT SNI yang diajukan pemohon.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-slate-100 text-xs">
            {items.map((it: any, idx: number) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{it.nama_produk}</span>
                    <Badge variant="outline">{it.standar_sni_iso || "SNI Standard"}</Badge>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Merk Dagang: <span className="font-semibold text-slate-700">{it.merk_dagang || "-"}</span> • Tipe/Jenis:{" "}
                    <span className="font-semibold text-slate-700">{it.tipe_jenis || "-"}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Estimasi Tarif SNI</span>
                  <span className="text-xs font-bold text-emerald-700">
                    Rp {Number(it.estimasi_tarif || 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB CONTENT: Pabrik */}
      {activeTab === "pabrik" && (
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm flex items-center gap-2">
              <Factory className="w-4 h-4 text-brand-600" />
              <span>Daftar Fasilitas & Lokasi Pabrik ({pabriks.length} Lokasi)</span>
            </CardTitle>
            <CardDescription className="text-xs">Lokasi fasilitas produksi yang menjadi objek audit sertifikasi.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {pabriks.map((pb: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{pb.nama_pabrik}</span>
                  <Badge variant="secondary">Pabrik #{idx + 1}</Badge>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{pb.alamat_pabrik}</p>
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>
                    <span>Karyawan:</span>
                    <p className="font-semibold text-slate-800">{pb.jumlah_karyawan || 0} orang</p>
                  </div>
                  <div>
                    <span>Kontak:</span>
                    <p className="font-semibold text-slate-800">{pb.kontak_pabrik || "-"}</p>
                  </div>
                  <div className="col-span-2">
                    <span>Email Pabrik:</span>
                    <p className="font-semibold text-slate-800">{pb.email_pabrik || "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB CONTENT: Keuangan & Tagihan */}
      {activeTab === "keuangan" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-600" />
                  <span>Rincian Biaya & Dokumen Penagihan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                {pembayarans.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {pembayarans.map((pb: any, idx: number) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-800">{pb.item_bayar || "Biaya Layanan"}</p>
                          <p className="text-slate-400 text-[11px]">Kuantitas: {pb.kuantitas || 1}</p>
                        </div>
                        <span className="font-bold text-slate-900 text-sm">
                          Rp {Number(pb.subtotal || 0).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                    <div className="pt-3 flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-900">Total Tagihan:</span>
                      <span className="font-extrabold text-brand-700 text-base">
                        Rp {totalBiaya.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>Biaya layanan belum ditetapkan oleh Tim Marketing.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dokumen Finansial Terbit */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span>Dokumen Finansial Terbit</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Invoice File Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Invoice Resmi</span>
                    <Badge variant={rawPermohonan?.invoice_number ? "success" : "secondary"}>
                      {rawPermohonan?.invoice_number ? "Terbit" : "Belum Terbit"}
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Nomor: <span className="font-semibold text-slate-800">{rawPermohonan?.invoice_number || "-"}</span>
                  </p>
                  {rawPermohonan?.invoice_number && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                      onClick={() => openInvoice({ id: rawPermohonan?.id || id, no_permohonan: noOrder })}
                    >
                      Buka PDF Invoice
                    </Button>
                  )}
                </div>

                {/* Kuitansi File Card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Kuitansi Pembayaran</span>
                    <Badge variant={statusBayar === "LUNAS" ? "success" : "secondary"}>
                      {statusBayar === "LUNAS" ? "Lunas" : "Belum Lunas"}
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Nomor: <span className="font-semibold text-slate-800">{rawPermohonan?.kuitansi_number || "-"}</span>
                  </p>
                  {statusBayar === "LUNAS" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                      onClick={() => openKuitansi({ id: rawPermohonan?.id || id, no_permohonan: noOrder })}
                    >
                      Buka PDF Kuitansi
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Virtual Account Info Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-600" />
                  <span>Virtual Account BNI</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Nomor BNI VA:</span>
                  <p className="text-base font-extrabold text-brand-700 tracking-wider mt-0.5">
                    {rawPermohonan?.va || "-"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Status VA:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{rawPermohonan?.va_status || "PENDING"}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Jatuh Tempo Pembayaran:</span>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {rawPermohonan?.va_expired_at
                      ? new Date(rawPermohonan.va_expired_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "14 Hari setelah terbit"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Panel TTE Bendahara */}
      {activeTab === "tte" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TTE INVOICE PANEL */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-brand-600" />
                  <span>TTE Invoice Elektronik (BSrE)</span>
                </CardTitle>
                <Badge variant={rawPermohonan?.pdf_tte ? "success" : rawPermohonan?.tte_invoice_requested ? "warning" : "secondary"}>
                  {rawPermohonan?.pdf_tte
                    ? "TTE BSrE Terverifikasi"
                    : rawPermohonan?.tte_invoice_requested
                    ? "Diminta Pemohon"
                    : "Standar Digital Seal"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Secara standar sistem menerbitkan invoice dengan Digital Seal. Jika pemohon membutuhkan TTE resmi Bendahara BSrE, masukkan passphrase Anda di bawah ini:
              </p>

              {rawPermohonan?.pdf_tte ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4" />
                    <span>TTE BSrE Telah Tersemat</span>
                  </div>
                  <p className="text-emerald-800 text-[11px]">ID Penandatanganan: {rawPermohonan?.pdf_tte}</p>
                </div>
              ) : (
                <form onSubmit={handleSignInvoiceTte} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800">Passphrase BSrE Bendahara</label>
                    <input
                      type="password"
                      required
                      value={passphraseInvoice}
                      onChange={(e) => setPassphraseInvoice(e.target.value)}
                      placeholder="Masukkan passphrase sertifikat elektronik..."
                      className="w-full mt-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    className="w-full"
                    isLoading={signingInvoice}
                    leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                  >
                    Tanda Tangani Invoice (TTE BSrE)
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* TTE KUITANSI PANEL */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <span>TTE Kuitansi Pembayaran (BSrE)</span>
                </CardTitle>
                <Badge variant={rawPermohonan?.kuitansi_pdf_tte ? "success" : rawPermohonan?.tte_kuitansi_requested ? "warning" : "secondary"}>
                  {rawPermohonan?.kuitansi_pdf_tte
                    ? "TTE BSrE Terverifikasi"
                    : rawPermohonan?.tte_kuitansi_requested
                    ? "Diminta Pemohon"
                    : "Standar Digital Seal"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Kuitansi otomatis terbit saat pembayaran lunas. Jika pemohon membutuhkan TTE BSrE Bendahara resmi:
              </p>

              {statusBayar !== "LUNAS" ? (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
                  <p className="font-semibold">Pembayaran belum lunas.</p>
                  <p className="text-[11px] mt-0.5">TTE Kuitansi hanya dapat dilakukan setelah status pembayaran lunas.</p>
                </div>
              ) : rawPermohonan?.kuitansi_pdf_tte ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4" />
                    <span>TTE BSrE Kuitansi Telah Tersemat</span>
                  </div>
                  <p className="text-emerald-800 text-[11px]">ID Penandatanganan: {rawPermohonan?.kuitansi_pdf_tte}</p>
                </div>
              ) : (
                <form onSubmit={handleSignKuitansiTte} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800">Passphrase BSrE Bendahara</label>
                    <input
                      type="password"
                      required
                      value={passphraseKuitansi}
                      onChange={(e) => setPassphraseKuitansi(e.target.value)}
                      placeholder="Masukkan passphrase sertifikat elektronik..."
                      className="w-full mt-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    variant="primary"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    isLoading={signingKuitansi}
                    leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                  >
                    Tanda Tangani Kuitansi (TTE BSrE)
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: Integrasi SIS & BSKJI */}
      {activeTab === "integrasi" && (
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm flex items-center gap-2">
              <Send className="w-4 h-4 text-brand-600" />
              <span>Status Integrasi Sistem Informasi Sertifikasi (SIS) & BSKJI</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Sinkronisasi data teknis permohonan yang telah lunas ke sistem internal SIS dan portal pusat BSKJI Kemenperin.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 font-medium">Status Pembayaran Syarat Bridging:</span>
                <p className="font-bold text-slate-800 mt-0.5">{statusBayar === "LUNAS" ? "Lunas (Siap Disinkronkan)" : "Belum Lunas (Menunggu Pembayaran)"}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Status Sinkronisasi SIS:</span>
                <p className="font-bold text-emerald-700 mt-0.5">{rawPermohonan?.id_pt_ins ? `Tersinkron (ID PT/INS: ${rawPermohonan.id_pt_ins})` : "Tersinkronisasi Otomatis saat Lunas"}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                isLoading={syncingSis}
                leftIcon={<RefreshCw className="w-3.5 h-3.5 text-brand-600" />}
                onClick={handleManualSyncSis}
              >
                Sinkronkan Manual ke SIS & BSKJI
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval / Revisi / Reject Modal */}
      {modalState.show && (
        <AdminApprovalModal
          show={modalState.show}
          actionType={modalState.action}
          permohonanId={noOrder}
          rawId={permohonan?.id || id}
          pelangganName={namaPelanggan}
          onClose={() => setModalState({ show: false, action: null })}
          onSuccess={() => fetchDetail()}
        />
      )}

      {/* Modal Standar Pratinjau PDF BBKKP */}
      {PdfPreviewModal}
    </div>
  )
}

export default AdminPermohonanDetailPage
