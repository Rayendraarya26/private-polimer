import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { Button } from "../../ui/Button"
import { Modal } from "../../ui/Modal"
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
  RotateCcw,
  AlertTriangle,
} from "lucide-react"

import {
  FormHalalPayload,
  initialFormHalalPayload,
} from "../../../types/halal"
import { submitPermohonanHalal } from "../../../services/halal"
import { StickyFormActions } from "../../forms"
import useProfile from "../../../hooks/useProfile"
import { useHalalDraft } from "../../../hooks/useHalalDraft"

import { Step1ProfilDanJalur } from "./Step1ProfilDanJalur"
import { Step2FasilitasPabrik } from "./Step2FasilitasPabrik"
import { Step3PenyeliaHalal } from "./Step3PenyeliaHalal"
import { Step4BahanDanProduk } from "./Step4BahanDanProduk"
import { Step5PernyataanSJPH } from "./Step5PernyataanSJPH"

const TOTAL_STEPS = 5

const STEPS = [
  { id: 0, title: "Jalur & Pelaku Usaha", icon: FileText, desc: "Pilih jalur sertifikasi & data usaha" },
  { id: 1, title: "Fasilitas & Pabrik", icon: Building2, desc: "Pabrik produksi & outlet penjualan" },
  { id: 2, title: "Penyelia Halal", icon: UserCheck, desc: "Data identitas & SK penyelia" },
  { id: 3, title: "Bahan & Produk", icon: Boxes, desc: "Daftar bahan, produk & alur PPH" },
  { id: 4, title: "Komitmen & Berkas", icon: ShieldCheck, desc: "Upload berkas & ikrar integritas" },
]

