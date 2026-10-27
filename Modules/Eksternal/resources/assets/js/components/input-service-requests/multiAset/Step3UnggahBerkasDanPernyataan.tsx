import React from 'react'
import {
  UploadCloud,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent } from '../../ui/Card'
import { DropzoneUploader, LegalStatementBox } from '../../forms'

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
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. Unggah Surat Permohonan */}
      <Card className="rounded-xl border-slate-200 shadow-soft overflow-hidden">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <UploadCloud className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Unggah Surat Resmi Permohonan Sewa Aset
            </h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Lampirkan surat permohonan resmi pemanfaatan atau sewa fasilitas yang ditujukan kepada{' '}
            <strong className="text-slate-700">Kepala Balai Besar Standardisasi dan Pelayanan Jasa Industri Kulit, Karet, dan Plastik (BBSPJIKKP)</strong>.
          </p>

          <DropzoneUploader
            value={fileSuratPermohonan || existingFileUrl}
            onChange={(file) => setFileSuratPermohonan(file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={10}
            label="Pilih atau Tarik Berkas Surat Permohonan ke Sini"
            helperText="Format didukung: PDF, PNG, JPG, JPEG (Maksimal 10 MB)"
          />
        </CardContent>
      </Card>

      {/* 2. Pernyataan & Integritas */}
      <LegalStatementBox
        checked={setujuPernyataan}
        onChange={setSetujuPernyataan}
        title="Pernyataan Tanggung Jawab & Ketentuan Pemanfaatan Aset"
        subtitle="Klausul komitmen pemanfaatan dan kepatuhan tarif PNBP balai"
        bulletPoints={[
          "Pemohon wajib mematuhi seluruh tata tertib penggunaan dan menjaga keamanan fasilitas balai.",
          "Segala bentuk kerusakan yang diakibatkan oleh kelalaian selama masa sewa menjadi tanggung jawab pihak penyewa sepenuhnya.",
          "Tarif retribusi sewa aset mengacu pada ketentuan tarif PNBP resmi Kementerian Perindustrian.",
          "Pembayaran retribusi hanya sah melalui kode Virtual Account (VA) resmi yang diterbitkan oleh sistem balai.",
        ]}
        checkboxLabel="Saya menyatakan bahwa seluruh data yang diisikan adalah benar dan dapat dipertanggungjawabkan, serta bersedia mematuhi seluruh ketentuan pemanfaatan aset/fasilitas BBSPJIKKP."
      />
    </div>
  )
}

export default Step3UnggahBerkasDanPernyataan
