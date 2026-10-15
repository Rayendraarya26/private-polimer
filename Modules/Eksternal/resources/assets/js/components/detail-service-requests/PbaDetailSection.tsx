import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import {
  Boxes,
  Truck,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  ShieldCheck,
  ExternalLink,
  Package,
  Sparkles,
} from 'lucide-react'
import { getFileUrl } from '../../utils/fileHelpers'

export interface PbaDetailSectionProps {
  permohonan: any
  formPba: any
  formatIndoDate?: (dateStr?: string | null, withTime?: boolean, shortMonth?: boolean) => string
}

export const PbaDetailSection: React.FC<PbaDetailSectionProps> = ({
  permohonan,
  formPba,
  formatIndoDate,
}) => {
  const pbaData =
    formPba ||
    permohonan?.form_pba ||
    permohonan?.formPba?.[0] ||
    permohonan?.detailPermohonan?.[0]?.formable ||
    {}

  const fileSurat = pbaData?.file_surat_permohonan
  const fileUrl = fileSurat ? getFileUrl(fileSurat) : null

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    if (formatIndoDate) return formatIndoDate(dateStr)
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const namaProduk = pbaData?.produk_pesanan || '-'
  const detailProduk = pbaData?.produk_lainnya ? ` (${pbaData.produk_lainnya})` : ''

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* ── HEADER BANNER (SERAGAM DENGAN PUP & INSPEKSI) ── */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-brand-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Produsen Bahan Acuan BBSPJIKKP (PBA Terakreditasi ISO 17034 KAN)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {namaProduk}
              {detailProduk}
            </h3>
            <p className="text-xs text-brand-100/90 max-w-2xl leading-relaxed">
              Penyediaan material referensi standar tersertifikasi untuk kalibrasi metode uji plastisitas dan viskositas mooney.
            </p>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-white/15 pt-3 sm:pt-0 sm:pl-5 shrink-0">
            <span className="text-[11px] text-brand-200 block font-medium">Jumlah Pesanan:</span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {pbaData?.jumlah || 1} <span className="text-xs font-normal text-brand-200">{pbaData?.satuan || 'Sampel/Unit'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── GRID PERUSAHAAN & PENGIRIMAN ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Kiri: Identitas Perusahaan & PIC */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              <span>Identitas Perusahaan Pemohon</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nama Perusahaan</span>
              <span className="font-bold text-slate-900 text-sm">{pbaData?.nama_perusahaan || '-'}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Alamat Perusahaan (Kantor/Legal)</span>
              <span className="text-slate-700 leading-relaxed">{pbaData?.alamat_perusahaan || '-'}</span>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-slate-400 block font-medium mb-1">Narahubung (PIC)</span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pbaData?.contact_person || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pbaData?.no_kontak || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pbaData?.email || '-'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kanan: Alamat Tujuan Pengiriman Ekspedisi */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" />
              <span>Alamat Tujuan Pengiriman Bahan Acuan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3.5 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block">Tujuan Ekspedisi / Fisik Material</span>
                  <p className="text-slate-700 leading-relaxed">{pbaData?.alamat_pengiriman || '-'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-400 block font-medium">Kota / Kabupaten</span>
                <span className="font-semibold text-slate-800">
                  {pbaData?.kabupaten_nama || pbaData?.kabupaten_id || '-'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Provinsi</span>
                <span className="font-semibold text-slate-800">
                  {pbaData?.provinsi_nama || pbaData?.provinsi_id || '-'}
                </span>
              </div>
            </div>

            {pbaData?.catatan && (
              <div className="border-t border-slate-100 pt-2.5">
                <span className="text-slate-400 block font-medium">Catatan / Instruksi Tambahan</span>
                <p className="text-slate-600 italic mt-0.5">{pbaData.catatan}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── RINCIAN PRODUK & BERKAS PENDUKUNG ── */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-600" />
            <span>Rincian Produk & Berkas Surat Permohonan</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Nama Produk Bahan Acuan</span>
                <span className="font-bold text-slate-900 text-sm">
                  {pbaData?.produk_pesanan || '-'}
                </span>
                {pbaData?.produk_lainnya && (
                  <p className="text-slate-500 mt-0.5">Kustom: {pbaData.produk_lainnya}</p>
                )}
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Standar / Acuan Metrologi</span>
                <span className="text-slate-700">
                  {namaProduk.toLowerCase().includes('plastisitas')
                    ? 'SNI ISO 2930 / ASTM D3194 (Uji PO / PRI)'
                    : namaProduk.toLowerCase().includes('viskositas') || namaProduk.toLowerCase().includes('mooney')
                    ? 'SNI ISO 289-1 / ASTM D1646 (Viskositas Mooney)'
                    : 'Standar Produsen Bahan Acuan BBKKP (ISO 17034)'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Waktu Pengajuan</span>
                <span className="text-slate-700">
                  {formatDate(pbaData?.disetujui_pada || pbaData?.created_at)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs text-slate-400 block font-medium">Surat Permohonan / Purchase Order (PO)</span>
              {fileUrl ? (
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-rose-500 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Berkas Surat Permohonan / PO</span>
                      <span className="text-[11px] text-slate-400">Lampiran resmi pemohon</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(fileUrl, '_blank')}
                    leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                  >
                    Buka Berkas
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-400 text-center">
                  Tidak ada berkas surat permohonan yang dilampirkan.
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Pernyataan komitmen ketentuan layanan telah disetujui pemohon.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PbaDetailSection
