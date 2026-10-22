import React from "react"
import { Languages, Globe, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react"
import { BahasaLaporan, PengujianSharedData } from "../../../types/pengujian"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Button } from "../../ui/Button"
import { Badge } from "../../ui/Badge"

interface Step1BahasaProps {
  sharedData: PengujianSharedData
  setSharedData: React.Dispatch<React.SetStateAction<PengujianSharedData>>
  onNext: () => void
}

const BAHASA_OPTIONS: {
  value: BahasaLaporan
  label: string
  subLabel: string
  code: string
  description: string
  icon: React.ElementType
}[] = [
  {
    value: "id",
    label: "Bahasa Indonesia",
    subLabel: "Indonesian",
    code: "ID",
    description:
      "Laporan diterbitkan dalam Bahasa Indonesia. Cocok untuk keperluan dalam negeri, instansi pemerintah, dan sertifikasi SNI.",
    icon: Languages,
  },
  {
    value: "en",
    label: "Bahasa Inggris",
    subLabel: "English",
    code: "EN",
    description:
      "Laporan diterbitkan dalam Bahasa Inggris. Cocok untuk keperluan ekspor, mitra luar negeri, dan standar internasional.",
    icon: Globe,
  },
]

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

  return (
    <div className="space-y-6">

      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                <Languages className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Pilih Bahasa Laporan Hasil Pengujian</span>
              </CardTitle>
              <CardDescription>
                Tentukan bahasa resmi yang akan digunakan pada dokumen Laporan Hasil Pengujian yang diterbitkan.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-4">
          <div
            role="radiogroup"
            aria-label="Bahasa Laporan Hasil Pengujian"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {BAHASA_OPTIONS.map((opt) => {
              const isSelected = sharedData.bahasa_laporan === opt.value
              const Icon = opt.icon
              return (
                <div
                  key={opt.value}
                  id={`opsi-bahasa-${opt.value}`}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => handleSelectBahasa(opt.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleSelectBahasa(opt.value)
                    }
                  }}
                  className={`group relative flex flex-col gap-4 rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 ${isSelected
                    ? "border-brand-600 bg-brand-50/40 ring-2 ring-brand-600/10 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 hover:shadow-sm"
                    }`}
                >
                  {/* Header: icon, title, indicator */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected
                        ? "bg-brand-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/70"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {opt.label}
                        </span>
                        <Badge variant={isSelected ? "primary" : "neutral"} size="sm">
                          {opt.code}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{opt.subLabel}</p>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />
                    ) : (
                      <span className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0 group-hover:border-slate-400 transition-colors" />
                    )}
                  </div>

                  {/* Deskripsi */}
                  <p className="text-xs leading-relaxed text-slate-600">
                    {opt.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Info tambahan */}
          <div className="flex items-start gap-2 rounded-lg border border-sky-100 bg-sky-50/60 px-3 py-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-slate-600">
              Bahasa yang dipilih berlaku untuk seluruh sampel dalam permintaan ini dan tidak dapat
              diubah setelah laporan diterbitkan.
            </p>
          </div>
        </CardContent>
      </Card>



      {/* Footer Navigation */}
      <div className="flex items-center justify-end pt-2">
        <Button
          type="button"
          variant="primary"
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto px-6 py-2.5 font-semibold text-xs shadow-xs"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}

export default Step1Bahasa
