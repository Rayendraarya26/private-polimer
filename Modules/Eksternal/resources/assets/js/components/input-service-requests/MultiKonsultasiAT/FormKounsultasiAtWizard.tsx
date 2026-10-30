import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import {
    Check,
    Cpu,
    UploadCloud,
    RotateCcw,
    AlertTriangle,
} from "lucide-react"
import { Button } from "../../ui/Button"
import { Modal } from "../../ui/Modal"
import { StickyFormActions } from "../../forms"
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
    const [maxStepReached, setMaxStepReached] = useState<number>(currentStep)

    useEffect(() => {
        setMaxStepReached((prev) => Math.max(prev, currentStep))
    }, [currentStep])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSavingDraft, setIsSavingDraft] = useState(false)
    const [showResetModal, setShowResetModal] = useState<boolean>(false)
    const draftClearedRef = useRef(false)
    const restoredRef = useRef(false)

    // State Step 1 (Jenis Layanan)
    const [layananKode, setLayananKode] = useState<string>("")
    const [layananLainnya, setLayananLainnya] = useState<string>("")

    // State Step 2 (Unggah Dokumen)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [catatanDokumen, setCatatanDokumen] = useState<string>("")

    const hasDraftContent = Boolean(
        layananKode || layananLainnya || catatanDokumen || uploadedFiles.length > 0
    )

    // Otomatis terapkan draf dari IndexedDB saat pertama kali dimuat
    useEffect(() => {
        if (!existingDraft || restoredRef.current || draftClearedRef.current) return

        restoredRef.current = true
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
    }, [existingDraft])

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

    const confirmResetDraft = async () => {
        draftClearedRef.current = true
        restoredRef.current = true
        await clearDraft()
        setLayananKode("")
        setLayananLainnya("")
        setUploadedFiles([])
        setCatatanDokumen("")
        setCurrentStep(0)
        setMaxStepReached(0)
        setShowResetModal(false)
        toast.success("Draf permohonan berhasil direset.")
    }

    const handleSaveDraftDatabase = async () => {
        if (!layananKode) {
            toast.error("Silakan pilih layanan terlebih dahulu")
            return
        }

        try {
            setIsSavingDraft(true)
            const res = await submitKonsultasiAt({
                layananKode,
                layananLainnya: layananKode === "lainnya" ? layananLainnya.trim() : undefined,
                catatanDokumen: catatanDokumen.trim() || undefined,
                files: uploadedFiles,
                isDraft: true,
            })
            draftClearedRef.current = true
            await clearDraft()
            toast.success(res?.message || "Draft permohonan berhasil disimpan di database.")
            navigate("/permohonan")
        } catch (err: any) {
            const errors = err?.response?.data?.errors
            const firstError = errors ? (Object.values(errors)[0] as string[])?.[0] : null
            toast.error(firstError || err?.response?.data?.message || err?.message || "Terjadi kesalahan saat menyimpan draft")
        } finally {
            setIsSavingDraft(false)
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
        <div className="space-y-5">
            {/* Tombol Reset Draft (Seragam dengan Kalibrasi & Pengujian) */}
            {hasDraftContent && (
                <div className="flex justify-end -mb-2">
                    <button
                        type="button"
                        onClick={() => setShowResetModal(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                        title="Reset seluruh draf formulir"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Draft</span>
                    </button>
                </div>
            )}

            {/* Stepper Progress Bar (Seragam dengan Kalibrasi & Pengujian) */}
            <nav aria-label="Langkah pengisian konsultasi dan audit teknologi" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none">
                <ol className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {STEPS.map((s, idx) => {
                        const Icon = s.icon
                        const isActive = currentStep === idx
                        const isPassed = idx < currentStep
                        const isReachable = idx <= maxStepReached
                        const canNavigate = isReachable && !isActive

                        return (
                            <li key={s.id}>
                                <button
                                    type="button"
                                    id={`stepper-konsultasi-${idx + 1}`}
                                    disabled={!canNavigate}
                                    aria-current={isActive ? "step" : undefined}
                                    onFocus={(e) => e.currentTarget.blur()}
                                    onClick={() => {
                                        if (canNavigate) {
                                            setCurrentStep(idx)
                                            window.scrollTo({ top: 0, behavior: "smooth" })
                                        }
                                    }}
                                    style={{ outline: "none", boxShadow: "none" }}
                                    className={`w-full h-full flex items-center gap-3 p-3 sm:p-3.5 rounded-xl text-left transition-all duration-200 select-none shadow-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 ${
                                        isActive
                                            ? "bg-white border-2 border-brand-600 shadow-none"
                                            : isPassed
                                            ? "bg-emerald-50 border border-emerald-200 hover:border-emerald-300 cursor-pointer shadow-none"
                                            : canNavigate
                                            ? "bg-white border border-slate-200 hover:border-brand-400 cursor-pointer shadow-none"
                                            : "bg-slate-50 border border-slate-200 cursor-not-allowed opacity-60 shadow-none"
                                    }`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 shadow-none ${
                                            isPassed && !isActive
                                                ? "bg-emerald-500 text-white"
                                                : isActive
                                                ? "bg-brand-600 text-white"
                                                : canNavigate
                                                ? "bg-slate-100 text-slate-700"
                                                : "bg-slate-200/80 text-slate-400"
                                        }`}
                                    >
                                        {isPassed && !isActive ? <Check className="w-5 h-5" strokeWidth={2.5} /> : <Icon className="w-5 h-5" />}
                                    </div>

                                    <div className="min-w-0">
                                        <span
                                            className={`block text-[11px] font-semibold ${
                                                isActive
                                                    ? "text-brand-700"
                                                    : isPassed
                                                    ? "text-emerald-700"
                                                    : canNavigate
                                                    ? "text-slate-600"
                                                    : "text-slate-400"
                                            }`}
                                        >
                                            Langkah {idx + 1}
                                        </span>
                                        <p
                                            className={`block text-xs sm:text-sm font-bold truncate ${
                                                isActive || isPassed || canNavigate ? "text-slate-900" : "text-slate-500"
                                            }`}
                                        >
                                            {s.title}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate hidden sm:block" title={s.desc}>
                                            {s.desc}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        )
                    })}
                </ol>
            </nav>

            {/* Step Contents */}
            <div>
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
            </div>

            {/* Navigation Buttons (Menggunakan StickyFormActions standar kalibrasi & pengujian) */}
            <StickyFormActions
                isSticky={false}
                canGoBack={true}
                backLabel={currentStep === 0 ? "Kembali" : "Sebelumnya"}
                onBack={handleBack}
                onNext={handleNext}
                onSaveDraft={currentStep === TOTAL_STEPS - 1 ? handleSaveDraftDatabase : undefined}
                isLastStep={currentStep === TOTAL_STEPS - 1}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isSavingDraft={isSavingDraft}
            />

            {/* Modal Konfirmasi Reset Draf (Seragam dengan Kalibrasi & Pengujian) */}
            <Modal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                size="sm"
                className="max-w-md p-0 overflow-hidden rounded-2xl"
            >
                <div className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200/80 flex items-center justify-center mx-auto mb-4 shadow-xs">
                        <AlertTriangle className="w-7 h-7 text-amber-500" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
                        Reset Draft Formulir?
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                        Seluruh pilihan layanan, dokumen yang diunggah, dan catatan yang telah diisikan akan dihapus dan kembali ke langkah awal.
                    </p>

                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowResetModal(false)}
                            className="flex-1 rounded-xl py-2.5 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-700"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={confirmResetDraft}
                            className="flex-1 rounded-xl py-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                        >
                            Ya, Reset Draft
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default FormKonsultasiAtWizard
