import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Gauge, ArrowLeft, CheckCircle2, Sparkles, Sliders, ShieldCheck } from "lucide-react"
import FormKalibrasiWizard from "../../components/input-service-requests/multiKalibrasi/FormKalibrasiWizard"

const KALIBRASI_CATEGORIES = [
  { id: "suhu", name: "Kalibrasi Suhu & Kelembaban", desc: "Thermocouple, Thermometer Digital, Oven, Incubator, Waterbath" },
  { id: "massa", name: "Kalibrasi Massa & Timbangan", desc: "Timbangan Elektronik/Analitik, Anak Timbangan Standar (F1, F2, M1)" },
  { id: "tekanan", name: "Kalibrasi Tekanan", desc: "Pressure Gauge, Manometer, Vacuum Gauge, Test Gauge" },
  { id: "dimensi", name: "Kalibrasi Dimensi & Panjang", desc: "Vernier Caliper, Micrometer, Dial Indicator, Penggaris Presisi" },
  { id: "kelistrikan", name: "Kalibrasi Kelistrikan & Waktu", desc: "Digital Multimeter, Clamp Meter, Insulation Tester, Stopwatch" },
  { id: "volumetrik", name: "Kalibrasi Volumetrik", desc: "Micropipette, Buret, Labu Ukur, Gelas Ukur" },
  { id: "umum", name: "Semua Kategori / Kalibrasi Multi-Besaran", desc: "Pengajuan beberapa alat ukur lintas besaran dalam satu permohonan" },
]

const KalibrasiPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedKategori, setSelectedKategori] = useState("umum")

  const selectedData = KALIBRASI_CATEGORIES.find((c) => c.id === selectedKategori)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Permintaan Kalibrasi Instrumen" />

      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <Gauge className="w-4 h-4" />
            <span>Laboratorium Kalibrasi BBSPJIKKP (LK-005-IDN)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Permintaan Layanan Kalibrasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Layanan kalibrasi alat ukur industri terakreditasi KAN dengan jaminan ketertelusuran standar nasional & internasional.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/permohonan")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0"
        >
          Kembali ke Katalog
        </Button>
      </div>

      {/* Kategori Besaran Kalibrasi Selection Card */}
      <Card className="border-emerald-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-slate-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Kategori Besaran / Ruang Lingkup Kalibrasi
              </CardTitle>
              <CardDescription>
                Pilih fokus kategori besaran alat ukur atau pilih multi-besaran untuk mendaftarkan berbagai jenis alat sekaligus
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100/70 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>LK-005-IDN</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="max-w-2xl">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kategori Besaran Utama <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              {KALIBRASI_CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {selectedData && (
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-emerald-950">
                    Lingkup Terpilih: {selectedData.name}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedData.desc}. Anda dapat menambahkan satu atau beberapa unit instrumen pada formulir wizard di bawah.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Multi-step Form Wizard Container */}
      <div className="animate-in fade-in-50 duration-300">
        <FormKalibrasiWizard skemaId={selectedKategori} />
      </div>
    </div>
  )
}

export default KalibrasiPage
