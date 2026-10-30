import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Button } from '../../ui/Button'
import {
  Building2,
  Boxes,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  Check,
} from 'lucide-react'
import { useProfileQuery } from '../../../hooks/queries/useProfileQuery'
import useRegions from '../../../hooks/profile/useRegions'
import { submitPermohonanPba, getPbaCatalog } from '../../../services/pba'
import { PbaProductItem } from '../../../types/pba'
import Step1PerusahaanDanPengiriman from './Step1PerusahaanDanPengiriman'
import Step2ProdukBahanAcuan from './Step2ProdukBahanAcuan'
import Step3BerkasDanKonfirmasi from './Step3BerkasDanKonfirmasi'

const TOTAL_STEPS = 3

const STEPS = [
  {
    id: 0,
    title: 'Perusahaan & Pengiriman',
    icon: Building2,
    desc: 'Identitas PT & alamat kirim material',
  },
  {
    id: 1,
    title: 'Produk Bahan Acuan',
    icon: Boxes,
    desc: 'Pilihan standar material & jumlah',
  },
  {
    id: 2,
    title: 'Berkas & Konfirmasi',
    icon: ShieldCheck,
    desc: 'Surat permohonan & integritas',
  },
]

export const FormPbaWizard: React.FC = () => {
  const navigate = useNavigate()
  const { data: profile } = useProfileQuery()

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [maxStepReached, setMaxStepReached] = useState<number>(currentStep)

  useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, currentStep))
  }, [currentStep])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Step 1 State: Perusahaan, Pengiriman, & PIC
  const [namaPerusahaan, setNamaPerusahaan] = useState<string>('')
  const [alamatPerusahaan, setAlamatPerusahaan] = useState<string>('')
  const [sameAsCompanyAddress, setSameAsCompanyAddress] = useState<boolean>(true)
  const [alamatPengiriman, setAlamatPengiriman] = useState<string>('')
  const [selectedProvId, setSelectedProvId] = useState<string>('')
  const [selectedKabId, setSelectedKabId] = useState<string>('')
  const [contactPerson, setContactPerson] = useState<string>('')
  const [noKontak, setNoKontak] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  // Query regions (cached TanStack Query)
  const { provinces, regencies, loading: loadingRegions } = useRegions(selectedProvId, selectedKabId)

  // Step 2 State: Produk & Kuantitas
  const [catalog, setCatalog] = useState<PbaProductItem[]>([])
  const [produkPesanan, setProdukPesanan] = useState<string>('Plastisitas')
  const [produkLainnya, setProdukLainnya] = useState<string>('')
  const [jumlah, setJumlah] = useState<number>(1)
  const [satuan, setSatuan] = useState<string>('Sampel/Unit')
  const [catatan, setCatatan] = useState<string>('')

  // Step 3 State: Berkas & Pernyataan
  const [fileSuratPermohonan, setFileSuratPermohonan] = useState<File | null>(null)
  const [pernyataanKonfirmasi, setPernyataanKonfirmasi] = useState<boolean>(false)

  // Auto-fill profil akun
  const fillFromProfile = useCallback(() => {
    if (!profile) return
    const detail = profile.detail || {}
    const companyName = detail.nama_perusahaan || detail.nama || profile.name || ''
    const companyAddr = detail.alamat_perusahaan || detail.alamat_kantor || detail.alamat || profile.alamat || ''
    const picName = detail.nama_pic || detail.nama_narahubung || profile.name || ''
    const picPhone = detail.no_hp || detail.telepon || profile.whatsapp || ''
    const picEmail = profile.email || detail.email || profile.surel || ''

    if (!namaPerusahaan) setNamaPerusahaan(companyName)
    if (!alamatPerusahaan) setAlamatPerusahaan(companyAddr)
    if (sameAsCompanyAddress && !alamatPengiriman) setAlamatPengiriman(companyAddr)
    if (!contactPerson) setContactPerson(picName)
    if (!noKontak) setNoKontak(picPhone)
    if (!email) setEmail(picEmail)

    if (detail.prov_id && !selectedProvId) {
      setSelectedProvId(String(detail.prov_id))
    }
    if (detail.kab_id && !selectedKabId) {
      setSelectedKabId(String(detail.kab_id))
    }
  }, [profile, sameAsCompanyAddress, namaPerusahaan, alamatPerusahaan, alamatPengiriman, contactPerson, noKontak, email, selectedProvId, selectedKabId])

  useEffect(() => {
    fillFromProfile()
  }, [fillFromProfile])

  // Sinkronisasi alamat pengiriman saat checkbox aktif
  useEffect(() => {
    if (sameAsCompanyAddress) {
      setAlamatPengiriman(alamatPerusahaan)
    }
  }, [sameAsCompanyAddress, alamatPerusahaan])

  // Fetch catalog on mount
  useEffect(() => {
    getPbaCatalog().then((items) => {
      setCatalog(items)
      if (items.length > 0 && !produkPesanan) {
        setProdukPesanan(items[0].nama)
      }
    })
  }, [])

  // Validasi navigasi antar step
  const validateStep = (stepIdx: number): boolean => {
    if (stepIdx === 0) {
      if (!namaPerusahaan.trim()) {
        toast.error('Silakan isi Nama Perusahaan')
        return false
      }
      if (!alamatPerusahaan.trim()) {
        toast.error('Silakan isi Alamat Perusahaan (Kantor/Legal)')
        return false
      }
      if (!alamatPengiriman.trim()) {
        toast.error('Silakan isi Alamat Tujuan Pengiriman Bahan Acuan')
        return false
      }
      if (!contactPerson.trim()) {
        toast.error('Silakan isi Nama Contact Person (PIC)')
        return false
      }
      if (!noKontak.trim()) {
        toast.error('Silakan isi Nomor WhatsApp/Telepon Contact Person')
        return false
      }
      if (!email.trim()) {
        toast.error('Silakan isi Email aktif Contact Person')
        return false
      }
    }

    if (stepIdx === 1) {
      if (!produkPesanan) {
        toast.error('Silakan pilih salah satu produk bahan acuan yang dipesan')
        return false
      }
      if (produkPesanan === 'Yang lain' && !produkLainnya.trim()) {
        toast.error('Silakan sebutkan spesifikasi bahan acuan yang diinginkan')
        return false
      }
      if (jumlah < 1) {
        toast.error('Jumlah pesanan minimal 1')
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return
    if (currentStep < TOTAL_STEPS - 1) {
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

  // Kirim permohonan ke backend
  const handleSubmit = async () => {
    if (!pernyataanKonfirmasi) {
      toast.error('Harap centang persetujuan dan konfirmasi pernyataan resmi!')
      return
    }

    const provObj = provinces.find((p) => String(p.id) === String(selectedProvId))
    const kabObj = regencies.find((k) => String(k.id) === String(selectedKabId))

    setIsSubmitting(true)
    try {
      const res = await submitPermohonanPba({
        nama_perusahaan: namaPerusahaan,
        alamat_perusahaan: alamatPerusahaan,
        alamat_pengiriman: alamatPengiriman,
        provinsi_id: selectedProvId || undefined,
        provinsi_nama: provObj?.nama || undefined,
        kabupaten_id: selectedKabId || undefined,
        kabupaten_nama: kabObj?.nama || undefined,
        contact_person: contactPerson,
        no_kontak: noKontak,
        email: email,
        produk_pesanan: produkPesanan,
        produk_lainnya: produkPesanan === 'Yang lain' ? produkLainnya : undefined,
        jumlah: jumlah,
        satuan: satuan,
        catatan: catatan,
        file_surat_permohonan: fileSuratPermohonan,
        pernyataan_konfirmasi: pernyataanKonfirmasi,
      })

      toast.success(res?.message || 'Permohonan Produsen Bahan Acuan berhasil diajukan!')
      const createdId = res?.data?.id
      if (createdId) {
        navigate(`/permohonan/detail/${createdId}`)
      } else {
        navigate('/permohonan')
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Gagal mengirim permohonan PBA.'
      toast.error(errMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const provSelectedName = provinces.find((p) => String(p.id) === String(selectedProvId))?.nama || '-'
  const kabSelectedName = regencies.find((k) => String(k.id) === String(selectedKabId))?.nama || '-'

  return (
    <div className="space-y-4">
      {/* ── STEPPER PROGRESS BAR (SERAGAM DENGAN FORMINSPEKSI / FORMPUP / FORMKALIBRASI) ── */}
      <nav aria-label="Langkah pengisian standar material" className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-none">
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
                  id={`stepper-pba-${idx + 1}`}
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

      {/* ── STEP CONTENTS (Kept in DOM with block/hidden to prevent state reset) ── */}
      <div className={currentStep === 0 ? 'block' : 'hidden'}>
        <Step1PerusahaanDanPengiriman
          namaPerusahaan={namaPerusahaan}
          setNamaPerusahaan={setNamaPerusahaan}
          alamatPerusahaan={alamatPerusahaan}
          setAlamatPerusahaan={setAlamatPerusahaan}
          sameAsCompanyAddress={sameAsCompanyAddress}
          setSameAsCompanyAddress={setSameAsCompanyAddress}
          alamatPengiriman={alamatPengiriman}
          setAlamatPengiriman={setAlamatPengiriman}
          selectedProvId={selectedProvId}
          setSelectedProvId={setSelectedProvId}
          selectedKabId={selectedKabId}
          setSelectedKabId={setSelectedKabId}
          provinces={provinces}
          regencies={regencies}
          loadingRegions={loadingRegions}
          contactPerson={contactPerson}
          setContactPerson={setContactPerson}
          noKontak={noKontak}
          setNoKontak={setNoKontak}
          email={email}
          setEmail={setEmail}
          onResetFromProfile={fillFromProfile}
        />
      </div>

      <div className={currentStep === 1 ? 'block' : 'hidden'}>
        <Step2ProdukBahanAcuan
          catalog={catalog}
          produkPesanan={produkPesanan}
          setProdukPesanan={setProdukPesanan}
          produkLainnya={produkLainnya}
          setProdukLainnya={setProdukLainnya}
          jumlah={jumlah}
          setJumlah={setJumlah}
          satuan={satuan}
          catatan={catatan}
          setCatatan={setCatatan}
        />
      </div>

      <div className={currentStep === 2 ? 'block' : 'hidden'}>
        <Step3BerkasDanKonfirmasi
          summaryData={{
            namaPerusahaan,
            alamatPerusahaan,
            alamatPengiriman,
            provSelectedName,
            kabSelectedName,
            contactPerson,
            noKontak,
            email,
            produkPesanan,
            produkLainnya,
            jumlah,
            satuan,
            catatan,
          }}
          fileSuratPermohonan={fileSuratPermohonan}
          setFileSuratPermohonan={setFileSuratPermohonan}
          pernyataanKonfirmasi={pernyataanKonfirmasi}
          setPernyataanKonfirmasi={setPernyataanKonfirmasi}
        />
      </div>

      {/* ── TOMBOL NAVIGASI BAWAH (SERAGAM DENGAN FORMINSPEKSI / FORMPUP / FORMKALIBRASI) ── */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isSubmitting}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="rounded-xl px-5 py-2.5 text-xs font-semibold border-slate-300 hover:bg-slate-50 text-slate-700"
        >
          {currentStep === 0 ? 'Batal' : 'Sebelumnya'}
        </Button>

        {currentStep < TOTAL_STEPS - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="rounded-xl px-6 py-2.5 text-xs font-semibold shadow-sm"
          >
            Selanjutnya
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !pernyataanKonfirmasi}
            leftIcon={
              isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )
            }
            className="rounded-xl px-7 py-2.5 text-xs font-semibold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? 'Mengirim Permohonan...' : 'Kirim Permohonan'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default FormPbaWizard
