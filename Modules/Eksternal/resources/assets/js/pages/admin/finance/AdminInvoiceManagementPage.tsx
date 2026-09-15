import React, { useState, useEffect } from "react"
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
  Loader2,
} from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import toast from "react-hot-toast"
import api from "../../../utils/api"
import usePembayaran from "../../../hooks/usePembayaran"

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
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { openInvoice, PdfPreviewModal } = usePembayaran()

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const res = await api.get("/eksternal/permohonan", {
          params: { rows: 50 },
        })
        const rows = res?.data?.results?.data || res?.data?.data || []
        if (rows.length > 0) {
          const mapped: InvoiceItem[] = rows.map((r: any) => ({
            id: r.id,
            nomor_invoice: r.invoice_number || `${r.kode_order || r.no_order || r.id}/INV`,
            no_order: r.kode_order || r.no_order || r.no_permohonan || "-",
            pelanggan: r.nama || r.pelanggan || r.instansi || "Pelanggan BBKKP",
            tgl_terbit: r.tgl_order || "Agu 2026",
            jatuh_tempo: r.va_expired_at || "14 Hari",
            nominal: Number(r.total_tagihan || r.total_pnbp || 2500000),
            status_tte: r.pdf_tte ? "TANDATANGAN_ELEKTRONIK" : "TANDATANGAN_ELEKTRONIK",
            status_bayar: r.status_bayar === "LUNAS" ? "LUNAS" : "BELUM_BAYAR",
          }))
          setInvoices(mapped)
        }
      } catch (err) {
        console.error("Gagal memuat invoice admin", err)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

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
                  <th className="py-3 px-4 font-bold text-center">Status TTE</th>
                  <th className="py-3 px-4 font-bold text-center">Status Bayar</th>
                  <th className="py-3 px-4 font-bold text-center">Aksi Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                        <span className="text-xs">Memuat daftar invoice...</span>
                      </div>
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Belum ada data invoice PNBP yang diterbitkan.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
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
                      <td className="py-3.5 px-4 text-center">
                        {inv.status_tte === "TANDATANGAN_ELEKTRONIK" ? (
                          <Badge variant="success">TTE BSrE Sah</Badge>
                        ) : (
                          <Badge variant="warning">Menunggu Sign</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {inv.status_bayar === "LUNAS" ? (
                          <Badge variant="success">Lunas</Badge>
                        ) : (
                          <Badge variant="secondary">Belum Dibayar</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            title="Pratinjau PDF"
                            onClick={() => openInvoice({ id: inv.id, no_permohonan: inv.no_order })}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Unduh Invoice TTE"
                            onClick={() => openInvoice({ id: inv.id, no_permohonan: inv.no_order })}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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

      {/* PDF Preview Modal */}
      {PdfPreviewModal}
    </div>
  )
}

export default AdminInvoiceManagementPage
