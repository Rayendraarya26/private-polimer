import React from "react"
import { KalibrasiItem, KalibrasiSharedData } from "../../../types/kalibrasi"
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import {
  Building2,
  MapPin,
  Truck,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  Send,
  Save,
  Loader2,
  FileCheck,
  CheckCircle2,
  Gauge,
} from "lucide-react"

interface Props {
  sharedData: KalibrasiSharedData
  setSharedData: React.Dispatch<React.SetStateAction<KalibrasiSharedData>>
  items: KalibrasiItem[]
  submitting: boolean
  onBack: () => void
  onSubmit: (aksi: "draft" | "ajukan") => void
}

export const Step2InformasiPengiriman: React.FC<Props> = ({
  sharedData,
  setSharedData,
  items,
  submitting,
  onBack,
  onSubmit,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : false

    setSharedData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const totalUnit = items.reduce((acc, it) => acc + (it.jumlah || 1), 0)

  return (
    <div className="space-y-6">
      {/* 1. Ringkasan Alat yang Didaftarkan */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-4 sm:px-6">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-600" />
            Ringkasan Instrumen yang Dikalibrasi ({items.length} Jenis, Total {totalUnit} Unit)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">Nama Alat</th>
                  <th className="py-2.5 px-3">Merek / Tipe</th>
                  <th className="py-2.5 px-3">No. Seri</th>
                  <th className="py-2.5 px-3">Rentang & Resolusi</th>
                  <th className="py-2.5 px-3 text-center">Jumlah</th>
                  <th className="py-2.5 px-3">Kondisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it, idx) => (
                  <tr key={it.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{it.nama_alat || "-"}</td>
                    <td className="py-2.5 px-3">
                      {it.merek || "-"} / {it.tipe_model || "-"}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{it.no_seri || "-"}</td>
                    <td className="py-2.5 px-3">
                      {it.kapasitas_rentang || "-"} (Res: {it.resolusi || "-"})
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                      {it.jumlah || 1} {it.satuan || "Unit"}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {it.kondisi_alat || "Baik"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 2. Informasi Pemohon / Instansi */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-4 sm:px-6">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            Informasi Pemohon & Instansi Pemilik Alat
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Pemohon / Penanggung Jawab (PIC) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="nama_pemohon"
                value={sharedData.nama_pemohon}
                onChange={handleChange}
                placeholder="Nama lengkap PIC"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Perusahaan / Instansi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="nama_instansi"
                value={sharedData.nama_instansi}
                onChange={handleChange}
                placeholder="Nama badan usaha / instansi pemerintah / perorangan"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp / Kontak Aktif <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="whatsapp"
                value={sharedData.whatsapp}
                onChange={handleChange}
                placeholder="Contoh: 081234567890"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Korespondensi & Laporan <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={sharedData.email}
                onChange={handleChange}
                placeholder="alamat.email@perusahaan.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alamat Lengkap Perusahaan / Pengembalian Alat <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="alamat_lengkap"
              rows={2}
              value={sharedData.alamat_lengkap}
              onChange={handleChange}
              placeholder="Alamat lengkap, nama jalan, kota/kabupaten, dan kode pos"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Metode Kalibrasi & Penyerahan Alat */}
      <Card className="border-slate-200 shadow-2xs">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3.5 px-4 sm:px-6">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            Lokasi Kalibrasi & Penyerahan Instrumen
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lokasi Pelaksanaan Kalibrasi <span className="text-rose-500">*</span>
              </label>
              <select
                name="lokasi_kalibrasi"
                value={sharedData.lokasi_kalibrasi}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="in_lab">In-Lab (Di Laboratorium Kalibrasi BBSPJIKKP Yogyakarta)</option>
                <option value="on_site">On-Site (Petugas Kalibrasi Datang ke Lokasi Pabrik/Instansi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Metode Penyerahan / Kedatangan Alat <span className="text-rose-500">*</span>
              </label>
              <select
                name="metode_penyerahan"
                value={sharedData.metode_penyerahan}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="antar_langsung">Diantar Langsung oleh Pelanggan ke Balai</option>
                <option value="ekspedisi">Dikirim via Jasa Ekspedisi / Kurir Pengiriman</option>
                <option value="onsite_petugas">Pelaksanaan Langsung di Pabrik (Khusus On-Site)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rencana Tanggal Penyerahan / Pelaksanaan
              </label>
              <input
                type="date"
                name="tanggal_rencana"
                value={sharedData.tanggal_rencana}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Khusus / Permintaan Tambahan
              </label>
              <input
                type="text"
                name="catatan_khusus"
                value={sharedData.catatan_khusus}
                onChange={handleChange}
                placeholder="Contoh: Butuh sertifikat kalibrasi bilingual (ID/EN)"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Pakta Integritas & Persetujuan */}
      <Card className="border-emerald-200/80 bg-emerald-50/40 shadow-2xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="setuju_syarat_kalibrasi"
              name="setuju_syarat"
              checked={sharedData.setuju_syarat}
              onChange={handleChange}
              className="mt-1 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
            />
            <label htmlFor="setuju_syarat_kalibrasi" className="text-xs text-slate-700 leading-relaxed cursor-pointer select-none">
              <span className="font-bold text-slate-900 block mb-0.5">
                Pernyataan Kebenaran Data & Persetujuan Ketentuan Kalibrasi
              </span>
              Saya menyatakan bahwa seluruh spesifikasi alat ukur yang didaftarkan adalah benar dan alat dalam kondisi siap dikalibrasi. Saya menyetujui seluruh ketentuan teknis, prosedur pengujian, dan tata cara pembayaran jasa kalibrasi pada Laboratorium Kalibrasi BBSPJIKKP (LK-005-IDN).
            </label>
          </div>
        </CardContent>
      </Card>

      {/* 5. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={submitting}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          Kembali ke Daftar Alat
        </Button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSubmit("draft")}
            disabled={submitting}
            leftIcon={<Save className="w-4 h-4" />}
            className="w-full sm:w-auto border-slate-300 text-slate-700"
          >
            Simpan Draft
          </Button>

          <Button
            type="button"
            onClick={() => onSubmit("ajukan")}
            disabled={submitting || !sharedData.setuju_syarat}
            leftIcon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
          >
            {submitting ? "Memproses Permohonan..." : "Kirim Permohonan Kalibrasi"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Step2InformasiPengiriman
