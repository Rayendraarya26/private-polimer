import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import {
  Award,
  Sparkles,
  ShieldCheck,
  Building2,
  UserCheck,
  Boxes,
  Package,
  Layers,
  FileText,
  Download,
  CheckCircle2,
  Store,
  Calendar,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

interface HalalDetailSectionProps {
  permohonan: any
  formHalal: any
  formatIndoDate: (dateStr?: string | null, withTime?: boolean) => string
}

export const HalalDetailPermohonanTab: React.FC<HalalDetailSectionProps> = ({
  permohonan,
  formHalal,
  formatIndoDate,
}) => {
  const isReguler = formHalal?.jalur_pendaftaran === "reguler"
  const pabrikList: any[] = Array.isArray(formHalal?.pabrik_json) ? formHalal.pabrik_json : []
  const outletList: any[] = Array.isArray(formHalal?.outlet_json) ? formHalal.outlet_json : []
  const bahanList: any[] = Array.isArray(formHalal?.bahan_json) ? formHalal.bahan_json : []
  const produkList: any[] = Array.isArray(formHalal?.produk_json) ? formHalal.produk_json : []
  const totalBiaya = Number(permohonan?.total_harga || 0)

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header Banner LPH */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-emerald-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Lembaga Pemeriksa Halal (LPH) BBSPJIKKP • Terakreditasi BPJPH</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Sertifikasi Halal {isReguler ? "Jalur Reguler (Audit LPH)" : "Jalur Self Declare (SEHATI UMK)"}
            </h3>
            <p className="text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
              Pelaku Usaha: <strong className="text-white">{formHalal?.nama_usaha || "-"}</strong> • Skala:{" "}
              <span className="capitalize">{formHalal?.skala_usaha || "Mikro"}</span>
            </p>
          </div>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-white/15 pt-3 sm:pt-0 sm:pl-5 shrink-0">
            <span className="text-[11px] text-emerald-200 block font-medium">Status Pembiayaan:</span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {!isReguler
                ? "Gratis (Fasilitasi SEHATI)"
                : totalBiaya > 0
                ? `Rp ${totalBiaya.toLocaleString("id-ID")}`
                : "Kajian Biaya LPH"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Profil Usaha & Penyelia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Profil Usaha & Penanggung Jawab */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Profil Pelaku Usaha & Penanggung Jawab
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block">Nama Usaha / Perusahaan:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formHalal?.nama_usaha || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Jalur Sertifikasi:</span>
                <Badge
                  variant="neutral"
                  className={`mt-1 font-semibold text-[11px] uppercase ${
                    isReguler
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {isReguler ? "Reguler (Audit LPH)" : "Self Declare (SEHATI)"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block">Nomor Induk Berusaha (NIB):</span>
                <span className="font-mono font-medium text-slate-800 mt-0.5 block">
                  {formHalal?.nib || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">NPWP Usaha:</span>
                <span className="font-mono font-medium text-slate-800 mt-0.5 block">
                  {formHalal?.npwp || "-"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block">Penanggung Jawab Usaha:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {formHalal?.pj_nama || "-"}
              </span>
              <div className="flex items-center gap-4 mt-1 text-slate-600">
                {formHalal?.pj_kontak && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {formHalal.pj_kontak}
                  </span>
                )}
                {formHalal?.pj_email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {formHalal.pj_email}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Data Penyelia Halal */}
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Data Penyelia Halal Perusahaan
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block">Nama Lengkap Penyelia:</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">
                  {formHalal?.penyelia_nama || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Nomor KTP / NIK:</span>
                <span className="font-mono font-medium text-slate-800 mt-0.5 block">
                  {formHalal?.penyelia_nik || "-"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block">Agama:</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {formHalal?.penyelia_agama || "Islam"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Nomor Kontak / WA:</span>
                <span className="font-mono font-medium text-slate-800 mt-0.5 block">
                  {formHalal?.penyelia_kontak || "-"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block">Surat Keputusan (SK) Penetapan:</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">
                    {formHalal?.penyelia_no_sk || "-"}{" "}
                    {formHalal?.penyelia_tgl_sk && `(Tgl: ${formatIndoDate(formHalal.penyelia_tgl_sk)})`}
                  </span>
                </div>
                {formHalal?.file_sk_penyelia && (
                  <a
                    href={`/storage/${formHalal.file_sk_penyelia}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh SK
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fasilitas Pabrik & Outlet */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Fasilitas Pabrik / Dapur Produksi & Outlet Penjualan
              </CardTitle>
            </div>
            {formHalal?.file_denah_lokasi && (
              <a
                href={`/storage/${formHalal.file_denah_lokasi}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Denah Lokasi
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              Pabrik / Tempat Produksi ({pabrikList.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pabrikList.map((p, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>{p.nama || `Fasilitas #${idx + 1}`}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      {p.status_pabrik || "Milik Sendiri"}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{p.alamat || "-"}</p>
                </div>
              ))}
            </div>
          </div>

          {outletList.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-slate-500" />
                Outlet / Cabang Penjualan ({outletList.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {outletList.map((o, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800 block">{o.nama || `Outlet #${idx + 1}`}</span>
                    <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{o.alamat || "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabel Bahan & Kemasan */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-emerald-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Daftar Bahan, Bahan Penolong & Kemasan ({bahanList.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">No</th>
                  <th className="px-4 py-2.5 font-semibold">Kategori</th>
                  <th className="px-4 py-2.5 font-semibold">Nama Bahan</th>
                  <th className="px-4 py-2.5 font-semibold">Produsen / Pemasok</th>
                  <th className="px-4 py-2.5 font-semibold">Status Halal / No. Sertifikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bahanList.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {b.jenis_bahan || "Bahan Baku"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-slate-800">{b.nama_bahan || "-"}</td>
                    <td className="px-4 py-2.5 text-slate-600">
                      <div>{b.produsen || "-"}</div>
                      {b.supplier && <div className="text-[11px] text-slate-400">Dist: {b.supplier}</div>}
                    </td>
                    <td className="px-4 py-2.5">
                      {b.is_bersertifikat ? (
                        <div>
                          <span className="text-emerald-700 font-medium font-mono text-[11px] block">
                            {b.no_sertifikat || "Bersertifikat"}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {b.lembaga_penerbit || "BPJPH"}{" "}
                            {b.tgl_berlaku && `(s/d ${formatIndoDate(b.tgl_berlaku)})`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">
                          Bahan Alami / Positif List (KMA 1360)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Produk yang Didaftarkan */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" />
            <CardTitle className="text-sm font-bold text-slate-800">
              Daftar Produk yang Dimohonkan Sertifikasi ({produkList.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">No</th>
                  <th className="px-4 py-2.5 font-semibold">Klasifikasi</th>
                  <th className="px-4 py-2.5 font-semibold">Merk</th>
                  <th className="px-4 py-2.5 font-semibold">Nama Produk & Varian</th>
                  <th className="px-4 py-2.5 font-semibold">Rincian Komposisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produkList.map((prod, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="px-4 py-2.5 text-slate-700">{prod.klasifikasi || "Makanan"}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{prod.merk || "-"}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-900">{prod.nama_produk || "-"}</td>
                    <td className="px-4 py-2.5 text-slate-500 text-[11px] max-w-xs truncate">
                      {prod.rincian || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alur Proses Produksi & Berkas Pendukung */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <CardTitle className="text-sm font-bold text-slate-800">
                  Alur Proses Produksi Halal (PPH)
                </CardTitle>
              </div>
              {formHalal?.file_alur_proses && (
                <a
                  href={`/storage/${formHalal.file_alur_proses}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Bagan Alur
                </a>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {formHalal?.alur_proses || "Belum ada uraian narasi alur proses."}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-soft">
          <CardHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-sm font-bold text-slate-800">
                Dokumen Persyaratan & Ikrar
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="font-medium text-slate-800">Surat Permohonan Resmi</span>
              </div>
              {formHalal?.file_surat_permohonan ? (
                <a
                  href={`/storage/${formHalal.file_surat_permohonan}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh
                </a>
              ) : (
                <span className="text-slate-400 text-[11px] italic">Tidak Dilampirkan</span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="font-medium text-slate-800">Manual Sistem Jaminan Halal (SJPH)</span>
              </div>
              {formHalal?.file_manual_sjph ? (
                <a
                  href={`/storage/${formHalal.file_manual_sjph}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh
                </a>
              ) : (
                <span className="text-slate-400 text-[11px] italic">Tidak Dilampirkan</span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Ikrar & Komitmen Telah Disetujui
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Pemohon telah menyetujui pernyataan bebas dari bahan haram & najis serta berkomitmen
                menjalankan SJPH secara konsisten.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
