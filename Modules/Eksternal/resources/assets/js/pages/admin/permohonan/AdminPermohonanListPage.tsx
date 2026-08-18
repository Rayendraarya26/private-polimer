import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Eye,
  FileCheck2,
  Calendar,
  Layers,
  ChevronRight,
  Download,
} from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { AdminApprovalModal } from "../../../components/admin/AdminApprovalModal"
import toast from "react-hot-toast"

interface PermohonanAdminItem {
  id: string
  no_order: string
  pelanggan: string
  tipe_pelanggan: string
  layanan: string
  kategori: string
  tgl_order: string
  status: "MENUNGGU_VERIFIKASI" | "SEDANG_PROSES" | "MENUNGGU_PEMBAYARAN" | "SELESAI" | "REVISI" | "DITOLAK"
  jumlah_peserta_sampel: number
  total_tagihan: number
}

const mockPermohonanList: PermohonanAdminItem[] = [
  {
    id: "1",
    no_order: "REQ-2026-0819",
    pelanggan: "PT Indorubber Global Tech",
    tipe_pelanggan: "Perusahaan",
    layanan: "Uji Tarik & Vulkanisasi Karet SNI 06-0001",
    kategori: "Pengujian Lab",
    tgl_order: "18 Agu 2026",
    status: "MENUNGGU_VERIFIKASI",
    jumlah_peserta_sampel: 4,
    total_tagihan: 12500000,
  },
  {
    id: "2",
    no_order: "REQ-2026-0818",
    pelanggan: "CV Polyplast Mandiri",
    tipe_pelanggan: "Perusahaan",
    layanan: "Sertifikasi Profesi Operator Ekstrusi Plastik",
    kategori: "LSP BNSP",
    tgl_order: "17 Agu 2026",
    status: "MENUNGGU_VERIFIKASI",
    jumlah_peserta_sampel: 3,
    total_tagihan: 7500000,
  },
  {
    id: "3",
    no_order: "REQ-2026-0817",
    pelanggan: "Dinas Perindustrian Provinsi Jawa Tengah",
    tipe_pelanggan: "Instansi",
    layanan: "Bimtek Formulasi Polimer Ramah Lingkungan",
    kategori: "Pelatihan",
    tgl_order: "16 Agu 2026",
    status: "SEDANG_PROSES",
    jumlah_peserta_sampel: 15,
    total_tagihan: 35000000,
  },
  {
    id: "4",
    no_order: "REQ-2026-0815",
    pelanggan: "Bambang Sudiro, S.T.",
    tipe_pelanggan: "Perorangan",
    layanan: "Sertifikasi Asesor Kompetensi Kulit",
    kategori: "LSP BNSP",
    tgl_order: "15 Agu 2026",
    status: "MENUNGGU_PEMBAYARAN",
    jumlah_peserta_sampel: 1,
    total_tagihan: 2500000,
  },
  {
    id: "5",
    no_order: "REQ-2026-0810",
    pelanggan: "PT Surya Kulit Nusantara",
    tipe_pelanggan: "Perusahaan",
    layanan: "Pengujian Ketahanan Gesek Kulit Sepatu",
    kategori: "Pengujian Lab",
    tgl_order: "10 Agu 2026",
    status: "SELESAI",
    jumlah_peserta_sampel: 2,
    total_tagihan: 4800000,
  },
]

