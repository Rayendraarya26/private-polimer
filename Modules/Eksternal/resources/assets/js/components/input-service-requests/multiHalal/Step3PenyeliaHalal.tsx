import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { FormHalalPayload } from "../../../types/halal"
import {
  UserCheck,
  Upload,
  FileText,
  ShieldAlert,
  Calendar,
  CheckCircle,
} from "lucide-react"

interface Step3Props {
  payload: FormHalalPayload
  onChange: (updater: (prev: FormHalalPayload) => FormHalalPayload) => void
}

export const Step3PenyeliaHalal: React.FC<Step3Props> = ({ payload, onChange }) => {
  const p = payload.dataPenyelia
  const isReguler = payload.dataPengajuan.jalur_pendaftaran === "reguler"

  const updatePenyelia = (field: string, val: string) => {
    onChange((prev) => ({
      ...prev,
      dataPenyelia: {
        ...prev.dataPenyelia,
        [field]: val,
      },
    }))
  }

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <UserCheck className="w-4 h-4 text-brand-600" />
              3. Data & Berkas Penyelia Halal
            </CardTitle>
            <CardDescription>
              Penyelia Halal bertanggung jawab mengawasi penerapan Proses Produk Halal (PPH) dan wajib beragama Islam
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Section 1: Identitas & SK Penetapan Penyelia */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Identitas & SK Penetapan Penyelia Halal
              </h4>
              <p className="text-[11px] text-slate-500">
                Data identitas personel penyelia yang ditetapkan oleh pimpinan usaha
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              Sesuai ketentuan UU Jaminan Produk Halal, Penyelia Halal beragama Islam dan ditunjuk
              resmi oleh pimpinan perusahaan/pelaku usaha melalui Surat Keputusan (SK) Penetapan.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Penyelia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama lengkap sesuai KTP"
                value={p.penyelia_nama}
                onChange={(e) => updatePenyelia("penyelia_nama", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor KTP / NIK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={16}
                placeholder="16 digit NIK KTP"
                value={p.penyelia_nik}
                onChange={(e) => updatePenyelia("penyelia_nik", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Agama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={p.penyelia_agama || "Islam"}
                readOnly
                className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp / HP Penyelia <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="0812xxxxxxxx"
                value={p.penyelia_kontak}
                onChange={(e) => updatePenyelia("penyelia_kontak", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor SK Penetapan Penyelia
              </label>
              <input
                type="text"
                placeholder="Contoh: SK/001/PH/2026"
                value={p.penyelia_no_sk}
                onChange={(e) => updatePenyelia("penyelia_no_sk", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal SK Penetapan
              </label>
              <input
                type="date"
                value={p.penyelia_tgl_sk}
                onChange={(e) => updatePenyelia("penyelia_tgl_sk", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Sertifikat Pelatihan/Kompetensi {isReguler && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                placeholder="Nomor sertifikat penyelia halal"
                value={p.penyelia_no_sertifikat}
                onChange={(e) => updatePenyelia("penyelia_no_sertifikat", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Sertifikat Pelatihan
              </label>
              <input
                type="date"
                value={p.penyelia_tgl_sertifikat}
                onChange={(e) => updatePenyelia("penyelia_tgl_sertifikat", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Unggah Berkas Pendukung Penyelia Halal */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Unggah Berkas Pendukung Penyelia Halal
              </h4>
              <p className="text-[11px] text-slate-500">
                Format file PDF / JPG / PNG maksimal 10 MB per berkas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* File SK */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  SK Penetapan Penyelia
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                  {payload.file_sk_penyelia ? payload.file_sk_penyelia.name : "Belum ada file dipilih"}
                </span>
              </div>
              <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-brand-500 text-slate-700 text-xs font-semibold transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{payload.file_sk_penyelia ? "Ganti" : "Pilih File"}</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    onChange((prev) => ({ ...prev, file_sk_penyelia: file }))
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* File KTP */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Salinan KTP Penyelia
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                  {payload.file_ktp_penyelia ? payload.file_ktp_penyelia.name : "Belum ada file dipilih"}
                </span>
              </div>
              <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-brand-500 text-slate-700 text-xs font-semibold transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{payload.file_ktp_penyelia ? "Ganti" : "Pilih File"}</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    onChange((prev) => ({ ...prev, file_ktp_penyelia: file }))
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* File Sertifikat */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Sertifikat Pelatihan Penyelia
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
                  {payload.file_sertifikat_penyelia
                    ? payload.file_sertifikat_penyelia.name
                    : "Belum ada file dipilih"}
                </span>
              </div>
              <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-brand-500 text-slate-700 text-xs font-semibold transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{payload.file_sertifikat_penyelia ? "Ganti" : "Pilih File"}</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    onChange((prev) => ({ ...prev, file_sertifikat_penyelia: file }))
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
