import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"
import { MapPinHouse } from "lucide-react"

export const FormLaporanHasil: React.FC = () => {
  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <MapPinHouse className="w-4 h-4 text-brand-600" />
              Laporan Hasil Kalibrasi
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Bahasa yang digunakan pada laporan <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
            >
              <option value="indonesia">Indonesia</option>
              <option value="inggris">English</option>
            </select>
          </div>

          <p className="md:col-span-2 block text-sm font-bold text-slate-800">
            Alamat Pengiriman Laporan Hasil Kalibrasi
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Nama Penerima <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nama Lengkap Penerima"
              name="namaKirim"
              id="namaKirim"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Alamat Pengiriman <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              id="alamatKirim"
              name="alamatKirim"
              placeholder="Alamat lengkap tujuan pengiriman sertifikat / laporan"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormLaporanHasil
