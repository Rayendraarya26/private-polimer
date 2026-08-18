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
  const detail = profile?.detail
  const jenisPelanggan = detail?.type
  const isInstansi = jenisPelanggan !== ProfileClientType.PERORANGAN
  const { submitting, createPendaftaran } = useLSP()

  const [step, setStep] = useState(0)
  const [nextId, setNextId] = useState(1)
  const [activeId, setActiveId] = useState(0)
  const [participants, setParticipants] = useState<ParticipantLSP[]>([emptyParticipantLSP(0)])
  const [sharedData, setSharedData] = useState<SharedDataLSP>(initialSharedDataLSP)

  useEffect(() => {
    if (!detail) return
    if (jenisPelanggan === ProfileClientType.PERORANGAN) {
      setParticipants([
        {
          ...emptyParticipantLSP(0),
          nama_lengkap: detail.nama || "",
          gender: detail.jenis_kelamin || "",
          tempat_lahir: detail.tempat_lahir || "",
          tanggal_lahir: detail.tanggal_lahir || "",
          pendidikan: detail.pendidikan_terakhir || "",
          nik_peserta: detail.nik ? String(detail.nik) : "",
          kewarganegaraan: detail.kewarganegaraan || "",
          whatsapp: detail.whatsapp || "",
          email: detail.surel || "",
          alamat_peserta: detail.alamat || "",
        },
      ])
    } else {
      setSharedData((prev) => ({
        ...prev,
        nama_instansi: detail.nama || "",
        alamat_instansi: detail.alamat || "",
      }))
    }
  }, [detail, jenisPelanggan])

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
                    ? "bg-brand-50/80 border border-brand-200 ring-2 ring-brand-500/20"
                    : isDone
                    ? "bg-emerald-50/60 border border-emerald-200"
                    : "bg-slate-50 border border-slate-200/60 opacity-60"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
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
                  <span className="text-[10px] font-bold tracking-wider uppercase block text-slate-600">
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

      {/* Step Content */}
      {step === 0 && (
        <StepDataPesertaLSP
          participants={participants}
          setParticipants={setParticipants}
          nextId={nextId}
          setNextId={setNextId}
          isInstansi={isInstansi}
          detail={detail}
          jenisPelanggan={jenisPelanggan}
          activeId={activeId}
          setActiveId={setActiveId}
          onNext={goNext}
        />
      )}

      {step === 1 && (
        <StepDataBersamaLSP
          sharedData={sharedData}
          setSharedData={setSharedData}
          jenisPelanggan={jenisPelanggan}
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
