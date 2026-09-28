import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import {
  Boxes,
  CheckCircle2,
  MapPin,
  Sparkles,
  Phone,
  User,
  FileText,
  Clock,
  Gauge,
  Thermometer,
  Layers,
  Activity,
  PackageCheck,
  Receipt,
} from "lucide-react"

export interface MiniplantItem {
  id?: string
  master_miniplant_id?: string
  nama_perlakuan_snapshot?: string
  tarif_satuan_snapshot?: number
  satuan_snapshot?: string
  jumlah?: number
  subtotal?: number
  keterangan?: string
  masterMiniplant?: {
    id?: string
    nama?: string
    satuan?: string
    tarif?: number
  }
  master_miniplant?: {
    id?: string
    nama?: string
    satuan?: string
    tarif?: number
  }
}

export interface MiniplantDetailData {
  id?: string
  nama_pemohon?: string
  no_telp?: string
  alamat_pemohon?: string
  jenis_layanan_kode?: string
  jenis_layanan_nama?: string
  jasa_diminta?: "proses" | "mesin" | string
  jenis_barang?: string
  jumlah_barang?: number
  perlakuan_diminta?: string
  tekanan_nilai?: string | number
  tekanan_satuan?: string
  waktu_nilai?: string | number
  waktu_satuan?: string
  temperatur_nilai?: string | number
  temperatur_satuan?: string
  estimasi_total_biaya?: number
  items?: MiniplantItem[]
}

interface MiniplantDetailSectionProps {
  permohonan: any
  formMiniplant: MiniplantDetailData | any
  formatIndoDate: (dateStr?: string | null, withTime?: boolean, shortMonth?: boolean) => string
}

export const MiniplantDetailPermohonanTab: React.FC<MiniplantDetailSectionProps> = ({
  permohonan,
  formMiniplant,
  formatIndoDate,
}) => {
  const items: MiniplantItem[] = Array.isArray(formMiniplant?.items)
    ? formMiniplant.items
    : Array.isArray(permohonan?.form_miniplant?.[0]?.items)
      ? permohonan.form_miniplant[0].items
      : []

  const totalEstimasi =
    items.reduce((acc, it) => acc + Number(it.subtotal || 0), 0) ||
    Number(formMiniplant?.estimasi_total_biaya || 0) ||
    Number(permohonan?.total_harga || 0)

  const isMesin = formMiniplant?.jasa_diminta?.toLowerCase() === "mesin"

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">

      {/* Grid Informasi Utama (Identitas Pemohon & Detail Jasa) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Identitas Pemohon */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Identitas Pemohon
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nama Peminta Jasa:</span>
              <span className="font-semibold text-slate-900 mt-0.5 block text-sm">
                {formMiniplant?.nama_pemohon || permohonan?.creator?.name || "-"}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block font-medium">No. Telepon / WhatsApp:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {formMiniplant?.no_telp || permohonan?.creator?.phone || "-"}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block font-medium">Alamat:</span>
              <span className="font-medium text-slate-800 mt-0.5 block leading-relaxed">
                {formMiniplant?.alamat_pemohon ||
                  permohonan?.creator?.pelanggan?.detail?.alamat ||
                  "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Detail Jasa & Barang */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Detail Jasa & Barang
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block font-medium">Jasa yang Diminta:</span>
                <span className="mt-1 inline-block">
                  <Badge
                    variant="primary"
                    className="uppercase font-bold tracking-wide px-2.5 py-0.5"
                  >
                    {formMiniplant?.jasa_diminta || "Proses"}
                  </Badge>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Lingup Layanan:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formMiniplant?.jenis_layanan_nama || "-"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block font-medium">Jenis Barang / Bahan:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formMiniplant?.jenis_barang || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Jumlah Barang Diterima:</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {formMiniplant?.jumlah_barang || 1} Unit/Sampel
                </span>
              </div>
            </div>

            {/* Parameter Operasional Mesin (jika jasa mesin) */}
            {isMesin && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block font-medium mb-1.5">
                  Parameter Operasional Mesin:
                </span>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                      <Gauge className="w-3 h-3 text-brand-600" /> Tekanan
                    </span>
                    <span className="font-bold text-slate-800 text-xs block mt-0.5">
                      {formMiniplant?.tekanan_nilai
                        ? `${formMiniplant.tekanan_nilai} ${formMiniplant.tekanan_satuan || ""}`
                        : "-"}
                    </span>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-brand-600" /> Waktu
                    </span>
                    <span className="font-bold text-slate-800 text-xs block mt-0.5">
                      {formMiniplant?.waktu_nilai
                        ? `${formMiniplant.waktu_nilai} ${formMiniplant.waktu_satuan || ""}`
                        : "-"}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
                      <Thermometer className="w-3 h-3 text-brand-600" /> Temperatur
                    </span>
                    <span className="font-bold text-slate-800 text-xs block mt-0.5">
                      {formMiniplant?.temperatur_nilai
                        ? `${formMiniplant.temperatur_nilai} ${formMiniplant.temperatur_satuan || ""}`
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. Perlakuan yang Diminta (Uraian Deskripsi Proses) */}
      {formMiniplant?.perlakuan_diminta && (
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Uraian Perlakuan yang Diminta
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/80">
              {formMiniplant.perlakuan_diminta}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 4. DAFTAR PERLAKUAN YANG DIMINTA (Tabel Rincian Layanan / PNBP) */}
      <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
        <CardHeader className="border-b border-slate-100 pb-3 bg-slate-50/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Daftar Perlakuan yang Diminta
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-center w-14">No</th>
                  <th className="py-3 px-4">Nama Perlakuan</th>
                  <th className="py-3 px-4 text-right">Tarif PNBP</th>
                  <th className="py-3 px-4 text-center w-24">Jumlah</th>
                  <th className="py-3 px-4 text-right pr-6">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length > 0 ? (
                  items.map((item, idx) => {
                    const nama =
                      item.nama_perlakuan_snapshot ||
                      item.masterMiniplant?.nama ||
                      item.master_miniplant?.nama ||
                      "-"
                    const tarif = Number(item.tarif_satuan_snapshot || item.masterMiniplant?.tarif || 0)
                    const satuan = item.satuan_snapshot || item.masterMiniplant?.satuan || "unit"
                    const subtotal = Number(item.subtotal || tarif * (item.jumlah || 1))

                    return (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3 px-4 text-center text-slate-400 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 block">{nama}</span>
                          {item.keterangan && (
                            <span className="text-[11px] text-slate-500 mt-0.5 block">
                              {item.keterangan}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-medium text-slate-800">
                            Rp {tarif.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[11px] text-slate-400 block">/ {satuan}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 font-semibold text-slate-700">
                            {item.jumlah || 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900 pr-6">
                          Rp {subtotal.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                      <p className="font-medium text-xs">Belum ada rincian perlakuan yang diminta.</p>
                    </td>
                  </tr>
                )}
              </tbody>

              {items.length > 0 && (
                <tfoot className="bg-slate-50/90 border-t border-slate-200">
                  <tr>
                    <td
                      colSpan={4}
                      className="py-3.5 px-4 text-right font-bold text-slate-700 text-xs uppercase tracking-wider"
                    >
                      Total Estimasi Biaya:
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-brand-800 text-sm pr-6">
                      Rp {totalEstimasi.toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MiniplantDetailPermohonanTab
