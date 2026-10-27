import React from 'react'
import {
  Building2,
  Calendar,
  Clock,
  Car,
  Layers,
  Wrench,
} from 'lucide-react'
import { JenisSewaOption } from '../../../types/aset'
import { Card, CardContent } from '../../ui/Card'
import { FormField, DateInput, TextareaInput } from '../../forms'

interface Step1JenisDanPeriodeProps {
  jenisSewa: string
  setJenisSewa: (val: string) => void
  tanggalMulai: string
  setTanggalMulai: (val: string) => void
  tanggalSelesai: string
  setTanggalSelesai: (val: string) => void
  durasiHari: number
  keperluanPenggunaan: string
  setKeperluanPenggunaan: (val: string) => void
  catatanTambahan: string
  setCatatanTambahan: (val: string) => void
  options: JenisSewaOption[]
}

const getAsetIcon = (val: string) => {
  switch (val) {
    case 'sewa_lapangan':
      return <Layers className="w-5 h-5 text-emerald-600" />
    case 'sewa_bangunan':
      return <Building2 className="w-5 h-5 text-indigo-600" />
    case 'sewa_alat':
      return <Wrench className="w-5 h-5 text-amber-600" />
    case 'sewa_mobil':
      return <Car className="w-5 h-5 text-sky-600" />
    case 'sewa_ruangan':
      return <Building2 className="w-5 h-5 text-violet-600" />
    default:
      return <Building2 className="w-5 h-5 text-brand-600" />
  }
}

export const Step1JenisDanPeriode: React.FC<Step1JenisDanPeriodeProps> = ({
  jenisSewa,
  setJenisSewa,
  tanggalMulai,
  setTanggalMulai,
  tanggalSelesai,
  setTanggalSelesai,
  durasiHari,
  keperluanPenggunaan,
  setKeperluanPenggunaan,
  catatanTambahan,
  setCatatanTambahan,
  options,
}) => {
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. Pilihan Jenis Sewa Aset */}
      <div>
        <label className="block text-sm font-bold text-slate-800 mb-1">
          Pilih Kategori Fasilitas / Aset Balai <span className="text-rose-500">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Tentukan aset fisik atau fasilitas milik BBSPJIKKP yang ingin Anda sewa/manfaatkan.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {options.map((opt) => {
            const isSelected = jenisSewa === opt.value
            return (
              <div
                key={opt.value}
                onClick={() => setJenisSewa(opt.value)}
                className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between min-h-[110px] ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-white shadow-xs' : 'bg-slate-100'}`}>
                    {getAsetIcon(opt.value)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{opt.label}</h4>
                    {opt.desc && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {opt.desc}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={isSelected ? 'font-semibold text-brand-700' : 'text-slate-400'}>
                    {isSelected ? '✓ Terpilih' : 'Pilih Fasilitas'}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Periode Sewa & Kalkulasi Durasi */}
      <Card className="rounded-xl border-slate-200 bg-slate-50/50 overflow-hidden">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
            <Calendar className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-800">Jadwal & Periode Pemanfaatan</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
            <FormField label="Tanggal Mulai" required>
              <DateInput
                min={todayStr}
                value={tanggalMulai}
                onChange={(e) => {
                  setTanggalMulai(e.target.value)
                  if (tanggalSelesai && e.target.value > tanggalSelesai) {
                    setTanggalSelesai(e.target.value)
                  }
                }}
              />
            </FormField>

            <FormField label="Tanggal Selesai" required>
              <DateInput
                min={tanggalMulai || todayStr}
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
              />
            </FormField>

            <FormField label="Estimasi Durasi">
              <div className="flex items-center gap-2 px-3.5 min-h-[42px] bg-white border border-slate-200 rounded-xl text-sm font-bold text-brand-700">
                <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{durasiHari} Hari Kalender</span>
              </div>
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* 3. Keperluan Penggunaan & Catatan Tambahan */}
      <div className="space-y-4">
        <FormField
          label="Keperluan Penggunaan Aset"
          required
          helperText="Jelaskan maksud dan tujuan pemanfaatan fasilitas balai ini secara jelas."
        >
          <TextareaInput
            rows={3}
            value={keperluanPenggunaan}
            onChange={(e) => setKeperluanPenggunaan(e.target.value)}
            placeholder="Contoh: Digunakan untuk penyelenggaraan workshop pengembangan kemasan ramah lingkungan bagi 50 peserta industri UKM."
          />
        </FormField>

        <FormField
          label="Catatan Tambahan / Kebutuhan Fasilitas Khusus"
          helperText="Opsional: sebutkan kebutuhan teknis khusus bila ada."
        >
          <TextareaInput
            rows={2}
            value={catatanTambahan}
            onChange={(e) => setCatatanTambahan(e.target.value)}
            placeholder="Contoh: Memerlukan tambahan daya listrik khusus, meja tambahan, atau mic wireless."
          />
        </FormField>
      </div>
    </div>
  )
}

export default Step1JenisDanPeriode
