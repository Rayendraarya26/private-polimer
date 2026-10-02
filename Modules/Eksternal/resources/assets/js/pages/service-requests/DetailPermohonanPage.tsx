import React, { useState } from "react"
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
  Loader2,
  Package,
  Factory,
  Edit3,
  CreditCard,
  CheckCircle,
  Users,
  UserCheck,
  ShieldCheck,
  MapPin,
  Info,
  CheckCircle2,
  Eye,
  Award,
} from "lucide-react"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { usePembayaran } from "../../hooks/usePembayaran"
import { useDetailPermohonan } from "../../hooks/detail-service-requests/useDetailPermohonan"
import { usePermohonanType } from "../../hooks/detail-service-requests/usePermohonanType"
import { useFormDataResolver } from "../../hooks/detail-service-requests/useFormDataResolver"
import {
  PupDetailPermohonanTab,
  PupDetailLaboratoriumTab,
  PupDetailKomitmenTab,
} from "../../components/detail-service-requests/PupDetailSection"
import {
  KalibrasiDetailSection,
} from "../../components/detail-service-requests/KalibrasiDetailSection"
import {
  PengujianDetailPermohonanTab,
} from "../../components/detail-service-requests/PengujianDetailSection"
import {
  InspeksiDetailPermohonanTab,
  InspeksiDetailPelangganTab,
} from "../../components/detail-service-requests/InspeksiDetailSection"
import {
  HalalDetailPermohonanTab,
} from "../../components/detail-service-requests/HalalDetailSection"
import {
  MiniplantDetailPermohonanTab,
} from "../../components/detail-service-requests/MiniplantDetailSection"
import {
  GrkVerifikasiDetailSection,
} from "../../components/detail-service-requests/GrkVerifikasiDetailSection"
import {
  GrkValidasiDetailSection,
} from "../../components/detail-service-requests/GrkValidasiDetailSection"
import {
  SertifikasiDetailSection,
} from "../../components/detail-service-requests/SertifikasiDetailSection"
import { formatIndoDate } from "../../utils/formatIndoDate"
import { getFileUrl, getDocLabel } from "../../utils/fileHelpers"
import { getStatusBadge, getStepIndex } from "../../utils/statusHelpers"

// Workflow step constants dipindahkan ke: constants/workflowSteps.ts
// resolveGrkFormData dipindahkan ke: utils/grkHelpers.ts

type TabKey = "permohonan" | "perusahaan" | "dokumen" | "biaya"



