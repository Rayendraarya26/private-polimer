import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { GraduationCap, ArrowLeft, CheckCircle2, Sparkles, Loader2, Users } from "lucide-react"
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
            <span>Pusat Pelatihan & Bimbingan Teknis Industri (Bimtek BBKKP)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pendaftaran Bimbingan Teknis & Pelatihan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tingkatkan keahlian SDM industri melalui program pelatihan bersertifikat di bidang polimer, karet, dan plastik.
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

      {/* Skema Selection Card */}
      <Card className="border-brand-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                Pilih Program / Skema Pelatihan
              </CardTitle>
              <CardDescription>
                Tentukan topik kurikulum bimtek atau pelatihan teknis yang ingin diikuti
              </CardDescription>
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="max-w-2xl">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Program Pelatihan <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedSkema}
              onChange={(e) => setSelectedSkema(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            >
              <option value="">-- Pilih Program Bimbingan Teknis / Pelatihan --</option>
              {skemaList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.lingkup || item.nama}
                </option>
              ))}
            </select>
          </div>

          {selectedSkemaData && (
            <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-200/80 flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-brand-900">
                    Program Terpilih: {selectedSkemaData.lingkup || selectedSkemaData.nama}
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Silakan isi data peserta dan kebutuhan akomodasi pelatihan di bawah ini.
                  </p>
                </div>
              </div>

              {kapabilitas > 0 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100/80 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-300">
                  <Users className="w-3.5 h-3.5" />
                  <span>Kapasitas: {kapabilitas} Peserta / Batch</span>
                </div>
              )}
            </div>
          )}

          {!selectedSkema && (
            <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2 bg-slate-50/50">
              <GraduationCap className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">
                Pilih salah satu program pelatihan di atas untuk membuka formulir pendaftaran
              </p>
              <p className="text-[11px] text-slate-400">
                Data pendaftaran peserta dapat diajukan secara kolektif oleh perusahaan atau perorangan.
              </p>
            </div>
          )}
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
