import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "../../../ui/Button"
import { ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react"
import api from "../../../../utils/api"
import { GrkVerifikasiFormData, INITIAL_DOKUMEN_ITEMS, INITIAL_EMISI_CATEGORIES } from "../../../../types/grk"
import { FormInformasiUmum } from "./FormInformasiUmum"
import { FormInformasiOrganisasi } from "./FormInformasiOrganisasi"
import { FormRuangLingkup } from "./FormRuangLingkup"
import { FormDokumen } from "./FormDokumen"
import { FormInformasiTambahan } from "./FormInformasiTambahan"
import { FormPernyataan } from "./FormPernyataan"


const STORAGE_KEY = "DRAFT_GRK_VERIFIKASI"
const TOTAL_STEPS = 6

const INITIAL_FORM_DATA: GrkVerifikasiFormData = {
    merekSample: "",
    acuan: "",
    keterangan: "",
    uraianKebutuhan: "",

    namaPemilik: "",
    namaPimpinan: "",
    namaPj: "",
    jumlahFasilitas: "",
    kriteriaVerifikasi: "",
    kriteriaLainnyaText: "",
    periodeMulai: "",
    periodeSelesai: "",
    jumlahKaryawan: "",
    deskripsiAktivitas: "",

    organizationBoundary: "",
    reportingBoundary: [],
    jenisInventarisasi: [],
    jenisGasEmisi: [],
    metodologiPengumpulan: "",
    tingkatTransferData: "",
    materialitas: "",
    materialitasCustom: "",
    tingkatJaminan: "",
    emisiCategories: INITIAL_EMISI_CATEGORIES,

    useKonsultan: "",
    konsultanNama: "",
    konsultanInstitusi: "",
    isShareExternal: "",
    pihakEksternal: "",

    dokumenItems: INITIAL_DOKUMEN_ITEMS,

    pernyataanPerubahan: false,
    pernyataanPemohon: false,
}

export const FormGrkVerifikasiWizard: React.FC = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState<GrkVerifikasiFormData>(() => {
        try {
            const savedDraft = localStorage.getItem(STORAGE_KEY)
            if (savedDraft) {
                const parsed = JSON.parse(savedDraft)
                return { ...INITIAL_FORM_DATA, ...parsed }
            }
        } catch (error) {
            console.error("Error loading draft:", error)
        }
        return INITIAL_FORM_DATA
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
            if (!formData.merekSample?.trim()) {
                toast.error("Verifikasi GRK harus diisi", {})
                return
            }

            if (!formData.acuan?.trim()) {
                toast.error("Acuan harus diisi", {})
                return
            }

            if (!formData.keterangan?.trim()) {
                toast.error("Keterangan harus diisi", {})
                return
            }

            if (!formData.uraianKebutuhan?.trim()) {
                toast.error("Uraian Kebutuhan harus diisi", {})
                return
            }
        }

        if (currentStep === 1) {
            if (!formData.namaPemilik?.trim()) {
                toast.error("Nama Pemilik harus diisi", {})
                return
            }

            if (!formData.namaPimpinan?.trim()) {
                toast.error("Nama Pimpinan harus diisi", {})
                return
            }

            if (!formData.namaPj?.trim()) {
                toast.error("Nama Penanggung Jawab harus diisi", {})
                return
            }

            if (!formData.jumlahFasilitas?.trim()) {
                toast.error("Jumlah Fasilitas harus diisi", {})
                return
            }

            if (!formData.kriteriaVerifikasi?.trim()) {
                toast.error("Kriteria Verifikasi harus diisi", {})
                return
            }

            if (formData.kriteriaVerifikasi === "lainnya" && !formData.kriteriaLainnyaText?.trim()) {
                toast.error("Kriteria Verifikasi lainnya harus diisi", {})
                return
            }

            if (!formData.periodeMulai?.trim() || !formData.periodeSelesai?.trim()) {
                toast.error("Periode Pelaporan harus diisi", {})
                return
            }

            if (!formData.jumlahKaryawan?.trim()) {
                toast.error("Jumlah Karyawan harus diisi", {})
                return
            }

            if (!formData.deskripsiAktivitas?.trim()) {
                toast.error("Deskripsi Aktivitas harus diisi", {})
                return
            }
        }

        if (currentStep === 2) {
            if (!formData.organizationBoundary?.trim()) {
                toast.error("Organization Boundary harus diisi", {})
                return
            }

            if (!formData.reportingBoundary?.length) {
                toast.error("Reporting Boundary harus diisi", {})
                return
            }

            if (!formData.jenisInventarisasi?.length) {
                toast.error("Jenis Inventarisasi harus diisi", {})
                return
            }

            if (!formData.jenisGasEmisi?.length) {
                toast.error("Jenis Gas Emisi harus diisi", {})
                return
            }

            if (!formData.metodologiPengumpulan?.trim()) {
                toast.error("Metodologi Pengumpulan harus diisi", {})
                return
            }

            if (!formData.tingkatTransferData?.trim()) {
                toast.error("Tingkat Transfer Data harus diisi", {})
                return
            }

            if (!formData.materialitas?.trim()) {
                toast.error("Materialitas harus diisi", {})
                return
            }

            if (formData.materialitas === "program" && !formData.materialitasCustom?.trim()) {
                toast.error("Materialitas Custom harus diisi", {})
                return
            }

            if (!formData.tingkatJaminan?.trim()) {
                toast.error("Tingkat Jaminan harus diisi", {})
                return
            }

            if (!formData.emisiCategories?.length) {
                toast.error("Emisi Categories harus diisi", {})
                return
            }
        }

        if (currentStep === 3) {
            const docs =
                formData.dokumenItems && formData.dokumenItems.length > 0
                    ? formData.dokumenItems
                    : formData.dokumenItem && formData.dokumenItem.length > 0
                    ? formData.dokumenItem
                    : INITIAL_DOKUMEN_ITEMS

            const emptyDoc = docs.find((item) => !item.keterangan?.trim())
            if (emptyDoc) {
                toast.error(`Dokumen ${emptyDoc.title} harus diisi`, {})
                return
            }
        }

        if (currentStep === 4) {
            if (!formData.useKonsultan) {
                toast.error("Apakah Anda menggunakan konsultan? harus diisi", {})
                return
            }

            if (formData.useKonsultan === "ya") {
                if (!formData.konsultanNama?.trim()) {
                    toast.error("Nama Konsultan harus diisi", {})
                    return
                }

                if (!formData.konsultanInstitusi?.trim()) {
                    toast.error("Institusi Konsultan harus diisi", {})
                    return
                }
            }

            if (!formData.isShareExternal) {
                toast.error("Apakah Anda ingin membagikan data kepada pihak eksternal? harus diisi", {})
                return
            }

            if (formData.isShareExternal === "ya" && !formData.pihakEksternal?.trim()) {
                toast.error("Pihak Eksternal harus diisi", {})
                return
            }
        }

        if (currentStep === 5) {
            if (!formData.pernyataanPerubahan) {
                toast.error("Pernyataan Perubahan harus diisi", {})
                return
            }

            if (!formData.pernyataanPemohon) {
                toast.error("Pernyataan Pemohon harus diisi", {})
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
            toast.error("Harap setujui semua pernyataan sebelum mengirim permohonan.")
            return
        }

        try {
            setIsSubmitting(true)

            // Kirim payload formData ke endpoint API GRK Verifikasi
            const response = await api.post("/eksternal/grk/verifikasi", formData)

            if (response.data?.success) {
                // Hapus draf lokal jika pengajuan sukses
                localStorage.removeItem(STORAGE_KEY)
                toast.success(response.data?.message || "Permohonan verifikasi GRK berhasil diajukan!")
                navigate("/permohonan")
            } else {
                toast.error(response.data?.message || "Gagal mengajukan permohonan verifikasi GRK.")
            }
        } catch (error: any) {
            console.error("Error submitting permohonan GRK:", error)
            const serverMessage = error?.response?.data?.message
            const validationErrors = error?.response?.data?.errors

            if (validationErrors && typeof validationErrors === "object") {
                const firstErrorKey = Object.keys(validationErrors)[0]
                const firstErrorMsg = Array.isArray(validationErrors[firstErrorKey])
                    ? validationErrors[firstErrorKey][0]
                    : validationErrors[firstErrorKey]
                toast.error(firstErrorMsg || "Validasi data gagal.")
            } else {
                toast.error(serverMessage || "Terjadi kesalahan saat mengajukan permohonan.")
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
                <FormDokumen formData={formData} setFormData={setFormData} />
            </div>

            <div className={currentStep === 4 ? "block" : "hidden"}>
                <FormInformasiTambahan formData={formData} setFormData={setFormData} />
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
                )}
            </div>
        </div>
    )
}

export default FormGrkVerifikasiWizard