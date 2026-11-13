import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import {
  FlaskConical,
  User,
  Phone,
  FileText,
  FileCheck2,
  Eye,
  Package,
} from "lucide-react"
import { getFileUrl } from "../../utils/fileHelpers"
import { formatAddress } from "../../utils/string"

export interface PengujianDetailSectionProps {
  permohonan: any
  formPengujian: any
  formatIndoDate: (dateStr?: string | null, withTime?: boolean) => string
  openPdfDoc?: (url: string, title: string, filename?: string) => void
}

export const PengujianDetailSection: React.FC<PengujianDetailSectionProps> = ({
  permohonan,
  formPengujian,
  formatIndoDate,
  openPdfDoc,
}) => {
  const samples: any[] = Array.isArray(formPengujian?.samples)
    ? formPengujian.samples
    : []

  const totalBiaya = Number(
    permohonan?.harga_permohonan ||
    permohonan?.total_harga ||
    formPengujian?.total_estimasi_biaya ||
    0
  )

  const namaPemohon =
    formPengujian?.diajukan_oleh ||
    formPengujian?.nama_pemohon ||
    permohonan?.creator?.pelanggan?.nama ||
    permohonan?.creator?.name ||
    "-"

  const rawAlamatPemohon =
    formPengujian?.alamat_pemohon ||
    permohonan?.creator?.pelanggan?.detail?.alamat ||
    ""
  const alamatPemohon = rawAlamatPemohon ? formatAddress(rawAlamatPemohon) : "-"

  const docEntries = [
    formPengujian?.file_surat_pengantar
      ? {
          key: "file_surat_pengantar",
          label: "Surat Pengantar Permohonan Pengujian",
          path: formPengujian.file_surat_pengantar,
        }
      : null,
    formPengujian?.file_ktm
      ? {
          key: "file_ktm",
          label: "Kartu Tanda Mahasiswa (KTM)",
          path: formPengujian.file_ktm,
        }
      : null,
  ].filter((item): item is { key: string; label: string; path: string } =>
    Boolean(item && typeof item.path === "string")
  )

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. GRID INFORMASI UTAMA: Identitas Pemohon & Detail Pelaksanaan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Identitas Pemohon & Pelanggan */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Identitas Pemohon & Pelanggan
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nama Pemohon / Perusahaan:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block text-sm">
                {namaPemohon}
              </span>
            </div>

            {formPengujian?.laporan_dialamatkan_kepada && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block font-medium">Laporan Hasil Uji (LHU) Dialamatkan Kepada:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block text-xs leading-relaxed">
                  {formatAddress(formPengujian.laporan_dialamatkan_kepada)}
                </span>
              </div>
            )}

            {formPengujian?.biaya_ditanggung_oleh && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block font-medium">Biaya Ditanggung Oleh:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formPengujian.biaya_ditanggung_oleh}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">No. Telepon / WhatsApp:</span>
                <span className="font-semibold text-slate-800 mt-0.5 inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {formPengujian?.no_telp || permohonan?.creator?.phone || "-"}
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
                {alamatPemohon}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Detail Pelaksanaan & Preferensi Pengujian */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-800">
                  Preferensi & Keterangan Pengujian
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-[11px]">
                {formPengujian?.kategori_tarif === "mahasiswa_pp54"
                  ? "Tarif Mahasiswa (PP 54)"
                  : "Tarif Umum"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block font-medium">Bahasa Laporan Hasil (LHU):</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formPengujian?.bahasa_laporan === "en"
                    ? "Bahasa Inggris (English)"
                    : "Bahasa Indonesia"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Metode Pembayaran:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block capitalize">
                  {formPengujian?.cara_pembayaran?.replace(/_/g, " ") || "Transfer"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">Evaluasi Kesesuaian Spesifikasi:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formPengujian?.permintaan_evaluasi ? "Ya, Dievaluasi" : "Tidak"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Menyaksikan Pengujian di Lab:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formPengujian?.menyaksikan_uji ? "Ya, Hadir Menyaksikan" : "Tidak"}
                </span>
              </div>
            </div>

            {formPengujian?.catatan_evaluasi && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px] font-medium">Standar Acuan Evaluasi:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{formPengujian.catatan_evaluasi}</p>
              </div>
            )}

            {formPengujian?.catatan_menyaksikan && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px] font-medium">Jadwal & Personil yang Hadir:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{formPengujian.catatan_menyaksikan}</p>
              </div>
            )}

            {(formPengujian?.no_surat_pengantar || formPengujian?.tgl_surat_pengantar) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                {formPengujian?.no_surat_pengantar && (
                  <div>
                    <span className="text-slate-400 block font-medium">Nomor Surat Pengantar:</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {formPengujian.no_surat_pengantar}
                    </span>
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
            )}

            {formPengujian?.keterangan_permintaan && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block font-medium">Keterangan Permintaan:</span>
                <p className="font-medium text-slate-700 mt-0.5 leading-relaxed">
                  {formPengujian.keterangan_permintaan}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 2. RINCIAN SAMPEL & PARAMETER UJI */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Daftar Sampel & Parameter Uji Terpilih
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs font-semibold">
            {samples.length} Sampel
          </Badge>
        </CardHeader>

        <CardContent className="p-5 space-y-5">
          {samples.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <p className="text-xs text-slate-500">Belum ada data sampel yang terlampir.</p>
            </div>
          ) : (
            samples.map((sample: any, idx: number) => {
              const parameters: any[] = Array.isArray(sample?.parameters) ? sample.parameters : []
              return (
                <div
                  key={sample?.id || idx}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                >
                  <div className="bg-slate-50/80 border-b border-slate-200/80 py-3.5 px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {sample?.urutan || idx + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {sample?.nama_sampel || `Sampel #${idx + 1}`}
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Bentuk: {sample?.bentuk_sampel || "-"} | Kondisi: {sample?.kondisi_sampel || "Baik"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs bg-white">
                          {sample?.jumlah_sampel || 1} {sample?.satuan_sampel || "Pcs"}
                        </Badge>
                        {sample?.no_lot_bets && (
                          <Badge variant="secondary" className="text-xs">
                            Lot: {sample.no_lot_bets}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                            <th className="py-2.5 px-3 w-12 text-center">No</th>
                            <th className="py-2.5 px-3">Parameter Uji</th>
                            <th className="py-2.5 px-3">Metode Acuan</th>
                            <th className="py-2.5 px-3">Satuan</th>
                            <th className="py-2.5 px-3 text-right">Tarif</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {parameters.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-4 text-center text-slate-400">
                                Tidak ada parameter uji spesifik.
                              </td>
                            </tr>
                          ) : (
                            parameters.map((param: any, pIdx: number) => (
                              <tr key={param?.id || pIdx} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-2.5 px-3 text-center font-medium text-slate-400">{pIdx + 1}</td>
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
                          <tr className="border-t border-slate-200 font-semibold bg-slate-50/70">
                            <td colSpan={4} className="py-2.5 px-3 text-slate-700 text-right">
                              Subtotal Sampel:
                            </td>
                            <td className="py-2.5 px-3 text-right text-brand-700 font-bold">
                              Rp {Number(sample?.subtotal || 0).toLocaleString("id-ID")}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {sample?.catatan_khusus && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <span className="text-slate-400 block text-[11px] font-medium">Catatan Khusus Sampel:</span>
                        <p className="font-medium text-slate-700 mt-0.5">{sample.catatan_khusus}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* Banner Total Estimasi Biaya (Solid, tanpa gradasi) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Total Estimasi Biaya Layanan Pengujian (PNBP):
              </span>
              <p className="text-[11px] text-slate-400">
                {formPengujian?.kategori_tarif === "mahasiswa_pp54"
                  ? "Menggunakan skema Tarif Mahasiswa (PP 54)."
                  : "Tarif resmi berdasarkan Peraturan Pemerintah Republik Indonesia terkait PNBP."}
              </p>
            </div>

            <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-5">
              <span className="text-lg font-bold text-brand-800 tracking-tight">
                Rp {totalBiaya.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. DOKUMEN PENDUKUNG (JIKA ADA) */}
      {docEntries.length > 0 && (
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <FileCheck2 className="w-4 h-4 text-brand-600" />
              Dokumen Pendukung Pengujian
            </CardTitle>
            <span className="text-xs text-slate-500 font-medium">
              {docEntries.length} Dokumen Terunggah
            </span>
          </CardHeader>
          <CardContent className="p-5 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {docEntries.map((doc) => (
                <div
                  key={doc.key}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-brand-50/40 hover:border-brand-300 transition-all flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-brand-600 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="font-semibold text-slate-800 block truncate">{doc.label}</span>
                      <span className="text-[10px] text-slate-400 block truncate">Berkas Digital</span>
                    </div>
                  </div>
                  {openPdfDoc && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 group-hover:text-brand-600 group-hover:border-brand-200 transition-all shrink-0 ml-2"
                      onClick={() =>
                        openPdfDoc(
                          getFileUrl(doc.path),
                          doc.label,
                          `${doc.key}-${permohonan?.no_permohonan || permohonan?.id || "doc"}.pdf`
                        )
                      }
                      title="Buka Pratinjau Berkas"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export const PengujianDetailPermohonanTab = PengujianDetailSection
export default PengujianDetailSection
