import React from 'react'
import {
  ShieldCheck,
  Building2,
  Package,
  FileCheck2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/Card'
import { DropzoneUploader, LegalStatementBox } from '../../forms'

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
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">
            Unggah Surat Permohonan / Purchase Order (PO) <span className="text-slate-400 font-normal">(Opsional)</span>
          </label>
          <DropzoneUploader
            value={fileSuratPermohonan}
            onChange={(file) => setFileSuratPermohonan(file)}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={10}
            label="Pilih atau Tarik Berkas Surat Permohonan / PO ke Sini"
            helperText="Scan surat permohonan resmi bertanda tangan dan berstempel atau dokumen PO (PDF / JPG / PNG, maks 10 MB)"
          />
        </div>

        {/* 2. Ringkasan Data Permohonan */}
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

        {/* 3. Klausul Pernyataan Pemohon */}
        <LegalStatementBox
          checked={pernyataanKonfirmasi}
          onChange={setPernyataanKonfirmasi}
          title="Pernyataan Pemohon Produsen Bahan Acuan (PBA)"
          subtitle="Konfirmasi keabsahan identitas, kepatuhan SOP, dan tarif PNBP"
          bulletPoints={[
            "Seluruh data identitas perusahaan, narahubung teknis, dan alamat pengiriman fisik yang disampaikan adalah benar dan sah.",
            "Kami memahami dan bersedia mematuhi seluruh prosedur operasional penyediaan Bahan Acuan Standar BBSPJIKKP.",
            "Kami berkomitmen untuk melakukan penyelesaian pembayaran tarif PNBP resmi sesuai invoice yang diterbitkan oleh balai.",
          ]}
          checkboxLabel="Saya telah membaca, memahami, dan menyetujui seluruh klausul pernyataan di atas dengan penuh tanggung jawab."
        />
      </CardContent>
    </Card>
  )
}

export default Step3BerkasDanKonfirmasi
