import React from "react"
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
    <div className="w-full rounded-xl border border-slate-300 bg-white p-4 space-y-1 text-left shadow-none">
      <span className="block text-xs font-semibold text-slate-500">Estimasi Total Biaya</span>
      <p className="text-xs text-slate-500">
        {samples.length} sampel · {totalParameters} parameter
        {isMahasiswa && " · tarif mahasiswa"}
      </p>
      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
        {formatRupiah(grandTotal)}
      </span>
      <p className="text-xs text-slate-400 leading-relaxed text-start">
        * Belum termasuk PPN jika ada.
      </p>
     
    </div>
  )
}

export default CostEstimationSummary
