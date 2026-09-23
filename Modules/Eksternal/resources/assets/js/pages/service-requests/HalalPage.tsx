import React from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Button } from "../../components/ui/Button"
import { ShieldCheck, ArrowLeft, Award } from "lucide-react"
import FormHalalWizard from "../../components/input-service-requests/multiHalal/FormHalalWizard"

const HalalPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Permohonan Sertifikasi Halal (LPH BBSPJIKKP)" />

      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <Award className="w-4 h-4" />
            <span>Lembaga Pemeriksa Halal (LPH) BBSPJIKKP • Terakreditasi BPJPH Kemenag RI</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Permohonan Sertifikasi Halal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Layanan pemeriksaan dan audit kehalalan produk untuk Jalur Reguler (LPH BBSPJIKKP) maupun fasilitasi Self Declare UMK (Program SEHATI BPJPH).
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

      {/* Form Wizard Halal */}
      <FormHalalWizard />
    </div>
  )
}

export default HalalPage
