import React from 'react'
import { User, Phone, Mail, MapPin, CreditCard, Info } from 'lucide-react'
import { Card, CardContent } from '../../ui/Card'

interface Step2DataPemohonProps {
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
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Alert Note */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800 leading-relaxed">
          <p className="font-semibold mb-0.5">Identitas Pemohon Resmi Sewa Aset</p>
          <p>
            Data identitas di bawah ini otomatis disesuaikan dari profil akun Anda. Informasi ini akan
            tercantum pada surat balasan persetujuan balai, invoice, dan bukti tanda terima/kuitansi PNBP.
          </p>
        </div>
      </div>

      <Card className="rounded-xl border-slate-200 shadow-soft">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <span>Identitas Pemohon / Penanggung Jawab</span>
            </h3>
            {onResetFromProfile && (
              <button
                type="button"
                onClick={onResetFromProfile}
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold underline underline-offset-2"
              >
                Gunakan Data Profil Akun
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama Pemohon */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Pemohon / Nama Perusahaan / Instansi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pemohonNama}
                  onChange={(e) => setPemohonNama(e.target.value)}
                  placeholder="Contoh: PT. Kreasi Inovasi Mandiri atau Budi Santoso"
                  className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            {/* NIK / NIB */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIK (Perorangan) atau NIB (Perusahaan)
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pemohonNikNib}
                  onChange={(e) => setPemohonNikNib(e.target.value)}
                  placeholder="Nomor Induk Kependudukan / Berusaha"
                  className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            {/* Nomor Telepon / WA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Telepon / WhatsApp Aktif <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={pemohonTelepon}
                  onChange={(e) => setPemohonTelepon(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            {/* Alamat Email */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Email Aktif <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={pemohonEmail}
                  onChange={(e) => setPemohonEmail(e.target.value)}
                  placeholder="Contoh: kontak@perusahaan.co.id"
                  className="w-full text-xs rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            {/* Alamat Lengkap */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Lengkap Pemohon / Kantor
              </label>
              <div className="relative">
                <textarea
                  rows={2}
                  value={pemohonAlamat}
                  onChange={(e) => setPemohonAlamat(e.target.value)}
                  placeholder="Jl. Sukonandi No. 9, Semaki, Umbulharjo, Kota Yogyakarta"
                  className="w-full text-xs rounded-lg border border-slate-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Step2DataPemohon
