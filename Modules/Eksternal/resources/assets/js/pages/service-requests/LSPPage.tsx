import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Award, ArrowLeft, CheckCircle2, Sparkles, AlertCircle, Loader2 } from "lucide-react"
import FormLSPWizard from "../../components/input-service-requests/multiLSP/FormLSPWizard"
import { getSkemalsp } from "../../services/lsp"

const LSPPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedSkema, setSelectedSkema] = useState("")
  const [skemaList, setSkemaList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkema = async () => {
      try {
        setLoading(true)
        const data = await getSkemalsp()
        setSkemaList(data || [])
      } catch (error) {
        console.error("Gagal mengambil skema LSP", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkema()
  }, [])

  const selectedSkemaData = skemaList.find((s) => s.id === selectedSkema)

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
                Pilih Skema Uji Kompetensi
              </CardTitle>
              <CardDescription>
                Tentukan ruang lingkup sertifikasi kompetensi profesi yang ingin diajukan
              </CardDescription>
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="max-w-2xl">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Skema Sertifikasi <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedSkema}
              onChange={(e) => setSelectedSkema(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            >
              <option value="">-- Pilih Skema Sertifikasi Kompetensi --</option>
              {skemaList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.lingkup || item.nama}
                </option>
              ))}
            </select>
          </div>

          {selectedSkemaData && (
            <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-brand-900">
                  Skema Terpilih: {selectedSkemaData.lingkup || selectedSkemaData.nama}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Silakan lengkapi formulir pendaftaran peserta dan dokumen portofolio pendukung pada langkah di bawah ini.
                </p>
              </div>
            </div>
          )}

          {!selectedSkema && (
            <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2 bg-slate-50/50">
              <Award className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">
                Pilih salah satu skema sertifikasi di atas untuk memulai pengisian formulir
              </p>
              <p className="text-[11px] text-slate-400">
                Data pendaftaran akan otomatis disesuaikan dengan profil akun Anda.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Multi-step Form Wizard Container */}
      {selectedSkema && (
        <div className="animate-in fade-in-50 duration-300">
          <FormLSPWizard skemaId={selectedSkema} />
        </div>
      )}
    </div>
  )
}

export default LSPPage
