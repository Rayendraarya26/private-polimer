import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "../../ui/Button"
import {
  FileText,
  Building2,
  UserCheck,
  Boxes,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Check,
} from "lucide-react"

import {
  FormHalalPayload,
  initialFormHalalPayload,
} from "../../../types/halal"
import { submitPermohonanHalal } from "../../../services/halal"

import { Step1ProfilDanJalur } from "./Step1ProfilDanJalur"
import { Step2FasilitasPabrik } from "./Step2FasilitasPabrik"
import { Step3PenyeliaHalal } from "./Step3PenyeliaHalal"
import { Step4BahanDanProduk } from "./Step4BahanDanProduk"
import { Step5PernyataanSJPH } from "./Step5PernyataanSJPH"

const TOTAL_STEPS = 5
const STORAGE_KEY = "DRAFT_PERMOHONAN_HALAL"

const STEPS = [
  { id: 0, title: "Jalur & Pelaku Usaha", icon: FileText, desc: "Pilih jalur sertifikasi & data usaha" },
  { id: 1, title: "Fasilitas & Pabrik", icon: Building2, desc: "Pabrik produksi & outlet penjualan" },
  { id: 2, title: "Penyelia Halal", icon: UserCheck, desc: "Data identitas & SK penyelia" },
  { id: 3, title: "Bahan & Produk", icon: Boxes, desc: "Daftar bahan, produk & alur PPH" },
  { id: 4, title: "Komitmen & Berkas", icon: ShieldCheck, desc: "Upload berkas & ikrar integritas" },
]

