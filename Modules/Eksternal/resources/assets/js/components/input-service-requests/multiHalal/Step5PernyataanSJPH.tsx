import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { FormHalalPayload } from "../../../types/halal"
import {
  FileCheck,
  Upload,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Boxes,
  Package,
  UserCheck,
  FileSpreadsheet,
} from "lucide-react"

interface Step5Props {
  payload: FormHalalPayload
  onChange: (updater: (prev: FormHalalPayload) => FormHalalPayload) => void
}

export const Step5PernyataanSJPH: React.FC<Step5Props> = ({ payload, onChange }) => {
  const isReguler = payload.dataPengajuan.jalur_pendaftaran === "reguler"
  const pu = payload.dataPelakuUsaha
  const p = payload.dataPenyelia

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              5. Dokumen Kelengkapan, Ikrar & Pernyataan Komitmen
            </CardTitle>
            <CardDescription>
              Unggah berkas persyaratan resmi, verifikasi ringkasan data pengajuan, serta setujui ikrar komitmen Sistem Jaminan Produk Halal
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Section 1: Unggah Dokumen Kelengkapan */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Dokumen Kelengkapan Sertifikasi Halal
              </h4>
              <p className="text-[11px] text-slate-500">
                {isReguler
                  ? "Unggah Surat Permohonan resmi dan Manual Sistem Jaminan Produk Halal (SJPH)"
                  : "Dokumen komitmen dan surat pernyataan mandiri pelaku usaha"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Surat Permohonan */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-0.5">
                  Surat Permohonan Sertifikasi Halal {isReguler && <span className="text-red-500">*</span>}
                </label>
                <p className="text-[11px] text-slate-500">
                  Surat resmi permohonan bertandatangan pimpinan / materai (PDF maks 5MB)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-brand-500 transition-colors shadow-xs">
                  <Upload className="w-4 h-4 text-slate-500" />
                  Pilih Berkas PDF
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null
                      onChange((prev) => ({ ...prev, file_surat_permohonan: f }))
                    }}
                  />
                </label>
                {payload.file_surat_permohonan ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 truncate">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[160px]">
                      {payload.file_surat_permohonan.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Belum ada file</span>
                )}
              </div>
            </div>

            {/* Manual SJPH */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-0.5">
                  Manual Sistem Jaminan Produk Halal (SJPH) {isReguler && <span className="text-red-500">*</span>}
                </label>
                <p className="text-[11px] text-slate-500">
                  Dokumen manual penerapan komitmen halal & PPH perusahaan (PDF maks 10MB)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-brand-500 transition-colors shadow-xs">
                  <Upload className="w-4 h-4 text-slate-500" />
                  Pilih Berkas Manual
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null
                      onChange((prev) => ({ ...prev, file_manual_sjph: f }))
                    }}
                  />
                </label>
                {payload.file_manual_sjph ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 truncate">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate max-w-[160px]">
                      {payload.file_manual_sjph.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Belum ada file</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Ringkasan Pengajuan (Review Box) */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Ringkasan Berkas Permohonan
              </h4>
              <p className="text-[11px] text-slate-500">
                Periksa kembali data pengajuan sebelum mengirimkan formulir
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block mb-0.5">Jalur Sertifikasi</span>
              <span className="text-xs font-bold text-brand-700 uppercase">
                {payload.dataPengajuan.jalur_pendaftaran === "reguler"
                  ? "Reguler (Audit LPH)"
                  : "Self Declare (SEHATI UMK)"}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block mb-0.5">Pelaku Usaha</span>
              <span className="text-xs font-bold text-slate-800 truncate block">
                {pu.nama_usaha || "-"}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block mb-0.5">Penyelia Halal</span>
              <span className="text-xs font-bold text-slate-800 truncate block">
                {p.penyelia_nama || "-"}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 block mb-0.5">Total Bahan & Produk</span>
              <span className="text-xs font-bold text-slate-800">
                {payload.dataBahan.length} Bahan • {payload.dataProduk.length} Produk
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Pernyataan Komitmen & Integritas Halal */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Pernyataan Komitmen & Integritas Halal <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Komitmen kepatuhan terhadap regulasi Jaminan Produk Halal (UU No. 33 Tahun 2014)
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={payload.pernyataan_bebas_babi}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    pernyataan_bebas_babi: e.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900 block mb-0.5">
                  Ikrar Bebas Najis & Bahan Diharamkan (Bebas Babi)
                </span>
                Dengan ini menyatakan dengan sungguh-sungguh bahwa seluruh fasilitas produksi, peralatan pengolahan, bahan baku, bahan tambahan, serta produk akhir yang didaftarkan <strong>bebas dari babi beserta seluruh turunannya</strong>, bangkai, darah, minuman keras/khamr, dan unsur najis lainnya sesuai syariat Islam.
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer pt-2.5 border-t border-emerald-200/70">
              <input
                type="checkbox"
                checked={payload.pernyataan_komitmen_sjph}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    pernyataan_komitmen_sjph: e.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div className="text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900 block mb-0.5">
                  Komitmen Penerapan Sistem Jaminan Produk Halal (SJPH)
                </span>
                Berkomitmen untuk senantiasa menerapkan dan menjaga kesinambungan Sistem Jaminan Produk Halal (SJPH), menggunakan bahan halal yang telah disetujui, serta bersedia menerima pemeriksaan/audit berkala oleh LPH BBSPJIKKP dan BPJPH Kemenag RI.
              </div>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
