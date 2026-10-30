import React, { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import useProfile from "../../../hooks/useProfile"
import { useSertifikasi } from "../../../hooks/service-requests/useSertifikasi"
import { useSertifikasiDraft } from "../../../hooks/useSertifikasiDraft"
import {
  SertifikasiFormData,
  initialSertifikasiFormData,
} from "../../../types/sertifikasi"
import { useSertifikasiSkemaQuery, useProvincesQuery } from "../../../hooks/queries/useMasterQuery"
import Step1JenisPermohonan from "./Step1JenisPermohonan"
import Step2KategoriDanKomoditi from "./Step2KategoriDanKomoditi"
import Step3PerusahaanDanPabrik from "./Step3PerusahaanDanPabrik"
import Step4PernyataanKonfirmasi from "./Step4PernyataanKonfirmasi"
import { Layers, Package, Building2, CheckSquare, Check, RotateCcw, AlertTriangle } from "lucide-react"
import { Modal } from "../../ui/Modal"
import { Button } from "../../ui/Button"

const STEPS = [
  { id: 0, title: "Jenis Permohonan", icon: Layers },
  { id: 1, title: "Kategori Sertifikat", icon: Package, },
  { id: 2, title: "Kondisi Perusahaan", icon: Building2, },
  { id: 3, title: "Pernyataan", icon: CheckSquare },
]

interface Props {
  skemaId?: string
}

export const FormSertifikasiWizard: React.FC<Props> = ({ skemaId }) => {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const detail = profile?.detail
  const userId = profile?.id || (profile?.detail as any)?.id || "guest"

  const { data: skemaList = [] } = useSertifikasiSkemaQuery()
  const { data: provinces = [] } = useProvincesQuery()

  const { submitting, createPermohonanSertifikasi } = useSertifikasi()
  const { existingDraft, autoSave, clearDraft } = useSertifikasiDraft(String(userId))

  const [step, setStep] = useState(0)
  const [maxStepReached, setMaxStepReached] = useState<number>(step)

  useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, step))
  }, [step])
  const [formData, setFormData] = useState<SertifikasiFormData>(() => {
    const init = { ...initialSertifikasiFormData }
    if (skemaId && init.pengajuan.length > 0) {
      init.pengajuan[0].skema_id = skemaId
    }
    return init
  })
  const [showResetModal, setShowResetModal] = useState<boolean>(false)
  const draftClearedRef = useRef(false)
  const restoredRef = useRef(false)

  const hasDraftContent = Boolean(
    formData.nama_perusahaan ||
    formData.pengajuan.some((p) => p.skema_id || p.items.length > 0)
  )

  // Otomatis terapkan draf dari IndexedDB saat pertama kali dimuat (seperti audit teknologi)
  useEffect(() => {
    if (!existingDraft || restoredRef.current || draftClearedRef.current) return

    restoredRef.current = true
    const { draftId, updatedAt, step: savedStep, currentStep, ...rest } = existingDraft
    setFormData((prev) => ({
      ...prev,
      ...rest,
    }))
    const targetStep = typeof savedStep === "number" ? savedStep : typeof currentStep === "number" ? currentStep : null
    if (targetStep !== null && targetStep >= 0 && targetStep < STEPS.length) {
      setStep(targetStep)
    }
  }, [existingDraft])

  // Auto-save form data changes to IndexedDB
  useEffect(() => {
    if (draftClearedRef.current) return
    if (hasDraftContent) {
      autoSave({
        ...formData,
        step,
      })
    }
  }, [formData, step, autoSave, hasDraftContent])

  // Re-enable auto-save after user makes meaningful edits post-discard
  useEffect(() => {
    if (!draftClearedRef.current) return
    const hasUserEdits = formData.pengajuan.some((p) => p.skema_id || p.items.length > 0)
    if (hasUserEdits) {
      draftClearedRef.current = false
    }
  }, [formData])

  // Reset Draft Action (Konfirmasi via Modal)
  const confirmResetDraft = async () => {
    setShowResetModal(false)
    draftClearedRef.current = true
    restoredRef.current = true
    await clearDraft()
    const init = { ...initialSertifikasiFormData }
    if (skemaId && init.pengajuan.length > 0) {
      init.pengajuan[0].skema_id = skemaId
    }
    setFormData(init)
    setStep(0)
    setMaxStepReached(0)
    toast.success("Draf formulir sertifikasi berhasil direset.")
  }

  // Prefill from user profile if available
  useEffect(() => {
    if (!detail) return
    setFormData((prev) => ({
      ...prev,
      nama_perusahaan: prev.nama_perusahaan || detail.nama || "",
      nomor_akta_pendirian: prev.nomor_akta_pendirian || detail.no_akta_pendirian || detail.nib || "",
      nama_pemilik: prev.nama_pemilik || detail.pemilik || "",
      nama_pimpinan: prev.nama_pimpinan || detail.pimpinan || "",
      nama_wakil_manajemen: prev.nama_wakil_manajemen || detail.pj_nama || "",
      alamat_kantor: prev.alamat_kantor || detail.alamat || "",
      kontak_person: prev.kontak_person || detail.pimpinan || detail.pemilik || detail.pj_nama || "",
      no_telp: prev.no_telp || detail.telepon || "",
      no_whatsapp: prev.no_whatsapp || detail.whatsapp || detail.pj_whatsapp || "",
      email: prev.email || detail.surel || profile?.email || "",
    }))
  }, [detail, profile])

  // Step 1 Validation (Jenis Permohonan)
  const validateStep0 = () => {
    for (let i = 0; i < formData.pengajuan.length; i++) {
      const p = formData.pengajuan[i]
      if (!p.jenis_pengajuan) {
        toast.error(`Pengajuan #${i + 1}: Pilih jenis permohonan (Baru / Perpanjangan).`)
        return false
      }
      if (p.jenis_pengajuan === "lama" && !p.sertifikat_lama_text?.trim()) {
        toast.error(`Pengajuan #${i + 1}: Masukkan nomor / referensi sertifikat lama untuk perpanjangan.`)
        return false
      }
    }
    return true
  }

  // Step 2 Validation (Kategori, Komoditi & Dokumen)
  const validateStep1 = () => {
    for (let i = 0; i < formData.pengajuan.length; i++) {
      const p = formData.pengajuan[i]
      if (!p.skema_id) {
        toast.error(`Pengajuan #${i + 1}: Pilih ruang lingkup sertifikasi.`)
        return false
      }
      if (!p.items || p.items.length === 0) {
        toast.error(`Pengajuan #${i + 1}: Minimal harus mengisi 1 item komoditi/produk ke dalam tabel.`)
        return false
      }
      for (let j = 0; j < p.items.length; j++) {
        const item = p.items[j]
        if (!item.nama_produk?.trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Nama komoditi/produk wajib diisi.`)
          return false
        }
        if (!item.merk_dagang?.trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Merek dagang wajib diisi.`)
          return false
        }
        if (!item.tipe_jenis?.trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Tipe/jenis komoditi wajib diisi.`)
          return false
        }
        if (!item.ukuran?.trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Ukuran komoditi wajib diisi.`)
          return false
        }
        if (!item.kapasitas_produksi?.toString().trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Jumlah produksi/tahun wajib diisi.`)
          return false
        }
        if (!item.satuan_produksi?.trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Satuan produksi wajib diisi.`)
          return false
        }
      }

      // Validasi dokumen persyaratan wajib
      const docList = p.dokumen_list || []
      for (const doc of docList) {
        if (doc.wajib && !doc.file && !doc.fileName && !doc.fileUrl && !doc.isFromProfile) {
          toast.error(`Pengajuan #${i + 1}: Dokumen "${doc.nama}" wajib diunggah.`)
          return false
        }
      }
    }
    return true
  }

  // Step 3 Validation (Perusahaan & Pabrik)
  const validateStep2 = () => {
    // 1. Data Perusahaan
    if (!formData.nama_perusahaan?.trim()) {
      toast.error("Nama Perusahaan / Badan Usaha wajib diisi.")
      return false
    }
    if (!formData.nomor_akta_pendirian?.trim()) {
      toast.error("Nomor Akta Pendirian wajib diisi.")
      return false
    }
    if (!formData.nama_pemilik?.trim()) {
      toast.error("Nama Pemilik wajib diisi.")
      return false
    }
    if (!formData.nama_pimpinan?.trim()) {
      toast.error("Nama Pimpinan wajib diisi.")
      return false
    }
    if (!formData.nama_wakil_manajemen?.trim()) {
      toast.error("Nama Wakil Manajemen wajib diisi.")
      return false
    }
    if (!formData.no_telp?.trim()) {
      toast.error("Nomor Telepon Perusahaan wajib diisi.")
      return false
    }
    if (!formData.no_whatsapp?.trim()) {
      toast.error("Nomor HP (CP) / WhatsApp wajib diisi.")
      return false
    }
    if (!formData.email?.trim()) {
      toast.error("Email resmi perusahaan wajib diisi.")
      return false
    }
    if (!formData.badan_hukum?.trim()) {
      toast.error("Bentuk Badan Hukum wajib diisi.")
      return false
    }
    if (!formData.jenis_perusahaan?.trim()) {
      toast.error("Status Perusahaan wajib diisi.")
      return false
    }

    // 2. Lokasi Domisili
    if (!formData.negara?.trim()) {
      toast.error("Negara domisili wajib dipilih.")
      return false
    }
    if (!formData.provinsi?.trim()) {
      toast.error("Provinsi domisili wajib diisi.")
      return false
    }
    if (!formData.kabupaten?.trim()) {
      toast.error("Kabupaten / Kota domisili wajib diisi.")
      return false
    }
    if (!formData.kecamatan?.trim()) {
      toast.error("Kecamatan domisili wajib diisi.")
      return false
    }
    if (!formData.alamat_kantor?.trim()) {
      toast.error("Alamat Lengkap Kantor Pusat wajib diisi.")
      return false
    }
    if (!formData.luas_tanah?.toString().trim()) {
      toast.error("Luas Tanah domisili kantor wajib diisi.")
      return false
    }
    if (!formData.luas_bangunan?.toString().trim()) {
      toast.error("Luas Bangunan domisili kantor wajib diisi.")
      return false
    }

    // 3. Operasional & Ketenagakerjaan
    if (formData.jumlah_shift === undefined || formData.jumlah_shift === null || Number(formData.jumlah_shift) < 1) {
      toast.error("Jumlah Shift operasional dalam sehari minimal 1.")
      return false
    }
    if (formData.jumlah_bagian === undefined || formData.jumlah_bagian === null || (formData.jumlah_bagian as any) === "") {
      toast.error("Jumlah Bagian operasional wajib diisi.")
      return false
    }
    if (!formData.jumlah_karyawan_total || Number(formData.jumlah_karyawan_total) <= 0) {
      toast.error("Total Jumlah Karyawan harus lebih dari 0 orang. Silakan isi rincian karyawan.")
      return false
    }

    // 4. Data Pabrik
    if (!formData.pabrik || formData.pabrik.length === 0) {
      toast.error("Minimal harus mendaftarkan 1 lokasi fasilitas pabrik.")
      return false
    }
    for (let i = 0; i < formData.pabrik.length; i++) {
      const f = formData.pabrik[i]
      if (!f.nama_pabrik?.trim()) {
        toast.error(`Fasilitas Pabrik #${i + 1}: Nama pabrik wajib diisi.`)
        return false
      }
      if (!f.negara?.trim()) {
        toast.error(`Fasilitas Pabrik #${i + 1}: Negara pabrik wajib dipilih.`)
        return false
      }
      if (!f.alamat_pabrik?.trim()) {
        toast.error(`Fasilitas Pabrik #${i + 1}: Alamat pabrik wajib diisi.`)
        return false
      }
    }

    // 5. Berkas Gabungan
    if (!formData.file_berkas_gabungan) {
      toast.error("Upload Berkas Gabungan (Form 1, Form 2, dan Form 3) wajib diisi.")
      return false
    }

    return true
  }

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return

    setStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = useCallback(
    async (aksi: "draft" | "ajukan") => {
      if (aksi === "ajukan") {
        if (!validateStep0() || !validateStep1() || !validateStep2()) return
        if (!formData.setuju_syarat) {
          toast.error("Anda harus menyetujui pakta integritas dan ketentuan layanan.")
          return
        }

        const confirm = await Swal.fire({
          title: "Kirim Permohonan Sertifikasi?",
          text: `Total ${formData.pengajuan.length} pengajuan sertifikasi akan dikirim ke Tim Marketing Balai Besar untuk diverifikasi.`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#0284c7",
          cancelButtonColor: "#64748b",
          confirmButtonText: "Ya, Kirim Sekarang!",
          cancelButtonText: "Periksa Kembali",
        })

        if (!confirm.isConfirmed) return
      }

      await createPermohonanSertifikasi(
        { ...formData, aksi },
        async () => {
          draftClearedRef.current = true
          await clearDraft()
          Swal.fire({
            title: aksi === "ajukan" ? "Permohonan Berhasil Dikirim!" : "Draft Berhasil Disimpan!",
            text:
              aksi === "ajukan"
                ? "Permohonan sertifikasi produk & sistem Anda sedang diproses dalam antrean verifikasi."
                : "Permohonan berhasil disimpan sebagai draft di dashboard akun Anda.",
            icon: "success",
            confirmButtonColor: "#0284c7",
          }).then(() => {
            navigate("/dashboard")
          })
        }
      )
    },
    [formData, createPermohonanSertifikasi, clearDraft, navigate]
  )

  return (
    <div className="space-y-5">
      {/* Tombol Reset Draft (Seragam dengan Kalibrasi, Pengujian, & Audit Teknologi) */}
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

      {/* Stepper Progress Bar (Seragam dengan Kalibrasi, Pengujian, & Audit Teknologi) */}
      <nav aria-label="Langkah pengisian permohonan sertifikasi" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none">
        <ol className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            const isActive = step === idx
            const isPassed = idx < step
            const isReachable = idx <= maxStepReached
            const canNavigate = isReachable && !isActive

            return (
              <li key={s.id}>
                <button
                  type="button"
                  id={`stepper-sertifikasi-${idx + 1}`}
                  disabled={!canNavigate}
                  aria-current={isActive ? "step" : undefined}
                  onFocus={(e) => e.currentTarget.blur()}
                  onClick={() => {
                    if (canNavigate) {
                      setStep(idx)
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

      {/* Wizard Steps Content */}
      <div className="transition-all duration-300">
        {step === 0 && (
          <Step1JenisPermohonan
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 1 && (
          <Step2KategoriDanKomoditi
            formData={formData}
            setFormData={setFormData}
            skemaList={skemaList}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 2 && (
          <Step3PerusahaanDanPabrik
            formData={formData}
            setFormData={setFormData}
            provinces={provinces}
            regencies={[]}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <Step4PernyataanKonfirmasi
            formData={formData}
            setFormData={setFormData}
            skemaList={skemaList}
            submitting={submitting}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {/* Modal Konfirmasi Reset Draf (Seragam dengan Kalibrasi, Pengujian, & Audit Teknologi) */}
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
            Seluruh data permohonan sertifikasi, komoditi, data perusahaan, fasilitas pabrik, dan berkas yang telah diisi akan dihapus dan kembali ke langkah awal.
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

export default FormSertifikasiWizard
