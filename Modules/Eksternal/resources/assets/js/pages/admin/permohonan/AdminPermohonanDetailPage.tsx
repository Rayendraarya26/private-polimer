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
} from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { AdminApprovalModal } from "../../../components/admin/AdminApprovalModal"
import api from "../../../utils/api"
import toast from "react-hot-toast"

export const AdminPermohonanDetailPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState<boolean>(true)
  const [permohonan, setPermohonan] = useState<any>(null)
  const [formData, setFormData] = useState<any>(null)
  const [lingkup, setLingkup] = useState<any>(null)

  const [modalState, setModalState] = useState<{
    show: boolean
    action: "approve" | "revisi" | "reject" | "disposisi" | null
  }>({ show: false, action: null })

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <span className="text-xs font-medium text-slate-500">Memuat detail berkas permohonan...</span>
      </div>
    )
  }

  const noOrder = permohonan?.no_permohonan || permohonan?.kode_order || `#REQ-${id}`
  const namaPelanggan = formData?.nama_perusahaan || formData?.nama_lengkap || formData?.nama_instansi || "Pelanggan"
  const alamat = formData?.alamat_kantor || formData?.alamat_instansi || formData?.alamat || "-"
  const kontakPic = formData?.kontak_person || formData?.nama_pic || formData?.nama_lengkap || "-"
  const phone = formData?.no_whatsapp || formData?.no_telp || formData?.no_hp || "-"
  const email = formData?.email || "-"
  const layananName = lingkup?.lingkup || (noOrder.startsWith("CERT") ? "Sertifikasi Produk & Sistem (LSPro)" : "Layanan BBKKP")

  const items = formData?.items || []
  const pabriks = formData?.pabrik || []

  return (
    <div className="space-y-6">
      <Head title={`Verifikasi Berkas — ${noOrder}`} />

      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/permohonan")}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Kembali
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{noOrder}</h1>
              <Badge variant="warning">Menunggu Verifikasi</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{layananName}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<UserCheck className="w-3.5 h-3.5" />}
            onClick={() => setModalState({ show: true, action: "disposisi" })}
          >
            Disposisi Petugas
          </Button>
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
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
            Setujui Berkas
          </Button>
        </div>
      </div>

      {/* Main Grid: Data Pemohon vs Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pemohon & Komoditi/Pabrik List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identitas Pemohon Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                <span>Identitas Pemohon / Perusahaan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Nama Perusahaan / Pemohon:</span>
                <p className="font-bold text-slate-800 mt-0.5">{namaPelanggan}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Email Kontak:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Kontak Person / WhatsApp:</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {kontakPic} ({phone})
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Akta / NIB:</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {formData?.kuesioner_kelayakan?.nomor_akta_pendirian || "-"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-medium">Alamat Domisili / Kantor:</span>
                <p className="font-medium text-slate-700 mt-0.5">{alamat}</p>
              </div>
            </CardContent>
          </Card>

          {/* Daftar Komoditi & Produk (Jika Sertifikasi) */}
          {items.length > 0 && (
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-brand-600" />
                  <span>Daftar Komoditi / Produk ({items.length} Item)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 divide-y divide-slate-100 text-xs">
                {items.map((it: any, idx: number) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{it.nama_produk}</p>
                      <p className="text-[11px] text-slate-500">
                        Merk: {it.merk_dagang || "-"} • Tipe: {it.tipe_jenis || "-"} • SNI/ISO: {it.standar_sni_iso || "-"}
                      </p>
                    </div>
                    <Badge variant="info">Estimasi: Rp {Number(it.estimasi_tarif || 0).toLocaleString("id-ID")}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Daftar Lokasi Pabrik */}
          {pabriks.length > 0 && (
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Factory className="w-4 h-4 text-brand-600" />
                  <span>Fasilitas Lokasi Pabrik ({pabriks.length} Lokasi)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 divide-y divide-slate-100 text-xs">
                {pabriks.map((pb: any, idx: number) => (
                  <div key={idx} className="py-2.5">
                    <p className="font-bold text-slate-800">{pb.nama_pabrik}</p>
                    <p className="text-slate-600">{pb.alamat_pabrik}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Karyawan: {pb.jumlah_karyawan || 0} orang • Kontak: {pb.kontak_pabrik || "-"} ({pb.email_pabrik || "-"})
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Timeline Tracker & Status */}
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
                  <p className="text-[11px] text-slate-400 mt-0.5">Menunggu peninjauan berkas oleh Petugas Marketing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approval Modal */}
      {modalState.show && (
        <AdminApprovalModal
          show={modalState.show}
          actionType={modalState.action}
          permohonanId={noOrder}
          pelangganName={namaPelanggan}
          onClose={() => setModalState({ show: false, action: null })}
          onSuccess={() => navigate("/admin/permohonan")}
        />
      )}
    </div>
  )
}

export default AdminPermohonanDetailPage
