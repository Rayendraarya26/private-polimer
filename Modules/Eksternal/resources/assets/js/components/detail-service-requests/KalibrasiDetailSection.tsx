import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import {
  Wrench,
  Toolbox,
  CheckCircle2,
  MapPin,
  Sparkles,
  Phone,
  User,
  Building2,
  Calendar,
  Languages,
  Truck,
  Hash,
  FileCheck2,
  FileText,
  Receipt,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
  FileDown,
  Info,
} from "lucide-react"
import { getFileUrl } from "../../utils/fileHelpers"

export interface KalibrasiDetailSectionProps {
  permohonan: any
  formKalibrasi: any
  formatIndoDate?: (dateStr?: string | null, withTime?: boolean, shortMonth?: boolean) => string
  openInvoice?: (item: any) => void
  openKuitansi?: (item: any) => void
  openSuratPenawaran?: (item: any) => void
}

export const KalibrasiDetailSection: React.FC<KalibrasiDetailSectionProps> = ({
  permohonan,
  formKalibrasi,
  formatIndoDate,
  openInvoice,
  openKuitansi,
  openSuratPenawaran,
}) => {
  const alatList: any[] = Array.isArray(formKalibrasi?.alat_list)
    ? formKalibrasi.alat_list
    : Array.isArray(formKalibrasi?.alatList)
      ? formKalibrasi.alatList
      : []

  const grandTotalBiaya = Number(
    formKalibrasi?.estimasi_total_tarif ||
    permohonan?.total_harga ||
    permohonan?.harga_permohonan ||
    0
  )

  const defaultFormatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-"
    if (formatIndoDate) return formatIndoDate(dateStr, false, true)
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const isLunas = permohonan?.status_bayar === "LUNAS"
  const hasPenawaran = Boolean(
    permohonan?.file_surat_penawaran ||
    (permohonan?.catatan_admin && (
      permohonan.catatan_admin.endsWith(".pdf") ||
      permohonan.catatan_admin.includes("penawaran/") ||
      permohonan.catatan_admin.includes("surat_penawaran/")
    ))
  )

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">

      {/* 1. GRID INFORMASI UTAMA: Identitas Pemohon & Detail Pelaksanaan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Card 1: Identitas Pemohon & Pelanggan */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-800">
                  Identitas Pemohon & Pelanggan
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nama Pemohon / Kontak:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block text-sm">
                {formKalibrasi?.nama_pemohon || permohonan?.creator?.name || "-"}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block font-medium">Sertifikat Dibuat Untuk (Instansi/Pemilik):</span>
              <span className="font-bold text-brand-700 mt-0.5 block text-xs">
                {formKalibrasi?.hasil_kalibrasi_untuk || "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">No. Telepon / WhatsApp:</span>
                <span className="font-semibold text-slate-800 mt-0.5 inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {formKalibrasi?.no_telp || permohonan?.creator?.phone || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Email Terdaftar:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                  {permohonan?.creator?.email || "-"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block font-medium">Alamat Pemohon / Instansi:</span>
              <span className="font-medium text-slate-800 mt-0.5 block leading-relaxed">
                {formKalibrasi?.alamat_pemohon ||
                  permohonan?.creator?.pelanggan?.detail?.alamat ||
                  "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Detail Pelaksanaan & Pengiriman Sertifikat */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Detail Pelaksanaan & Pengiriman
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block font-medium">Ruang Lingkup Akreditasi:</span>
                <span className="mt-1 inline-block">
                  <Badge
                    variant={formKalibrasi?.ruang_lingkup_akreditasi === "Masuk Ruang Lingkup" ? "success" : "neutral"}
                    className="font-bold text-[11px] px-2 py-0.5"
                  >
                    {formKalibrasi?.ruang_lingkup_akreditasi || "Masuk Ruang Lingkup"}
                  </Badge>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Bahasa Sertifikat / Laporan:</span>
                <span className="font-semibold text-slate-800 mt-1 inline-flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-slate-500" />
                  {formKalibrasi?.bahasa_laporan === "inggris" ? "Bahasa Inggris (English)" : "Bahasa Indonesia"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block font-medium">Lokasi Pelaksanaan Kalibrasi:</span>
              <span className="font-semibold text-brand-700 mt-0.5 inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                {formKalibrasi?.lokasi_pelaksanaan === "Tempat Client"
                  ? "Di Lokasi Pemohon / On-Site (Tempat Client)"
                  : "Laboratorium Kalibrasi BBKKP (In-House)"}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block font-medium">Nama Penerima Sertifikat:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {formKalibrasi?.nama_penerima_kirim || formKalibrasi?.nama_pemohon || "-"}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block font-medium">Alamat Tujuan Pengiriman:</span>
              <span className="font-medium text-slate-800 mt-0.5 block leading-relaxed">
                {formKalibrasi?.alamat_pengiriman || formKalibrasi?.alamat_pemohon || "-"}
              </span>
            </div>

            {formKalibrasi?.no_order_sis && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Nomor Order SIS:</span>
                <span className="font-mono font-bold text-slate-800 text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                  {formKalibrasi.no_order_sis}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 2. CATATAN KHUSUS / TITIK UJI KALIBRASI (Jika Ada) */}
      {formKalibrasi?.uraian_kalibrasi && (
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Uraian Kalibrasi & Titik Uji yang Dikehendaki
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
              {formKalibrasi.uraian_kalibrasi}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 3. DAFTAR ALAT YANG DIKALIBRASI & PARAMETER (Tabel Terpadu PNBP) */}
      <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3 bg-slate-50/60 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Toolbox className="w-4 h-4 text-brand-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Daftar Alat yang Dikalibrasi ({alatList.length} Alat)
            </CardTitle>
          </div>
          <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200 font-bold">
            Total {formKalibrasi?.total_alat || alatList.length} Alat
          </Badge>
        </CardHeader>

        <CardContent className="p-5 space-y-6">
          {alatList.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Toolbox className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              Belum ada rincian data alat kalibrasi.
            </div>
          ) : (
            alatList.map((alat: any, idx: number) => {
              const seriList: any[] = Array.isArray(alat?.nomor_seri_list)
                ? alat.nomor_seri_list
                : Array.isArray(alat?.seriList)
                  ? alat.seriList
                  : Array.isArray(alat?.nomorSeriList)
                    ? alat.nomorSeriList
                    : []

              const itemList: any[] = Array.isArray(alat?.kalibrasi_items)
                ? alat.kalibrasi_items
                : Array.isArray(alat?.itemList)
                  ? alat.itemList
                  : Array.isArray(alat?.kalibrasiList)
                    ? alat.kalibrasiList
                    : Array.isArray(alat?.kalibrasiItems)
                      ? alat.kalibrasiItems
                      : []

              const subtotalAlat = Number(alat.subtotal_biaya || alat.subtotal || 0)

              return (
                <div
                  key={alat.id || idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                >
                  {/* Header Alat */}
                  <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {alat.urutan || idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {alat.nama_alat || alat.namaAlat || `Alat #${idx + 1}`}
                          {(alat.tipe_model || alat.tipeModel) && (
                            <span className="text-slate-500 font-normal"> ({alat.tipe_model || alat.tipeModel})</span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {alat.merk ? `Merk: ${alat.merk}` : "Spesifikasi Alat"} • {alat.jumlah || 1} Unit • Kondisi:{" "}
                          <span className="font-medium text-slate-700">{alat.kondisi || "Baik / Normal"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Subtotal Alat
                      </span>
                      <span className="text-xs font-bold text-brand-700">
                        Rp {subtotalAlat.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Nomor Seri Unit */}
                    {seriList.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 text-slate-400" />
                          Nomor Seri Unit ({seriList.length} Unit):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {seriList.map((s: any, sIdx: number) => {
                            const noSeri = typeof s === "string" ? s : s?.nomor_seri || s?.nomorSeri || "-"
                            return (
                              <span
                                key={sIdx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-700"
                              >
                                <span className="text-slate-400 font-sans text-[10px]">#{sIdx + 1}:</span>
                                {noSeri}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Parameter Pengujian Kalibrasi */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-brand-600" />
                        Parameter Pengujian Kalibrasi:
                      </span>

                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                              <th className="py-2.5 px-3 w-12 text-center">No</th>
                              <th className="py-2.5 px-3">Nama Pengujian Kalibrasi</th>
                              <th className="py-2.5 px-3 text-right w-36">Tarif Satuan (Rp)</th>
                              <th className="py-2.5 px-3 text-center w-20">Jumlah</th>
                              <th className="py-2.5 px-3 text-right w-36 pr-4">Subtotal (Rp)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {itemList.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-3 py-4 text-center text-slate-400 text-xs">
                                  Belum ada parameter kalibrasi yang dipilih.
                                </td>
                              </tr>
                            ) : (
                              itemList.map((it: any, itIdx: number) => {
                                const namaKalibrasi =
                                  it.nama_kalibrasi_snapshot ||
                                  it.masterKalibrasi?.kalibrasi ||
                                  it.master_kalibrasi?.kalibrasi ||
                                  it.nama ||
                                  "-"
                                const tarifSatuan = Number(it.tarif_satuan_snapshot || it.tarifSatuan || 0)
                                const qty = Number(it.jumlah || 1)
                                const subtotal = Number(it.subtotal || tarifSatuan * qty)

                                return (
                                  <tr key={it.id || itIdx} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-2 px-3 text-center text-slate-400 font-medium">{itIdx + 1}</td>
                                    <td className="py-2 px-3 font-semibold text-slate-800">{namaKalibrasi}</td>
                                    <td className="py-2 px-3 text-right text-slate-600 font-medium">
                                      Rp {tarifSatuan.toLocaleString("id-ID")}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                                        {qty}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-right font-bold text-slate-900 pr-4">
                                      Rp {subtotal.toLocaleString("id-ID")}
                                    </td>
                                  </tr>
                                )
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}

          {/* Banner Total Estimasi Biaya */}
          {alatList.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 via-brand-50/20 to-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Total Estimasi Biaya Layanan Kalibrasi (PNBP):
                </span>
                <p className="text-[11px] text-slate-400">
                  Tarif resmi berdasarkan Peraturan Pemerintah Republik Indonesia terkait PNBP.
                </p>
              </div>

              <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-2 sm:pt-0 sm:pl-5">
                <span className="text-lg font-bold text-brand-800 tracking-tight">
                  Rp {grandTotalBiaya.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. INFORMASI TAGIHAN & FINANSIAL (Terintegrasi Langsung Tanpa Tab) */}
      {(permohonan?.invoice_number || permohonan?.va || hasPenawaran || permohonan?.total_harga > 0) && (
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3 bg-slate-50/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-800">
                  Informasi Pembayaran & Dokumen Finansial
                </CardTitle>
              </div>
              <Badge
                variant={isLunas ? "success" : "warning"}
                className="font-bold text-[11px]"
              >
                {isLunas ? "Lunas" : "Menunggu Pembayaran"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-400 block font-medium">Nomor Invoice:</span>
                <span className="font-semibold text-slate-900 mt-0.5 block font-mono">
                  {permohonan?.invoice_number || "Belum Diterbitkan"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Virtual Account BNI:</span>
                <span className="font-bold text-brand-700 mt-0.5 block font-mono text-sm">
                  {permohonan?.va || "Belum Terbit"}
                </span>
                {permohonan?.va_expired_at && (
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Berlaku s/d: {defaultFormatDate(permohonan.va_expired_at)}
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Total Tagihan:</span>
                <span className="font-bold text-slate-900 mt-0.5 block text-sm">
                  Rp {grandTotalBiaya.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Tombol Dokumen Finansial */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
              {hasPenawaran && openSuratPenawaran && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
                  leftIcon={<FileText className="w-3.5 h-3.5 text-indigo-600" />}
                  onClick={() => openSuratPenawaran(permohonan)}
                >
                  Lihat Surat Penawaran Biaya
                </Button>
              )}

              {permohonan?.invoice_number && openInvoice && (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Receipt className="w-3.5 h-3.5" />}
                  onClick={() => openInvoice(permohonan)}
                >
                  Buka Invoice Resmi
                </Button>
              )}

              {isLunas && openKuitansi && (
                <Button
                  size="sm"
                  variant="success"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  onClick={() => openKuitansi(permohonan)}
                >
                  Buka Kuitansi Resmi
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Backward compatibility exports
export const KalibrasiDetailPermohonanTab = KalibrasiDetailSection
export const KalibrasiDetailPelangganTab = KalibrasiDetailSection
export default KalibrasiDetailSection
