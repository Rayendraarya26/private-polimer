import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import {
  Toolbox,
  CheckCircle2,
  MapPin,
  Sparkles,
  Phone,
  User,
  Wrench,
  ShieldCheck,
  Calendar,
  Building2,
  Languages,
  Truck,
  Hash,
  FileCheck2,
} from "lucide-react"

interface KalibrasiDetailSectionProps {
  permohonan: any
  formKalibrasi: any
  formatIndoDate: (dateStr?: string | null, withTime?: boolean) => string
}

export const KalibrasiDetailPermohonanTab: React.FC<KalibrasiDetailSectionProps> = ({
  permohonan,
  formKalibrasi,
  formatIndoDate,
}) => {
  const alatList: any[] = Array.isArray(formKalibrasi?.alat_list)
    ? formKalibrasi.alat_list
    : Array.isArray(formKalibrasi?.alatList)
      ? formKalibrasi.alatList
      : []

  const grandTotalBiaya = Number(permohonan?.total_harga || formKalibrasi?.estimasi_total_tarif || 0)

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header Banner Laboratorium Kalibrasi */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-sky-900 text-white shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-brand-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Laboratorium Kalibrasi Terakreditasi KAN (LK-005-IDN)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Layanan Jasa Kalibrasi Alat Ukur & Uji
            </h3>
            <p className="text-xs text-brand-100/90 max-w-2xl leading-relaxed">
              Dikalibrasi oleh Laboratorium Kalibrasi BBSPJIKKP Yogyakarta dengan ketertelusuran standar nasional dan internasional (SI).
            </p>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-white/15 pt-3 sm:pt-0 sm:pl-5 shrink-0">
            <span className="text-[11px] text-brand-200 block font-medium">Estimasi Biaya PNBP:</span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              Rp {grandTotalBiaya.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {/* Ringkasan Informasi Pelaksanaan & Pengiriman */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Wrench className="w-4 h-4 text-brand-600" />
              Pelaksanaan Kalibrasi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-4 space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Lokasi Pelaksanaan:</span>
              <span className="font-semibold text-brand-700 mt-0.5 inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                {formKalibrasi?.lokasi_pelaksanaan === "Tempat Client"
                  ? "On-Site (Di Lokasi / Tempat Client)"
                  : "In-House (Laboratorium Kalibrasi BBKKP)"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Bahasa Sertifikat:</span>
              <span className="font-semibold text-slate-800 mt-0.5 inline-flex items-center gap-1">
                <Languages className="w-3.5 h-3.5 text-slate-500" />
                {formKalibrasi?.bahasa_laporan === "inggris" ? "Bahasa Inggris (English)" : "Bahasa Indonesia"}
              </span>
            </div>
            {formKalibrasi?.uraian_kalibrasi && (
              <div>
                <span className="text-slate-400 block font-medium">Catatan Khusus / Titik Uji:</span>
                <p className="font-medium text-slate-700 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 italic">
                  "{formKalibrasi.uraian_kalibrasi}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Truck className="w-4 h-4 text-brand-600" />
              Pengiriman Sertifikat Kalibrasi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-4 space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nama Penerima:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {formKalibrasi?.nama_penerima_kirim || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Alamat Tujuan Pengiriman:</span>
              <p className="font-medium text-slate-700 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 leading-relaxed">
                {formKalibrasi?.alamat_pengiriman || "-"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rincian Daftar Alat Kalibrasi */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <Toolbox className="w-4 h-4 text-brand-600" />
            Daftar Alat yang Dikalibrasi ({alatList.length} Alat)
          </CardTitle>
          <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-200">
            Total {formKalibrasi?.total_alat || alatList.length} Alat
          </Badge>
        </CardHeader>
        <CardContent className="p-5 space-y-6">
          {alatList.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Tidak ada data rincian alat kalibrasi.
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
                    : []

              return (
                <div
                  key={alat.id || idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                >
                  {/* Header Alat */}
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
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
                        <p className="text-[11px] text-slate-500">
                          {alat.merk ? `Merk: ${alat.merk}` : "Spesifikasi Alat"} • {alat.jumlah} Unit • Kondisi:{" "}
                          <span className="font-medium text-slate-700">{alat.kondisi || "Baik / Normal"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Subtotal Alat
                      </span>
                      <span className="text-xs font-bold text-brand-700">
                        Rp {Number(alat.subtotal_biaya || alat.subtotal || 0).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Nomor Seri Unit */}
                    {seriList.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 text-slate-400" />
                          Nomor Seri Unit:
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

                    {/* Parameter Kalibrasi */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-brand-600" />
                        Parameter Pengujian Kalibrasi:
                      </span>

                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                              <th className="px-3 py-2">Nama Pengujian Kalibrasi</th>
                              <th className="px-3 py-2 text-center w-20">Jumlah</th>
                              <th className="px-3 py-2 text-right w-36">Tarif Satuan (Rp)</th>
                              <th className="px-3 py-2 text-right w-36">Subtotal (Rp)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {itemList.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="px-3 py-3 text-center text-slate-400 text-xs">
                                  Belum ada parameter kalibrasi yang dipilih.
                                </td>
                              </tr>
                            ) : (
                              itemList.map((it: any, itIdx: number) => {
                                const namaKalibrasi =
                                  it.nama_kalibrasi_snapshot ||
                                  it.master_kalibrasi?.kalibrasi ||
                                  it.nama ||
                                  "-"
                                const tarifSatuan = Number(it.tarif_satuan_snapshot || it.tarifSatuan || 0)
                                const qty = Number(it.jumlah || 1)
                                const subtotal = Number(it.subtotal || tarifSatuan * qty)

                                return (
                                  <tr key={it.id || itIdx} className="hover:bg-slate-50/50">
                                    <td className="px-3 py-2 font-medium text-slate-800">{namaKalibrasi}</td>
                                    <td className="px-3 py-2 text-center text-slate-700">{qty}</td>
                                    <td className="px-3 py-2 text-right text-slate-600">
                                      {tarifSatuan.toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-3 py-2 text-right font-bold text-slate-800">
                                      {subtotal.toLocaleString("id-ID")}
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
        </CardContent>
      </Card>

      {/* Persetujuan & Pernyataan Resmi Pemohon */}
      <Card className="rounded-2xl border-slate-200 shadow-soft bg-emerald-50/30 border-emerald-200/80">
        <CardContent className="p-5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-emerald-900">
              Pernyataan Resmi Pemohon Telah Disetujui
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Pemohon menyatakan bahwa seluruh data peralatan yang diajukan dalam kondisi baik serta menyetujui ketentuan teknis kalibrasi yang berlaku di Laboratorium Kalibrasi BBSPJIKKP.
            </p>
            {formKalibrasi?.pernyataan_at && (
              <span className="text-[11px] text-emerald-600 font-medium block pt-1">
                Disetujui pada: {formatIndoDate(formKalibrasi.pernyataan_at, true)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const KalibrasiDetailPelangganTab: React.FC<KalibrasiDetailSectionProps> = ({
  permohonan,
  formKalibrasi,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Informasi Pemohon & Sertifikat */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <Building2 className="w-4 h-4 text-brand-600" />
            Informasi Pelanggan & Pemilik Sertifikat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 block font-medium">Nama Pemohon / Kontak:</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {formKalibrasi?.nama_pemohon || permohonan?.creator?.name || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Sertifikat Dibuat Untuk:</span>
              <span className="font-bold text-brand-700 text-sm mt-0.5 block">
                {formKalibrasi?.hasil_kalibrasi_untuk || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Nomor Telepon / WhatsApp:</span>
              <span className="font-semibold text-slate-800 mt-0.5 inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                {formKalibrasi?.no_telp || "-"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Email Terdaftar:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {permohonan?.creator?.email || "-"}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-400 block font-medium">Alamat Lengkap Pemohon / Instansi:</span>
              <p className="font-medium text-slate-700 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 leading-relaxed">
                {formKalibrasi?.alamat_pemohon || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
