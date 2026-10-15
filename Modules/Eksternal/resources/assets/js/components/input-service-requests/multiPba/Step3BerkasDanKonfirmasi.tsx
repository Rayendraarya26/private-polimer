import React, { useRef } from 'react'
import {
  ShieldCheck,
  UploadCloud,
  FileText,
  AlertCircle,
  Building2,
  Package,
  X,
  FileCheck2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card'
import { toast } from 'react-hot-toast'

interface Step3SummaryData {
  namaPerusahaan: string
  alamatPerusahaan: string
  alamatPengiriman: string
  provSelectedName: string
  kabSelectedName: string
  contactPerson: string
  noKontak: string
  email: string
  produkPesanan: string
  produkLainnya?: string
  jumlah: number
  satuan: string
  catatan?: string
}

interface Step3BerkasDanKonfirmasiProps {
  summaryData: Step3SummaryData
  fileSuratPermohonan: File | null
  setFileSuratPermohonan: (file: File | null) => void
  pernyataanKonfirmasi: boolean
  setPernyataanKonfirmasi: (val: boolean) => void
}

export const Step3BerkasDanKonfirmasi: React.FC<Step3BerkasDanKonfirmasiProps> = ({
  summaryData,
  fileSuratPermohonan,
  setFileSuratPermohonan,
  pernyataanKonfirmasi,
  setPernyataanKonfirmasi,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10 MB')
      return
    }

    setFileSuratPermohonan(file)
    toast.success(`File ${file.name} berhasil dipilih`)
  }

  const handleRemoveFile = () => {
    setFileSuratPermohonan(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const namaProdukDisplay =
    summaryData.produkPesanan === 'Yang lain' && summaryData.produkLainnya
      ? `Yang lain (${summaryData.produkLainnya})`
      : summaryData.produkPesanan || '-'

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              3. Berkas Surat Permohonan & Pernyataan Integritas
            </CardTitle>
            <CardDescription>
              Periksa kembali rincian data permohonan bahan acuan sebelum menyetujui pernyataan dan mengirim permohonan resmi
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* 1. Unggah Surat Permohonan / PO */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Unggah Surat Permohonan / Purchase Order (PO)
              </h4>
              <p className="text-[11px] text-slate-500">
                Pindaian (scan) surat permohonan resmi bertanda tangan dan berstempel atau dokumen PO (PDF / JPG / PNG, maks. 10 MB) - Opsional
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />

          {fileSuratPermohonan ? (
            <div className="flex items-center justify-between p-3.5 bg-brand-50/60 border border-brand-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{fileSuratPermohonan.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {(fileSuratPermohonan.size / 1024 / 1024).toFixed(2)} MB • Berkas siap dilampirkan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus berkas"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-white hover:bg-brand-50/30"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Klik di sini untuk memilih file scan surat permohonan atau PO
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Format yang didukung: PDF, JPG, PNG (maksimal 10 MB)
              </p>
            </div>
          )}
        </div>

        {/* 2. Ringkasan Data Permohonan (Format sama persis dengan Step4PernyataanKonfirmasi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Ringkasan Perusahaan & Pengiriman */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              Identitas Pemohon & Tujuan Pengiriman
            </h4>
            <div className="text-xs space-y-1.5 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Nama Perusahaan:</span>
                <span className="font-semibold text-slate-800">{summaryData.namaPerusahaan || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Alamat Perusahaan:</span>
                <span className="text-slate-700 leading-snug block">{summaryData.alamatPerusahaan || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Contact Person (PIC):</span>
                <span className="font-semibold text-slate-800">
                  {summaryData.contactPerson || '-'} ({summaryData.noKontak || '-'})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Email PIC:</span>
                <span className="text-slate-700">{summaryData.email || '-'}</span>
              </div>
              <div className="pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 block text-[11px]">Alamat Pengiriman Bahan Acuan:</span>
                <span className="text-slate-800 font-medium leading-snug block">{summaryData.alamatPengiriman || '-'}</span>
                <span className="text-[11px] text-brand-700 font-semibold block mt-0.5">
                  Tujuan: {summaryData.kabSelectedName}, {summaryData.provSelectedName}
                </span>
              </div>
            </div>
          </div>

          {/* Card Ringkasan Produk & Kuantitas */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <Package className="w-4 h-4 text-brand-600" />
              Rincian Bahan Acuan yang Dipesan
            </h4>
            <div className="text-xs space-y-1.5 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Produk Bahan Acuan:</span>
                <span className="font-bold text-brand-700 text-sm">{namaProdukDisplay}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Standar / Acuan Metrologi:</span>
                <span className="font-semibold text-slate-800">
                  {summaryData.produkPesanan.toLowerCase().includes('plastisitas')
                    ? 'SNI ISO 2930 / ASTM D3194 (Uji PO / PRI)'
                    : summaryData.produkPesanan.toLowerCase().includes('viskositas') || summaryData.produkPesanan.toLowerCase().includes('mooney')
                    ? 'SNI ISO 289-1 / ASTM D1646 (Viskositas Mooney)'
                    : 'Standar Produsen Bahan Acuan BBSPJIKKP (ISO 17034)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Jumlah Pesanan:</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {summaryData.jumlah} {summaryData.satuan}
                </span>
              </div>
              {summaryData.catatan && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Catatan / Instruksi Khusus:</span>
                  <span className="text-slate-700 italic block">{summaryData.catatan}</span>
                </div>
              )}
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Sertifikat Analisis (CoA) disertakan dalam pengiriman</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Klausul Pernyataan Pemohon (Sama persis dengan Step4PernyataanKonfirmasi) */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
          <h4 className="text-xs font-bold text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Pernyataan Pemohon Produsen Bahan Acuan (PBA)
          </h4>

          <ul className="space-y-1.5 text-xs text-amber-950/80 leading-relaxed list-disc list-inside">
            <li>
              Seluruh data identitas perusahaan, narahubung teknis, dan alamat pengiriman fisik yang disampaikan adalah benar dan sah;
            </li>
            <li>
              Kami memahami dan bersedia mematuhi seluruh prosedur operasional penyediaan Bahan Acuan Standar BBSPJIKKP;
            </li>
            <li>
              Kami berkomitmen untuk melakukan penyelesaian pembayaran tarif PNBP resmi sesuai invoice yang diterbitkan oleh balai.
            </li>
          </ul>

          <div className="pt-2 border-t border-amber-200/80">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded border-amber-300 text-brand-600 focus:ring-brand-500"
                checked={pernyataanKonfirmasi}
                onChange={(e) => setPernyataanKonfirmasi(e.target.checked)}
              />
              <span className="text-xs font-semibold text-slate-800">
                Saya telah membaca, memahami, dan menyetujui seluruh klausul pernyataan di atas dengan penuh tanggung jawab.
              </span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step3BerkasDanKonfirmasi
