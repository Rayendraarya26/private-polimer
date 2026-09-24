import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "../../ui/Button"
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Factory,
  FileText,
  ListChecks,
  UserCheck,
  ShieldCheck,
  Check,
  RotateCcw,
  Save,
} from "lucide-react"
import api from "../../../utils/api"
import useProfile from "../../../hooks/useProfile"
import FormJenisMiniplant, { miniplantOptions } from "./FormJenisMiniplant"
import { FormDetailPermohonan, DetailPermohonanData } from "./FormDetailPermohonan"
import { FormInformasiPelanggan, PelangganData } from "./FormInformasiPelanggan"
import { FormPerlakuanMiniplant, SelectedPerlakuanItem } from "./FormPerlakuanMiniplant"
import { FormPernyataanMiniplant } from "./FormPernyataanMiniplant"

const TOTAL_STEPS = 5
const STORAGE_KEY = "DRAFT_PERMOHONAN_MINIPLANT"

const DEFAULT_DETAIL: DetailPermohonanData = {
  jasaDiminta: "",
  jenisBarang: "",
  jumlahBarang: "",
  perlakuanDiminta: "",
  tekananNilai: "",
  tekananSatuan: "",
  waktuNilai: "",
  waktuSatuan: "",
  temperaturNilai: "",
  temperaturSatuan: "",
}

const DEFAULT_PELANGGAN: PelangganData = {
  namaPemohon: "",
  no_telp: "",
  alamat: "",
}

const STEPS = [
  { id: 0, title: "Jenis Layanan", icon: Factory, desc: "Pilih jenis layanan" },
  { id: 1, title: "Detail Permohonan", icon: FileText, desc: "Jasa, jenis & kuantiti" },
  { id: 2, title: "Perlakuan Diminta", icon: ListChecks, desc: "Pilihan tarif perlakuan" },
  { id: 3, title: "Informasi Pelanggan", icon: UserCheck, desc: "Data pemohon & kontak" },
  { id: 4, title: "Ringkasan & Kirim", icon: ShieldCheck, desc: "Pernyataan & persetujuan" },
]

export interface FormMiniplantWizardProps {
  initialLayanan?: string
}

