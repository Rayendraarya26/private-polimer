import React, { memo, useEffect, useState } from "react"
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
  FileUp,
  Save,
  ExternalLink,
} from "lucide-react"
import {
  FormField,
  TextInput,
  TextareaInput,
  SelectInput,
  DateInput,
  DropzoneUploader,
  LegalStatementBox,
  StickyFormActions,
} from "../forms"

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

  const setField = (field: keyof typeof initialState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
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
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <Head title="Koreksi Permohonan Pelatihan" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Koreksi Berkas Permohonan Pelatihan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
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
        <Card className="border-slate-200 shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/70 pb-3">
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

          <CardContent className="pt-4 space-y-4">
            <FormField label="Nama Lengkap Peserta" required>
              <TextInput
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={(e) => setField("nama_lengkap", e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Tempat Lahir" required>
                <TextInput
                  name="tempat_lahir"
                  value={formData.tempat_lahir}
                  onChange={(e) => setField("tempat_lahir", e.target.value)}
                />
              </FormField>

              <FormField label="Tanggal Lahir" required>
                <DateInput
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir}
                  onChange={(e) => setField("tanggal_lahir", e.target.value)}
                />
              </FormField>

              <FormField label="Jenis Kelamin" required>
                <SelectInput
                  name="gender"
                  value={formData.gender}
                  onChange={(val) => setField("gender", String(val))}
                  options={[
                    { value: "Laki-laki", label: "Laki-laki" },
                    { value: "Perempuan", label: "Perempuan" },
                  ]}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="NIK (16 Digit)" required>
                <TextInput
                  name="nik_peserta"
                  value={formData.nik_peserta}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 16)
                    setField("nik_peserta", value)
                  }}
                  maxLength={16}
                />
              </FormField>

              <FormField label="Pendidikan Terakhir" required>
                <SelectInput
                  name="pendidikan"
                  value={formData.pendidikan}
                  onChange={(val) => setField("pendidikan", String(val))}
                  options={[
                    { value: "S3", label: "S3" },
                    { value: "S2", label: "S2" },
                    { value: "S1", label: "S1" },
                    { value: "D4", label: "D4" },
                    { value: "D3", label: "D3" },
                    { value: "D1 / SMA / SMK", label: "D1 / SMA / SMK" },
                    { value: "Lainnya", label: "Lainnya" },
                  ]}
                />
              </FormField>

              <FormField label="Agama" required>
                <SelectInput
                  name="agama"
                  value={formData.agama}
                  onChange={(val) => setField("agama", String(val))}
                  options={[
                    { value: "Islam", label: "Islam" },
                    { value: "Kristen", label: "Kristen" },
                    { value: "Katolik", label: "Katolik" },
                    { value: "Hindu", label: "Hindu" },
                    { value: "Buddha", label: "Buddha" },
                    { value: "Konghucu", label: "Konghucu" },
                  ]}
                />
              </FormField>
            </div>

            <FormField label="Alamat Domisili" required>
              <TextareaInput
                rows={2}
                name="alamat_peserta"
                value={formData.alamat_peserta}
                onChange={(e) => setField("alamat_peserta", e.target.value)}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Nomor WhatsApp" required>
                <TextInput
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setField("whatsapp", e.target.value)}
                />
              </FormField>

              <FormField label="Alamat Email" required>
                <TextInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* 2. Berkas Persyaratan */}
        <Card className="border-slate-200 shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/70 pb-3">
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

          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* KTP */}
              <div className="space-y-1.5">
                <FormField label="Kartu Tanda Penduduk (KTP)">
                  <DropzoneUploader
                    label="Pilih File KTP Baru"
                    value={formData.ktp_peserta}
                    onChange={(file) => setField("ktp_peserta", file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={5}
                  />
                </FormField>
                {previewKtp && (
                  <a
                    href={previewKtp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Berkas KTP Saat Ini
                  </a>
                )}
              </div>

              {/* Foto 3x4 */}
              <div className="space-y-1.5">
                <FormField label="Pas Foto Berwarna 3x4">
                  <DropzoneUploader
                    label="Pilih Pas Foto Baru"
                    value={formData.foto_peserta}
                    onChange={(file) => setField("foto_peserta", file)}
                    accept=".jpg,.jpeg,.png"
                    maxSizeMB={5}
                  />
                </FormField>
                {previewFoto && (
                  <a
                    href={previewFoto}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Pas Foto Saat Ini
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Informasi Instansi & Kebutuhan Materi */}
        <Card className="border-slate-200 shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/70 pb-3">
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

          <CardContent className="pt-4 space-y-4">
            <FormField label="Nama Instansi / Usaha" required>
              <TextInput
                name="nama_instansi"
                value={formData.nama_instansi}
                onChange={(e) => setField("nama_instansi", e.target.value)}
              />
            </FormField>

            <FormField label="Alamat Kantor Instansi" required>
              <TextareaInput
                rows={2}
                name="alamat_instansi"
                value={formData.alamat_instansi}
                onChange={(e) => setField("alamat_instansi", e.target.value)}
              />
            </FormField>

            <FormField label="Jenis Produk Industri">
              <TextInput
                name="jenis_produk"
                value={formData.jenis_produk}
                onChange={(e) => setField("jenis_produk", e.target.value)}
              />
            </FormField>

            <FormField label="Permasalahan Terkait Materi / Produksi" required>
              <TextareaInput
                rows={2}
                name="masalah_materi"
                value={formData.masalah_materi}
                onChange={(e) => setField("masalah_materi", e.target.value)}
              />
            </FormField>

            <FormField label="Hal Khusus yang Ingin Dipelajari" required>
              <TextareaInput
                rows={2}
                name="hal_dipelajari"
                value={formData.hal_dipelajari}
                onChange={(e) => setField("hal_dipelajari", e.target.value)}
              />
            </FormField>

            <LegalStatementBox
              title="Pernyataan Kebenaran Data Pelatihan"
              subtitle="Verifikasi perbaikan isian formulir peserta pelatihan BBKKP"
              bulletPoints={[
                "Seluruh data perbaikan dan dokumen yang saya unggah adalah benar dan sah.",
                "Peserta siap mengikuti bimbingan teknis sesuai jadwal pelaksanaan yang disepakati.",
              ]}
              checkboxLabel="Dengan ini saya menyatakan bahwa data perbaikan yang saya masukkan adalah benar dan siap diproses ulang."
              checked={formData.setuju_syarat}
              onChange={(checked) => setField("setuju_syarat", checked)}
              required
            />
          </CardContent>
        </Card>

        {/* Action Button */}
        <StickyFormActions
          canGoBack={true}
          onBack={() => navigate("/permohonan")}
          backLabel="Batal"
          onSubmit={() => handleSubmit()}
          submitLabel="Simpan Perubahan Koreksi"
          isLastStep={true}
          isSubmitting={submitting}
          isSticky={true}
        />
      </form>
    </div>
  )
}

export default memo(EditFormPelatihan)
