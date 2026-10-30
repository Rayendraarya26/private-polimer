import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import {
  PackageCheck,
  Target,
  Wallet,
  ShieldCheck,
  Check,
} from "lucide-react"

import {
  InspeksiFormData,
  initialInspeksiFormData,
} from "../../../types/inspeksi"
import { submitPermohonanInspeksi } from "../../../services/inspeksi"
import { StickyFormActions } from "../../forms"

import Step1SpesifikasiInspeksi from "./Step1SpesifikasiInspeksi"
import Step2PenerimaDanTujuan from "./Step2PenerimaDanTujuan"
import Step3BiayaDanPemohon from "./Step3BiayaDanPemohon"
import Step4PernyataanKonfirmasi from "./Step4PernyataanKonfirmasi"

const TOTAL_STEPS = 4
const STORAGE_KEY = "DRAFT_PERMOHONAN_INSPEKSI"

const STEPS = [
  { id: 0, title: "Spesifikasi & Rencana", icon: PackageCheck, desc: "Data karung & tanggal inspeksi" },
  { id: 1, title: "Tujuan & Penerima", icon: Target, desc: "Bahasa & instansi penerima" },
  { id: 2, title: "Biaya & Pemohon", icon: Wallet, desc: "Penanggung biaya & kontak PIC" },
  { id: 3, title: "Berkas & Pernyataan", icon: ShieldCheck, desc: "Upload surat & persetujuan" },
]

