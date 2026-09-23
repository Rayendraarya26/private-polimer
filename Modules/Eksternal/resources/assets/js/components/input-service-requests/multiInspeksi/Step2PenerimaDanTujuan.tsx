import React from "react"
import {
  Building2,
  Languages,
  Target,
  CheckCircle2,
  Mail,
  MapPin,
  FileCheck2,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { BahasaLaporan, InspeksiFormData } from "../../../types/inspeksi"

interface Step2PenerimaDanTujuanProps {
  formData: InspeksiFormData
  setFormData: React.Dispatch<React.SetStateAction<InspeksiFormData>>
}

export const Step2PenerimaDanTujuan: React.FC<Step2PenerimaDanTujuanProps> = ({
  formData,
  setFormData,
}) => {
  const { dataPermohonan, dataPelaksanaan, dataPenerima } = formData

  const handleSelectBahasa = (lang: BahasaLaporan) => {
    setFormData((prev) => ({
      ...prev,
      dataPelaksanaan: {
        ...prev.dataPelaksanaan,
        bahasa_laporan: lang,
      },
    }))
  }

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <Target className="w-4 h-4 text-brand-600" />
              2. Tujuan Inspeksi, Bahasa Dokumen & Penerima Hasil
            </CardTitle>
            <CardDescription>
              Tentukan tujuan pelaksanaan inspeksi, bahasa resmi laporan/sertifikat, serta identitas pihak penerima hasil inspeksi
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* 1. Tujuan Inspeksi */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Tujuan Pelaksanaan Inspeksi <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Uraikan maksud dan tujuan permohonan jasa inspeksi ini
              </p>
            </div>
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="Contoh: Membuktikan mampu produksi kemasan beras bantuan pangan 10kg untuk persyaratan tender/pengadaan Perum BULOG..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={dataPermohonan.tujuan_inspeksi}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataPermohonan: {
                    ...prev.dataPermohonan,
                    tujuan_inspeksi: e.target.value,
                  },
                }))
              }
              required
            />
          </div>
        </div>

        {/* 2. Bahasa Laporan Inspeksi */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Bahasa Laporan / Sertifikat Hasil Inspeksi <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Pilih bahasa penerbitan dokumen sertifikat hasil inspeksi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bahasa Indonesia */}
            <div
              onClick={() => handleSelectBahasa("indonesia")}
              className={`cursor-pointer border rounded-xl p-4 transition-all flex items-start gap-3 select-none ${
                dataPelaksanaan.bahasa_laporan === "indonesia"
                  ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500/30"
                  : "border-slate-300 hover:border-slate-400 bg-white"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                  dataPelaksanaan.bahasa_laporan === "indonesia"
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {dataPelaksanaan.bahasa_laporan === "indonesia" && (
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">Bahasa Indonesia</span>
                  <span className="text-[10px] bg-brand-100 text-brand-700 font-semibold px-2 py-0.5 rounded-full">
                    Standar Nasional
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Format baku Laporan Hasil Inspeksi standar Indonesia sesuai regulasi Kementerian Perindustrian
                  dan Perum BULOG.
                </p>
              </div>
            </div>

            {/* Bahasa Inggris */}
            <div
              onClick={() => handleSelectBahasa("inggris")}
              className={`cursor-pointer border rounded-xl p-4 transition-all flex items-start gap-3 select-none ${
                dataPelaksanaan.bahasa_laporan === "inggris"
                  ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500/30"
                  : "border-slate-300 hover:border-slate-400 bg-white"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                  dataPelaksanaan.bahasa_laporan === "inggris"
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {dataPelaksanaan.bahasa_laporan === "inggris" && (
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">Bahasa Inggris (English)</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                    Internasional
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Format Inspection Report berbahasa Inggris untuk rantai pasok ekspor maupun kebutuhan audit
                  internasional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Hasil Inspeksi Dibuat Untuk */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Hasil Inspeksi Dibuat Untuk
              </h4>
              <p className="text-[11px] text-slate-500">
                Pihak atau instansi yang akan dicantumkan sebagai pemilik/penerima dokumen hasil inspeksi
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Instansi / Lembaga Penerima <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Perum BULOG"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                value={dataPenerima.penerima_hasil_nama}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataPenerima: {
                      ...prev.dataPenerima,
                      penerima_hasil_nama: e.target.value,
                    },
                  }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Lengkap Instansi Penerima
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Jln. Jenderal Gatot Subroto Kav. 49, Jakarta Selatan"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={dataPenerima.penerima_hasil_alamat}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataPenerima: {
                      ...prev.dataPenerima,
                      penerima_hasil_alamat: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Instansi Penerima <span className="text-slate-400 font-normal">(opsional)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Contoh: pengadaan@bulog.co.id"
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={dataPenerima.penerima_hasil_email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dataPenerima: {
                        ...prev.dataPenerima,
                        penerima_hasil_email: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step2PenerimaDanTujuan
