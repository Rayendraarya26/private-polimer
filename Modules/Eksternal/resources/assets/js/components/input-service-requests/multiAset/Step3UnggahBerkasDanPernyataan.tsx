import React, { useRef } from 'react'
import {
  FileCheck,
  UploadCloud,
  FileText,
  Trash2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card'
import { Button } from '../../ui/Button'

export interface Step3SummaryData {
  jenisSewaLabel?: string
  tanggalMulai?: string
  tanggalSelesai?: string
  durasiHari?: number
  keperluanPenggunaan?: string
  pemohonNama?: string
  pemohonNikNib?: string
  pemohonTelepon?: string
  pemohonEmail?: string
  pemohonAlamat?: string
}

export interface Step3UnggahBerkasDanPernyataanProps {
  fileSuratPermohonan: File | null
  setFileSuratPermohonan: (file: File | null) => void
  setujuPernyataan: boolean
  setSetujuPernyataan: (val: boolean) => void
  existingFileUrl?: string | null
  summaryData?: Step3SummaryData
}

export const Step3UnggahBerkasDanPernyataan: React.FC<Step3UnggahBerkasDanPernyataanProps> = ({
  fileSuratPermohonan,
  setFileSuratPermohonan,
  setujuPernyataan,
  setSetujuPernyataan,
  existingFileUrl,
  summaryData,
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
    <Card className="rounded-xl border-slate-200 shadow-xs overflow-hidden">
      <CardHeader className="rounded-t-xl bg-white border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base text-slate-900">
              Pernyataan & Berkas Permohonan
            </CardTitle>
            <CardDescription>
              Periksa kembali ringkasan pemanfaatan aset, lampirkan surat resmi, dan setujui pernyataan integritas.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* 1. Ringkasan Pengajuan (2 Kolom) */}
        {summaryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Fasilitas & Periode */}
            <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
                Rincian Sewa Aset Balai
              </h4>
              <div className="text-xs space-y-2 pt-0.5">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Kategori Aset</span>
                  <span className="col-span-2 font-semibold text-slate-800">
                    {summaryData.jenisSewaLabel || '-'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Periode Sewa</span>
                  <span className="col-span-2 font-semibold text-slate-800">
                    {summaryData.tanggalMulai || '-'} s.d. {summaryData.tanggalSelesai || '-'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Estimasi Durasi</span>
                  <span className="col-span-2 text-slate-800">
                    {summaryData.durasiHari || 1} Hari Kalender
                  </span>
                </div>
                {summaryData.keperluanPenggunaan && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Keperluan</span>
                    <span className="col-span-2 text-slate-700 line-clamp-2">
                      {summaryData.keperluanPenggunaan}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Data Pemohon */}
            <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
                Identitas Pemohon
              </h4>
              <div className="text-xs space-y-2 pt-0.5">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Nama Pemohon</span>
                  <span className="col-span-2 font-semibold text-slate-800">
                    {summaryData.pemohonNama || '-'}
                  </span>
                </div>
                {summaryData.pemohonNikNib && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">NIK / NIB</span>
                    <span className="col-span-2 text-slate-800 font-mono">
                      {summaryData.pemohonNikNib}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">No. Telepon / WA</span>
                  <span className="col-span-2 text-slate-800">
                    {summaryData.pemohonTelepon || '-'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Alamat Email</span>
                  <span className="col-span-2 text-slate-800">
                    {summaryData.pemohonEmail || '-'}
                  </span>
                </div>
                {summaryData.pemohonAlamat && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-slate-500">Alamat</span>
                    <span className="col-span-2 text-slate-700 line-clamp-2">
                      {summaryData.pemohonAlamat}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Unggah Surat Resmi Permohonan */}
        <div className="space-y-3 pt-1">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Unggah Surat Permohonan Sewa Aset
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Lampirkan surat permohonan resmi pemanfaatan atau sewa fasilitas yang ditujukan kepada Kepala BBSPJIKKP (Format: PDF, JPG, PNG, Maks. 10 MB).
            </p>
          </div>

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
              className="border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-slate-50/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group bg-white"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-brand-50 flex items-center justify-center text-slate-500 group-hover:text-brand-600 mb-2 transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-800 mb-0.5">
                Klik untuk memilih file surat permohonan
              </p>
              <p className="text-[11px] text-slate-400">
                PDF atau gambar scan dokumen resmi (Maks. 10 MB)
              </p>
              {existingFileUrl && (
                <div className="mt-2 text-[11px] text-brand-600 font-medium">
                  File surat saat ini telah terunggah. Klik di sini jika ingin mengganti dengan file baru.
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
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
                  className="text-xs h-7 px-2.5 rounded-lg border-slate-300 bg-white"
                >
                  Ganti File
                </Button>
                <button
                  type="button"
                  onClick={() => setFileSuratPermohonan(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Hapus file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Ketentuan Pemanfaatan Fasilitas / Sewa Aset */}
        <div className="p-4 rounded-lg bg-slate-50/50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800">
            Ketentuan Pemanfaatan Fasilitas / Sewa Aset BBSPJIKKP:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
            <li>Pemohon wajib mematuhi seluruh tata tertib penggunaan dan menjaga keamanan fasilitas balai.</li>
            <li>Segala bentuk kerusakan yang diakibatkan oleh kelalaian selama masa sewa menjadi tanggung jawab pihak penyewa.</li>
            <li>Tarif retribusi sewa aset mengacu pada ketentuan tarif PNBP resmi Kementerian Perindustrian.</li>
            <li>Pembayaran retribusi hanya sah melalui kode Virtual Account (VA) resmi yang diterbitkan oleh sistem balai.</li>
          </ul>
        </div>

        {/* 4. Checkbox Pernyataan Integritas */}
        <label className="flex items-start gap-3 p-4 rounded-lg bg-slate-50/70 border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={setujuPernyataan}
            onChange={(e) => setSetujuPernyataan(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 shrink-0 cursor-pointer"
          />
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">
              Pernyataan Integritas & Kepatuhan Tata Tertib <span className="text-rose-500">*</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Saya menyatakan bahwa seluruh data yang diisikan adalah benar dan dapat dipertanggungjawabkan, serta bersedia mematuhi seluruh ketentuan dan tata tertib pemanfaatan aset/fasilitas BBSPJIKKP.
            </p>
          </div>
        </label>
      </CardContent>
    </Card>
  )
}

export default Step3UnggahBerkasDanPernyataan
