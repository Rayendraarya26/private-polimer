import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { GraduationCap, ArrowLeft, CheckCircle2, Sparkles, Loader2, Users, CheckCheck, ShieldCheck } from "lucide-react"
import FormPelatihanWizard from "../../../components/input-service-requests/multiPelatihan/FormPelatihanWizard"
import { usePelatihanSkemaQuery } from "../../../hooks/queries/useMasterQuery"

const PelatihanPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedSkema, setSelectedSkema] = useState("")

  const { data: skemaList = [], isLoading: loading } = usePelatihanSkemaQuery()

  const selectedSkemaData = skemaList.find((s: any) => s.id === selectedSkema)
  const kapabilitas = selectedSkemaData?.kapabilitas ?? 0

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Pengajuan Bimbingan Teknis & Pelatihan" />

      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Validasi Emisi Gas Rumah Kaca (GRK)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Layanan verifikasi gas rumah kaca BBKKP
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/permohonan/grk")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0"
        >
          Kembali
        </Button>
      </div>

      {/* Skema Selection Card */}
      <Card className="border-brand-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Pilih Skema Emisi Gas Rumah Kaca
              </CardTitle>
              <CardDescription>
                Tentukan topik kurikulum bimtek atau pelatihan teknis yang ingin diikuti
              </CardDescription>
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">

        </CardContent>
      </Card>

      {/* Multi-step Form Wizard Container */}
      {selectedSkema && (
        <div className="animate-in fade-in-50 duration-300">
          <FormPelatihanWizard skemaId={selectedSkema} kapabilitas={kapabilitas} />
        </div>
      )}
    </div>
  )
}

export default PelatihanPage
