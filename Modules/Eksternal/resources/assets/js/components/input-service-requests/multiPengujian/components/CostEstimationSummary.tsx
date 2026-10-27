import React from "react"
import { Receipt } from "lucide-react"
import {
  calculateGrandTotal,
  KategoriTarif,
  PengujianSampleItem,
} from "../../../../types/pengujian"

interface CostEstimationSummaryProps {
  samples: PengujianSampleItem[]
  kategoriTarif: KategoriTarif
}

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const CostEstimationSummary: React.FC<CostEstimationSummaryProps> = ({
  samples,
  kategoriTarif,
}) => {
  const grandTotal = calculateGrandTotal(samples, kategoriTarif)
  const totalParameters = samples.reduce(
    (sum, s) => sum + (s.selected_parameters ? s.selected_parameters.length : 0),
    0
  )
  const isMahasiswa = kategoriTarif === "mahasiswa_pp54"

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-none">
      {/* Aksen warna di sisi kiri */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-brand-500 to-brand-800" />

      <div className="pl-6 pr-5 sm:pl-8 sm:pr-7 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex w-12 h-12 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 items-center justify-center shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-500">Estimasi total biaya</p>
            <p className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight leading-tight transition-all">
              {formatRupiah(grandTotal)}
            </p>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {samples.length} sampel · {totalParameters} parameter
              {isMahasiswa && " · tarif mahasiswa"}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 sm:text-right sm:max-w-[220px] leading-relaxed">
          Sesuai tarif PNBP yang berlaku. Belum termasuk PPN jika ada.
        </p>
      </div>
    </div>
  )
}

export default CostEstimationSummary
