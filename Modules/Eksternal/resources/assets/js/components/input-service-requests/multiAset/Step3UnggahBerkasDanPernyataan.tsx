import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { DropzoneUploader } from '../../forms'
import { SectionHeading, FieldLabel } from '../common'

interface Step3UnggahBerkasDanPernyataanProps {
  fileSuratPermohonan: File | null
  setFileSuratPermohonan: (file: File | null) => void
  setujuPernyataan: boolean
  setSetujuPernyataan: (val: boolean) => void
  existingFileUrl?: string | null
}

export const Step3UnggahBerkasDanPernyataan: React.FC<Step3UnggahBerkasDanPernyataanProps> = ({
  fileSuratPermohonan,
  setFileSuratPermohonan,
  setujuPernyataan,
  setSetujuPernyataan,
  existingFileUrl,
}) => {
  return (
    <div className="space-y-6">
      {/* Unggah Surat Permohonan */}
      <div className="space-y-4">
        <SectionHeading
          title="Unggah Surat Resmi Permohonan Sewa Aset"
          description="Lampirkan surat permohonan resmi pemanfaatan atau sewa fasilitas yang ditujukan kepada Kepala BBSPJIKKP"
          required
        />

        <div>
          <FieldLabel required>Surat Permohonan Sewa Aset</FieldLabel>
          <DropzoneUploader
            value={fileSuratPermohonan || existingFileUrl}
            onChange={(file) => setFileSuratPermohonan(file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={10}
            label="Pilih atau Tarik Berkas Surat Permohonan ke Sini"
            helperText="Format didukung: PDF, PNG, JPG, JPEG (Maksimal 10 MB)"
          />
        </div>
      </div>

      {/* Pernyataan & Integritas (Tanpa Card / Border) */}
      <div className="pt-6 border-t border-slate-200">
        <label
          htmlFor="checkbox-setuju-pernyataan"
          className="flex items-start gap-3.5 sm:gap-4 cursor-pointer select-none"
        >
          <input
            id="checkbox-setuju-pernyataan"
            type="checkbox"
            checked={setujuPernyataan}
            onChange={(e) => setSetujuPernyataan(e.target.checked)}
            className="mt-1 w-4.5 h-4.5 rounded border-slate-300 text-brand-600 focus:ring-0 focus:outline-none shrink-0 cursor-pointer"
          />
          <div className="space-y-2 min-w-0 flex-1">
            <span className="text-sm font-bold text-slate-900 leading-snug block">
              Saya menyatakan bahwa seluruh data yang diisikan adalah benar dan dapat dipertanggungjawabkan, serta bersedia mematuhi seluruh ketentuan pemanfaatan aset/fasilitas BBSPJIKKP.
              <span className="text-rose-500 ml-1">*</span>
            </span>

            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Klausul komitmen pemanfaatan dan kepatuhan tarif PNBP balai:
            </p>

            <div className="pt-1 space-y-1.5">
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Pemohon wajib mematuhi seluruh tata tertib penggunaan dan menjaga keamanan fasilitas balai.
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Segala bentuk kerusakan yang diakibatkan oleh kelalaian selama masa sewa menjadi tanggung jawab pihak penyewa sepenuhnya.
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Tarif retribusi sewa aset mengacu pada ketentuan tarif PNBP resmi Kementerian Perindustrian.
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Pembayaran retribusi hanya sah melalui kode Virtual Account (VA) resmi yang diterbitkan oleh sistem balai.
                </span>
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}

export default Step3UnggahBerkasDanPernyataan
