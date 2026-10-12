import React, { useState, useEffect, useRef } from "react"
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
    FileEdit,
    Trash2,
    RefreshCw,
} from "lucide-react"
import { Step1JenisLayanan } from "./Step1JenisLayanan"
import { Step2UnggahDokumen } from "./Step2UnggahDokumen"
import { submitKonsultasiAt } from "../../../services/konsultasiAt"
import useProfile from "../../../hooks/useProfile"
import { useKonsultasiAtDraft } from "../../../hooks/useKonsultasiAtDraft"

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
    const { profile } = useProfile()
    const userId = profile?.id || (profile?.detail as any)?.id || "guest"

    const { existingDraft, autoSave, saveManual, clearDraft, isSaving } = useKonsultasiAtDraft(String(userId))

    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [draftDismissed, setDraftDismissed] = useState(false)
    const draftClearedRef = useRef(false)

    // State Step 1 (Jenis Layanan)
    const [layananKode, setLayananKode] = useState<string>("")
    const [layananLainnya, setLayananLainnya] = useState<string>("")

    // State Step 2 (Unggah Dokumen)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [catatanDokumen, setCatatanDokumen] = useState<string>("")

    // Auto-save form data changes to IndexedDB
    useEffect(() => {
        if (draftClearedRef.current) return
        if (layananKode || layananLainnya || catatanDokumen || uploadedFiles.length > 0) {
            autoSave({
                layananKode,
                layananLainnya,
                catatanDokumen,
                uploadedFiles,
                currentStep,
            })
        }
    }, [layananKode, layananLainnya, uploadedFiles, catatanDokumen, currentStep, autoSave])

    // Re-enable auto-save saat ada perubahan data baru setelah discard
    useEffect(() => {
        if (!draftClearedRef.current) return
        if (layananKode || layananLainnya || catatanDokumen || uploadedFiles.length > 0) {
            draftClearedRef.current = false
        }
    }, [layananKode, layananLainnya, uploadedFiles, catatanDokumen])

    const handleRestoreDraft = () => {
        if (existingDraft) {
            draftClearedRef.current = false
            if (existingDraft.layananKode) setLayananKode(existingDraft.layananKode)
            if (existingDraft.layananLainnya) setLayananLainnya(existingDraft.layananLainnya)
            if (existingDraft.catatanDokumen) setCatatanDokumen(existingDraft.catatanDokumen)
            if (Array.isArray(existingDraft.uploadedFiles) && existingDraft.uploadedFiles.length > 0) {
                const restored = existingDraft.uploadedFiles.map((f: any) => {
                    if (f instanceof File) return f
                    if (f instanceof Blob) return new File([f], (f as any).name || "dokumen.pdf", { type: f.type })
                    return f
                })
                setUploadedFiles(restored)
            }
            if (typeof existingDraft.currentStep === "number") {
                setCurrentStep(existingDraft.currentStep)
            }
            toast.success("Draf permohonan berhasil dipulihkan.")
            setDraftDismissed(true)
        }
    }

    const handleDiscardDraft = async () => {
        draftClearedRef.current = true
        await clearDraft()
        setLayananKode("")
        setLayananLainnya("")
        setUploadedFiles([])
        setCatatanDokumen("")
        setCurrentStep(0)
        setDraftDismissed(true)
        toast.success("Draf permohonan dibuang.")
    }

    const handleManualSave = async () => {
        const success = await saveManual({
            layananKode,
            layananLainnya,
            catatanDokumen,
            uploadedFiles,
            currentStep,
        })
        if (success) {
            toast.success("Draf permohonan berhasil disimpan di peramban ini.")
        } else {
            toast.error("Gagal menyimpan draf.")
        }
    }

    const handleNext = () => {
        if (currentStep === 0) {
            if (!layananKode) {
                toast.error("Silakan pilih layanan terlebih dahulu")
                return
            }
            if (layananKode === "lainnya" && !layananLainnya.trim()) {
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
            const res = await submitKonsultasiAt({
                layananKode,
                layananLainnya: layananKode === "lainnya" ? layananLainnya.trim() : undefined,
                catatanDokumen: catatanDokumen.trim() || undefined,
                files: uploadedFiles,
            })
            draftClearedRef.current = true
            await clearDraft()
            toast.success(res?.message || "Permohonan Konsultasi & Audit Teknologi berhasil dikirim!")
            navigate("/permohonan")
        } catch (err: any) {
            const errors = err?.response?.data?.errors
            const firstError = errors ? (Object.values(errors)[0] as string[])?.[0] : null
            toast.error(firstError || err?.response?.data?.message || err?.message || "Terjadi kesalahan saat mengirim permohonan")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Banner Pemulihan Draf Offline (IndexedDB) */}
            {existingDraft && !draftDismissed && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 via-sky-50 to-indigo-50 border border-brand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <FileEdit className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900">
                                Draf Permohonan Tersimpan Ditemukan
                            </h4>
                            <p className="text-[11px] text-slate-600">
                                Anda memiliki draf pengisian formulir Konsultasi & Audit Teknologi di peramban ini ({existingDraft.updatedAt ? new Date(existingDraft.updatedAt).toLocaleString("id-ID") : "Sebelumnya"}).
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={handleDiscardDraft}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            Buang Draf
                        </button>
                        <button
                            type="button"
                            onClick={handleRestoreDraft}
                            className="px-3.5 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Lanjutkan Draf
                        </button>
                    </div>
                </div>
            )}
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
                    layananKode={layananKode}
                    setLayananKode={setLayananKode}
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
                            onClick={handleManualSave}
                            disabled={isSubmitting || isSaving}
                            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 shadow-xs cursor-pointer"
                        >
                            <Save className="w-4 h-4 text-slate-500" />
                            {isSaving ? "Menyimpan..." : "Simpan Draf"}
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
