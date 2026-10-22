import React from "react"
import { Calculator } from "lucide-react"
import {
  calculateGrandTotal,
  KategoriTarif,
  PengujianSampleItem,
} from "../../../../types/pengujian"
import { Card, CardContent } from "../../../ui/Card"

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
    <Card className="rounded-2xl border-slate-200/90 shadow-soft bg-gradient-to-r from-slate-50 via-brand-50/20 to-white overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-brand-600" />
                Estimasi Total Tarif Pengujian
              </span>
              {isMahasiswa && (
                <span className="text-[10px] font-semibold bg-brand-100/70 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">
                  Tarif Mahasiswa PP 54
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {formatRupiah(grandTotal)}
              </h3>
              <span className="text-xs text-slate-400 font-normal">
                (Belum termasuk PPN jika berlaku)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {samples.length} Sampel Terdaftar • {totalParameters} Parameter Uji Dipilih
            </p>
          </div>

          <div className="text-left sm:text-right text-[11px] text-slate-400 self-end sm:self-center">
            *Estimasi resmi sesuai tarif PNBP yang berlaku
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CostEstimationSummary
