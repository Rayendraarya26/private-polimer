import React from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Button } from "../../components/ui/Button"
import { FlaskConical, ArrowLeft } from "lucide-react"
import FormPengujianWizard from "../../components/input-service-requests/multiPengujian/FormPengujianWizard"

const PengujianPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Permohonan Pengujian Laboratorium" />

      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Laboratorium Pengujian Mutu Terakreditasi KAN (LP-057-IDN)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Permohonan Pengujian Laboratorium
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Layanan uji mutu fisika, kimia, dan mekanik untuk komoditas karet, plastik, kulit, alas
            kaki, dan tekstil sesuai standar nasional (SNI) dan internasional (ASTM/ISO/DIN).
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/permohonan")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0 font-medium"
        >
          Kembali ke Katalog Layanan
        </Button>
      </div>

      {/* 4-Step Self-Service Wizard */}
      <FormPengujianWizard />
    </div>
  )
}

export default PengujianPage
