import React from 'react'
import { UserCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card'

export interface Step2DataPemohonProps {
  pemohonNama: string
  setPemohonNama: (val: string) => void
  pemohonNikNib: string
  setPemohonNikNib: (val: string) => void
  pemohonAlamat: string
  setPemohonAlamat: (val: string) => void
  pemohonTelepon: string
  setPemohonTelepon: (val: string) => void
  pemohonEmail: string
  setPemohonEmail: (val: string) => void
  onResetFromProfile?: () => void
}

export const Step2DataPemohon: React.FC<Step2DataPemohonProps> = ({
  pemohonNama,
  setPemohonNama,
  pemohonNikNib,
  setPemohonNikNib,
  pemohonAlamat,
  setPemohonAlamat,
  pemohonTelepon,
  setPemohonTelepon,
  pemohonEmail,
  setPemohonEmail,
  onResetFromProfile,
}) => {
  return (
    <Card className="rounded-xl border-slate-200 shadow-xs overflow-hidden">
      <CardHeader className="rounded-t-xl bg-white border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base text-slate-900">
              Identitas Pemohon & Penanggung Jawab
            </CardTitle>
            <CardDescription>
              Informasi pemohon atau instansi yang akan tercantum pada bukti pemanfaatan dan kuitansi PNBP.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Catatan Informasi Profil */}
        <div className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 text-xs text-slate-600 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="font-semibold text-slate-800">Identitas Pemohon Resmi Sewa Aset</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Data identitas otomatis disesuaikan dari profil akun Anda untuk penerbitan persetujuan balai dan kuitansi PNBP.
            </p>
          </div>
          {onResetFromProfile && (
            <button
              type="button"
              onClick={onResetFromProfile}
              className="text-xs text-brand-600 hover:text-brand-700 font-semibold underline underline-offset-2 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              Sinkron Profil Akun
            </button>
          )}
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Baris 1: Nama Pemohon & NIK/NIB */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Nama Lengkap Pemohon / Nama Perusahaan / Instansi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={pemohonNama}
                onChange={(e) => setPemohonNama(e.target.value)}
                placeholder="Contoh: PT Kreasi Inovasi Mandiri atau Budi Santoso"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                NIK (Perorangan) atau NIB (Perusahaan)
              </label>
              <input
                type="text"
                value={pemohonNikNib}
                onChange={(e) => setPemohonNikNib(e.target.value)}
                placeholder="Nomor Induk Kependudukan / Berusaha"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
              />
            </div>
          </div>

          {/* Baris 2: Nomor Telepon & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Nomor Telepon / WhatsApp Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={pemohonTelepon}
                onChange={(e) => setPemohonTelepon(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Alamat Email Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={pemohonEmail}
                onChange={(e) => setPemohonEmail(e.target.value)}
                placeholder="Contoh: kontak@perusahaan.co.id"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
              />
            </div>
          </div>

          {/* Baris 3: Alamat Lengkap */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Alamat Lengkap Pemohon / Kantor
            </label>
            <textarea
              rows={2}
              value={pemohonAlamat}
              onChange={(e) => setPemohonAlamat(e.target.value)}
              placeholder="Contoh: Jl. Sukonandi No. 9, Semaki, Umbulharjo, Kota Yogyakarta"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step2DataPemohon
