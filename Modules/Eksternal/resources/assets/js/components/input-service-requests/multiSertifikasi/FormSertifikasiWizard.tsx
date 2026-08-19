import React, { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import useProfile from "../../../hooks/useProfile"
import { useSertifikasi } from "../../../hooks/service-requests/useSertifikasi"
import {
  SertifikasiFormData,
  initialSertifikasiFormData,
} from "../../../types/sertifikasi"
import StepDataPerusahaan from "./StepDataPerusahaan"
import StepDataPabrik from "./StepDataPabrik"
import StepDataProduk from "./StepDataProduk"
import StepUploadBerkas from "./StepUploadBerkas"
import StepKonfirmasi from "./StepKonfirmasi"
import { Check, Building2, Factory, Package, FileUp, CheckSquare } from "lucide-react"

const STEPS = [
  { id: 0, title: "Data Pemohon", icon: Building2, desc: "Profil perusahaan & tipe pengajuan" },
  { id: 1, title: "Lokasi Pabrik", icon: Factory, desc: "Fasilitas & lokasi audit sertifikasi" },
  { id: 2, title: "Komoditi / Produk", icon: Package, desc: "Daftar produk & nomor standar SNI" },
  { id: 3, title: "Unggah Berkas", icon: FileUp, desc: "Legalitas, manual mutu & alur proses" },
  { id: 4, title: "Konfirmasi", icon: CheckSquare, desc: "Review rincian & kirim pengajuan" },
]

interface Props {
  skemaId: string
}

export const FormSertifikasiWizard: React.FC<Props> = ({ skemaId }) => {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const detail = profile?.detail

  const { submitting, createPermohonanSertifikasi } = useSertifikasi()

  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<SertifikasiFormData>({
    ...initialSertifikasiFormData,
    skema_id: skemaId,
  })

  // Prefill from user profile if available
  useEffect(() => {
    if (!detail) return
    setFormData((prev) => ({
      ...prev,
      skema_id: skemaId,
      nama_perusahaan: prev.nama_perusahaan || detail.nama || "",
      alamat_kantor: prev.alamat_kantor || detail.alamat || "",
      kontak_person: prev.kontak_person || detail.pimpinan || detail.pemilik || "",
      no_telp: prev.no_telp || detail.telepon || "",
      no_whatsapp: prev.no_whatsapp || detail.whatsapp || "",
      email: prev.email || detail.surel || profile?.user?.email || "",
    }))
  }, [detail, profile, skemaId])

  // Step 1 Validation
  const validateStep0 = () => {
    if (!formData.nama_perusahaan.trim()) {
      toast.error("Nama Perusahaan / Badan Usaha wajib diisi.")
      return false
    }
    if (!formData.alamat_kantor.trim()) {
      toast.error("Alamat Kantor Pusat wajib diisi.")
      return false
    }
    if (!formData.email.trim()) {
      toast.error("Email resmi perusahaan wajib diisi.")
      return false
    }
    if (!formData.no_whatsapp.trim()) {
      toast.error("Nomor WhatsApp PIC wajib diisi.")
      return false
    }
    return true
  }

  // Step 2 Validation (Pabrik)
  const validateStep1 = () => {
    if (!formData.pabrik.length) {
      toast.error("Minimal harus menambahkan 1 lokasi pabrik / fasilitas produksi.")
      return false
    }
    for (let i = 0; i < formData.pabrik.length; i++) {
      const p = formData.pabrik[i]
      if (!p.nama_pabrik.trim()) {
        toast.error(`Pabrik #${i + 1}: Nama pabrik wajib diisi.`)
        return false
      }
      if (!p.alamat_pabrik.trim()) {
        toast.error(`Pabrik #${i + 1}: Alamat pabrik wajib diisi.`)
        return false
      }
    }
    return true
  }

  // Step 3 Validation (Produk)
  const validateStep2 = () => {
    if (!formData.items.length) {
      toast.error("Minimal harus mendaftarkan 1 komoditi / produk.")
      return false
    }
    for (let i = 0; i < formData.items.length; i++) {
      const it = formData.items[i]
      if (!it.nama_produk.trim()) {
        toast.error(`Produk #${i + 1}: Nama produk / komoditi wajib diisi.`)
        return false
      }
      if (!it.standar_sni_iso?.trim()) {
        toast.error(`Produk #${i + 1}: Standar acuan SNI/ISO wajib diisi.`)
        return false
      }
    }
    return true
  }

  // Step 4 Validation (Berkas)
  const validateStep3 = () => {
    if (!formData.dok_legalitas) {
      toast.error("Dokumen legalitas perusahaan (NIB / Akta) wajib diunggah.")
      return false
    }
    return true
  }

  const goNext = () => {
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    if (step === 3 && !validateStep3()) return

    setStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = useCallback(
    async (aksi: "draft" | "ajukan") => {
      if (aksi === "ajukan" && !formData.setuju_syarat) {
        toast.error("Anda harus menyetujui pernyataan & ketentuan sertifikasi.")
        return
      }

      const confirm = await Swal.fire({
        title: aksi === "draft" ? "Simpan Draf Permohonan?" : "Konfirmasi Pengajuan Sertifikasi",
        text:
          aksi === "draft"
            ? "Draf permohonan sertifikasi akan disimpan dan dapat dilengkapi kembali nanti."
            : `Apakah Anda yakin ingin mengajukan sertifikasi untuk ${formData.items.length} item produk ke Balai Besar Standardisasi (BBKKP)?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0284c7",
        cancelButtonColor: "#94a3b8",
        confirmButtonText: aksi === "draft" ? "Ya, Simpan Draf" : "Ya, Ajukan Sekarang",
        cancelButtonText: "Periksa Lagi",
        reverseButtons: true,
      })

      if (!confirm.isConfirmed) return

      await createPermohonanSertifikasi(
        {
          ...formData,
          skema_id: skemaId,
          aksi,
        },
        () => {
          navigate("/dashboard")
        }
      )
    },
    [formData, skemaId, createPermohonanSertifikasi, navigate]
  )

  return (
    <div className="space-y-6">
      {/* Progress Stepper */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            const isActive = step === idx
            const isDone = step > idx

            return (
              <div
                key={s.id}
                onClick={() => {
                  if (isDone) setStep(idx)
                }}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${
                  isDone ? "cursor-pointer" : ""
                } ${
                  isActive
                    ? "bg-brand-50/80 border border-brand-200 ring-2 ring-brand-500/20"
                    : isDone
                    ? "bg-emerald-50/60 border border-emerald-200"
                    : "bg-slate-50 border border-slate-200/60 opacity-60"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    isDone
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isActive
                      ? "bg-brand-600 text-white shadow-md shadow-brand-500/30"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>

                <div className="min-w-0">
                  <span className="text-[9px] font-bold tracking-wider uppercase block text-slate-500">
                    Langkah {idx + 1}
                  </span>
                  <p className="text-xs font-bold text-slate-800 truncate">{s.title}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Components */}
      {step === 0 && (
        <StepDataPerusahaan
          formData={formData}
          setFormData={setFormData}
          onNext={goNext}
        />
      )}

      {step === 1 && (
        <StepDataPabrik
          formData={formData}
          setFormData={setFormData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 2 && (
        <StepDataProduk
          formData={formData}
          setFormData={setFormData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 3 && (
        <StepUploadBerkas
          formData={formData}
          setFormData={setFormData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 4 && (
        <StepKonfirmasi
          formData={formData}
          setFormData={setFormData}
          submitting={submitting}
          onBack={goBack}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

export default FormSertifikasiWizard
