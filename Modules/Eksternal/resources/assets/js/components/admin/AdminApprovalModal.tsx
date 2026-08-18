import React, { useState } from "react"
import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { CheckCircle2, RotateCcw, XCircle, UserCheck, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"

type ApprovalActionType = "approve" | "revisi" | "reject" | "disposisi" | null

interface AdminApprovalModalProps {
  show: boolean
  actionType: ApprovalActionType
  permohonanId: string
  pelangganName: string
  onClose: () => void
  onSuccess: () => void
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  show,
  actionType,
  permohonanId,
  pelangganName,
  onClose,
  onSuccess,
}) => {
  const [catatan, setCatatan] = useState("")
  const [assignedOfficer, setAssignedOfficer] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    setTimeout(() => {
      setSubmitting(false)
      if (actionType === "approve") {
        toast.success(`Permohonan ${permohonanId} berhasil disetujui. Berkas diteruskan ke penagihan.`)
      } else if (actionType === "revisi") {
        toast.success(`Permintaan revisi dikirimkan ke pelanggan ${pelangganName}.`)
      } else if (actionType === "reject") {
        toast.error(`Permohonan ${permohonanId} ditolak secara resmi.`)
      } else if (actionType === "disposisi") {
        toast.success(`Permohonan berhasil didisposisikan kepada ${assignedOfficer}.`)
      }
      onSuccess()
      onClose()
    }, 600)
  }

  const getModalTitle = () => {
    switch (actionType) {
      case "approve":
        return "Setujui Permohonan Layanan"
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
    <Modal show={show} onClose={onClose} title={getModalTitle()} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info Header */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Nomor Permohonan:</span>
            <span className="font-bold text-brand-700">{permohonanId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Nama Pemohon:</span>
            <span className="font-semibold text-slate-800">{pelangganName}</span>
          </div>
        </div>

        {/* Form Inputs based on Action */}
        {actionType === "approve" && (
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4" />
              <span>Konfirmasi Persetujuan</span>
            </div>
            <p>
              Dengan menyetujui berkas permohonan ini, data akan diteruskan ke Bendahara PNBP untuk diterbitkan invoice tagihan resmi.
            </p>
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
              placeholder="Contoh: Lampiran KTP peserta no. 2 buram, mohon upload ulang foto KTP yang jelas..."
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
              ? "Ya, Setujui Permohonan"
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
