import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  Download,
  Building2,
  Mail,
  Phone,
  Layers,
  FileCheck2,
  ExternalLink,
  Loader2,
  Package,
  Factory,
  Edit3,
  CreditCard,
  CheckCircle,
  HelpCircle,
} from "lucide-react"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { usePembayaran } from "../../hooks/usePembayaran"
import api from "../../utils/api"
import toast from "react-hot-toast"

const workflowSteps = [
  { key: "PERMOHONAN", label: "Diajukan", desc: "Permohonan terkirim" },
  { key: "IN_REVIEW", label: "Verifikasi", desc: "Review Tim Marketing" },
  { key: "PEMBAYARAN", label: "Pembayaran", desc: "Verifikasi Tagihan" },
  { key: "PROCESS", label: "Proses Layanan", desc: "Audit / Uji Lab" },
  { key: "DONE", label: "Selesai", desc: "Sertifikat Terbit" },
]

export const DetailPermohonanPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { openInvoice, openKuitansi, openLhu, onDownloadCertificate, PdfPreviewModal } = usePembayaran()

  const [loading, setLoading] = useState<boolean>(true)
  const [requestingTte, setRequestingTte] = useState<"invoice" | "kuitansi" | null>(null)
  const [permohonan, setPermohonan] = useState<any>(null)
  const [formData, setFormData] = useState<any>(null)
  const [lingkup, setLingkup] = useState<any>(null)

  const handleRequestTteInvoice = async () => {
    if (!id) return
    try {
      setRequestingTte("invoice")
      const res = await api.post(`/eksternal/permohonan/${id}/request-tte-invoice`)
      toast.success(res?.data?.message || "Permintaan TTE BSrE Invoice telah dikirim ke Bendahara.")
      setPermohonan((prev: any) => ({
        ...prev,
        tte_invoice_requested: true,
      }))
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
      setPermohonan((prev: any) => ({
        ...prev,
        tte_kuitansi_requested: true,
      }))
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal mengajukan permintaan TTE Kuitansi")
    } finally {
      setRequestingTte(null)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        setLoading(true)
        let detailData: any = null
        let formDetail: any = null

        try {
          const res = await api.get(`/eksternal/permohonan/${id}`)
          detailData = res?.data?.results?.detail || res?.data?.data || res?.data
          formDetail = detailData?.form_data
        } catch (permohonanErr) {
          console.warn("Mencoba fallback endpoint sertifikasi:", permohonanErr)
        }

        // Try sertifikasi endpoint if detailData is empty or to enrich data
        try {
          const certRes = await api.get(`/eksternal/sertifikasi/${id}`)
          const cData = certRes?.data?.data || certRes?.data?.results
          if (cData?.permohonan) {
            detailData = { ...detailData, ...cData.permohonan }
          }
          if (cData?.form) {
            formDetail = { ...formDetail, ...cData.form }
          }
        } catch (e) {
          // ignore
        }

        if (detailData) {
          setPermohonan(detailData)
          setFormData(formDetail || detailData?.form_data)
          setLingkup(detailData?.lingkup_layanan)
        } else {
          toast.error("Data permohonan tidak ditemukan")
        }
      } catch (err: any) {
        console.error("Gagal memuat detail permohonan:", err)
        toast.error("Gagal memuat detail permohonan")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <span className="text-xs font-medium text-slate-500">Memuat rincian permohonan...</span>
      </div>
    )
  }

  const noOrder = permohonan?.no_permohonan || permohonan?.kode_order || `#REQ-${id?.slice(0, 8)}`
  const status = permohonan?.status_workflow || "PERMOHONAN"
  const isRevisi = status === "REVISI"
  const isDraft = status === "DRAFT"
  const isDone = status === "DONE"

  const namaPemohon =
    formData?.nama_perusahaan || formData?.nama_lengkap || formData?.nama_instansi || permohonan?.creator?.name || "Pemohon"
  const alamat = formData?.alamat_kantor || formData?.alamat_instansi || formData?.alamat || "-"
  const pic = formData?.kontak_person || formData?.nama_pic || formData?.nama_lengkap || "-"
  const phone = formData?.no_whatsapp || formData?.no_telp || "-"
  const email = formData?.email || permohonan?.creator?.email || "-"
  const layananName =
    lingkup?.lingkup ||
    lingkup?.nama ||
    (noOrder.startsWith("CERT")
      ? "Sertifikasi Produk & Sistem (LSPro)"
      : noOrder.startsWith("LSP")
      ? "Sertifikasi Profesi (LSP)"
      : noOrder.startsWith("REG") || noOrder.startsWith("TRN")
      ? "Bimbingan Teknis & Pelatihan"
      : "Layanan BBSPJIKKP")

  // Parse Items / Komoditas dari berbagai kemungkinan field
  const parseItems = () => {
    let raw: any[] = []
    if (Array.isArray(formData?.items) && formData.items.length > 0) {
      raw = formData.items
    } else if (formData?.komoditas_json) {
      raw = Array.isArray(formData.komoditas_json)
        ? formData.komoditas_json
        : typeof formData.komoditas_json === "string"
        ? JSON.parse(formData.komoditas_json || "[]")
        : [formData.komoditas_json]
    } else if (Array.isArray(formData?.komoditis) && formData.komoditis.length > 0) {
      raw = formData.komoditis
    } else if (formData?.kuesioner_kelayakan?.komoditas) {
      raw = Array.isArray(formData.kuesioner_kelayakan.komoditas)
        ? formData.kuesioner_kelayakan.komoditas
        : [formData.kuesioner_kelayakan.komoditas]
    } else if (permohonan?.komoditi || formData?.komoditi) {
      const kVal = permohonan?.komoditi || formData?.komoditi
      raw = Array.isArray(kVal) ? kVal : [{ nama_produk: kVal }]
    }

    return (raw || []).map((it: any, index: number) => {
      if (typeof it === "string") {
        return {
          id: index,
          nama_produk: it,
          standar_sni_iso: null,
          merk_dagang: null,
          tipe_jenis: null,
          estimasi_tarif: 0,
        }
      }
      return {
        id: it.id || index,
        nama_produk: it.nama_produk || it.nama_komoditi || it.komoditi_nama || it.nama || it.komoditi || "Produk Terdaftar",
        standar_sni_iso: it.standar_sni_iso || it.sni || it.standar_sni || it.standar || null,
        merk_dagang: it.merk_dagang || it.merk || it.merek || null,
        tipe_jenis: it.tipe_jenis || it.tipe || it.jenis || null,
        estimasi_tarif: it.estimasi_tarif || it.tarif || it.biaya || 0,
      }
    })
  }

  const items = parseItems()

  // Parse Pabrik / Fasilitas
  const parsePabriks = () => {
    let raw: any[] = []
    if (Array.isArray(formData?.pabrik) && formData.pabrik.length > 0) {
      raw = formData.pabrik
    } else if (formData?.pabrik_json) {
      raw = Array.isArray(formData.pabrik_json)
        ? formData.pabrik_json
        : typeof formData.pabrik_json === "string"
        ? JSON.parse(formData.pabrik_json || "[]")
        : [formData.pabrik_json]
    } else if (Array.isArray(formData?.pabriks) && formData.pabriks.length > 0) {
      raw = formData.pabriks
    }
    return raw || []
  }

  const pabriks = parsePabriks()

  // Parse Dokumen Persyaratan
  const parseDocs = () => {
    const d: Record<string, string> = {}
    if (formData?.dokumen_persyaratan && typeof formData.dokumen_persyaratan === "object") {
      Object.entries(formData.dokumen_persyaratan).forEach(([k, v]) => {
        if (typeof v === "string" && v.trim()) d[k] = v
      })
    }
    const legacyFields: { key: string; val: any }[] = [
      { key: "surat_permohonan", val: formData?.file_surat_permohonan },
      { key: "manual_mutu", val: formData?.file_manual_mutu },
      { key: "proses_produksi", val: formData?.file_proses_produksi },
      { key: "denah_lokasi", val: formData?.file_denah_lokasi },
      { key: "daftar_peralatan", val: formData?.file_daftar_peralatan },
      { key: "pertanyaan_tambahan", val: formData?.file_pertanyaan_tambahan },
      { key: "dokumen_legalitas", val: formData?.dok_legalitas || formData?.file_dokumen_pendukung },
    ]
    legacyFields.forEach(({ key, val }) => {
      if (typeof val === "string" && val.trim() && !d[key]) {
        d[key] = val
      }
    })
    return d
  }

  const docs = parseDocs()

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "DRAFT":
        return <Badge variant="secondary">Draf</Badge>
      case "PERMOHONAN":
        return <Badge variant="primary">Diajukan</Badge>
      case "IN_REVIEW":
        return <Badge variant="warning">Sedang Diverifikasi</Badge>
      case "REVISI":
        return <Badge variant="danger">Perlu Perbaikan</Badge>
      case "PEMBAYARAN":
        return <Badge variant="primary">Menunggu Pembayaran</Badge>
      case "PROCESS":
        return <Badge variant="info">Sedang Diproses</Badge>
      case "DONE":
        return <Badge variant="success">Selesai</Badge>
      case "DITOLAK":
        return <Badge variant="danger">Ditolak</Badge>
      default:
        return <Badge variant="secondary">{st}</Badge>
    }
  }

  const getStepIndex = (st: string) => {
    if (st === "DRAFT") return 0
    if (st === "PERMOHONAN") return 0
    if (st === "IN_REVIEW" || st === "REVISI") return 1
    if (st === "PEMBAYARAN") return 2
    if (st === "PROCESS") return 3
    if (st === "DONE") return 4
    return 0
  }

  const currentStepIdx = getStepIndex(status)

  const getFileUrl = (path: string) => {
    if (!path) return ""
    if (path.startsWith("http")) return path
    return `${window.location.origin}/storage/${path}`
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <Head title={`Detail Permohonan — ${noOrder}`} />

      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Kembali ke Dashboard
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{noOrder}</h1>
              {getStatusBadge(status)}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{layananName}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {(isRevisi || isDraft) && (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={() => navigate(`/permohonan/edit/${id}`)}
              className="bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
            >
              {isRevisi ? "Perbaiki Permohonan" : "Lanjutkan Draf"}
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            leftIcon={<FileText className="w-3.5 h-3.5" />}
            onClick={() => openInvoice({ id, no_permohonan: noOrder })}
          >
            Invoice
          </Button>

          <Button
            size="sm"
            variant="outline"
            leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
            onClick={() => openLhu({ id, no_permohonan: noOrder })}
          >
            LHU / Draft
          </Button>

          {isDone && (
            <Button
              size="sm"
              variant="success"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => onDownloadCertificate(id)}
            >
              Unduh Sertifikat
            </Button>
          )}
        </div>
      </div>

      {/* Catatan Perbaikan / Revisi Banner */}
      {isRevisi && permohonan?.catatan_admin && (
        <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-soft flex items-start gap-4">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-900">Catatan Perbaikan dari Tim Verifikator / Marketing:</h4>
            <p className="text-xs text-amber-800 mt-1 whitespace-pre-line leading-relaxed">
              {permohonan.catatan_admin}
            </p>
            <div className="mt-3">
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={() => navigate(`/permohonan/edit/${id}`)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Buka Formulir Koreksi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Tracker Stepper Card */}
      <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-slate-50 to-brand-50/20 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Pelacakan Status Permohonan</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Tanggal Pengajuan: {permohonan?.created_at || permohonan?.tgl_order || "-"}
          </span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative">
            {workflowSteps.map((step, idx) => {
              const isPast = idx < currentStepIdx || (isDone && idx === 4)
              const isCurrent = idx === currentStepIdx && !isDone
              return (
                <div
                  key={step.key}
                  className={`p-4 rounded-xl border transition-all ${
                    isPast
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                      : isCurrent
                      ? "bg-brand-50/90 border-brand-300 ring-2 ring-brand-500/20 text-brand-900 shadow-xs"
                      : "bg-slate-50/60 border-slate-200/80 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isPast
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-brand-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isPast ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider">
                      {isPast ? "Selesai" : isCurrent ? "Sedang Berjalan" : "Menunggu"}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold leading-tight">{step.label}</h4>
                  <p className="text-[11px] opacity-75 mt-0.5 truncate">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form and Service Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Pemohon */}
          <Card className="rounded-2xl border-slate-200 shadow-soft">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <Building2 className="w-4 h-4 text-brand-600" />
                Informasi Pemohon & Perusahaan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Nama Perusahaan / Pemohon:</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{namaPemohon}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Penanggung Jawab (PIC):</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{pic}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Nomor WhatsApp / Telepon:</span>
                  <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {phone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Email Pemohon:</span>
                  <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {email}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block font-medium">Alamat Kantor:</span>
                  <span className="font-medium text-slate-700 mt-0.5 block bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                    {alamat}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daftar Komoditi / Produk */}
          <Card className="rounded-2xl border-slate-200 shadow-soft">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <Package className="w-4 h-4 text-brand-600" />
                Rincian Komoditi & Produk ({items.length > 0 ? items.length : 1} Item)
              </CardTitle>
              <Badge variant="outline">{layananName}</Badge>
            </CardHeader>
            <CardContent className="p-5 pt-4">
              {items.length > 0 ? (
                <div className="space-y-3">
                  {items.map((item: any, idx: number) => (
                    <div
                      key={item.id || idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{item.nama_produk}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-slate-500 pl-7">
                          {item.standar_sni_iso && (
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-brand-600 font-medium">
                              SNI/Standar: {item.standar_sni_iso}
                            </span>
                          )}
                          {item.merk_dagang && <span>Merk: {item.merk_dagang}</span>}
                          {item.tipe_jenis && <span>Tipe: {item.tipe_jenis}</span>}
                        </div>
                      </div>
                      {item.estimasi_tarif > 0 && (
                        <div className="text-right pl-7 sm:pl-0">
                          <span className="text-[11px] text-slate-400 block">Estimasi Tarif:</span>
                          <span className="font-bold text-slate-900">
                            Rp {Number(item.estimasi_tarif).toLocaleString("id-ID")}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <p className="font-bold text-slate-800">
                    {formData?.nama_layanan || formData?.nama_skema || "Permohonan Layanan"}
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    Jenis Pengajuan: {formData?.tipe_pengajuan || formData?.jenis_pengajuan || "BARU"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daftar Pabrik / Fasilitas jika ada */}
          {pabriks.length > 0 && (
            <Card className="rounded-2xl border-slate-200 shadow-soft">
              <CardHeader className="border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                  <Factory className="w-4 h-4 text-brand-600" />
                  Lokasi Pabrik & Fasilitas Produksi ({pabriks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-4 space-y-3">
                {pabriks.map((pabrik: any, idx: number) => (
                  <div key={pabrik.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs">
                    <div className="font-bold text-slate-900">{pabrik.nama_pabrik}</div>
                    <div className="text-slate-600 mt-1">{pabrik.alamat_pabrik}</div>
                    {pabrik.kontak_pabrik && (
                      <div className="text-slate-400 mt-1">Kontak: {pabrik.kontak_pabrik}</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Dokumen & Lampiran */}
          <Card className="rounded-2xl border-slate-200 shadow-soft">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <FileText className="w-4 h-4 text-brand-600" />
                Berkas Dokumen Persyaratan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-4">
              {Object.keys(docs).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(docs).map(([key, val]: [string, any]) => {
                    if (!val || typeof val !== "string") return null
                    const docTitle = key.replace(/_/g, " ").toUpperCase()
                    return (
                      <a
                        key={key}
                        href={getFileUrl(val)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-brand-50/50 hover:border-brand-300 transition-all flex items-center justify-between text-xs group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">{docTitle}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 shrink-0 ml-2" />
                      </a>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Tidak ada dokumen persyaratan yang diunggah.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Summary, Billing & Quick Actions */}
        <div className="space-y-6">
          {/* Summary Order Card */}
          <Card className="rounded-2xl border-slate-200 shadow-soft">
            <CardHeader className="border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <CreditCard className="w-4 h-4 text-brand-600" />
                Ringkasan Tagihan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-4 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Status Pembayaran:</span>
                <Badge variant={permohonan?.status_bayar === "LUNAS" ? "success" : "warning"}>
                  {permohonan?.status_bayar === "LUNAS" ? "Lunas" : "Belum Bayar"}
                </Badge>
              </div>

              {permohonan?.va && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">Nomor Virtual Account (VA):</span>
                  <span className="text-sm font-bold text-brand-700 tracking-wider font-mono block mt-0.5">
                    {permohonan.va}
                  </span>
                  {permohonan?.va_expired_at && (
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Berlaku s/d: {permohonan.va_expired_at}
                    </span>
                  )}
                </div>
              )}

              {/* Invoice & TTE Block */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Dokumen Invoice</span>
                  {permohonan?.pdf_tte ? (
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg">
                      TTE BSrE Sah
                    </span>
                  ) : permohonan?.tte_invoice_requested ? (
                    <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200 rounded-lg">
                      Menunggu TTE Bendahara
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 font-semibold border border-slate-200 rounded-lg">
                      Digital Seal
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<FileText className="w-3.5 h-3.5" />}
                    onClick={() => openInvoice({ id, no_permohonan: noOrder })}
                    className="flex-1 justify-center"
                  >
                    Buka Invoice
                  </Button>

                  {!permohonan?.pdf_tte && !permohonan?.tte_invoice_requested && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleRequestTteInvoice}
                      isLoading={requestingTte === "invoice"}
                      className="text-xs"
                      title="Minta TTE BSrE Resmi Bendahara"
                    >
                      Minta TTE
                    </Button>
                  )}
                </div>
              </div>

              {/* Kuitansi & TTE Block (Ketika Lunas) */}
              {permohonan?.status_bayar === "LUNAS" && (
                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Kuitansi Pembayaran</span>
                    {permohonan?.kuitansi_pdf_tte ? (
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg">
                        TTE BSrE Sah
                      </span>
                    ) : permohonan?.tte_kuitansi_requested ? (
                      <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200 rounded-lg">
                        Menunggu TTE Bendahara
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 font-semibold border border-slate-200 rounded-lg">
                        Digital Seal
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="success"
                      size="sm"
                      leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
                      onClick={() => openKuitansi({ id, no_permohonan: noOrder })}
                      className="flex-1 justify-center"
                    >
                      Buka Kuitansi
                    </Button>

                    {!permohonan?.kuitansi_pdf_tte && !permohonan?.tte_kuitansi_requested && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRequestTteKuitansi}
                        isLoading={requestingTte === "kuitansi"}
                        className="text-xs"
                        title="Minta TTE BSrE Resmi Bendahara"
                      >
                        Minta TTE
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {Boolean(
                permohonan?.has_lhu ||
                  (Array.isArray(permohonan?.file_attachment) &&
                    permohonan.file_attachment.some(
                      (f: any) => f.nama?.toLowerCase().includes("lhu") || f.kode === "LHU"
                    ))
              ) && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<FileCheck2 className="w-4 h-4" />}
                    onClick={() => openLhu({ id, no_permohonan: noOrder })}
                    className="w-full justify-center"
                  >
                    Lihat Draft Hasil Uji (LHU)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bantuan Layanan */}
          <Card className="rounded-2xl border-slate-200 shadow-soft bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-brand-400 font-bold text-xs">
                <HelpCircle className="w-4 h-4" />
                Pusat Bantuan Layanan
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Butuh bantuan atau koordinasi langsung terkait proses pengujian dan sertifikasi Anda?
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/ask-questions")}
                className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs"
              >
                Hubungi CS / Tanya Jawab
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {PdfPreviewModal}
    </div>
  )
}

export default DetailPermohonanPage
