import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  Building2,
  UserCheck,
  FileCheck,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Check,
  RotateCcw,
  Save,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '../../ui/Button'
import { Modal } from '../../ui/Modal'
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
    desc: 'Kategori aset & periode pemanfaatan',
  },
  {
    id: 1,
    title: 'Identitas Pemohon',
    icon: UserCheck,
    desc: 'Data pemohon & penanggung jawab',
  },
  {
    id: 2,
    title: 'Pernyataan & Berkas',
    icon: FileCheck,
    desc: 'Surat permohonan & integritas',
  },
]

const STORAGE_KEY = 'DRAFT_PERMOHONAN_ASET'

export const FormAsetWizard: React.FC = () => {
  const navigate = useNavigate()
  const { data: profile } = useProfileQuery()
  const { isSubmitting, jenisSewaOptions, calculateDuration, createPermohonan } = useAset()

  const [formKey, setFormKey] = useState<number>(0)
  const [showResetModal, setShowResetModal] = useState<boolean>(false)

  // Inisialisasi state dari localStorage jika ada draf tersimpan
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.currentStep === 'number' && parsed.currentStep >= 0 && parsed.currentStep < STEPS.length) {
          return parsed.currentStep
        }
      }
    } catch (e) {
      console.error('Error loading draft currentStep:', e)
    }
    return 0
  })

  // Step 1 State
  const [jenisSewa, setJenisSewa] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.jenisSewa === 'string') return parsed.jenisSewa
      }
    } catch {}
    return ''
  })

  const [tanggalMulai, setTanggalMulai] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.tanggalMulai === 'string') return parsed.tanggalMulai
      }
    } catch {}
    return ''
  })

  const [tanggalSelesai, setTanggalSelesai] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.tanggalSelesai === 'string') return parsed.tanggalSelesai
      }
    } catch {}
    return ''
  })

  const [durasiHari, setDurasiHari] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.durasiHari === 'number') return parsed.durasiHari
      }
    } catch {}
    return 1
  })

  const [keperluanPenggunaan, setKeperluanPenggunaan] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.keperluanPenggunaan === 'string') return parsed.keperluanPenggunaan
      }
    } catch {}
    return ''
  })

  const [catatanTambahan, setCatatanTambahan] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.catatanTambahan === 'string') return parsed.catatanTambahan
      }
    } catch {}
    return ''
  })

  // Step 2 State
  const [pemohonNama, setPemohonNama] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.pemohonNama === 'string') return parsed.pemohonNama
      }
    } catch {}
    return ''
  })

  const [pemohonNikNib, setPemohonNikNib] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.pemohonNikNib === 'string') return parsed.pemohonNikNib
      }
    } catch {}
    return ''
  })

  const [pemohonAlamat, setPemohonAlamat] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.pemohonAlamat === 'string') return parsed.pemohonAlamat
      }
    } catch {}
    return ''
  })

  const [pemohonTelepon, setPemohonTelepon] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.pemohonTelepon === 'string') return parsed.pemohonTelepon
      }
    } catch {}
    return ''
  })

  const [pemohonEmail, setPemohonEmail] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.pemohonEmail === 'string') return parsed.pemohonEmail
      }
    } catch {}
    return ''
  })

  // Step 3 State
  const [fileSuratPermohonan, setFileSuratPermohonan] = useState<File | null>(null)
  const [setujuPernyataan, setSetujuPernyataan] = useState<boolean>(false)

  // Auto-fill profil akun jika state belum terisi
  const fillFromProfile = useCallback(() => {
    if (!profile) return
    const detail = (profile.detail || {}) as Record<string, any>
    setPemohonNama((prev) => prev || detail.nama || detail.nama_perusahaan || profile.name || '')
    setPemohonNikNib((prev) => prev || detail.nib || detail.nik || '')
    setPemohonAlamat((prev) => prev || detail.alamat || detail.alamat_perusahaan || profile.alamat || '')
    setPemohonTelepon((prev) => prev || detail.no_hp || detail.telepon || profile.whatsapp || '')
    setPemohonEmail((prev) => prev || profile.email || detail.email || (profile as any).surel || '')
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

  // Helper untuk mengecek apakah form sedang terisi data draf oleh user
  const checkIsFormFilled = (
    step: number,
    jenis: string,
    mulai: string,
    selesai: string,
    keperluan: string,
    catatan: string,
    pernyataan: boolean
  ): boolean => {
    if (step > 0) return true
    if (pernyataan) return true
    return Boolean(jenis || mulai || selesai || keperluan.trim() || catatan.trim())
  }

  // Status draf lokal
  const [hasDraft, setHasDraft] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (
          (typeof parsed.currentStep === 'number' && parsed.currentStep > 0) ||
          Boolean(parsed.jenisSewa) ||
          Boolean(parsed.tanggalMulai) ||
          Boolean(parsed.tanggalSelesai) ||
          Boolean(parsed.keperluanPenggunaan?.trim()) ||
          Boolean(parsed.catatanTambahan?.trim())
        ) {
          return true
        }
      }
    } catch (e) {
      console.error('Error reading draft status:', e)
    }
    return false
  })

  // Aktifkan hasDraft saat data mulai diisi oleh user
  useEffect(() => {
    if (!hasDraft) {
      const isFilled = checkIsFormFilled(
        currentStep,
        jenisSewa,
        tanggalMulai,
        tanggalSelesai,
        keperluanPenggunaan,
        catatanTambahan,
        setujuPernyataan
      )
      if (isFilled) {
        setHasDraft(true)
      }
    }
  }, [
    hasDraft,
    currentStep,
    jenisSewa,
    tanggalMulai,
    tanggalSelesai,
    keperluanPenggunaan,
    catatanTambahan,
    setujuPernyataan,
  ])

  // Simpan otomatis ke localStorage saat data berubah
  useEffect(() => {
    try {
      if (hasDraft) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            currentStep,
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
          })
        )
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('Gagal menyimpan draf sewa aset ke localStorage:', error)
    }
  }, [
    hasDraft,
    currentStep,
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
  ])

  // Handler: Hapus Draf dan Reset Formulir
  const confirmResetDraft = () => {
    setShowResetModal(false)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('Gagal menghapus draf sewa aset:', e)
    }
    setJenisSewa('')
    setTanggalMulai('')
    setTanggalSelesai('')
    setDurasiHari(1)
    setKeperluanPenggunaan('')
    setCatatanTambahan('')
    setFileSuratPermohonan(null)
    setSetujuPernyataan(false)
    setCurrentStep(0)
    setHasDraft(false)
    setFormKey((prev) => prev + 1)
    fillFromProfile()
    toast.success('Draf formulir berhasil direset.')
  }

  // Validasi langkah aktif
  const validateStep = (step: number): boolean => {
    if (step === 0) {
      if (!jenisSewa) {
        toast.error('Silakan pilih salah satu kategori fasilitas/aset yang ingin disewa')
        return false
      }
      if (!tanggalMulai) {
        toast.error('Silakan tentukan tanggal mulai pemanfaatan')
        return false
      }
      if (!tanggalSelesai) {
        toast.error('Silakan tentukan tanggal selesai pemanfaatan')
        return false
      }
      if (tanggalSelesai < tanggalMulai) {
        toast.error('Tanggal selesai tidak boleh lebih awal dari tanggal mulai')
        return false
      }
      if (!keperluanPenggunaan.trim()) {
        toast.error('Silakan jelaskan keperluan penggunaan fasilitas aset')
        return false
      }
    } else if (step === 1) {
      if (!pemohonNama.trim()) {
        toast.error('Nama pemohon wajib diisi')
        return false
      }
      if (!pemohonTelepon.trim()) {
        toast.error('Nomor telepon / WhatsApp pemohon wajib diisi')
        return false
      }
      if (!pemohonEmail.trim()) {
        toast.error('Alamat email pemohon wajib diisi')
        return false
      }
    }
    return true
  }

  // Navigasi Langkah
  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return
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

  // Submit Final atau Simpan Draft ke Server
  const handleSubmit = async (aksi: 'draft' | 'ajukan' = 'ajukan') => {
    const isAjukan = aksi === 'ajukan'

    if (isAjukan) {
      if (!validateStep(0) || !validateStep(1)) {
        return
      }
      if (!setujuPernyataan) {
        toast.error('Harap setujui pernyataan integritas dan tata tertib pemanfaatan aset')
        return
      }
    } else {
      // Validasi draft: cukup ada kategori jenis sewa atau nama pemohon
      if (!jenisSewa && !pemohonNama.trim()) {
        toast.error('Harap pilih jenis sewa aset atau isi nama pemohon untuk disimpan sebagai draft.')
        return
      }
    }

    try {
      await createPermohonan(
        {
          aksi,
          jenis_sewa: jenisSewa || 'sewa_lapangan',
          tanggal_mulai: tanggalMulai || new Date().toISOString().split('T')[0],
          tanggal_selesai: tanggalSelesai || new Date().toISOString().split('T')[0],
          durasi_hari: durasiHari || 1,
          keperluan_penggunaan: keperluanPenggunaan.trim() || (isAjukan ? '-' : 'Draft Pemanfaatan Aset'),
          catatan_tambahan: catatanTambahan,
          pemohon_nama: pemohonNama || 'Draft Pemohon',
          pemohon_nik_nib: pemohonNikNib,
          pemohon_alamat: pemohonAlamat,
          pemohon_telepon: pemohonTelepon,
          pemohon_email: pemohonEmail,
          file_surat_permohonan: fileSuratPermohonan,
          setuju_pernyataan: isAjukan ? true : Boolean(setujuPernyataan),
        },
        (res) => {
          // Hapus draf di storage lokal setelah sukses menyimpan ke backend
          try {
            localStorage.removeItem(STORAGE_KEY)
          } catch (e) {
            console.error('Gagal menghapus draf storage:', e)
          }
          setHasDraft(false)

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

  // Label jenis sewa terpilih untuk ringkasan di Step 3
  const selectedJenisSewaLabel = useMemo(() => {
    const found = jenisSewaOptions.find((o) => o.value === jenisSewa)
    return found ? found.label : jenisSewa
  }, [jenisSewaOptions, jenisSewa])

  return (
    <div className="space-y-4">
      {/* Tombol Reset Draft (Hanya muncul jika ada draf tersimpan) */}
      <div className={hasDraft ? 'flex justify-end -mb-1' : 'hidden'}>
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors cursor-pointer"
          title="Reset Seluruh Draf Formulir"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Draft</span>
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STEPS.map((s, idx) => {
            const isActive = currentStep === idx
            const isDone = currentStep > idx

            return (
              <button
                type="button"
                key={s.id}
                onClick={() => {
                  if (idx <= currentStep) {
                    setCurrentStep(idx)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-slate-50 border border-brand-600'
                    : isDone
                    ? 'bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer'
                    : 'bg-slate-50/40 border border-slate-200/60 opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{s.title}</p>
                  <p className="text-[11px] text-slate-500 truncate hidden sm:block">{s.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div key={`step-contents-${formKey}`}>
        <div className={currentStep === 0 ? 'block' : 'hidden'}>
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
        </div>

        <div className={currentStep === 1 ? 'block' : 'hidden'}>
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
        </div>

        <div className={currentStep === 2 ? 'block' : 'hidden'}>
          <Step3UnggahBerkasDanPernyataan
            fileSuratPermohonan={fileSuratPermohonan}
            setFileSuratPermohonan={setFileSuratPermohonan}
            setujuPernyataan={setujuPernyataan}
            setSetujuPernyataan={setSetujuPernyataan}
            summaryData={{
              jenisSewaLabel: selectedJenisSewaLabel,
              tanggalMulai,
              tanggalSelesai,
              durasiHari,
              keperluanPenggunaan,
              pemohonNama,
              pemohonNikNib,
              pemohonTelepon,
              pemohonEmail,
              pemohonAlamat,
            }}
          />
        </div>
      </div>

      {/* Wizard Navigation Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentStep === 0 ? 'Batal' : 'Sebelumnya'}
        </Button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tombol Simpan Draft ke Server (hanya tampil di langkah terakhir) */}
          {currentStep === STEPS.length - 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold border border-slate-200 shadow-2xs hover:bg-slate-100"
            >
              <Save className="w-4 h-4 text-slate-600" />
              <span>Simpan Draft</span>
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold shadow-sm"
            >
              Selanjutnya
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => handleSubmit('ajukan')}
              disabled={isSubmitting || !setujuPernyataan}
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-semibold shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Permohonan
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Reset Draf (Sesuai Tema Polimer) */}
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
            Seluruh data pilihan aset, jadwal pemanfaatan, identitas pemohon, dan berkas yang telah diisi akan dihapus dan kembali ke langkah awal.
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
