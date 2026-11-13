import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../utils/api"
import EditFormPelatihan from "./EditFormPelatihan"
import EditFormLSP from "./EditFormLSP"
import EditFormSertifikasi from "./EditFormSertifikasi"
import EditFormKalibrasi from "./EditFormKalibrasi"
import EditFormMiniplant from "./EditFormMiniplant"
import EditFormKonsultasiAt from "./EditFormKonsultasiAt"
import EditFormGrkVerifikasi from "./EditFormGrkVerifikasi"
import EditFormGrkValidasi from "./EditFormGrkValidasi"
import EditFormAset from "./EditFormAset"
import Head from "../common/Head"
import { Card } from "../ui/Card"
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
        const data = response?.data
        const detail = data?.results?.detail || data?.data?.detail || data?.detail || data?.data

        let detectedType = detail?.formable_type || ""

        // Deteksi dari nomor permohonan (CERT, LSP, REG/TRN/UMK, LABKAL, ASET, GRK)
        const noPermohonan = detail?.no_permohonan || ""
        if (!detectedType && noPermohonan) {
          if (noPermohonan.includes("GRK-VAL")) detectedType = "FormGrkValidasi"
          else if (noPermohonan.includes("GRK-VER") || noPermohonan.includes("GRK")) detectedType = "FormGrkVerifikasi"
          else if (noPermohonan.includes("ASET")) detectedType = "FormAset"
          else if (noPermohonan.startsWith("CERT") || noPermohonan.startsWith("SRT")) detectedType = "FormSertifikasi"
          else if (noPermohonan.startsWith("LSP")) detectedType = "FormLsp"
          else if (noPermohonan.startsWith("REG") || noPermohonan.startsWith("TRN") || noPermohonan.startsWith("UMK")) detectedType = "FormPelatihan"
          else if (noPermohonan.includes("LABKAL") || noPermohonan.startsWith("KAL")) detectedType = "FormKalibrasi"
          else if (
            noPermohonan.endsWith("/F") ||
            noPermohonan.endsWith("/RPK") ||
            noPermohonan.endsWith("/PA") ||
            noPermohonan.endsWith("/MKP")
          ) detectedType = "FormMiniplant"
          else if (noPermohonan.endsWith("/KAT") || noPermohonan.includes("/KAT")) detectedType = "FormKonsultasiAt"
        }

        // Deteksi dari form_data jika formable_type tidak terdefinisi
        if (!detectedType && detail?.form_data) {
          if (detail.form_data.skema_lsp_id || detail.form_data.no_skema_lsp) {
            detectedType = "FormLsp"
          } else if (detail.form_data.skema_pelatihan_id || detail.form_data.jadwal_pelatihan) {
            detectedType = "FormPelatihan"
          } else if (
            detail.form_data.jenis_pengajuan ||
            detail.form_data.pabrik_json ||
            detail.form_data.komoditas_json ||
            detail.form_data.items
          ) {
            detectedType = "FormSertifikasi"
          }
        }

        // Deteksi dari nama lingkup layanan
        if (!detectedType && detail?.lingkup_layanan) {
          const lNama = (detail.lingkup_layanan.nama || detail.lingkup_layanan.lingkup || "").toLowerCase()
          if (lNama.includes("validasi") && lNama.includes("grk")) detectedType = "FormGrkValidasi"
          else if (lNama.includes("grk")) detectedType = "FormGrkVerifikasi"
          else if (lNama.includes("aset")) detectedType = "FormAset"
          else if (lNama.includes("lsp") || lNama.includes("profesi")) detectedType = "FormLsp"
          else if (lNama.includes("pelatihan") || lNama.includes("bimtek")) detectedType = "FormPelatihan"
          else if (lNama.includes("sertifikasi") || lNama.includes("sni")) detectedType = "FormSertifikasi"
          else if (lNama.includes("kalibrasi") || lNama.includes("labkal")) detectedType = "FormKalibrasi"
          else if (lNama.includes("miniplant")) detectedType = "FormMiniplant"
          else if (lNama.includes("konsultasi") || lNama.includes("audit teknologi")) detectedType = "FormKonsultasiAt"
        }

        // Fallback: probing endpoint spesifik
        if (!detectedType) {
          try {
            const asetRes = await api.get(`/eksternal/aset/${id}`)
            if (asetRes?.data?.success || asetRes?.data?.data) {
              detectedType = "FormAset"
            }
          } catch (eAset) {
            try {
              const certRes = await api.get(`/eksternal/sertifikasi/${id}`)
              if (certRes?.data?.success || certRes?.data?.data) {
                detectedType = "FormSertifikasi"
              }
            } catch (e) {
              try {
                const pelRes = await api.get(`/eksternal/pelatihan/${id}`)
                if (pelRes?.data?.success || pelRes?.data?.data) {
                  detectedType = "FormPelatihan"
                }
              } catch (err) {
                try {
                  const kalRes = await api.get(`/eksternal/kalibrasi/${id}`)
                  if (kalRes?.data?.success || kalRes?.data?.data) {
                    detectedType = "FormKalibrasi"
                  }
                } catch (e2) {
                  try {
                    const miniRes = await api.get(`/eksternal/miniplant/${id}`)
                    if (miniRes?.data?.status === "success" || miniRes?.data?.data) {
                      detectedType = "FormMiniplant"
                    }
                  } catch (e3) {
                    try {
                      const katRes = await api.get(`/eksternal/konsultasi-at/${id}`)
                      if (katRes?.data?.status === "success" || katRes?.data?.data) {
                        detectedType = "FormKonsultasiAt"
                      }
                    } catch (e4) {
                      // ignore
                    }
                  }
                }
              }
            }
          }
        }

        setFormType(detectedType || "FormSertifikasi")
      } catch (error) {
        console.error("Gagal mengambil data permohonan:", error)
        try {
          const certRes = await api.get(`/eksternal/sertifikasi/${id}`)
          if (certRes?.data?.success || certRes?.data?.data) {
            setFormType("FormSertifikasi")
            return
          }
        } catch (e) {
          // ignore
        }
        setFormType("FormSertifikasi")
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

  const normalizedType = (formType || "").toLowerCase()

  // FORM GRK VALIDASI
  if (normalizedType.includes("grkvalidasi") || normalizedType.includes("grk-val")) {
    return <EditFormGrkValidasi />
  }

  // FORM GRK VERIFIKASI
  if (normalizedType.includes("grkverifikasi") || normalizedType.includes("grk-ver") || normalizedType.includes("grk")) {
    return <EditFormGrkVerifikasi />
  }

  // FORM SEWA ASET
  if (normalizedType.includes("aset") || normalizedType.includes("formaset")) {
    return <EditFormAset />
  }

  // FORM PELATIHAN
  if (normalizedType.includes("pelatihan") || normalizedType.includes("training") || normalizedType.includes("bimtek")) {
    return <EditFormPelatihan />
  }

  // FORM LSP
  if (normalizedType.includes("lsp") || normalizedType.includes("profesi") || normalizedType.includes("kompetensi")) {
    return <EditFormLSP />
  }

  // FORM KALIBRASI
  if (
    normalizedType.includes("kalibrasi") ||
    normalizedType.includes("labkal") ||
    normalizedType.includes("formkalibrasi")
  ) {
    return <EditFormKalibrasi />
  }

  // FORM MINIPLANT
  if (
    normalizedType.includes("miniplant") ||
    normalizedType.includes("formminiplant")
  ) {
    return <EditFormMiniplant />
  }

  // FORM KONSULTASI & AUDIT TEKNOLOGI
  if (
    normalizedType.includes("konsultasi") ||
    normalizedType.includes("formkonsultasiat")
  ) {
    return <EditFormKonsultasiAt />
  }

  // FORM SERTIFIKASI
  if (
    normalizedType.includes("sertifikasi") ||
    normalizedType.includes("sni") ||
    normalizedType.includes("lspro") ||
    normalizedType.includes("produk")
  ) {
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
