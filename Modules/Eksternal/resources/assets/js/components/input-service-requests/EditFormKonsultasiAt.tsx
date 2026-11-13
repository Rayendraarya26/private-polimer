import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import api from "../../utils/api"
import { getFileUrl } from "../../utils/fileHelpers"
import Head from "../common/Head"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Button } from "../ui/Button"
import { BackButton } from "../ui/BackButton"
import {
  Loader2,
  ArrowLeft,
  Send,
  Save,
  Cpu,
  FileText,
  Trash2,
  RotateCcw,
  ExternalLink,
} from "lucide-react"
import { Step1JenisLayanan } from "./MultiKonsultasiAT/Step1JenisLayanan"
import { Step2UnggahDokumen } from "./MultiKonsultasiAT/Step2UnggahDokumen"
import { RevisionBannerCallout } from "../forms"

interface ExistingDokumen {
  id: string
  nama_file_asli: string
  file_path: string
  file_extension?: string
  file_size?: number
}

const formatFileSize = (bytes?: number) => {
  if (!bytes || bytes <= 0) return "-"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export const EditFormKonsultasiAt: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [permohonan, setPermohonan] = useState<any>(null)

  const [layananKode, setLayananKode] = useState<string>("")
  const [layananLainnya, setLayananLainnya] = useState<string>("")
  const [catatanDokumen, setCatatanDokumen] = useState<string>("")
  const [existingDocs, setExistingDocs] = useState<ExistingDokumen[]>([])
  const [deletedDocIds, setDeletedDocIds] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/eksternal/konsultasi-at/${id}`)
        const formData = res?.data?.data

        if (!formData) {
          toast.error("Data permohonan konsultasi dan audit teknologi tidak ditemukan.")
          return
        }

        setPermohonan(formData.permohonan || null)
        setLayananKode(formData.layanan_kode || "")
        setLayananLainnya(formData.layanan_lainnya || "")
        setCatatanDokumen(formData.catatan_dokumen || "")
        setExistingDocs(Array.isArray(formData.dokumen) ? formData.dokumen : [])
      } catch (err: any) {
        console.error("Gagal memuat formulir konsultasi & audit teknologi:", err)
        toast.error("Gagal memuat data formulir konsultasi dan audit teknologi.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const handleToggleDeleteExistingDoc = (docId: string) => {
    setDeletedDocIds((prev) =>
      prev.includes(docId) ? prev.filter((item) => item !== docId) : [...prev, docId]
    )
  }

  const remainingExistingDocsCount = existingDocs.filter(
    (doc) => !deletedDocIds.includes(doc.id)
  ).length

  const totalDocsCount = remainingExistingDocsCount + uploadedFiles.length

  const handleSave = async (ajukan: boolean) => {
    if (!layananKode) {
      toast.error("Pilih jenis layanan konsultasi atau audit teknologi terlebih dahulu.")
      return
    }

    if (layananKode === "lainnya" && !layananLainnya.trim()) {
      toast.error("Sebutkan jenis layanan lainnya yang Anda perlukan.")
      return
    }

    if (ajukan && totalDocsCount < 1) {
      toast.error("Unggah minimal satu berkas permohonan sebelum mengajukan.")
      return
    }

    if (ajukan) {
      const isRevisi = permohonan?.status_workflow === "REVISI"
      const confirmResult = await Swal.fire({
        title: isRevisi ? "Kirimkan Perbaikan Permohonan?" : "Ajukan Permohonan Layanan?",
        text: isRevisi
          ? "Permohonan yang sudah diperbaiki akan dikirim kembali ke petugas untuk diverifikasi."
          : "Pastikan jenis layanan dan berkas yang diunggah sudah sesuai sebelum diajukan.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: isRevisi ? "Ya, Kirim Perbaikan" : "Ya, Ajukan",
        cancelButtonText: "Batal",
        confirmButtonColor: "#0f766e",
      })
      if (!confirmResult.isConfirmed) return
    }

    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append("_method", "PUT")
      formData.append("layanan_kode", layananKode)
      if (layananKode === "lainnya" && layananLainnya.trim()) {
        formData.append("layanan_lainnya", layananLainnya.trim())
      }
      if (catatanDokumen.trim()) {
        formData.append("catatan_dokumen", catatanDokumen.trim())
      }
      formData.append("aksi", ajukan ? "ajukan" : "draft")
      formData.append("is_draft", ajukan ? "0" : "1")

      deletedDocIds.forEach((docId) => {
        formData.append("deleted_dokumen_ids[]", docId)
      })
      uploadedFiles.forEach((file) => {
        formData.append("dokumen[]", file)
      })

      const res = await api.post(`/eksternal/konsultasi-at/${id}`, formData)

      toast.success(
        res?.data?.message ||
          (ajukan
            ? "Permohonan konsultasi dan audit teknologi berhasil diajukan!"
            : "Perubahan draft berhasil disimpan!")
      )

      navigate(`/permohonan/detail/${id}`)
    } catch (err: any) {
      console.error("Gagal menyimpan perubahan konsultasi AT:", err)
      const validationErrors = err?.response?.data?.errors
      if (validationErrors) {
        const firstKey = Object.keys(validationErrors)[0]
        const firstMsg = validationErrors[firstKey]?.[0]
        toast.error(firstMsg || "Periksa kembali isian formulir Anda.")
      } else {
        toast.error(err?.response?.data?.message || "Gagal menyimpan perubahan permohonan.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-sm font-medium">Memuat formulir Konsultasi & Audit Teknologi...</p>
      </div>
    )
  }

  const isRevisi = permohonan?.status_workflow === "REVISI"

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <Head title={`Permohonan Konsultasi & Audit Teknologi ${permohonan?.no_permohonan ? `#${permohonan.no_permohonan}` : ""}`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Cpu className="w-4 h-4" />
            <span>Layanan Konsultasi & Audit Teknologi</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Permohonan Konsultasi & Audit Teknologi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lengkapi atau perbarui pilihan layanan, catatan, dan berkas pendukung sebelum diajukan ke petugas.
          </p>
        </div>

        <BackButton to="/dashboard" />
      </div>

      {isRevisi && (
        <RevisionBannerCallout
          catatan={
            permohonan?.catatan_revisi ||
            permohonan?.catatan_admin ||
            "Mohon periksa dan perbaiki data atau berkas permohonan sesuai catatan verifikator sebelum mengajukan kembali."
          }
          petugas={permohonan?.petugas_verifikasi || permohonan?.verified_by_name || "Verifikator Layanan"}
          tanggal={permohonan?.tgl_verifikasi || permohonan?.updated_at}
        />
      )}

      {/* Step 1: Pilih Layanan */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <Step1JenisLayanan
          layananKode={layananKode}
          setLayananKode={setLayananKode}
          layananLainnya={layananLainnya}
          setLayananLainnya={setLayananLainnya}
        />
      </div>

      {/* Berkas yang Sudah Diunggah Sebelumnya */}
      {existingDocs.length > 0 && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              Berkas Tersimpan ({remainingExistingDocsCount} aktif)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2.5">
            {existingDocs.map((doc) => {
              const isMarkedDelete = deletedDocIds.includes(doc.id)
              const fileUrl = getFileUrl(doc.file_path)

              return (
                <div
                  key={doc.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
                    isMarkedDelete
                      ? "bg-red-50/60 border-red-200 opacity-75"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold truncate ${
                          isMarkedDelete ? "line-through text-red-700" : "text-slate-800"
                        }`}
                      >
                        {doc.nama_file_asli}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {doc.file_extension?.toUpperCase() || "FILE"} • {formatFileSize(doc.file_size)}
                        {isMarkedDelete && " • Akan dihapus saat disimpan"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {fileUrl && !isMarkedDelete && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-brand-700 bg-white border border-slate-200 hover:bg-brand-50 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Lihat
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleDeleteExistingDoc(doc.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isMarkedDelete
                          ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                          : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                      }`}
                    >
                      {isMarkedDelete ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          Batalkan Hapus
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />
                          Hapus
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Unggah Berkas Baru & Catatan */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <Step2UnggahDokumen
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          catatanDokumen={catatanDokumen}
          setCatatanDokumen={setCatatanDokumen}
        />
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/permohonan/detail/${id}`)}
          disabled={submitting}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="h-[42px] px-5 rounded-xl font-medium"
        >
          Batal
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSave(false)}
            disabled={submitting}
            leftIcon={<Save className="w-4 h-4" />}
            className="h-[42px] px-5 rounded-xl font-medium"
          >
            Simpan Draft Perubahan
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => handleSave(true)}
            disabled={submitting}
            isLoading={submitting}
            leftIcon={<Send className="w-4 h-4" />}
            className="h-[42px] px-6 rounded-xl font-semibold shadow-md shadow-brand-500/15"
          >
            {isRevisi ? "Kirimkan Perbaikan ke Petugas" : "Ajukan Permohonan"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditFormKonsultasiAt

