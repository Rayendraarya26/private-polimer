import React from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Button } from "../../components/ui/Button"
import { Award, ArrowLeft } from "lucide-react"
import FormLSPWizard from "../../components/input-service-requests/multiLSP/FormLSPWizard"

const LSPPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Pengajuan Sertifikasi Profesi (LSP)" />

      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Award className="w-4 h-4" />
            <span>Lembaga Sertifikasi Profesi (LSP BBKKP)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pendaftaran Sertifikasi Kompetensi Profesi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ajukan uji kompetensi profesi terakreditasi BNSP untuk perorangan maupun delegasi instansi/perusahaan.
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
          Kembali
        </Button>
      </div>

      {/* Multi-step Form Wizard */}
      <FormLSPWizard />
    </div>
  )
}

export default LSPPage
