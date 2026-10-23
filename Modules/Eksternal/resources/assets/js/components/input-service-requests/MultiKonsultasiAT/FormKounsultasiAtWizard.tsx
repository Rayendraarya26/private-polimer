import React, { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../ui/Button"
import { Modal } from "../../ui/Modal"
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
    RotateCcw,
    AlertTriangle,
} from "lucide-react"
import { Step1JenisLayanan } from "./Step1JenisLayanan"
import { Step2UnggahDokumen } from "./Step2UnggahDokumen"
import { submitKonsultasiAt, getMasterKonsultasiAt, MasterKonsultasiAtItem } from "../../../services/konsultasiAt"
import useProfile from "../../../hooks/useProfile"
import { useKonsultasiAtDraft } from "../../../hooks/useKonsultasiAtDraft"

const STEPS = [
    {
        id: 0,
        title: "Jenis Layanan",
        icon: Cpu,
        desc: "Fokus bidang konsultasi / audit",
    },
    {
        id: 1,
        title: "Unggah Dokumen",
        icon: UploadCloud,
        desc: "Unggah berkas dokumen pendukung",
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
    const [showResetModal, setShowResetModal] = useState<boolean>(false)
    const [masterItems, setMasterItems] = useState<MasterKonsultasiAtItem[]>([])
    const draftClearedRef = useRef(false)

    // State Step 1 (Jenis Layanan)
    const [layananKode, setLayananKode] = useState<string>("")
    const [layananLainnya, setLayananLainnya] = useState<string>("")

    // State Step 2 (Unggah Dokumen)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [catatanDokumen, setCatatanDokumen] = useState<string>("")

    // Ambil master items untuk label ringkasan
    useEffect(() => {
        getMasterKonsultasiAt()
            .then((data) => setMasterItems(data || []))
            .catch(() => {})
    }, [])

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
        setShowResetModal(false)
        toast.success("Draf formulir berhasil dibuang.")
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
                toast.error("Silakan pilih bidang layanan terlebih dahulu")
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

    // Cek apakah ada data yang terisi untuk tombol reset
    const hasFilledData = useMemo(() => {
        return Boolean(layananKode || layananLainnya.trim() || uploadedFiles.length > 0 || catatanDokumen.trim() || currentStep > 0)
    }, [layananKode, layananLainnya, uploadedFiles, catatanDokumen, currentStep])

    // Nama layanan terpilih untuk Step 2
    const selectedLayananName = useMemo(() => {
        if (layananKode === "lainnya") {
            return layananLainnya ? `Lainnya: ${layananLainnya}` : "Lainnya"
        }
        const found = masterItems.find((item) => item.kode === layananKode)
        return found ? found.nama : layananKode
    }, [masterItems, layananKode, layananLainnya])

    return (
        <div className="space-y-4">
            {/* Banner Pemulihan Draf Tersimpan (IndexedDB) */}
            {existingDraft && !draftDismissed && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                            <FileEdit className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900">
                                Draf Permohonan Tersimpan Ditemukan
                            </h4>
                            <p className="text-[11px] text-slate-500">
                                Anda memiliki draf pengisian formulir Konsultasi & Audit Teknologi di peramban ini ({existingDraft.updatedAt ? new Date(existingDraft.updatedAt).toLocaleString("id-ID") : "Sebelumnya"}).
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDiscardDraft}
                            className="rounded-lg text-xs border-slate-300 text-rose-600 hover:bg-white bg-white"
                        >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            Buang Draf
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleRestoreDraft}
                            className="rounded-lg text-xs bg-brand-600 hover:bg-brand-700 text-white"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Lanjutkan Draf
                        </Button>
                    </div>
                </div>
            )}

            {/* Tombol Reset Form (Hanya muncul jika ada isian) */}
            <div className={hasFilledData && (!existingDraft || draftDismissed) ? "flex justify-end -mb-1" : "hidden"}>
                <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors cursor-pointer"
                    title="Reset Seluruh Isian Formulir"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Form</span>
                </button>
            </div>

            {/* Stepper Progress Bar Sesuai Style Guide */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="grid grid-cols-2 gap-2.5">
                    {STEPS.map((s, idx) => {
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
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left transition-colors ${
                                    isActive
                                        ? "bg-slate-50 border border-brand-600"
                                        : isDone
                                        ? "bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer"
                                        : "bg-slate-50/40 border border-slate-200/60 opacity-60 cursor-not-allowed"
                                }`}
                            >
                                <div
                                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                        isDone
                                            ? "bg-emerald-600 text-white"
                                            : isActive
                                            ? "bg-brand-600 text-white"
                                            : "bg-slate-200 text-slate-600"
                                    }`}
                                >
                                    {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 truncate">{s.title}</p>
                                    <p className="text-[11px] text-slate-500 truncate hidden sm:block">{s.desc}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Step Contents */}
            <div>
                <div className={currentStep === 0 ? "block" : "hidden"}>
                    <Step1JenisLayanan
                        layananKode={layananKode}
                        setLayananKode={setLayananKode}
                        layananLainnya={layananLainnya}
                        setLayananLainnya={setLayananLainnya}
                    />
                </div>

                <div className={currentStep === 1 ? "block" : "hidden"}>
                    <Step2UnggahDokumen
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
                        catatanDokumen={catatanDokumen}
                        setCatatanDokumen={setCatatanDokumen}
                        selectedLayananName={selectedLayananName}
                    />
                </div>
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
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleManualSave}
                            disabled={isSubmitting || isSaving}
                            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold border border-slate-200 shadow-2xs hover:bg-slate-100"
                        >
                            <Save className="w-4 h-4 text-slate-600" />
                            <span>{isSaving ? "Menyimpan..." : "Simpan Draf"}</span>
                        </Button>

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

            {/* Modal Konfirmasi Reset Form */}
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
                        Reset Isian Formulir?
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                        Seluruh data pilihan layanan, berkas unggahan, dan catatan yang telah diisi akan dikosongkan kembali ke langkah awal.
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
                            onClick={handleDiscardDraft}
                            className="flex-1 rounded-xl py-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                        >
                            Ya, Reset Form
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default FormKonsultasiAtWizard
