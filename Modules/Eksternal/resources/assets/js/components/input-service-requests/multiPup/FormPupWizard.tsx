import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "../../ui/Button"
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
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<PupFormData>(INITIAL_FORM_DATA)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingStep1, setIsLoadingStep1] = useState(true)

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
      // Validasi equipment spesifik jika ada skema tekanan yang dipilih
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

  const handleSubmit = async () => {
    if (!formData.pernyataan_en_score || !formData.pernyataan_proposal) {
      toast.error("Harap setujui seluruh pernyataan resmi pemohon sebelum mengirim pendaftaran!")
      return
    }

    try {
      setIsSubmitting(true)
      const res = await api.post("/eksternal/pup", formData)
      const resData = res?.data?.data || res?.data

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
    <div className="space-y-6">
      {/* Stepper Header Bar */}
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
                  if (idx < currentStep) {
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

      {/* Konten Setiap Step */}
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

      {/* Navigasi Bawah */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="rounded-xl px-5 py-2.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 text-slate-700"
        >
          {currentStep === 0 ? "Kembali ke Katalog" : "Sebelumnya"}
        </Button>

        {currentStep < TOTAL_STEPS - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={currentStep === 0 && isLoadingStep1}
            rightIcon={
              currentStep === 0 && isLoadingStep1 ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )
            }
            className="rounded-xl px-6 py-2.5 text-xs font-semibold shadow-sm"
          >
            {currentStep === 0 && isLoadingStep1 ? "Memuat Profil..." : "Selanjutnya"}
          </Button>
        ) : (
          <Button
            type="button"
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
            className="rounded-xl px-7 py-2.5 text-xs font-semibold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? "Mengirim Pendaftaran..." : "Kirim Formulir Pendaftaran"}
          </Button>
        )}
      </div>
    </div>
  )
}

export default FormPupWizard
