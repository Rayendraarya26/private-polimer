import React, { memo, useEffect, useState } from "react"
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

  const setField = (field: keyof typeof initialState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!id) return

    if (!formData.setuju_syarat) {
      toast.error("Anda harus menyetujui syarat & ketentuan koreksi")
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
      toast.error("Gagal memperbarui data LSP")
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <Head title="Koreksi Permohonan LSP" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/permohonan")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Permohonan</span>
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
          <Award className="w-3.5 h-3.5" /> Koreksi LSP
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Biodata Calon Asesi */}
        <Card className="border-slate-200 shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/70 pb-3">
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

          <CardContent className="pt-4 space-y-4">
            <FormField label="Nama Lengkap" required>
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

              <FormField label="Kewarganegaraan" required>
                <SelectInput
                  name="kewarganegaraan"
                  value={formData.kewarganegaraan}
                  onChange={(val) => setField("kewarganegaraan", String(val))}
                  options={[
                    { value: "WNI", label: "WNI" },
                    { value: "WNA", label: "WNA" },
                  ]}
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-3">
                <FormField label="Alamat Domisili" required>
                  <TextareaInput
                    rows={2}
                    name="alamat_peserta"
                    value={formData.alamat_peserta}
                    onChange={(e) => setField("alamat_peserta", e.target.value)}
                  />
                </FormField>
              </div>

              <div>
                <FormField label="Kode Pos" required>
                  <TextInput
                    name="kode_pos"
                    value={formData.kode_pos}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 5)
                      setField("kode_pos", value)
                    }}
                    maxLength={5}
                  />
                </FormField>
              </div>
            </div>

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

        {/* 2. Berkas Portofolio Persyaratan */}
        <Card className="border-slate-200 shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/70 pb-3">
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
                {previewFile.ktp_peserta && (
                  <a
                    href={previewFile.ktp_peserta}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Berkas KTP Saat Ini
                  </a>
                )}
              </div>

              {/* Ijazah */}
              <div className="space-y-1.5">
                <FormField label="Ijazah Terakhir">
                  <DropzoneUploader
                    label="Pilih File Ijazah Baru"
                    value={formData.ijazah}
                    onChange={(file) => setField("ijazah", file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={5}
                  />
                </FormField>
                {previewFile.ijazah && (
                  <a
                    href={previewFile.ijazah}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Berkas Ijazah Saat Ini
                  </a>
                )}
              </div>

              {/* APL-01 */}
              <div className="space-y-1.5">
                <FormField label="Formulir APL-01">
                  <DropzoneUploader
                    label="Pilih File APL-01 Baru"
                    value={formData.apl_01}
                    onChange={(file) => setField("apl_01", file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={5}
                  />
                </FormField>
                {previewFile.apl_01 && (
                  <a
                    href={previewFile.apl_01}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Berkas APL-01 Saat Ini
                  </a>
                )}
              </div>

              {/* APL-02 */}
              <div className="space-y-1.5">
                <FormField label="Formulir APL-02">
                  <DropzoneUploader
                    label="Pilih File APL-02 Baru"
                    value={formData.apl_02}
                    onChange={(file) => setField("apl_02", file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={5}
                  />
                </FormField>
                {previewFile.apl_02 && (
                  <a
                    href={previewFile.apl_02}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> Lihat Berkas APL-02 Saat Ini
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Data Instansi & Persetujuan */}
        <Card className="border-slate-200 shadow-xs overflow-hidden">
          <CardHeader className="bg-slate-50/70 pb-3">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label="Jenis Bidang Usaha">
                <TextInput
                  name="jenis_produk"
                  value={formData.jenis_produk}
                  onChange={(e) => setField("jenis_produk", e.target.value)}
                />
              </FormField>

              <FormField label="Jabatan Pekerjaan">
                <TextInput
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={(e) => setField("jabatan", e.target.value)}
                />
              </FormField>

              <FormField label="Pengalaman Kerja">
                <TextInput
                  name="pengalaman_kerja"
                  value={formData.pengalaman_kerja}
                  onChange={(e) => setField("pengalaman_kerja", e.target.value)}
                />
              </FormField>
            </div>

            <LegalStatementBox
              title="Pernyataan Kebenaran Data Koreksi"
              subtitle="Verifikasi keabsahan data perbaikan permohonan sertifikasi LSP"
              bulletPoints={[
                "Seluruh data perbaikan dan dokumen yang saya unggah adalah sah, mutakhir, dan benar.",
                "Saya bersedia mengikuti asesmen sesuai ketentuan LSP BBKKP.",
              ]}
              checkboxLabel="Dengan ini saya menyatakan bahwa perbaikan data yang saya masukkan adalah benar dan siap diproses ulang."
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

export default memo(EditFormLSP)
