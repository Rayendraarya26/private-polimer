import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import {
  FlaskConical,
  CheckCircle2,
  Sparkles,
  User,
  Building2,
  Calendar,
  Layers,
  FileText,
  CreditCard,
  Languages,
  Eye,
  CheckSquare,
  Package,
} from "lucide-react"

interface PengujianDetailSectionProps {
  permohonan: any
  formPengujian: any
  formatIndoDate: (dateStr?: string | null, withTime?: boolean) => string
}

export const PengujianDetailPermohonanTab: React.FC<PengujianDetailSectionProps> = ({
  permohonan,
  formPengujian,
  formatIndoDate,
}) => {
  const samples: any[] = Array.isArray(formPengujian?.samples)
    ? formPengujian.samples
    : []

  const totalBiaya = Number(permohonan?.harga_permohonan || formPengujian?.total_estimasi_biaya || 0)

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header Banner Laboratorium Pengujian */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-teal-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Laboratorium Pengujian Mutu Terakreditasi KAN (LP-057-IDN)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Permohonan Pengujian Laboratorium BBKKP
            </h3>
            <p className="text-xs text-teal-100/90 max-w-2xl leading-relaxed">
              Pengujian mutu komoditas bahan kulit, karet, plastik, alas kaki, dan polimer komposit sesuai standar SNI, ASTM, dan ISO.
            </p>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-white/15 pt-3 sm:pt-0 sm:pl-5 shrink-0">
            <span className="text-[11px] text-teal-200 block font-medium">Total Biaya PNBP:</span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              Rp {totalBiaya.toLocaleString("id-ID")}
            </span>
            <span className="text-[10px] text-teal-200/80">
              {formPengujian?.kategori_tarif === "mahasiswa_pp54" ? "Tarif Mahasiswa (PP 54)" : "Tarif Umum"}
            </span>
          </div>
        </div>
      </div>

      {/* Rincian Sampel & Parameter Uji */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            Daftar Sampel & Parameter Uji Terpilih ({samples.length} Sampel)
          </h4>
        </div>

        {samples.length === 0 ? (
          <Card className="p-8 text-center border-slate-200">
            <p className="text-xs text-slate-500">Belum ada data sampel yang terlampir.</p>
          </Card>
        ) : (
          samples.map((sample: any, idx: number) => {
            const parameters: any[] = Array.isArray(sample?.parameters) ? sample.parameters : []
            return (
              <Card key={sample?.id || idx} className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {sample?.urutan || idx + 1}
                      </span>
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-900">
                          {sample?.nama_sampel || `Sampel #${idx + 1}`}
                        </CardTitle>
                        <span className="text-[11px] text-slate-500">
                          Bentuk: {sample?.bentuk_sampel || "-"} | Kondisi: {sample?.kondisi_sampel || "Baik"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {sample?.jumlah_sampel || 1} {sample?.satuan_sampel || "Pcs"}
                      </Badge>
                      {sample?.no_lot_bets && (
                        <Badge variant="secondary" className="text-xs">
                          Lot: {sample.no_lot_bets}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px]">
                          <th className="py-2.5 px-3">No</th>
                          <th className="py-2.5 px-3">Parameter Uji</th>
                          <th className="py-2.5 px-3">Metode Acuan</th>
                          <th className="py-2.5 px-3">Satuan</th>
                          <th className="py-2.5 px-3 text-right">Tarif</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {parameters.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-3 text-center text-slate-400">
                              Tidak ada parameter uji spesifik.
                            </td>
                          </tr>
                        ) : (
                          parameters.map((param: any, pIdx: number) => (
                            <tr key={param?.id || pIdx} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-2.5 px-3 font-medium text-slate-400">{pIdx + 1}</td>
                              <td className="py-2.5 px-3 font-semibold text-slate-900">
                                {param?.nama_parameter || param?.nama || "-"}
                                {param?.kode_parameter && (
                                  <span className="block text-[10px] text-slate-400 font-normal">
                                    {param.kode_parameter}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600">{param?.metode_uji || "SNI / Acuan Balai"}</td>
                              <td className="py-2.5 px-3 text-slate-600">{param?.satuan || "Per Parameter"}</td>
                              <td className="py-2.5 px-3 text-right font-medium text-slate-900">
                                Rp {Number(param?.tarif || 0).toLocaleString("id-ID")}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-slate-200 font-semibold bg-slate-50/50">
                          <td colSpan={4} className="py-2.5 px-3 text-slate-700 text-right">
                            Subtotal Sampel:
                          </td>
                          <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                            Rp {Number(sample?.subtotal || 0).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Informasi Tambahan Permintaan Uji */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <FileText className="w-4 h-4 text-emerald-600" />
            Preferensi & Keterangan Pengujian
          </CardTitle>
          <Badge variant="outline">
            {formPengujian?.bahasa_laporan === "en" ? "Laporan Bahasa Inggris" : "Laporan Bahasa Indonesia"}
          </Badge>
        </CardHeader>
        <CardContent className="p-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <span className="text-slate-400 block font-medium">Bahasa Laporan Hasil (LHU):</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {formPengujian?.bahasa_laporan === "en" ? "Bahasa Inggris (English)" : "Bahasa Indonesia"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Metode Pembayaran:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block capitalize">
                {formPengujian?.cara_pembayaran?.replace(/_/g, " ") || "Transfer"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Evaluasi Kesesuaian Spesifikasi:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {formPengujian?.permintaan_evaluasi ? "Ya, Dievaluasi" : "Tidak"}
              </span>
            </div>
            {formPengujian?.catatan_evaluasi && (
              <div className="sm:col-span-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px] font-medium">Standar Acuan Evaluasi:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{formPengujian.catatan_evaluasi}</p>
              </div>
            )}
            <div>
              <span className="text-slate-400 block font-medium">Menyaksikan Pengujian di Lab:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {formPengujian?.menyaksikan_uji ? "Ya, Hadir Menyaksikan" : "Tidak"}
              </span>
            </div>
            {formPengujian?.catatan_menyaksikan && (
              <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px] font-medium">Jadwal & Personil yang Hadir:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{formPengujian.catatan_menyaksikan}</p>
              </div>
            )}
            {formPengujian?.no_surat_pengantar && (
              <div>
                <span className="text-slate-400 block font-medium">Nomor Surat Pengantar:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{formPengujian.no_surat_pengantar}</span>
              </div>
            )}
            {formPengujian?.tgl_surat_pengantar && (
              <div>
                <span className="text-slate-400 block font-medium">Tgl Surat Pengantar:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formatIndoDate(formPengujian.tgl_surat_pengantar)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
