import React, { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "react-hot-toast"
import useProfile from "../../../hooks/useProfile"
import usePelatihan from "../../../hooks/service-requests/usePelatihan"
import { usePelatihanDraft } from "../../../hooks/usePelatihanDraft"
import { ProfileClientType } from "../../../types/profile"
import {
  ParticipantData,
  SharedData,
  emptyParticipant,
  initialSharedData,
} from "../../../types/pelatihan"
import StepDataPeserta from "./StepDataPeserta"
import StepDataBersama from "./StepDataBersama"
import {
  Check,
  Users,
  Building2,
  Sparkles,
  Loader2,
  RotateCcw,
  AlertTriangle,
} from "lucide-react"
import { usePelatihanSkemaQuery } from "../../../hooks/queries/useMasterQuery"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { Modal } from "../../ui/Modal"
import { FormWizardActions } from "../../forms"
import { selectClass, FieldLabel } from "../common"

const STEPS = [
  { id: 0, title: "Pilih Program Pelatihan", icon: Sparkles, desc: "Tentukan topik kurikulum bimtek" },
  { id: 1, title: "Data Peserta Pelatihan", icon: Users, desc: "Biodata, KTP, dan foto peserta" },
  { id: 2, title: "Informasi Program & Persetujuan", icon: Building2, desc: "Kurikulum, data usaha, dan tagihan" },
]

interface Props {
  skemaId?: string
  initialSkemaId?: string
  kapabilitas?: number
}

const FormPelatihanWizard: React.FC<Props> = ({ skemaId, initialSkemaId, kapabilitas }) => {
  const MAX_SIZE = 3 * 1024 * 1024
  const { profile } = useProfile()
  const userId = profile?.id || "guest"
  const isInstansi = profile?.detail?.type !== ProfileClientType.PERORANGAN

  const { submitting, createPendaftaran } = usePelatihan()

  // ── IndexedDB Draft Hook ──
  const { existingDraft, autoSave, clearDraft, isSaving } = usePelatihanDraft(String(userId))
  const [showResetModal, setShowResetModal] = useState<boolean>(false)
  const draftClearedRef = useRef(false)
  const restoredRef = useRef(false)

  const [selectedSkema, setSelectedSkema] = useState<string>(skemaId || initialSkemaId || "")
  const { data: skemaList = [], isLoading: loadingSkema } = usePelatihanSkemaQuery()
  const selectedSkemaData = skemaList.find((s: any) => s.id === selectedSkema)
  const effectiveKapabilitas = kapabilitas ?? (selectedSkemaData?.kapabilitas ?? 0)

  const [step, setStep] = useState(0)
  const [maxStepReached, setMaxStepReached] = useState<number>(selectedSkema ? 1 : 0)

  useEffect(() => {
    if (selectedSkema) {
      setMaxStepReached((prev) => Math.max(prev, 1))
    }
  }, [selectedSkema])

  useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, step))
  }, [step])

  const [nextId, setNextId] = useState(1)
  const [activeId, setActiveId] = useState(0)
  const [participants, setParticipants] = useState<ParticipantData[]>([emptyParticipant(0)])
  const [sharedData, setSharedData] = useState<SharedData>(initialSharedData)

  // ── Restore Draft dari IndexedDB ──
  useEffect(() => {
    if (!existingDraft || restoredRef.current || draftClearedRef.current) return

    restoredRef.current = true
    const {
      step: savedStep,
      selectedSkema: savedSkema,
      participants: savedParticipants,
      sharedData: savedSharedData,
      nextId: savedNextId,
      activeId: savedActiveId,
    } = existingDraft

    const ensureFile = (f: any, defaultName: string = "dokumen.pdf"): File | null => {
      if (!f) return null
      if (f instanceof File) return f
      if (f instanceof Blob) return new File([f], (f as any).name || defaultName, { type: f.type })
      return null
    }

    if (savedSkema) {
      setSelectedSkema(savedSkema)
    }

    if (savedSharedData) {
      setSharedData((prev) => ({
        ...prev,
        ...savedSharedData,
      }))
    }

    if (Array.isArray(savedParticipants) && savedParticipants.length > 0) {
      const restoredParticipants = savedParticipants.map((p) => ({
        ...p,
        ktp_peserta: ensureFile(p.ktp_peserta, "ktp_peserta.pdf"),
        foto_peserta: ensureFile(p.foto_peserta, "foto_peserta.jpg"),
        ijazah: ensureFile(p.ijazah, "ijazah.pdf"),
        apl_01: ensureFile(p.apl_01, "apl_01.pdf"),
        apl_02: ensureFile(p.apl_02, "apl_02.pdf"),
        upload_lainya: ensureFile(p.upload_lainya, "dokumen_lainnya.pdf"),
      }))
      setParticipants(restoredParticipants)
    }

    if (typeof savedNextId === "number") setNextId(savedNextId)
    if (typeof savedActiveId === "number") setActiveId(savedActiveId)
    if (typeof savedStep === "number" && savedStep >= 0 && savedStep < STEPS.length) {
      setStep(savedStep)
    }
  }, [existingDraft])

  // ── Seed Awal dari Profil (jika belum ada draft) ──
  useEffect(() => {
    if (!profile || restoredRef.current) return
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
          nama_lengkap: detail.pj_nama || profile.name || detail.nama || "",
          gender: detail.jenis_kelamin || "",
          tempat_lahir: detail.tempat_lahir || "",
          tanggal_lahir: detail.tanggal_lahir || "",
          pendidikan: detail.pendidikan_terakhir || "",
          whatsapp: detail.pj_whatsapp || detail.whatsapp || "",
          email: detail.pj_surel || profile.email || detail.surel || "",
          nik_peserta: detail.nik ? String(detail.nik) : "",
          alamat_peserta: detail.alamat || "",
        },
      ])
    }
  }, [profile])

  // ── Cek Apakah Ada Konten Draft ──
  const hasDraftContent = Boolean(
    selectedSkema ||
    participants.some(
      (p) =>
        p.nama_lengkap ||
        p.nik_peserta ||
        p.whatsapp ||
        p.email ||
        p.ktp_peserta ||
        p.foto_peserta
    ) ||
    sharedData.nama_instansi ||
    sharedData.jenis_produk ||
    sharedData.masalah_materi ||
    sharedData.hal_dipelajari
  )

  // ── Auto-save ke IndexedDB secara otomatis ──
  useEffect(() => {
    if (draftClearedRef.current) return
    if (hasDraftContent) {
      autoSave({
        step,
        selectedSkema,
        participants,
        sharedData,
        nextId,
        activeId,
      })
    }
  }, [step, selectedSkema, participants, sharedData, nextId, activeId, autoSave, hasDraftContent])

  useEffect(() => {
    if (!draftClearedRef.current) return
    if (hasDraftContent) {
      draftClearedRef.current = false
    }
  }, [hasDraftContent])

  // ── Reset Draft Formulir ──
  const confirmResetDraft = async () => {
    draftClearedRef.current = true
    restoredRef.current = false
    await clearDraft()
    setShowResetModal(false)

    setSelectedSkema(skemaId || initialSkemaId || "")
    setStep(0)
    setNextId(1)
    setActiveId(0)
    setSharedData(initialSharedData)

    if (profile?.detail) {
      const detail = profile.detail
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
            nama_lengkap: detail.pj_nama || profile.name || detail.nama || "",
            gender: detail.jenis_kelamin || "",
            tempat_lahir: detail.tempat_lahir || "",
            tanggal_lahir: detail.tanggal_lahir || "",
            pendidikan: detail.pendidikan_terakhir || "",
            whatsapp: detail.pj_whatsapp || detail.whatsapp || "",
            email: detail.pj_surel || profile.email || detail.surel || "",
            nik_peserta: detail.nik ? String(detail.nik) : "",
            alamat_peserta: detail.alamat || "",
          },
        ])
      }
    } else {
      setParticipants([emptyParticipant(0)])
    }
    toast.success("Draft permohonan pelatihan berhasil direset.")
  }

  // ───────────────────────── STEP NAVIGATION ─────────────────────────
  const handleNextFromSkema = () => {
    if (!selectedSkema) {
      toast.error("Silakan pilih program pelatihan terlebih dahulu")
      return
    }
    setStep(1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const validateFileSize = (file: File | null, label: string, index: number): boolean => {
    if (file && file.size > MAX_SIZE) {
      toast.error(`Peserta ${index + 1}: Ukuran file ${label} maksimal 3 MB`)
      return false
    }
    return true
  }

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
      if (!p.nik_peserta) {
        toast.error(`Peserta ${i + 1}: NIK belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.pendidikan) {
        toast.error(`Peserta ${i + 1}: Pendidikan belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.agama) {
        toast.error(`Peserta ${i + 1}: Agama belum dipilih`)
        setActiveId(p.id)
        return
      }
      if (!p.alamat_peserta) {
        toast.error(`Peserta ${i + 1}: Alamat Domisili belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.whatsapp) {
        toast.error(`Peserta ${i + 1}: No. WhatsApp belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.email) {
        toast.error(`Peserta ${i + 1}: Email belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.ktp_peserta) {
        toast.error(`Peserta ${i + 1}: Berkas KTP belum diunggah`)
        setActiveId(p.id)
        return
      }
      if (!p.foto_peserta) {
        toast.error(`Peserta ${i + 1}: Pas Foto belum diunggah`)
        setActiveId(p.id)
        return
      }
      if (!validateFileSize(p.ktp_peserta, "KTP", i)) return
      if (!validateFileSize(p.foto_peserta, "Pas Foto", i)) return
    }

    setStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // ───────────────────────── STEP 2 SUBMIT ─────────────────────────
  const handleSubmitAll = useCallback(
    async (aksi: "draft" | "ajukan") => {
      const finalSkemaId = selectedSkema || skemaId
      if (!finalSkemaId) {
        toast.error("Program pelatihan belum dipilih")
        setStep(0)
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
        toast.error("Jenis produk / sektor industri belum diisi")
        return
      }
      if (!sharedData.masalah_materi) {
        toast.error("Permasalahan materi belum diisi")
        return
      }
      if (!sharedData.hal_dipelajari) {
        toast.error("Hal yang dipelajari belum diisi")
        return
      }
      if (!sharedData.program) {
        toast.error("Paket program pelatihan belum dipilih")
        return
      }
      if (!sharedData.setuju_syarat) {
        toast.error("Anda harus menyetujui syarat dan ketentuan yang berlaku")
        return
      }

      const isUjiKompetensi =
        effectiveKapabilitas === 1 && sharedData.program === "Pelatihan dan Uji Kompetensi"

      if (isUjiKompetensi) {
        for (let i = 0; i < participants.length; i++) {
          const p = participants[i]
          if (!p.kewarganegaraan) {
            toast.error(`Peserta ${i + 1}: Kewarganegaraan belum diisi`)
            return
          }
          if (!p.jabatan) {
            toast.error(`Peserta ${i + 1}: Jabatan belum diisi`)
            return
          }
          if (!p.pengalaman_kerja) {
            toast.error(`Peserta ${i + 1}: Pengalaman kerja belum diisi`)
            return
          }
          if (!p.kode_pos) {
            toast.error(`Peserta ${i + 1}: Kode pos belum diisi`)
            return
          }
          if (!p.ijazah) {
            toast.error(`Peserta ${i + 1}: Berkas Ijazah belum diunggah`)
            return
          }
          if (!p.apl_01) {
            toast.error(`Peserta ${i + 1}: Berkas APL-01 belum diunggah`)
            return
          }
          if (!p.apl_02) {
            toast.error(`Peserta ${i + 1}: Berkas APL-02 belum diunggah`)
            return
          }
          if (!validateFileSize(p.ijazah, "Ijazah", i)) return
          if (!validateFileSize(p.apl_01, "APL-01", i)) return
          if (!validateFileSize(p.apl_02, "APL-02", i)) return
          if (!/^\d{5}$/.test(p.kode_pos || "")) {
            toast.error(`Peserta ${i + 1}: Kode pos harus 5 digit angka`)
            return
          }
        }
      }

      let success = false

      await createPendaftaran(
        {
          skema_id: finalSkemaId,
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
        },
        false,
        true
      )

      if (!success) return

      await clearDraft()
      draftClearedRef.current = true
      restoredRef.current = false

      toast.success(
        aksi === "draft"
          ? `${participants.length} peserta berhasil disimpan sebagai draft`
          : sharedData.billing_type === "split" && participants.length > 1
          ? `${participants.length} peserta pelatihan berhasil diajukan (tagihan terpisah)`
          : `${participants.length} peserta pelatihan berhasil diajukan`
      )

      setParticipants([emptyParticipant(0)])
      setNextId(1)
      setActiveId(0)
      setSharedData(initialSharedData)
      setStep(0)
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [participants, sharedData, selectedSkema, skemaId, effectiveKapabilitas, createPendaftaran, clearDraft]
  )

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

      {/* ── STEPBAR DILUAR / DI ATAS PILIH SKEMA ── */}
      <nav aria-label="Langkah pendaftaran pelatihan" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none">
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
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
                  className={`w-full h-full flex items-center gap-3 p-3 sm:p-3.5 rounded-xl text-left transition-all duration-200 select-none shadow-none focus:outline-none focus-visible:outline-none ${
                    isActive
                      ? "bg-white border border-brand-600 ring-1 ring-brand-600 shadow-none"
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

      {/* ── LANGKAH 1: PILIH PROGRAM PELATIHAN ── */}
      {step === 0 && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <Card className="border-brand-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    Pilih Program / Skema Pelatihan
                  </CardTitle>
                  <CardDescription>
                    Tentukan topik kurikulum bimtek atau pelatihan teknis yang ingin diikuti
                  </CardDescription>
                </div>
                {loadingSkema && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
              </div>
            </CardHeader>

            <CardContent className="py-8 sm:py-12">
              <div className="max-w-xl mx-auto w-full space-y-2">
                <FieldLabel required htmlFor="program_pelatihan">
                  Program Pelatihan
                </FieldLabel>
                <select
                  id="program_pelatihan"
                  value={selectedSkema}
                  onChange={(e) => setSelectedSkema(e.target.value)}
                  className={selectClass}
                >
                  <option value="">-- Pilih Program Bimbingan Teknis / Pelatihan --</option>
                  {skemaList.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.lingkup || item.nama}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Form Navigation Actions */}
          <FormWizardActions
            canGoBack={false}
            onNext={handleNextFromSkema}
            disabled={!selectedSkema}
            nextLabel="Selanjutnya"
          />
        </div>
      )}

      {/* ── LANGKAH 2: DATA PESERTA PELATIHAN ── */}
      {step === 1 && (
        <div className="animate-in fade-in-50 duration-200">
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
            onBack={() => {
              setStep(0)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            profile={profile}
            skemaName={selectedSkemaData?.lingkup || selectedSkemaData?.nama}
          />
        </div>
      )}

      {/* ── LANGKAH 3: INFORMASI PROGRAM & PERSETUJUAN ── */}
      {step === 2 && (
        <div className="animate-in fade-in-50 duration-200">
          <StepDataBersama
            sharedData={sharedData}
            setSharedData={setSharedData}
            participants={participants}
            setParticipants={setParticipants}
            jenisPelanggan={profile?.detail?.type}
            detail={profile?.detail}
            participantCount={participants.length}
            submitting={submitting}
            kapabilitas={effectiveKapabilitas}
            onBack={() => {
              setStep(1)
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            onSubmit={handleSubmitAll}
          />
        </div>
      )}

      {/* Modal Konfirmasi Reset Draft */}
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
            Seluruh data permohonan pelatihan bimtek, data peserta, dan berkas persyaratan yang telah diunggah akan dihapus dan kembali ke langkah awal.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowResetModal(false)}
              className="flex-1 rounded-xl py-2.5 text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirmResetDraft}
              className="flex-1 rounded-xl py-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition"
            >
              Ya, Reset Draft
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default FormPelatihanWizard
