import React, { useState, useEffect, useCallback } from "react"
import { toast } from "react-hot-toast"
import useProfile from "../../../hooks/useProfile"
import { useLSP } from "../../../hooks/service-requests/useLSP"
import { ProfileClientType } from "../../../types/profile"
import {
  ParticipantLSP,
  SharedDataLSP,
  emptyParticipantLSP,
  initialSharedDataLSP,
} from "../../../types/lsp"
import StepDataPesertaLSP from "./StepDataPesertaLSP"
import StepDataBersamaLSP from "./StepDataBersamaLSP"
import { Check, Users, Building2 } from "lucide-react"

const STEPS = [
  { id: 0, title: "Data Peserta Uji Kompetensi", icon: Users, desc: "Biodata dan unggah berkas APL" },
  { id: 1, title: "Data Instansi & Persetujuan", icon: Building2, desc: "Metode tagihan dan konfirmasi" },
]

interface Props {
  skemaId: string
}

const FormLSPWizard: React.FC<Props> = ({ skemaId }) => {
  const { profile } = useProfile()
  const isInstansi = profile?.detail?.type !== ProfileClientType.PERORANGAN
  const { submitting, createPendaftaran } = useLSP()

  const [step, setStep] = useState(0)
  const [maxStepReached, setMaxStepReached] = useState<number>(step)

  useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, step))
  }, [step])
  const [nextId, setNextId] = useState(1)
  const [activeId, setActiveId] = useState(0)
  const [participants, setParticipants] = useState<ParticipantLSP[]>([emptyParticipantLSP(0)])
  const [sharedData, setSharedData] = useState<SharedDataLSP>(initialSharedDataLSP)

  useEffect(() => {
    if (!profile) return
    const detail = profile.detail
    if (!detail) return
    const jenisPelanggan = detail.type

    if (jenisPelanggan === ProfileClientType.PERORANGAN) {
      setParticipants([
        {
          ...emptyParticipantLSP(0),
          nama_lengkap: detail.nama || profile.name || "",
          gender: detail.jenis_kelamin || "",
          tempat_lahir: detail.tempat_lahir || "",
          tanggal_lahir: detail.tanggal_lahir || "",
          pendidikan: detail.pendidikan_terakhir || "",
          nik_peserta: detail.nik ? String(detail.nik) : "",
          kewarganegaraan: detail.kewarganegaraan || "",
          whatsapp: detail.whatsapp || "",
          email: detail.surel || profile.email || "",
          alamat_peserta: detail.alamat || "",
        },
      ])
    } else {
      setSharedData((prev) => ({
        ...prev,
        nama_instansi: detail.nama || "",
        alamat_instansi: detail.alamat || "",
      }))
      setParticipants([
        {
          ...emptyParticipantLSP(0),
          nama_lengkap: profile.name || detail.nama || "",
          email: profile.email || detail.surel || "",
          whatsapp: detail.whatsapp || "",
        },
      ])
    }
  }, [profile])

  // ───────────────────────── STEP 1 VALIDATION ─────────────────────────
  const goNext = () => {
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i]

      if (!p.nama_lengkap) {
        toast.error(`Peserta ${i + 1}: Nama Lengkap belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.tempat_lahir) {
        toast.error(`Peserta ${i + 1}: Tempat Lahir belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.tanggal_lahir) {
        toast.error(`Peserta ${i + 1}: Tanggal Lahir belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.gender) {
        toast.error(`Peserta ${i + 1}: Jenis Kelamin belum dipilih`)
        setActiveId(p.id)
        return
      }
      if (!p.alamat_peserta) {
        toast.error(`Peserta ${i + 1}: Alamat belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.nik_peserta) {
        toast.error(`Peserta ${i + 1}: NIK belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.kewarganegaraan) {
        toast.error(`Peserta ${i + 1}: Kewarganegaraan belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.kode_pos) {
        toast.error(`Peserta ${i + 1}: Kode pos belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.pendidikan) {
        toast.error(`Peserta ${i + 1}: Pendidikan belum dipilih`)
        setActiveId(p.id)
        return
      }
      if (!p.whatsapp) {
        toast.error(`Peserta ${i + 1}: WhatsApp belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.email) {
        toast.error(`Peserta ${i + 1}: Email belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.jabatan) {
        toast.error(`Peserta ${i + 1}: Jabatan belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.pengalaman_kerja) {
        toast.error(`Peserta ${i + 1}: Pengalaman Kerja belum diisi`)
        setActiveId(p.id)
        return
      }

      if (!p.ktp_peserta) {
        toast.error(`Peserta ${i + 1}: KTP wajib diupload`)
        setActiveId(p.id)
        return
      }
      if (!p.ijazah) {
        toast.error(`Peserta ${i + 1}: Ijazah wajib diupload`)
        setActiveId(p.id)
        return
      }
      if (!p.apl_01) {
        toast.error(`Peserta ${i + 1}: APL-01 wajib diupload`)
        setActiveId(p.id)
        return
      }
      if (!p.apl_02) {
        toast.error(`Peserta ${i + 1}: APL-02 wajib diupload`)
        setActiveId(p.id)
        return
      }

      if (!/^\d{5}$/.test(p.kode_pos || "")) {
        toast.error(`Peserta ${i + 1}: Kode pos harus 5 digit`)
        setActiveId(p.id)
        return
      }

      if (p.nik_peserta && !/^\d{16}$/.test(p.nik_peserta)) {
        toast.error(`Peserta ${i + 1}: NIK harus 16 digit`)
        setActiveId(p.id)
        return
      }

      if (
        p.whatsapp &&
        !/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(p.whatsapp.trim())
      ) {
        toast.error(`Peserta ${i + 1}: Nomor WhatsApp tidak valid`)
        setActiveId(p.id)
        return
      }

      if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
        toast.error(`Peserta ${i + 1}: Format email tidak valid`)
        setActiveId(p.id)
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

  // ───────────────────────── STEP 2 SUBMIT ─────────────────────────
  const handleSubmitAll = useCallback(
    async (aksi: "draft" | "ajukan") => {
      if (!skemaId) {
        toast.error("Skema belum dipilih")
        return
      }

      if (!sharedData.nama_instansi) {
        toast.error("Nama usaha / instansi belum diisi")
        return
      }

      if (!sharedData.alamat_instansi) {
        toast.error("Alamat usaha / instansi belum diisi")
        return
      }

      if (!sharedData.jenis_produk) {
        toast.error("Jenis Bidang Industri belum diisi")
        return
      }

      if (!sharedData.setuju_syarat) {
        toast.error("Anda harus menyetujui syarat dan ketentuan yang berlaku")
        return
      }

      let success = false

      await createPendaftaran(
        {
          nama_instansi: sharedData.nama_instansi,
          alamat_instansi: sharedData.alamat_instansi,
          jenis_produk: sharedData.jenis_produk,
          setuju_syarat: sharedData.setuju_syarat,
          billing_type: participants.length > 1 ? sharedData.billing_type : "together",
          skema_id: skemaId,
          aksi,
          participants,
        },
        () => {
          success = true
        },
        false,
        true
      )

      if (!success) return

      toast.success(
        aksi === "draft"
          ? `${participants.length} peserta berhasil disimpan sebagai draft`
          : sharedData.billing_type === "split" && participants.length > 1
          ? `${participants.length} peserta berhasil diajukan (tagihan terpisah)`
          : `${participants.length} peserta berhasil diajukan`
      )

      setParticipants([emptyParticipantLSP(0)])
      setNextId(1)
      setActiveId(0)
      setSharedData(initialSharedDataLSP)
      setStep(0)
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [participants, sharedData, skemaId, createPendaftaran]
  )

  return (
    <div className="space-y-6">
      {/* Modern Stepper Indicator */}
      <nav aria-label="Langkah sertifikasi profesi LSP" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
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
                  id={`stepper-lsp-${idx + 1}`}
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
                  className={`w-full h-full flex items-center gap-3 p-3 sm:p-3.5 rounded-xl text-left transition-all duration-200 select-none shadow-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 ${
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

      {/* Step Content */}
      {step === 0 && (
        <StepDataPesertaLSP
          participants={participants}
          setParticipants={setParticipants}
          nextId={nextId}
          setNextId={setNextId}
          isInstansi={isInstansi}
          detail={profile?.detail}
          jenisPelanggan={profile?.detail?.type}
          activeId={activeId}
          setActiveId={setActiveId}
          onNext={goNext}
          profile={profile}
        />
      )}

      {step === 1 && (
        <StepDataBersamaLSP
          sharedData={sharedData}
          setSharedData={setSharedData}
          jenisPelanggan={profile?.detail?.type}
          participantCount={participants.length}
          submitting={submitting}
          onBack={goBack}
          onSubmit={handleSubmitAll}
        />
      )}
    </div>
  )
}

export default FormLSPWizard
