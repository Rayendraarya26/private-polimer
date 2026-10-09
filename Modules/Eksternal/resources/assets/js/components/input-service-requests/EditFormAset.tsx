import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Swal from 'sweetalert2'
import api from '../../utils/api'
import Head from '../common/Head'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import {
  Loader2,
  ArrowLeft,
  Send,
  Save,
  Building2,
  Calendar,
  User,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Step1JenisDanPeriode } from './multiAset/Step1JenisDanPeriode'
import { Step2DataPemohon } from './multiAset/Step2DataPemohon'
import { Step3UnggahBerkasDanPernyataan } from './multiAset/Step3UnggahBerkasDanPernyataan'
import { useAset } from '../../hooks/service-requests/useAset'

export const EditFormAset: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { jenisSewaOptions, calculateDuration, updatePermohonan, ajukanUlang } = useAset()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [permohonan, setPermohonan] = useState<any>(null)

  // Form State
  const [jenisSewa, setJenisSewa] = useState<string>('')
  const [tanggalMulai, setTanggalMulai] = useState<string>('')
  const [tanggalSelesai, setTanggalSelesai] = useState<string>('')
  const [durasiHari, setDurasiHari] = useState<number>(1)
  const [keperluanPenggunaan, setKeperluanPenggunaan] = useState<string>('')
  const [catatanTambahan, setCatatanTambahan] = useState<string>('')

  const [pemohonNama, setPemohonNama] = useState<string>('')
  const [pemohonNikNib, setPemohonNikNib] = useState<string>('')
  const [pemohonAlamat, setPemohonAlamat] = useState<string>('')
  const [pemohonTelepon, setPemohonTelepon] = useState<string>('')
  const [pemohonEmail, setPemohonEmail] = useState<string>('')

  const [fileSuratPermohonan, setFileSuratPermohonan] = useState<File | null>(null)
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null)
  const [setujuPernyataan, setSetujuPernyataan] = useState<boolean>(true)

  // Fetch Data Aset Existing
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/eksternal/aset/${id}`)
        const asetData = res?.data?.data || res?.data?.results || res?.data

        if (!asetData) {
          toast.error('Data permohonan sewa aset tidak ditemukan')
          navigate('/permohonan')
          return
        }

        setPermohonan(asetData.permohonan || asetData)
        setJenisSewa(asetData.jenis_sewa || '')
        setTanggalMulai(asetData.tanggal_mulai ? String(asetData.tanggal_mulai).split('T')[0] : '')
        setTanggalSelesai(asetData.tanggal_selesai ? String(asetData.tanggal_selesai).split('T')[0] : '')
        setDurasiHari(asetData.durasi_hari || 1)
        setKeperluanPenggunaan(asetData.keperluan_penggunaan || '')
        setCatatanTambahan(asetData.catatan_tambahan || '')

        setPemohonNama(asetData.pemohon_nama || '')
        setPemohonNikNib(asetData.pemohon_nik_nib || '')
        setPemohonAlamat(asetData.pemohon_alamat || '')
        setPemohonTelepon(asetData.pemohon_telepon || '')
        setPemohonEmail(asetData.pemohon_email || '')

        setExistingFileUrl(asetData.file_surat_permohonan || null)
        setSetujuPernyataan(Boolean(asetData.setuju_pernyataan ?? true))
      } catch (err: any) {
        console.error('Gagal mengambil data sewa aset:', err)
        toast.error(err?.response?.data?.message || 'Gagal mengambil data permohonan')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, navigate])

  // Recalculate duration
  useEffect(() => {
    if (tanggalMulai && tanggalSelesai) {
      setDurasiHari(calculateDuration(tanggalMulai, tanggalSelesai))
    }
  }, [tanggalMulai, tanggalSelesai, calculateDuration])

  // Save changes
  const handleSave = async (andSubmit = false) => {
    if (!jenisSewa) {
      toast.error('Kategori fasilitas aset wajib dipilih')
      return
    }
    if (!tanggalMulai || !tanggalSelesai) {
      toast.error('Tanggal mulai dan selesai sewa wajib diisi')
      return
    }
    if (!keperluanPenggunaan.trim()) {
      toast.error('Keperluan penggunaan wajib diisi')
      return
    }
    if (!pemohonNama.trim() || !pemohonTelepon.trim() || !pemohonEmail.trim()) {
      toast.error('Identitas nama, telepon, dan email pemohon wajib diisi')
      return
    }

    try {
      setSubmitting(true)
      await updatePermohonan(id!, {
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
      })

      if (andSubmit) {
        await ajukanUlang(id!)
      }

      navigate(`/permohonan/detail/${id}`)
    } catch {
      // Error handled by hook
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-xs text-slate-500 font-medium">Memuat data permohonan sewa aset...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <Head title={`Perbaikan Permohonan Sewa Aset — ${permohonan?.no_permohonan || id}`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>Mode Perbaikan / Revisi Permohonan</span>
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-600" />
            <span>Koreksi Permohonan Sewa Aset Balai</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Nomor: <span className="font-mono font-bold text-slate-800">{permohonan?.no_permohonan || id}</span>
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate(`/permohonan/detail/${id}`)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0"
        >
          Kembali ke Detail
        </Button>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: 0, label: '1. Fasilitas & Jadwal' },
          { id: 1, label: '2. Identitas Pemohon' },
          { id: 2, label: '3. Berkas & Pernyataan' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-brand-600 text-brand-700 bg-brand-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-soft">
        {activeTab === 0 && (
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

        {activeTab === 1 && (
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
          />
        )}

        {activeTab === 2 && (
          <Step3UnggahBerkasDanPernyataan
            fileSuratPermohonan={fileSuratPermohonan}
            setFileSuratPermohonan={setFileSuratPermohonan}
            setujuPernyataan={setujuPernyataan}
            setSetujuPernyataan={setSetujuPernyataan}
            existingFileUrl={existingFileUrl}
          />
        )}

        {/* Action Buttons */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/permohonan/detail/${id}`)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            disabled={submitting}
          >
            Batal
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSave(false)}
              isLoading={submitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Simpan Draf Perubahan
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => handleSave(true)}
              isLoading={submitting}
              leftIcon={<Send className="w-4 h-4" />}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-xs"
            >
              Simpan & Ajukan Ulang
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditFormAset
