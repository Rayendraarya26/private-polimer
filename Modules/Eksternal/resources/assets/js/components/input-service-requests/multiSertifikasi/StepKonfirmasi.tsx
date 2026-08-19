import React from "react"
import { SertifikasiFormData } from "../../../../types/sertifikasi"
import { Card, CardContent } from "../../../ui/Card"
import { CheckSquare, Building2, Factory, Package, FileCheck, Send, Save, Loader2 } from "lucide-react"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  submitting: boolean
  onBack: () => void
  onSubmit: (aksi: "draft" | "ajukan") => void
}

export const StepKonfirmasi: React.FC<Props> = ({
  formData,
  setFormData,
  submitting,
  onBack,
  onSubmit,
}) => {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 shadow-xs">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-brand-600" />
              Ringkasan Data Permohonan Sertifikasi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Mohon periksa kembali seluruh rincian informasi sebelum melakukan pengajuan resmi.
            </p>
          </div>

          {/* Section 1: Profil Perusahaan */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-brand-600" /> Profil Pemohon
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold">
                {formData.tipe_pengajuan}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Nama Perusahaan:</span>
                <span className="font-semibold text-slate-800">{formData.nama_perusahaan || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email Resmi:</span>
                <span className="font-semibold text-slate-800">{formData.email || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Kontak WhatsApp:</span>
                <span className="font-semibold text-slate-800">{formData.no_whatsapp || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Alamat Kantor:</span>
                <span className="font-semibold text-slate-800">{formData.alamat_kantor || "-"}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Lokasi Pabrik */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Factory className="w-4 h-4 text-brand-600" /> Lokasi Pabrik ({formData.pabrik.length} Lokasi)
            </span>
            <div className="divide-y divide-slate-200/60">
              {formData.pabrik.map((p, idx) => (
                <div key={idx} className="py-2 text-xs text-slate-600 first:pt-1 last:pb-0">
                  <span className="font-semibold text-slate-800">{p.nama_pabrik}</span>
                  <p className="text-[11px] text-slate-500">{p.alamat_pabrik}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Daftar Komoditi Multi-Item */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-brand-600" /> Daftar Komoditi & Produk ({formData.items.length} Item)
            </span>
            <div className="divide-y divide-slate-200/60">
              {formData.items.map((item, idx) => (
                <div key={idx} className="py-2 text-xs flex items-center justify-between first:pt-1 last:pb-0">
                  <div>
                    <span className="font-semibold text-slate-800">
                      {idx + 1}. {item.nama_produk}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Merk: {item.merk_dagang || "-"} | Acuan: {item.standar_sni_iso || "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Berkas Terunggah */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-brand-600" /> Kelengkapan Berkas
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className={formData.dok_legalitas ? "text-emerald-600" : "text-slate-300"}>●</span>
                Legalitas NIB/Akta: {formData.dok_legalitas ? "Terlampir" : "Belum ada"}
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className={formData.dok_manual_mutu ? "text-emerald-600" : "text-slate-300"}>●</span>
                Manual Mutu: {formData.dok_manual_mutu ? "Terlampir" : "Belum ada"}
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className={formData.dok_diagram_alir ? "text-emerald-600" : "text-slate-300"}>●</span>
                Diagram Alir: {formData.dok_diagram_alir ? "Terlampir" : "Belum ada"}
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className={formData.dok_lainnya ? "text-emerald-600" : "text-slate-300"}>●</span>
                Dokumen Tambahan: {formData.dok_lainnya ? "Terlampir" : "Belum ada"}
              </span>
            </div>
          </div>

          {/* Section 5: Persetujuan Syarat */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border border-brand-200 bg-brand-50/50">
              <input
                type="checkbox"
                checked={formData.setuju_syarat}
                onChange={(e) => setFormData((prev) => ({ ...prev, setuju_syarat: e.target.checked }))}
                className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                Saya menyatakan bahwa seluruh data dan dokumen yang diajukan adalah benar dan sah. Saya bersedia
                mengikuti seluruh prosedur audit sertifikasi sesuai regulasi yang berlaku di Balai Besar Standardisasi
                dan Pelayanan Jasa Industri Kerajinan dan Batik (BBKKP).
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
        >
          &larr; Kembali
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSubmit("draft")}
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-all disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Simpan Draf
          </button>

          <button
            type="button"
            onClick={() => onSubmit("ajukan")}
            disabled={submitting || !formData.setuju_syarat}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Ajukan Permohonan Sertifikasi
          </button>
        </div>
      </div>
    </div>
  )
}

export default StepKonfirmasi
