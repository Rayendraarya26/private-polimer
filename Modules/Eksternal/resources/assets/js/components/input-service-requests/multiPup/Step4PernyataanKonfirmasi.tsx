import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import {
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
} from "lucide-react"
import { PupFormData } from "../../../types/pup"

interface Step4Props {
  formData: PupFormData
  onChange: (field: keyof PupFormData, value: any) => void
}

export const Step4PernyataanKonfirmasi: React.FC<Step4Props> = ({ formData, onChange }) => {
  // Hitung diskon bundling Centrifuge + Overhead Stirrer
  const hasCentrifuge = formData.skema_items.some(
    (it) => it.slug === "centrifuge" || it.kode_skema === "UP-CENTRIFUGE"
  )
  const hasOverhead = formData.skema_items.some(
    (it) => it.slug === "overhead_stirrer" || it.kode_skema === "UP-OVERHEAD-STIRRER"
  )
  const isBundleEligible = hasCentrifuge && hasOverhead

  const totalKotor = formData.skema_items.reduce((acc, it) => acc + (it.tarif_pnbp || 0), 0)
  const diskonNominal = isBundleEligible ? 1000000 : 0
  const totalBersih = Math.max(0, totalKotor - diskonNominal)

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* 1. Ringkasan Data Lab & Narahubung */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="bg-slate-50/70 pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-slate-800">
            <Building2 className="w-4 h-4 text-brand-600" />
            1. Ringkasan Identitas Laboratorium & Narahubung
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Laboratorium Kalibrasi:</span>
                <span className="font-bold text-slate-800">{formData.nama_lab_kalibrasi || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Alamat & Lokasi:</span>
                <span className="text-slate-700 leading-relaxed">
                  {formData.alamat_lab_kalibrasi || "-"} ({formData.kota_kabupaten_lab || "-"})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Email Resmi Lab:</span>
                <span className="text-slate-700">{formData.email_official_lab || "-"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-400 block text-[10px]">Narahubung Operasional:</span>
                <span className="font-bold text-slate-800">
                  {formData.nama_narahubung || "-"} ({formData.no_wa_narahubung || "-"})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Personil Penandatangan / Pengesah:</span>
                <span className="font-bold text-slate-800">
                  {formData.nama_personil_pengesah || "-"} ({formData.jabatan_personil_pengesah || "-"})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Email Pemohon:</span>
                <span className="text-slate-700">{formData.email_pemohon || "-"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Tabel Rincian Skema & Pembiayaan */}
      <Card className="border-brand-100 shadow-xs">
        <CardHeader className="bg-gradient-to-r from-brand-50/40 to-white pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            2. Rincian Skema Uji Profisiensi & Tagihan
          </CardTitle>
          <CardDescription>
            Rincian paket skema kalibrasi artefak yang didaftarkan dan perhitungan tarif PNBP
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold w-10 text-center">No</th>
                  <th className="py-2.5 px-3 font-semibold">Skema Uji Profisiensi</th>
                  <th className="py-2.5 px-3 font-semibold">Metode Acuan Kalibrasi</th>
                  <th className="py-2.5 px-3 font-semibold text-right w-36">Tarif PNBP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.skema_items.map((it, idx) => (
                  <tr key={it.kode_skema} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800">{it.nama_skema}</div>
                      {it.is_in_situ && (
                        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                          In Situ (Yogyakarta)
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                      {it.metode_kalibrasi_acuan || <span className="text-slate-400 italic">Belum diisi</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                      Rp {it.tarif_pnbp.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}

                {/* Baris Diskon Bundling */}
                {isBundleEligible && (
                  <tr className="bg-emerald-50/70 text-emerald-800">
                    <td colSpan={3} className="py-2.5 px-3 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Potongan Diskon Bundling (Paket Centrifuge + Overhead Stirrer)</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700">
                      -Rp {diskonNominal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                )}

                {/* Baris Total Bersih */}
                <tr className="bg-slate-900 text-white font-extrabold text-sm">
                  <td colSpan={3} className="py-3 px-3 uppercase tracking-wider">
                    Total Biaya Keikutsertaan Uji Profisiensi
                  </td>
                  <td className="py-3 px-3 text-right text-base text-white">
                    Rp {totalBersih.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 3. Komitmen & Pernyataan Resmi */}
      <Card className="border-amber-200 bg-amber-50/30 shadow-xs">
        <CardHeader className="bg-amber-50/70 pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            3. Komitmen & Pernyataan Resmi Pemohon
          </CardTitle>
          <CardDescription className="text-amber-800/80">
            Mohon baca dengan saksama dan centang seluruh pernyataan di bawah ini untuk menyelesaikan pendaftaran
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          {/* Checkbox 1: Evaluasi En score 1 bulan */}
          <div className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.pernyataan_en_score}
                onChange={(e) => onChange("pernyataan_en_score", e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 mt-0.5 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800">
                  Pernyataan Batas Waktu Pengiriman Hasil Kalibrasi (Evaluasi Nilai En Score) <span className="text-rose-500">*</span>
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Sebagai peserta, kami telah memahami konsekuensi dari pernyataan berikut:{" "}
                  <em>
                    "Apabila dalam waktu 1 bulan setelah melakukan kalibrasi artefak namun peserta belum mengirimkan hasil, maka PUP BBSPJIKKP berhak tidak memasukkan peserta tersebut dalam evaluasi En score."
                  </em>
                </p>
              </div>
            </label>
          </div>

          {/* Checkbox 2: Persetujuan Proposal & Pembayaran */}
          <div className="p-3 bg-white rounded-xl border border-amber-200/80 shadow-2xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={formData.pernyataan_proposal}
                onChange={(e) => onChange("pernyataan_proposal", e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 mt-0.5 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800">
                  Pernyataan Kepatuhan Proposal & Pelunasan Pembayaran <span className="text-rose-500">*</span>
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Dengan ditandatanganinya formulir pendaftaran ini, kami menyatakan telah membaca dan memahami proposal uji profisiensi BBSPJIKKP tahun 2025 serta bersedia mengikuti kegiatan uji profisiensi BBSPJIKKP sesuai kesepakatan dan melunasi biaya pendaftaran sesuai ketentuan.
                </p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Step4PernyataanKonfirmasi
