import React, { useState } from "react"
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
} from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { AdminApprovalModal } from "../../../components/admin/AdminApprovalModal"

export const AdminPermohonanDetailPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [modalState, setModalState] = useState<{
    show: boolean
    action: "approve" | "revisi" | "reject" | "disposisi" | null
  }>({ show: false, action: null })

  // Mock Detail Permohonan
  const data = {
    id: id || "1",
    no_order: "REQ-2026-0819",
    tgl_order: "18 Agustus 2026, 09:30 WIB",
    layanan: "Sertifikasi Profesi Operator Ekstrusi Plastik (LSP BNSP)",
    status: "MENUNGGU_VERIFIKASI",
    pelanggan: {
      nama_instansi: "PT Indorubber Global Tech",
      tipe: "Perusahaan Swasta",
      npwp: "01.234.567.8-901.000",
      nib: "1234567890123",
      alamat: "Kawasan Industri MM2100 Blok C-4, Cikarang Barat, Bekasi, Jawa Barat",
      pic_nama: "Ir. Hendri Gunawan",
      pic_email: "h.gunawan@indorubber.co.id",
      pic_phone: "+62 812-3456-7890",
    },
    peserta: [
      {
        nama: "Ahmad Rizki",
        nik: "3275012345670001",
        email: "ahmad.rizki@indorubber.co.id",
        jabatan: "Lead Operator Ekstrusi",
        dokumen: [
          { nama: "Formulir APL-01 (Permohonan Sertifikasi)", url: "#", size: "1.2 MB" },
          { nama: "Formulir APL-02 (Asesmen Mandiri)", url: "#", size: "2.4 MB" },
          { nama: "KTP Elektronik", url: "#", size: "450 KB" },
          { nama: "Ijazah Terakhir (D3 Teknik Kimia)", url: "#", size: "1.1 MB" },
          { nama: "Surat Keterangan Pengalaman Kerja", url: "#", size: "850 KB" },
        ],
      },
      {
        nama: "Budi Wahyudi",
        nik: "3275012345670002",
        email: "budi.wahyudi@indorubber.co.id",
        jabatan: "Operator Junior",
        dokumen: [
          { nama: "Formulir APL-01 (Permohonan Sertifikasi)", url: "#", size: "1.1 MB" },
          { nama: "Formulir APL-02 (Asesmen Mandiri)", url: "#", size: "2.1 MB" },
          { nama: "KTP Elektronik", url: "#", size: "380 KB" },
        ],
      },
    ],
    timeline: [
      { status: "Permohonan Dibuat", tanggal: "18 Agu 2026, 09:30 WIB", by: "Pelanggan" },
      { status: "Berkas Diunggah Lengkap", tanggal: "18 Agu 2026, 10:15 WIB", by: "Pelanggan" },
      { status: "Menunggu Peninjauan Petugas", tanggal: "18 Agu 2026, 10:16 WIB", by: "Sistem" },
    ],
  }

  return (
    <div className="space-y-6">
      <Head title={`Verifikasi Berkas — ${data.no_order}`} />

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
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{data.no_order}</h1>
              <Badge variant="warning">Menunggu Verifikasi</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{data.layanan}</p>
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
        {/* Left Column: Pemohon & Peserta / Sampel List */}
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
                <span className="text-slate-400 font-medium">Nama Instansi / Badan Usaha:</span>
                <p className="font-bold text-slate-800 mt-0.5">{data.pelanggan.nama_instansi}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Tipe Pemohon:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{data.pelanggan.tipe}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">NPWP / NIB:</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {data.pelanggan.npwp} / {data.pelanggan.nib}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Kontak Person (PIC):</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {data.pelanggan.pic_nama} ({data.pelanggan.pic_phone})
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-medium">Alamat Domisili / Pabrik:</span>
                <p className="font-medium text-slate-700 mt-0.5">{data.pelanggan.alamat}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dokumen & Peserta Peninjauan */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <span>Daftar Peserta & Berkas Persyaratan ({data.peserta.length} Peserta)</span>
            </h3>

            {data.peserta.map((peserta, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2 bg-slate-50/70 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xs font-bold text-slate-900">
                        {idx + 1}. {peserta.nama} —{" "}
                        <span className="text-brand-600">{peserta.jabatan}</span>
                      </CardTitle>
                      <CardDescription className="text-[11px]">
                        NIK: {peserta.nik} • {peserta.email}
                      </CardDescription>
                    </div>
                    <Badge variant="info">Berkas Diunggah</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {peserta.dokumen.map((doc, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-300 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                          <div>
                            <p className="font-semibold text-slate-800">{doc.nama}</p>
                            <span className="text-[10px] text-slate-400">{doc.size}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs">
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Timeline Tracker & Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Riwayat Jejak Audit Permohonan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {data.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-brand-600 ring-4 ring-brand-100" />
                    <p className="text-xs font-bold text-slate-800">{event.status}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {event.tanggal} • oleh {event.by}
                    </p>
                  </div>
                ))}
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
          permohonanId={data.no_order}
          pelangganName={data.pelanggan.nama_instansi}
          onClose={() => setModalState({ show: false, action: null })}
          onSuccess={() => navigate("/admin/permohonan")}
        />
      )}
    </div>
  )
}

export default AdminPermohonanDetailPage
