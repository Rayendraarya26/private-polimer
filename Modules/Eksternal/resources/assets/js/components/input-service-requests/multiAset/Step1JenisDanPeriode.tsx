import React from 'react'
import { Clock } from 'lucide-react'
import { JenisSewaOption } from '../../../types/aset'
import {
  SectionHeading,
  FieldLabel,
  FieldHint,
  OptionGroup,
  OptionCard,
  textareaClass,
} from '../common'
import { DateInput } from '../../forms'

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
    <div className="space-y-6">
      {/* Kategori Fasilitas / Aset Balai */}
      <div className="space-y-4">
        <SectionHeading
          title="Kategori Fasilitas & Aset Balai"
          description="Pilih aset fisik atau fasilitas milik BBSPJIKKP yang ingin disewa atau dimanfaatkan"
          required
        />

        <OptionGroup label="Kategori Fasilitas / Aset Balai" cols={2}>
          {options.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={jenisSewa === opt.value}
              onSelect={() => setJenisSewa(opt.value)}
              radioPosition="left"
              title={opt.label}
              description={opt.desc}
            />
          ))}
        </OptionGroup>
      </div>

      {/* Jadwal & Periode Pemanfaatan */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <SectionHeading
          title="Jadwal & Periode Pemanfaatan"
          description="Tentukan rentang tanggal mulai dan selesai penggunaan fasilitas"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <FieldLabel required htmlFor="tanggal_mulai">
              Tanggal Mulai
            </FieldLabel>
            <DateInput
              id="tanggal_mulai"
              min={todayStr}
              value={tanggalMulai}
              onChange={(e) => {
                setTanggalMulai(e.target.value)
                if (tanggalSelesai && e.target.value > tanggalSelesai) {
                  setTanggalSelesai(e.target.value)
                }
              }}
            />
          </div>

          <div>
            <FieldLabel required htmlFor="tanggal_selesai">
              Tanggal Selesai
            </FieldLabel>
            <DateInput
              id="tanggal_selesai"
              min={tanggalMulai || todayStr}
              value={tanggalSelesai}
              onChange={(e) => setTanggalSelesai(e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="durasi_hari">Estimasi Durasi Sewa</FieldLabel>
            <div className="flex items-center gap-2.5 px-3.5 h-[42px] bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-brand-700 shadow-2xs">
              <Clock className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{durasiHari} Hari Kalender</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keperluan & Catatan */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <SectionHeading
          title="Keperluan & Spesifikasi Penggunaan"
          description="Informasi maksud pemanfaatan aset serta kebutuhan teknis khusus bila ada"
          required
        />

        <div className="space-y-4">
          <div>
            <FieldLabel required htmlFor="keperluan_penggunaan">
              Keperluan Penggunaan Aset
            </FieldLabel>
            <textarea
              id="keperluan_penggunaan"
              rows={3}
              value={keperluanPenggunaan}
              onChange={(e) => setKeperluanPenggunaan(e.target.value)}
              placeholder="Contoh: Digunakan untuk penyelenggaraan workshop pengembangan kemasan ramah lingkungan bagi 50 peserta industri UKM."
              className={textareaClass}
            />
            <FieldHint>
              Jelaskan maksud dan tujuan pemanfaatan fasilitas balai ini secara jelas.
            </FieldHint>
          </div>

          <div>
            <FieldLabel optional htmlFor="catatan_tambahan">
              Catatan Tambahan / Fasilitas Khusus
            </FieldLabel>
            <textarea
              id="catatan_tambahan"
              rows={2}
              value={catatanTambahan}
              onChange={(e) => setCatatanTambahan(e.target.value)}
              placeholder="Contoh: Memerlukan tambahan daya listrik khusus, meja tambahan, atau mic wireless."
              className={textareaClass}
            />
            <FieldHint>
              Sebutkan kebutuhan perlengkapan atau fasilitas teknis khusus bila ada.
            </FieldHint>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step1JenisDanPeriode
