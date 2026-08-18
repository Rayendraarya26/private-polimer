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
  const detail = profile?.detail
  const jenisPelanggan = detail?.type
  const isInstansi = jenisPelanggan !== ProfileClientType.PERORANGAN

  const { submitting, createPendaftaran } = usePelatihan()
  const { createPendaftaran: createPendaftaranLSP } = useLSP()

  const [step, setStep] = useState(0)
  const [nextId, setNextId] = useState(1)
  const [activeId, setActiveId] = useState(0)
  const [participants, setParticipants] = useState<ParticipantData[]>([emptyParticipant(0)])
  const [sharedData, setSharedData] = useState<SharedData>(initialSharedData)

  useEffect(() => {
    if (!detail) return
    if (jenisPelanggan === ProfileClientType.PERORANGAN) {
      setParticipants([
        {
          ...emptyParticipant(0),
          nama_lengkap: detail.nama || "",
          gender: detail.jenis_kelamin || "",
          tempat_lahir: detail.tempat_lahir || "",
          tanggal_lahir: detail.tanggal_lahir || "",
          pendidikan: detail.pendidikan_terakhir || "",
          whatsapp: detail.whatsapp || "",
          email: detail.surel || "",
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
    }
  }, [detail, jenisPelanggan])

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
        <StepDataPeserta
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
        <StepDataBersama
          sharedData={sharedData}
          setSharedData={setSharedData}
          participants={participants}
          setParticipants={setParticipants}
          jenisPelanggan={jenisPelanggan}
          detail={detail}
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