import React from "react"
import { SertifikasiFormData } from "../../../types/sertifikasi"
import { LegalStatementBox, StickyFormActions } from "../../forms"
import {
  CheckSquare,
  Building2,
  Factory,
  FileCheck,
} from "lucide-react"
import {
  StepPanel,
  ReviewCard,
  SummaryRow,
} from "../common/WizardUI"

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
      <StepPanel
        icon={CheckSquare}
        title="Pernyataan & Kirim"
        description="Pakta integritas & konfirmasi"
      >
        <div className="space-y-6">
          {/* 1. RINGKASAN DATA PENGAJUAN */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-none overflow-hidden">
            <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
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

            <div className="p-5 sm:p-6 space-y-5">
              {/* Per Pengajuan Summary */}
              {formData.pengajuan.map((p, idx) => {
                const skema = skemaList.find((s) => String(s.id) === String(p.skema_id))

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
                  <SummaryRow label="Nama Perusahaan" value={formData.nama_perusahaan} labelWidth="120px" />
                  <SummaryRow label="PIC / WhatsApp" value={formData.no_whatsapp} labelWidth="120px" />
                  <SummaryRow label="Email" value={formData.email} labelWidth="120px" />
                  <SummaryRow label="Alamat" value={formData.alamat_kantor} labelWidth="120px" />
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
            </div>
          </div>

          {/* 2. PAKTA INTEGRITAS & PERNYATAAN */}
          <LegalStatementBox
            checked={formData.setuju_syarat}
            onChange={(val) => setFormData((prev) => ({ ...prev, setuju_syarat: val }))}
            title="Pakta Integritas & Pernyataan Kebenaran Dokumen Sertifikasi"
            badgeText="LSPro BBSPJIKKP"
            keyPoints={[
              "Seluruh data profil badan usaha, lokasi pabrik, dan berkas legalitas adalah sah dan dapat dipertanggungjawabkan.",
              "Bersedia mengikuti seluruh tahapan evaluasi teknis dan audit kesesuaian lapangan oleh Asesor BBKKP.",
            ]}
            legalTitle="Baca Teks Pakta Integritas Lengkap"
            legalFullText={
              "Dengan ini pemohon menyatakan dengan sadar dan sesungguhnya bahwa seluruh data, informasi fasilitas pabrik, dan berkas legalitas yang dilampirkan adalah benar dan sah. Pemohon bersedia mematuhi seluruh ketentuan layanan sertifikasi produk dan sistem manajemen yang ditetapkan oleh Lembaga Sertifikasi Produk (LSPro) BBSPJIKKP, memfasilitasi audit lapangan, serta melunasi biaya evaluasi teknis sesuai ketentuan resmi yang berlaku."
            }
          />
        </div>
      </StepPanel>

      {/* 3. NAVIGATION & SUBMIT BUTTONS (Standar StickyFormActions) */}
      <StickyFormActions
        isSticky={false}
        canGoBack={true}
        backLabel="Sebelumnya"
        onBack={onBack}
        onSaveDraft={() => onSubmit("draft")}
        isLastStep={true}
        submitLabel={submitting ? "Memproses Permohonan..." : "Kirim Pengajuan Sekarang"}
        onSubmit={() => onSubmit("ajukan")}
        isSubmitting={submitting}
        disabled={!formData.setuju_syarat || submitting}
      />
    </div>
  )
}

export default Step4PernyataanKonfirmasi
