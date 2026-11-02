import React from 'react'
import {
  SectionHeading,
  FieldLabel,
  FieldHint,
  Callout,
  inputClass,
  textareaClass,
} from '../common'

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
    <div className="space-y-6">


      <div className="space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nama Pemohon */}
          <div className="sm:col-span-2">
            <FieldLabel required htmlFor="pemohon_nama">
              Nama Lengkap Pemohon / Perusahaan / Instansi
            </FieldLabel>
            <input
              type="text"
              id="pemohon_nama"
              value={pemohonNama}
              onChange={(e) => setPemohonNama(e.target.value)}
              placeholder="Contoh: PT. Kreasi Inovasi Mandiri atau Budi Santoso"
              className={inputClass}
            />
          </div>

          {/* NIK / NIB */}
          <div>
            <FieldLabel optional htmlFor="pemohon_nik_nib">
              NIK (Perorangan) atau NIB (Perusahaan)
            </FieldLabel>
            <input
              type="text"
              id="pemohon_nik_nib"
              value={pemohonNikNib}
              onChange={(e) => setPemohonNikNib(e.target.value)}
              placeholder="Nomor Induk Kependudukan / Berusaha"
              className={inputClass}
            />
          </div>

          {/* Nomor Telepon / WA */}
          <div>
            <FieldLabel required htmlFor="pemohon_telepon">
              Nomor Telepon / WhatsApp Aktif
            </FieldLabel>
            <input
              type="tel"
              id="pemohon_telepon"
              value={pemohonTelepon}
              onChange={(e) => setPemohonTelepon(e.target.value)}
              placeholder="Contoh: 081234567890"
              className={inputClass}
            />
          </div>

          {/* Alamat Email */}
          <div className="sm:col-span-2">
            <FieldLabel required htmlFor="pemohon_email">
              Email
            </FieldLabel>
            <input
              type="email"
              id="pemohon_email"
              value={pemohonEmail}
              onChange={(e) => setPemohonEmail(e.target.value)}
              placeholder="Contoh: kontak@perusahaan.co.id"
              className={inputClass}
            />
          </div>

          {/* Alamat Lengkap */}
          <div className="sm:col-span-2">
            <FieldLabel optional htmlFor="pemohon_alamat">
              Alamat Pemohon
            </FieldLabel>
            <textarea
              id="pemohon_alamat"
              rows={2}
              value={pemohonAlamat}
              onChange={(e) => setPemohonAlamat(e.target.value)}
              placeholder="Jl. Sukonandi No. 9, Semaki, Umbulharjo, Kota Yogyakarta"
              className={textareaClass}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step2DataPemohon
