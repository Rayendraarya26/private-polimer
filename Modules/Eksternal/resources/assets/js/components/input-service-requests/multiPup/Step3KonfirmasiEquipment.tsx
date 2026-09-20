import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import {
  Wrench,
  Thermometer,
  Gauge,
  Timer,
  Ruler,
  Eye,
  CheckCircle2,
  Info,
} from "lucide-react"
import { PupFormData, PupEquipmentConfirmation } from "../../../types/pup"

interface Step3Props {
  formData: PupFormData
  onChange: (field: keyof PupFormData, value: any) => void
}

export const Step3KonfirmasiEquipment: React.FC<Step3Props> = ({ formData, onChange }) => {
  const eq = formData.konfirmasi_equipment || {}

  const updateEq = (section: keyof PupEquipmentConfirmation, data: any) => {
    onChange("konfirmasi_equipment", {
      ...eq,
      [section]: {
        ...(eq[section] || {}),
        ...data,
      },
    })
  }

  // Cek apakah skema tertentu dipilih
  const selectedCodes = formData.skema_items.map((it) => it.kode_skema)

  const hasTermometer = selectedCodes.some((code) =>
    [
      "UP-THERMO-GELAS",
      "UP-THERMO-DIGITAL-1",
      "UP-THERMO-DIGITAL-2",
      "UP-THERMO-DIGITAL-3",
    ].includes(code)
  )
  const hasAutoclave = selectedCodes.includes("UP-AUTOCLAVE")
  const hasPressureGauge = selectedCodes.some((code) =>
    ["UP-PRESSURE-PNEUMATIK", "UP-PRESSURE-HIDROLIK"].includes(code)
  )
  const hasCaliper = selectedCodes.includes("UP-CALIPER")
  const hasStopwatch = selectedCodes.includes("UP-STOPWATCH")
  const hasSpektro = selectedCodes.includes("UP-SPEKTROFOTOMETER")

  const needsAnyEquipment =
    hasTermometer ||
    hasAutoclave ||
    hasPressureGauge ||
    hasCaliper ||
    hasStopwatch ||
    hasSpektro

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header Penjelasan */}
      <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 shadow-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-sky-900">Konfirmasi Sumber Daya Equipment Laboratorium</h4>
          <p className="text-slate-600 leading-relaxed">
            Formulir di bawah ini hanya menampilkan konfirmasi peralatan untuk skema uji profisiensi yang Anda pilih pada Langkah 2, guna memastikan laboratorium Anda dapat menjalankan protokol uji profisiensi dengan baik.
          </p>
        </div>
      </div>

      {!needsAnyEquipment && (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2 bg-slate-50/50">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <p className="text-sm font-bold text-slate-800">
            Tidak Memerlukan Konfirmasi Peralatan Khusus
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Skema uji profisiensi yang Anda pilih tidak memerlukan pengisian detail spesifikasi peralatan tambahan. Silakan klik tombol <strong>"Selanjutnya"</strong> untuk meninjau rincian biaya dan persetujuan pernyataan.
          </p>
        </div>
      )}

      {/* 1. SEKSI TERMOMETER */}
      {hasTermometer && (
        <Card className="border-brand-100 shadow-xs">
          <CardHeader className="bg-gradient-to-r from-brand-50/40 to-white pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-800">
              <Thermometer className="w-4 h-4 text-brand-600" />
              Konfirmasi Equipment: Skema UP Kalibrasi Termometer (Gelas / Digital)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Ice point */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Apakah laboratorium melakukan pengukuran <em>ice point</em> untuk setiap layanan kalibrasi termometer yang diberikan? <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-4">
                {[
                  { val: true, label: "Ya" },
                  { val: false, label: "Tidak" },
                ].map((opt) => (
                  <label key={String(opt.val)} className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="termo_ice_point"
                      checked={eq.termometer?.ice_point === opt.val}
                      onChange={() => updateEq("termometer", { ice_point: opt.val })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Media kalibrasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Media yang digunakan untuk kalibrasi artefak UP (dapat pilih lebih dari satu): <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  "Ice point",
                  "Waterbath/Oilbath/Silicon bath/Salt bath",
                  "Dryblock calibrator/Dry Well",
                  "Furnace",
                  "Lainnya",
                ].map((media) => {
                  const currentMedia = eq.termometer?.media_kalibrasi || []
                  const checked = currentMedia.includes(media)
                  return (
                    <label key={media} className="inline-flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition-colors">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...currentMedia, media]
                            : currentMedia.filter((m: string) => m !== media)
                          updateEq("termometer", { media_kalibrasi: updated })
                        }}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>{media}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Kedalaman & Rentang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jika menggunakan dryblock/well/furnace, berapa cm kedalaman maksimal sensor?
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 15 cm"
                  value={eq.termometer?.kedalaman_sensor_cm || ""}
                  onChange={(e) => updateEq("termometer", { kedalaman_sensor_cm: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sebutkan rentang ukur suhu yang dapat dilakukan:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: -20 °C s.d. 300 °C"
                  value={eq.termometer?.rentang_suhu || ""}
                  onChange={(e) => updateEq("termometer", { rentang_suhu: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 2. SEKSI AUTOCLAVE */}
      {hasAutoclave && (
        <Card className="border-amber-100 shadow-xs">
          <CardHeader className="bg-gradient-to-r from-amber-50/40 to-white pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-800">
              <Wrench className="w-4 h-4 text-amber-600" />
              Konfirmasi Equipment: Skema UP Kalibrasi Autoclave
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Pengukuran Parameter Suhu pada Kalibrasi Autoclave: <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-1.5">
                {[
                  "Menggunakan 1 unit data logger suhu",
                  "Menggunakan beberapa data logger suhu",
                  "Menggunakan sensor berbentuk wire",
                  "Tidak melakukan pengukuran parameter suhu autoclave",
                ].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition-colors">
                    <input
                      type="radio"
                      name="autoclave_suhu"
                      checked={eq.autoclave?.metode_suhu === opt}
                      onChange={() => updateEq("autoclave", { metode_suhu: opt })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Pengukuran Parameter Tekanan pada Kalibrasi Autoclave: <span className="text-rose-500">*</span>
              </label>
              <div className="space-y-1.5">
                {[
                  "Menggunakan 1 unit data logger tekanan",
                  "Menggunakan beberapa unit data logger tekanan",
                  "Melepas indikator tekanan kemudian mengkalibrasi sebagai pressure gauge",
                  "Tidak melakukan pengukuran parameter tekanan autoclave",
                ].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition-colors">
                    <input
                      type="radio"
                      name="autoclave_tekanan"
                      checked={eq.autoclave?.metode_tekanan === opt}
                      onChange={() => updateEq("autoclave", { metode_tekanan: opt })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 3. SEKSI PRESSURE GAUGE */}
      {hasPressureGauge && (
        <Card className="border-sky-100 shadow-xs">
          <CardHeader className="bg-gradient-to-r from-sky-50/40 to-white pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-800">
              <Gauge className="w-4 h-4 text-sky-600" />
              Konfirmasi Equipment: Skema UP Kalibrasi Pressure Gauge
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Kemampuan kalibrasi yang dapat dilakukan terkait lingkup tekanan: <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-4">
                {["Pressure Gauge Pneumatik", "Pressure Gauge Hidrolik"].map((p) => {
                  const currentP = eq.pressure_gauge?.kemampuan_tekanan || []
                  return (
                    <label key={p} className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentP.includes(p)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...currentP, p]
                            : currentP.filter((item: string) => item !== p)
                          updateEq("pressure_gauge", { kemampuan_tekanan: updated })
                        }}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>{p}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Media tekanan yang tersedia di laboratorium Anda: <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {["Udara", "Silicon oil", "Air", "Alkohol"].map((med) => {
                  const currentM = eq.pressure_gauge?.media_tekanan || []
                  return (
                    <label key={med} className="inline-flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                      <input
                        type="checkbox"
                        checked={currentM.includes(med)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...currentM, med]
                            : currentM.filter((item: string) => item !== med)
                          updateEq("pressure_gauge", { media_tekanan: updated })
                        }}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>{med}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={eq.pressure_gauge?.pernyataan_media || false}
                  onChange={(e) => updateEq("pressure_gauge", { pernyataan_media: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500 mt-0.5"
                />
                <span className="text-[11px] text-amber-900 font-medium leading-relaxed">
                  Dengan ini saya menyatakan telah memahami keharusan menggunakan media tekanan yang sesuai dengan jenis artefak pada skema UP yang didaftarkan.
                </span>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. SEKSI DIGITAL CALIPER */}
      {hasCaliper && (
        <Card className="border-indigo-100 shadow-xs">
          <CardHeader className="bg-gradient-to-r from-indigo-50/40 to-white pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-800">
              <Ruler className="w-4 h-4 text-indigo-600" />
              Konfirmasi Equipment: Skema UP Kalibrasi Digital Caliper
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-xs">
            <label className="block font-semibold text-slate-700 mb-1.5">
              Alat standar digital caliper yang dimiliki laboratorium: <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-4">
              {["Gauge block", "Caliper checker"].map((std) => {
                const currentStd = eq.digital_caliper?.alat_standar || []
                return (
                  <label key={std} className="inline-flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                    <input
                      type="checkbox"
                      checked={currentStd.includes(std)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...currentStd, std]
                          : currentStd.filter((item: string) => item !== std)
                        updateEq("digital_caliper", { alat_standar: updated })
                      }}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>{std}</span>
                  </label>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5. SEKSI STOPWATCH DIGITAL */}
      {hasStopwatch && (
        <Card className="border-emerald-100 shadow-xs">
          <CardHeader className="bg-gradient-to-r from-emerald-50/40 to-white pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-800">
              <Timer className="w-4 h-4 text-emerald-600" />
              Konfirmasi Equipment: Skema UP Kalibrasi Stopwatch Digital
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Alat standar stopwatch digital yang dimiliki laboratorium: <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Signal generator",
                  "Frequency counter",
                  "Stopwatch standar",
                  "Kamera dengan shutter speed lebih cepat dari 1/1000 detik (1000 FPS)",
                ].map((std) => {
                  const currentStd = eq.stopwatch?.alat_standar || []
                  return (
                    <label key={std} className="inline-flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                      <input
                        type="checkbox"
                        checked={currentStd.includes(std)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...currentStd, std]
                            : currentStd.filter((item: string) => item !== std)
                          updateEq("stopwatch", { alat_standar: updated })
                        }}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>{std}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sebutkan nilai U95 pada CMC (satuan detik): <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: 0.05 detik"
                value={eq.stopwatch?.u95_cmc_detik || ""}
                onChange={(e) => updateEq("stopwatch", { u95_cmc_detik: e.target.value })}
                className="w-full sm:w-80 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 6. SEKSI SPEKTROFOTOMETER UV-VIS */}
      {hasSpektro && (
        <Card className="border-purple-100 shadow-xs">
          <CardHeader className="bg-gradient-to-r from-purple-50/40 to-white pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-800">
              <Eye className="w-4 h-4 text-purple-600" />
              Konfirmasi Equipment: Skema UP Kalibrasi Spektrofotometer UV-Vis
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            {/* Filter Holmium */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Apakah laboratorium memiliki filter standar Holmium? <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {["Ya, glass filter", "Ya, liquid filter", "Tidak memiliki holmium"].map((opt) => (
                  <label key={opt} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="filter_holmium"
                      checked={eq.spektrofotometer?.filter_holmium === opt}
                      onChange={() => updateEq("spektrofotometer", { filter_holmium: opt })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Didymium */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Apakah laboratorium memiliki filter standar Didymium? <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {["Ya, glass filter", "Ya, liquid filter", "Tidak memiliki didymium"].map((opt) => (
                  <label key={opt} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="filter_didymium"
                      checked={eq.spektrofotometer?.filter_didymium === opt}
                      onChange={() => updateEq("spektrofotometer", { filter_didymium: opt })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Akurasi Fotometrik 590 nm */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Apakah laboratorium dapat melakukan kalibrasi akurasi fotometrik pada panjang gelombang 590 nm? <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-4">
                {[
                  { val: true, label: "Ya" },
                  { val: false, label: "Tidak" },
                ].map((opt) => (
                  <label key={String(opt.val)} className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="akurasi_590"
                      checked={eq.spektrofotometer?.kalibrasi_akurasi_590nm === opt.val}
                      onChange={() => updateEq("spektrofotometer", { kalibrasi_akurasi_590nm: opt.val })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Step3KonfirmasiEquipment
