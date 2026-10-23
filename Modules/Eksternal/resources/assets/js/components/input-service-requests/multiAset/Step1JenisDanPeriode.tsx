import React from 'react'
import { Building2, Layers, Wrench, Car, DoorOpen } from 'lucide-react'
import { JenisSewaOption } from '../../../types/aset'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card'

export interface Step1JenisDanPeriodeProps {
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
      return <Layers className="w-4 h-4 text-emerald-600" />
    case 'sewa_bangunan':
      return <Building2 className="w-4 h-4 text-indigo-600" />
    case 'sewa_alat':
      return <Wrench className="w-4 h-4 text-amber-600" />
    case 'sewa_mobil':
      return <Car className="w-4 h-4 text-sky-600" />
    case 'sewa_ruangan':
      return <DoorOpen className="w-4 h-4 text-violet-600" />
    default:
      return <Building2 className="w-4 h-4 text-brand-600" />
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
    <Card className="rounded-xl border-slate-200 shadow-xs overflow-hidden">
      <CardHeader className="rounded-t-xl bg-white border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base text-slate-900">
              Fasilitas & Jadwal Pemanfaatan Aset
            </CardTitle>
            <CardDescription>
              Pilih kategori aset atau fasilitas balai beserta periode pemanfaatan yang dikehendaki.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* 1. Pilihan Jenis Sewa Aset */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Pilih Kategori Fasilitas / Aset Balai <span className="text-rose-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-3">
            Tentukan aset fisik atau fasilitas milik BBSPJIKKP yang ingin Anda manfaatkan atau sewa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {options.map((opt) => {
              const isSelected = jenisSewa === opt.value
              return (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-50 border-brand-600'
                      : 'border-slate-200 hover:bg-slate-50/60 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="jenis_sewa"
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => setJenisSewa(opt.value)}
                    className="mt-1 w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 shrink-0"
                  />
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-white border border-brand-200 shadow-2xs'
                        : 'bg-slate-100 border border-slate-200/80'
                    }`}
                  >
                    {getAsetIcon(opt.value)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 block leading-snug">
                      {opt.label}
                    </span>
                    {opt.desc && (
                      <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 block leading-relaxed">
                        {opt.desc}
                      </span>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* 2. Periode Sewa & Estimasi Durasi */}
        <div className="pt-2 border-t border-slate-200 space-y-3">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Jadwal & Periode Pemanfaatan <span className="text-rose-500">*</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tentukan rentang tanggal pelaksanaan pemanfaatan fasilitas balai.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Tanggal Mulai <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={tanggalMulai}
                onChange={(e) => {
                  setTanggalMulai(e.target.value)
                  if (tanggalSelesai && e.target.value > tanggalSelesai) {
                    setTanggalSelesai(e.target.value)
                  }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Tanggal Selesai <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                min={tanggalMulai || todayStr}
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Estimasi Durasi
              </label>
              <div className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Durasi Penggunaan</span>
                <span className="text-brand-700">{durasiHari} Hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Keperluan Penggunaan & Catatan Tambahan */}
        <div className="pt-2 border-t border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Keperluan Penggunaan Aset <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={keperluanPenggunaan}
              onChange={(e) => setKeperluanPenggunaan(e.target.value)}
              placeholder="Contoh: Digunakan untuk penyelenggaraan workshop pengembangan kemasan ramah lingkungan bagi 50 peserta industri UKM..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Catatan Tambahan / Kebutuhan Fasilitas Khusus (Opsional)
            </label>
            <textarea
              rows={2}
              value={catatanTambahan}
              onChange={(e) => setCatatanTambahan(e.target.value)}
              placeholder="Contoh: Memerlukan tambahan daya listrik khusus, meja tambahan, atau mic wireless..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step1JenisDanPeriode
