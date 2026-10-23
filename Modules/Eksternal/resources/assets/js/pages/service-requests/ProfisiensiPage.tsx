import React from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Button } from "../../components/ui/Button"
import { Scale, ArrowLeft, Award, Phone } from "lucide-react"
import FormPupWizard from "../../components/input-service-requests/multiPup/FormPupWizard"

const ProfisiensiPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-12">
      <Head title="Pendaftaran Uji Profisiensi Kalibrasi" />

      {/* Header & Tombol Kembali */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Scale className="w-4 h-4 text-brand-600" />
            <span>Penyelenggara Uji Profisiensi BBSPJIKKP (PUP-018-IDN / LK-005-IDN)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pendaftaran Uji Profisiensi Kalibrasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl leading-relaxed">
            Kegiatan uji banding antar-laboratorium kalibrasi terakreditasi KAN untuk menjamin mutu, keabsahan hasil, dan ketertelusuran pengukuran artefak industri secara nasional.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/permohonan")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0 rounded-xl px-4 py-2 text-xs font-semibold border-slate-300 hover:bg-slate-50 text-slate-700"
        >
          Kembali ke Permohonan
        </Button>
      </div>

      {/* Banner Informasi Periode & Narahubung */}
      <div className="p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-brand-600 text-white shadow-xs flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Program Penyelenggara Uji Profisiensi (PUP) Kalibrasi
            </h4>
            <p className="text-slate-600 leading-relaxed max-w-2xl">
              Pendaftaran Early Bird & Periode 1. Dapatkan diskon paket khusus untuk pendaftaran skema kombinasi.
            </p>
          </div>
        </div>

        {/* Card Narahubung Interaktif */}
        <a
          href="https://wa.me/6281931175338"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 bg-slate-50/80 hover:bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-brand-400 shadow-2xs hover:shadow-xs transition-all shrink-0 self-stretch sm:self-auto"
          title="Hubungi Narahubung via WhatsApp"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="text-[10px] text-slate-400 block font-medium">Narahubung Pendaftaran PUP:</span>
            <span className="font-bold text-slate-800 group-hover:text-brand-700 transition-colors">
              Sekar: +62 819-3117-5338
            </span>
          </div>
        </a>
      </div>

      {/* Wizard Form Multi-Step PUP */}
      <FormPupWizard />
    </div>
  )
}

export default ProfisiensiPage
