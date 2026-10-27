import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import api from "../../utils/api"
import Head from "../common/Head"
import { Card, CardContent } from "../ui/Card"
import { Loader2, ArrowLeft, Send, Save, Building2, FileUp } from "lucide-react"
import { FormField, TextInput, TextareaInput, RevisionBannerCallout, DropzoneUploader } from "../forms"
import { Button } from "../ui/Button"

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dashboard
          </button>
          <h1 className="text-lg font-bold text-slate-900">Perbaikan Permohonan Sertifikasi</h1>
          <p className="text-xs text-slate-500">Nomor Registrasi: #{permohonan?.no_permohonan}</p>
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
            Status: {permohonan?.status_workflow}
          </span>
        </div>
      </div>

      {/* Catatan Admin / Banner Revisi */}
      {permohonan?.status_workflow === "REVISI" && (
        <RevisionBannerCallout
          catatan={permohonan?.catatan_admin}
          petugas={permohonan?.petugas_verifikasi || "Tim Verifikator Sertifikasi"}
          tanggal={permohonan?.updated_at}
        />
      )}

      {/* Form Editor */}
      <Card className="border-slate-200/80 shadow-xs overflow-hidden">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900">Informasi Pemohon</h3>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField label="Nama Perusahaan" required>
                <TextInput
                  value={form.nama_perusahaan}
                  onChange={(e) => setForm({ ...form, nama_perusahaan: e.target.value })}
                  placeholder="Nama instansi/perusahaan pemohon"
                />
              </FormField>
            </div>

            <div className="sm:col-span-2">
              <FormField label="Alamat Kantor" required>
                <TextareaInput
                  rows={2}
                  value={form.alamat_kantor}
                  onChange={(e) => setForm({ ...form, alamat_kantor: e.target.value })}
                  placeholder="Alamat kantor pusat perusahaan"
                />
              </FormField>
            </div>

            <div>
              <FormField label="Kontak Person (PIC)">
                <TextInput
                  value={form.kontak_person}
                  onChange={(e) => setForm({ ...form, kontak_person: e.target.value })}
                  placeholder="Nama narahubung"
                />
              </FormField>
            </div>

            <div>
              <FormField label="WhatsApp PIC" required>
                <TextInput
                  value={form.no_whatsapp}
                  onChange={(e) => setForm({ ...form, no_whatsapp: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </FormField>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unggah Ulang Dokumen */}
      <Card className="border-slate-200/80 shadow-xs overflow-hidden">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <FileUp className="w-4 h-4 text-brand-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Unggah Ulang Dokumen Pendukung</h3>
            <p className="text-[11px] text-slate-500">Opsional jika ada berkas yang diminta direvisi oleh verifikator</p>
          </div>
        </div>

        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Perbarui Dokumen Legalitas" helperText="Format PDF / JPG / PNG (Maks 10 MB)">
              <DropzoneUploader
                label="Pilih Berkas Legalitas Baru"
                helperText="Seret & lepas atau klik untuk memilih file"
                value={dokLegalitas}
                onChange={setDokLegalitas}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSizeMB={10}
              />
            </FormField>

            <FormField label="Perbarui Manual Mutu" helperText="Format PDF / DOC / DOCX (Maks 20 MB)">
              <DropzoneUploader
                label="Pilih Berkas Manual Mutu Baru"
                helperText="Seret & lepas atau klik untuk memilih file"
                value={dokManualMutu}
                onChange={setDokManualMutu}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                maxSizeMB={20}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleUpdate(false)}
          disabled={submitting}
          isLoading={submitting}
          leftIcon={<Save className="w-4 h-4 text-slate-600" />}
          className="text-xs font-semibold px-5"
        >
          Simpan Perubahan
        </Button>

        {permohonan?.status_workflow === "REVISI" && (
          <Button
            type="button"
            variant="primary"
            onClick={() => handleUpdate(true)}
            disabled={submitting}
            isLoading={submitting}
            rightIcon={<Send className="w-4 h-4" />}
            className="text-xs font-bold px-6 bg-brand-600 hover:bg-brand-700 shadow-sm"
          >
            Kirimkan Kembali ke Marketing
          </Button>
        )}
      </div>
    </div>
  )
}

export default EditFormSertifikasi
