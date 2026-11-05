import React from "react"
import { ParticipantData } from "../../../types/pelatihan"
import PhoneInputWithCountrySelect from "react-phone-number-input"
import "react-phone-number-input/style.css"
import {
  SectionHeading,
  FieldLabel,
  FieldHint,
  inputClass,
  selectClass,
  textareaClass,
} from "../common"
import { DateInput, DropzoneUploader } from "../../forms"

interface Props {
  formData: ParticipantData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onUpdateField?: (field: keyof ParticipantData, value: any) => void
  jenisPelanggan: string | undefined
  detail: any
  fieldNamePrefix: string
}

const FormDataPeserta: React.FC<Props> = ({
  formData,
  onChange,
  onUpdateField,
  fieldNamePrefix,
}) => {
  const setField = (field: keyof ParticipantData, value: any) => {
    if (onUpdateField) {
      onUpdateField(field, value)
    } else {
      onChange({
        target: { name: field as string, value },
      } as any)
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Biodata Pribadi Peserta */}
      <div className="space-y-4">
        <SectionHeading
          title="1. Identitas Peserta Pelatihan"
          description="Data identitas lengkap untuk sertifikat kelulusan pelatihan"
          required
        />

        <div className="space-y-4">
          <div>
            <FieldLabel required htmlFor={`nama_lengkap_${fieldNamePrefix}`}>
              Nama Lengkap
            </FieldLabel>
            <input
              type="text"
              id={`nama_lengkap_${fieldNamePrefix}`}
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={(e) => setField("nama_lengkap", e.target.value)}
              placeholder="Masukkan nama lengkap peserta..."
              className={inputClass}
            />
            <FieldHint>Beserta gelar jika diinginkan pada sertifikat</FieldHint>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel required htmlFor={`tempat_lahir_${fieldNamePrefix}`}>
                Tempat Lahir
              </FieldLabel>
              <input
                type="text"
                id={`tempat_lahir_${fieldNamePrefix}`}
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={(e) => setField("tempat_lahir", e.target.value)}
                placeholder="Kota kelahiran..."
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel required htmlFor={`tanggal_lahir_${fieldNamePrefix}`}>
                Tanggal Lahir
              </FieldLabel>
              <DateInput
                id={`tanggal_lahir_${fieldNamePrefix}`}
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={(e) => setField("tanggal_lahir", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel required htmlFor={`gender_${fieldNamePrefix}`}>
                Jenis Kelamin
              </FieldLabel>
              <select
                id={`gender_${fieldNamePrefix}`}
                name="gender"
                value={formData.gender}
                onChange={(e) => setField("gender", e.target.value)}
                className={selectClass}
              >
                <option value="">-- Pilih Jenis Kelamin --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <FieldLabel required htmlFor={`nik_peserta_${fieldNamePrefix}`}>
                Nomor Induk Kependudukan (NIK)
              </FieldLabel>
              <input
                type="text"
                id={`nik_peserta_${fieldNamePrefix}`}
                name="nik_peserta"
                value={formData.nik_peserta || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 16)
                  setField("nik_peserta", val)
                }}
                maxLength={16}
                inputMode="numeric"
                placeholder="16 digit NIK..."
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel required htmlFor={`pendidikan_${fieldNamePrefix}`}>
                Pendidikan Terakhir
              </FieldLabel>
              <select
                id={`pendidikan_${fieldNamePrefix}`}
                name="pendidikan"
                value={formData.pendidikan}
                onChange={(e) => setField("pendidikan", e.target.value)}
                className={selectClass}
              >
                <option value="">-- Pilih Pendidikan --</option>
                <option value="S3">S3 / Doktoral</option>
                <option value="S2">S2 / Magister</option>
                <option value="S1">S1 / Sarjana</option>
                <option value="D4">D4 / Sarjana Terapan</option>
                <option value="D3">D3 / Diploma 3</option>
                <option value="D1 / SMA / SMK">D1 / SMA / SMK Sederajat</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <FieldLabel required htmlFor={`agama_${fieldNamePrefix}`}>
                Agama
              </FieldLabel>
              <select
                id={`agama_${fieldNamePrefix}`}
                name="agama"
                value={formData.agama || ""}
                onChange={(e) => setField("agama", e.target.value)}
                className={selectClass}
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
            <FieldLabel required htmlFor={`alamat_peserta_${fieldNamePrefix}`}>
              Alamat Lengkap Domisili
            </FieldLabel>
            <textarea
              id={`alamat_peserta_${fieldNamePrefix}`}
              rows={2}
              name="alamat_peserta"
              value={formData.alamat_peserta}
              onChange={(e) => setField("alamat_peserta", e.target.value)}
              placeholder="Nama jalan, nomor bangunan, RT/RW, kota domisili..."
              className={textareaClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required htmlFor={`whatsapp_${fieldNamePrefix}`}>
                Nomor WhatsApp Aktif
              </FieldLabel>
              <div className="min-h-[42px] px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white flex items-center">
                <PhoneInputWithCountrySelect
                  international
                  defaultCountry="ID"
                  placeholder="Contoh: +62 812-3456-7890"
                  value={formData.whatsapp || ""}
                  onChange={(val) => setField("whatsapp", val || "")}
                  className="w-full text-xs"
                />
              </div>
            </div>

            <div>
              <FieldLabel required htmlFor={`email_${fieldNamePrefix}`}>
                Alamat Email Aktif
              </FieldLabel>
              <input
                type="email"
                id={`email_${fieldNamePrefix}`}
                name="email"
                value={formData.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="email@example.com"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Berkas Persyaratan Peserta */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <SectionHeading
          title="2. Berkas Persyaratan Peserta"
          description="Format: PDF, JPG, PNG • Maksimal 5 MB per berkas"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel required>Kartu Tanda Penduduk (KTP)</FieldLabel>
            <DropzoneUploader
              label="Unggah Berkas KTP"
              value={formData.ktp_peserta}
              onChange={(file) => setField("ktp_peserta", file)}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </div>

          <div>
            <FieldLabel required>Pas Foto Berwarna 3x4 (Latar Belakang Polos)</FieldLabel>
            <DropzoneUploader
              label="Unggah Pas Foto 3x4"
              value={formData.foto_peserta}
              onChange={(file) => setField("foto_peserta", file)}
              accept=".jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormDataPeserta
