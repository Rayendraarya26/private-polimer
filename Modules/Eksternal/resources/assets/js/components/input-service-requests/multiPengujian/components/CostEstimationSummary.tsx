import React from "react"
import { Calculator, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import {
  calculateGrandTotal,
  calculateSampleSubtotal,
  KategoriTarif,
  PengujianSampleItem,
} from "../../../../types/pengujian"
import { Badge } from "../../../ui/Badge"

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
    <div className="bg-gradient-to-br from-brand-900 via-slate-900 to-brand-950 text-white rounded-2xl p-6 shadow-md border border-brand-800/60 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Stats */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-300 text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Estimasi Tarif PNBP Laboratorium</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-2">
            {formatRupiah(grandTotal)}
            <span className="text-xs font-normal text-slate-400">
              (Estimasi belum termasuk PPN/Biaya kirim)
            </span>
          </h3>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-brand-200 border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {samples.length} Sampel Terdaftar
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-brand-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {totalParameters} Parameter Uji Dipilih
            </span>
            {isMahasiswa && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Tarif Mahasiswa (PP 54) Diterapkan
              </span>
            )}
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15 min-w-[240px] text-xs space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 pb-1 border-b border-white/10">
            Rincian Subtotal per Sampel:
          </div>
          <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
            {samples.map((sample, idx) => {
              const subtotal = calculateSampleSubtotal(sample, kategoriTarif)
              return (
                <div
                  key={sample.id}
                  className="flex items-center justify-between text-[11px] gap-2 text-slate-200"
                >
                  <span className="truncate max-w-[140px]" title={sample.nama_sampel || `Sampel #${idx + 1}`}>
                    {sample.nama_sampel ? `#${idx + 1} ${sample.nama_sampel}` : `Sampel #${idx + 1}`}
                  </span>
                  <span className="font-semibold text-brand-200 shrink-0">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Notice info */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-300">
        <AlertCircle className="w-3.5 h-3.5 text-brand-300 shrink-0" />
        <span>
          Biaya final akan diverifikasi kembali oleh bagian Penerimaan Sampel (Loket Pengujian) saat
          sampel fisik tiba dan kondisi fisik telah divalidasi.
        </span>
      </div>
    </div>
  )
}

export default CostEstimationSummary
