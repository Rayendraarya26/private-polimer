import React from "react"
import { toast } from "react-hot-toast"
import { ProfileClientType } from "../../../types/profile"
import { ParticipantLSP } from "../../../types/lsp"
import PhoneInputWithCountrySelect from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { User, Briefcase, FileUp } from "lucide-react"
import {
  FormField,
  TextInput,
  TextareaInput,
  SelectInput,
  DateInput,
  DropzoneUploader,
} from "../../forms"

interface Props {
  formData: ParticipantLSP
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onUpdateField?: (field: keyof ParticipantLSP, value: any) => void
  jenisPelanggan: string | undefined
  detail: any
  pilihanProfil: string
  onPilihanProfilChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  isFieldDisabled: boolean
  fieldNamePrefix: string
}

const FormDataPesertaLSP: React.FC<Props> = ({
  formData,
  onChange,
  onUpdateField,
  jenisPelanggan,
  detail,
  pilihanProfil,
  onPilihanProfilChange,
  isFieldDisabled,
}) => {
  const setField = (field: keyof ParticipantLSP, value: any) => {
    if (onUpdateField) {
      onUpdateField(field, value)
    } else {
      onChange({
        target: { name: field as string, value },
      } as any)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Profil Selector Card (for Instansi / Perusahaan) */}
      {jenisPelanggan !== ProfileClientType.PERORANGAN && (
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-2">
          <FormField
            label="Pilih Sumber Data Peserta"
            required
            helperText="Pilih apakah peserta adalah pimpinan, penanggung jawab, atau staf lainnya."
          >
            <SelectInput
              value={pilihanProfil}
              onChange={(val) =>
                onPilihanProfilChange({ target: { value: String(val) } } as any)
              }
              options={[
                { value: "Manual", label: "Input Manual (Pegawai / Calon Asesi Delegasi)" },
                { value: "saya", label: "Profil Saya (Akun Login)" },
                { value: "pimpinan", label: `Pimpinan (${detail?.pimpinan || "Data Kosong"})` },
                {
                  value: "penanggung_jawab",
                  label: `Penanggung Jawab / PIC (${detail?.pj_nama || "Data Kosong"})`,
                },
              ]}
            />
          </FormField>
        </div>
      )}

      {/* 1. Biodata Pribadi Peserta */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              1. Biodata Calon Asesi / Peserta
            </h3>
            <p className="text-xs text-slate-500">
              Identitas lengkap sesuai kartu tanda penduduk (KTP)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            label="Nama Lengkap"
            required
            helperText="Disarankan tanpa gelar sesuai data KTP"
          >
            <TextInput
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={(e) => setField("nama_lengkap", e.target.value)}
              disabled={isFieldDisabled}
              placeholder="Masukkan nama lengkap peserta..."
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Tempat Lahir" required>
              <TextInput
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={(e) => setField("tempat_lahir", e.target.value)}
                placeholder="Kota kelahiran..."
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
                placeholder="-- Pilih Gender --"
                options={[
                  { value: "Laki-laki", label: "Laki-laki" },
                  { value: "Perempuan", label: "Perempuan" },
                ]}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Nomor Induk Kependudukan (NIK)" required>
              <TextInput
                name="nik_peserta"
                value={formData.nik_peserta || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 16)
                  setField("nik_peserta", value)
                }}
                inputMode="numeric"
                maxLength={16}
                placeholder="16 digit NIK..."
              />
            </FormField>

            <FormField label="Kewarganegaraan" required>
              <SelectInput
                name="kewarganegaraan"
                value={formData.kewarganegaraan}
                onChange={(val) => setField("kewarganegaraan", String(val))}
                placeholder="-- Pilih --"
                options={[
                  { value: "WNI", label: "WNI (Warga Negara Indonesia)" },
                  { value: "WNA", label: "WNA (Warga Negara Asing)" },
                ]}
              />
            </FormField>

            <FormField label="Pendidikan Terakhir" required>
              <SelectInput
                name="pendidikan"
                value={formData.pendidikan}
                onChange={(val) => setField("pendidikan", String(val))}
                placeholder="-- Pilih Pendidikan --"
                options={[
                  { value: "S3", label: "S3 / Doktoral" },
                  { value: "S2", label: "S2 / Magister" },
                  { value: "S1", label: "S1 / Sarjana" },
                  { value: "D4", label: "D4 / Sarjana Terapan" },
                  { value: "D3", label: "D3 / Diploma 3" },
                  { value: "D1 / SMA / SMK", label: "D1 / SMA / SMK Sederajat" },
                  { value: "Lainnya", label: "Lainnya" },
                ]}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <FormField label="Alamat Lengkap Domisili" required>
                <TextareaInput
                  rows={2}
                  name="alamat_peserta"
                  value={formData.alamat_peserta}
                  onChange={(e) => setField("alamat_peserta", e.target.value)}
                  placeholder="Nama jalan, RT/RW, kelurahan, kecamatan, kota..."
                />
              </FormField>
            </div>

            <div>
              <FormField label="Kode Pos" required>
                <TextInput
                  name="kode_pos"
                  value={formData.kode_pos || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 5)
                    setField("kode_pos", value)
                  }}
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="5 digit..."
                />
              </FormField>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Kontak & Karir Pekerjaan */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              2. Kontak & Jabatan Pekerjaan
            </h3>
            <p className="text-xs text-slate-500">
              Informasi profesi dan saluran komunikasi untuk jadwal asesmen
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Nomor WhatsApp Aktif" required>
            <div className="min-h-[42px] px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white flex items-center">
              <PhoneInputWithCountrySelect
                international
                defaultCountry="ID"
                placeholder="Contoh: +62 812-3456-7890"
                value={formData.whatsapp || ""}
                onChange={(value) => setField("whatsapp", value || "")}
                disabled={isFieldDisabled}
                className="w-full text-xs"
              />
            </div>
          </FormField>

          <FormField label="Alamat Email Aktif" required>
            <TextInput
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setField("email", e.target.value)}
              disabled={isFieldDisabled}
              placeholder="email@example.com"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Jabatan / Posisi Pekerjaan" required>
            <TextInput
              name="jabatan"
              value={formData.jabatan || ""}
              onChange={(e) => setField("jabatan", e.target.value)}
              placeholder="Contoh: Operator Mesin / Analis Mutu..."
            />
          </FormField>

          <FormField label="Pengalaman Kerja Relevan" required>
            <TextInput
              name="pengalaman_kerja"
              value={formData.pengalaman_kerja || ""}
              onChange={(e) => setField("pengalaman_kerja", e.target.value)}
              placeholder="Contoh: 3 Tahun di Industri Plastik..."
            />
          </FormField>
        </div>
      </div>

      {/* 3. Unggah Dokumen Portofolio Asesmen */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                3. Unggah Berkas Persyaratan & Form APL
              </h3>
              <p className="text-xs text-slate-500">
                Format: PDF, JPG, PNG • Maksimal 5 MB per dokumen
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Kartu Tanda Penduduk (KTP)" required>
            <DropzoneUploader
              label="Unggah Berkas KTP"
              value={formData.ktp_peserta}
              onChange={(file) => setField("ktp_peserta", file)}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </FormField>

          <FormField label="Ijazah Terakhir" required>
            <DropzoneUploader
              label="Unggah Ijazah"
              value={formData.ijazah}
              onChange={(file) => setField("ijazah", file)}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </FormField>

          <FormField label="Formulir APL-01 (Permohonan)" required>
            <DropzoneUploader
              label="Unggah Form APL-01"
              value={formData.apl_01}
              onChange={(file) => setField("apl_01", file)}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </FormField>

          <FormField label="Formulir APL-02 (Asesmen Mandiri)" required>
            <DropzoneUploader
              label="Unggah Form APL-02"
              value={formData.apl_02}
              onChange={(file) => setField("apl_02", file)}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Dokumen Portofolio Tambahan / Sertifikat Terkait (Opsional)">
              <DropzoneUploader
                label="Unggah Portofolio Tambahan"
                value={formData.upload_lainya}
                onChange={(file) => setField("upload_lainya", file)}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSizeMB={5}
              />
            </FormField>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormDataPesertaLSP
