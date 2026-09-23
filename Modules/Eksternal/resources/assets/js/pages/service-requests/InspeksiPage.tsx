import React from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Button } from "../../components/ui/Button"
import { PackageCheck, ArrowLeft } from "lucide-react"
import FormInspeksiWizard from "../../components/input-service-requests/multiInspeksi/FormInspeksiWizard"

const InspeksiPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Permohonan Jasa Inspeksi Karung Plastik" />

      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <PackageCheck className="w-4 h-4" />
            <span>Lembaga Inspeksi BBSPJIKKP (Balai Besar Kulit, Karet dan Plastik)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Permohonan Jasa Inspeksi Karung Plastik
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Layanan pengujian kuantitas & kualitas kemasan beras bantuan pangan (Banpang) Perum BULOG berstandar mutu resmi.
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

      {/* Form Wizard Inspeksi */}
      <FormInspeksiWizard />
    </div>
  )
}

export default InspeksiPage
