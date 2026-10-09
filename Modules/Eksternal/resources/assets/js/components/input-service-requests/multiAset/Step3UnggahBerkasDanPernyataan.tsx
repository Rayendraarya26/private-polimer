import React, { useRef } from 'react'
import {
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react'
import { Card, CardContent } from '../../ui/Card'
import { Button } from '../../ui/Button'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (selected.size > 10 * 1024 * 1024) {
        alert('Ukuran file maksimal adalah 10 MB')
        return
      }
      setFileSuratPermohonan(selected)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

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
            Format yang didukung: <span className="font-semibold text-slate-700">PDF, JPG, JPEG, PNG</span> (Maksimal 10 MB).
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
          />

          {!fileSuratPermohonan ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/20 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-brand-100 flex items-center justify-center text-slate-500 group-hover:text-brand-600 mb-3 transition-colors">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 mb-1">
                Klik untuk Memilih File Surat Permohonan
              </p>
              <p className="text-[11px] text-slate-400">
                PDF atau Gambar scan dokumen resmi (Maks. 10MB)
              </p>
              {existingFileUrl && (
                <div className="mt-3 text-xs text-brand-600 font-medium">
                  File saat ini telah terunggah. Klik di sini jika ingin mengganti dengan file baru.
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {fileSuratPermohonan.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formatFileSize(fileSuratPermohonan.size)} • Siap diunggah
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs h-8"
                >
                  Ganti File
                </Button>
                <button
                  type="button"
                  onClick={() => setFileSuratPermohonan(null)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  title="Hapus file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Pernyataan & Integritas */}
      <Card className="rounded-xl border-slate-200 shadow-soft overflow-hidden">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Pernyataan Tanggung Jawab & Integritas
            </h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
            <p className="font-semibold text-slate-800">Ketentuan Pemanfaatan Fasilitas / Sewa Aset BBSPJIKKP:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Pemohon wajib mematuhi seluruh tata tertib penggunaan dan menjaga keamanan fasilitas balai.</li>
              <li>Segala bentuk kerusakan yang diakibatkan oleh kelalaian selama masa sewa menjadi tanggung jawab pihak penyewa.</li>
              <li>Tarif retribusi sewa aset mengacu pada ketentuan tarif PNBP resmi Kementerian Perindustrian.</li>
              <li>Pembayaran hanya sah melalui kode Virtual Account (VA) resmi yang diterbitkan oleh sistem balai.</li>
            </ul>
          </div>

          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-brand-200 bg-brand-50/30 cursor-pointer select-none hover:bg-brand-50/60 transition-colors">
            <input
              type="checkbox"
              checked={setujuPernyataan}
              onChange={(e) => setSetujuPernyataan(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
            <span className="text-xs font-semibold text-slate-800 leading-relaxed">
              Saya menyatakan bahwa seluruh data yang diisikan adalah benar dan dapat dipertanggungjawabkan, serta bersedia mematuhi seluruh ketentuan pemanfaatan aset/fasilitas BBSPJIKKP. <span className="text-rose-500">*</span>
            </span>
          </label>
        </CardContent>
      </Card>
    </div>
  )
}

export default Step3UnggahBerkasDanPernyataan
