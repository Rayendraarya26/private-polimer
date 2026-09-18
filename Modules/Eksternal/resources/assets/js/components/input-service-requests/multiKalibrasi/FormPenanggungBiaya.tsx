import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { UserCheck } from "lucide-react"

export const FormPenanggungBiaya: React.FC = () => {
  const [biayaDitanggungSama, setBiayaDitanggungSama] = useState(true)

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <UserCheck className="w-4 h-4 text-brand-600" />
              Informasi Pelanggan
            </CardTitle>
            <CardDescription>
              Data pemohon dan identitas kepemilikan sertifikat kalibrasi
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama Pemohon */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Nama Pemohon / Kontak Person <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              name="namaPemohon"
              id="namaPemohon"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Sertifikat Dibuat untuk */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Hasil Kalibrasi / Sertifikat Dibuat untuk <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: PT Industri Maju Bersama"
              name="hasil_kalibrasi"
              id="hasil_kalibrasi"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Alamat Pemohon / Instansi */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Alamat Lengkap Pemohon / Instansi <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              id="alamatPemohon"
              name="alamatPemohon"
              placeholder="Alamat lengkap instansi/perusahaan pemohon"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Checkbox Penanggung Biaya */}
        <div className="pt-2 border-t border-slate-200 space-y-4">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={biayaDitanggungSama}
              onChange={(e) => setBiayaDitanggungSama(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
            />
            <span>Biaya ditanggung oleh pihak/instansi pemohon di atas</span>
          </label>

          {!biayaDitanggungSama && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-50 duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Nama Penanggung Biaya <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama instansi/pihak penanggung biaya"
                  name="namaBiaya"
                  id="namaBiaya"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Alamat Penanggung Biaya <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  id="alamatBiaya"
                  name="alamatBiaya"
                  placeholder="Alamat lengkap penanggung biaya"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FormPenanggungBiaya
