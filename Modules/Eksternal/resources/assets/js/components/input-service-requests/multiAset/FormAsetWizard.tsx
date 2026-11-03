import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  Building2,
  User,
  UploadCloud,
  Check,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '../../ui/Button'
import { Modal } from '../../ui/Modal'
import { useAset } from '../../../hooks/service-requests/useAset'
import { useAsetDraft } from '../../../hooks/useAsetDraft'
import { useProfileQuery } from '../../../hooks/queries/useProfileQuery'
import { Step1JenisDanPeriode } from './Step1JenisDanPeriode'
import { Step2DataPemohon } from './Step2DataPemohon'
import { Step3UnggahBerkasDanPernyataan } from './Step3UnggahBerkasDanPernyataan'
import { StepPanel } from '../common'
import { FormWizardActions } from '../../forms'

const STEPS = [
  {
    id: 0,
    title: 'Fasilitas & Jadwal',
    icon: Building2,
    desc: 'Kategori aset & periode sewa',
  },
  {
    id: 1,
    title: 'Identitas Pemohon',
    icon: User,
    desc: 'Snapshot data pemohon',
  },
  {
    id: 2,
    title: 'Unggah Berkas',
    icon: UploadCloud,
    desc: 'Surat permohonan & pernyataan',
  },
]

