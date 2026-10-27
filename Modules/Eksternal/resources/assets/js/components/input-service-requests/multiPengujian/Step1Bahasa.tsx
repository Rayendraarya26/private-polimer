import React from "react"
import { Languages, ShieldCheck, Check } from "lucide-react"
import { BahasaLaporan, PengujianSharedData } from "../../../types/pengujian"
import { WizardNav } from "./components/WizardUI"

// Komponen Bendera Indonesia (Merah Putih)
const IndonesiaFlag: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 60 40"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Bendera Indonesia"
  >
    <rect width="60" height="20" fill="#E11D48" />
    <rect y="20" width="60" height="20" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
  </svg>
)

// Komponen Bendera Inggris / Britania Raya (Union Jack)
const UKFlag: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg
    viewBox="0 0 60 40"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Bendera Inggris"
  >
    <rect width="60" height="40" fill="#012169" />
    <path d="M0 0 L60 40 M60 0 L0 40" stroke="#FFFFFF" strokeWidth="8" />
    <path d="M0 0 L30 20 M60 40 L30 20" stroke="#C8102E" strokeWidth="2.6" />
    <path d="M60 0 L30 20 M0 40 L30 20" stroke="#C8102E" strokeWidth="2.6" />
    <path d="M30 0 v40 M0 20 h60" stroke="#FFFFFF" strokeWidth="12" />
    <path d="M30 0 v40 M0 20 h60" stroke="#C8102E" strokeWidth="7" />
  </svg>
)

interface Step1BahasaProps {
  sharedData: PengujianSharedData
  setSharedData: React.Dispatch<React.SetStateAction<PengujianSharedData>>
  onNext: () => void
}

const BAHASA_OPTIONS: {
  value: BahasaLaporan
  label: string
  subLabel: string
  code: string
  description: string
  icon: React.ElementType
}[] = [
  {
    value: "id",
    label: "Bahasa Indonesia",
    subLabel: "Indonesian",
    code: "ID",
    description:
      "Laporan diterbitkan dalam Bahasa Indonesia. Cocok untuk keperluan dalam negeri, instansi pemerintah, dan sertifikasi SNI.",
    icon: IndonesiaFlag,
  },
  {
    value: "en",
    label: "Bahasa Inggris",
    subLabel: "English",
    code: "EN",
    description:
      "Laporan diterbitkan dalam Bahasa Inggris. Cocok untuk keperluan ekspor, mitra luar negeri, dan standar internasional.",
    icon: UKFlag,
  },
]

export const Step1Bahasa: React.FC<Step1BahasaProps> = ({
  sharedData,
  setSharedData,
  onNext,
}) => {
  const handleSelectBahasa = (lang: BahasaLaporan) => {
    setSharedData((prev) => ({
      ...prev,
      bahasa_laporan: lang,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Outer Card / Panel: Menggunakan border saja tanpa shadow sesuai gambar */}
      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-none">
        {/* Header dengan Border Bottom */}
        <div className="px-6 sm:px-7 py-5 border-b border-slate-200">
          <h3 className="text-base sm:text-[17px] font-bold text-slate-900 flex items-center gap-2.5">
            <Languages className="w-5 h-5 text-brand-600 shrink-0" />
            <span>Pilih Bahasa Laporan Hasil Pengujian</span>
          </h3>
          <p className="text-xs sm:text-[13px] text-slate-500 mt-1 leading-relaxed">
            Tentukan bahasa resmi yang akan digunakan pada dokumen Laporan Hasil Pengujian yang diterbitkan.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7">
          {/* Pilihan Card: Border saja tanpa shadow */}
          <div
            role="radiogroup"
            aria-label="Pilih Bahasa Laporan Hasil Pengujian"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {BAHASA_OPTIONS.map((opt) => {
              const isSelected = sharedData.bahasa_laporan === opt.value
              const Flag = opt.icon

              return (
                <div
                  key={opt.value}
                  id={`opsi-bahasa-${opt.value}`}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => handleSelectBahasa(opt.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleSelectBahasa(opt.value)
                    }
                  }}
                  style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
                  className={`group relative rounded-lg p-4 cursor-pointer select-none transition-all duration-150 shadow-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 ${
                    isSelected
                      ? "border-2 border-brand-600 bg-white"
                      : "border border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {/* Baris Atas: Bendera, Judul + Badge, dan Indikator Check Bulat */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Kotak Bendera */}
                      <div
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 bg-white ${
                          isSelected ? "border-brand-500" : "border-slate-200"
                        }`}
                      >
                        <div className="w-6 h-[16px] overflow-hidden flex items-center justify-center shadow-none">
                          <Flag className="w-full h-full object-cover" />
                        </div>
                      </div>

                      {/* Judul & Subtitle */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-bold text-slate-900 leading-snug">
                            {opt.label}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded leading-none">
                            {opt.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{opt.subLabel}</p>
                      </div>
                    </div>

                    {/* Indikator Checkmark Bulat di Kanan Atas */}
                    <div className="shrink-0 mt-0.5">
                      {isSelected ? (
                        <span className="w-[18px] h-[18px] rounded-full border border-brand-600 flex items-center justify-center text-brand-600 bg-white">
                          <Check className="w-3 h-3" strokeWidth={2.5} />
                        </span>
                      ) : (
                        <span className="w-[18px] h-[18px] rounded-full border border-slate-300 block bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Deskripsi di Bawah */}
                  <p className="text-xs leading-relaxed text-slate-500 mt-2.5">
                    {opt.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Catatan di Bawah */}
          <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs sm:text-[13px] text-slate-600 shadow-none">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
            <span>
              Bahasa yang dipilih berlaku untuk seluruh sampel dalam permintaan ini dan tidak dapat diubah setelah laporan diterbitkan.
            </span>
          </div>
        </div>
      </section>

      {/* Navigasi Selanjutnya */}
      <WizardNav onNext={onNext} />
    </div>
  )
}

export default Step1Bahasa
