import React, { memo, useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import usePelatihan from "../../hooks/service-requests/usePelatihan"
import Head from "../common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card"
import { Button } from "../ui/Button"
import {
  GraduationCap,
  ArrowLeft,
  User,
  Building2,
  BookOpen,
  FileUp,
  Save,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || ""

const initialState = {
  skema_id: "",
  nama_lengkap: "",
  gender: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  pendidikan: "",
  whatsapp: "",
  alamat_peserta: "",
  email: "",
  nik_peserta: "",
  agama: "",
  nama_instansi: "",
  alamat_instansi: "",
  jenis_produk: "",
  masalah_materi: "",
  hal_dipelajari: "",
  setuju_syarat: false,
  ktp_peserta: null as File | null,
  foto_peserta: null as File | null,
}

const EditFormPelatihan: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getDetailPelatihan, updatePelatihan, submitting } = usePelatihan()
  const [formData, setFormData] = useState(initialState)
  const [previewKtp, setPreviewKtp] = useState<string | null>(null)
  const [previewFoto, setPreviewFoto] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      try {
        const data = await getDetailPelatihan(id)
        if (!data?.form) {
          toast.error("Data permohonan pelatihan tidak ditemukan")
          return
        }
        const form = data.form
        setFormData({
          ...initialState,
          skema_id: data.permohonan?.lingkup_layanan_id || "",
          nama_lengkap: form.nama_lengkap || "",
          gender: form.gender || "",
          tempat_lahir: form.tempat_lahir || "",
          tanggal_lahir: form.tanggal_lahir ? form.tanggal_lahir.substring(0, 10) : "",
          pendidikan: form.pendidikan || "",
          whatsapp: form.whatsapp || "",
          alamat_peserta: form.alamat_peserta || "",
          email: form.email || "",
          nik_peserta: form.nik_peserta || "",
          agama: form.agama || "",
          nama_instansi: form.nama_instansi || "",
          alamat_instansi: form.alamat_instansi || "",
          jenis_produk: form.jenis_produk || "",
          masalah_materi: form.masalah_materi || "",
          hal_dipelajari: form.hal_dipelajari || "",
          setuju_syarat: Boolean(form.setuju_syarat),
          ktp_peserta: null,
          foto_peserta: null,
        })
        setPreviewKtp(
          form.ktp_peserta ? `${STORAGE_URL}/storage/${form.ktp_peserta}` : null
        )
        setPreviewFoto(
          form.foto_peserta ? `${STORAGE_URL}/storage/${form.foto_peserta}` : null
        )
      } catch (error) {
        console.error(error)
        toast.error("Gagal mengambil data permohonan pelatihan")
      }
    }
    fetchDetail()
  }, [id, getDetailPelatihan])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target as HTMLInputElement
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement
      const file = fileInput.files ? fileInput.files[0] : null
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }))
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }))
    } else {
      const { value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    if (!formData.setuju_syarat) {
      toast.error("Anda harus menyetujui syarat & ketentuan")
      return
    }

    const payload = new FormData()
    payload.append("skema_id", formData.skema_id)
    payload.append("nama_lengkap", formData.nama_lengkap)
    payload.append("gender", formData.gender)
    payload.append("tempat_lahir", formData.tempat_lahir)
    payload.append("tanggal_lahir", formData.tanggal_lahir)
    payload.append("pendidikan", formData.pendidikan)
    payload.append("whatsapp", formData.whatsapp)
    payload.append("alamat_peserta", formData.alamat_peserta)
    payload.append("email", formData.email)
    payload.append("nik_peserta", formData.nik_peserta)
    payload.append("agama", formData.agama)
    payload.append("nama_instansi", formData.nama_instansi)
    payload.append("alamat_instansi", formData.alamat_instansi)
    payload.append("jenis_produk", formData.jenis_produk)
    payload.append("masalah_materi", formData.masalah_materi)
    payload.append("hal_dipelajari", formData.hal_dipelajari)
    payload.append("setuju_syarat", formData.setuju_syarat ? "1" : "0")

    if (formData.ktp_peserta) {
      payload.append("ktp_peserta", formData.ktp_peserta)
    }
    if (formData.foto_peserta) {
      payload.append("foto_peserta", formData.foto_peserta)
    }

    try {
      await updatePelatihan(id, payload)
      toast.success("Perubahan data pelatihan berhasil disimpan")
      navigate("/permohonan")
    } catch (error) {
      console.error(error)
      toast.error("Gagal menyimpan perbaikan formulir")
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Head title="Koreksi Permohonan Pelatihan" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Koreksi Berkas Permohonan Pelatihan</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Perbarui Data Bimbingan Teknis / Pelatihan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lakukan perbaikan data peserta dan unggah ulang berkas yang diperlukan verifikator.
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
          Kembali ke Permohonan
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Biodata Peserta */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                <User className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>1. Identitas Peserta Pelatihan</CardTitle>
                <CardDescription>Data identitas untuk penerbitan sertifikat pelatihan</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap Peserta <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tempat Lahir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tanggal Lahir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="">-- Pilih Gender --</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  NIK (16 Digit) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="nik_peserta"
                  value={formData.nik_peserta}
                  onChange={handleChange}
                  maxLength={16}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pendidikan Terakhir <span className="text-rose-500">*</span>
                </label>
                <select
                  name="pendidikan"
                  value={formData.pendidikan}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="S3">S3</option>
                  <option value="S2">S2</option>
                  <option value="S1">S1</option>
                  <option value="D4">D4</option>
                  <option value="D3">D3</option>
                  <option value="D1 / SMA / SMK">D1 / SMA / SMK</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Agama <span className="text-rose-500">*</span>
                </label>
                <select
                  name="agama"
                  value={formData.agama}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="">-- Pilih Agama --</option>
                  <option value="Islam">Islam</option>
                  <option value="Kristen">Kristen</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Domisili <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                name="alamat_peserta"
                value={formData.alamat_peserta}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alamat Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Berkas Persyaratan */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <FileUp className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>2. Unggah Ulang Berkas Persyaratan</CardTitle>
                <CardDescription>Pilih berkas baru jika ingin mengganti dokumen KTP atau Foto</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* KTP */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Kartu Tanda Penduduk (KTP)
                </label>
                <input
                  type="file"
                  name="ktp_peserta"
                  accept=".pdf, image/*"
                  onChange={handleChange}
                  className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700"
                />
                {previewKtp && (
                  <a
                    href={previewKtp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline pt-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Berkas KTP Saat Ini
                  </a>
                )}
              </div>

              {/* Foto 3x4 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Pas Foto Berwarna 3x4
                </label>
                <input
                  type="file"
                  name="foto_peserta"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700"
                />
                {previewFoto && (
                  <a
                    href={previewFoto}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline pt-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Pas Foto Saat Ini
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Informasi Instansi & Kebutuhan Materi */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>3. Data Instansi & Kebutuhan Pelatihan</CardTitle>
                <CardDescription>Informasi unit kerja dan sasaran materi yang ingin dipelajari</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Instansi / Usaha <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="nama_instansi"
                value={formData.nama_instansi}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Kantor Instansi <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                name="alamat_instansi"
                value={formData.alamat_instansi}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jenis Produk Industri
              </label>
              <input
                type="text"
                name="jenis_produk"
                value={formData.jenis_produk}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Permasalahan Terkait Materi / Produksi <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                name="masalah_materi"
                value={formData.masalah_materi}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hal Khusus yang Ingin Dipelajari <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                name="hal_dipelajari"
                value={formData.hal_dipelajari}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <label className="flex items-start gap-3 p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 cursor-pointer">
              <input
                type="checkbox"
                name="setuju_syarat"
                checked={formData.setuju_syarat}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                required
              />
              <span className="text-xs font-bold text-emerald-900">
                Dengan ini saya menyatakan bahwa data perbaikan yang saya masukkan adalah benar dan siap diproses ulang. <span className="text-rose-500">*</span>
              </span>
            </label>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/permohonan")}
          >
            Batal
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            isLoading={submitting}
            leftIcon={<Save className="w-4 h-4" />}
            className="shadow-md"
          >
            Simpan Perubahan Koreksi
          </Button>
        </div>
      </form>
    </div>
  )
}

export default memo(EditFormPelatihan)
