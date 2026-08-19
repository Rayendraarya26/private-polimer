import React from "react"
import { SertifikasiFormData } from "../../../../types/sertifikasi"
import { Card, CardContent } from "../../../ui/Card"
import { FileUp, FileText, CheckCircle2, AlertCircle } from "lucide-react"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  onNext: () => void
  onBack: () => void
}

interface UploadFieldProps {
  label: string
  desc: string
  field: "dok_legalitas" | "dok_manual_mutu" | "dok_diagram_alir" | "dok_lainnya"
  required?: boolean
  file: File | null | undefined
  onChange: (file: File | null) => void
}

const FileUploadItem: React.FC<UploadFieldProps> = ({
  label,
  desc,
  required = false,
  file,
  onChange,
}) => {
  return (
    <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
          <p className="text-[11px] text-slate-500">{desc}</p>
        </div>

        {file && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Terunggah
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-all">
          <FileUp className="w-3.5 h-3.5 text-brand-600" />
          {file ? "Ganti Berkas" : "Pilih Berkas PDF/Gambar"}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0] || null
              onChange(selected)
            }}
          />
        </label>

        {file ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium truncate max-w-xs">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{file.name}</span>
            <span className="text-[10px] text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 italic">Maksimal 10 MB (Format: PDF, JPG, PNG)</span>
        )}
      </div>
    </div>
  )
}

export const StepUploadBerkas: React.FC<Props> = ({ formData, setFormData, onNext, onBack }) => {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardContent className="p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileUp className="w-4 h-4 text-brand-600" />
              Unggah Dokumen Persyaratan Sertifikasi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Silakan unggah dokumen legalitas dan teknis penunjang audit sertifikasi.
            </p>
          </div>

          <div className="space-y-3.5">
            <FileUploadItem
              label="1. Dokumen Legalitas Perusahaan (NIB / Akta / NPWP)"
              desc="Gabungan dokumen NIB berbasis risiko, Akta Pendirian/Perubahan, dan NPWP Badan Usaha."
              required
              field="dok_legalitas"
              file={formData.dok_legalitas}
              onChange={(file) => setFormData((prev) => ({ ...prev, dok_legalitas: file }))}
            />

            <FileUploadItem
              label="2. Manual Mutu / Pedoman Sistem Manajemen Mutu"
              desc="Dokumen manual mutu atau prosedur standar operasional (SOP) produksi."
              field="dok_manual_mutu"
              file={formData.dok_manual_mutu}
              onChange={(file) => setFormData((prev) => ({ ...prev, dok_manual_mutu: file }))}
            />

            <FileUploadItem
              label="3. Diagram Alir Proses Produksi & Layout Pabrik"
              desc="Diagram alir langkah pembuatan produk mulai bahan baku hingga pengemasan akhir."
              field="dok_diagram_alir"
              file={formData.dok_diagram_alir}
              onChange={(file) => setFormData((prev) => ({ ...prev, dok_diagram_alir: file }))}
            />

            <FileUploadItem
              label="4. Dokumen Teknis Lainnya / Hasil Uji Terdahulu"
              desc="Sertifikat SNI lama (jika perpanjangan), sertifikat kalibrasi alat, atau laporan hasil uji lab."
              field="dok_lainnya"
              file={formData.dok_lainnya}
              onChange={(file) => setFormData((prev) => ({ ...prev, dok_lainnya: file }))}
            />
          </div>
        </CardContent>
      </Card>

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
          Lanjut ke Review & Submit &rarr;
        </button>
      </div>
    </div>
  )
}

export default StepUploadBerkas
