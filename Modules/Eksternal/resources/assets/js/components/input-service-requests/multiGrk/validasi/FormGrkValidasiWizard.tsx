import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "../../../ui/Button"
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Save,
  Loader2,
  UserCog,
  Building,
  ClipboardList,
  FileText,
  Info,
  CheckCircle,
  Check,
} from "lucide-react"
import api from "../../../../utils/api"
import { GrkValidasiFormData, INITIAL_VALIDASI_FORM_DATA, INITIAL_DOKUMEN_ITEMS } from "../../../../types/grk"
import { FormInformasiUmum } from "./FormInformasiUmum"
import { FormInformasiOrganisasi } from "./FormInformasiOrganisasi"
import { FormRuangLingkup } from "./FormRuangLingkup"
import { FormDokumen } from "./FormDokumen"
import { FormInformasiTambahan } from "./FormInformasiTambahan"
import { FormPernyataan } from "./FormPernyataan"

const STORAGE_KEY = "DRAFT_GRK_VALIDASI"
const TOTAL_STEPS = 6

const STEPS = [
  { id: 0, title: "Informasi Umum", icon: UserCog, desc: "Data pemohon & organisasi" },
  { id: 1, title: "Informasi Organisasi", icon: Building, desc: "Detail kontak & alamat" },
  { id: 2, title: "Ruang Lingkup", icon: ClipboardList, desc: "Kriteria & batasan proyek" },
  { id: 3, title: "Dokumen", icon: FileText, desc: "Upload file dokumen" },
  { id: 4, title: "Informasi Tambahan", icon: Info, desc: "Konsultan & pihak eksternal" },
  { id: 5, title: "Pernyataan", icon: CheckCircle, desc: "Persetujuan & pengajuan" },
]

