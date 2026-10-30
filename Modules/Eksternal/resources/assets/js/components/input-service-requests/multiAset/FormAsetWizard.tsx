import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  Building2,
  User,
  UploadCloud,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Check,
} from 'lucide-react'
import { Button } from '../../ui/Button'
import { useAset } from '../../../hooks/service-requests/useAset'
import { useProfileQuery } from '../../../hooks/queries/useProfileQuery'
import { Step1JenisDanPeriode } from './Step1JenisDanPeriode'
import { Step2DataPemohon } from './Step2DataPemohon'
import { Step3UnggahBerkasDanPernyataan } from './Step3UnggahBerkasDanPernyataan'

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
  const { isSubmitting, jenisSewaOptions, calculateDuration, createPermohonan } = useAset()

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [maxStepReached, setMaxStepReached] = useState<number>(currentStep)

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
        (res) => {
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
    <div className="space-y-6">
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

      {/* Step Contents */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-soft">
        {currentStep === 0 && (
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
        )}

        {currentStep === 1 && (
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
        )}

        {currentStep === 2 && (
          <Step3UnggahBerkasDanPernyataan
            fileSuratPermohonan={fileSuratPermohonan}
            setFileSuratPermohonan={setFileSuratPermohonan}
            setujuPernyataan={setujuPernyataan}
            setSetujuPernyataan={setSetujuPernyataan}
          />
        )}

        {/* Wizard Action Buttons */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            disabled={isSubmitting}
          >
            {currentStep === 0 ? 'Batal' : 'Sebelumnya'}
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Lanjutkan
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-sm"
            >
              Kirim Permohonan Sewa Aset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormAsetWizard
