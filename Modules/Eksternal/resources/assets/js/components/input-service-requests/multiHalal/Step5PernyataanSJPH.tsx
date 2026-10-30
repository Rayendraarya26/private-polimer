import React from "react"
import { FormHalalPayload } from "../../../types/halal"
import { LegalStatementBox } from "../../forms"
import {
  StepPanel,
  SectionHeading,
} from "../common"
import {
  Upload,
  CheckCircle,
  ShieldCheck,
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
    <StepPanel
      icon={ShieldCheck}
      title="Dokumen Kelengkapan, Ikrar & Komitmen"
      description="Unggah berkas persyaratan resmi, verifikasi ringkasan data pengajuan, serta setujui ikrar komitmen Sistem Jaminan Produk Halal."
    >
      {/* 1. Unggah Dokumen Kelengkapan */}
      <div>
        <SectionHeading
          title="Dokumen Kelengkapan Sertifikasi Halal"
          required={isReguler}
          description={
            isReguler
              ? "Unggah Surat Permohonan resmi dan Manual Sistem Jaminan Produk Halal (SJPH)."
              : "Dokumen komitmen dan surat pernyataan mandiri pelaku usaha."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Surat Permohonan */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3.5 shadow-none">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Surat Permohonan Sertifikasi Halal {isReguler && <span className="text-rose-500">*</span>}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Surat resmi permohonan bertandatangan pimpinan / materai (PDF maks 5MB).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-none">
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
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 truncate">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="truncate max-w-[200px] font-medium">
                    {payload.file_surat_permohonan.name}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">Belum ada file dipilih</span>
              )}
            </div>
          </div>

          {/* Manual SJPH */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3.5 shadow-none">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Manual Sistem Jaminan Produk Halal (SJPH) {isReguler && <span className="text-rose-500">*</span>}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dokumen manual penerapan komitmen halal & PPH perusahaan (PDF maks 10MB).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-none">
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
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 truncate">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="truncate max-w-[200px] font-medium">
                    {payload.file_manual_sjph.name}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">Belum ada file dipilih</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ringkasan Pengajuan (Review Box) */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Ringkasan Formulir Permohonan"
          description="Periksa kembali data pengajuan sebelum mengirimkan formulir."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 shadow-none">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Jalur Sertifikasi:</span>
            <span className="text-xs font-bold text-brand-700 uppercase">
              {payload.dataPengajuan.jalur_pendaftaran === "reguler"
                ? "Reguler (Audit LPH BBSPJIKKP)"
                : "Self Declare (SEHATI UMK)"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 shadow-none">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Pelaku Usaha:</span>
            <span className="text-xs font-bold text-slate-900 truncate block">
              {pu.nama_usaha || "-"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 shadow-none">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Penyelia Halal:</span>
            <span className="text-xs font-bold text-slate-900 truncate block">
              {p.penyelia_nama || "-"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 shadow-none">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">Total Bahan & Produk:</span>
            <span className="text-xs font-bold text-slate-900">
              {payload.dataBahan.length} Bahan Terdaftar • {payload.dataProduk.length} Varian Produk
            </span>
          </div>
        </div>
      </div>

      {/* 3. Pernyataan Komitmen & Integritas Halal */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Pernyataan Komitmen & Integritas Halal"
          required
          description="Komitmen kepatuhan terhadap regulasi Jaminan Produk Halal (UU No. 33 Tahun 2014)."
        />

        <div className="space-y-4">
          {/* 1. Ikrar Bebas Babi */}
          <LegalStatementBox
            checked={payload.pernyataan_bebas_babi}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                pernyataan_bebas_babi: val,
              }))
            }
            title="Ikrar Bebas Najis & Bahan Diharamkan (Bebas Babi)"
            badgeText="Wajib Syariah"
            keyPoints={[
              "Seluruh fasilitas produksi, peralatan, dan bahan 100% bebas dari babi beserta seluruh turunannya.",
              "Tidak terkontaminasi bangkai, darah mengalir, minuman beralkohol/khamr, maupun unsur najis lainnya.",
            ]}
            legalTitle="Baca Klausul Ikrar Bebas Najis Lengkap"
            legalFullText="Dengan ini menyatakan dengan sadar dan sesungguhnya bahwa seluruh fasilitas pengolahan, peralatan produksi, bahan baku utama, bahan penolong/tambahan, serta produk akhir yang didaftarkan bebas dari babi beserta seluruh turunannya, bangkai, darah, minuman keras/khamr, dan unsur najis lainnya sesuai syariat Islam dan peraturan perundang-undangan Jaminan Produk Halal (UU No. 33 Tahun 2014 jo. UU No. 6 Tahun 2023)."
          />

          {/* 2. Komitmen SJPH */}
          <LegalStatementBox
            checked={payload.pernyataan_komitmen_sjph}
            onChange={(val) =>
              onChange((prev) => ({
                ...prev,
                pernyataan_komitmen_sjph: val,
              }))
            }
            title="Komitmen Penerapan Sistem Jaminan Produk Halal (SJPH)"
            badgeText="Kepatuhan Regulasi"
            keyPoints={[
              "Berkomitmen konsisten menerapkan prinsip SJPH pada seluruh siklus produksi.",
              "Bersedia menerima pemeriksaan/audit berkala maupun sewaktu-waktu oleh LPH BBSPJIKKP dan BPJPH.",
            ]}
            legalTitle="Baca Klausul Komitmen SJPH Lengkap"
            legalFullText="Pelaku usaha berkomitmen untuk senantiasa menerapkan dan menjaga kesinambungan Sistem Jaminan Produk Halal (SJPH), menggunakan bahan halal yang telah disetujui, mencatat setiap mutasi bahan, serta bersedia menerima pemeriksaan/audit berkala maupun inspeksi mendadak oleh Auditor Halal LPH BBSPJIKKP dan BPJPH Kementerian Agama Republik Indonesia."
          />
        </div>
      </div>
    </StepPanel>
  )
}