export const DetailPermohonanPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { openInvoice, openKuitansi, openSuratPenawaran, openLhu, onDownloadCertificate, openPdfDoc, PdfPreviewModal } = usePembayaran()

  const {
    loading,
    permohonan,
    formData,
    lingkup,
    requestingTte,
    approvalLoading,
    bayarLoading,
    showRejectModal,
    setShowRejectModal,
    rejectCatatan,
    setRejectCatatan,
    handleRequestTteInvoice,
    handleRequestTteKuitansi,
    handleApprovalPenawaran,
    handleSimulasiBayar,
  } = useDetailPermohonan(id)

  // UI-only state — tetap di sini karena tidak perlu di-share atau di-test secara terpisah
  const [activeTab, setActiveTab] = useState<TabKey>("permohonan")

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <span className="text-xs font-medium text-slate-500">Memuat rincian permohonan...</span>
      </div>
    )
  }

  // ── Hook 2: derived type & company info (semua computed, no side effect) ──
  const {
    noOrder, status, isRevisi, isDraft, isDone,
    layananName,
    isPup, isLsp, isPelatihan,
    isGrk, isGrkValidasi,
    isKalibrasi, isInspeksi, isPengujian,
    isHalal, isMiniplant, isSertifikasi,
    namaPemohon, npwp, nib, noAkta,
    namaPimpinan, wakilManajemen,
    pic, phone, email, alamat, totalKaryawan,
    listPabrik,
  } = usePermohonanType(permohonan, formData, lingkup, id)

  // ── Hook 3: form data resolvers, parsed collections, tracking logs ─────────
  const {
    formPupData, formKalibrasiData, formInspeksiData,
    formPengujianData, formHalalData, formMiniplantData, formGrkData,
    items, pabriks, docs,
    pernyataanFile,
  } = useFormDataResolver(
    permohonan,
    formData,
    { isPup, isKalibrasi, isInspeksi, isPengujian, isHalal, isMiniplant, isGrk, isGrkValidasi },
    listPabrik,
  )

  // Penawaran status logic (Mendukung relasi model, array relation, maupun direct fields pada permohonan)
  const rawPenawaran =
    permohonan?.penawaran_biaya ||
    permohonan?.penawaranBiaya ||
    (Array.isArray(permohonan?.penawaran_biaya) && permohonan.penawaran_biaya.length > 0 ? permohonan.penawaran_biaya[0] : null) ||
    (Array.isArray(permohonan?.penawaranBiaya) && permohonan.penawaranBiaya.length > 0 ? permohonan.penawaranBiaya[0] : null)

  const penawaran = (Array.isArray(rawPenawaran) ? rawPenawaran[0] : rawPenawaran) || (
    (permohonan?.harga_permohonan || permohonan?.total_harga || permohonan?.file_surat_penawaran || permohonan?.detail_pembayaran || permohonan?.pembayaran) ? {
      total_nominal: permohonan?.harga_permohonan || permohonan?.total_harga || 0,
      file_surat_penawaran: permohonan?.file_surat_penawaran,
      status_persetujuan: permohonan?.status_penawaran === 'setuju' ? 'DISETUJUI' : (permohonan?.status_penawaran === 'tolak' ? 'DITOLAK' : 'MENUNGGU'),
      status: permohonan?.status_penawaran === 'setuju' ? 'DISETUJUI' : (permohonan?.status_penawaran === 'tolak' ? 'DITOLAK' : 'MENUNGGU'),
      catatan: permohonan?.catatan_penawaran,
      rincian_json: permohonan?.detail_pembayaran || permohonan?.pembayaran || permohonan?.detailPembayaran
    } : null
  )

  const isPenawaranDisetujui = Boolean(
    penawaran && (
      penawaran?.status_persetujuan === "DISETUJUI" ||
      penawaran?.status === "DISETUJUI" ||
      permohonan?.status_penawaran === "setuju"
    )
  )
  const isPenawaranDitolak = Boolean(
    penawaran && (
      penawaran?.status_persetujuan === "DITOLAK" ||
      penawaran?.status === "DITOLAK" ||
      permohonan?.status_penawaran === "tolak"
    )
  )
  const isStatusTahapPenawaran = [
    "PENAWARAN_BIAYA",
    "MENUNGGU_PERSETUJUAN_PELANGGAN",
    "PEMBAYARAN",
  ].includes(status)

  const isPendingApproval = Boolean(
    isStatusTahapPenawaran &&
    penawaran &&
    !isPenawaranDisetujui &&
    !isPenawaranDitolak && (
      penawaran?.status_persetujuan === "MENUNGGU" ||
      penawaran?.status === "MENUNGGU_PERSETUJUAN" ||
      status === "MENUNGGU_PERSETUJUAN_PELANGGAN" ||
      status === "PENAWARAN_BIAYA"
    )
  )

  const isLunas = permohonan?.status_bayar === "LUNAS" || status === "LUNAS"
  const isDitolak = status === "DITOLAK" || isPenawaranDitolak

  const isSiapBayar =
    !isPendingApproval &&
    (isPenawaranDisetujui || ["PEMBAYARAN", "PROCESS", "LUNAS", "DONE", "SELESAI"].includes(status) || isLunas)

  const rawRincian =
    penawaran?.rincian_json ||
    penawaran?.detail_pembayaran ||
    permohonan?.detail_pembayaran ||
    permohonan?.pembayaran ||
    permohonan?.detailPembayaran

  const parsedRincian = Array.isArray(rawRincian)
    ? rawRincian
    : typeof rawRincian === "string"
      ? JSON.parse(rawRincian || "[]")
      : []

  const rincianList = (() => {
    if (parsedRincian.length > 0) return parsedRincian
    if (isPup && Array.isArray(formPupData?.items) && formPupData.items.length > 0) {
      const items = formPupData.items.map((it: any) => ({
        nama_item: `Skema PUP: ${it.nama_skema}`,
        qty: 1,
        subtotal: Number(it.biaya || 0),
      }))
      if (Number(formPupData?.diskon_nominal) > 0) {
        items.push({
          nama_item: formPupData?.catatan_diskon || "Paket Hemat Diskon Bundling PUP",
          qty: 1,
          subtotal: -Number(formPupData.diskon_nominal),
        })
      }
      return items
    }
    return []
  })()

  const totalBiayaPenawaran = Number(
    penawaran?.total_nominal ||
    penawaran?.total_biaya ||
    permohonan?.biaya ||
    formPupData?.total_biaya_bersih ||
    permohonan?.harga_permohonan ||
    permohonan?.total_harga ||
    (rincianList.length > 0
      ? rincianList.reduce((acc: number, cur: any) => acc + Number(cur.subtotal || (cur.nominal || cur.harga_satuan || 0) * (cur.qty || cur.kuantitas || 1)), 0)
      : 0)
  )

  // getStatusBadge & getStepIndex telah dipindahkan ke: utils/statusHelpers.tsx
  const currentStepIdx = getStepIndex({ status, isPendingApproval, isPenawaranDisetujui, isLunas })

  // getFileUrl, getDocLabel, formatIndoDate telah dipindahkan ke utils/ (diimport di atas)



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
            Kembali
          </Button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {isSiapBayar && (
                <Badge variant={isLunas ? "success" : "warning"}>
                  {isLunas ? "LUNAS" : "BELUM LUNAS"}
                </Badge>
              )}
            </div>
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

          {permohonan?.status_bayar !== "LUNAS" && (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<CreditCard className="w-3.5 h-3.5" />}
              onClick={handleSimulasiBayar}
              isLoading={bayarLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold"
            >
              Simulasi Bayar (Testing)
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

          {isLunas && (
            <Button
              size="sm"
              variant="success"
              leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
              onClick={() => openKuitansi({ id, no_permohonan: noOrder })}
            >
              Kuitansi
            </Button>
          )}

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

      <Card className="rounded-2xl border-slate-200/80 shadow-soft overflow-hidden bg-white">
        {/* Header */}
        <CardHeader className="px-5 py-4 border-b border-slate-200/80">
          <CardTitle className="text-md font-bold flex items-center gap-2 text-slate-800">
            <FileText className="h-5 w-5 text-brand-700" />
            <span>
              Detail Permohonan {layananName}
            </span>
          </CardTitle>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

            {/* No. Permohonan */}
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
              <p className="text-xs font-medium text-slate-400">
                No. Permohonan
              </p>

              <p className="mt-1 text-sm font-bold text-brand-800">
                {noOrder}
              </p>
            </div>

            {/* Tanggal Permohonan */}
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
              <p className="text-xs font-medium text-slate-400">
                Tanggal Permohonan
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                {formatIndoDate(
                  permohonan?.created_at || permohonan?.tgl_order,
                  true
                )}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
              <p className="text-xs font-medium text-slate-400">
                Status Workflow
              </p>

              <div className="mt-1">
                {getStatusBadge({ status, isPendingApproval, isDitolak, isPenawaranDisetujui, isLunas })}
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

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

      {/* DETAIL CONTENT: Jika Miniplant atau Kalibrasi tampil langsung satu halaman tanpa tab/step-step */}
      {isMiniplant ? (
        <div className="w-full space-y-6">
          <MiniplantDetailPermohonanTab
            permohonan={permohonan}
            formMiniplant={formMiniplantData}
            formatIndoDate={formatIndoDate}
          />
        </div>
      ) : isKalibrasi ? (
        <div className="w-full space-y-6">
          <KalibrasiDetailSection
            permohonan={permohonan}
            formKalibrasi={formKalibrasiData}
            formatIndoDate={formatIndoDate}
            openInvoice={openInvoice}
            openKuitansi={openKuitansi}
            openSuratPenawaran={openSuratPenawaran}
          />
        </div>
      ) : isSertifikasi ? (
        <div className="w-full space-y-6">
          <SertifikasiDetailSection
            permohonan={permohonan}
            formData={formData}
            lingkup={lingkup}
            formatIndoDate={formatIndoDate}
            openPdfDoc={openPdfDoc}
            openInvoice={openInvoice}
            openKuitansi={openKuitansi}
          />
        </div>
      ) : isGrk ? (
        isGrkValidasi ? (
          <GrkValidasiDetailSection
            permohonan={permohonan}
            formGrk={formGrkData}
            layananName={layananName || "Validasi GRK"}
            noOrder={noOrder}
            formatIndoDate={formatIndoDate}
          />
        ) : (
          <GrkVerifikasiDetailSection
            permohonan={permohonan}
            formGrk={formGrkData}
            layananName={layananName || "Verifikasi GRK"}
            noOrder={noOrder}
            formatIndoDate={formatIndoDate}
          />
        )
      ) : (
        <>
          {/* TAB NAVIGATION (Model Grid Responsif - Menyesuaikan Jenis Layanan) */}
          <div className="bg-slate-100/80 p-2 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("permohonan")}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === "permohonan"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70"
                  }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Package className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {isPengujian
                      ? "Sampel & Parameter Uji"
                      : isPup
                        ? "Skema & Artefak UP"
                        : isPelatihan
                          ? "Data Pelatihan & Peserta"
                          : isLsp
                            ? "Skema & Calon Asesi"
                            : isGrk
                              ? "Data Proyek GRK"
                              : isInspeksi
                                ? "Spesifikasi Inspeksi"
                                : isHalal
                                  ? "Data Produk & Bahan Halal"
                                  : isMiniplant
                                    ? "Detail Miniplant & Perlakuan"
                                    : "Data Permohonan"}
                  </span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${activeTab === "permohonan" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                  {isPengujian
                    ? (formPengujianData?.samples?.length || 1)
                    : isPup
                      ? (formPupData?.items?.length || 1)
                      : isHalal
                        ? (formHalalData?.produk_json?.length || 1)
                        : isMiniplant
                          ? (formMiniplantData?.items?.length || 1)
                          : (items.length > 0 ? items.length : 1)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("perusahaan")}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === "perusahaan"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70"
                  }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {isPup
                      ? "Data Laboratorium"
                      : isPelatihan
                        ? "Data Instansi / Peserta"
                        : isInspeksi
                          ? "Penerima & Pemohon"
                          : "Data Perusahaan"}
                  </span>
                </div>
                {!isPup && !isPelatihan && !isInspeksi && pabriks.length > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${activeTab === "perusahaan" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                    {pabriks.length} Pabrik
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("dokumen")}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === "dokumen"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70"
                  }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Layers className="w-4 h-4 shrink-0" />
                  <span className="truncate">{isPup ? "Komitmen Pemohon" : "Berkas Dokumen"}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${activeTab === "dokumen" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                  {isPup ? "Disetujui" : Object.keys(docs).length + (pernyataanFile ? 1 : 0)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("biaya")}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === "biaya"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70"
                  }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span className="truncate">Penawaran & Biaya</span>
                </div>
                {isPendingApproval ? (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse shrink-0">
                    Persetujuan
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {/* Main Content (Full Width) */}
          <div className="w-full space-y-6">
            {/* TAB 1: DATA PERMOHONAN */}
            {activeTab === "permohonan" && (
              isPengujian ? (
                <PengujianDetailPermohonanTab
                  permohonan={permohonan}
                  formPengujian={formPengujianData}
                  formatIndoDate={formatIndoDate}
                />
              ) : isPup ? (
                <PupDetailPermohonanTab
                  permohonan={permohonan}
                  formPup={formPupData}
                  formatIndoDate={formatIndoDate}
                />
              ) : isInspeksi ? (
                <InspeksiDetailPermohonanTab
                  permohonan={permohonan}
                  formInspeksi={formInspeksiData}
                  formatIndoDate={formatIndoDate}
                />
              ) : isHalal ? (
                <HalalDetailPermohonanTab
                  permohonan={permohonan}
                  formHalal={formHalalData}
                  formatIndoDate={formatIndoDate}
                />
              ) : isPelatihan ? (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <Card className="rounded-2xl border-slate-200 shadow-soft">
                    <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <FileText className="w-4 h-4 text-brand-600" />
                        Parameter & Skema Bimbingan Teknis
                      </CardTitle>
                      <Badge variant="outline">{layananName}</Badge>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">Nomor Permohonan:</span>
                          <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">{noOrder}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Tanggal Pendaftaran:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">
                            {formatIndoDate(permohonan?.created_at || permohonan?.tgl_order, true)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Fokus / Bidang Industri:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">
                            {formData?.jenis_produk || "Bimbingan Teknis & Pelatihan Industri"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Instansi / Asal Peserta:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">
                            {formData?.nama_instansi || namaPemohon}
                          </span>
                        </div>
                        {formData?.masalah_materi && (
                          <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 mt-1">
                            <span className="text-slate-500 font-bold block mb-1 text-[11px] uppercase tracking-wider">
                              Masalah / Kebutuhan Materi yang Dihadapi:
                            </span>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{formData.masalah_materi}</p>
                          </div>
                        )}
                        {formData?.hal_dipelajari && (
                          <div className="sm:col-span-2 p-3.5 bg-brand-50/50 rounded-xl border border-brand-200/60 mt-1">
                            <span className="text-brand-900 font-bold block mb-1 text-[11px] uppercase tracking-wider">
                              Hal Khusus yang Ingin Dipelajari:
                            </span>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{formData.hal_dipelajari}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Peserta Pelatihan */}
                  <Card className="rounded-2xl border-slate-200 shadow-soft">
                    <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <Users className="w-4 h-4 text-brand-600" />
                        Data Peserta Bimbingan Teknis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-slate-400 block font-medium">Nama Lengkap Peserta:</span>
                          <span className="font-bold text-slate-900 mt-0.5 block text-sm">{formData?.nama_lengkap || namaPemohon}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">NIK:</span>
                          <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{formData?.nik_peserta || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Jenis Kelamin:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{formData?.gender || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Tempat / Tgl Lahir:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">
                            {formData?.tempat_lahir || "-"}, {formData?.tanggal_lahir ? formatIndoDate(formData.tanggal_lahir) : "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Pendidikan Terakhir:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{formData?.pendidikan || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Kontak WhatsApp:</span>
                          <span className="font-semibold text-brand-700 mt-0.5 block">{formData?.whatsapp || phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Email:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{formData?.email || email}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-slate-400 block font-medium">Pengalaman Kerja:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{formData?.pengalaman_kerja || "-"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : isLsp ? (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <Card className="rounded-2xl border-slate-200 shadow-soft">
                    <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <Award className="w-4 h-4 text-brand-600" />
                        Skema Sertifikasi Profesi (LSP BBSPJIKKP)
                      </CardTitle>
                      <Badge variant="outline">BNSP</Badge>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">Nomor Permohonan:</span>
                          <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">{noOrder}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Tanggal Pengajuan:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">
                            {formatIndoDate(permohonan?.created_at || permohonan?.tgl_order, true)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Skema / Bidang Sertifikasi:</span>
                          <span className="font-bold text-slate-900 mt-0.5 block">
                            {formData?.jenis_produk || "Sertifikasi Kompetensi Profesi"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Jabatan Pekerjaan:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">
                            {formData?.jabatan || "-"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Data Calon Asesi */}
                  <Card className="rounded-2xl border-slate-200 shadow-soft">
                    <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <UserCheck className="w-4 h-4 text-brand-600" />
                        Data Calon Asesi BNSP
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-slate-400 block font-medium">Nama Lengkap Asesi:</span>
                          <span className="font-bold text-slate-900 mt-0.5 block text-sm">{formData?.nama_lengkap || namaPemohon}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">NIK:</span>
                          <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{formData?.nik_peserta || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Kewarganegaraan:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{formData?.kewarganegaraan || "Indonesia"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Tempat / Tgl Lahir:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">
                            {formData?.tempat_lahir || "-"}, {formData?.tanggal_lahir ? formatIndoDate(formData.tanggal_lahir) : "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Pendidikan Terakhir:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{formData?.pendidikan || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Kontak WhatsApp:</span>
                          <span className="font-semibold text-brand-700 mt-0.5 block">{formData?.whatsapp || phone}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  {/* Ringkasan Parameter Pengajuan */}
                  <Card className="rounded-2xl border-slate-200 shadow-soft">
                    <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <FileText className="w-4 h-4 text-brand-600" />
                        Data Permohonan
                      </CardTitle>
                      <Badge variant="outline">{layananName}</Badge>
                    </CardHeader>
                    <CardContent className="p-5 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">Nomor Permohonan:</span>
                          <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">{noOrder}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Jenis / Tipe Permohonan:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">
                            {formData?.tipe_pengajuan || formData?.jenis_pengajuan || "Permohonan Baru"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Tanggal Pengajuan:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">
                            {formatIndoDate(permohonan?.created_at || permohonan?.tgl_order, true)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Skema / Lingkup Layanan:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{layananName}</span>
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
                                <div className="flex flex-wrap items-center gap-2.5 mt-2 pl-7 text-slate-500">
                                  {item.standar_sni_iso && (
                                    <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md border border-brand-200 font-semibold text-[11px]">
                                      Standar SNI/ISO: {item.standar_sni_iso}
                                    </span>
                                  )}
                                  {item.merk_dagang && (
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                                      Merek: <b>{item.merk_dagang}</b>
                                    </span>
                                  )}
                                  {item.tipe_jenis && (
                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                                      Tipe: {item.tipe_jenis}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {item.estimasi_tarif > 0 && (
                                <div className="text-right pl-7 sm:pl-0 shrink-0">
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
                </div>
              )
            )}

            {/* TAB 2: DATA PERUSAHAAN & PABRIK */}
            {activeTab === "perusahaan" && (
              isPup ? (
                <PupDetailLaboratoriumTab
                  permohonan={permohonan}
                  formPup={formPupData}
                  formatIndoDate={formatIndoDate}
                />
              ) : isInspeksi ? (
                <InspeksiDetailPelangganTab
                  permohonan={permohonan}
                  formInspeksi={formInspeksiData}
                  formatIndoDate={formatIndoDate}
                />
              ) : (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  {/* Profil & Identitas Legal Perusahaan */}
                  <Card className="rounded-2xl border-slate-200 shadow-soft">
                    <CardHeader className="border-b border-slate-100 pb-3">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <Building2 className="w-4 h-4 text-brand-600" />
                        Identitas & Legalitas Perusahaan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="sm:col-span-2">
                          <span className="text-slate-400 block font-medium">Nama Perusahaan / Pemohon:</span>
                          <span className="font-bold text-slate-900 text-sm mt-0.5 block">{namaPemohon}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Nomor Pokok Wajib Pajak (NPWP):</span>
                          <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{npwp}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Nomor Induk Berusaha (NIB):</span>
                          <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{nib}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Nomor Akta Pendirian:</span>
                          <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{noAkta}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Total Tenaga Kerja Tetap:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{totalKaryawan} Orang</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-slate-400 block font-medium">Alamat Kantor Pusat / Operasional:</span>
                          <span className="font-medium text-slate-700 mt-0.5 block bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                            {alamat}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pimpinan & Penanggung Jawab Teknis */}
                  <Card className="rounded-2xl border-slate-200 shadow-soft">
                    <CardHeader className="border-b border-slate-100 pb-3">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <Users className="w-4 h-4 text-brand-600" />
                        Pimpinan & Kontak Person (PIC)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">Nama Pimpinan / Direktur Utama:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{namaPimpinan}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Nama Wakil Manajemen (MR):</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{wakilManajemen}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Penanggung Jawab Permohonan (PIC):</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{pic}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Nomor WhatsApp / Telepon:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {phone}
                          </span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-slate-400 block font-medium">Alamat Email Resmi:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {email}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Daftar Pabrik & Fasilitas Produksi */}
                  <Card className="rounded-2xl border-slate-200 shadow-soft">
                    <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <Factory className="w-4 h-4 text-brand-600" />
                        Lokasi Pabrik & Fasilitas Produksi ({pabriks.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-4 space-y-3">
                      {pabriks.length > 0 ? (
                        pabriks.map((pabrik: any, idx: number) => (
                          <div key={pabrik.id || idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-[10px]">
                                  {idx + 1}
                                </span>
                                {pabrik.nama_pabrik || pabrik.nama || "Pabrik Utama"}
                              </div>
                              {pabrik.status_pabrik && (
                                <Badge variant="outline">{pabrik.status_pabrik}</Badge>
                              )}
                            </div>
                            <div className="text-slate-600 flex items-start gap-1.5 pl-7">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>{pabrik.alamat_pabrik || pabrik.alamat || "-"}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-7 pt-1 text-slate-500">
                              {pabrik.kontak_pabrik && <div>Kontak: {pabrik.kontak_pabrik}</div>}
                              {pabrik.telepon_pabrik && <div>Telp: {pabrik.telepon_pabrik}</div>}
                              {pabrik.luas_pabrik && <div>Luas: {pabrik.luas_pabrik} m²</div>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">Data pabrik mengacu pada alamat kantor operasional pemohon.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            )}

            {/* TAB 3: BERKAS PERSYARATAN & DOKUMEN PENDUKUNG */}
            {activeTab === "dokumen" && (
              isPup ? (
                <PupDetailKomitmenTab
                  permohonan={permohonan}
                  formPup={formPupData}
                  formatIndoDate={formatIndoDate}
                />
              ) : (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  {/* Surat Pernyataan Persetujuan LS (Jika Diterbitkan oleh Operator LS) */}
                  {pernyataanFile && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-emerald-950">Surat Pernyataan Persetujuan LS (Resmi)</h4>
                          <p className="text-xs text-emerald-800 mt-0.5">
                            Dokumen persetujuan resmi telah diterbitkan oleh Operator Lembaga Sertifikasi (SIS).
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="primary"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs shrink-0"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() =>
                          openPdfDoc(
                            getFileUrl(pernyataanFile),
                            "Surat Pernyataan Persetujuan LS",
                            `Persetujuan-LS-${permohonan?.no_permohonan || id}.pdf`
                          )
                        }
                      >
                        Buka Dokumen Persetujuan
                      </Button>
                    </div>
                  )}

                  {/* Daftar Berkas Persyaratan */}
                  {(
                    <Card className="rounded-2xl border-slate-200 shadow-soft">
                      <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                          <FileCheck2 className="w-4 h-4 text-brand-600" />
                          Berkas Persyaratan Permohonan
                        </CardTitle>
                        <span className="text-xs text-slate-500 font-medium">
                          {Object.keys(docs).length} Dokumen Terunggah
                        </span>
                      </CardHeader>
                      <CardContent className="p-5 pt-4">
                        {Object.keys(docs).length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(docs).map(([key, val]: [string, any]) => {
                              if (!val || typeof val !== "string") return null
                              const docTitle = getDocLabel(key)
                              return (
                                <div
                                  key={key}
                                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-brand-50/40 hover:border-brand-300 transition-all flex items-center justify-between text-xs group"
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-brand-600 shrink-0">
                                      <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="truncate">
                                      <span className="font-semibold text-slate-800 block truncate">{docTitle}</span>
                                      <span className="text-[10px] text-slate-400 block truncate">Format: Berkas Digital (PDF/Doc)</span>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 group-hover:text-brand-600 group-hover:border-brand-200 transition-all shrink-0 ml-2"
                                    onClick={() =>
                                      openPdfDoc(
                                        getFileUrl(val),
                                        docTitle,
                                        `${key}-${permohonan?.no_permohonan || id}.pdf`
                                      )
                                    }
                                    title="Buka Pratinjau Berkas"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="p-6 text-center text-slate-400">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p className="text-xs italic">Belum ada dokumen persyaratan yang diunggah.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )
            )}

            {/* TAB 4: PENAWARAN BIAYA & TAGIHAN (DEDICATED TAB) */}
            {activeTab === "biaya" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                {/* Surat Penawaran Biaya Card */}
                {Boolean(
                  penawaran ||
                  status === "MENUNGGU_PERSETUJUAN_PELANGGAN" ||
                  status === "PENAWARAN_BIAYA" ||
                  totalBiayaPenawaran > 0 ||
                  rincianList.length > 0 ||
                  permohonan?.file_surat_penawaran ||
                  permohonan?.harga_permohonan ||
                  isPup
                ) ? (
                  <Card className="rounded-2xl shadow-soft overflow-hidden border border-slate-200 bg-white">
                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isPenawaranDisetujui || isPup ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            {isPup
                              ? "Rincian Tagihan Biaya Uji Profisiensi"
                              : isPelatihan
                                ? "Penawaran Biaya Bimbingan Teknis & Pelatihan"
                                : isLsp
                                  ? "Penawaran Biaya Sertifikasi Profesi (LSP)"
                                  : isGrk
                                    ? "Penawaran Biaya Validasi & Verifikasi GRK"
                                    : isInspeksi
                                      ? "Penawaran Biaya Jasa Inspeksi"
                                      : "Surat Penawaran Biaya Layanan Sertifikasi"}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {isPup
                              ? "Rincian tarif PNBP resmi keikutsertaan Uji Profisiensi Kalibrasi sesuai skema terpilih."
                              : isPelatihan
                                ? "Rincian tarif dan estimasi biaya bimbingan teknis / pelatihan industri."
                                : isLsp
                                  ? "Rincian biaya uji kompetensi dan sertifikasi profesi BNSP."
                                  : isGrk
                                    ? "Rincian estimasi biaya penugasan validator/verifikator gas rumah kaca."
                                    : isInspeksi
                                      ? "Rincian tarif PNBP resmi jasa inspeksi karung plastik banpang."
                                      : isPendingApproval
                                        ? "Tim Marketing telah menerbitkan estimasi biaya definitif. Mohon tinjau dan berikan persetujuan Anda."
                                        : isPenawaranDisetujui
                                          ? "Penawaran biaya telah disetujui. Menunggu atau telah diterbitkan tagihan resmi."
                                          : "Penawaran biaya dalam peninjauan oleh Marketing."}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            isPup || isPenawaranDisetujui
                              ? "success"
                              : isPenawaranDitolak
                                ? "danger"
                                : isPendingApproval
                                  ? "warning"
                                  : "neutral"
                          }
                        >
                          {isPup
                            ? "Tarif PNBP Ditetapkan"
                            : isPenawaranDisetujui
                              ? "Telah Disetujui"
                              : isPenawaranDitolak
                                ? "Ditolak / Negosiasi"
                                : isPendingApproval
                                  ? "Menunggu Persetujuan"
                                  : "Dalam Proses"}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5 space-y-4">
                      {/* Banner Diskon Bundling jika ada */}
                      {isPup && Number(formPupData?.diskon_nominal) > 0 && (
                        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                          <div className="flex items-center gap-2">
                            <span>
                              <strong>Paket Diskon Bundling Spesial:</strong> Anda mendapatkan potongan biaya sebesar <strong>Rp {Number(formPupData.diskon_nominal).toLocaleString("id-ID")}</strong> untuk pendaftaran paket Centrifuge + Overhead Stirrer.
                            </span>
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] shrink-0">
                            Hemat Rp {Number(formPupData.diskon_nominal).toLocaleString("id-ID")}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 shadow-xs">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Total Biaya Penawaran
                          </span>
                          <span className="text-xl font-extrabold text-brand-700 mt-1 block">
                            Rp {totalBiayaPenawaran.toLocaleString("id-ID")}
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 shadow-xs">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Dokumen Surat Penawaran
                          </span>
                          {penawaran?.file_surat_penawaran ? (
                            <button
                              type="button"
                              onClick={() =>
                                openPdfDoc(
                                  getFileUrl(penawaran.file_surat_penawaran),
                                  "Surat Penawaran Biaya Resmi",
                                  `Penawaran-Biaya-${permohonan?.no_permohonan || id}.pdf`
                                )
                              }
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 mt-2 text-left"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Lihat Surat Penawaran Resmi (PDF)
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 mt-2 block">
                              Dokumen dilampirkan via sistem
                            </span>
                          )}
                        </div>

                        {penawaran?.catatan && (
                          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 shadow-xs">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                              Catatan Marketing
                            </span>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                              {penawaran.catatan}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Rincian Komponen Biaya Table */}
                      {rincianList.length > 0 && (
                        <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden bg-white">
                          <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 text-xs font-bold text-slate-700">
                            Rincian Komponen Biaya
                          </div>
                          <div className="divide-y divide-slate-100">
                            {rincianList.map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/50"
                              >
                                <div className="flex-1">
                                  <span className="font-semibold text-slate-800">
                                    {item.nama_item || item.item_bayar || `Item #${idx + 1}`}
                                  </span>
                                  <span className="text-slate-400 text-[11px] ml-2">
                                    Qty: {item.qty || item.kuantitas || 1}
                                  </span>
                                </div>
                                <span className={`font-mono font-bold ${Number(item.subtotal || item.harga_satuan || 0) < 0 ? "text-emerald-600" : "text-slate-800"}`}>
                                  {Number(item.subtotal || item.harga_satuan || 0) < 0 ? "-Rp " : "Rp "}
                                  {Math.abs(Number(
                                    item.subtotal ||
                                    (item.nominal || item.harga_satuan || 0) * (item.qty || item.kuantitas || 1)
                                  )).toLocaleString("id-ID")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tombol Aksi Persetujuan jika pending */}
                      {isPendingApproval && (
                        <div className="pt-3 flex items-center gap-3 border-t border-slate-100">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprovalPenawaran("SETUJU")}
                            isLoading={approvalLoading}
                            leftIcon={<CheckCircle className="w-4 h-4" />}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                          >
                            Setujui Penawaran Biaya Ini
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowRejectModal(true)}
                            disabled={approvalLoading}
                            className="text-amber-800 border-amber-300 hover:bg-amber-100 text-xs"
                          >
                            Ajukan Negosiasi / Tolak
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 space-y-2">
                    <CreditCard className="w-8 h-8 mx-auto text-slate-400" />
                    <h4 className="text-sm font-bold text-slate-700">Penawaran Biaya Belum Diterbitkan</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Tim Kami sedang meninjau lingkup permohonan sertifikasi Anda untuk menerbitkan penawaran biaya resmi.
                    </p>
                  </div>
                )}

                {/* Rincian Tagihan & Dokumen Billing Lengkap */}
                <Card className="rounded-2xl border-slate-200 shadow-soft">
                  <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                      <FileText className="w-4 h-4 text-brand-600" />
                      Status Billing & Dokumen Keuangan
                    </CardTitle>
                    <Badge variant={permohonan?.status_bayar === "LUNAS" ? "success" : "warning"}>
                      {permohonan?.status_bayar === "LUNAS" ? "Lunas" : "Menunggu Pembayaran"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-5 pt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Kotak Invoice */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">Dokumen Invoice</span>
                          {permohonan?.pdf_tte ? (
                            <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg">
                              TTE BSrE Sah
                            </span>
                          ) : permohonan?.tte_invoice_requested ? (
                            <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200 rounded-lg">
                              Menunggu TTE Bendahara
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] bg-slate-200/70 text-slate-600 font-semibold rounded-lg">
                              Digital Seal
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          Surat tagihan resmi berisi rincian tarif layanan dan nomor rekening perbendaharaan.
                        </p>
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

                      {/* Kotak Kuitansi */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">Kuitansi Pembayaran</span>
                          {permohonan?.status_bayar === "LUNAS" ? (
                            permohonan?.kuitansi_pdf_tte ? (
                              <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg">
                                TTE BSrE Sah
                              </span>
                            ) : permohonan?.tte_kuitansi_requested ? (
                              <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200 rounded-lg">
                                Menunggu TTE Bendahara
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 font-semibold rounded-lg">
                                Lunas
                              </span>
                            )
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] bg-slate-200/70 text-slate-500 font-semibold rounded-lg">
                              Belum Terbit
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          Bukti bayar sah yang diterbitkan otomatis saat status transaksi telah terverifikasi lunas.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            variant={permohonan?.status_bayar === "LUNAS" ? "success" : "outline"}
                            size="sm"
                            disabled={permohonan?.status_bayar !== "LUNAS"}
                            leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
                            onClick={() => openKuitansi({ id, no_permohonan: noOrder })}
                            className="flex-1 justify-center"
                          >
                            Buka Kuitansi
                          </Button>
                          {permohonan?.status_bayar === "LUNAS" && !permohonan?.kuitansi_pdf_tte && !permohonan?.tte_kuitansi_requested && (
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
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </>
      )
      }

      {/* Modal Ajukan Negosiasi / Tolak Penawaran */}
      {
        showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <h3 className="text-base font-bold text-slate-900">
                Tanggapan / Negosiasi Penawaran Biaya
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tuliskan alasan penolakan atau catatan negosiasi Anda agar Tim Marketing dapat meninjau dan memperbarui penawaran biaya.
              </p>
              <textarea
                className="w-full h-28 p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                placeholder="Contoh: Mohon tinjau kembali komponen biaya akomodasi atau estimasi durasi audit..."
                value={rejectCatatan}
                onChange={(e) => setRejectCatatan(e.target.value)}
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectModal(false)}
                  disabled={approvalLoading}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprovalPenawaran("TOLAK")}
                  isLoading={approvalLoading}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Kirim Tanggapan
                </Button>
              </div>
            </div>
          </div>
        )
      }

      {PdfPreviewModal}
    </div >
  )
}

export default DetailPermohonanPage
