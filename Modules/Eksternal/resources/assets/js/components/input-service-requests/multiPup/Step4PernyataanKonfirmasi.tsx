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
    <Card className="border-brand-100 shadow-sm animate-in fade-in-50 duration-300">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Pernyataan & Ringkasan Pendaftaran
            </CardTitle>
            <CardDescription>
              Periksa kembali rincian data pendaftaran uji profisiensi sebelum menyetujui pernyataan dan mengirim formulir
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* 1. Ringkasan Data Lab & Narahubung */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              Identitas Laboratorium Kalibrasi
            </h4>
            <div className="text-xs space-y-1.5 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Nama Laboratorium:</span>
                <span className="font-semibold text-slate-800">{formData.nama_lab_kalibrasi || "-"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Alamat & Lokasi:</span>
                <span className="text-slate-700 leading-relaxed">
                  {formData.alamat_lab_kalibrasi || "-"} ({formData.kota_kabupaten_lab || "-"})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Email Resmi Lab:</span>
                <span className="text-slate-700">{formData.email_official_lab || "-"}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <User className="w-4 h-4 text-brand-600" />
              Informasi Kontak & Pengesah
            </h4>
            <div className="text-xs space-y-1.5 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Narahubung Operasional:</span>
                <span className="font-semibold text-slate-800">
                  {formData.nama_narahubung || "-"} ({formData.no_wa_narahubung || "-"})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Personil Penandatangan / Pengesah:</span>
                <span className="font-semibold text-slate-800">
                  {formData.nama_personil_pengesah || "-"} ({formData.jabatan_personil_pengesah || "-"})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Email Pemohon:</span>
                <span className="text-slate-700">{formData.email_pemohon || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Tabel Rincian Skema & Pembiayaan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Rincian Skema Uji Profisiensi & Tagihan
            </h4>
            <span className="text-[11px] text-slate-500">
              Total {formData.skema_items.length} skema dipilih
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3.5 w-12 text-center">No</th>
                  <th className="py-2.5 px-3.5">Skema Uji Profisiensi</th>
                  <th className="py-2.5 px-3.5">Metode Acuan Kalibrasi</th>
                  <th className="py-2.5 px-3.5 text-right w-40">Tarif PNBP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.skema_items.map((it, idx) => (
                  <tr key={it.kode_skema} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3.5 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3.5">
                      <div className="font-semibold text-slate-800">{it.nama_skema}</div>
                      {it.is_in_situ && (
                        <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                          In Situ (Yogyakarta)
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 font-mono text-[11px]">
                      {it.metode_kalibrasi_acuan || <span className="text-slate-400 italic">Belum diisi</span>}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-slate-800">
                      Rp {it.tarif_pnbp.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}

                {/* Baris Diskon Bundling */}
                {isBundleEligible && (
                  <tr className="bg-emerald-50/80 text-emerald-800 font-semibold border-t border-emerald-100">
                    <td colSpan={3} className="py-2.5 px-3.5 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Potongan Diskon Bundling (Paket Centrifuge + Overhead Stirrer)</span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-emerald-700">
                      -Rp {diskonNominal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                )}

                {/* Baris Total Bersih */}
                <tr className="bg-slate-900 text-white font-extrabold text-sm border-t border-slate-900">
                  <td colSpan={3} className="py-3 px-3.5 uppercase tracking-wider text-xs">
                    Total Biaya Keikutsertaan Uji Profisiensi
                  </td>
                  <td className="py-3 px-3.5 text-right text-base text-white">
                    Rp {totalBersih.toLocaleString("id-ID")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Komitmen & Pernyataan Resmi */}
        <div className="p-4.5 rounded-xl border border-brand-200 bg-brand-50/40 space-y-3.5">
          <div className="border-b border-brand-100 pb-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Pernyataan & Komitmen Pemohon
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Mohon baca dengan saksama dan centang seluruh pernyataan di bawah ini untuk menyelesaikan pendaftaran
            </p>
          </div>

          <div className="space-y-3">
            {/* Checkbox 1 */}
            <div className="p-3 bg-white rounded-xl border border-brand-200/80 shadow-2xs">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.pernyataan_en_score}
                  onChange={(e) => onChange("pernyataan_en_score", e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5 shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 text-xs">
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

            {/* Checkbox 2 */}
            <div className="p-3 bg-white rounded-xl border border-brand-200/80 shadow-2xs">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.pernyataan_proposal}
                  onChange={(e) => onChange("pernyataan_proposal", e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 mt-0.5 shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 text-xs">
                    Pernyataan Kepatuhan Proposal & Pelunasan Pembayaran <span className="text-rose-500">*</span>
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Dengan ditandatanganinya formulir pendaftaran ini, kami menyatakan telah membaca dan memahami proposal uji profisiensi BBSPJIKKP serta bersedia mengikuti kegiatan uji profisiensi BBSPJIKKP sesuai kesepakatan dan melunasi biaya pendaftaran sesuai ketentuan.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step4PernyataanKonfirmasi
