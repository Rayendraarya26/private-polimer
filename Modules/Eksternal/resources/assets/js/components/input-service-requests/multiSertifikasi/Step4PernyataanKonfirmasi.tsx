import React from "react"
import { SertifikasiFormData } from "../../../types/sertifikasi"
import { Card, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import {
  CheckSquare,
  Building2,
  Factory,
  Package,
  FileCheck,
  Send,
  Save,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Award,
  History,
  Tag,
} from "lucide-react"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  skemaList: any[]
  submitting: boolean
  onBack: () => void
  onSubmit: (aksi: "draft" | "ajukan") => void
}

export const Step4PernyataanKonfirmasi: React.FC<Props> = ({
  formData,
  setFormData,
  skemaList,
  submitting,
  onBack,
  onSubmit,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. RINGKASAN DATA PENGAJUAN */}
      <Card className="border-slate-200 shadow-soft overflow-hidden">
        <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckSquare className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Ringkasan Permohonan Sertifikasi Produk & Sistem
              </h3>
              <p className="text-[11px] text-slate-500">
                Tinjau kembali seluruh data dan berkas sebelum mengirimkan permohonan ke Balai Besar.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-brand-50 text-brand-700 font-bold text-xs rounded-full border border-brand-200">
            Total {formData.pengajuan.length} Pengajuan
          </span>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Per Pengajuan Summary */}
          {formData.pengajuan.map((p, idx) => {
            const skema = skemaList.find((s) => s.id === p.skema_id)

            return (
              <div
                key={p.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Pengajuan #{idx + 1}: {skema ? skema.lingkup || skema.nama : "Ruang Lingkup Belum Dipilih"}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.jenis_pengajuan === "baru"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {p.jenis_pengajuan === "baru"
                      ? "Sertifikat Baru"
                      : `Perpanjangan (${p.sertifikat_lama_text || "-"})`}
                  </span>
                </div>

                {/* Items/Commodities */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Daftar Komoditi ({p.items.length} item):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {p.items.map((item, itemIdx) => (
                      <div
                        key={item.id || itemIdx}
                        className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-0.5"
                      >
                        <p className="font-bold text-slate-800">{item.nama_produk || "-"}</p>
                        <p className="text-[11px] text-slate-500">
                          Merk: {item.merk_dagang || "-"} | SNI/ISO: {item.standar_sni_iso || "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Berkas Upload */}
                <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-2 text-[11px]">
                  <span className="font-semibold text-slate-500">Berkas Terlampir:</span>
                  {p.dok_legalitas && (
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-emerald-600" /> Legalitas
                    </span>
                  )}
                  {p.dok_manual_mutu && (
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-emerald-600" /> Manual Mutu
                    </span>
                  )}
                  {p.dok_diagram_alir && (
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-emerald-600" /> Diagram Alir
                    </span>
                  )}
                  {p.dok_lainnya && (
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-emerald-600" /> Dokumen Lain
                    </span>
                  )}
                  {!p.dok_legalitas && !p.dok_manual_mutu && !p.dok_diagram_alir && !p.dok_lainnya && (
                    <span className="text-slate-400 italic">Belum ada berkas yang diunggah</span>
                  )}
                </div>
              </div>
            )
          })}

          {/* Company & Factory Snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                <Building2 className="w-4 h-4 text-brand-600" /> Profil Badan Usaha
              </div>
              <p><span className="text-slate-500">Nama Perusahaan:</span> <span className="font-semibold">{formData.nama_perusahaan || "-"}</span></p>
              <p><span className="text-slate-500">PIC / WhatsApp:</span> <span className="font-semibold">{formData.no_whatsapp || "-"}</span></p>
              <p><span className="text-slate-500">Email:</span> <span className="font-semibold">{formData.email || "-"}</span></p>
              <p><span className="text-slate-500">Alamat:</span> <span className="font-semibold">{formData.alamat_kantor || "-"}</span></p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                <Factory className="w-4 h-4 text-brand-600" /> Fasilitas Pabrik ({formData.pabrik.length} lokasi)
              </div>
              {formData.pabrik.map((f, fIdx) => (
                <p key={fIdx} className="text-[11px] text-slate-600">
                  • <span className="font-semibold text-slate-800">{f.nama_pabrik || "-"}</span> ({f.alamat_pabrik || "-"})
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. PAKTA INTEGRITAS & PERNYATAAN */}
      <Card className="border-amber-200 bg-amber-50/40 shadow-soft">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-amber-900 text-sm">
                Pakta Integritas & Pernyataan Kebenaran Dokumen
              </h4>
              <p className="text-amber-800 leading-relaxed">
                Dengan mencentang pernyataan ini, pemohon menyatakan dengan sadar dan sesungguhnya bahwa seluruh data,
                informasi fasilitas pabrik, dan berkas legalitas yang dilampirkan adalah benar dan sah.
                Pemohon bersedia memenuhi seluruh tahapan asesmen kesesuaian dan audit yang ditetapkan oleh BBKKP.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-200/80">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.setuju_syarat}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, setuju_syarat: e.target.checked }))
                }
                className="w-4 h-4 mt-0.5 rounded border-amber-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs font-bold text-slate-800">
                Saya menyetujui seluruh ketentuan layanan sertifikasi, pakta integritas, dan bersedia mengikuti proses evaluasi teknis.
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* 3. NAVIGATION & SUBMIT BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={submitting}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Kembali ke Langkah 3
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSubmit("draft")}
            disabled={submitting}
            leftIcon={<Save className="w-4 h-4 text-slate-500" />}
            className="flex-1 sm:flex-none border-slate-300 hover:bg-slate-50"
          >
            Simpan Draft
          </Button>

          <Button
            type="button"
            onClick={() => onSubmit("ajukan")}
            disabled={submitting || !formData.setuju_syarat}
            leftIcon={
              submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )
            }
            className="flex-1 sm:flex-none px-8 font-bold bg-brand-600 hover:bg-brand-700"
          >
            {submitting ? "Memproses Permohonan..." : "Kirim Pengajuan Sekarang"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Step4PernyataanKonfirmasi