export const FormHalalWizard: React.FC = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      console.error("Gagal memuat currentStep draf halal:", e)
    }
    return 0
  })

  // Inisialisasi payload dari localStorage
  const [payload, setPayload] = useState<FormHalalPayload>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.payload) {
          return {
            ...initialFormHalalPayload,
            ...parsed.payload,
            file_denah_lokasi: null,
            file_sk_penyelia: null,
            file_ktp_penyelia: null,
            file_sertifikat_penyelia: null,
            file_alur_proses: null,
            file_surat_permohonan: null,
            file_manual_sjph: null,
          }
        }
      }
    } catch (e) {
      console.error("Gagal memuat payload draf halal:", e)
    }
    return initialFormHalalPayload
  })

  // Simpan draf ke localStorage setiap ada perubahan
  useEffect(() => {
    try {
      const serializablePayload = {
        ...payload,
        file_denah_lokasi: null,
        file_sk_penyelia: null,
        file_ktp_penyelia: null,
        file_sertifikat_penyelia: null,
        file_alur_proses: null,
        file_surat_permohonan: null,
        file_manual_sjph: null,
        dataProduk: payload.dataProduk.map((p) => ({ ...p, foto: null })),
      }
      const serializableData = {
        currentStep,
        payload: serializablePayload,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData))
    } catch (error) {
      console.error("Gagal menyimpan draf halal:", error)
    }
  }, [currentStep, payload])

  const validateCurrentStep = (): boolean => {
    // Validasi Step 0
    if (currentStep === 0) {
      const { jalur_pendaftaran } = payload.dataPengajuan
      const { nama_usaha, nib, pj_nama, pj_kontak } = payload.dataPelakuUsaha

      if (jalur_pendaftaran === "self_declare") {
        const q = payload.kuesionerSelfDeclare
        if (
          !q.is_mikro_kecil ||
          !q.is_produk_tidak_berisiko ||
          !q.is_bahan_pasti_halal ||
          !q.is_proses_sederhana ||
          !q.is_alat_manual_semi ||
          !q.is_bebas_najis
        ) {
          toast.error("Untuk Jalur Self Declare, seluruh kriteria kelayakan mandiri UMK harus dipenuhi!")
          return false
        }
      }

      if (!nama_usaha?.trim()) {
        toast.error("Nama Pelaku Usaha / Perusahaan wajib diisi")
        return false
      }
      if (!nib?.trim()) {
        toast.error("Nomor Induk Berusaha (NIB) wajib diisi")
        return false
      }
      if (!pj_nama?.trim()) {
        toast.error("Nama Penanggung Jawab wajib diisi")
        return false
      }
      if (!pj_kontak?.trim()) {
        toast.error("Nomor WhatsApp/Kontak Penanggung Jawab wajib diisi")
        return false
      }
    }

    // Validasi Step 1
    if (currentStep === 1) {
      const pabrikList = payload.dataFasilitas.pabrik || []
      if (pabrikList.length === 0) {
        toast.error("Harap tambahkan minimal 1 Fasilitas Pabrik / Dapur Produksi")
        return false
      }
      for (const p of pabrikList) {
        if (!p.nama?.trim() || !p.alamat?.trim()) {
          toast.error("Nama fasilitas pabrik dan alamat lokasi wajib diisi lengkap")
          return false
        }
      }
    }

    // Validasi Step 2
    if (currentStep === 2) {
      const p = payload.dataPenyelia
      if (!p.penyelia_nama?.trim()) {
        toast.error("Nama lengkap Penyelia Halal wajib diisi")
        return false
      }
      if (!p.penyelia_nik?.trim() || p.penyelia_nik.trim().length < 16) {
        toast.error("Nomor NIK KTP Penyelia Halal harus 16 digit")
        return false
      }
      if (!p.penyelia_kontak?.trim()) {
        toast.error("Nomor kontak/WA Penyelia Halal wajib diisi")
        return false
      }
      if (!p.penyelia_no_sk?.trim()) {
        toast.error("Nomor SK Penetapan Penyelia Halal wajib diisi")
        return false
      }
      if (!p.penyelia_tgl_sk?.trim()) {
        toast.error("Tanggal SK Penetapan Penyelia Halal wajib diisi")
        return false
      }
    }

    // Validasi Step 3
    if (currentStep === 3) {
      const isSelf = payload.dataPengajuan.jalur_pendaftaran === "self_declare"
      if (!payload.dataBahan || payload.dataBahan.length === 0) {
        toast.error("Harap isi daftar bahan minimal 1 bahan")
        return false
      }
      for (const b of payload.dataBahan) {
        if (!b.nama_bahan?.trim()) {
          toast.error("Nama bahan tidak boleh kosong")
          return false
        }
      }

      if (isSelf) {
        const hasCleaning = payload.dataBahan.some(
          (b) => b.jenis_bahan.toLowerCase().includes("cleaning") || b.jenis_bahan.toLowerCase().includes("sabun")
        )
        const hasKemasan = payload.dataBahan.some((b) => b.jenis_bahan.toLowerCase().includes("kemasan"))
        if (!hasCleaning || !hasKemasan) {
          toast.error("Untuk Jalur Self Declare, daftar bahan wajib mencakup Cleaning Agent dan Kemasan!")
          return false
        }
      }

      if (!payload.dataProduk || payload.dataProduk.length === 0) {
        toast.error("Harap daftarkan minimal 1 produk")
        return false
      }
      if (isSelf && payload.dataProduk.length > 10) {
        toast.error("Jalur Self Declare maksimal 10 produk dalam 1 permohonan")
        return false
      }
      for (const prod of payload.dataProduk) {
        if (!prod.nama_produk?.trim() || !prod.merk?.trim()) {
          toast.error("Nama produk dan merk dagang wajib diisi")
          return false
        }
      }

      if (!payload.alur_proses?.trim()) {
        toast.error("Uraian ringkas alur proses produksi halal (PPH) wajib diisi")
        return false
      }
    }

    // Validasi Step 4
    if (currentStep === 4) {
      const isReg = payload.dataPengajuan.jalur_pendaftaran === "reguler"
      if (isReg && !payload.file_surat_permohonan) {
        toast.error("Untuk Jalur Reguler, Berkas Surat Permohonan wajib diunggah (PDF)")
        return false
      }
      if (isReg && !payload.file_manual_sjph) {
        toast.error("Untuk Jalur Reguler, Berkas Manual SJPH wajib diunggah (PDF)")
        return false
      }
      if (!payload.pernyataan_bebas_babi) {
        toast.error("Anda wajib menyetujui pernyataan bebas bahan babi & najis")
        return false
      }
      if (!payload.pernyataan_komitmen_sjph) {
        toast.error("Anda wajib menyetujui komitmen penerapan Sistem Jaminan Produk Halal")
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
    if (!validateCurrentStep()) return

    setIsSubmitting(true)
    const loadingToast = toast.loading("Mengirim permohonan sertifikasi halal...")

    try {
      const response = await submitPermohonanHalal(payload)
      toast.dismiss(loadingToast)

      if (response?.success || response?.status === "success") {
        toast.success(response?.message || "Permohonan Sertifikasi Halal berhasil diajukan!")
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch (e) {
          console.error("Gagal menghapus draf storage:", e)
        }
        navigate("/dashboard")
      } else {
        toast.error(response?.message || "Terjadi kesalahan saat memproses permohonan.")
      }
    } catch (error: any) {
      toast.dismiss(loadingToast)
      console.error("Gagal submit permohonan halal:", error)
      const errorMsg =
        error.response?.data?.message ||
        "Gagal mengirim permohonan. Periksa koneksi internet Anda atau hubungi admin."
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Stepper Progress Bar (Sama persis dengan FormKalibrasiWizard & FormInspeksiWizard) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
        <Step1ProfilDanJalur payload={payload} onChange={setPayload} />
      </div>

      <div className={currentStep === 1 ? "block" : "hidden"}>
        <Step2FasilitasPabrik payload={payload} onChange={setPayload} />
      </div>

      <div className={currentStep === 2 ? "block" : "hidden"}>
        <Step3PenyeliaHalal payload={payload} onChange={setPayload} />
      </div>

      <div className={currentStep === 3 ? "block" : "hidden"}>
        <Step4BahanDanProduk payload={payload} onChange={setPayload} />
      </div>

      <div className={currentStep === 4 ? "block" : "hidden"}>
        <Step5PernyataanSJPH payload={payload} onChange={setPayload} />
      </div>

      {/* Navigation Buttons (Sama persis dengan FormKalibrasiWizard & FormInspeksiWizard) */}
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

export default FormHalalWizard

