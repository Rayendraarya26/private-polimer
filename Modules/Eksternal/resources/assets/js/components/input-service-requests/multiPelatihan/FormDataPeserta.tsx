import React from "react"
import { ProfileClientType } from "../../../types/profile"
import { ParticipantData } from "../../../types/pelatihan"
import PhoneInputWithCountrySelect from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { User, FileUp } from "lucide-react"
import {
  FormField,
  TextInput,
  TextareaInput,
  SelectInput,
  DateInput,
  DropzoneUploader,
} from "../../forms"

interface Props {
  formData: ParticipantData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onFieldChange: (name: string, value: any) => void
  jenisPelanggan: string | undefined
  detail: any
  pilihanProfil: string
  onPilihanProfilChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  isFieldDisabled: boolean
  fieldNamePrefix: string
}

const FormDataPeserta: React.FC<Props> = ({
  formData,
  onChange,
  onFieldChange,
  jenisPelanggan,
  detail,
  pilihanProfil,
  onPilihanProfilChange,
  isFieldDisabled,
  fieldNamePrefix,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Profil Selector Card (for Instansi / Perusahaan) */}
      {jenisPelanggan !== ProfileClientType.PERORANGAN && (
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-2">
          <FormField
            label="Pilih Sumber Data Peserta"
            required
            helperText="Pilih apakah peserta adalah pimpinan, PIC instansi, atau staf teknis lainnya."
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
              1. Identitas Peserta Pelatihan
            </h3>
            <p className="text-xs text-slate-500">
              Data identitas lengkap untuk sertifikat kelulusan pelatihan
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            label="Nama Lengkap"
            required
            helperText="Beserta gelar jika diinginkan pada sertifikat"
          >
            <TextInput
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={onChange}
              disabled={isFieldDisabled}
              placeholder="Masukkan nama lengkap peserta..."
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Tempat Lahir" required>
              <TextInput
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={onChange}
                placeholder="Kota kelahiran..."
              />
            </FormField>

            <FormField label="Tanggal Lahir" required>
              <DateInput
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={onChange}
              />
            </FormField>

            <FormField label="Jenis Kelamin" required>
              <SelectInput
                name="gender"
                value={formData.gender}
                onChange={(val) => onFieldChange("gender", String(val))}
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
                  onFieldChange("nik_peserta", value)
                }}
                inputMode="numeric"
                maxLength={16}
                placeholder="16 digit NIK..."
              />
            </FormField>

            <FormField label="Pendidikan Terakhir" required>
              <SelectInput
                name="pendidikan"
                value={formData.pendidikan}
                onChange={(val) => onFieldChange("pendidikan", String(val))}
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

            <FormField label="Agama" required>
              <SelectInput
                name={`agama_${fieldNamePrefix}`}
                value={formData.agama || ""}
                onChange={(val) => onFieldChange("agama", String(val))}
                placeholder="-- Pilih Agama --"
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

          <FormField label="Alamat Lengkap Domisili" required>
            <TextareaInput
              rows={2}
              name="alamat_peserta"
              value={formData.alamat_peserta}
              onChange={onChange}
              placeholder="Nama jalan, nomor bangunan, RT/RW, kota domisili..."
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Nomor WhatsApp Aktif" required>
              <div className="min-h-[42px] px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white flex items-center">
                <PhoneInputWithCountrySelect
                  international
                  defaultCountry="ID"
                  placeholder="Contoh: +62 812-3456-7890"
                  value={formData.whatsapp || ""}
                  onChange={(value) => {
                    onChange({
                      target: {
                        name: "whatsapp",
                        value: value || "",
                      },
                    } as any)
                  }}
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
                onChange={onChange}
                disabled={isFieldDisabled}
                placeholder="email@example.com"
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* 2. Unggah Dokumen Berkas */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                2. Berkas Persyaratan Peserta
              </h3>
              <p className="text-xs text-slate-500">
                Format: PDF, JPG, PNG • Maksimal 5 MB per berkas
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Kartu Tanda Penduduk (KTP)" required>
            <DropzoneUploader
              label="Unggah Berkas KTP"
              value={formData.ktp_peserta}
              onChange={(file) => onFieldChange("ktp_peserta", file)}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </FormField>

          <FormField label="Pas Foto Berwarna 3x4 (Latar Belakang Polos)" required>
            <DropzoneUploader
              label="Unggah Pas Foto 3x4"
              value={formData.foto_peserta}
              onChange={(file) => onFieldChange("foto_peserta", file)}
              accept=".jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </FormField>
        </div>
      </div>
    </div>
  )
}

export default FormDataPeserta
