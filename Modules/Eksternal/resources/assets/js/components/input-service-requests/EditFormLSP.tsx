import React, { memo, useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"
import { useParams, useNavigate } from "react-router-dom"
import { useLSP } from "../../hooks/service-requests/useLSP"
import Head from "../common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card"
import { Button } from "../ui/Button"
import {
  Award,
  ArrowLeft,
  User,
  Building2,
  FileUp,
  FileCheck2,
  Save,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"

const BASE_STORAGE = "http://localhost:4700/storage/"

const initialState = {
  nama_lengkap: "",
  gender: "",
  tempat_lahir: "",
  nik_peserta: "",
  tanggal_lahir: "",
  kewarganegaraan: "",
  kode_pos: "",
  pendidikan: "",
  whatsapp: "",
  email: "",
  alamat_peserta: "",

  ktp_peserta: null as File | null,
  ijazah: null as File | null,
  apl_01: null as File | null,
  apl_02: null as File | null,
  upload_lainya: null as File | null,

  nama_instansi: "",
  alamat_instansi: "",
  jenis_produk: "",
  jabatan: "",
  pengalaman_kerja: "",
  setuju_syarat: false,
}

const EditFormLSP: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getDetailLSP, updateLSP, submitting } = useLSP()

  const [formData, setFormData] = useState(initialState)
  const [previewFile, setPreviewFile] = useState<any>({
    ktp_peserta: "",
    ijazah: "",
    apl_01: "",
    apl_02: "",
    upload_lainya: "",
  })

  const buildFileUrl = (path: string) => {
    if (!path) return ""
    if (path.startsWith("http")) return path
    if (path.startsWith("/storage")) return `http://localhost:4700${path}`
    return `${BASE_STORAGE}${path}`
  }

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return
      try {
        const res = await getDetailLSP(id)
        const data = res?.data ?? res
        const form = data?.results?.form

        if (!form) {
          toast.error("Data permohonan LSP tidak ditemukan")
          return
        }

        setFormData({
          ...initialState,
          nama_lengkap: form.nama_lengkap || "",
          gender: form.gender || "",
          tempat_lahir: form.tempat_lahir || "",
          nik_peserta: form.nik_peserta || "",
          tanggal_lahir: form.tanggal_lahir ? form.tanggal_lahir.substring(0, 10) : "",
          kewarganegaraan: form.kewarganegaraan || "",
          kode_pos: form.kode_pos || "",
          pendidikan: form.pendidikan || "",
          whatsapp: form.whatsapp || "",
          email: form.email || "",
          alamat_peserta: form.alamat_peserta || "",

          nama_instansi: form.nama_instansi || "",
          alamat_instansi: form.alamat_instansi || "",
          jenis_produk: form.jenis_produk || "",
          jabatan: form.jabatan || "",
          pengalaman_kerja: form.pengalaman_kerja || "",
          setuju_syarat: Boolean(form.setuju_syarat),
        })

        setPreviewFile({
          ktp_peserta: buildFileUrl(form.ktp_peserta),
          ijazah: buildFileUrl(form.ijazah),
          apl_01: buildFileUrl(form.apl_01),
          apl_02: buildFileUrl(form.apl_02),
          upload_lainya: buildFileUrl(form.upload_lainya),
        })
      } catch (error) {
        console.error(error)
        toast.error("Gagal mengambil data permohonan LSP")
      }
    }

    fetchDetail()
  }, [id, getDetailLSP])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target as HTMLInputElement
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null
      setFormData((prev) => ({ ...prev, [name]: file }))
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }))
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
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === "boolean") {
          payload.append(key, value ? "1" : "0")
        } else {
          payload.append(key, value as any)
        }
      }
    })

    try {
      await updateLSP(id, payload)
      toast.success("Perubahan data sertifikasi LSP berhasil disimpan")
      navigate("/permohonan")
    } catch (error) {
      console.error(error)
      toast.error("Gagal menyimpan perubahan LSP")
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Head title="Koreksi Permohonan Sertifikasi LSP" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Award className="w-4 h-4" />
            <span>Koreksi Berkas Permohonan LSP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Perbarui Data Sertifikasi Kompetensi Profesi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lakukan perbaikan data dan unggah ulang berkas persyaratan yang diminta oleh verifikator.
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
        {/* 1. Biodata Calon Asesi */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                <User className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>1. Biodata Asesi / Peserta</CardTitle>
                <CardDescription>Identitas calon penerima sertifikat kompetensi BNSP</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap <span className="text-rose-500">*</span>
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
                  Kewarganegaraan <span className="text-rose-500">*</span>
                </label>
                <select
                  name="kewarganegaraan"
                  value={formData.kewarganegaraan}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                >
                  <option value="WNI">WNI</option>
                  <option value="WNA">WNA</option>
                </select>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-3">
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kode Pos <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="kode_pos"
                  value={formData.kode_pos}
                  onChange={handleChange}
                  maxLength={5}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
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

        {/* 2. Berkas Portofolio Persyaratan */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <FileUp className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>2. Unggah Ulang Berkas Portofolio</CardTitle>
                <CardDescription>Pilih berkas baru jika ingin mengganti dokumen yang telah diunggah sebelumnya</CardDescription>
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
                {previewFile.ktp_peserta && (
                  <a
                    href={previewFile.ktp_peserta}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline pt-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Berkas KTP Saat Ini
                  </a>
                )}
              </div>

              {/* Ijazah */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Ijazah Terakhir
                </label>
                <input
                  type="file"
                  name="ijazah"
                  accept=".pdf, image/*"
                  onChange={handleChange}
                  className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700"
                />
                {previewFile.ijazah && (
                  <a
                    href={previewFile.ijazah}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline pt-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Berkas Ijazah Saat Ini
                  </a>
                )}
              </div>

              {/* APL-01 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Formulir APL-01
                </label>
                <input
                  type="file"
                  name="apl_01"
                  accept=".pdf, image/*"
                  onChange={handleChange}
                  className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700"
                />
                {previewFile.apl_01 && (
                  <a
                    href={previewFile.apl_01}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline pt-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Berkas APL-01 Saat Ini
                  </a>
                )}
              </div>

              {/* APL-02 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Formulir APL-02
                </label>
                <input
                  type="file"
                  name="apl_02"
                  accept=".pdf, image/*"
                  onChange={handleChange}
                  className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700"
                />
                {previewFile.apl_02 && (
                  <a
                    href={previewFile.apl_02}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline pt-1"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Berkas APL-02 Saat Ini
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Data Instansi & Persetujuan */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <CardTitle>3. Data Instansi / Tempat Bekerja</CardTitle>
                <CardDescription>Informasi unit usaha yang menaungi peserta</CardDescription>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jenis Bidang Usaha
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
                  Jabatan Pekerjaan
                </label>
                <input
                  type="text"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pengalaman Kerja
                </label>
                <input
                  type="text"
                  name="pengalaman_kerja"
                  value={formData.pengalaman_kerja}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
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
                Dengan ini saya menyatakan bahwa perbaikan data yang saya masukkan adalah benar dan siap diproses ulang. <span className="text-rose-500">*</span>
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

export default memo(EditFormLSP)
