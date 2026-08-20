import React from "react"
import { Button } from "../ui/Button"

interface Step3KondisiPerusahaanProps {
  onNext: () => void
  onBack: () => void
}

const Step3KondisiPerusahaan: React.FC<Step3KondisiPerusahaanProps> = ({ onNext, onBack }) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Kondisi Perusahaan</h3>
        <p className="text-xs text-slate-500 mt-1">
          Silakan lengkapi data mengenai kondisi perusahaan Anda.
        </p>
      </div>

      <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-slate-400">
          Form Input Kondisi Perusahaan akan ditempatkan di sini
        </p>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onBack} className="px-6">
          Kembali
        </Button>
        <Button type="button" onClick={onNext} className="px-6">
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}

export default Step3KondisiPerusahaan
