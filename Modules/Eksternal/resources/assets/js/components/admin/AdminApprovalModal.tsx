import React, { useState } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import {
  CheckCircle2,
  RotateCcw,
  XCircle,
  UserCheck,
  Upload,
  DollarSign,
  FileText,
  Plus,
  Trash2,
} from "lucide-react"
import toast from "react-hot-toast"
import api from "../../utils/api"

type ApprovalActionType = "approve" | "revisi" | "reject" | "disposisi" | null

interface TarifRow {
  deskripsi: string
  qty: number
  tarif: number
}

interface AdminApprovalModalProps {
  show: boolean
  actionType: ApprovalActionType
  permohonanId: string
  rawId?: string | number
  pelangganName: string
  onClose: () => void
  onSuccess: () => void
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  show,
  actionType,
  permohonanId,
  rawId,
  pelangganName,
  onClose,
  onSuccess,
}) => {
  const [tarifRows, setTarifRows] = useState<TarifRow[]>([
    { deskripsi: "Biaya Sertifikasi & Audit PNBP", qty: 1, tarif: 0 },
  ])
  const [dokPenawaran, setDokPenawaran] = useState<File | null>(null)
  const [catatan, setCatatan] = useState("")
  const [assignedOfficer, setAssignedOfficer] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const targetId = rawId || permohonanId

  const totalNominal = tarifRows.reduce((acc, curr) => acc + (curr.qty || 1) * (Number(curr.tarif) || 0), 0)

  const handleAddTarifRow = () => {
    setTarifRows([...tarifRows, { deskripsi: "", qty: 1, tarif: 0 }])
  }

  const handleRemoveTarifRow = (idx: number) => {
    if (tarifRows.length === 1) {
      toast.error("Minimal harus ada 1 item tarif")
      return
    }
    setTarifRows(tarifRows.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (actionType === "approve") {
        if (totalNominal <= 0) {
          toast.error("Total nominal biaya penawaran wajib lebih dari 0")
          setSubmitting(false)
          return
        }
        if (!dokPenawaran) {
          toast.error("Dokumen penawaran harga (.pdf) wajib diunggah")
          setSubmitting(false)
          return
        }

        const formData = new FormData()
        formData.append("nominal", String(totalNominal))
        formData.append("dok_penawaran", dokPenawaran)

        // Pass detailed rows if needed
        tarifRows.forEach((row, index) => {
          formData.append(`items[${index}][item_bayar]`, row.deskripsi || "Biaya Layanan")
          formData.append(`items[${index}][kuantitas]`, String(row.qty || 1))
          formData.append(`items[${index}][subtotal]`, String((row.qty || 1) * row.tarif))
        })

        await api.post(`/permohonan/${targetId}/approve`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success(`Permohonan ${permohonanId} berhasil disetujui. Invoice & BNI Virtual Account otomatis terbit!`)
      } else if (actionType === "revisi") {
        if (!catatan.trim()) {
          toast.error("Catatan revisi wajib diisi")
          setSubmitting(false)
          return
        }
        await api.post(`/permohonan/${targetId}/revisi`, { catatan })
        toast.success(`Permintaan revisi dikirimkan ke pelanggan ${pelangganName}.`)
      } else if (actionType === "reject") {
        if (!catatan.trim()) {
          toast.error("Alasan penolakan wajib diisi")
          setSubmitting(false)
          return
        }
        await api.post(`/permohonan/${targetId}/reject`, { catatan })
        toast.error(`Permohonan ${permohonanId} ditolak secara resmi.`)
      } else if (actionType === "disposisi") {
        toast.success(`Permohonan berhasil didisposisikan kepada ${assignedOfficer}.`)
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error("Gagal memproses aksi permohonan:", err)
      toast.error(err?.response?.data?.message || "Gagal memproses aksi permohonan")
    } finally {
      setSubmitting(false)
    }
  }

  const getModalTitle = () => {
    switch (actionType) {
      case "approve":
        return "Form Penerbitan Invoice & Tarif PNBP"
      case "revisi":
        return "Minta Revisi Kelengkapan Berkas"
      case "reject":
        return "Tolak Permohonan Layanan"
      case "disposisi":
        return "Disposisi Penugasan Tim Verifikator"
      default:
        return "Aksi Permohonan"
    }
  }

  return (
    <Modal show={show} onClose={onClose} title={getModalTitle()} size={actionType === "approve" ? "lg" : "md"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Permohonan Terpilih (Selected Order) */}
        <div>
          <label className="text-xs font-bold text-slate-800">
            Nomor Permohonan / Pelanggan <span className="text-rose-500">*</span>
          </label>
          <div className="mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
            <span className="font-bold text-brand-700 font-mono">
              {permohonanId} <span className="font-normal text-slate-600 font-sans">— {pelangganName}</span>
            </span>
            <Badge variant="success">Terpilih</Badge>
          </div>
        </div>

        {/* Form Inputs based on Action */}
        {actionType === "approve" && (
          <div className="space-y-4">
            {/* Rincian Parameter Tarif PNBP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-brand-600" />
                  <span>Rincian Item Tarif PNBP</span>
                  <span className="text-rose-500">*</span>
                </label>
                <Button type="button" size="sm" variant="outline" onClick={handleAddTarifRow}>
                  <Plus className="w-3 h-3 mr-1" /> Tambah Item
                </Button>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tarifRows.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Deskripsi Parameter / Paket Layanan"
                      value={row.deskripsi}
                      onChange={(e) => {
                        const newRows = [...tarifRows]
                        newRows[idx].deskripsi = e.target.value
                        setTarifRows(newRows)
                      }}
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    <input
                      type="number"
                      required
                      min={1}
                      value={row.qty}
                      onChange={(e) => {
                        const newRows = [...tarifRows]
                        newRows[idx].qty = Number(e.target.value) || 1
                        setTarifRows(newRows)
                      }}
                      placeholder="Qty"
                      className="w-16 p-2 bg-white border border-slate-300 rounded-lg text-xs text-center focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                    <div className="relative w-36">
                      <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">Rp</span>
                      <input
                        type="number"
                        required
                        min={0}
                        step={1000}
                        value={row.tarif || ""}
                        onChange={(e) => {
                          const newRows = [...tarifRows]
                          newRows[idx].tarif = Number(e.target.value) || 0
                          setTarifRows(newRows)
                        }}
                        placeholder="0"
                        className="w-full pl-8 pr-2 py-2 bg-white border border-slate-300 rounded-lg text-xs text-right font-bold focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    {tarifRows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTarifRow(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Total Tagihan PNBP:</span>
                <span className="text-sm font-black text-brand-700">
                  Rp {totalNominal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Dokumen Penawaran */}
            <div>
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-600" />
                <span>Dokumen Penawaran Harga Resmi (.pdf)</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setDokPenawaran(e.target.files[0])
                  }
                }}
                className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Format PDF / Berkas Resmi (Maks. 5 MB)</span>
            </div>
          </div>
        )}

        {actionType === "revisi" && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">
              Catatan Detail Dokumen yang Perlu Diperbaiki <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Lampiran Diagram Alir Produksi belum lengkap, mohon upload ulang berkas yang memuat tahapan quality control..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        )}

        {actionType === "reject" && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-rose-700">
              Alasan Resmi Penolakan <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Jelaskan alasan penolakan permohonan secara objektif..."
              className="w-full p-3 bg-white border border-rose-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>
        )}

        {actionType === "disposisi" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-800">
                Pilih Verifikator / Asesor Penanggung Jawab <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={assignedOfficer}
                onChange={(e) => setAssignedOfficer(e.target.value)}
                className="w-full mt-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">-- Pilih Petugas --</option>
                <option value="Dr. Hendra Wijaya, M.T. (Lab Polimer)">Dr. Hendra Wijaya, M.T. (Lab Polimer)</option>
                <option value="Siti Rahmawati, S.T. (Asesor LSP BNSP)">Siti Rahmawati, S.T. (Asesor LSP BNSP)</option>
                <option value="Budi Santoso, M.Sc. (Uji Fisika Karet)">Budi Santoso, M.Sc. (Uji Fisika Karet)</option>
                <option value="Rina Anggraini, S.Si. (Lab Kimia Kulit)">Rina Anggraini, S.Si. (Lab Kimia Kulit)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Catatan Disposisi (Opsional)</label>
              <input
                type="text"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Instruksi tambahan untuk tim pelaksana..."
                className="w-full mt-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={submitting}
            variant={
              actionType === "approve"
                ? "primary"
                : actionType === "revisi"
                ? "secondary"
                : actionType === "reject"
                ? "danger"
                : "primary"
            }
          >
            {actionType === "approve"
              ? "Simpan & Terbitkan Invoice"
              : actionType === "revisi"
              ? "Kirim Permintaan Revisi"
              : actionType === "reject"
              ? "Konfirmasi Tolak"
              : "Simpan Disposisi"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AdminApprovalModal
