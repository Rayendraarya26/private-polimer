import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "../../ui/Button"
import { Modal } from "../../ui/Modal"
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Check,
  Building2,
  Layers,
  Wrench,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
} from "lucide-react"
import { PupFormData } from "../../../types/pup"
import api from "../../../utils/api"
import Step1IdentitasLab from "./Step1IdentitasLab"
import Step2PilihanSkema from "./Step2PilihanSkema"
import Step3KonfirmasiEquipment from "./Step3KonfirmasiEquipment"
import Step4PernyataanKonfirmasi from "./Step4PernyataanKonfirmasi"

const TOTAL_STEPS = 4

const STEPS = [
  { id: 0, title: "Identitas & Lab", icon: Building2, desc: "Profil lab & narahubung" },
  { id: 1, title: "Pilihan Skema", icon: Layers, desc: "28 skema & metode acuan" },
  { id: 2, title: "Konfirmasi Alat", icon: Wrench, desc: "Kesiapan equipment LK" },
  { id: 3, title: "Biaya & Pernyataan", icon: ShieldCheck, desc: "Rincian biaya & komitmen" },
]

const STORAGE_KEY = "DRAFT_PERMOHONAN_PUP"

const INITIAL_FORM_DATA: PupFormData = {
  nama_pengisi: "",
  email_pemohon: "",
  nama_narahubung: "",
  no_wa_narahubung: "",
  nama_lab_kalibrasi: "",
  alamat_lab_kalibrasi: "",
  kota_kabupaten_lab: "",
  email_official_lab: "",
  nama_personil_pengesah: "",
  jabatan_personil_pengesah: "",
  periode_pendaftaran: "EARLY_BIRD",
  skema_items: [],
  konfirmasi_equipment: {},
  pernyataan_en_score: false,
  pernyataan_proposal: false,
}

