import React from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Button } from "../../components/ui/Button"
import { Scale, ArrowLeft, Award, Sparkles } from "lucide-react"
import FormPupWizard from "../../components/input-service-requests/multiPup/FormPupWizard"

const ProfisiensiPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <Head title="Pendaftaran Uji Profisiensi Kalibrasi" />

      {/* Header & Tombol Kembali */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Scale className="w-4 h-4 text-amber-600" />
            <span>Penyelenggara Uji Profisiensi BBSPJIKKP (PUP-018-IDN / LK-005-IDN)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pendaftaran Uji Profisiensi Kalibrasi
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Kegiatan uji banding antar-laboratorium kalibrasi terakreditasi KAN untuk menjamin mutu, keabsahan hasil, dan ketertelusuran pengukuran artefak industri secara nasional.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/permohonan")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0 rounded-xl"
        >
          Kembali ke Katalog
        </Button>
      </div>

      {/* Banner Informasi Periode & Narahubung */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-50/50 to-sky-50/30 border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600 text-white shadow-xs shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 text-xs">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span>Program Penyelenggara Uji Profisiensi (PUP) Kalibrasi</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[10px]">
                PUP Terakreditasi
              </span>
            </h4>
            <p className="text-slate-600">
              Pendaftaran Early Bird & Periode 1. Dapatkan diskon paket khusus untuk pendaftaran skema kombinasi.
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600 bg-white/80 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-amber-200/60 shrink-0 self-stretch sm:self-auto">
          <span className="text-[10px] text-slate-400 block">Narahubung Pendaftaran PUP:</span>
          <span className="font-bold text-slate-800">Sekar: +62 819-3117-5338</span>
        </div>
      </div>

      {/* Wizard Form Multi-Step PUP */}
      <FormPupWizard />
    </div>
  )
}

export default ProfisiensiPage
