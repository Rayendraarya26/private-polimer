import React, { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import { Button } from "../../ui/Button"
import { ArrowLeft, ArrowRight, Send, Loader2, Toolbox, UserCheck, MapPinHouse, ShieldCheck, Check, RotateCcw, Save } from "lucide-react"
import api from "../../../utils/api"
import FormInformasiAlat, { AlatKalibrasiItem } from "./FormInformasiAlat"
import FormInformasiPelanggan, { PelangganData } from "./FormInformasiPelanggan"
import FormPelaksanaanKalibrasi, { PelaksanaanKalibrasiData } from "./FormPelaksanaanKalibrasi"
import FormPernyataan from "./FormPernyataan"

const TOTAL_STEPS = 4

const STEPS = [
  { id: 0, title: "Alat & Kalibrasi", icon: Toolbox, desc: "Data alat, no. seri & kalibrasi" },
  { id: 1, title: "Pelaksanaan Kalibrasi", icon: UserCheck, desc: "Bahasa & pengiriman hasil" },
  { id: 2, title: "Informasi Pelanggan", icon: MapPinHouse, desc: "Data pemohon & sertifikat" },
  { id: 3, title: "Pernyataan", icon: ShieldCheck, desc: "Pernyataan pemohon kalibrasi" },
]

const STORAGE_KEY = "DRAFT_PERMOHONAN_KALIBRASI"

const DEFAULT_PELAKSANAAN: PelaksanaanKalibrasiData = {
  ruangLingkupAkreditasi: "",
  lokasi: "",
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
}

export const FormKalibrasiWizard: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [setujuPernyataan, setSetujuPernyataan] = useState(false)
  const [formKey, setFormKey] = useState<number>(0)

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
      Boolean(pelaksanaan.ruangLingkupAkreditasi) ||
      Boolean(pelaksanaan.lokasi) ||
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
        Boolean(a.kondisi?.trim()) ||
        (Array.isArray(a.nomorSeriList) && a.nomorSeriList.some((s) => Boolean(s?.trim()))) ||
        (Array.isArray(a.kalibrasiList) && a.kalibrasiList.length > 0)
    )
  }

  // Status draf: true jika ada draf tersimpan di storage atau user mulai mengisi form
  // Dibuat sebagai state stabil agar tidak hilang-muncul (glitch/flicker) saat pengguna sedang mengetik
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
                Boolean(a.merk?.trim()) ||
                Boolean(a.tipeModel?.trim()) ||
                Boolean(a.kondisi?.trim()) ||
                (Array.isArray(a.nomorSeriList) && a.nomorSeriList.some((s: any) => Boolean(s?.trim()))) ||
                (Array.isArray(a.kalibrasiList) && a.kalibrasiList.length > 0)
            )) ||
          Boolean(parsed.dataPelaksanaan?.ruangLingkupAkreditasi) ||
          Boolean(parsed.dataPelaksanaan?.lokasi) ||
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

  // Aktifkan hasDraft saat data mulai diisi oleh user
  useEffect(() => {
    if (!hasDraft) {
      const isFilled = checkIsFormFilled(currentStep, dataAlat, dataPelaksanaan, setujuPernyataan)
      if (isFilled) {
        setHasDraft(true)
      }
    }
  }, [hasDraft, currentStep, dataAlat, dataPelaksanaan, setujuPernyataan])

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
  const handleResetDraft = async () => {
    const result = await Swal.fire({
      title: "Reset Draft Formulir?",
      text: "Seluruh data alat, pelaksanaan, dan informasi pemohon yang telah diisi akan dihapus dan kembali ke langkah awal.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Reset Draft",
      cancelButtonText: "Batal",
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error("Gagal menghapus draf:", e)
    }
    setDataAlat([])
    setDataPelaksanaan({ ...DEFAULT_PELAKSANAAN })
    setDataPelanggan({ ...DEFAULT_PELANGGAN })
    setCurrentStep(0)
    setSetujuPernyataan(false)
    setHasDraft(false)
    setFormKey((prev) => prev + 1)
    toast.success("Draf formulir berhasil direset.")
  }

  const validateCurrentStep = (): boolean => {
    if (currentStep === 0) {
      if (!dataAlat || dataAlat.length === 0) {
        toast.error("Harap tambahkan minimal 1 alat untuk dikalibrasi.")
        return false
      }
      for (let i = 0; i < dataAlat.length; i++) {
        const alat = dataAlat[i]
        if (!alat.namaAlat?.trim()) {
          toast.error(`Nama alat #${i + 1} wajib diisi.`)
          return false
        }
        if (!alat.kalibrasiList || alat.kalibrasiList.length === 0) {
          toast.error(`Harap pilih minimal 1 jenis pengujian kalibrasi untuk ${alat.namaAlat || `Alat #${i + 1}`}.`)
          return false
        }
      }
    } else if (currentStep === 1) {
      if (!dataPelaksanaan.ruangLingkupAkreditasi) {
        toast.error("Harap pilih status ruang lingkup akreditasi.")
        return false
      }
      if (!dataPelaksanaan.lokasi) {
        toast.error("Harap pilih lokasi pelaksanaan kalibrasi.")
        return false
      }
      if (!dataPelaksanaan.bahasa) {
        toast.error("Harap pilih bahasa sertifikat kalibrasi.")
        return false
      }
    } else if (currentStep === 2) {
      if (!dataPelanggan.namaPemohon?.trim()) {
        toast.error("Nama pemohon wajib diisi.")
        return false
      }
      if (!dataPelanggan.hasilKalibrasiUntuk?.trim()) {
        toast.error("Nama pemilik sertifikat (hasil kalibrasi untuk) wajib diisi.")
        return false
      }
      if (!dataPelanggan.no_telp?.trim()) {
        toast.error("Nomor telepon pemohon wajib diisi.")
        return false
      }
      if (!dataPelanggan.alamatPemohon?.trim()) {
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

  const handleSubmit = async (aksi: "draft" | "ajukan" = "ajukan") => {
    const isAjukan = aksi === "ajukan"

    if (isAjukan) {
      if (!validateCurrentStep()) {
        return
      }
      if (!setujuPernyataan) {
        toast.error("Harap setujui pernyataan pemohon sebelum mengirim permohonan")
        return
      }
    } else {
      // Validasi draft: cukup ada data alat atau nama pemohon
      if ((!dataAlat || dataAlat.length === 0) && !dataPelanggan.namaPemohon?.trim()) {
        toast.error("Harap isi setidaknya nama pemohon atau data 1 alat untuk disimpan sebagai draft.")
        return
      }
    }

    try {
      setIsSubmitting(true)
      const payload = {
        aksi,
        dataAlat: dataAlat.length > 0 ? dataAlat : [
          {
            id: "draft-alat-1",
            namaAlat: "Alat Kalibrasi (Draft)",
            merk: "",
            tipeModel: "",
            jumlah: 1,
            nomorSeriList: [],
            kondisi: "Baik / Normal",
            kalibrasiList: [],
          }
        ],
        dataPelaksanaan,
        dataPelanggan: {
          ...dataPelanggan,
          namaPemohon: dataPelanggan.namaPemohon || "Draft Pemohon",
          hasilKalibrasiUntuk: dataPelanggan.hasilKalibrasiUntuk || dataPelanggan.namaPemohon || "Draft",
          alamatPemohon: dataPelanggan.alamatPemohon || "-",
        },
        setujuPernyataan: isAjukan ? true : Boolean(setujuPernyataan),
      }

      const res = await api.post("/eksternal/kalibrasi", payload)
      const resData = res?.data?.data || res?.data

      // Hapus draf di storage setelah sukses mengirim atau menyimpan ke backend
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        console.error("Gagal menghapus draf storage:", e)
      }
      setHasDraft(false)

      toast.success(
        res?.data?.message ||
        (isAjukan ? "Permohonan kalibrasi berhasil dikirim!" : "Draft permohonan kalibrasi berhasil disimpan di sistem!")
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
    }
  }

  return (
    <div className="space-y-4">
      {/* Tombol Reset Draft (diluar card timeline, kanan atas) */}
      <div className="flex justify-end -mb-2 min-h-[20px]">
        {hasDraft && (
          <button
            type="button"
            onClick={handleResetDraft}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors cursor-pointer"
            title="Reset Seluruh Draf Formulir"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Draft</span>
          </button>
        )}
      </div>

      {/* Stepper Progress Bar */}
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
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${isActive
                  ? "bg-brand-50/90 border border-brand-300 ring-2 ring-brand-500/20"
                  : isDone
                    ? "bg-slate-50 border border-slate-200 hover:bg-slate-100/70 cursor-pointer"
                    : "bg-slate-50/50 border border-slate-200/50 opacity-60 cursor-not-allowed"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${isDone
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
          {/* Tombol Simpan Draft ke Server */}
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSubmit("draft")}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold border border-slate-200 shadow-2xs hover:bg-slate-100"
          >
            <Save className="w-4 h-4 text-slate-600" />
            <span>Simpan Draft</span>
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
              onClick={() => handleSubmit("ajukan")}
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
    </div>
  )
}

export default FormKalibrasiWizard