export const FormHalalWizard: React.FC = () => {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const userId = profile?.id || (profile?.detail as any)?.id || "guest"
  const { existingDraft, autoSave, saveManual, clearDraft, isSaving } = useHalalDraft(String(userId))

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [maxStepReached, setMaxStepReached] = useState<number>(0)
  const [payload, setPayload] = useState<FormHalalPayload>(initialFormHalalPayload)
  const [showResetModal, setShowResetModal] = useState<boolean>(false)
  const draftClearedRef = useRef(false)
  const restoredRef = useRef(false)

  useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, currentStep))
  }, [currentStep])

  // Restore draft dari IndexedDB (termasuk berkas File asli)
  useEffect(() => {
    if (!existingDraft || restoredRef.current || draftClearedRef.current) return

    restoredRef.current = true
    const { currentStep: savedStep, payload: savedPayload } = existingDraft

    if (savedPayload) {
      const ensureFile = (f: any, defaultName: string = "dokumen.pdf"): File | null => {
        if (!f) return null
        if (f instanceof File) return f
        if (f instanceof Blob) return new File([f], (f as any).name || defaultName, { type: f.type })
        return null
      }

      const restoredProduk = Array.isArray(savedPayload.dataProduk)
        ? savedPayload.dataProduk.map((p: any) => ({
            ...p,
            foto: ensureFile(p.foto, "foto_produk.jpg"),
          }))
        : []

      setPayload((prev) => ({
        ...prev,
        ...savedPayload,
        dataProduk: restoredProduk.length > 0 ? restoredProduk : prev.dataProduk,
        file_denah_lokasi: ensureFile(savedPayload.file_denah_lokasi, "denah_lokasi.pdf"),
        file_sk_penyelia: ensureFile(savedPayload.file_sk_penyelia, "sk_penyelia.pdf"),
        file_ktp_penyelia: ensureFile(savedPayload.file_ktp_penyelia, "ktp_penyelia.pdf"),
        file_sertifikat_penyelia: ensureFile(savedPayload.file_sertifikat_penyelia, "sertifikat_penyelia.pdf"),
        file_alur_proses: ensureFile(savedPayload.file_alur_proses, "alur_proses.pdf"),
        file_surat_permohonan: ensureFile(savedPayload.file_surat_permohonan, "surat_permohonan.pdf"),
        file_manual_sjph: ensureFile(savedPayload.file_manual_sjph, "manual_sjph.pdf"),
      }))
    }

    if (typeof savedStep === "number" && savedStep >= 0 && savedStep < TOTAL_STEPS) {
      setCurrentStep(savedStep)
    }
  }, [existingDraft])

  // Migrasi satu kali dari localStorage lama jika belum ada di IndexedDB
  useEffect(() => {
    try {
      const oldStorage = localStorage.getItem("DRAFT_PERMOHONAN_HALAL")
      if (oldStorage && !existingDraft && !restoredRef.current) {
        const parsed = JSON.parse(oldStorage)
        if (parsed.payload) {
          setPayload((prev) => ({
            ...prev,
            ...parsed.payload,
          }))
          if (typeof parsed.currentStep === "number") {
            setCurrentStep(parsed.currentStep)
          }
          autoSave({ currentStep: parsed.currentStep || 0, payload: parsed.payload })
          localStorage.removeItem("DRAFT_PERMOHONAN_HALAL")
        }
      }
    } catch (e) {
      console.error("Gagal migrasi draf lama:", e)
    }
  }, [existingDraft, autoSave])

  const hasDraftContent = Boolean(
    payload.dataPengajuan.kode_fasilitasi ||
    payload.dataPelakuUsaha.nama_usaha ||
    payload.dataPelakuUsaha.nib ||
    payload.dataFasilitas.pabrik.length > 0 ||
    payload.dataPenyelia.penyelia_nama ||
    payload.dataBahan.length > 0 ||
    payload.dataProduk.length > 0 ||
    payload.file_surat_permohonan ||
    payload.file_manual_sjph
  )

  // Simpan draf ke IndexedDB secara otomatis setiap ada perubahan
  useEffect(() => {
    if (draftClearedRef.current) return
    if (hasDraftContent) {
      autoSave({
        currentStep,
        payload,
      })
    }
  }, [currentStep, payload, autoSave, hasDraftContent])

  // Re-enable auto-save saat ada perubahan data baru setelah discard
  useEffect(() => {
    if (!draftClearedRef.current) return
    if (hasDraftContent) {
      draftClearedRef.current = false
    }
  }, [hasDraftContent])

  // Handler: Hapus Draf dan Reset Formulir
  const confirmResetDraft = async () => {
    setShowResetModal(false)
    draftClearedRef.current = true
    restoredRef.current = true
    await clearDraft()
    try {
      localStorage.removeItem("DRAFT_PERMOHONAN_HALAL")
    } catch (e) {}
    setPayload(initialFormHalalPayload)
    setCurrentStep(0)
    setMaxStepReached(0)
    toast.success("Draf formulir sertifikasi halal berhasil direset.")
  }

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
        draftClearedRef.current = true
        await clearDraft()
        try {
          localStorage.removeItem("DRAFT_PERMOHONAN_HALAL")
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

  const handleSaveDraft = async () => {
    const success = await saveManual({ currentStep, payload })
    if (success) {
      toast.success("Draf permohonan sertifikasi halal (termasuk berkas) berhasil disimpan ke IndexedDB!")
    } else {
      toast.error("Gagal menyimpan draf.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Tombol Reset Draft */}
      {hasDraftContent && (
        <div className="flex justify-end -mb-2">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            title="Reset seluruh draf formulir"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Draft</span>
          </button>
        </div>
      )}

      {/* Stepper Progress Bar */}
      <nav aria-label="Langkah pengisian" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none">
        <ol className="grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-3">
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
                  id={`stepper-langkah-${idx + 1}`}
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
                  className={`w-full h-full flex items-center gap-3 p-3 sm:p-3.5 rounded-xl text-left transition-all duration-300 select-none shadow-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 ${
                    isActive
                      ? "bg-white border-2 border-brand-600 shadow-none"
                      : isPassed
                      ? "bg-emerald-50 border border-emerald-200 hover:border-emerald-300 cursor-pointer shadow-none"
                      : canNavigate
                      ? "bg-white border border-slate-200 hover:border-brand-400 cursor-pointer shadow-none"
                      : "bg-slate-50 border border-slate-200 cursor-not-allowed opacity-60 shadow-none"
                  }`}
                >
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-none ${
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
                  </span>

                  <span className="min-w-0">
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
                    <span
                      className={`block text-xs sm:text-sm font-bold truncate ${
                        isActive || isPassed || canNavigate ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {s.title}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

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

      {/* Form Navigation Actions (Non-sticky, sesuai form pengujian & kalibrasi) */}
      <StickyFormActions
        isSticky={false}
        canGoBack={true}
        backLabel={currentStep === 0 ? "Batal" : "Sebelumnya"}
        onBack={handleBack}
        onNext={handleNext}
        isLastStep={currentStep === TOTAL_STEPS - 1}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onSaveDraft={handleSaveDraft}
        nextLabel="Selanjutnya"
        submitLabel="Kirim Permohonan"
      />

      {/* Modal Konfirmasi Reset Draf (Seragam dengan Kalibrasi, Pengujian, & Sertifikasi) */}
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
            Seluruh data permohonan sertifikasi halal, fasilitas, penyelia, bahan, produk, dan berkas yang telah diunggah akan dihapus dan kembali ke langkah awal.
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

export default FormHalalWizard

