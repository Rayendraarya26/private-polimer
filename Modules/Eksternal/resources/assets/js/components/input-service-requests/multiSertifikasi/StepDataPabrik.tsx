import React from "react"
import { SertifikasiFormData, emptyPabrik } from "../../../../types/sertifikasi"
import { Card, CardContent } from "../../../ui/Card"
import { Factory, Plus, Trash2, MapPin, Users2, Maximize2 } from "lucide-react"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  onNext: () => void
  onBack: () => void
}

export const StepDataPabrik: React.FC<Props> = ({ formData, setFormData, onNext, onBack }) => {
  const addPabrik = () => {
    setFormData((prev) => ({
      ...prev,
      pabrik: [...prev.pabrik, emptyPabrik(Date.now())],
    }))
  }

  const removePabrik = (index: number) => {
    if (formData.pabrik.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      pabrik: prev.pabrik.filter((_, i) => i !== index),
    }))
  }

  const updatePabrik = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.pabrik]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, pabrik: updated }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Factory className="w-4 h-4 text-brand-600" />
            Lokasi Pabrik & Fasilitas Produksi
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftarkan seluruh lokasi pabrik/fasilitas manufaktur yang akan diaudit sertifikasi.
          </p>
        </div>

        <button
          type="button"
          onClick={addPabrik}
          className="flex items-center gap-1.5 px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold rounded-xl border border-brand-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Lokasi Pabrik
        </button>
      </div>

      {formData.pabrik.map((pabrik, idx) => (
        <Card key={pabrik.id || idx} className="border-slate-200/80 shadow-xs">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                Pabrik #{idx + 1}
              </span>

              {formData.pabrik.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePabrik(idx)}
                  className="text-rose-500 hover:text-rose-700 text-xs font-medium flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Pabrik
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pabrik / Fasilitas Produksi <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={pabrik.nama_pabrik}
                  onChange={(e) => updatePabrik(idx, "nama_pabrik", e.target.value)}
                  placeholder="Contoh: Plant Cikarang / Pabrik Sepatu Unit 1"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Lokasi Pabrik <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={pabrik.alamat_pabrik}
                    onChange={(e) => updatePabrik(idx, "alamat_pabrik", e.target.value)}
                    placeholder="Kawasan Industri, Jl. Raya, Kelurahan, Kecamatan..."
                    className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kontak Person Pabrik</label>
                <input
                  type="text"
                  value={pabrik.kontak_pabrik || ""}
                  onChange={(e) => updatePabrik(idx, "kontak_pabrik", e.target.value)}
                  placeholder="Nama & No. HP Kepala Pabrik / QA"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Pabrik</label>
                <input
                  type="email"
                  value={pabrik.email_pabrik || ""}
                  onChange={(e) => updatePabrik(idx, "email_pabrik", e.target.value)}
                  placeholder="factory@perusahaan.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Tenaga Kerja (Orang)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={pabrik.jumlah_karyawan || ""}
                    onChange={(e) => updatePabrik(idx, "jumlah_karyawan", parseInt(e.target.value) || 0)}
                    placeholder="Contoh: 150"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <Users2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Luas Fasilitas Produksi (m²)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={pabrik.luas_fasilitas || ""}
                    onChange={(e) => updatePabrik(idx, "luas_fasilitas", e.target.value)}
                    placeholder="Contoh: 5.000 m²"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <Maximize2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
        >
          &larr; Kembali
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/20 transition-all"
        >
          Lanjut ke Daftar Komoditi &rarr;
        </button>
      </div>
    </div>
  )
}

export default StepDataPabrik
