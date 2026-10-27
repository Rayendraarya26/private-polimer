import React from 'react'
import { User, Phone, Mail, MapPin, CreditCard, Info } from 'lucide-react'
import { Card, CardContent } from '../../ui/Card'
import { FormField, TextInput, TextareaInput } from '../../forms'

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
              <FormField
                label="Nama Lengkap Pemohon / Perusahaan / Instansi"
                required
              >
                <TextInput
                  value={pemohonNama}
                  onChange={(e) => setPemohonNama(e.target.value)}
                  placeholder="Contoh: PT. Kreasi Inovasi Mandiri atau Budi Santoso"
                  leftIcon={<User className="w-4 h-4 text-slate-400" />}
                />
              </FormField>
            </div>

            {/* NIK / NIB */}
            <FormField label="NIK (Perorangan) atau NIB (Perusahaan)">
              <TextInput
                value={pemohonNikNib}
                onChange={(e) => setPemohonNikNib(e.target.value)}
                placeholder="Nomor Induk Kependudukan / Berusaha"
                leftIcon={<CreditCard className="w-4 h-4 text-slate-400" />}
              />
            </FormField>

            {/* Nomor Telepon / WA */}
            <FormField label="Nomor Telepon / WhatsApp Aktif" required>
              <TextInput
                type="tel"
                value={pemohonTelepon}
                onChange={(e) => setPemohonTelepon(e.target.value)}
                placeholder="Contoh: 081234567890"
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              />
            </FormField>

            {/* Alamat Email */}
            <div className="sm:col-span-2">
              <FormField label="Alamat Email Aktif" required>
                <TextInput
                  type="email"
                  value={pemohonEmail}
                  onChange={(e) => setPemohonEmail(e.target.value)}
                  placeholder="Contoh: kontak@perusahaan.co.id"
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                />
              </FormField>
            </div>

            {/* Alamat Lengkap */}
            <div className="sm:col-span-2">
              <FormField label="Alamat Lengkap Pemohon / Kantor">
                <TextareaInput
                  rows={2}
                  value={pemohonAlamat}
                  onChange={(e) => setPemohonAlamat(e.target.value)}
                  placeholder="Jl. Sukonandi No. 9, Semaki, Umbulharjo, Kota Yogyakarta"
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Step2DataPemohon
