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
  CheckCircle2,
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
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-soft">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon
            const isDone = currentStep > idx
            const isActive = currentStep === idx

            return (
              <div
                key={step.id}
                onClick={() => {
                  if (idx < currentStep) setCurrentStep(idx)
                }}
                className={`flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 p-2 rounded-xl transition-all ${
                  idx < currentStep ? 'cursor-pointer hover:bg-slate-50' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all font-bold text-xs ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isActive
                      ? 'bg-brand-600 text-white shadow-sm ring-4 ring-brand-500/20'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>

                <div className="text-center sm:text-left min-w-0 hidden sm:block">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isActive ? 'text-brand-700' : isDone ? 'text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

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
