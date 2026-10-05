import React from "react"
import { Button } from "../ui/Button"

export interface RejectPenawaranModalProps {
  isOpen: boolean
  onClose: () => void
  rejectCatatan: string
  setRejectCatatan: (catatan: string) => void
  onConfirm: () => void
  isLoading?: boolean
}

export const RejectPenawaranModal: React.FC<RejectPenawaranModalProps> = ({
  isOpen,
  onClose,
  rejectCatatan,
  setRejectCatatan,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen) return null

  return (
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
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Kirim Tanggapan
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RejectPenawaranModal
