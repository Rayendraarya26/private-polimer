import React from "react"
import { Languages, Globe, CheckCircle2, ArrowRight, ShieldCheck, FileText } from "lucide-react"
import { BahasaLaporan, PengujianSharedData } from "../../../types/pengujian"
import { Button } from "../../ui/Button"
import { Badge } from "../../ui/Badge"

interface Step1BahasaProps {
  sharedData: PengujianSharedData
  setSharedData: React.Dispatch<React.SetStateAction<PengujianSharedData>>
  onNext: () => void
}

export const Step1Bahasa: React.FC<Step1BahasaProps> = ({
  sharedData,
  setSharedData,
  onNext,
}) => {
  const handleSelectBahasa = (lang: BahasaLaporan) => {
    setSharedData((prev) => ({
      ...prev,
      bahasa_laporan: lang,
    }))
  }

  const options: {
    id: BahasaLaporan
    code: string
    title: string
    subtitle: string
    description: string
    badges: string[]
    recommended?: boolean
  }[] = [
    {
      id: "id",
      code: "ID",
      title: "Bahasa Indonesia",
      subtitle: "Format Standar Nasional Indonesia",
      description:
        "Laporan Hasil Uji (LHU) resmi diterbitkan menggunakan Bahasa Indonesia baku sesuai regulasi Kemenperin RI, Komite Akreditasi Nasional (KAN), dan SNI.",
      badges: ["Standar Nasional BBKKP", "Resmi Domestik", "Regulasi SNI"],
      recommended: true,
    },
    {
      id: "en",
      code: "EN",
      title: "English (International)",
      subtitle: "Test Report / Certificate of Analysis",
      description:
        "Official laboratory test report is issued in professional English, suitable for international trade, overseas supply chain audits, and export documentation.",
      badges: ["Global Trade", "Export Documentation", "International Clients"],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tahap 1: Bahasa Laporan Pengujian (LHU)
            </h2>
            <p className="text-xs text-slate-500">
              Tentukan bahasa resmi yang akan digunakan pada dokumen Laporan Hasil Pengujian
              (Certificate of Analysis) yang diterbitkan oleh Balai.
            </p>
          </div>
        </div>
      </div>

      {/* Language Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = sharedData.bahasa_laporan === opt.id

          return (
            <div
              key={opt.id}
              onClick={() => handleSelectBahasa(opt.id)}
              className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-gradient-to-b from-brand-50/70 via-white to-brand-50/30 border-brand-600 shadow-md ring-4 ring-brand-500/10"
                  : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                      isSelected
                        ? "bg-brand-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {opt.code}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{opt.title}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">{opt.subtitle}</p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                {opt.description}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                {opt.badges.map((badge, idx) => (
                  <Badge
                    key={idx}
                    variant={isSelected ? "primary" : "secondary"}
                    size="sm"
                    className="text-[10px]"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Information Banner */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-amber-900 text-xs">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-amber-950">Catatan Pemilihan Bahasa:</p>
          <p className="text-amber-800 leading-relaxed">
            Format bahasa yang dipilih akan langsung diterapkan saat verifikator menyusun draf
            Laporan Hasil Pengujian (LHU) dan penerbitan Tanda Tangan Elektronik (TTE BSrE).
            Pastikan pilihan telah sesuai dengan kebutuhan administrasi atau audit Anda.
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-end pt-2">
        <Button
          type="button"
          variant="primary"
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto px-6 py-2.5 font-semibold text-xs shadow-xs"
        >
          Lanjut ke Data Permintaan
        </Button>
      </div>
    </div>
  )
}

export default Step1Bahasa
