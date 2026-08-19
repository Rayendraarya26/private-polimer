import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import api from "../../utils/api"
import Head from "../common/Head"
import { Card, CardContent } from "../ui/Card"
import { Loader2, ArrowLeft, Send, Save, Building2, FileUp, AlertTriangle } from "lucide-react"

export const EditFormSertifikasi: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [permohonan, setPermohonan] = useState<any>(null)
  const [form, setForm] = useState<any>({
    nama_perusahaan: "",
    alamat_kantor: "",
    kontak_person: "",
    no_telp: "",
    no_whatsapp: "",
    email: "",
  })
  const [dokLegalitas, setDokLegalitas] = useState<File | null>(null)
  const [dokManualMutu, setDokManualMutu] = useState<File | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/eksternal/sertifikasi/${id}`)
        const data = res?.data?.data
        setPermohonan(data?.permohonan)
        if (data?.form) {
          setForm({
            nama_perusahaan: data.form.nama_perusahaan || "",
            alamat_kantor: data.form.alamat_kantor || "",
            kontak_person: data.form.kontak_person || "",
            no_telp: data.form.no_telp || "",
            no_whatsapp: data.form.no_whatsapp || "",
            email: data.form.email || "",
          })
        }
      } catch (err) {
        console.error("Gagal mengambil data sertifikasi:", err)
        toast.error("Gagal memuat data permohonan")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  const handleUpdate = async (ajukanUlang: boolean = false) => {
    try {
      setSubmitting(true)
      const formData = new FormData()
      formData.append("nama_perusahaan", form.nama_perusahaan)
      formData.append("alamat_kantor", form.alamat_kantor)
      if (form.kontak_person) formData.append("kontak_person", form.kontak_person)
      if (form.no_telp) formData.append("no_telp", form.no_telp)
      formData.append("no_whatsapp", form.no_whatsapp)
      formData.append("email", form.email)

      if (dokLegalitas) formData.append("dok_legalitas", dokLegalitas)
      if (dokManualMutu) formData.append("dok_manual_mutu", dokManualMutu)

      const res = await api.post(`/eksternal/sertifikasi/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (res?.data?.success) {
        if (ajukanUlang) {
          await api.post(`/eksternal/sertifikasi/${id}/ajukan-ulang`)
          toast.success("Perbaikan berhasil dikirim ke Tim Marketing!")
        } else {
          toast.success("Perubahan data sertifikasi berhasil disimpan.")
        }
        navigate("/dashboard")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal memperbarui data permohonan")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <span className="text-xs font-medium text-slate-500">Memuat formulir koreksi sertifikasi...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <Head title="Koreksi Permohonan Sertifikasi" />

      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali
          </button>
          <h1 className="text-lg font-bold text-slate-900">Perbaikan Permohonan Sertifikasi</h1>
          <p className="text-xs text-slate-500">Nomor: #{permohonan?.no_permohonan}</p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Status: {permohonan?.status_workflow}
        </span>
      </div>

      {/* Catatan Admin jika ada revisi */}
      {permohonan?.catatan_admin && permohonan?.status_workflow === "REVISI" && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-900">Catatan Perbaikan dari Tim Marketing:</h4>
            <p className="text-xs text-amber-800 mt-0.5 whitespace-pre-line">{permohonan.catatan_admin}</p>
          </div>
        </div>
      )}

      {/* Form Editor */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardContent className="p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-600" />
            Informasi Pemohon
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Perusahaan</label>
              <input
                type="text"
                value={form.nama_perusahaan}
                onChange={(e) => setForm({ ...form, nama_perusahaan: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Kantor</label>
              <textarea
                rows={2}
                value={form.alamat_kantor}
                onChange={(e) => setForm({ ...form, alamat_kantor: e.target.value })}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kontak Person PIC</label>
              <input
                type="text"
                value={form.kontak_person}
                onChange={(e) => setForm({ ...form, kontak_person: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp PIC</label>
              <input
                type="text"
                value={form.no_whatsapp}
                onChange={(e) => setForm({ ...form, no_whatsapp: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 shadow-xs">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileUp className="w-4 h-4 text-brand-600" />
            Unggah Ulang Dokumen (Opsional jika diminta revisi)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-800 mb-1">Perbarui Dokumen Legalitas</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setDokLegalitas(e.target.files?.[0] || null)}
                className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700"
              />
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <label className="block text-xs font-bold text-slate-800 mb-1">Perbarui Manual Mutu</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setDokManualMutu(e.target.files?.[0] || null)}
                className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end items-center gap-3">
        <button
          type="button"
          onClick={() => handleUpdate(false)}
          disabled={submitting}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-all disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          Simpan Perubahan
        </button>

        {permohonan?.status_workflow === "REVISI" && (
          <button
            type="button"
            onClick={() => handleUpdate(true)}
            disabled={submitting}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Kirimkan Kembali ke Marketing
          </button>
        )}
      </div>
    </div>
  )
}

export default EditFormSertifikasi
