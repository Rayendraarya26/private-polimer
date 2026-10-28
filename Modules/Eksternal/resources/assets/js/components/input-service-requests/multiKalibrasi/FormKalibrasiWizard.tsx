import React, { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "../../ui/Button"
import { Modal } from "../../ui/Modal"
import {
  Toolbox,
  UserCheck,
  MapPinHouse,
  ShieldCheck,
  Check,
  RotateCcw,
  AlertTriangle,
  Send,
  Save,
} from "lucide-react"
import api from "../../../utils/api"
import FormInformasiAlat, { AlatKalibrasiItem } from "./FormInformasiAlat"
import FormInformasiPelanggan, { PelangganData } from "./FormInformasiPelanggan"
import FormPelaksanaanKalibrasi, { PelaksanaanKalibrasiData } from "./FormPelaksanaanKalibrasi"
import FormPernyataan from "./FormPernyataan"
import { StickyFormActions } from "../../forms"

const TOTAL_STEPS = 4

const STEPS = [
  { id: 0, title: "Alat & Kalibrasi", icon: Toolbox, desc: "Data alat, nomor seri, dan parameter kalibrasi" },
  { id: 1, title: "Pelaksanaan Kalibrasi", icon: UserCheck, desc: "Lokasi in-house/on-site & bahasa sertifikat" },
  { id: 2, title: "Informasi Pelanggan", icon: MapPinHouse, desc: "Data pemohon & alamat pengiriman fisik" },
  { id: 3, title: "Pernyataan & Ringkasan", icon: ShieldCheck, desc: "Persetujuan pemohon & review biaya" },
]

const STORAGE_KEY = "DRAFT_PERMOHONAN_KALIBRASI"

const DEFAULT_PELAKSANAAN: PelaksanaanKalibrasiData = {
  ruangLingkupAkreditasi: "Masuk Ruang Lingkup",
  lokasi: "LABKAL BBKKP",
  uraian: "",
  bahasa: "indonesia",
  namaKirim: "",
  alamatKirim: "",
}

const DEFAULT_PELANGGAN: PelangganData = {
  namaPemohon: "",
  no_telp: "",
  hasilKalibrasiUntuk: "",
  alamatPemohon: "",
  namaKirim: "",
  alamatKirim: "",
  opsiAlamatKirim: "pemohon",
}

export const FormKalibrasiWizard: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [setujuPernyataan, setSetujuPernyataan] = useState(false)
  const [formKey, setFormKey] = useState<number>(0)
  const [showResetModal, setShowResetModal] = useState<boolean>(false)
  const [stepErrors, setStepErrors] = useState<string[]>([])

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

  // Langkah terjauh yang pernah berhasil dicapai untuk navigasi bebas
  const [maxStepReached, setMaxStepReached] = useState<number>(currentStep)

  useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, currentStep))
  }, [currentStep])

  const [dataAlat, setDataAlat] = useState<AlatKalibrasiItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed.dataAlat) && parsed.dataAlat.length > 0) {
          return parsed.dataAlat
        }
      }
    } catch (e) {
      console.error("Error loading draft dataAlat:", e)
    }
    return []
  })

  const [dataPelaksanaan, setDataPelaksanaan] = useState<PelaksanaanKalibrasiData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.dataPelaksanaan) {
          return { ...DEFAULT_PELAKSANAAN, ...parsed.dataPelaksanaan }
        }
      }
    } catch (e) {
      console.error("Error loading draft dataPelaksanaan:", e)
    }
    return DEFAULT_PELAKSANAAN
  })

  const [dataPelanggan, setDataPelanggan] = useState<PelangganData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.dataPelanggan) {
          return { ...DEFAULT_PELANGGAN, ...parsed.dataPelanggan }
        }
      }
    } catch (e) {
      console.error("Error loading draft dataPelanggan:", e)
    }
    return DEFAULT_PELANGGAN
  })

  // Helper untuk mengecek apakah form sedang terisi data draf oleh user
  const checkIsFormFilled = (
    step: number,
    alat: AlatKalibrasiItem[],
    pelaksanaan: PelaksanaanKalibrasiData,
    pernyataan: boolean
  ): boolean => {
    if (step > 0) return true
    if (pernyataan) return true

    if (
      Boolean(pelaksanaan.lokasi && pelaksanaan.lokasi !== "LABKAL BBKKP") ||
      Boolean(pelaksanaan.uraian?.trim()) ||
      pelaksanaan.bahasa !== "indonesia"
    ) {
      return true
    }

    if (alat.length > 1) return true

    return alat.some(
      (a) =>
        Boolean(a.namaAlat?.trim()) ||
        Boolean(a.merk?.trim()) ||
        Boolean(a.tipeModel?.trim()) ||
        (Array.isArray(a.nomorSeriList) && a.nomorSeriList.some((s) => Boolean(s?.trim()))) ||
        (Array.isArray(a.kalibrasiList) && a.kalibrasiList.length > 0)
    )
  }

  const [hasDraft, setHasDraft] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (
          (typeof parsed.currentStep === "number" && parsed.currentStep > 0) ||
          (Array.isArray(parsed.dataAlat) && parsed.dataAlat.length > 1) ||
          (Array.isArray(parsed.dataAlat) &&
            parsed.dataAlat.some(
              (a: any) =>
                Boolean(a.namaAlat?.trim()) ||
                (Array.isArray(a.kalibrasiList) && a.kalibrasiList.length > 0)
            )) ||
          Boolean(parsed.dataPelaksanaan?.uraian?.trim())
        ) {
          return true
        }
      }
    } catch (e) {
      console.error("Error reading draft status:", e)
    }
    return false
  })

  useEffect(() => {
    if (!hasDraft) {
      const isFilled = checkIsFormFilled(currentStep, dataAlat, dataPelaksanaan, setujuPernyataan)
      if (isFilled) {
        setHasDraft(true)
      }
    }
  }, [hasDraft, currentStep, dataAlat, dataPelaksanaan, setujuPernyataan])

  // Autosave to localStorage
  useEffect(() => {
    try {
      if (hasDraft) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            currentStep,
            dataAlat,
            dataPelaksanaan,
            dataPelanggan,
          })
        )
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error("Gagal menyimpan draf kalibrasi ke localStorage:", error)
    }
  }, [hasDraft, currentStep, dataAlat, dataPelaksanaan, dataPelanggan])

  // Handler: Hapus Draf dan Reset Formulir
  const confirmResetDraft = () => {
    setShowResetModal(false)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error("Gagal menghapus draf:", e)
    }
    setDataAlat([])
    setDataPelaksanaan({ ...DEFAULT_PELAKSANAAN })
    setDataPelanggan({ ...DEFAULT_PELANGGAN })
    setCurrentStep(0)
    setMaxStepReached(0)
    setSetujuPernyataan(false)
    setHasDraft(false)
    setStepErrors([])
    setFormKey((prev) => prev + 1)
    toast.success("Draf formulir berhasil direset.")
  }

  const validateCurrentStep = (): boolean => {
    const errors: string[] = []

    if (currentStep === 0) {
      if (!dataAlat || dataAlat.length === 0) {
        errors.push("Harap tambahkan minimal 1 instrumen / alat untuk dikalibrasi.")
      } else {
        for (let i = 0; i < dataAlat.length; i++) {
          const alat = dataAlat[i]
          if (!alat.namaAlat?.trim()) {
            errors.push(`Nama alat #${i + 1} wajib diisi.`)
          }
          if (!alat.kalibrasiList || alat.kalibrasiList.length === 0) {
            errors.push(`Pilih minimal 1 jenis kalibrasi untuk ${alat.namaAlat || `Alat #${i + 1}`}.`)
          }
        }
      }
    } else if (currentStep === 1) {
      if (!dataPelaksanaan.lokasi) {
        errors.push("Harap tentukan lokasi pelaksanaan kalibrasi (Laboratorium / On-site).")
      }
      if (!dataPelaksanaan.bahasa) {
        errors.push("Harap pilih bahasa sertifikat kalibrasi.")
      }
    } else if (currentStep === 2) {
      if (!dataPelanggan.namaPemohon?.trim()) {
        errors.push("Nama pemohon wajib diisi.")
      }
      if (!dataPelanggan.hasilKalibrasiUntuk?.trim()) {
        errors.push("Nama pemilik sertifikat (hasil kalibrasi untuk) wajib diisi.")
      }
      if (!dataPelanggan.no_telp?.trim()) {
        errors.push("Nomor telepon pemohon wajib diisi.")
      }
      if (!dataPelanggan.alamatPemohon?.trim()) {
        errors.push("Alamat pemohon wajib diisi.")
      }
      if (!dataPelanggan.namaKirim?.trim()) {
        errors.push("Nama pada pengalamatan laporan kalibrasi wajib diisi.")
      }
      if (!dataPelanggan.alamatKirim?.trim()) {
        errors.push("Alamat pada pengalamatan laporan kalibrasi wajib diisi.")
      }
    } else if (currentStep === 3) {
      if (!setujuPernyataan) {
        errors.push("Harap centang persetujuan pernyataan pemohon sebelum mengirim.")
      }
    }

    setStepErrors(errors)

    if (errors.length > 0) {
      toast.error(errors[0])
      return false
    }

    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1)
      setStepErrors([])
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setStepErrors([])
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async (aksi: "draft" | "ajukan" = "ajukan") => {
    const isAjukan = aksi === "ajukan"

    if (isAjukan) {
      if (!validateCurrentStep()) return
      if (!setujuPernyataan) {
        toast.error("Harap setujui pernyataan pemohon sebelum mengirim permohonan")
        return
      }
    } else {
      if ((!dataAlat || dataAlat.length === 0) && !dataPelanggan.namaPemohon?.trim()) {
        toast.error("Harap isi setidaknya nama pemohon atau data 1 alat untuk disimpan sebagai draft.")
        return
      }
    }

    try {
      if (isAjukan) {
        setIsSubmitting(true)
      } else {
        setIsSavingDraft(true)
      }

      const finalAlamatKirim = dataPelanggan.alamatKirim?.trim() || dataPelanggan.alamatPemohon || ""
      const finalNamaKirim = dataPelanggan.namaKirim?.trim() || dataPelanggan.namaPemohon || ""

      const payload = {
        aksi,
        dataAlat:
          dataAlat.length > 0
            ? dataAlat
            : [
                {
                  id: "draft-alat-1",
                  namaAlat: "Alat Kalibrasi (Draft)",
                  merk: "",
                  tipeModel: "",
                  jumlah: 1,
                  nomorSeriList: [],
                  kondisi: "Baik / Normal",
                  kalibrasiList: [],
                },
              ],
        dataPelaksanaan: {
          ...dataPelaksanaan,
          namaKirim: finalNamaKirim,
          alamatKirim: finalAlamatKirim,
        },
        dataPelanggan: {
          ...dataPelanggan,
          namaPemohon: dataPelanggan.namaPemohon || "Draft Pemohon",
          hasilKalibrasiUntuk:
            dataPelanggan.hasilKalibrasiUntuk || dataPelanggan.namaPemohon || "Draft",
          alamatPemohon: dataPelanggan.alamatPemohon || "-",
          namaKirim: finalNamaKirim,
          alamatKirim: finalAlamatKirim,
        },
        setujuPernyataan: isAjukan ? true : Boolean(setujuPernyataan),
      }

      const res = await api.post("/eksternal/kalibrasi", payload)
      const resData = res?.data?.data || res?.data

      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        console.error("Gagal membersihkan draft storage:", e)
      }
      setHasDraft(false)

      toast.success(
        res?.data?.message ||
          (isAjukan
            ? "Permohonan kalibrasi berhasil diajukan ke Balai Besar!"
            : "Draft permohonan kalibrasi berhasil disimpan di server.")
      )

      if (resData?.id) {
        navigate(`/permohonan/detail/${resData.id}`)
      } else {
        navigate("/permohonan")
      }
    } catch (error: any) {
      console.error("Gagal memproses permohonan kalibrasi:", error)
      const validationErrors = error?.response?.data?.errors
      if (validationErrors && typeof validationErrors === "object") {
        const firstKey = Object.keys(validationErrors)[0]
        const firstMsg = Array.isArray(validationErrors[firstKey])
          ? validationErrors[firstKey][0]
          : validationErrors[firstKey]
        toast.error(firstMsg || "Validasi data gagal.")
      } else {
        toast.error(error?.response?.data?.message || "Terjadi kesalahan saat memproses permohonan")
      }
    } finally {
      setIsSubmitting(false)
      setIsSavingDraft(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Tombol Reset Draft */}
      {hasDraft && (
        <div className="flex justify-end -mb-2">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
            title="Reset seluruh draf formulir"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Draft</span>
          </button>
        </div>
      )}

      {/* Stepper Progress Bar */}
      <nav aria-label="Langkah pengisian kalibrasi" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none">
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
                  id={`stepper-kalibrasi-${idx + 1}`}
                  disabled={!canNavigate}
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => {
                    if (canNavigate) {
                      setCurrentStep(idx)
                      setStepErrors([])
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  }}
                  className={`w-full h-full flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border text-left transition-all duration-200 outline-none focus:outline-none ring-0 shadow-none ${
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
                    <p className="text-xs text-slate-500 truncate hidden sm:block">{s.desc}</p>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Step Contents */}
      <div key={`step-contents-${formKey}`}>
        <div className={currentStep === 0 ? "block" : "hidden"}>
          <FormInformasiAlat
            dataAlat={dataAlat}
            onChangeDataAlat={setDataAlat}
          />
        </div>

        <div className={currentStep === 1 ? "block" : "hidden"}>
          <FormPelaksanaanKalibrasi
            dataPelaksanaan={dataPelaksanaan}
            onChangePelaksanaan={setDataPelaksanaan}
          />
        </div>

        <div className={currentStep === 2 ? "block" : "hidden"}>
          <FormInformasiPelanggan
            dataPelanggan={dataPelanggan}
            onChangePelanggan={setDataPelanggan}
          />
        </div>

        <div className={currentStep === 3 ? "block" : "hidden"}>
          <FormPernyataan
            dataAlat={dataAlat}
            dataPelaksanaan={dataPelaksanaan}
            dataPelanggan={dataPelanggan}
            setujuPernyataan={setujuPernyataan}
            onChangePernyataan={setSetujuPernyataan}
          />
        </div>
      </div>

      {/* Form Navigation Actions (Non-sticky, sesuai form pengujian) */}
      <StickyFormActions
        isSticky={false}
        canGoBack={currentStep > 0}
        onBack={handleBack}
        onNext={handleNext}
        onSaveDraft={currentStep === TOTAL_STEPS - 1 ? () => handleSubmit("draft") : undefined}
        isLastStep={currentStep === TOTAL_STEPS - 1}
        onSubmit={() => handleSubmit("ajukan")}
        isSubmitting={isSubmitting}
        isSavingDraft={isSavingDraft}
        errorCount={stepErrors.length}
        onErrorClick={() => window.scrollTo({ top: 120, behavior: "smooth" })}
      />

      {/* Modal Konfirmasi Reset Draf */}
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
            Seluruh data instrumen, parameter kalibrasi, dan alamat yang telah diisikan akan dihapus dan kembali ke langkah awal.
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

export default FormKalibrasiWizard