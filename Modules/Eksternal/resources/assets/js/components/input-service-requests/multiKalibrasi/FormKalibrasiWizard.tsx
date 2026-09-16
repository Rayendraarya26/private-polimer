import React, { useState, useEffect, useCallback } from "react"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import useProfile from "../../../hooks/useProfile"
import { ProfileClientType } from "../../../types/profile"
import {
  KalibrasiItem,
  KalibrasiSharedData,
  emptyKalibrasiItem,
  initialKalibrasiSharedData,
} from "../../../types/kalibrasi"
import Step1DataAlatKalibrasi from "./Step1DataAlatKalibrasi"
import Step2InformasiPengiriman from "./Step2InformasiPengiriman"
import { Check, Gauge, Building2, Sparkles, Sliders } from "lucide-react"

const STEPS = [
  { id: 0, title: "Daftar Alat & Instrumen", icon: Gauge, desc: "Spesifikasi, merek, tipe & no. seri" },
  { id: 1, title: "Metode & Data Pemohon", icon: Building2, desc: "Lokasi kalibrasi, pengiriman & persetujuan" },
]

interface Props {
  skemaId?: string
  kapabilitas?: number
}

export const FormKalibrasiWizard: React.FC<Props> = ({ skemaId }) => {
  const MAX_SIZE = 5 * 1024 * 1024
  const { profile } = useProfile()
  const isInstansi = profile?.detail?.type !== ProfileClientType.PERORANGAN

  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(0)
  const [nextId, setNextId] = useState(1)
  const [activeId, setActiveId] = useState(0)
  const [items, setItems] = useState<KalibrasiItem[]>([emptyKalibrasiItem(0)])
  const [sharedData, setSharedData] = useState<KalibrasiSharedData>(initialKalibrasiSharedData)

  // Auto-populate from Profile
  useEffect(() => {
    if (!profile) return
    const detail = profile.detail

    setSharedData((prev) => ({
      ...prev,
      nama_pemohon: profile.name || detail?.nama || "",
      nama_instansi: detail?.nama || profile.name || "",
      email: profile.email || detail?.surel || "",
      whatsapp: detail?.whatsapp || (profile as any)?.no_hp || "",
      alamat_lengkap: detail?.alamat || "",
    }))
  }, [profile])

  const validateFileSize = (file: File | null | undefined, label: string, index: number) => {
    if (!file) return true
    if (file.size > MAX_SIZE) {
      toast.error(`Alat #${index + 1}: ${label} maksimal 5 MB`)
      return false
    }
    return true
  }

  const goNext = () => {
    for (let i = 0; i < items.length; i++) {
      const it = items[i]
      if (!it.nama_alat?.trim()) {
        toast.error(`Alat #${i + 1}: Nama alat belum diisi`)
        setActiveId(it.id)
        return
      }
      if (!it.merek?.trim()) {
        toast.error(`Alat #${i + 1}: Merek / Pabrik pembuat belum diisi`)
        setActiveId(it.id)
        return
      }
      if (!it.tipe_model?.trim()) {
        toast.error(`Alat #${i + 1}: Tipe / Model belum diisi`)
        setActiveId(it.id)
        return
      }
      if (!it.no_seri?.trim()) {
        toast.error(`Alat #${i + 1}: Nomor Seri (Serial Number) belum diisi`)
        setActiveId(it.id)
        return
      }
      if (!it.kapasitas_rentang?.trim()) {
        toast.error(`Alat #${i + 1}: Rentang ukur / kapasitas belum diisi`)
        setActiveId(it.id)
        return
      }
      if (!it.resolusi?.trim()) {
        toast.error(`Alat #${i + 1}: Resolusi / skala terkecil belum diisi`)
        setActiveId(it.id)
        return
      }
      if (!it.jumlah || it.jumlah < 1) {
        toast.error(`Alat #${i + 1}: Jumlah alat minimal 1`)
        setActiveId(it.id)
        return
      }
      if (!validateFileSize(it.dokumen_pendukung, "Dokumen Pendukung", i)) {
        setActiveId(it.id)
        return
      }
    }

    setStep(1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goBack = () => {
    setStep(0)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmitAll = useCallback(
    async (aksi: "draft" | "ajukan") => {
      if (!sharedData.nama_pemohon?.trim()) return toast.error("Nama pemohon belum diisi")
      if (!sharedData.nama_instansi?.trim()) return toast.error("Nama instansi/perusahaan belum diisi")
      if (!sharedData.whatsapp?.trim()) return toast.error("Nomor WhatsApp belum diisi")
      if (!sharedData.email?.trim()) return toast.error("Email belum diisi")
      if (!sharedData.alamat_lengkap?.trim()) return toast.error("Alamat lengkap belum diisi")

      if (aksi === "ajukan" && !sharedData.setuju_syarat) {
        return toast.error("Anda wajib mencentang persetujuan syarat & ketentuan kalibrasi")
      }

      const totalUnit = items.reduce((acc, it) => acc + (it.jumlah || 1), 0)

      const confirm = await Swal.fire({
        title: aksi === "draft" ? "Simpan Draft Kalibrasi?" : "Konfirmasi Permohonan Kalibrasi",
        text: `Apakah Anda yakin ingin ${
          aksi === "draft" ? "menyimpan draft" : "mengajukan"
        } permohonan kalibrasi untuk ${items.length} jenis alat (total ${totalUnit} unit)?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#059669",
        cancelButtonColor: "#94a3b8",
        confirmButtonText: aksi === "draft" ? "Ya, Simpan Draft" : "Ya, Ajukan Sekarang",
        cancelButtonText: "Periksa Kembali",
        reverseButtons: true,
      })

      if (!confirm.isConfirmed) return

      try {
        setSubmitting(true)

        // Payload data kalibrasi
        const payload = {
          skema_id: skemaId,
          aksi,
          sharedData,
          items,
        }

        // Simulasi pengajuan (atau connect ke hook API permohonan kalibrasi)
        await new Promise((resolve) => setTimeout(resolve, 1200))

        toast.success(
          aksi === "draft"
            ? `Draft kalibrasi (${items.length} alat) berhasil disimpan`
            : `Permohonan kalibrasi (${items.length} jenis alat) berhasil diajukan!`
        )

        // Reset state jika submit sukses
        if (aksi === "ajukan") {
          setItems([emptyKalibrasiItem(0)])
          setNextId(1)
          setActiveId(0)
          setSharedData(initialKalibrasiSharedData)
          setStep(0)
        }
      } catch (err: any) {
        toast.error(err?.message || "Terjadi kesalahan saat menyimpan permohonan kalibrasi")
      } finally {
        setSubmitting(false)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    [items, sharedData, skemaId]
  )

  return (
    <div className="space-y-6">
      {/* Stepper Progress Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            const isActive = step === idx
            const isDone = step > idx

            return (
              <div
                key={s.id}
                className={`flex items-center gap-3.5 p-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-emerald-50/90 border border-emerald-300 ring-2 ring-emerald-500/20"
                    : isDone
                    ? "bg-teal-50/60 border border-teal-200"
                    : "bg-slate-50 border border-slate-200/60 opacity-60"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    isDone
                      ? "bg-teal-600 text-white shadow-xs"
                      : isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
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
                  <p className="text-[11px] text-slate-600 hidden sm:block truncate">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step 1: Daftar Alat & Instrumen */}
      {step === 0 && (
        <Step1DataAlatKalibrasi
          items={items}
          setItems={setItems}
          nextId={nextId}
          setNextId={setNextId}
          activeId={activeId}
          setActiveId={setActiveId}
          onNext={goNext}
        />
      )}

      {/* Step 2: Informasi Pengiriman & Pemohon */}
      {step === 1 && (
        <Step2InformasiPengiriman
          sharedData={sharedData}
          setSharedData={setSharedData}
          items={items}
          submitting={submitting}
          onBack={goBack}
          onSubmit={handleSubmitAll}
        />
      )}
    </div>
  )
}

export default FormKalibrasiWizard