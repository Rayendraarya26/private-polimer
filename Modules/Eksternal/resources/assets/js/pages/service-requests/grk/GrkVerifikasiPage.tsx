// pages/service-requests/grk/GrkVerifikasiPage.tsx
import React from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../../components/common/Head"
import { Button } from "../../../components/ui/Button"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { FormGrkVerifikasiWizard } from "../../../components/input-service-requests/multiGrk/verifikasi/FormGrkVerifikasiWizard"

const GrkVerifikasiPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Pengajuan Verifikasi Gas Rumah Kaca (GRK)" />

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Lembaga Validasi & Verifikasi (LVV BBKKP)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Verifikasi Emisi Gas Rumah Kaca (GRK)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemeriksaan dan verifikasi data inventarisasi emisi GRK organisasi
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/permohonan/grk")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Kembali
        </Button>
      </div>

      {/* Wizard Form Multi-Step (Tanpa Stepper Bar) */}
      <FormGrkVerifikasiWizard />
    </div>
  )
}

export default GrkVerifikasiPage