export const FormAsetWizard: React.FC = () => {
  const navigate = useNavigate()
  const { data: profile } = useProfileQuery()
  const userId = profile?.id || (profile?.detail as any)?.id || 'guest'

  const { isSubmitting, jenisSewaOptions, calculateDuration, createPermohonan } = useAset()
  const { existingDraft, autoSave, saveManual, clearDraft, isSaving, lastSaved } = useAsetDraft(String(userId))

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [maxStepReached, setMaxStepReached] = useState<number>(currentStep)
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false)
  const [showResetModal, setShowResetModal] = useState<boolean>(false)
  const draftClearedRef = useRef<boolean>(false)
  const restoredRef = useRef<boolean>(false)

  useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, currentStep))
  }, [currentStep])

  // Step 1 State
  const [jenisSewa, setJenisSewa] = useState<string>('')
  const [tanggalMulai, setTanggalMulai] = useState<string>('')
  const [tanggalSelesai, setTanggalSelesai] = useState<string>('')
  const [durasiHari, setDurasiHari] = useState<number>(1)
  const [keperluanPenggunaan, setKeperluanPenggunaan] = useState<string>('')
  const [catatanTambahan, setCatatanTambahan] = useState<string>('')

  // Step 2 State
  const [pemohonNama, setPemohonNama] = useState<string>('')
  const [pemohonNikNib, setPemohonNikNib] = useState<string>('')
  const [pemohonAlamat, setPemohonAlamat] = useState<string>('')
  const [pemohonTelepon, setPemohonTelepon] = useState<string>('')
  const [pemohonEmail, setPemohonEmail] = useState<string>('')

  // Step 3 State
  const [fileSuratPermohonan, setFileSuratPermohonan] = useState<File | null>(null)
  const [setujuPernyataan, setSetujuPernyataan] = useState<boolean>(false)

  // Auto-fill profil akun
  const fillFromProfile = useCallback(() => {
    if (!profile) return
    const detail = profile.detail || {}
    setPemohonNama(detail.nama || detail.nama_perusahaan || profile.name || '')
    setPemohonNikNib(detail.nib || detail.nik || '')
    setPemohonAlamat(detail.alamat || detail.alamat_perusahaan || profile.alamat || '')
    setPemohonTelepon(detail.no_hp || detail.telepon || profile.whatsapp || '')
    setPemohonEmail(profile.email || detail.email || profile.surel || '')
  }, [profile])

  useEffect(() => {
    fillFromProfile()
  }, [fillFromProfile])

  // Hitung durasi saat tanggal berubah
  useEffect(() => {
    if (tanggalMulai && tanggalSelesai) {
      setDurasiHari(calculateDuration(tanggalMulai, tanggalSelesai))
    }
  }, [tanggalMulai, tanggalSelesai, calculateDuration])

  // Pulihkan data draf dari IndexedDB
  useEffect(() => {
    if (!existingDraft || restoredRef.current || draftClearedRef.current) return

    restoredRef.current = true
    if (existingDraft.jenisSewa) setJenisSewa(existingDraft.jenisSewa)
    if (existingDraft.tanggalMulai) setTanggalMulai(existingDraft.tanggalMulai)
    if (existingDraft.tanggalSelesai) setTanggalSelesai(existingDraft.tanggalSelesai)
    if (typeof existingDraft.durasiHari === 'number') setDurasiHari(existingDraft.durasiHari)
    if (existingDraft.keperluanPenggunaan) setKeperluanPenggunaan(existingDraft.keperluanPenggunaan)
    if (existingDraft.catatanTambahan) setCatatanTambahan(existingDraft.catatanTambahan)
    if (existingDraft.pemohonNama) setPemohonNama(existingDraft.pemohonNama)
    if (existingDraft.pemohonNikNib) setPemohonNikNib(existingDraft.pemohonNikNib)
    if (existingDraft.pemohonAlamat) setPemohonAlamat(existingDraft.pemohonAlamat)
    if (existingDraft.pemohonTelepon) setPemohonTelepon(existingDraft.pemohonTelepon)
    if (existingDraft.pemohonEmail) setPemohonEmail(existingDraft.pemohonEmail)
    if (existingDraft.fileSuratPermohonan) {
      if (existingDraft.fileSuratPermohonan instanceof File) {
        setFileSuratPermohonan(existingDraft.fileSuratPermohonan)
      } else if (existingDraft.fileSuratPermohonan instanceof Blob) {
        setFileSuratPermohonan(
          new File(
            [existingDraft.fileSuratPermohonan],
            (existingDraft.fileSuratPermohonan as any).name || 'surat_permohonan.pdf',
            { type: existingDraft.fileSuratPermohonan.type }
          )
        )
      }
    }
    if (typeof existingDraft.setujuPernyataan === 'boolean') {
      setSetujuPernyataan(existingDraft.setujuPernyataan)
    }
    const targetStep = typeof existingDraft.currentStep === 'number' ? existingDraft.currentStep : null
    if (targetStep !== null && targetStep >= 0 && targetStep < STEPS.length) {
      setCurrentStep(targetStep)
    }
  }, [existingDraft])

  // Cek apakah ada isian bermakna untuk draf
  const hasDraftContent = Boolean(
    jenisSewa ||
    tanggalMulai ||
    tanggalSelesai ||
    keperluanPenggunaan ||
    catatanTambahan ||
    fileSuratPermohonan
  )

  // Simpan otomatis ke IndexedDB
  useEffect(() => {
    if (draftClearedRef.current) return
    if (hasDraftContent) {
      autoSave({
        jenisSewa,
        tanggalMulai,
        tanggalSelesai,
        durasiHari,
        keperluanPenggunaan,
        catatanTambahan,
        pemohonNama,
        pemohonNikNib,
        pemohonAlamat,
        pemohonTelepon,
        pemohonEmail,
        fileSuratPermohonan,
        setujuPernyataan,
        currentStep,
      })
    }
  }, [
    jenisSewa,
    tanggalMulai,
    tanggalSelesai,
    durasiHari,
    keperluanPenggunaan,
    catatanTambahan,
    pemohonNama,
    pemohonNikNib,
    pemohonAlamat,
    pemohonTelepon,
    pemohonEmail,
    fileSuratPermohonan,
    setujuPernyataan,
    currentStep,
    autoSave,
    hasDraftContent,
  ])

  // Aktifkan kembali autosave jika user mengetik setelah reset
  useEffect(() => {
    if (!draftClearedRef.current) return
    if (hasDraftContent) {
      draftClearedRef.current = false
    }
  }, [hasDraftContent])

  // Reset Draf
  const confirmResetDraft = async () => {
    setShowResetModal(false)
    draftClearedRef.current = true
    restoredRef.current = true
    await clearDraft()
    setJenisSewa('')
    setTanggalMulai('')
    setTanggalSelesai('')
    setDurasiHari(1)
    setKeperluanPenggunaan('')
    setCatatanTambahan('')
    setFileSuratPermohonan(null)
    setSetujuPernyataan(false)
    setCurrentStep(0)
    setMaxStepReached(0)
    fillFromProfile()
    toast.success('Draf permohonan sewa aset berhasil direset.')
  }

  // Simpan Draf Manual
  const handleSaveDraftManual = async () => {
    setIsSavingDraft(true)
    try {
      const ok = await saveManual({
        jenisSewa,
        tanggalMulai,
        tanggalSelesai,
        durasiHari,
        keperluanPenggunaan,
        catatanTambahan,
        pemohonNama,
        pemohonNikNib,
        pemohonAlamat,
        pemohonTelepon,
        pemohonEmail,
        fileSuratPermohonan,
        setujuPernyataan,
        currentStep,
      })
      if (ok) {
        toast.success('Draf permohonan sewa aset berhasil disimpan ke browser!')
      } else {
        toast.error('Gagal menyimpan draf')
      }
    } finally {
      setIsSavingDraft(false)
    }
  }

  // Navigasi Langkah
  const handleNext = () => {
    if (currentStep === 0) {
      if (!jenisSewa) {
        toast.error('Silakan pilih salah satu kategori fasilitas/aset yang ingin disewa')
        return
      }
      if (!tanggalMulai) {
        toast.error('Silakan tentukan tanggal mulai sewa')
        return
      }
      if (!tanggalSelesai) {
        toast.error('Silakan tentukan tanggal selesai sewa')
        return
      }
      if (tanggalSelesai < tanggalMulai) {
        toast.error('Tanggal selesai tidak boleh lebih awal dari tanggal mulai')
        return
      }
      if (!keperluanPenggunaan.trim()) {
        toast.error('Silakan jelaskan keperluan penggunaan fasilitas aset')
        return
      }
    } else if (currentStep === 1) {
      if (!pemohonNama.trim()) {
        toast.error('Nama pemohon wajib diisi')
        return
      }
      if (!pemohonTelepon.trim()) {
        toast.error('Nomor telepon / WhatsApp pemohon wajib diisi')
        return
      }
      if (!pemohonEmail.trim()) {
        toast.error('Alamat email pemohon wajib diisi')
        return
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/permohonan')
    } else {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Submit Final
  const handleSubmit = async () => {
    if (!setujuPernyataan) {
      toast.error('Anda wajib menyetujui pernyataan integritas dan tata tertib pemanfaatan aset')
      return
    }

    try {
      await createPermohonan(
        {
          jenis_sewa: jenisSewa,
          tanggal_mulai: tanggalMulai,
          tanggal_selesai: tanggalSelesai,
          durasi_hari: durasiHari,
          keperluan_penggunaan: keperluanPenggunaan,
          catatan_tambahan: catatanTambahan,
          pemohon_nama: pemohonNama,
          pemohon_nik_nib: pemohonNikNib,
          pemohon_alamat: pemohonAlamat,
          pemohon_telepon: pemohonTelepon,
          pemohon_email: pemohonEmail,
          file_surat_permohonan: fileSuratPermohonan,
          setuju_pernyataan: setujuPernyataan,
        },
        async (res) => {
          draftClearedRef.current = true
          await clearDraft()
          const permohonanId = res?.id || res?.permohonan_id
          if (permohonanId) {
            navigate(`/permohonan/detail/${permohonanId}`)
          } else {
            navigate('/permohonan')
          }
        }
      )
    } catch {
      // Error sudah ditangani toast di hook useAset
    }
  }

  return (
    <div className="space-y-5">
      {/* Tombol Reset Draft & Status Autosave (Seragam Kalibrasi, Konsultasi & Sertifikasi) */}
      {hasDraftContent && (
        <div className="flex items-center justify-between -mb-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            {isSaving ? (
              <span className="text-brand-600 font-medium animate-pulse">Menyimpan draf...</span>
            ) : lastSaved ? (
              <span>Draf tersimpan di browser</span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer ml-auto"
            title="Reset seluruh draf formulir"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Draft</span>
          </button>
        </div>
      )}

      {/* Stepper Progress Bar */}
      <nav aria-label="Langkah pengisian sewa aset" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none">
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
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
                  id={`stepper-aset-${idx + 1}`}
                  disabled={!canNavigate}
                  aria-current={isActive ? "step" : undefined}
                  onFocus={(e) => e.currentTarget.blur()}
                  onClick={() => {
                    if (canNavigate) {
                      setCurrentStep(idx)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
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

      {/* Step Contents */}
      <div>
        {currentStep === 0 && (
          <StepPanel
            icon={Building2}
            title="Fasilitas & Jadwal Sewa"
            description="Pilih kategori aset atau fasilitas balai yang ingin disewa beserta periode pemanfaatannya."
          >
            <Step1JenisDanPeriode
              jenisSewa={jenisSewa}
              setJenisSewa={setJenisSewa}
              tanggalMulai={tanggalMulai}
              setTanggalMulai={setTanggalMulai}
              tanggalSelesai={tanggalSelesai}
              setTanggalSelesai={setTanggalSelesai}
              durasiHari={durasiHari}
              keperluanPenggunaan={keperluanPenggunaan}
              setKeperluanPenggunaan={setKeperluanPenggunaan}
              catatanTambahan={catatanTambahan}
              setCatatanTambahan={setCatatanTambahan}
              options={jenisSewaOptions}
            />
          </StepPanel>
        )}

        {currentStep === 1 && (
          <StepPanel
            icon={User}
            title="Identitas Pemohon"
            description="Data resmi pemohon atau penanggung jawab pemanfaatan fasilitas balai."
          >
            <Step2DataPemohon
              pemohonNama={pemohonNama}
              setPemohonNama={setPemohonNama}
              pemohonNikNib={pemohonNikNib}
              setPemohonNikNib={setPemohonNikNib}
              pemohonAlamat={pemohonAlamat}
              setPemohonAlamat={setPemohonAlamat}
              pemohonTelepon={pemohonTelepon}
              setPemohonTelepon={setPemohonTelepon}
              pemohonEmail={pemohonEmail}
              setPemohonEmail={setPemohonEmail}
              onResetFromProfile={fillFromProfile}
            />
          </StepPanel>
        )}

        {currentStep === 2 && (
          <StepPanel
            icon={UploadCloud}
            title="Unggah Berkas & Pernyataan"
            description="Unggah surat permohonan resmi dan konfirmasi persetujuan tata tertib pemanfaatan aset."
          >
            <Step3UnggahBerkasDanPernyataan
              fileSuratPermohonan={fileSuratPermohonan}
              setFileSuratPermohonan={setFileSuratPermohonan}
              setujuPernyataan={setujuPernyataan}
              setSetujuPernyataan={setSetujuPernyataan}
            />
          </StepPanel>
        )}
      </div>

      {/* Form Navigation Actions */}
      <FormWizardActions
        isSticky={false}
        canGoBack={true}
        backLabel={currentStep === 0 ? "Kembali" : "Sebelumnya"}
        onBack={handleBack}
        onNext={handleNext}
        onSaveDraft={currentStep === STEPS.length - 1 ? handleSaveDraftManual : undefined}
        isLastStep={currentStep === STEPS.length - 1}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSavingDraft={isSavingDraft}
        nextLabel="Selanjutnya"
        submitLabel="Kirim"
      />

      {/* Modal Konfirmasi Reset Draf */}
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
            Seluruh data pilihan fasilitas sewa, jadwal penggunaan, identitas pemohon, dan berkas yang telah diunggah akan dihapus dan kembali ke langkah awal.
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

export default FormAsetWizard

