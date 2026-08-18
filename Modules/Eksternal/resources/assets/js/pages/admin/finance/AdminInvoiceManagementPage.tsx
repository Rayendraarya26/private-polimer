import React, { useState } from "react"
import {
  Receipt,
  Search,
  Plus,
  FileCheck2,
  Download,
  Eye,
  Trash2,
  Calendar,
  Building2,
  CheckCircle2,
} from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import toast from "react-hot-toast"

interface InvoiceItem {
  id: string
  nomor_invoice: string
  no_order: string
  pelanggan: string
  tgl_terbit: string
  jatuh_tempo: string
  nominal: number
  status_tte: "TANDATANGAN_ELEKTRONIK" | "DRAF" | "MENUNGGU_SIGN"
  status_bayar: "LUNAS" | "BELUM_BAYAR"
}

export const AdminInvoiceManagementPage: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    {
      id: "1",
      nomor_invoice: "INV/2026/08/0042",
      no_order: "REQ-2026-0819",
      pelanggan: "PT Indorubber Global Tech",
      tgl_terbit: "18 Agu 2026",
      jatuh_tempo: "25 Agu 2026",
      nominal: 12500000,
      status_tte: "TANDATANGAN_ELEKTRONIK",
      status_bayar: "BELUM_BAYAR",
    },
    {
      id: "2",
      nomor_invoice: "INV/2026/08/0041",
      no_order: "REQ-2026-0818",
      pelanggan: "CV Polyplast Mandiri",
      tgl_terbit: "17 Agu 2026",
      jatuh_tempo: "24 Agu 2026",
      nominal: 7500000,
      status_tte: "MENUNGGU_SIGN",
      status_bayar: "BELUM_BAYAR",
    },
    {
      id: "3",
      nomor_invoice: "INV/2026/08/0038",
      no_order: "REQ-2026-0810",
      pelanggan: "PT Surya Kulit Nusantara",
      tgl_terbit: "10 Agu 2026",
      jatuh_tempo: "17 Agu 2026",
      nominal: 4800000,
      status_tte: "TANDATANGAN_ELEKTRONIK",
      status_bayar: "LUNAS",
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState("")
  const [tarifRows, setTarifRows] = useState([
    { deskripsi: "Uji Tarik Karet (SNI 06-0001)", qty: 2, tarif: 2500000 },
    { deskripsi: "Uji Ketahanan Ozon & Suhu", qty: 2, tarif: 3750000 },
  ])

  const handleAddTarifRow = () => {
    setTarifRows([...tarifRows, { deskripsi: "", qty: 1, tarif: 0 }])
  }

  const handleRemoveTarifRow = (idx: number) => {
    setTarifRows(tarifRows.filter((_, i) => i !== idx))
  }

  const totalNominal = tarifRows.reduce((acc, row) => acc + row.qty * row.tarif, 0)

  const handleSimpanTarif = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Rincian tarif & Draf Invoice PNBP berhasil disimpan dan diteruskan ke TTE!")
    setShowCreateModal(false)
  }

  return (
    <div className="space-y-6">
      <Head title="Manajemen Invoice & Tarif PNBP" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-brand-600" />
            Manajemen Invoice PNBP
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Penerbitan tagihan tarif PNBP resmi dan pengesahan TTE BSrE.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          Buat Invoice Baru
        </Button>
      </div>

      {/* Invoice Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm">Daftar Tagihan & Invoice PNBP</CardTitle>
            <CardDescription>Seluruh invoice yang diterbitkan untuk permohonan layanan</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Nomor Invoice & Order</th>
                  <th className="py-3 px-4 font-bold">Pelanggan / Perusahaan</th>
                  <th className="py-3 px-4 font-bold">Tgl Terbit / Tempo</th>
                  <th className="py-3 px-4 font-bold text-right">Nominal Tagihan</th>
                  <th className="py-3 px-4 font-bold">Status TTE</th>
                  <th className="py-3 px-4 font-bold">Status Bayar</th>
                  <th className="py-3 px-4 font-bold text-center">Aksi Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-brand-700">{inv.nomor_invoice}</p>
                      <span className="text-[11px] text-slate-400">{inv.no_order}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{inv.pelanggan}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <p>{inv.tgl_terbit}</p>
                      <span className="text-[10px] text-rose-500">Jatuh Tempo: {inv.jatuh_tempo}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      Rp {inv.nominal.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4">
                      {inv.status_tte === "TANDATANGAN_ELEKTRONIK" ? (
                        <Badge variant="success">TTE BSrE Sah</Badge>
                      ) : (
                        <Badge variant="warning">Menunggu Sign</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {inv.status_bayar === "LUNAS" ? (
                        <Badge variant="success">Lunas</Badge>
                      ) : (
                        <Badge variant="secondary">Belum Dibayar</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button size="sm" variant="outline" title="Pratinjau PDF">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Unduh Invoice TTE">
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Pembuatan Invoice & Simpan Tarif */}
      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Form Penerbitan Invoice & Tarif PNBP"
        size="lg"
      >
        <form onSubmit={handleSimpanTarif} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-800">
              Pilih Permohonan Terverifikasi <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="w-full mt-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
            >
              <option value="">-- Pilih Nomor Order --</option>
              <option value="REQ-2026-0819">REQ-2026-0819 — PT Indorubber Global Tech</option>
              <option value="REQ-2026-0818">REQ-2026-0818 — CV Polyplast Mandiri</option>
            </select>
          </div>

          {/* Rincian Parameter Tarif */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Rincian Item Tarif PNBP</label>
              <Button type="button" size="sm" variant="outline" onClick={handleAddTarifRow}>
                <Plus className="w-3 h-3 mr-1" /> Tambah Item
              </Button>
            </div>

            <div className="space-y-2">
              {tarifRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nama Parameter / Paket"
                    value={row.deskripsi}
                    onChange={(e) => {
                      const newRows = [...tarifRows]
                      newRows[idx].deskripsi = e.target.value
                      setTarifRows(newRows)
                    }}
                    className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="number"
                    required
                    min={1}
                    value={row.qty}
                    onChange={(e) => {
                      const newRows = [...tarifRows]
                      newRows[idx].qty = Number(e.target.value)
                      setTarifRows(newRows)
                    }}
                    className="w-16 p-2 bg-white border border-slate-300 rounded-lg text-xs text-center"
                  />
                  <input
                    type="number"
                    required
                    value={row.tarif}
                    onChange={(e) => {
                      const newRows = [...tarifRows]
                      newRows[idx].tarif = Number(e.target.value)
                      setTarifRows(newRows)
                    }}
                    className="w-32 p-2 bg-white border border-slate-300 rounded-lg text-xs text-right"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTarifRow(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Total Tagihan PNBP:</span>
              <span className="text-sm font-black text-brand-700">
                Rp {totalNominal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCreateModal(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan & Terbitkan Invoice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminInvoiceManagementPage
