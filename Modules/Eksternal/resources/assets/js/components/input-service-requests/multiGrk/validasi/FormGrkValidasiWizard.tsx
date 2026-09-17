import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "../../../ui/Button"
import { ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react"
import api from "../../../../utils/api"
import { GrkValidasiFormData, INITIAL_VALIDASI_FORM_DATA } from "../../../../types/grk"
import { FormInformasiUmum } from "./FormInformasiUmum"
import { FormInformasiOrganisasi } from "./FormInformasiOrganisasi"
import { FormRuangLingkup } from "./FormRuangLingkup"
import { FormDokumen } from "./FormDokumen"
import { FormInformasiTambahan } from "./FormInformasiTambahan"
import { FormPernyataan } from "./FormPernyataan"


const STORAGE_KEY = "DRAFT_GRK_VALIDASI"
const TOTAL_STEPS = 6

export const FormGrkValidasiWizard: React.FC = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState<GrkValidasiFormData>(() => {
        try {
            const savedDraft = localStorage.getItem(STORAGE_KEY)
            if (savedDraft) {
                const parsed = JSON.parse(savedDraft)
                return { ...INITIAL_VALIDASI_FORM_DATA, ...parsed }
            }
        } catch (error) {
            console.error("Error loading draft:", error)
        }
        return INITIAL_VALIDASI_FORM_DATA
    })


    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
        } catch (error) {
            console.error("Error saving draft:", error)
        }
    }, [formData])



    // Validasi langkah
    const handleNext = () => {
        if (currentStep === 0) {
            if (!formData.merekSample?.trim()) return toast.error("Verifikasi/Merek GRK harus diisi")
            if (!formData.acuan?.trim()) return toast.error("Acuan harus diisi")
            if (!formData.keterangan?.trim()) return toast.error("Ruang Lingkup harus diisi")
            if (!formData.uraianKebutuhan?.trim()) return toast.error("Uraian Kebutuhan harus diisi")
        }

        if (currentStep === 1) {
            if (!formData.namaPemilik?.trim()) return toast.error("Nama Pemilik harus diisi")
            if (!formData.namaPimpinan?.trim()) return toast.error("Nama Pimpinan harus diisi")
            if (!formData.namaPj?.trim()) return toast.error("Nama Penanggung Jawab harus diisi")
            if (!formData.deskripsiAktivitas?.trim()) return toast.error("Deskripsi Aktivitas harus diisi")
        }

        if (currentStep === 2) {
            if (!formData.batasanProyek?.trim()) return toast.error("Batasan Proyek harus diisi")
            if (!formData.jenisProyekGrk?.length) return toast.error("Pilih minimal satu Jenis Proyek GRK")
            if (!formData.periodeMulai?.trim() || !formData.periodeSelesai?.trim()) return toast.error("Periode Waktu harus diisi")
            if (!formData.kriteriaVerifikasi?.trim()) return toast.error("Kriteria Verifikasi harus diisi")
            if (!formData.jumlahKaryawan?.trim()) return toast.error("Jumlah Karyawan harus diisi")
            if (!formData.ssrKuantifikasi?.trim()) return toast.error("SSR GRK yang dikuantifikasi harus diisi")
            if (!formData.jenisGasEmisi?.length) return toast.error("Pilih minimal satu Jenis Gas Emisi")
            if (!formData.jumlahEmisiProyek?.trim()) return toast.error("Jumlah Emisi/Serapan Proyek harus diisi")
            if (!formData.jumlahEmisiBaseline?.trim()) return toast.error("Jumlah Emisi/Serapan Baseline harus diisi")
        }

        if (currentStep === 3) {
            if (!formData.useKonsultan) return toast.error("Harap pilih status penggunaan konsultan")
            if (formData.useKonsultan === "ya" && (!formData.konsultanNama?.trim() || !formData.konsultanInstitusi?.trim())) {
                return toast.error("Nama dan Institusi Konsultan harus diisi")
            }
            if (!formData.isShareExternal) return toast.error("Harap pilih status berbagi data eksternal")
            if (formData.isShareExternal === "ya" && !formData.pihakEksternal?.trim()) {
                return toast.error("Pihak Eksternal harus diisi")
            }
        }

        if (currentStep === 4) {
            const docs = formData.dokumenItems || []
            const emptyDoc = docs.find((item) => !item.keterangan?.trim())
            if (emptyDoc) return toast.error(`Keterangan dokumen ${emptyDoc.title} harus diisi`)
        }

        if (currentStep === 5) {
            if (!formData.pernyataanPerubahan) {
                toast.error("Pernyataan Perubahan harus disetujui")
                return
            }

            if (!formData.pernyataanPemohon) {
                toast.error("Pernyataan Pemohon harus disetujui")
                return
            }
        }

        setCurrentStep((prev) => prev + 1)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1)
            window.scrollTo({ top: 0, behavior: "smooth" })
        } else {
            navigate("/permohonan/grk")
        }
    }

    const handleSubmit = async () => {
        if (!formData.pernyataanPerubahan || !formData.pernyataanPemohon) {
            toast.error("Harap setujui semua pernyataan terlebih dahulu.")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await api.post("/eksternal/grk/validasi", formData)

            if (response.data?.success) {
                localStorage.removeItem(STORAGE_KEY)
                toast.success(response.data?.message || "Permohonan validasi GRK berhasil diajukan!")
                navigate("/permohonan")
            } else {
                toast.error(response.data?.message || "Gagal mengajukan permohonan validasi GRK.")
            }
        } catch (error: any) {
            console.error("Error submitting permohonan validasi GRK:", error)
            const serverMessage = error?.response?.data?.message
            const validationErrors = error?.response?.data?.errors

            if (validationErrors && typeof validationErrors === "object") {
                const firstErrorKey = Object.keys(validationErrors)[0]
                const firstErrorMsg = Array.isArray(validationErrors[firstErrorKey])
                    ? validationErrors[firstErrorKey][0]
                    : validationErrors[firstErrorKey]
                toast.error(firstErrorMsg || "Validasi data gagal.")
            } else {
                toast.error(serverMessage || "Terjadi kesalahan saat mengajukan permohonan validasi GRK.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className={currentStep === 0 ? "block" : "hidden"}>
                <FormInformasiUmum formData={formData} setFormData={setFormData} />
            </div>

            <div className={currentStep === 1 ? "block" : "hidden"}>
                <FormInformasiOrganisasi formData={formData} setFormData={setFormData} />
            </div>

            <div className={currentStep === 2 ? "block" : "hidden"}>
                <FormRuangLingkup formData={formData} setFormData={setFormData} />
            </div>

            <div className={currentStep === 3 ? "block" : "hidden"}>
                <FormInformasiTambahan formData={formData} setFormData={setFormData} />
            </div>

            <div className={currentStep === 4 ? "block" : "hidden"}>
                <FormDokumen formData={formData} setFormData={setFormData} />
            </div>

            <div className={currentStep === 5 ? "block" : "hidden"}>
                <FormPernyataan formData={formData} setFormData={setFormData} />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {currentStep === 0 ? "Batal" : "Sebelumnya"}
                </Button>

                {currentStep < TOTAL_STEPS - 1 ? (
                    <Button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-2"
                    >
                        Selanjutnya
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
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

export default FormGrkValidasiWizard