export const AdminPermohonanListPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modal State
  const [modalState, setModalState] = useState<{
    show: boolean
    action: "approve" | "revisi" | "reject" | "disposisi" | null
    item?: PermohonanAdminItem
  }>({ show: false, action: null })

  const filteredData = mockPermohonanList.filter((item) => {
    const matchTab = activeTab === "ALL" || item.status === activeTab
    const matchSearch =
      item.no_order.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.layanan.toLowerCase().includes(searchQuery.toLowerCase())
    return matchTab && matchSearch
  })

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredData.map((d) => d.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBulkAction = (action: "approve" | "revisi" | "reject") => {
    if (selectedIds.length === 0) {
      toast.error("Pilih minimal 1 permohonan terlebih dahulu")
      return
    }
    toast.success(`Aksi bulk ${action.toUpperCase()} berhasil untuk ${selectedIds.length} permohonan terpilih`)
    setSelectedIds([])
  }

  const getStatusBadge = (status: PermohonanAdminItem["status"]) => {
    switch (status) {
      case "MENUNGGU_VERIFIKASI":
        return <Badge variant="warning">Menunggu Verifikasi</Badge>
      case "SEDANG_PROSES":
        return <Badge variant="info">Sedang Diproses</Badge>
      case "MENUNGGU_PEMBAYARAN":
        return <Badge variant="secondary">Menunggu Pembayaran</Badge>
      case "SELESAI":
        return <Badge variant="success">Selesai</Badge>
      case "REVISI":
        return <Badge variant="warning">Perlu Revisi</Badge>
      case "DITOLAK":
        return <Badge variant="danger">Ditolak</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Head title="Manajemen Antrean Permohonan Masuk" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-brand-600" />
            Manajemen Antrean Permohonan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola dan verifikasi berkas pendaftaran layanan uji laboratorium, kalibrasi, LSP, dan bimtek.
          </p>
        </div>

        {/* Bulk Action Buttons */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-300">
            <span className="text-xs font-bold text-slate-700 px-2">
              {selectedIds.length} Dipilih:
            </span>
            <Button size="sm" variant="success" onClick={() => handleBulkAction("approve")}>
              Bulk Approve
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleBulkAction("revisi")}>
              Bulk Revisi
            </Button>
            <Button size="sm" variant="danger" onClick={() => handleBulkAction("reject")}>
              Bulk Reject
            </Button>
          </div>
        )}
      </div>

      {/* Tabs & Search Filter */}
      <Card>
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/60">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: "ALL", label: "Semua Permohonan" },
              { id: "MENUNGGU_VERIFIKASI", label: "Menunggu Verifikasi (2)" },
              { id: "SEDANG_PROSES", label: "Sedang Uji/Proses" },
              { id: "MENUNGGU_PEMBAYARAN", label: "Menunggu Bayar" },
              { id: "SELESAI", label: "Selesai" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari No Order / Pemohon..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Permohonan DataTable */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                  </th>
                  <th className="py-3 px-4 font-bold">No. Order & Tanggal</th>
                  <th className="py-3 px-4 font-bold">Pemohon / Instansi</th>
                  <th className="py-3 px-4 font-bold">Layanan Permohonan</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Tarif PNBP</th>
                  <th className="py-3 px-4 font-bold text-center">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Tidak ada permohonan yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const isChecked = selectedIds.includes(item.id)
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isChecked ? "bg-brand-50/30" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelect(item.id)}
                            className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-brand-700">{item.no_order}</p>
                          <span className="text-[11px] text-slate-400">{item.tgl_order}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-800">{item.pelanggan}</p>
                          <span className="text-[10px] text-slate-400">{item.tipe_pelanggan}</span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="font-medium text-slate-800 truncate">{item.layanan}</p>
                          <span className="text-[10px] font-semibold text-brand-600">
                            {item.kategori} • {item.jumlah_peserta_sampel} Item
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                          Rp {item.total_tagihan.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/permohonan/detail/${item.id}`)}
                              title="Tinjau Detail Berkas"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                setModalState({
                                  show: true,
                                  action: "approve",
                                  item,
                                })
                              }
                              title="Setujui Berkas"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                setModalState({
                                  show: true,
                                  action: "revisi",
                                  item,
                                })
                              }
                              title="Minta Revisi"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Modal */}
      {modalState.show && modalState.item && (
        <AdminApprovalModal
          show={modalState.show}
          actionType={modalState.action}
          permohonanId={modalState.item.no_order}
          pelangganName={modalState.item.pelanggan}
          onClose={() => setModalState({ show: false, action: null })}
          onSuccess={() => {}}
        />
      )}
    </div>
  )
}

export default AdminPermohonanListPage
