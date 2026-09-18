import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "../../ui/Button"
import { ArrowLeft, ArrowRight, Send, Loader2, Toolbox, UserCheck, MapPinHouse, ShieldCheck, Check } from "lucide-react"
import FormInformasiAlat from "./FormInformasiAlat"
import FormPenanggungBiaya from "./FormPenanggungBiaya"
import FormLaporanHasil from "./FormLaporanHasil"
import FormPernyataan from "./FormPernyataan"

const TOTAL_STEPS = 4

const STEPS = [
  { id: 0, title: "Alat & Kalibrasi", icon: Toolbox, desc: "Data alat, no. seri & kalibrasi" },
  { id: 1, title: "Informasi Pelanggan", icon: UserCheck, desc: "Data pemohon & sertifikat" },
  { id: 2, title: "Laporan Hasil", icon: MapPinHouse, desc: "Bahasa & pengiriman hasil" },
  { id: 3, title: "Pernyataan", icon: ShieldCheck, desc: "Pernyataan pemohon kalibrasi" },
]

export const FormKalibrasiWizard: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [setujuPernyataan, setSetujuPernyataan] = useState(true)

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    if (currentStep === 0) {
      navigate("/permohonan")
    } else {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    if (!setujuPernyataan) {
      toast.error("Harap setujui pernyataan pemohon sebelum mengirim permohonan")
      return
    }

    try {
      setIsSubmitting(true)
      // Simulasi pengiriman permohonan
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Permohonan kalibrasi berhasil dikirim!")
      navigate("/permohonan")
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim permohonan")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            const isActive = currentStep === idx
            const isDone = currentStep > idx

            return (
              <button
                type="button"
                key={s.id}
                onClick={() => {
                  if (idx <= currentStep) {
                    setCurrentStep(idx)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                }}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  isActive
                    ? "bg-brand-50/90 border border-brand-300 ring-2 ring-brand-500/20"
                    : isDone
                    ? "bg-slate-50 border border-slate-200 hover:bg-slate-100/70 cursor-pointer"
                    : "bg-slate-50/50 border border-slate-200/50 opacity-60 cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    isDone
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isActive
                      ? "bg-brand-600 text-white shadow-md shadow-brand-500/30"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] font-bold tracking-wider uppercase block text-slate-500">
                    Langkah {idx + 1}
                  </span>
                  <p className="text-xs font-bold text-slate-800 truncate">{s.title}</p>
                  <p className="text-[11px] text-slate-500 truncate hidden sm:block">{s.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className={currentStep === 0 ? "block" : "hidden"}>
        <FormInformasiAlat />
      </div>

      <div className={currentStep === 1 ? "block" : "hidden"}>
        <FormPenanggungBiaya />
      </div>

      <div className={currentStep === 2 ? "block" : "hidden"}>
        <FormLaporanHasil />
      </div>

      <div className={currentStep === 3 ? "block" : "hidden"}>
        <FormPernyataan
          setujuPernyataan={setujuPernyataan}
          onChangePernyataan={setSetujuPernyataan}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentStep === 0 ? "Batal" : "Sebelumnya"}
        </Button>

        {currentStep < TOTAL_STEPS - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold shadow-sm"
          >
            Selanjutnya
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !setujuPernyataan}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                Kirim Permohonan
                <Send className="w-4 h-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export default FormKalibrasiWizard