export const FormPupWizard: React.FC = () => {
  const navigate = useNavigate()
  const [formKey, setFormKey] = useState<number>(0)
  const [showResetModal, setShowResetModal] = useState<boolean>(false)

  // Inisialisasi state dari localStorage jika ada draf tersimpan
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.currentStep === "number" && parsed.currentStep >= 0 && parsed.currentStep < TOTAL_STEPS) {
          return parsed.currentStep
        }
      }
    } catch (e) {
      console.error("Error loading draft currentStep:", e)
    }
    return 0
  })

  const [maxStepReached, setMaxStepReached] = useState<number>(currentStep)

  useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, currentStep))
  }, [currentStep])

  const [formData, setFormData] = useState<PupFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.formData) {
          return { ...INITIAL_FORM_DATA, ...parsed.formData }
        }
      }
    } catch (e) {
      console.error("Error loading draft formData:", e)
    }
    return INITIAL_FORM_DATA
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingStep1, setIsLoadingStep1] = useState(true)

  // Auto-save ke localStorage saat ada perubahan data
  useEffect(() => {
    try {
      const draftData = {
        currentStep,
        formData,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData))
    } catch (e) {
      console.error("Gagal menyimpan draf PUP:", e)
    }
  }, [currentStep, formData])

  const hasDraft = Boolean(
    currentStep > 0 ||
    formData.nama_pengisi ||
    formData.nama_lab_kalibrasi ||
    formData.skema_items.length > 0
  )

  const handleFieldChange = (field: keyof PupFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Validasi per step sebelum melangkah ke step berikutnya
  const validateCurrentStep = (): boolean => {
    if (currentStep === 0) {
      if (
        !formData.nama_pengisi.trim() ||
        !formData.email_pemohon.trim() ||
        !formData.nama_narahubung.trim() ||
        !formData.no_wa_narahubung.trim() ||
        !formData.nama_lab_kalibrasi.trim() ||
        !formData.alamat_lab_kalibrasi.trim() ||
        !formData.kota_kabupaten_lab.trim() ||
        !formData.email_official_lab.trim() ||
        !formData.nama_personil_pengesah.trim() ||
        !formData.jabatan_personil_pengesah.trim()
      ) {
        toast.error("Mohon lengkapi seluruh field wajib pada data identitas dan laboratorium!")
        return false
      }
    }

    if (currentStep === 1) {
      if (formData.skema_items.length === 0) {
        toast.error("Harap pilih minimal 1 skema uji profisiensi kalibrasi!")
        return false
      }
      const emptyMetode = formData.skema_items.some(
        (it) => !it.metode_kalibrasi_acuan || !it.metode_kalibrasi_acuan.trim()
      )
      if (emptyMetode) {
        toast.error("Mohon isi standar/metode kalibrasi acuan untuk setiap skema yang dipilih!")
        return false
      }
    }

    if (currentStep === 2) {
      const hasPressure = formData.skema_items.some((it) =>
        ["UP-PRESSURE-PNEUMATIK", "UP-PRESSURE-HIDROLIK"].includes(it.kode_skema)
      )
      if (hasPressure && !formData.konfirmasi_equipment.pressure_gauge?.pernyataan_media) {
        toast.error("Harap centang persetujuan keharusan media tekanan sesuai jenis artefak!")
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return

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

  const handleResetDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error("Gagal menghapus draf:", e)
    }
    setFormData(INITIAL_FORM_DATA)
    setCurrentStep(0)
    setMaxStepReached(0)
    setFormKey((k) => k + 1)
    setShowResetModal(false)
    toast.success("Draf formulir berhasil direset")
  }

  const handleSubmit = async () => {
    if (!formData.pernyataan_en_score || !formData.pernyataan_proposal) {
      toast.error("Harap setujui seluruh pernyataan resmi pemohon sebelum mengirim pendaftaran!")
      return
    }

    try {
      setIsSubmitting(true)
      const res = await api.post("/eksternal/pup", formData)
      const resData = res?.data?.data || res?.data

      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        console.error("Gagal menghapus draf storage:", e)
      }

      toast.success(res?.data?.message || "Pendaftaran Uji Profisiensi berhasil dikirim!")
      if (resData?.id) {
        navigate(`/permohonan/detail/${resData.id}`)
      } else {
        navigate("/permohonan")
      }
    } catch (err: any) {
      console.error("Gagal mengirim permohonan PUP:", err)
      toast.error(
        err?.response?.data?.message || "Terjadi kesalahan saat mengirim formulir pendaftaran."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Tombol Reset Draft */}
      <div className={hasDraft ? "flex justify-end -mb-1" : "hidden"}>
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors cursor-pointer"
          title="Reset Seluruh Draf Formulir"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Draft</span>
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <nav aria-label="Langkah pengisian uji profisiensi" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none">
        <ol className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
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
                  id={`stepper-pup-${idx + 1}`}
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

      {/* Konten Setiap Step */}
      <div key={`step-contents-${formKey}`}>
        <div className={currentStep === 0 ? "block" : "hidden"}>
          <Step1IdentitasLab
            formData={formData}
            onChange={handleFieldChange}
            onLoadingChange={setIsLoadingStep1}
          />
        </div>

        <div className={currentStep === 1 ? "block" : "hidden"}>
          <Step2PilihanSkema formData={formData} onChange={handleFieldChange} />
        </div>

        <div className={currentStep === 2 ? "block" : "hidden"}>
          <Step3KonfirmasiEquipment formData={formData} onChange={handleFieldChange} />
        </div>

        <div className={currentStep === 3 ? "block" : "hidden"}>
          <Step4PernyataanKonfirmasi formData={formData} onChange={handleFieldChange} />
        </div>
      </div>

      {/* Navigasi Bawah */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="px-5 py-2.5 font-semibold text-xs border-slate-300 hover:bg-slate-50 text-slate-700"
        >
          {currentStep === 0 ? "Kembali ke Permohonan" : "Sebelumnya"}
        </Button>

        <div className="flex items-center gap-2">
          {currentStep < TOTAL_STEPS - 1 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              disabled={currentStep === 0 && isLoadingStep1}
              rightIcon={
                currentStep === 0 && isLoadingStep1 ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )
              }
              className="px-6 py-2.5 font-semibold text-xs shadow-xs"
            >
              {currentStep === 0 && isLoadingStep1 ? "Memuat Profil..." : "Langkah Berikutnya"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !formData.pernyataan_en_score ||
                !formData.pernyataan_proposal
              }
              leftIcon={
                isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )
              }
              className="px-7 py-2.5 font-semibold text-xs shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? "Mengirim Pendaftaran..." : "Kirim Permohonan"}
            </Button>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Reset Draft */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Konfirmasi Reset Draft"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold">Apakah Anda yakin ingin mereset seluruh formulir?</p>
              <p className="mt-1 text-rose-700">
                Semua data pendaftaran uji profisiensi yang telah diisi akan dihapus dan formulir akan kembali kosong.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowResetModal(false)}
              className="px-4 py-2 text-xs"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleResetDraft}
              className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              Ya, Reset Formulir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default FormPupWizard
