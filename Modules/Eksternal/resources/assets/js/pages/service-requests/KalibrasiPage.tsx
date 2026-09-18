import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Button } from "../../components/ui/Button"
import { Gauge, ArrowLeft } from "lucide-react"
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
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Gauge className="w-4 h-4" />
            <span>Laboratorium Kalibrasi BBSPJIKKP (LK-005-IDN)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Permintaan Kalibrasi
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


      {/* Form Wizard Kalibrasi */}
      <FormKalibrasiWizard />
    </div>
  )
}

export default KalibrasiPage
