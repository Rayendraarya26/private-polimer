import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { GraduationCap, ArrowLeft, CheckCircle2, Sparkles, Loader2, Users, CheckCheck, ShieldCheck } from "lucide-react"
import FormPelatihanWizard from "../../components/input-service-requests/multiPelatihan/FormPelatihanWizard"
import { usePelatihanSkemaQuery } from "../../hooks/queries/useMasterQuery"

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
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Lembaga Validasi Verifikasi (LVV) BBKKP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pendaftaran Bimbingan Teknis & Pelatihan
          </h1>

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

      {/* Skema Selection Card */}
      <Card className="border-slate-200/80 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                Pilih Jenis Layanan GRK
              </CardTitle>
              <CardDescription>
                Tentukan jenis layanan yang ingin diajukan
              </CardDescription>
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="py-6 flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6 md:gap-8 lg:gap-12">

            {/* Radio Button 1 (Verifikasi) */}
            <Link to="/permohonan/grk/verifikasi" className="relative cursor-pointer group w-full md:w-1/2 max-w-[450px]">
              <div className="w-full h-full rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-brand-300 hover:shadow-md peer-checked:border-brand-600 peer-checked:bg-brand-50/80 peer-checked:shadow-brand-100 peer-checked:shadow-lg">
                <div className="w-16 h-16 smf:w-20 sm:h-20 rounded-2xl bg-brand-50 group-hover:bg-brand-100/70 peer-checked:bg-brand-100 flex items-center justify-center transition-all">
                  <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-brand-600 stroke-[2.2]" />
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">Verifikasi</p>
                  {/* <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Pemeriksaan & konfirmasi data historis GRK</p> */}
                </div>
              </div>
            </Link>

            {/* Radio Button 2 (Validasi) */}
            <Link to="/permohonan/grk/validasi" className="relative cursor-pointer group w-full md:w-1/2 max-w-[450px]">
              <div className="w-full h-full rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:border-brand-300 hover:shadow-md peer-checked:border-brand-600 peer-checked:bg-brand-50/80 peer-checked:shadow-brand-100 peer-checked:shadow-lg">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-50 group-hover:bg-brand-100/70 peer-checked:bg-brand-100 flex items-center justify-center transition-all">
                  <CheckCheck className="w-10 h-10 sm:w-12 sm:h-12 text-brand-600 stroke-[2.2]" />
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">Validasi</p>
                  {/* <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Penilaian & konfirmasi proyeksi masa depan GRK</p> */}
                </div>
              </div>
            </Link>
          </div>
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
