import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../utils/api"
import EditFormPelatihan from "./EditFormPelatihan"
import EditFormLSP from "./EditFormLSP"
import EditFormSertifikasi from "./EditFormSertifikasi"
import Head from "../common/Head"
import { Card, CardContent } from "../ui/Card"
import { Button } from "../ui/Button"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

const EditFormRouter: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [formType, setFormType] = useState<string | null>(null)

  useEffect(() => {
    const fetchPermohonan = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/eksternal/permohonan/${id}`)
        const detail = response?.data?.results?.detail
        const formableType = detail?.formable_type || ""
        setFormType(formableType)
      } catch (error) {
        console.error("Gagal mengambil data permohonan:", error)
        setFormType(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPermohonan()
    }
  }, [id])

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <span className="text-xs font-medium text-slate-500">Memuat data permohonan...</span>
      </div>
    )
  }

  const normalizedType = formType?.toLowerCase() || ""

  // FORM PELATIHAN
  if (normalizedType.includes("formpelatihan")) {
    return <EditFormPelatihan />
  }

  // FORM LSP
  if (normalizedType.includes("formlsp")) {
    return <EditFormLSP />
  }

  // FORM SERTIFIKASI
  if (normalizedType.includes("formsertifikasi")) {
    return <EditFormSertifikasi />
  }

  // FALLBACK
  return (
    <div className="max-w-xl mx-auto py-12">
      <Head title="Koreksi Permohonan" />
      <Card className="text-center p-8 space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Formulir Layanan Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mt-1">
            Jenis formulir <code className="text-brand-600 font-mono">{formType || "Unknown"}</code> belum didukung untuk mode perbaikan interaktif.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mx-auto"
        >
          Kembali ke Dashboard
        </Button>
      </Card>
    </div>
  )
}

export default EditFormRouter
