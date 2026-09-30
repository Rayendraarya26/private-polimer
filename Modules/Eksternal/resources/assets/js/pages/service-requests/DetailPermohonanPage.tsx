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
  ExternalLink,
  Loader2,
  Package,
  Factory,
  Edit3,
  CreditCard,
  CheckCircle,
  Calendar,
  Users,
  UserCheck,
  Clock,
  ShieldCheck,
  MapPin,
  FileSpreadsheet,
  Info,
  CheckCircle2,
  ChevronDown,
  UserCheck2,
  FileCode2,
  Eye,
  Upload,
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
import { getWorkflowSteps } from "../../constants/workflowSteps"
import { formatIndoDate } from "../../utils/formatIndoDate"
import { getFileUrl, getDocLabel } from "../../utils/fileHelpers"
import { getStatusBadge, getStepIndex } from "../../utils/statusHelpers"

// Workflow step constants dipindahkan ke: constants/workflowSteps.ts
// resolveGrkFormData dipindahkan ke: utils/grkHelpers.ts

type TabKey = "permohonan" | "perusahaan" | "dokumen" | "biaya" | "jadwal_audit"



export const DetailPermohonanPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { openInvoice, openKuitansi, openSuratPenawaran, openLhu, onDownloadCertificate, openPdfDoc, PdfPreviewModal } = usePembayaran()

  const {
    loading,
    permohonan,
    formData,
    lingkup,
    refetch: fetchData,
    requestingTte,
    approvalLoading,
    bayarLoading,
    temuanSubmitting,
    showRejectModal,
    setShowRejectModal,
    rejectCatatan,
    setRejectCatatan,
    showTemuanModal,
    setShowTemuanModal,
    temuanCatatan,
    setTemuanCatatan,
    temuanFile,
    setTemuanFile,
    handleRequestTteInvoice,
    handleRequestTteKuitansi,
    handleApprovalPenawaran,
    handleSimulasiBayar,
    handleApproveTemuanTahap1,
  } = useDetailPermohonan(id)

  // UI-only state — tetap di sini karena tidak perlu di-share atau di-test secara terpisah
  const [activeTab, setActiveTab] = useState<TabKey>("permohonan")
  const [activeAuditStage, setActiveAuditStage] = useState<"tahap1" | "tahap2">("tahap1")
  const [showTimeline, setShowTimeline] = useState<boolean>(false)

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
    userPelanggan, detailPerusahaan, listPabrik,
  } = usePermohonanType(permohonan, formData, lingkup, id)

  const activeWorkflowSteps = getWorkflowSteps({
    isPup, isPelatihan, isLsp, isGrk, isKalibrasi, isInspeksi, isPengujian, isHalal, isMiniplant,
  })

  // ── Hook 3: form data resolvers, parsed collections, tracking logs ─────────
  const {
    formPupData, formKalibrasiData, formInspeksiData,
    formPengujianData, formHalalData, formMiniplantData, formGrkData,
    items, pabriks, docs,
    pernyataanFile,
    trackingLogs, jadwalTahap1Meta, jadwalTahap1Log,
    tglMulaiThp1, tglSelesaiThp1, timAuditorThp1, isJadwalThp1Ditetapkan,
    temuanRevisiThp1Log, temuanDisetujuiLog, laporanTahap1Log,
  } = useFormDataResolver(
    permohonan,
    formData,
    { isPup, isKalibrasi, isInspeksi, isPengujian, isHalal, isMiniplant, isGrk, isGrkValidasi },
    listPabrik,
  )


  const auditTahap1VerifiedLog = trackingLogs.find(
    (log: any) =>
      log?.milestone_code === "AUDIT_TAHAP_1_VERIFIED" ||
      log?.judul?.toLowerCase().includes("audit tahap 1 selesai & disetujui")
  )

  const isAuditTahap1Lolos = Boolean(auditTahap1VerifiedLog)
  const isTemuanSudahDisetujui = Boolean(temuanDisetujuiLog || isAuditTahap1Lolos)

  // Dokumen Rencana Audit Tahap 1 (Audit Plan dari Ketua Tim Auditor)
  const auditPlanThp1Attachment = Array.isArray(permohonan?.file_attachment)
    ? permohonan.file_attachment.find(
      (f: any) =>
        f?.kode === "AUDIT_PLAN_TAHAP_1" ||
        f?.kode === "AUDIT_PLAN_UPLOADED" ||
        f?.nama?.toLowerCase().includes("audit plan") ||
        f?.nama?.toLowerCase().includes("rencana audit")
    )
    : null

  const auditPlanThp1Log = trackingLogs.find(
    (log: any) =>
      log?.milestone_code === "AUDIT_PLAN_TAHAP_1_UPLOADED" ||
      log?.milestone_code === "AUDIT_PLAN_UPLOADED"
  )
  const auditPlanThp1Meta = typeof auditPlanThp1Log?.metadata === "string"
    ? JSON.parse(auditPlanThp1Log.metadata || "{}")
    : (auditPlanThp1Log?.metadata || {})

  const auditPlanThp1File =
    auditPlanThp1Attachment?.file_url ||
    auditPlanThp1Attachment?.path ||
    auditPlanThp1Meta?.file_url ||
    auditPlanThp1Meta?.path ||
    permohonan?.aud_thp1_file_jadwal ||
    null

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
  const isPendingApproval = Boolean(
    penawaran &&
    !isPenawaranDisetujui &&
    !isPenawaranDitolak && (
      penawaran?.status_persetujuan === "MENUNGGU" ||
      penawaran?.status === "MENUNGGU_PERSETUJUAN" ||
      penawaran?.status === "MENUNGGU" ||
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

  // Riwayat Timeline Tracking (seperti di SIS)
  const getTimelineEvents = () => {
    if (isPup) {
      if (trackingLogs && trackingLogs.length > 0) {
        return trackingLogs.map((log: any) => ({
          date: formatIndoDate(log.created_at, true),
          title: log.judul || "Pembaruan Status Uji Profisiensi",
          message: log.deskripsi || "-",
          type: log.milestone_code === "REVISI" ? "revisi" : "sukses",
          badgeText: log.milestone_code === "PERMOHONAN_MASUK" ? "Diajukan" : (isLunas && log.milestone_code === "LUNAS" ? "Lunas" : "Selesai"),
        }))
      }

      const pupEvents: Array<{
        date: string
        title: string
        message: string
        type: "informasi" | "revisi" | "sukses" | "menunggu"
        badgeText: string
      }> = []

      // 1. Pendaftaran Diajukan
      pupEvents.push({
        date: formatIndoDate(permohonan?.created_at || permohonan?.tgl_order, true),
        title: "Pendaftaran Uji Profisiensi Diajukan",
        message: `Pendaftaran kepesertaan Uji Profisiensi #${noOrder} telah berhasil diajukan oleh ${formPupData?.nama_lab_kalibrasi || namaPemohon}.`,
        type: "sukses",
        badgeText: "Diajukan",
      })

      // 2. Verifikasi Berkas
      if (status === "REVISI" || permohonan?.catatan_admin) {
        pupEvents.push({
          date: formatIndoDate(permohonan?.updated_at, true),
          title: "Verifikasi Berkas Teknis (Perlu Perbaikan)",
          message: permohonan?.catatan_admin
            ? `Catatan Panitia UP: "${permohonan.catatan_admin}". Mohon perbaiki formulir data laboratorium atau metode acuan.`
            : "Terdapat data permohonan yang memerlukan perbaikan dari pemohon.",
          type: "revisi",
          badgeText: "Perlu Revisi",
        })
      } else if (currentStepIdx >= 1) {
        pupEvents.push({
          date: formatIndoDate(permohonan?.updated_at, true),
          title: "Verifikasi Kelayakan Berkas & Kesesuaian Skema",
          message: "Panitia Uji Profisiensi BBSPJIKKP meninjau kesiapan metode kalibrasi dan kelengkapan peralatan peserta.",
          type: currentStepIdx > 1 ? "sukses" : "informasi",
          badgeText: currentStepIdx > 1 ? "Terverifikasi" : "Sedang Berjalan",
        })
      }

      // 3. Pembayaran PNBP
      if (isSiapBayar || currentStepIdx >= 2) {
        pupEvents.push({
          date: formatIndoDate(permohonan?.tgl_lunas || permohonan?.invoice_generated_at || permohonan?.updated_at, true),
          title: "Penerbitan Tagihan PNBP & Pembayaran",
          message: isLunas
            ? "Pembayaran tagihan PNBP telah terverifikasi LUNAS. Kuitansi resmi telah diterbitkan."
            : permohonan?.va
              ? `Tagihan PNBP telah diterbitkan dengan Virtual Account (${permohonan.va}). Menunggu pembayaran peserta.`
              : "Kode billing / Virtual Account tagihan PNBP sedang disiapkan oleh Bendahara Penerimaan.",
          type: isLunas ? "sukses" : "informasi",
          badgeText: isLunas ? "Lunas" : "Menunggu Pembayaran",
        })
      }

      // 4. Sirkulasi Artefak
      if (isLunas || currentStepIdx >= 3) {
        pupEvents.push({
          date: formatIndoDate(permohonan?.updated_at, true),
          title: "Sirkulasi & Distribusi Artefak Uji Profisiensi",
          message: isDone
            ? "Artefak kalibrasi telah selesai disirkulasikan dan dikembalikan ke BBSPJIKKP."
            : "Panitia Uji Profisiensi mempersiapkan jadwal pengiriman artefak kalibrasi sesuai rute sirkulasi laboratorium peserta.",
          type: isDone ? "sukses" : "informasi",
          badgeText: isDone ? "Selesai" : "Persiapan Sirkulasi",
        })
      }

      // 5. Evaluasi Hasil & Laporan Nilai En
      if (isDone) {
        pupEvents.push({
          date: formatIndoDate(permohonan?.updated_at, true),
          title: "Laporan Akhir Uji Profisiensi & Evaluasi Nilai En",
          message: "Laporan Hasil Evaluasi Nilai En resmi dan Sertifikat Keikutsertaan Uji Profisiensi telah diterbitkan.",
          type: "sukses",
          badgeText: "Selesai",
        })
      }

      return pupEvents
    }

    const events: Array<{
      date: string
      title: string
      message: string
      type: "informasi" | "revisi" | "sukses" | "menunggu"
      badgeText: string
    }> = []

    // 1. Pengajuan
    events.push({
      date: formatIndoDate(permohonan?.created_at || permohonan?.tgl_order, true),
      title: `Permohonan ${layananName} Diajukan`,
      message: `Formulir permohonan ${layananName} (${noOrder}) dan dokumen persyaratan awal telah berhasil diajukan oleh ${namaPemohon}.`,
      type: "sukses",
      badgeText: "Selesai",
    })

    // 2. Kajian Teknis & Verifikasi
    if (status === "REVISI" || permohonan?.catatan_admin) {
      events.push({
        date: formatIndoDate(permohonan?.updated_at, true),
        title: "Kajian Teknis & Verifikasi Berkas (Perlu Perbaikan)",
        message: permohonan?.catatan_admin
          ? `Catatan Tim Verifikator: "${permohonan.catatan_admin}". Mohon perbaiki formulir atau kelengkapan berkas.`
          : "Terdapat dokumen atau formulir yang memerlukan perbaikan dari pemohon.",
        type: "revisi",
        badgeText: "Perlu Revisi",
      })
    } else if (currentStepIdx >= 1) {
      events.push({
        date: formatIndoDate(permohonan?.updated_at, true),
        title: "Kajian Teknis & Verifikasi Kelayakan Dokumen",
        message: `Tim Verifikator dan Tim Penilai Teknis meninjau kelengkapan berkas persyaratan dan ruang lingkup ${layananName}.`,
        type: currentStepIdx > 1 ? "sukses" : "informasi",
        badgeText: currentStepIdx > 1 ? "Selesai" : "Sedang Berjalan",
      })
    }

    // 3. Penawaran Biaya
    if (penawaran || status === "PENAWARAN_BIAYA" || status === "MENUNGGU_PERSETUJUAN_PELANGGAN" || currentStepIdx >= 2) {
      events.push({
        date: formatIndoDate(penawaran?.created_at || permohonan?.updated_at, true),
        title: "Penerbitan Surat Penawaran Biaya Layanan",
        message: isPenawaranDisetujui
          ? `Penawaran biaya sebesar Rp ${totalBiayaPenawaran.toLocaleString("id-ID")} telah disetujui oleh pelanggan.`
          : isPenawaranDitolak
            ? `Penawaran biaya ditolak/dinegosiasikan oleh pelanggan dengan catatan: "${penawaran?.catatan || '-'}"`
            : `Estimasi tarif layanan sebesar Rp ${totalBiayaPenawaran.toLocaleString("id-ID")} telah diterbitkan. Menunggu persetujuan pelanggan.`,
        type: isPenawaranDisetujui ? "sukses" : isPenawaranDitolak ? "revisi" : "informasi",
        badgeText: isPenawaranDisetujui ? "Disetujui" : isPenawaranDitolak ? "Ditolak" : "Menunggu Persetujuan",
      })
    }

    // 4. Pembayaran / Billing
    if (isSiapBayar || currentStepIdx >= 3) {
      events.push({
        date: formatIndoDate(permohonan?.tgl_lunas || permohonan?.invoice_generated_at || permohonan?.updated_at, true),
        title: "Penerbitan Invoice & Pembayaran Tagihan",
        message: isLunas
          ? "Pembayaran tagihan telah terverifikasi LUNAS via Virtual Account BNI / SIMPONI. Kuitansi digital resmi telah diterbitkan."
          : permohonan?.va
            ? `Invoice tagihan telah diterbitkan dengan Virtual Account (${permohonan.va}). Menunggu pembayaran pemohon.`
            : "Invoice tagihan billing resmi sedang diproses oleh Bendahara Penerimaan.",
        type: isLunas ? "sukses" : "informasi",
        badgeText: isLunas ? "Lunas" : "Menunggu Pembayaran",
      })
    }

    // 5. Penjadwalan & Audit (Tahap 1 & 2)
    if (jadwalTahap1Log) {
      events.push({
        date: formatIndoDate(jadwalTahap1Log.created_at, true),
        title: jadwalTahap1Log.judul || "Jadwal Audit Tahap 1 Ditetapkan",
        message:
          jadwalTahap1Log.deskripsi ||
          `Audit dokumen Tahap 1 dijadwalkan pada ${formatIndoDate(tglMulaiThp1)} s/d ${formatIndoDate(tglSelesaiThp1)}. Tim: ${timAuditorThp1 || '-'}.`,
        type: "sukses",
        badgeText: "Tahap 1 Ditetapkan",
      })
    }

    if (temuanRevisiThp1Log) {
      events.push({
        date: formatIndoDate(temuanRevisiThp1Log.created_at, true),
        title: temuanRevisiThp1Log.judul || "Temuan Verifikasi Dokumen Tahap 1",
        message:
          temuanRevisiThp1Log.deskripsi ||
          "Terdapat catatan ketidaksesuaian/revisi pada dokumen persyaratan yang memerlukan perbaikan.",
        type: isAuditTahap1Lolos ? "informasi" : "revisi",
        badgeText: isAuditTahap1Lolos ? "Telah Diperbaiki" : "Perlu Revisi",
      })
    }

    if (laporanTahap1Log) {
      events.push({
        date: formatIndoDate(laporanTahap1Log.created_at, true),
        title: laporanTahap1Log.judul || "Laporan Audit Tahap 1 Selesai Disusun",
        message:
          laporanTahap1Log.deskripsi ||
          "Ketua Tim Auditor telah menyelesaikan laporan hasil audit dokumen Tahap 1 dan mengajukannya ke Koordinator.",
        type: "informasi",
        badgeText: "Laporan Diajukan",
      })
    }

    if (auditTahap1VerifiedLog) {
      events.push({
        date: formatIndoDate(auditTahap1VerifiedLog.created_at, true),
        title: auditTahap1VerifiedLog.judul || "Audit Tahap 1 Selesai & Disetujui",
        message:
          auditTahap1VerifiedLog.deskripsi ||
          "Koordinator Sertifikasi telah memverifikasi dan menyetujui Laporan Audit Tahap 1. Permohonan siap untuk Audit Tahap 2.",
        type: "sukses",
        badgeText: "Tahap 1 Lolos",
      })
    } else if (!jadwalTahap1Log && (isLunas || currentStepIdx >= 4)) {
      events.push({
        date: formatIndoDate(permohonan?.updated_at, true),
        title: "Penjadwalan & Pelaksanaan Audit (Tahap 1 & 2)",
        message: isDone
          ? "Seluruh rangkaian audit dokumen (Tahap 1) dan audit lapangan pabrik (Tahap 2) telah selesai dilaksanakan."
          : "Proses koordinasi penjadwalan audit kecukupan dokumen serta penetapan tim auditor oleh Lembaga Sertifikasi.",
        type: isDone ? "sukses" : "informasi",
        badgeText: isDone ? "Selesai" : "Sedang Berjalan",
      })
    }

    // 6. Keputusan Sertifikasi / Terbit
    if (isDone) {
      events.push({
        date: formatIndoDate(permohonan?.updated_at, true),
        title: "Keputusan Komite Teknis & Penerbitan Sertifikat SNI",
        message: "Sertifikat Kesesuaian / Sertifikat Penggunaan Tanda SNI resmi telah diterbitkan dan dapat diunduh oleh pemohon.",
        type: "sukses",
        badgeText: "Selesai",
      })
    }

    return events
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
      ) : (
        <>
          {/* TAB NAVIGATION (Model Grid Responsif - Menyesuaikan Jenis Layanan) */}
          <div className="bg-slate-100/80 p-2 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className={`grid grid-cols-2 sm:grid-cols-3 ${isSertifikasi ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-2`}>
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

              {isSertifikasi && (
                <button
                  type="button"
                  onClick={() => setActiveTab("jadwal_audit")}
                  className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === "jadwal_audit"
                    ? "bg-brand-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70"
                    }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="truncate">Jadwal & Tim Audit</span>
                  </div>
                </button>
              )}
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
                            {formData?.tipe_pengajuan || formData?.jenis_pengajuan || "Sertifikasi Baru (Awal)"}
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

                  {/* Ringkasan Kuesioner Kelayakan Teknis jika ada */}
                  {formData?.kuesioner_kelayakan && (
                    <Card className="rounded-2xl border-slate-200 shadow-soft">
                      <CardHeader className="border-b border-slate-100 pb-3">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                          <FileSpreadsheet className="w-4 h-4 text-brand-600" />
                          Kuesioner Kelayakan & Asesmen Mandiri
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-4 text-xs space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-slate-400 block font-medium">Sistem Manajemen Mutu yang Diterapkan:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">
                              {formData.kuesioner_kelayakan.sistem_mutu || "ISO 9001 / Terintegrasi"}
                            </span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-slate-400 block font-medium">Lembaga Penerbit Sertifikat Mutu:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">
                              {formData.kuesioner_kelayakan.lembaga_sertifikasi_mutu || "-"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
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
                  {isGrk ? (
                    <Card className="rounded-2xl border-slate-200 shadow-soft">
                      <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                          <FileCheck2 className="w-4 h-4 text-brand-600" />
                          {isGrkValidasi ? "Dokumen Persyaratan Validasi GRK" : "Dokumen Persyaratan Verifikasi GRK"}
                        </CardTitle>
                        <span className="text-xs text-slate-500 font-medium">
                          {(formGrkData?.dokumen || formGrkData?.dokumenItems || []).length} Dokumen Terdaftar
                        </span>
                      </CardHeader>
                      <CardContent className="p-0">
                        {Array.isArray(formGrkData?.dokumen || formGrkData?.dokumenItems) &&
                          (formGrkData?.dokumen || formGrkData?.dokumenItems).length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                <tr>
                                  <th className="py-3 px-4 text-center w-14">NO</th>
                                  <th className="py-3 px-4 min-w-[240px]">NAMA DOKUMEN</th>
                                  <th className="py-3 px-4 w-40 text-center">STATUS KETERSEDIAAN</th>
                                  <th className="py-3 px-4 min-w-[200px]">KETERANGAN</th>
                                  <th className="py-3 px-4 text-center w-32">AKSI</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {(formGrkData?.dokumen || formGrkData?.dokumenItems).map((dok: any, dIdx: number) => (
                                  <tr key={dok.id || dIdx} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3 px-4 text-center text-slate-400 font-medium">{dIdx + 1}</td>
                                    <td className="py-3 px-4 font-semibold text-slate-900">{dok.nama_dokumen || "-"}</td>
                                    <td className="py-3 px-4 text-center">
                                      {dok.status_ketersediaan === "TERSEDIA" ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                                          <CheckCircle2 className="w-3 h-3" /> Tersedia
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                          Tidak Tersedia
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-3 px-4 text-slate-600">{dok.keterangan || "-"}</td>
                                    <td className="py-3 px-4 text-center">
                                      {dok.file_path ? (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="p-1.5 rounded-lg border-slate-200 text-brand-600 hover:bg-brand-50"
                                          onClick={() =>
                                            openPdfDoc(
                                              getFileUrl(dok.file_path),
                                              dok.nama_dokumen || "Dokumen GRK",
                                              `GRK-${dok.nama_dokumen || "Dokumen"}.pdf`
                                            )
                                          }
                                        >
                                          <Eye className="w-3.5 h-3.5 mr-1" /> Lihat
                                        </Button>
                                      ) : (
                                        <span className="text-slate-400 text-[11px]">Lampiran Fisik</span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-6 text-center text-slate-400">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p className="text-xs italic">Belum ada dokumen persyaratan yang tercatat.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="rounded-2xl border-slate-200 shadow-soft">
                      <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                          <FileCheck2 className="w-4 h-4 text-brand-600" />
                          Berkas Persyaratan Permohonan Sertifikasi
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

            {/* TAB 5: JADWAL & TIM AUDIT (Tahap 1 & Tahap 2) */}
            {activeTab === "jadwal_audit" && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                {/* Sub-Tabs: Tahap 1 vs Tahap 2 */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <button
                    type="button"
                    onClick={() => setActiveAuditStage("tahap1")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeAuditStage === "tahap1"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Audit Tahap 1 (Kecukupan Dokumen)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAuditStage("tahap2")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeAuditStage === "tahap2"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    <Factory className="w-3.5 h-3.5" />
                    Audit Tahap 2 (Lapangan & Pabrik)
                  </button>
                </div>

                {/* KONTEN TAHAP 1 */}
                {activeAuditStage === "tahap1" && (
                  <div className="space-y-6">

                    {/* 1. STATUS & TAHAPAN SIKLUS AUDIT TAHAP 1 (LIFECYCLE STEPPER) */}
                    <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-slate-900 to-brand-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-brand-300">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">Status & Alur Audit Tahap 1 (Audit Kecukupan Dokumen)</h3>
                            <p className="text-[11px] text-slate-300">Verifikasi pemenuhan persyaratan sistem mutu & dokumen kelayakan SNI/ISO</p>
                          </div>
                        </div>
                        <Badge variant={isAuditTahap1Lolos ? "success" : isTemuanSudahDisetujui ? "primary" : temuanRevisiThp1Log ? "warning" : isJadwalThp1Ditetapkan ? "primary" : "neutral"}>
                          {isAuditTahap1Lolos
                            ? "Tahap 1 Lolos / Disetujui"
                            : isTemuanSudahDisetujui
                              ? "Menunggu Verifikasi Auditor"
                              : temuanRevisiThp1Log
                                ? "Perlu Tindak Lanjut Pemohon"
                                : isJadwalThp1Ditetapkan
                                  ? "Jadwal Ditetapkan"
                                  : "Menunggu Penjadwalan"}
                        </Badge>
                      </div>

                      <div className="p-5 bg-slate-50/50 border-b border-slate-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          {/* Step 1: Penjadwalan */}
                          <div className={`p-3.5 rounded-xl border transition-all ${isJadwalThp1Ditetapkan ? "bg-white border-emerald-300 ring-2 ring-emerald-500/10 shadow-xs" : "bg-white border-slate-200"}`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-[11px] text-slate-700">1. Jadwal & Tim</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isJadwalThp1Ditetapkan ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                                {isJadwalThp1Ditetapkan ? "Ditetapkan" : "Menunggu"}
                              </span>
                            </div>
                            <span className="font-semibold text-slate-900 block truncate">
                              {tglMulaiThp1 && tglSelesaiThp1
                                ? `${formatIndoDate(tglMulaiThp1)} s/d ${formatIndoDate(tglSelesaiThp1)}`
                                : tglMulaiThp1
                                  ? formatIndoDate(tglMulaiThp1)
                                  : "Menunggu LSPro"}
                            </span>
                          </div>

                          {/* Step 2: Audit Plan */}
                          <div className={`p-3.5 rounded-xl border transition-all ${auditPlanThp1File ? "bg-white border-emerald-300 ring-2 ring-emerald-500/10 shadow-xs" : "bg-white border-slate-200"}`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-[11px] text-slate-700">2. Rencana Audit (Plan)</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${auditPlanThp1File ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                                {auditPlanThp1File ? "Terbit" : "Proses"}
                              </span>
                            </div>
                            <span className="font-semibold text-slate-900 block truncate">
                              {auditPlanThp1File ? "Audit Plan PDF Tersedia" : "Disusun Ketua Tim"}
                            </span>
                          </div>

                          {/* Step 3: Tinjauan & Temuan */}
                          <div className={`p-3.5 rounded-xl border transition-all ${temuanRevisiThp1Log ? (isTemuanSudahDisetujui ? "bg-white border-blue-300 ring-2 ring-blue-500/10 shadow-xs" : "bg-amber-50 border-amber-300 ring-2 ring-amber-500/20 shadow-xs") : isAuditTahap1Lolos ? "bg-white border-emerald-300 shadow-xs" : "bg-white border-slate-200"}`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-[11px] text-slate-700">3. Evaluasi Dokumen</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isAuditTahap1Lolos ? "bg-emerald-100 text-emerald-800" : temuanRevisiThp1Log ? (isTemuanSudahDisetujui ? "bg-blue-100 text-blue-800" : "bg-amber-200 text-amber-900") : "bg-slate-100 text-slate-500"}`}>
                                {isAuditTahap1Lolos
                                  ? "Memenuhi Syarat"
                                  : isTemuanSudahDisetujui
                                    ? "Tindak Lanjut Terkirim"
                                    : temuanRevisiThp1Log
                                      ? "Ada Temuan"
                                      : "Dalam Tinjauan"}
                              </span>
                            </div>
                            <span className="font-semibold text-slate-900 block truncate">
                              {isAuditTahap1Lolos
                                ? "Lolos Tanpa Temuan"
                                : isTemuanSudahDisetujui
                                  ? "Verifikasi Perbaikan"
                                  : temuanRevisiThp1Log
                                    ? "Perlu Tindak Lanjut"
                                    : "Pemeriksaan Dokumen"}
                            </span>
                          </div>

                          {/* Step 4: Laporan & Pengesahan */}
                          <div className={`p-3.5 rounded-xl border transition-all ${isAuditTahap1Lolos ? "bg-white border-emerald-300 ring-2 ring-emerald-500/10 shadow-xs" : "bg-white border-slate-200"}`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-[11px] text-slate-700">4. Pengesahan Koordinator</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isAuditTahap1Lolos ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                                {isAuditTahap1Lolos ? "Disahkan" : "Menunggu"}
                              </span>
                            </div>
                            <span className="font-semibold text-slate-900 block truncate">
                              {isAuditTahap1Lolos ? "Lanjut ke Tahap 2" : "Verifikasi Laporan"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* 2. HASIL EVALUASI & TINDAK LANJUT PERSETUJUAN TEMUAN */}
                    <div className="space-y-4">
                      {/* CASE A: ADA TEMUAN & BELUM DISETUJUI / BELUM DIKIRIM PERBAIKAN */}
                      {temuanRevisiThp1Log && !isAuditTahap1Lolos && !isTemuanSudahDisetujui && (
                        <Card className="rounded-2xl border-amber-300 bg-amber-50/70 shadow-soft overflow-hidden">
                          <div className="p-5 border-b border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-100/50">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs">
                                <AlertTriangle className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-amber-950">
                                  Catatan Temuan & Permintaan Perbaikan Dokumen Tahap 1
                                </h3>
                                <p className="text-xs text-amber-800 mt-0.5">
                                  Tim Auditor menemukan ketidaksesuaian dokumen yang membutuhkan konfirmasi dan perbaikan dari pemohon.
                                </p>
                              </div>
                            </div>
                            <Badge variant="warning">Perlu Respon Pemohon</Badge>
                          </div>

                          <CardContent className="p-5 space-y-4 text-xs">
                            {/* Kotak Rincian Temuan dari Auditor */}
                            <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                  <Info className="w-3.5 h-3.5 text-amber-600" />
                                  Rincian Catatan / Temuan dari Tim Auditor SIS:
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {formatIndoDate(temuanRevisiThp1Log.created_at, true)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line font-medium">
                                {temuanRevisiThp1Log.deskripsi || "Terdapat beberapa dokumen persyaratan sistem manajemen mutu yang perlu diperbarui atau disesuaikan dengan standar acuan."}
                              </p>
                            </div>

                            {/* Tombol Aksi Persetujuan Temuan & Upload Berkas */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <span className="font-bold text-amber-950 text-xs block">
                                  Persetujuan & Unggah Bukti Dokumen Perbaikan:
                                </span>
                                <span className="text-[11px] text-amber-800 block mt-0.5">
                                  Klik tombol di samping untuk mengisi keterangan tindak lanjut serta mengunggah berkas revisi ke Tim Auditor.
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="primary"
                                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs h-9 px-4 shadow-xs shrink-0"
                                leftIcon={<Upload className="w-4 h-4" />}
                                onClick={() => setShowTemuanModal(true)}
                              >
                                Setujui Temuan & Kirim Berkas Perbaikan
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* CASE B: TEMUAN TELAH DISETUJUI & BERKAS PERBAIKAN TELAH DIKIRIM (MENUNGGU VERIFIKASI) */}
                      {temuanRevisiThp1Log && !isAuditTahap1Lolos && isTemuanSudahDisetujui && (
                        <Card className="rounded-2xl border-blue-200 bg-blue-50/50 shadow-soft overflow-hidden">
                          <div className="p-5 border-b border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-100/40">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
                                <CheckCircle className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-blue-950">
                                  Tindak Lanjut & Berkas Perbaikan Telah Dikirim ke Tim Auditor
                                </h3>
                                <p className="text-xs text-blue-800 mt-0.5">
                                  Persetujuan dan berkas dokumen perbaikan telah berhasil disinkronkan ke sistem SIS dan sedang diverifikasi oleh Tim Auditor.
                                </p>
                              </div>
                            </div>
                            <Badge variant="primary">Menunggu Verifikasi Auditor</Badge>
                          </div>

                          <CardContent className="p-5 space-y-3 text-xs">
                            <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-xs">Status Tindak Lanjut:</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                                  Berkas Terkirim ke Auditor
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed">
                                {temuanDisetujuiLog?.deskripsi || "Persetujuan temuan dan berkas perbaikan telah berhasil dikirimkan ke Tim Auditor SIS untuk diverifikasi."}
                              </p>
                              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500">
                                <span>Halaman verifikasi auditor di SIS telah aktif dan dijadwalkan untuk penutupan temuan.</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs h-7 px-2.5 bg-white hover:bg-slate-50 border-blue-300 text-blue-700 shrink-0"
                                  onClick={() => setShowTemuanModal(true)}
                                >
                                  Kirim Tambahan Berkas / Catatan
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* CASE C: AUDIT TAHAP 1 LOLOS / VERIFIKASI KOORDINATOR SELESAI */}
                      {isAuditTahap1Lolos && (
                        <Card className="rounded-2xl border-emerald-200 bg-emerald-50/50 shadow-soft overflow-hidden">
                          <div className="p-5 border-b border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-100/40">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                                <ShieldCheck className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-emerald-950">
                                  Laporan Hasil Audit Tahap 1 Telah Disetujui & Disahkan
                                </h3>
                                <p className="text-xs text-emerald-800 mt-0.5">
                                  Koordinator Sertifikasi telah memverifikasi seluruh dokumen persyaratan dan menyatakan permohonan <b>Memenuhi Syarat (Lolos Tahap 1)</b>.
                                </p>
                              </div>
                            </div>
                            <Badge variant="success">Tahap 1 Selesai</Badge>
                          </div>

                          <CardContent className="p-5 space-y-3 text-xs">
                            <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-xs">Kesimpulan & Rekomendasi Hasil Audit Dokumen:</span>
                                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  Direkomendasikan ke Tahap 2
                                </span>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed">
                                {auditTahap1VerifiedLog?.deskripsi || "Seluruh berkas persyaratan sistem manajemen mutu telah memenuhi ketentuan standar acuan SNI/ISO. Permohonan direkomendasikan untuk melanjutkan ke tahapan Audit Lapangan & Pabrik (Tahap 2)."}
                              </p>
                              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-500">
                                <span>Tahapan berikutnya: Operator Lembaga Sertifikasi akan menyusun jadwal kunjungan audit lapangan ke fasilitas pabrik.</span>
                                <Button
                                  size="sm"
                                  variant="primary"
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-3 shrink-0"
                                  onClick={() => setActiveAuditStage("tahap2")}
                                >
                                  Lihat Rencana Tahap 2 &rarr;
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* 3. RINCIAN PARAMETER JADWAL & DOKUMEN RENCANA AUDIT (AUDIT PLAN) */}
                    <Card className="rounded-2xl border-slate-200 shadow-soft">
                      <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                          <Calendar className="w-4 h-4 text-brand-600" />
                          Rincian Jadwal Pelaksanaan Audit Tahap 1
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-4 space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-slate-400 block font-medium">Tanggal Pelaksanaan:</span>
                            <span className="font-bold text-slate-900 mt-1 block">
                              {tglMulaiThp1 && tglSelesaiThp1
                                ? `${formatIndoDate(tglMulaiThp1)} s/d ${formatIndoDate(tglSelesaiThp1)}`
                                : tglMulaiThp1
                                  ? formatIndoDate(tglMulaiThp1)
                                  : "Menunggu Penetapan"}
                            </span>
                            <span className="text-[11px] text-slate-500 mt-0.5 block">Durasi: 1 - 2 Hari Kerja</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-slate-400 block font-medium">Standar Acuan Audit:</span>
                            <span className="font-bold text-slate-900 mt-1 block truncate">
                              {permohonan?.aud_thp1_standart_acuan || "SNI ISO 9001:2015 & SNI Produk"}
                            </span>
                            <span className="text-[11px] text-slate-500 mt-0.5 block">Sistem Mutu & Regulasi Teknis</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-slate-400 block font-medium">Tujuan Pelaksanaan Audit:</span>
                            <span className="font-bold text-slate-900 mt-1 block truncate">
                              {permohonan?.aud_thp1_tujuan || "Pemeriksaan Kecukupan Dokumen Mutu"}
                            </span>
                            <span className="text-[11px] text-slate-500 mt-0.5 block">Kesesuaian Regulasi Teknis</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                            <div>
                              <span className="text-slate-400 block font-medium">Rencana Jadwal Audit (Plan):</span>
                              <span className="font-bold text-slate-900 mt-1 block">
                                {auditPlanThp1File ? "Audit Plan PDF Tersedia" : "Belum Diunggah"}
                              </span>
                            </div>
                            <div className="mt-2">
                              {auditPlanThp1File ? (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  className="text-xs h-7 p-5 bg-brand-600 hover:bg-brand-700 text-white w-full justify-center"
                                  leftIcon={<Eye className="w-3 h-3" />}
                                  onClick={() =>
                                    openPdfDoc(
                                      getFileUrl(auditPlanThp1File),
                                      "Rencana Jadwal Audit Tahap 1 (Audit Plan)",
                                      `Audit-Plan-Tahap1-${permohonan?.no_permohonan || id}.pdf`
                                    )
                                  }
                                >
                                  Buka Dokumen Audit Plan (PDF)
                                </Button>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">
                                  Menunggu Pengunggahan oleh Ketua Tim
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 4. SUSUNAN TIM AUDITOR TAHAP 1 */}
                    <Card className="rounded-2xl border-slate-200 shadow-soft">
                      <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                          <Users className="w-4 h-4 text-brand-600" />
                          Susunan Tim Auditor Tahap 1 (Lembaga Sertifikasi Produk BBSPJIKKP)
                        </CardTitle>
                        <Badge variant="outline">Tim Auditor Resmi</Badge>
                      </CardHeader>
                      <CardContent className="p-5 pt-4">
                        {timAuditorThp1 ? (
                          <div className="divide-y divide-slate-100 text-xs">
                            {timAuditorThp1.split(",").map((auditorStr: string, idx: number) => {
                              const trimmed = auditorStr.trim()
                              const isLead = trimmed.toLowerCase().includes("ketua") || trimmed.toLowerCase().includes("lead")
                              return (
                                <div key={idx} className="py-3 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs ${isLead ? "bg-brand-100 text-brand-700" : "bg-slate-100 text-slate-700"}`}>
                                      {isLead ? "LA" : "AT"}
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-900 block">{trimmed}</span>
                                      <span className="text-slate-500 text-[11px]">
                                        {isLead ? "Ketua Tim Auditor (Lead Auditor) — BBSPJIKKP" : "Auditor Anggota / Tenaga Ahli Teknis — BBSPJIKKP"}
                                      </span>
                                    </div>
                                  </div>
                                  <Badge variant={isLead ? "primary" : "neutral"}>
                                    {isLead ? "Lead Auditor" : "Auditor"}
                                  </Badge>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-100 text-xs">
                            <div className="py-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                                  LA
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block">Ketua Tim Auditor (Lead Auditor)</span>
                                  <span className="text-slate-500 text-[11px]">LSPro BBSPJIKKP — Auditor Bersertifikasi</span>
                                </div>
                              </div>
                              <Badge variant="neutral">Lead Auditor</Badge>
                            </div>

                            <div className="py-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                                  AT
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block">Anggota Auditor Teknis</span>
                                  <span className="text-slate-500 text-[11px]">LSPro BBSPJIKKP — Tenaga Ahli Bidang SNI</span>
                                </div>
                              </div>
                              <Badge variant="neutral">Technical Auditor</Badge>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                  </div>
                )}

                {/* KONTEN TAHAP 2 */}
                {activeAuditStage === "tahap2" && (
                  <div className="space-y-6">
                    {/* Jadwal Pelaksanaan Tahap 2 */}
                    <Card className="rounded-2xl border-slate-200 shadow-soft">
                      <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                          <Factory className="w-4 h-4 text-brand-600" />
                          Rencana Pelaksanaan Audit Tahap 2 (Lapangan & Pabrik)
                        </CardTitle>
                        <Badge variant={isAuditTahap1Lolos ? "primary" : "warning"}>
                          {isAuditTahap1Lolos ? "Siap Dijadwalkan oleh Operator LS" : "Menunggu Penyelesaian Tahap 1"}
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-5 pt-4 space-y-4 text-xs">
                        {isAuditTahap1Lolos && (
                          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 mb-2">
                            <div className="flex items-center gap-2 font-bold text-xs text-emerald-950">
                              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              Audit Tahap 1 Selesai & Terverifikasi
                            </div>
                            <p className="text-xs text-emerald-800">
                              Pemeriksaan kecukupan dokumen mutu telah disetujui. Operator LS sedang memproses koordinasi penetapan jadwal kunjungan lapangan dan audit fasilitas pabrik (Tahap 2).
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-slate-400 block font-medium">Lokasi Kunjungan Audit:</span>
                            <span className="font-bold text-slate-900 mt-1 block">Fasilitas Pabrik Pemohon</span>
                            <span className="text-[11px] text-slate-500 mt-0.5 block truncate">{alamat}</span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-slate-400 block font-medium">Agenda Utama:</span>
                            <span className="font-bold text-slate-900 mt-1 block">Verifikasi Lapangan & Sampling Uji</span>
                            <span className="text-[11px] text-slate-500 mt-0.5 block">Audit Proses Produksi & Mutu</span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="text-slate-400 block font-medium">Rencana Audit Tahap 2:</span>
                            <div className="mt-1 flex items-center gap-1.5">
                              <Button size="sm" variant="outline" className="text-xs h-7 px-2.5" leftIcon={<Download className="w-3 h-3" />}>
                                Unduh Audit Plan Tahap 2
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Panduan Kesiapan Audit */}
                        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 space-y-2">
                          <div className="flex items-center gap-2 font-bold text-xs text-blue-950">
                            <Info className="w-4 h-4 text-blue-600 shrink-0" />
                            Panduan Kesiapan Kunjungan Lapangan & Audit Pabrik:
                          </div>
                          <ul className="list-disc list-inside text-[11px] text-blue-800 space-y-1 pl-1">
                            <li>Pastikan lini produksi komoditi yang diajukan beroperasi aktif pada saat audit berlangsung.</li>
                            <li>Siapkan sampel produk jadi dan bahan baku untuk keperluan pengambilan contoh uji (sampling).</li>
                            <li>Pastikan personil penanggung jawab mutu (QC/QA/Pimpinan Pabrik) mendampingi tim auditor.</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* <Card className="rounded-2xl border-slate-200/90 shadow-soft bg-gradient-to-r from-slate-50 via-brand-50/20 to-white overflow-hidden">
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Pusat Layanan & Bantuan Sertifikasi BBSPJIKKP</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Butuh asistensi terkait proses sertifikasi, verifikasi berkas persyaratan, atau koordinasi jadwal audit?
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium">
              <Mail className="w-3.5 h-3.5 text-brand-600" />
              <span>info.bbkkp@kemenperin.go.id</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp: 0812-xxxx-xxxx</span>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Modal Ajukan Negosiasi / Tolak Penawaran */}
      {showRejectModal && (
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
      )}

      {/* Modal Setujui Temuan & Upload Berkas Perbaikan Tahap 1 */}
      {showTemuanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tindak Lanjut & Perbaikan Temuan Tahap 1
                </h3>
                <p className="text-xs text-slate-500">
                  Konfirmasi persetujuan catatan auditor dan lampirkan berkas perbaikan
                </p>
              </div>
            </div>

            {temuanRevisiThp1Log && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block text-amber-950">Catatan dari Tim Auditor:</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {temuanRevisiThp1Log.deskripsi}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Catatan / Keterangan Tindak Lanjut Perbaikan
                </label>
                <textarea
                  className="w-full h-24 p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="Jelaskan tindakan korektif atau penjelasan dokumen yang telah diperbaiki..."
                  value={temuanCatatan}
                  onChange={(e) => setTemuanCatatan(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Lampiran Berkas Perbaikan Dokumen (Opsional)
                </label>
                <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <input
                    type="file"
                    id="file-perbaikan-tahap1"
                    className="hidden"
                    accept=".pdf,.zip,.rar,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setTemuanFile(e.target.files[0])
                      }
                    }}
                  />
                  <label htmlFor="file-perbaikan-tahap1" className="cursor-pointer flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 text-xs text-slate-600">
                      <Upload className="w-4 h-4 text-brand-600" />
                      <span className="truncate max-w-[240px]">
                        {temuanFile ? temuanFile.name : "Pilih berkas dokumen perbaikan (PDF / ZIP / Docx)"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-[11px] h-7 px-2"
                      onClick={() => document.getElementById("file-perbaikan-tahap1")?.click()}
                    >
                      {temuanFile ? "Ganti File" : "Jelajahi"}
                    </Button>
                  </label>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Format didukung: PDF, ZIP, DOCX, JPG, PNG (Maks. 20MB)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemuanModal(false)}
                disabled={temuanSubmitting}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApproveTemuanTahap1}
                isLoading={temuanSubmitting}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold"
                leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
              >
                Setujui & Kirim ke Auditor
              </Button>
            </div>
          </div>
        </div>
      )}

      {PdfPreviewModal}
    </div>
  )
}

export default DetailPermohonanPage
