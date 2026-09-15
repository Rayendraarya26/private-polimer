import React, { useState } from "react"
import { Building2, Plus, Edit, Trash2, Search, Layers, CheckCircle2 } from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import toast from "react-hot-toast"

export const AdminMasterLayananPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"JENIS" | "LINGKUP">("JENIS")

  const [jenisLayanan, setJenisLayanan] = useState([
    { id: "1", kode: "UJI-KLT", nama: "Pengujian Kulit & Produk Olahan", status: "AKTIF" },
    { id: "2", kode: "UJI-KRT", nama: "Pengujian Karet & Produk Vulkanisir", status: "AKTIF" },
    { id: "3", kode: "UJI-PLS", nama: "Pengujian Plastik & Polimer Komposit", status: "AKTIF" },
    { id: "4", kode: "KLB-ALL", nama: "Kalibrasi Peralatan Uji & Instrumen", status: "AKTIF" },
    { id: "5", kode: "LSP-BNSP", nama: "Sertifikasi Profesi LSP BBKKP (BNSP)", status: "AKTIF" },
    { id: "6", kode: "BMK-IND", nama: "Bimbingan Teknis & Pelatihan Industri", status: "AKTIF" },
  ])

  const [lingkupLayanan, setLingkupLayanan] = useState([
    {
      id: "1",
      jenis: "Pengujian Karet & Produk Vulkanisir",
      nama_parameter: "Uji Tarik & Perpanjangan Putus",
      standar: "SNI 06-0001-1987 / ASTM D412",
      satuan: "Per Sampel",
      tarif_pnbp: 650000,
    },
    {
      id: "2",
      jenis: "Pengujian Karet & Produk Vulkanisir",
      nama_parameter: "Ketahanan Usang (Ageing Oven)",
      standar: "ISO 188 / ASTM D573",
      satuan: "Per Sampel",
      tarif_pnbp: 850000,
    },
    {
      id: "3",
      jenis: "Sertifikasi Profesi LSP BBKKP (BNSP)",
      nama_parameter: "Skema Operator Ekstrusi Plastik",
      standar: "SKKNI Kemenperin 2021",
      satuan: "Per Asesi",
      tarif_pnbp: 2500000,
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [newJenis, setNewJenis] = useState({ kode: "", nama: "" })

  const handleSaveJenis = (e: React.FormEvent) => {
    e.preventDefault()
    setJenisLayanan([
      ...jenisLayanan,
      { id: String(Date.now()), kode: newJenis.kode, nama: newJenis.nama, status: "AKTIF" },
    ])
    toast.success("Jenis layanan baru berhasil ditambahkan!")
    setShowModal(false)
    setNewJenis({ kode: "", nama: "" })
  }

  return (
    <div className="space-y-6">
      <Head title="Master Katalog Layanan & Parameter Uji" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-600" />
            Katalog Layanan & Parameter Uji PNBP
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen jenis layanan publik, lingkup parameter acuan SNI/ISO, dan tarif PNBP resmi.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowModal(true)}
        >
          Tambah {activeTab === "JENIS" ? "Jenis Layanan" : "Parameter Uji"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("JENIS")}
          className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "JENIS"
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Kategori Jenis Layanan
        </button>
        <button
          onClick={() => setActiveTab("LINGKUP")}
          className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "LINGKUP"
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Lingkup Parameter Uji & Tarif PNBP
        </button>
      </div>

      {/* Tab 1: Jenis Layanan */}
      {activeTab === "JENIS" && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Kode</th>
                  <th className="py-3 px-4 font-bold">Nama Layanan Publik</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jenisLayanan.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-700">{j.kode}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{j.nama}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success">{j.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button className="text-slate-400 hover:text-brand-600 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Lingkup Parameter */}
      {activeTab === "LINGKUP" && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Parameter Uji / Skema</th>
                  <th className="py-3 px-4 font-bold">Kategori Layanan</th>
                  <th className="py-3 px-4 font-bold">Metode / Standar Acuan</th>
                  <th className="py-3 px-4 font-bold">Satuan</th>
                  <th className="py-3 px-4 font-bold text-right">Tarif PNBP</th>
                  <th className="py-3 px-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lingkupLayanan.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{l.nama_parameter}</td>
                    <td className="py-3.5 px-4 text-slate-500">{l.jenis}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{l.standar}</td>
                    <td className="py-3.5 px-4">{l.satuan}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      Rp {l.tarif_pnbp.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button className="text-slate-400 hover:text-brand-600 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Modal Tambah */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Tambah Jenis Layanan" size="sm">
        <form onSubmit={handleSaveJenis} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-800">Kode Layanan</label>
            <input
              type="text"
              required
              placeholder="Contoh: UJI-ENV"
              value={newJenis.kode}
              onChange={(e) => setNewJenis({ ...newJenis, kode: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800">Nama Layanan</label>
            <input
              type="text"
              required
              placeholder="Contoh: Pengujian Emisi & Lingkungan"
              value={newJenis.nama}
              onChange={(e) => setNewJenis({ ...newJenis, nama: e.target.value })}
              className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button size="sm" variant="outline" type="button" onClick={() => setShowModal(false)}>Batal</Button>
            <Button size="sm" variant="primary" type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminMasterLayananPage
