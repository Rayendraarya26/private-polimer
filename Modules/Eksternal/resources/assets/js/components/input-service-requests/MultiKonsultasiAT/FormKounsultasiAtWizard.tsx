import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../ui/Button"
import { toast } from "react-hot-toast"
import {
    ArrowLeft,
    ArrowRight,
    Send,
    Loader2,
    Check,
    Save,
    Cpu,
    UploadCloud,
} from "lucide-react"
import { Step1JenisLayanan } from "./Step1JenisLayanan"
import { Step2UnggahDokumen } from "./Step2UnggahDokumen"

const STEPS = [
    {
        id: 0,
        title: "Jenis Layanan",
        icon: Cpu,
        desc: "Fokus konsultasi / audit",
    },
    {
        id: 1,
        title: "Unggah Dokumen",
        icon: UploadCloud,
        desc: "Unggah berkas permohonan",
    },
]

const TOTAL_STEPS = STEPS.length

export const FormKonsultasiAtWizard: React.FC = () => {
    const navigate = useNavigate()

    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // State Step 1 (Jenis Layanan)
    const [selectedLayanan, setSelectedLayanan] = useState<string>("")
    const [subKonsultasi, setSubKonsultasi] = useState<string>("")
    const [subKonsultasiLainnya, setSubKonsultasiLainnya] = useState<string>("")
    const [layananLainnya, setLayananLainnya] = useState<string>("")

    // State Step 2 (Unggah Dokumen)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [catatanDokumen, setCatatanDokumen] = useState<string>("")

    const handleNext = () => {
        if (currentStep === 0) {
            if (!selectedLayanan) {
                toast.error("Silakan pilih jenis layanan terlebih dahulu")
                return
            }
            if (selectedLayanan === "konsultasi") {
                if (!subKonsultasi) {
                    toast.error("Silakan pilih bidang / topik konsultasi")
                    return
                }
                if (subKonsultasi === "konsultasi_lainnya" && !subKonsultasiLainnya.trim()) {
                    toast.error("Silakan sebutkan topik konsultasi yang Anda butuhkan")
                    return
                }
            }
            if (selectedLayanan === "lainnya" && !layananLainnya.trim()) {
                toast.error("Silakan sebutkan jenis layanan yang Anda perlukan")
                return
            }
        }

        if (currentStep < TOTAL_STEPS - 1) {
            setCurrentStep((prev) => prev + 1)
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            })
        }
    }

    const handleBack = () => {
        if (currentStep === 0) {
            navigate("/permohonan")
        } else {
            setCurrentStep((prev) => prev - 1)
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            })
        }
    }

    const handleSubmit = async () => {
        if (uploadedFiles.length === 0) {
            toast.error("Silakan unggah minimal satu berkas permohonan (misal PDF atau ZIP)")
            return
        }

        try {
            setIsSubmitting(true)
            // TODO: Integrasi submit ke endpoint backend dengan FormData
            console.log("Submit permohonan konsultasi & AT:", {
                selectedLayanan,
                subKonsultasi: selectedLayanan === "konsultasi" ? subKonsultasi : null,
                subKonsultasiLainnya: subKonsultasi === "konsultasi_lainnya" ? subKonsultasiLainnya : null,
                layananLainnya: selectedLayanan === "lainnya" ? layananLainnya : null,
                uploadedFiles,
                catatanDokumen,
            })
            toast.success("Permohonan Konsultasi & Audit Teknologi berhasil dikirim!")
        } catch (err: any) {
            toast.error(err?.message || "Terjadi kesalahan saat mengirim permohonan")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-4">
           
            {/* Stepper Progress Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="grid grid-cols-2 gap-3">
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
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
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

            {/* =========================================================
          STEP CONTENT
      ========================================================== */}
            {currentStep === 0 && (
                <Step1JenisLayanan
                    selectedLayanan={selectedLayanan}
                    setSelectedLayanan={setSelectedLayanan}
                    subKonsultasi={subKonsultasi}
                    setSubKonsultasi={setSubKonsultasi}
                    subKonsultasiLainnya={subKonsultasiLainnya}
                    setSubKonsultasiLainnya={setSubKonsultasiLainnya}
                    layananLainnya={layananLainnya}
                    setLayananLainnya={setLayananLainnya}
                />
            )}

            {currentStep === 1 && (
                <Step2UnggahDokumen
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                    catatanDokumen={catatanDokumen}
                    setCatatanDokumen={setCatatanDokumen}
                />
            )}

            {/* =========================================================
          NAVIGATION BUTTONS
      ========================================================== */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                {/* Back */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800 text-slate-700"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {currentStep === 0 ? "Kembali" : "Sebelumnya"}
                </Button>

                {/* Next / Submit */}
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
                    <div className="flex items-center gap-2.5">
                        {/* Save Draft */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                console.log("Simpan draft permohonan konsultasi & AT")
                                toast.success("Draf permohonan berhasil disimpan")
                            }}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 shadow-xs"
                        >
                            <Save className="w-4 h-4 text-slate-500" />
                            Simpan Draf
                        </Button>

                        {/* Submit */}
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
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
                    </div>
                )}
            </div>
        </div>
    )
}

export default FormKonsultasiAtWizard
