import React, { useState, useEffect, useCallback } from "react"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import useProfile from "../../../hooks/useProfile"
import usePelatihan from "../../../hooks/service-requests/usePelatihan"
import { useLSP } from "../../../hooks/service-requests/useLSP"
import { ProfileClientType } from "../../../types/profile"
import {
  ParticipantData,
  SharedData,
  emptyParticipant,
  initialSharedData,
} from "../../../types/pelatihan"
import StepDataPeserta from "./StepDataPeserta"
import StepDataBersama from "./StepDataBersama"
import { Check, Users, Building2 } from "lucide-react"

const STEPS = [
  { id: 0, title: "Data Peserta Pelatihan", icon: Users, desc: "Biodata, KTP, dan foto peserta" },
  { id: 1, title: "Informasi Program & Persetujuan", icon: Building2, desc: "Kurikulum, data usaha, dan tagihan" },
]

interface Props {
  skemaId: string
  kapabilitas: number
}

const FormPelatihanWizard: React.FC<Props> = ({ skemaId, kapabilitas }) => {
  const MAX_SIZE = 3 * 1024 * 1024
  const { profile } = useProfile()
  const isInstansi = profile?.detail?.type !== ProfileClientType.PERORANGAN

  const { submitting, createPendaftaran } = usePelatihan()
  const { createPendaftaran: createPendaftaranLSP } = useLSP()

  const [step, setStep] = useState(0)
  const [maxStepReached, setMaxStepReached] = useState<number>(step)

  useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, step))
  }, [step])
  const [nextId, setNextId] = useState(1)
  const [activeId, setActiveId] = useState(0)
  const [participants, setParticipants] = useState<ParticipantData[]>([emptyParticipant(0)])
  const [sharedData, setSharedData] = useState<SharedData>(initialSharedData)

  useEffect(() => {
    if (!profile) return
    const detail = profile.detail
    if (!detail) return
    const jenisPelanggan = detail.type

    if (jenisPelanggan === ProfileClientType.PERORANGAN) {
      setParticipants([
        {
          ...emptyParticipant(0),
          nama_lengkap: detail.nama || profile.name || "",
          gender: detail.jenis_kelamin || "",
          tempat_lahir: detail.tempat_lahir || "",
          tanggal_lahir: detail.tanggal_lahir || "",
          pendidikan: detail.pendidikan_terakhir || "",
          whatsapp: detail.whatsapp || "",
          email: detail.surel || profile.email || "",
          nik_peserta: detail.nik ? String(detail.nik) : "",
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
          ...emptyParticipant(0),
          nama_lengkap: profile.name || detail.nama || "",
          email: profile.email || detail.surel || "",
          whatsapp: detail.whatsapp || "",
        },
      ])
    }
  }, [profile])

  const validateFileSize = (
    file: File | null | undefined,
    label: string,
    participantIndex: number
  ) => {
    if (!file) return true
    if (file.size > MAX_SIZE) {
      toast.error(`Peserta ${participantIndex + 1}: ${label} maksimal 3 MB`)
      return false
    }
    return true
  }

  const goNext = () => {
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i]
      if (!p.nama_lengkap) {
        toast.error(`Peserta ${i + 1}: Nama Lengkap belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.gender) {
        toast.error(`Peserta ${i + 1}: Jenis Kelamin belum dipilih`)
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
      if (!p.pendidikan) {
        toast.error(`Peserta ${i + 1}: Pendidikan belum dipilih`)
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
      if (!p.email) {
        toast.error(`Peserta ${i + 1}: Email belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.nik_peserta) {
        toast.error(`Peserta ${i + 1}: NIK belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.agama) {
        toast.error(`Peserta ${i + 1}: Agama belum dipilih`)
        setActiveId(p.id)
        return
      }
      if (!p.alamat_peserta) {
        toast.error(`Peserta ${i + 1}: Alamat belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.ktp_peserta) {
        toast.error(`Peserta ${i + 1}: Upload KTP belum dilakukan`)
        setActiveId(p.id)
        return
      }
      if (!p.foto_peserta) {
        toast.error(`Peserta ${i + 1}: Upload Foto belum dilakukan`)
        setActiveId(p.id)
        return
      }
      if (!validateFileSize(p.ktp_peserta, "KTP", i)) {
        setActiveId(p.id)
        return
      }
      if (!validateFileSize(p.foto_peserta, "Foto", i)) {
        setActiveId(p.id)
        return
      }
      if (!/^\d{16}$/.test(p.nik_peserta)) {
        toast.error(`Peserta ${i + 1}: NIK harus 16 digit`)
        setActiveId(p.id)
        return
      }
      if (
        p.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)
      ) {
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

  const handleSubmitAll = useCallback(
    async (aksi: "draft" | "ajukan") => {
      const isUjiKompetensi =
        Number(kapabilitas) === 1 &&
        sharedData.program === "Pelatihan dan Uji Kompetensi"

      for (let i = 0; i < participants.length; i++) {
        const p = participants[i]
        if (!sharedData.nama_instansi) return toast.error("Nama usaha / instansi belum diisi")
        if (!sharedData.alamat_instansi) return toast.error("Alamat belum diisi")
        if (!sharedData.jenis_produk) return toast.error("Jenis produk belum diisi")
        if (!sharedData.masalah_materi) return toast.error("Permasalahan materi belum diisi")
        if (!sharedData.hal_dipelajari) return toast.error("Hal yang dipelajari belum diisi")
        if (!sharedData.program) return toast.error("Program belum dipilih")
        if (!sharedData.setuju_syarat) return toast.error("Persetujuan syarat belum dicentang")

        if (isUjiKompetensi) {
          if (!p.kewarganegaraan) return toast.error(`Peserta ${i + 1}: Kewarganegaraan belum diisi`)
          if (!p.jabatan) return toast.error(`Peserta ${i + 1}: Jabatan belum diisi`)
          if (!p.pengalaman_kerja) return toast.error(`Peserta ${i + 1}: Pengalaman kerja belum diisi`)
          if (!p.kode_pos) return toast.error(`Peserta ${i + 1}: Kode pos belum diisi`)
          if (!p.ijazah) return toast.error(`Peserta ${i + 1}: Ijazah belum diupload`)
          if (!p.apl_01) return toast.error(`Peserta ${i + 1}: APL-01 belum diupload`)
          if (!p.apl_02) return toast.error(`Peserta ${i + 1}: APL-02 belum diupload`)
          if (!validateFileSize(p.ijazah, "Ijazah", i)) return
          if (!validateFileSize(p.apl_01, "APL-01", i)) return
          if (!validateFileSize(p.apl_02, "APL-02", i)) return
          if (!/^\d{5}$/.test(p.kode_pos || "")) return toast.error(`Peserta ${i + 1}: Kode pos tidak valid`)
        }
      }

      const confirm = await Swal.fire({
        title: "Konfirmasi Pengajuan",
        text: `Apakah Anda yakin ingin ${aksi === "draft" ? "menyimpan draft" : "mengajukan"} pendaftaran pelatihan untuk ${participants.length} peserta?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0284c7",
        cancelButtonColor: "#94a3b8",
        confirmButtonText: aksi === "draft" ? "Ya, Simpan Draft" : "Ya, Ajukan Sekarang",
        cancelButtonText: "Periksa Kembali",
        reverseButtons: true,
      })

      if (!confirm.isConfirmed) return
      let success = false

      await createPendaftaran(
        {
          skema_id: skemaId,
          nama_instansi: sharedData.nama_instansi,
          alamat_instansi: sharedData.alamat_instansi,
          jenis_produk: sharedData.jenis_produk,
          masalah_materi: sharedData.masalah_materi,
          hal_dipelajari: sharedData.hal_dipelajari,
          program: sharedData.program,
          setuju_syarat: sharedData.setuju_syarat,
          billing_type: participants.length > 1 ? sharedData.billing_type : "together",
          aksi,
          participants,
        },
        () => {
          success = true
        }
      )

      if (!success) return

      toast.success(
        aksi === "draft"
          ? `${participants.length} peserta berhasil disimpan sebagai draft`
          : `${participants.length} peserta pelatihan berhasil diajukan`
      )

      setParticipants([emptyParticipant(0)])
      setNextId(1)
      setActiveId(0)
      setSharedData(initialSharedData)
      setStep(0)
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [participants, sharedData, skemaId, kapabilitas, createPendaftaran]
  )

  return (
    <div className="space-y-6">
      {/* Stepper Indicator */}
      <nav aria-label="Langkah pendaftaran pelatihan" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none">
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
                  id={`stepper-pelatihan-${idx + 1}`}
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

      {/* Step Content */}
      {step === 0 && (
        <StepDataPeserta
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
        <StepDataBersama
          sharedData={sharedData}
          setSharedData={setSharedData}
          participants={participants}
          setParticipants={setParticipants}
          jenisPelanggan={profile?.detail?.type}
          detail={profile?.detail}
          participantCount={participants.length}
          submitting={submitting}
          kapabilitas={kapabilitas}
          onBack={goBack}
          onSubmit={handleSubmitAll}
        />
      )}
    </div>
  )
}

export default FormPelatihanWizard