export const FormMiniplantWizard: React.FC<FormMiniplantWizardProps> = ({
  initialLayanan = "",
}) => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [setujuPernyataan, setSetujuPernyataan] = useState(false)

  // Inisialisasi state dari localStorage jika ada draf tersimpan
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (
          typeof parsed.currentStep === "number" &&
          parsed.currentStep >= 0 &&
          parsed.currentStep < TOTAL_STEPS
        ) {
          return parsed.currentStep
        }
      }
    } catch (e) {
      console.error("Error loading draft currentStep:", e)
    }
    return 0
  })

  // 0. Jenis Layanan Miniplant
  const [selectedLayanan, setSelectedLayanan] = useState<string>(() => {
    if (initialLayanan) return initialLayanan
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.selectedLayanan === "string") {
          return parsed.selectedLayanan
        }
      }
    } catch (e) {
      console.error("Error loading draft selectedLayanan:", e)
    }
    return ""
  })

  // 1. Data Detail Permohonan
  const [detailPermohonan, setDetailPermohonan] = useState<DetailPermohonanData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.detailPermohonan && typeof parsed.detailPermohonan === "object") {
          return { ...DEFAULT_DETAIL, ...parsed.detailPermohonan }
        }
      }
    } catch (e) {
      console.error("Error loading draft detailPermohonan:", e)
    }
    return DEFAULT_DETAIL
  })

  // 2. Data Perlakuan yang Dipilih
  const [selectedPerlakuan, setSelectedPerlakuan] = useState<
    Record<string, SelectedPerlakuanItem>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.selectedPerlakuan && typeof parsed.selectedPerlakuan === "object") {
          return parsed.selectedPerlakuan
        }
      }
    } catch (e) {
      console.error("Error loading draft selectedPerlakuan:", e)
    }
    return {}
  })

  // 3. Data Informasi Pelanggan
  const [dataPelanggan, setDataPelanggan] = useState<PelangganData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.dataPelanggan && typeof parsed.dataPelanggan === "object") {
          return { ...DEFAULT_PELANGGAN, ...parsed.dataPelanggan }
        }
      }
    } catch (e) {
      console.error("Error loading draft dataPelanggan:", e)
    }
    return DEFAULT_PELANGGAN
  })

  const { profile } = useProfile()

  // Auto-fill profil user login ke dataPelanggan jika masih kosong atau berisi data dummy uji coba
  useEffect(() => {
    if (!profile) return
    const userProfile = (profile as any)?.results || (profile as any)?.data || profile
    const detail = (userProfile?.detail || {}) as Record<string, any>

    const nama =
      detail?.pj_nama ||
      userProfile?.name ||
      userProfile?.nama ||
      detail?.nama ||
      detail?.pimpinan ||
      detail?.pemilik ||
      ""
    const telp =
      detail?.pj_whatsapp ||
      detail?.whatsapp ||
      userProfile?.whatsapp ||
      detail?.telepon ||
      userProfile?.phone ||
      userProfile?.no_hp ||
      detail?.pj_telepon ||
      ""
    const alamat =
      detail?.alamat ||
      userProfile?.alamat ||
      detail?.alamat_perusahaan ||
      userProfile?.address ||
      ""

    setDataPelanggan((prev) => {
      const isDummyName = prev.namaPemohon === "Budi Santoso"
      const isDummyTelp = prev.no_telp === "081234567890"
      const isDummyAlamat = prev.alamat?.includes("Sokonandi")

      return {
        ...prev,
        namaPemohon: (!prev.namaPemohon || isDummyName ? nama : prev.namaPemohon) || nama || "",
        no_telp: (!prev.no_telp || isDummyTelp ? telp : prev.no_telp) || telp || "",
        alamat: (!prev.alamat || isDummyAlamat ? alamat : prev.alamat) || alamat || "",
      }
    })
  }, [profile])

  // Auto-save ke localStorage setiap kali ada perubahan pada form data
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentStep,
          selectedLayanan,
          detailPermohonan,
          selectedPerlakuan,
          dataPelanggan,
        })
      )
    } catch (error) {
      console.error("Gagal menyimpan draf miniplant ke localStorage:", error)
    }
  }, [currentStep, selectedLayanan, detailPermohonan, selectedPerlakuan, dataPelanggan])

  const activeOption = miniplantOptions.find((opt) => opt.value === selectedLayanan)
  const jenisLayananJudul = activeOption?.title || "Jenis Layanan"
  const fasilitasJudul = jenisLayananJudul

  const handleSelectLayanan = (layanan: string) => {
    if (layanan !== selectedLayanan) {
      setSelectedLayanan(layanan)
      // Reset pilihan perlakuan jika berganti jenis layanan miniplant
      setSelectedPerlakuan({})
    }
  }

  // Handler: Hapus Draf dan Reset Formulir
  const handleResetDraft = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus seluruh draf formulir miniplant ini dan mulai dari awal?"
      )
    ) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        console.error("Gagal menghapus draf:", e)
      }
      setSelectedLayanan("")
      setDetailPermohonan(DEFAULT_DETAIL)
      setSelectedPerlakuan({})
      setDataPelanggan(DEFAULT_PELANGGAN)
      setCurrentStep(0)
      setSetujuPernyataan(false)
      toast.success("Draf berhasil dihapus")
    }
  }

  const validateCurrentStep = (): boolean => {
    if (currentStep === 0) {
      if (!selectedLayanan) {
        toast.error("Harap pilih salah satu jenis layanan miniplant terlebih dahulu.")
        return false
      }
    } else if (currentStep === 1) {
      if (!detailPermohonan.jasaDiminta) {
        toast.error("Harap pilih jasa yang diminta (proses atau mesin).")
        return false
      }
      if (!detailPermohonan.jenisBarang?.trim()) {
        toast.error("Jenis barang wajib diisi.")
        return false
      }
      if (!detailPermohonan.jumlahBarang || Number(detailPermohonan.jumlahBarang) < 1) {
        toast.error("Jumlah barang minimal 1.")
        return false
      }
      if (detailPermohonan.jasaDiminta === "proses" && !detailPermohonan.perlakuanDiminta?.trim()) {
        toast.error("Perlakuan yang diminta wajib diisi untuk jenis jasa proses.")
        return false
      }
    } else if (currentStep === 2) {
      const anySelected = Object.values(selectedPerlakuan).some((p) => p.checked)
      if (!anySelected) {
        toast.error("Harap pilih minimal 1 perlakuan yang diinginkan.")
        return false
      }
    } else if (currentStep === 3) {
      if (!dataPelanggan.namaPemohon?.trim()) {
        toast.error("Nama pemohon wajib diisi.")
        return false
      }
      if (!dataPelanggan.no_telp?.trim()) {
        toast.error("Nomor telepon pemohon wajib diisi.")
        return false
      }
      if (!dataPelanggan.alamat?.trim()) {
        toast.error("Alamat pemohon wajib diisi.")
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

  const handleSubmit = async () => {
    if (!setujuPernyataan) {
      toast.error("Harap setujui pernyataan pemohon sebelum mengirim permohonan")
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        jenis_layanan: selectedLayanan,
        fasilitas: selectedLayanan,
        detailPermohonan,
        selectedPerlakuan,
        dataPelanggan,
        setujuPernyataan,
      }

      const res = await api.post("/eksternal/miniplant", payload)
      const resData = res?.data?.data || res?.data

      // Hapus draf di localStorage setelah sukses kirim permohonan
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        console.error("Gagal menghapus draf storage:", e)
      }

      toast.success(res?.data?.message || "Permohonan miniplant berhasil dikirim!")
      if (resData?.id) {
        navigate(`/permohonan/detail/${resData.id}`)
      } else {
        navigate("/permohonan")
      }
    } catch (error: any) {
      console.error("Gagal mengirim permohonan miniplant:", error)
      const validationErrors = error?.response?.data?.errors
      if (validationErrors && typeof validationErrors === "object") {
        const firstKey = Object.keys(validationErrors)[0]
        const firstMsg = Array.isArray(validationErrors[firstKey])
          ? validationErrors[firstKey][0]
          : validationErrors[firstKey]
        toast.error(firstMsg || "Validasi data gagal.")
      } else {
        toast.error(error?.response?.data?.message || "Terjadi kesalahan saat mengirim permohonan")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasDraft =
    Boolean(selectedLayanan) ||
    Boolean(detailPermohonan.jenisBarang) ||
    Boolean(detailPermohonan.jasaDiminta) ||
    Object.keys(selectedPerlakuan).length > 0 ||
    Boolean(dataPelanggan.namaPemohon)

  return (
    <div className="space-y-4">
      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Info Auto-save & Tombol Reset Draf */}
        {/* <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Draf otomatis tersimpan di peramban</span>
          </div>

          {hasDraft && (
            <button
              type="button"
              onClick={handleResetDraft}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Draf
            </button>
          )}
        </div> */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
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

      {/* Step Contents */}
      {/* Step 0: Pilihan Layanan Miniplant */}
      <div className={currentStep === 0 ? "block" : "hidden"}>
        <FormJenisMiniplant
          selectedLayanan={selectedLayanan}
          onSelectLayanan={handleSelectLayanan}
        />
      </div>

      {/* Step 1: Detail Permohonan */}
      <div className={currentStep === 1 ? "block" : "hidden"}>
        <FormDetailPermohonan
          formData={detailPermohonan}
          setFormData={setDetailPermohonan}
          fasilitasJudul={fasilitasJudul}
        />
      </div>

      {/* Step 2: Perlakuan yang Diminta */}
      <div className={currentStep === 2 ? "block" : "hidden"}>
        <FormPerlakuanMiniplant
          selectedLayanan={selectedLayanan}
          selectedPerlakuan={selectedPerlakuan}
          setSelectedPerlakuan={setSelectedPerlakuan}
        />
      </div>

      {/* Step 3: Informasi Pelanggan */}
      <div className={currentStep === 3 ? "block" : "hidden"}>
        <FormInformasiPelanggan
          formData={dataPelanggan}
          setFormData={setDataPelanggan}
        />
      </div>

      {/* Step 4: Ringkasan & Pernyataan */}
      <div className={currentStep === 4 ? "block" : "hidden"}>
        <FormPernyataanMiniplant
          fasilitasJudul={fasilitasJudul}
          dataDetail={detailPermohonan}
          dataPelanggan={dataPelanggan}
          selectedPerlakuan={selectedPerlakuan}
          setujuPernyataan={setujuPernyataan}
          onChangePernyataan={setSetujuPernyataan}
        />
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
          {currentStep === 0 ? "Kembali" : "Sebelumnya"}
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
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                toast.success("Draf permohonan berhasil disimpan")
              }}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 shadow-xs"
            >
              <Save className="w-4 h-4 text-slate-500" />
              Simpan Draf
            </Button>

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
          </div>
        )}
      </div>
    </div>
  )
}

export default FormMiniplantWizard