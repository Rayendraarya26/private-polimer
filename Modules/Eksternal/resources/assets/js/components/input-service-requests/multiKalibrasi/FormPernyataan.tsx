import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"
import { ShieldCheck, Info } from "lucide-react"

export interface FormPernyataanProps {
  setujuPernyataan?: boolean
  onChangePernyataan?: (setuju: boolean) => void
}

export const FormPernyataan: React.FC<FormPernyataanProps> = ({
  setujuPernyataan: propPernyataan,
  onChangePernyataan,
}) => {
  const [setuju, setSetuju] = useState<boolean>(propPernyataan ?? true)

  const handleChange = (val: boolean) => {
    setSetuju(val)
    if (onChangePernyataan) onChangePernyataan(val)
  }

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Pernyataan Pemohon Kalibrasi
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-5">
        {/* Box Pernyataan Utama */}
        <label className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/60 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={setuju}
            onChange={(e) => handleChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 shrink-0 cursor-pointer"
          />
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">
              Pernyataan Keabsahan Data & Ketetapan Laporan <span className="text-rose-500">*</span>
            </span>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Setelah laporan ini diterbitkan, maka kami tidak akan minta diadakannya perubahan pada laporan mengenai tanda-tanda alat maupun alamat peminta kalibrasi.
            </p>
          </div>
        </label>

        {/* Informasi Ketentuan Tambahan */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex items-start gap-3">
          <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">
              Ketentuan Penerbitan Sertifikat / Laporan Kalibrasi:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
              <li>Pastikan nomor seri, merek, tipe/model, serta data penanggung biaya yang telah diisikan pada langkah sebelumnya sudah benar dan sesuai fisik instrumen.</li>
              <li>Sertifikat kalibrasi yang diterbitkan oleh Laboratorium Kalibrasi BBSPJIKKP (LK-005-IDN) akan merujuk langsung pada data yang telah diverifikasi dalam formulir ini.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormPernyataan
