import React from "react"
import { Button } from "../ui/Button"

interface Step4PernyataanProps {
  onBack: () => void
}

const Step4Pernyataan: React.FC<Step4PernyataanProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Pernyataan</h3>
        <p className="text-xs text-slate-500 mt-1">
          Konfirmasi dan setujui pernyataan untuk menyelesaikan permohonan.
        </p>
      </div>

      <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-400">
          Form Pernyataan akan ditempatkan di sini
        </p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onBack} className="px-6">
          Kembali
        </Button>
        <Button type="button" className="px-6">
          Kirim Permohonan
        </Button>
      </div>
    </div>
  )
}

export default Step4Pernyataan
