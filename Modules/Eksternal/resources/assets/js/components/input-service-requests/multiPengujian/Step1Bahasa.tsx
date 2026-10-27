import React from "react"
import { Languages, Globe, ArrowRight, ShieldCheck } from "lucide-react"
import { BahasaLaporan, PengujianSharedData } from "../../../types/pengujian"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Button } from "../../ui/Button"
import { RadioCardGroup } from "../../forms"

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

        <CardContent className="p-5 sm:p-6 space-y-5">
          <RadioCardGroup
            name="bahasa_laporan"
            value={sharedData.bahasa_laporan}
            onChange={(val) => handleSelectBahasa(val as BahasaLaporan)}
            gridCols={2}
            options={[
              {
                value: "id",
                title: "Bahasa Indonesia",
                description:
                  "Laporan diterbitkan dalam Bahasa Indonesia. Cocok untuk keperluan dalam negeri, instansi pemerintah, dan sertifikasi SNI.",
                badge: "ID",
                icon: <Languages className="w-5 h-5" />,
              },
              {
                value: "en",
                title: "Bahasa Inggris (English)",
                description:
                  "Laporan diterbitkan dalam Bahasa Inggris. Cocok untuk keperluan ekspor, mitra luar negeri, dan standar internasional.",
                badge: "EN",
                icon: <Globe className="w-5 h-5" />,
              },
            ]}
          />

          {/* Info tambahan */}
          <div className="flex items-start gap-2.5 rounded-xl border border-sky-100 bg-sky-50/70 p-3.5">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-slate-700">
              Bahasa yang dipilih berlaku untuk seluruh sampel dalam permohonan ini dan tidak dapat
              diubah secara sepihak setelah dokumen hasil uji diterbitkan.
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
          className="h-[42px] px-6 rounded-xl font-semibold text-sm shadow-md shadow-brand-500/15"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}

export default Step1Bahasa

