import React, { useState } from "react"
import { SertifikasiFormData } from "../../../types/sertifikasi"
import { FormWizardActions } from "../../forms"
import {
  ShieldCheck,
  Building2,
  Factory,
  FileCheck,
  Package,
} from "lucide-react"
import {
  StepPanel,
  SectionHeading,
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
        icon={ShieldCheck}
        title="Ringkasan Permohonan & Pernyataan Integritas"
        description="Periksa kembali seluruh data pengajuan, komoditi, dan berkas persyaratan sebelum menyetujui pernyataan resmi."
      >
        <div className="space-y-7">
          {/* 1. Ringkasan Profil Pemohon & Lokasi Pabrik (2 Kolom Standar Form Layanan) */}
          <div>
            <SectionHeading
              title="Ringkasan Data Pemohon & Fasilitas Pabrik"
              description="Informasi badan usaha dan lokasi fasilitas produksi yang didaftarkan."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Kolom Kiri: Profil Badan Usaha */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2 mb-3.5">
                  <Building2 className="w-4 h-4 text-brand-600" />
                  Identitas Badan Usaha
                </h4>

                <div className="space-y-2 text-xs sm:text-[13px]">
                  <div className="grid grid-cols-[170px_10px_1fr] items-start py-0.5">
                    <span className="text-slate-500 font-medium">Nama Perusahaan</span>
                    <span className="text-slate-400">:</span>
                    <span className="font-bold text-slate-900">
                      {formData.nama_perusahaan?.trim() || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-[170px_10px_1fr] items-start py-0.5">
                    <span className="text-slate-500 font-medium">Kontak WhatsApp / HP</span>
                    <span className="text-slate-400">:</span>
                    <span className="font-medium text-slate-800 font-mono">
                      {formData.no_whatsapp?.trim() || formData.no_telp?.trim() || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-[170px_10px_1fr] items-start py-0.5">
                    <span className="text-slate-500 font-medium">Email Perusahaan</span>
                    <span className="text-slate-400">:</span>
                    <span className="text-slate-700">
                      {formData.email?.trim() || "-"}
                    </span>
                  </div>

                  <div className="grid grid-cols-[170px_10px_1fr] items-start py-0.5">
                    <span className="text-slate-500 font-medium">Alamat Domisili Kantor</span>
                    <span className="text-slate-400">:</span>
                    <span className="text-slate-700 leading-relaxed">
                      {formData.alamat_kantor?.trim() || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Fasilitas Pabrik */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2 mb-3.5">
                  <Factory className="w-4 h-4 text-emerald-600" />
                  Fasilitas Lokasi Pabrik ({formData.pabrik.length} Lokasi)
                </h4>

                <div className="space-y-2.5 text-xs sm:text-[13px]">
                  {formData.pabrik.length === 0 ? (
                    <span className="text-slate-400 italic">Belum ada lokasi pabrik yang ditambahkan</span>
                  ) : (
                    formData.pabrik.map((f, fIdx) => (
                      <div key={fIdx} className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 space-y-1">
                        <p className="font-bold text-slate-900">
                          {fIdx + 1}. {f.nama_pabrik || "Pabrik Utama"}
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {f.alamat_pabrik || "-"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Daftar Pengajuan & Komoditi (Clean Flat List) */}
          <div className="pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <SectionHeading
                title="Daftar Pengajuan Sertifikasi & Komoditi"
                description="Rincian ruang lingkup SNI/ISO, komoditas produk, serta berkas persyaratan yang dilampirkan."
              />
              <span className="px-2.5 py-1 bg-brand-50 text-brand-700 font-bold text-xs rounded-full border border-brand-200 shrink-0">
                Total {formData.pengajuan.length} Pengajuan
              </span>
            </div>

            <div className="space-y-4">
              {formData.pengajuan.map((p, idx) => {
                const skema = skemaList.find((s) => String(s.id) === String(p.skema_id))
                const uploadedFromList = (p.dokumen_list || []).filter(
                  (d: any) => Boolean(d.file || d.fileName || d.fileUrl)
                )

                const legacyDocs: { label: string; file: any }[] = []
                if (p.dok_legalitas) legacyDocs.push({ label: "Legalitas", file: p.dok_legalitas })
                if (p.dok_manual_mutu) legacyDocs.push({ label: "Manual Mutu", file: p.dok_manual_mutu })
                if (p.dok_diagram_alir) legacyDocs.push({ label: "Diagram Alir", file: p.dok_diagram_alir })
                if (p.dok_lainnya) legacyDocs.push({ label: "Dokumen Lain", file: p.dok_lainnya })

                const allUploaded = [...uploadedFromList, ...legacyDocs]

                return (
                  <div
                    key={p.id || idx}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4"
                  >
                    {/* Header Pengajuan */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
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

                    {/* Daftar Komoditi Produk */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-brand-600" />
                        Daftar Komoditi ({p.items.length} Item)
                      </span>

                      {p.items.length === 0 ? (
                        <p className="text-slate-400 italic">Belum ada komoditi yang didaftarkan</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {p.items.map((item, itemIdx) => (
                            <div
                              key={item.id || itemIdx}
                              className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1"
                            >
                              <p className="font-bold text-slate-800">{item.nama_produk || "-"}</p>
                              <div className="text-[11px] text-slate-500 space-y-0.5">
                                <p>Merk: <span className="font-medium text-slate-700">{item.merk_dagang || "-"}</span></p>
                                <p>Standar SNI/ISO: <span className="font-medium text-slate-700">{item.standar_sni_iso || "-"}</span></p>
                                {item.kapasitas_produksi && (
                                  <p>Kapasitas: <span className="font-medium text-slate-700">{item.kapasitas_produksi} {item.satuan_produksi || ""}</span></p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Berkas Terlampir */}
                    <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Berkas Persyaratan Terlampir ({allUploaded.length} Berkas)
                        </span>
                      </div>

                      {allUploaded.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                          {uploadedFromList.map((doc: any, dIdx: number) => {
                            const fileName = doc.fileName || doc.file?.name
                            return (
                              <div
                                key={doc.id || dIdx}
                                className="flex items-center gap-2.5 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 min-w-0"
                              >
                                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-slate-800 text-xs truncate" title={doc.nama}>
                                    {doc.nama}
                                  </p>
                                  {fileName && (
                                    <p className="text-[11px] text-slate-500 truncate" title={fileName}>
                                      {fileName}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          })}

                          {legacyDocs.map((leg, lIdx) => (
                            <div
                              key={`leg-${lIdx}`}
                              className="flex items-center gap-2.5 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 min-w-0"
                            >
                              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="font-bold text-slate-800 text-xs truncate">{leg.label}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic block text-[11px]">Belum ada berkas yang diunggah</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 3. Pernyataan & Pakta Integritas (Standar Form Permohonan Kalibrasi & Pengujian) */}
          <div className="pt-6 border-t border-slate-200">
            <label
              htmlFor="checkbox-setuju-pernyataan"
              className="flex items-start gap-3 cursor-pointer select-none"
            >
              <input
                id="checkbox-setuju-pernyataan"
                type="checkbox"
                checked={formData.setuju_syarat}
                onChange={(e) => setFormData((prev) => ({ ...prev, setuju_syarat: e.target.checked }))}
                className="mt-0.5 w-4.5 h-4.5 rounded border-slate-300 text-brand-600 focus:ring-0 shrink-0 cursor-pointer"
              />
              <div className="text-xs sm:text-[13px] leading-relaxed text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">
                  PAKTA INTEGRITAS & PERNYATAAN PEMOHON SERTIFIKASI<span className="text-rose-500">*</span>
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 mb-2">
                  <li>
                    Seluruh data profil badan usaha, lokasi fasilitas pabrik, dan berkas legalitas yang dilampirkan adalah benar, sah, dan dapat dipertanggungjawabkan secara hukum.
                  </li>
                  <li>
                    Bersedia mematuhi seluruh tahapan evaluasi teknis, audit kecukupan berkas, dan audit kesesuaian lapangan yang dilaksanakan oleh Asesor Lembaga Sertifikasi Produk (LSPro) BBSPJIKKP.
                  </li>
                  <li>
                    Bersedia melunasi seluruh kewajiban biaya evaluasi teknis dan PNBP sesuai ketentuan tarif resmi yang berlaku.
                  </li>
                </ul>
                <span className="text-slate-800 font-medium">
                  Saya telah membaca, memahami, dan menyetujui seluruh klausul pakta integritas dan ketentuan permohonan sertifikasi di atas.
                </span>
              </div>
            </label>
          </div>
        </div>
      </StepPanel>

      {/* 4. Navigation & Submit Buttons (Standar FormWizardActions) */}
      <FormWizardActions
        isSticky={false}
        canGoBack={true}
        backLabel="Sebelumnya"
        onBack={onBack}
        onSaveDraft={() => onSubmit("draft")}
        isLastStep={true}
        onSubmit={() => onSubmit("ajukan")}
        isSubmitting={submitting}
        disabled={!formData.setuju_syarat || submitting}
      />
    </div>
  )
}

export default Step4PernyataanKonfirmasi