export const FormInspeksiWizard: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [setujuPernyataan, setSetujuPernyataan] = useState(false)

  // Inisialisasi step dari localStorage
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
      console.error("Gagal memuat currentStep draf inspeksi:", e)
    }
    return 0
  })

  const [maxStepReached, setMaxStepReached] = useState<number>(currentStep)

  useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, currentStep))
  }, [currentStep])

  // Inisialisasi form data dari localStorage
  const [formData, setFormData] = useState<InspeksiFormData>(() => {
    const initial = initialInspeksiFormData()
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.formData) {
          const loaded = {
            ...initial,
            ...parsed.formData,
            file_surat_permohonan: null, // File tidak dapat diserialisasi ke localStorage
          }
          if (loaded.dataSpesifikasi?.komoditas === "Karung Plastik Beras Bantuan Pangan") {
            loaded.dataSpesifikasi.komoditas = ""
          }
          if (loaded.dataSpesifikasi?.spesifikasi_dimensi === "Kemasan beras 10kg, dimensi dan gramatur sesuai standar kemasan pangan") {
            loaded.dataSpesifikasi.spesifikasi_dimensi = ""
          }
          if (loaded.dataPermohonan?.tujuan_inspeksi === "Membuktikan mampu produksi kemasan beras bantuan pangan") {
            loaded.dataPermohonan.tujuan_inspeksi = ""
          }
          if (loaded.dataPenerima?.penerima_hasil_nama === "Perum BULOG") {
            loaded.dataPenerima.penerima_hasil_nama = ""
          }
          if (loaded.dataPenerima?.penerima_hasil_alamat === "Jl. Jenderal Gatot Subroto Kav. 49, Jakarta Selatan") {
            loaded.dataPenerima.penerima_hasil_alamat = ""
          }
          return loaded
        }
      }
    } catch (e) {
      console.error("Gagal memuat formData draf inspeksi:", e)
    }
    return initial
  })

  // Sinkronisasi checkbox pernyataan dengan formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      setuju_pernyataan: setujuPernyataan,
    }))
  }, [setujuPernyataan])

  // Simpan draf ke localStorage setiap ada perubahan
  useEffect(() => {
    try {
      const serializableData = {
        currentStep,
        formData: {
          ...formData,
          file_surat_permohonan: null,
        },
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData))
    } catch (error) {
      console.error("Gagal menyimpan draf inspeksi:", error)
    }
  }, [currentStep, formData])

  const validateCurrentStep = (): boolean => {
    if (currentStep === 0) {
      if (!formData.dataSpesifikasi.jenis_inspeksi || formData.dataSpesifikasi.jenis_inspeksi.length === 0) {
        toast.error("Harap pilih minimal 1 jenis inspeksi (Kuantitas / Kualitas)")
        return false
      }
      if (!formData.dataSpesifikasi.komoditas?.trim()) {
        toast.error("Nama komoditas karung plastik wajib diisi")
        return false
      }
      if (!formData.dataSpesifikasi.kapasitas_karung?.trim()) {
        toast.error("Kapasitas karung wajib dipilih")
        return false
      }
      if (!formData.dataPelaksanaan.tgl_rencana_inspeksi) {
        toast.error("Tanggal rencana pelaksanaan inspeksi wajib diisi")
        return false
      }
      if (!formData.dataPelaksanaan.lokasi_inspeksi?.trim()) {
        toast.error("Alamat lokasi gudang/pabrik pelaksanaan inspeksi wajib diisi")
        return false
      }
    } else if (currentStep === 1) {
      if (!formData.dataPermohonan.tujuan_inspeksi?.trim()) {
        toast.error("Tujuan pelaksanaan inspeksi wajib diisi")
        return false
      }
      if (!formData.dataPenerima.penerima_hasil_nama?.trim()) {
        toast.error("Nama instansi penerima hasil inspeksi wajib diisi")
        return false
      }
    } else if (currentStep === 2) {
      if (!formData.dataBiaya.biaya_nama?.trim()) {
        toast.error("Nama perusahaan/entitas penanggung biaya wajib diisi")
        return false
      }
      if (!formData.dataPic.pemohon_pic_nama?.trim()) {
        toast.error("Nama personel PIC pemohon wajib diisi")
        return false
      }
      if (!formData.dataPic.pemohon_pic_kontak?.trim()) {
        toast.error("Nomor WhatsApp/HP kontak PIC wajib diisi")
        return false
      }
    } else if (currentStep === 3) {
      if (!formData.file_surat_permohonan) {
        toast.error("Harap unggah scan surat permohonan resmi")
        return false
      }
      if (!setujuPernyataan) {
        toast.error("Harap setujui pernyataan pemohon sebelum mengirim permohonan")
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return
    }

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

  // Handle Pengiriman Permohonan ke Backend
  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return
    }

    try {
      setIsSubmitting(true)
      const res = await submitPermohonanInspeksi({
        ...formData,
        setuju_pernyataan: setujuPernyataan,
      })

      if (res?.success) {
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch (e) {
          console.error("Gagal menghapus draf storage:", e)
        }

        toast.success(res.message || "Permohonan inspeksi berhasil dikirim!")
        navigate("/dashboard")
      } else {
        toast.error(res?.message || "Gagal mengajukan permohonan inspeksi")
      }
    } catch (err: any) {
      console.error("Error submitting form inspeksi:", err)
      const validationErrors = err?.response?.data?.errors
      if (validationErrors && typeof validationErrors === "object") {
        const firstKey = Object.keys(validationErrors)[0]
        const firstMsg = Array.isArray(validationErrors[firstKey])
          ? validationErrors[firstKey][0]
          : validationErrors[firstKey]
        toast.error(firstMsg || "Validasi data gagal.")
      } else {
        toast.error(err?.response?.data?.message || "Terjadi kesalahan saat memproses permohonan inspeksi")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stepper Progress Bar (Flat border-only, identik dengan FormKalibrasiWizard) */}
      <nav aria-label="Tahapan Permohonan" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none">
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
                  id={`stepper-inspeksi-${idx + 1}`}
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
                  className={`w-full h-full flex items-center gap-3 p-3 sm:p-3.5 rounded-xl text-left transition-all duration-200 select-none shadow-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 ${isActive
                      ? "bg-white border-2 border-brand-600 shadow-none"
                      : isPassed
                        ? "bg-emerald-50 border border-emerald-200 hover:border-emerald-300 cursor-pointer shadow-none"
                        : canNavigate
                          ? "bg-white border border-slate-200 hover:border-brand-400 cursor-pointer shadow-none"
                          : "bg-slate-50 border border-slate-200 cursor-not-allowed opacity-60 shadow-none"
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 shadow-none ${isPassed && !isActive
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
                      className={`block text-[11px] font-semibold ${isActive
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
                      className={`block text-xs sm:text-sm font-bold truncate ${isActive || isPassed || canNavigate ? "text-slate-900" : "text-slate-500"
                        }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate hidden sm:block">{s.desc}</p>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Step Contents */}
      <div>
        <div className={currentStep === 0 ? "block" : "hidden"}>
          <Step1SpesifikasiInspeksi
            formData={formData}
            setFormData={setFormData}
          />
        </div>

        <div className={currentStep === 1 ? "block" : "hidden"}>
          <Step2PenerimaDanTujuan
            formData={formData}
            setFormData={setFormData}
          />
        </div>

        <div className={currentStep === 2 ? "block" : "hidden"}>
          <Step3BiayaDanPemohon
            formData={formData}
            setFormData={setFormData}
          />
        </div>

        <div className={currentStep === 3 ? "block" : "hidden"}>
          <Step4PernyataanKonfirmasi
            formData={formData}
            setFormData={setFormData}
            setujuPernyataan={setujuPernyataan}
            onChangePernyataan={setSetujuPernyataan}
          />
        </div>
      </div>

      {/* Form Navigation Actions (StickyFormActions flat non-sticky, identik Kalibrasi) */}
      <StickyFormActions
        isSticky={false}
        canGoBack={true}
        onBack={handleBack}
        onNext={handleNext}
        isLastStep={currentStep === TOTAL_STEPS - 1}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        backLabel={currentStep === 0 ? "Batal" : "Sebelumnya"}
      />
    </div>
  )
}

export default FormInspeksiWizard
