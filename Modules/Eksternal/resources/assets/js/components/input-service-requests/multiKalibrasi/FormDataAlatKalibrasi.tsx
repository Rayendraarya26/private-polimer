import React from "react"
import { KalibrasiItem } from "../../../types/kalibrasi"
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"
import { Gauge, Tag, Hash, Activity, Sliders, Layers, FileText, CheckCircle2 } from "lucide-react"

interface Props {
  item: KalibrasiItem
  index: number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

const RUANG_LINGKUP_OPTIONS = [
  "Suhu & Kelembaban (Thermocouple, Oven, Incubator)",
  "Massa & Timbangan (Analytical Balance, Anak Timbangan)",
  "Tekanan (Pressure Gauge, Vacuum Gauge, Manometer)",
  "Dimensi & Panjang (Digital Caliper, Micrometer, Dial Gauge)",
  "Kelistrikan & Waktu (Voltmeter, Ammeter, Timer/Stopwatch)",
  "Volumetrik (Pipet, Buret, Labu Ukur)",
  "Gaya & Torsi (Torque Wrench, Force Gauge, Mesin Uji Tarik)",
  "Lainnya / Ruang Lingkup Khusus",
]

const KONDISI_ALAT_OPTIONS = [
  "Baik / Berfungsi Normal",
  "Normal dengan Penyesuaian / Zero Adjustment",
  "Perlu Pemeriksaan Awal Laboratorium",
  "Alat Baru (Sebelum Digunakan)",
]

export const FormDataAlatKalibrasi: React.FC<Props> = ({ item, index, onChange }) => {
  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-600" />
            Spesifikasi Alat #{index + 1}: {item.nama_alat || "Instrumen Baru"}
          </CardTitle>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {item.ruang_lingkup ? item.ruang_lingkup.split("(")[0].trim() : "Kalibrasi"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Row 1: Nama Alat & Ruang Lingkup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Alat / Instrumen <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="nama_alat"
                value={item.nama_alat}
                onChange={onChange}
                placeholder="Contoh: Digital Vernier Caliper, Pressure Gauge"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ruang Lingkup Besaran Kalibrasi <span className="text-rose-500">*</span>
            </label>
            <select
              name="ruang_lingkup"
              value={item.ruang_lingkup}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              {RUANG_LINGKUP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Merek & Tipe/Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Merek / Pabrik Pembuat <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="merek"
                value={item.merek}
                onChange={onChange}
                placeholder="Contoh: Mitutoyo, Mettler Toledo, Wika"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tipe / Model <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="tipe_model"
              value={item.tipe_model}
              onChange={onChange}
              placeholder="Contoh: CD-6 CSX, MS204TS, PG-23"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              required
            />
          </div>
        </div>

        {/* Row 3: No Seri, Rentang Ukur & Resolusi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor Seri (Serial Number) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="no_seri"
              value={item.no_seri}
              onChange={onChange}
              placeholder="Contoh: SN-88392019"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rentang Ukur / Kapasitas <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="kapasitas_rentang"
              value={item.kapasitas_rentang}
              onChange={onChange}
              placeholder="Contoh: 0 - 150 mm, 0 - 250 °C, 0 - 10 bar"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Resolusi / Skala Terkecil <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="resolusi"
              value={item.resolusi}
              onChange={onChange}
              placeholder="Contoh: 0.01 mm, 0.1 °C, 0.1 mg"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              required
            />
          </div>
        </div>

        {/* Row 4: Jumlah, Kondisi & Dokumen Pendukung */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jumlah Unit <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="jumlah"
                min={1}
                value={item.jumlah}
                onChange={onChange}
                className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                required
              />
              <input
                type="text"
                name="satuan"
                value={item.satuan}
                onChange={onChange}
                placeholder="Unit / Set"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kondisi Fisik & Fungsi Alat <span className="text-rose-500">*</span>
            </label>
            <select
              name="kondisi_alat"
              value={item.kondisi_alat}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              {KONDISI_ALAT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manual / Sertifikat Lama (Opsional)
            </label>
            <input
              type="file"
              name="dokumen_pendukung"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={onChange}
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>
        </div>

        {/* Row 5: Keterangan Titik Kalibrasi Khusus */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Keterangan / Titik Ukur Khusus yang Diminta (Opsional)
          </label>
          <textarea
            name="keterangan"
            rows={2}
            value={item.keterangan}
            onChange={onChange}
            placeholder="Contoh: Kalibrasi pada titik 50 °C, 100 °C, dan 150 °C, atau rentang kerja harian pabrik."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default FormDataAlatKalibrasi
