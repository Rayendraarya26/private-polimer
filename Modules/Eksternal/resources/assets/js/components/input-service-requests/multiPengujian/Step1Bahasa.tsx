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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opsi 1 (Bahasa Indonesia) */}
            <div
              onClick={() => handleSelectBahasa("id")}
              className={`relative rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all duration-200 ${sharedData.bahasa_laporan === "id"
                ? "border-brand-600 bg-brand-50/40 ring-2 ring-brand-600/10 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${sharedData.bahasa_laporan === "id"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500"
                    }`}
                >
                  <Languages className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Bahasa Indonesia
                  </span>
                </div>
              </div>
            </div>

            {/* Opsi 2 (Bahasa Inggris) */}
            <div
              onClick={() => handleSelectBahasa("en")}
              className={`relative rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all duration-200 ${sharedData.bahasa_laporan === "en"
                ? "border-brand-600 bg-brand-50/40 ring-2 ring-brand-600/10 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${sharedData.bahasa_laporan === "en"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500"
                    }`}
                >
                  <Globe className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Bahasa Inggris
                  </span>
                </div>
              </div>
            </div>
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
