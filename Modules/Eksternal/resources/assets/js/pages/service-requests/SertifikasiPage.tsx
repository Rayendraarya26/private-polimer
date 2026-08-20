import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Award, ArrowLeft, CheckCircle2, Sparkles, AlertCircle, Loader2 } from "lucide-react"
import FormLSPWizard from "../../components/input-service-requests/multiLSP/FormLSPWizard"
import { useLspSkemaQuery } from "../../hooks/queries/useMasterQuery"
import Step1JenisPermohonan from "../../components/sertifikasi/JenisPermohonan"
import Step2KategoriSertifikat from "../../components/sertifikasi/KategoriSertifikat"
import Step3KondisiPerusahaan from "../../components/sertifikasi/KondisiPerusahaan"
import Step4Pernyataan from "../../components/sertifikasi/Pernyataan"

const SertifikasiPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)




  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Pengajuan Sertifikasi Profesi (LSP)" />

      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pendaftaran Sertifikasi
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Kami melayani berbagai jenis sertifikasi untuk mendukung pemenuhan standar dan kredibilitas perusahaan Anda. Layanan kami mencakup Sertifikasi Sistem Manajemen (Mutu, Lingkungan, K3, dan Keamanan Pangan), HACCP, Sertifikasi Produk, hingga Sertifikasi Industri Hijau.
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

      {/* Progress Stepper Card */}
      <Card className="border-brand-100 shadow-sm">
        <CardHeader className="pt-6 pb-5 border-b border-slate-100 bg-slate-50/30">
          <div className="flex justify-between items-start w-full relative">
            {/* Connecting Line */}
            <div className="absolute top-4 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 z-0"></div>

            {/* Steps */}
            {[
              { num: 1, label: "Jenis Permohonan" },
              { num: 2, label: "Kategori Sertifikat" },
              { num: 3, label: "Kondisi Perusahaan" },
              { num: 4, label: "Pernyataan" },
            ].map((step, idx) => {
              const isActive = currentStep >= step.num;
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center w-1/4 px-1 transition-all duration-300">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-sm transition-colors duration-300 ${
                      isActive
                        ? "bg-brand-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step.num}
                  </div>
                  <div className={`mt-2.5 text-[11px] leading-tight text-center transition-colors duration-300 ${isActive ? "font-semibold text-brand-700" : "font-medium text-slate-500"}`}>
                    {step.label}
                  </div>
                </div>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Konten untuk langkah yang aktif ditempatkan di sini */}
          {currentStep === 1 && (
            <Step1JenisPermohonan onNext={() => setCurrentStep(2)} />
          )}
          {currentStep === 2 && (
            <Step2KategoriSertifikat onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />
          )}
          {currentStep === 3 && (
            <Step3KondisiPerusahaan onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />
          )}
          {currentStep === 4 && (
            <Step4Pernyataan onBack={() => setCurrentStep(3)} />
          )}

        </CardContent>
      </Card>


    </div>
  )
}

export default SertifikasiPage