export const FormGrkValidasiWizard: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const editId = searchParams.get("id")
    const [permohonanId, setPermohonanId] = useState<string | null>(editId || null)
    const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(!!editId)
    const [currentStep, setCurrentStep] = useState(0)
    const [maxStepReached, setMaxStepReached] = useState<number>(currentStep)

    useEffect(() => {
        setMaxStepReached((prev) => Math.max(prev, currentStep))
    }, [currentStep])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState<GrkValidasiFormData>(() => {
        try {
            if (!editId) {
                const savedDraft = localStorage.getItem(STORAGE_KEY)
                if (savedDraft) {
                    const parsed = JSON.parse(savedDraft)
                    return { ...INITIAL_VALIDASI_FORM_DATA, ...parsed }
                }
            }
        } catch (error) {
            console.error("Error loading draft:", error)
        }
        return INITIAL_VALIDASI_FORM_DATA
    })

    // Load existing draft/permohonan data jika ada editId
    useEffect(() => {
        if (!editId) return
        const fetchEditData = async () => {
            try {
                setIsLoadingEdit(true)
                const res = await api.get(`/eksternal/grk/validasi/${editId}`)
                const data = res?.data?.data
                const form = data?.detail_permohonan?.formable || data?.detailPermohonan?.formable || data
                if (form) {
                    setFormData((prev) => ({
                        ...prev,
                        merekSample: form.merek_sample || form.merekSample || prev.merekSample,
                        acuan: form.acuan_peraturan || form.acuan || prev.acuan,
                        keterangan: form.ruang_lingkup_diajukan || form.keterangan || prev.keterangan,
                        uraianKebutuhan: form.uraian_kebutuhan || form.uraianKebutuhan || prev.uraianKebutuhan,
                        namaPemilik: form.nama_pemilik || form.namaPemilik || prev.namaPemilik,
                        namaPimpinan: form.nama_pimpinan || form.namaPimpinan || prev.namaPimpinan,
                        namaPj: form.nama_pj || form.namaPj || prev.namaPj,
                        deskripsiAktivitas: form.deskripsi_aktivitas || form.deskripsiAktivitas || prev.deskripsiAktivitas,
                        batasanProyek: form.batasan_proyek || form.batasanProyek || prev.batasanProyek,
                        jenisProyekGrk: Array.isArray(form.jenis_proyek_grk) ? form.jenis_proyek_grk : prev.jenisProyekGrk,
                        periodeMulai: form.periode_mulai || form.periodeMulai || prev.periodeMulai,
                        periodeSelesai: form.periode_selesai || form.periodeSelesai || prev.periodeSelesai,
                        kriteriaVerifikasi: form.kriteria_verifikasi || form.kriteriaVerifikasi || prev.kriteriaVerifikasi,
                        kriteriaLainnyaText: form.kriteria_lainnya || form.kriteriaLainnyaText || prev.kriteriaLainnyaText,
                        jumlahKaryawan: form.jumlah_karyawan || form.jumlahKaryawan || prev.jumlahKaryawan,
                        ssrKuantifikasi: form.ssr_kuantifikasi || form.ssrKuantifikasi || prev.ssrKuantifikasi,
                        jenisGasEmisi: Array.isArray(form.jenis_gas_emisi) ? form.jenis_gas_emisi : prev.jenisGasEmisi,
                        jumlahEmisiProyek: form.jumlah_emisi_proyek_kgco2e || form.jumlahEmisiProyek || prev.jumlahEmisiProyek,
                        jumlahEmisiBaseline: form.jumlah_emisi_baseline_kgco2e || form.jumlahEmisiBaseline || prev.jumlahEmisiBaseline,
                        materialitas: form.materialitas_tipe || form.materialitas || prev.materialitas,
                        materialitasCustom: form.materialitas_custom || form.materialitasCustom || prev.materialitasCustom,
                        useKonsultan: form.use_konsultan ? "ya" : (form.use_konsultan === false ? "tidak" : prev.useKonsultan),
                        konsultanNama: form.konsultan_nama || prev.konsultanNama,
                        konsultanInstitusi: form.konsultan_institusi || prev.konsultanInstitusi,
                        isShareExternal: form.is_share_external ? "ya" : (form.is_share_external === false ? "tidak" : prev.isShareExternal),
                        pihakEksternal: form.pihak_eksternal || prev.pihakEksternal,
                        pernyataanPerubahan: Boolean(form.pernyataan_perubahan),
                        pernyataanPemohon: Boolean(form.pernyataan_pemohon),
                    }))
                }
            } catch (err) {
                console.error("Gagal memuat data draft validasi GRK:", err)
                toast.error("Gagal memuat data draft permohonan.")
            } finally {
                setIsLoadingEdit(false)
            }
        }
        fetchEditData()
    }, [editId])

    useEffect(() => {
        if (!editId) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
            } catch (error) {
                console.error("Error saving draft:", error)
            }
        }
    }, [formData, editId])



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
            const docs = formData.dokumenItems && formData.dokumenItems.length > 0
                ? formData.dokumenItems
                : formData.dokumenItem && formData.dokumenItem.length > 0
                    ? formData.dokumenItem
                    : INITIAL_DOKUMEN_ITEMS
            const emptyDoc = docs.find((item) => !item.keterangan?.trim())
            if (emptyDoc) return toast.error(`Keterangan dokumen ${emptyDoc.title} harus diisi`)
        }

        if (currentStep === 4) {
            if (!formData.useKonsultan) return toast.error("Harap pilih status penggunaan konsultan")
            if (formData.useKonsultan === "ya" && (!formData.konsultanNama?.trim() || !formData.konsultanInstitusi?.trim())) {
                return toast.error("Nama dan Institusi Konsultan harus diisi")
            }
            if (!formData.isShareExternal) return toast.error("Harap pilih status berbagi data eksternal")
            if (formData.isShareExternal === "ya" && !formData.pihakEksternal?.trim()) {
                return toast.error("Pihak Eksternal harus diisi")
            }
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

    const handleSubmit = async (aksi: "draft" | "ajukan" = "ajukan") => {
        const isAjukan = aksi === "ajukan"

        if (isAjukan) {
            if (!formData.pernyataanPerubahan || !formData.pernyataanPemohon) {
                toast.error("Harap setujui semua pernyataan terlebih dahulu.")
                return
            }
        }

        setIsSubmitting(true)
        try {
            const payload = {
                ...formData,
                merekSample: formData.merekSample?.trim() || (aksi === "draft" ? "Draft Validasi GRK" : ""),
                aksi,
                is_draft: !isAjukan,
            }

            const endpoint = permohonanId
                ? `/eksternal/grk/validasi/${permohonanId}`
                : `/eksternal/grk/validasi`

            const response = await api.post(endpoint, payload)

            if (response.data?.success) {
                localStorage.removeItem(STORAGE_KEY)
                toast.success(
                    response.data?.message ||
                        (isAjukan
                            ? "Permohonan validasi GRK berhasil diajukan!"
                            : "Draft permohonan validasi GRK berhasil disimpan!")
                )
                navigate("/permohonan")
            } else {
                toast.error(response.data?.message || "Gagal memproses permohonan validasi GRK.")
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
                toast.error(serverMessage || "Terjadi kesalahan saat memproses permohonan validasi GRK.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoadingEdit) {
        return (
            <div className="w-full h-80 flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                <span className="text-xs font-medium text-slate-500">Memuat data draf validasi GRK...</span>
            </div>
        )
    }

    return (
        <>
            <nav aria-label="Langkah pengisian validasi GRK" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none mb-6">
                <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
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
                                    id={`stepper-grk-validasi-${idx + 1}`}
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

                <div className="flex items-center gap-2 sm:gap-3">
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
                        <>
                            {/* Tombol Simpan Draft hanya muncul pada step terakhir */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleSubmit("draft")}
                                disabled={isSubmitting}
                                className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 text-slate-700 shadow-2xs"
                            >
                                <Save className="w-4 h-4 text-slate-600" />
                                <span>Simpan Draft</span>
                            </Button>

                            <Button
                                type="button"
                                onClick={() => handleSubmit("ajukan")}
                                disabled={isSubmitting || !formData.pernyataanPemohon || !formData.pernyataanPerubahan}
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
                        </>
                    )}
                </div>
                </div>
            </div>
        </>
    )
}

export default FormGrkValidasiWizard