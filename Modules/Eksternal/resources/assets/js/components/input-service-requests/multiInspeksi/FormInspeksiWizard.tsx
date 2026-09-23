import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "../../ui/Button"
import {
  PackageCheck,
  Target,
  Wallet,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Check,
} from "lucide-react"

import {
  InspeksiFormData,
  initialInspeksiFormData,
} from "../../../types/inspeksi"
import { submitPermohonanInspeksi } from "../../../services/inspeksi"

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
          // Bersihkan sisa nilai mock hardcoded dari draft sebelumnya jika ada
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
        toast.error("Nama instansi penerima hasil inspeksi (contoh: Perum BULOG) wajib diisi")
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
    if (!setujuPernyataan) {
      toast.error("Harap setujui pernyataan pemohon sebelum mengirim permohonan")
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
    <div className="space-y-4">
      {/* Stepper Progress Bar (Sama persis dengan FormKalibrasiWizard) */}
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
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase block ${
                      isActive ? "text-brand-600" : isDone ? "text-emerald-600" : "text-slate-500"
                    }`}
                  >
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

      {/* Step Contents (Kept in DOM with block/hidden to prevent state reset) */}
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

      {/* Navigation Buttons (Sama persis dengan FormKalibrasiWizard) */}
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
            disabled={isSubmitting || !setujuPernyataan}
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

export default FormInspeksiWizard
