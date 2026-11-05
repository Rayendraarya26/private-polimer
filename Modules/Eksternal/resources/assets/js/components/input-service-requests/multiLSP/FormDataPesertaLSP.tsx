import React from "react"
import { ParticipantLSP } from "../../../types/lsp"
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
  formData: ParticipantLSP
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onUpdateField?: (field: keyof ParticipantLSP, value: any) => void
  jenisPelanggan: string | undefined
  detail: any
  fieldNamePrefix: string
}

const FormDataPesertaLSP: React.FC<Props> = ({
  formData,
  onChange,
  onUpdateField,
  jenisPelanggan,
  detail,
  fieldNamePrefix,
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
    <div className="space-y-6">
      {/* 1. Biodata Pribadi Peserta */}
      <div className="space-y-4">
        <SectionHeading
          title="1. Biodata Calon Asesi / Peserta"
          description="Identitas lengkap sesuai kartu tanda penduduk (KTP)"
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
            <FieldHint>Disarankan tanpa gelar sesuai data KTP</FieldHint>
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
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={(e) => setField("tanggal_lahir", e.target.value)}
              />
            </div>

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
                <option value="">-- Pilih Gender --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <FieldLabel required htmlFor={`nik_${fieldNamePrefix}`}>
                Nomor Induk Kependudukan (NIK)
              </FieldLabel>
              <input
                type="text"
                id={`nik_${fieldNamePrefix}`}
                name="nik_peserta"
                value={formData.nik_peserta || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 16)
                  setField("nik_peserta", value)
                }}
                inputMode="numeric"
                maxLength={16}
                placeholder="16 digit NIK..."
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel required htmlFor={`kewarganegaraan_${fieldNamePrefix}`}>
                Kewarganegaraan
              </FieldLabel>
              <select
                id={`kewarganegaraan_${fieldNamePrefix}`}
                name="kewarganegaraan"
                value={formData.kewarganegaraan}
                onChange={(e) => setField("kewarganegaraan", e.target.value)}
                className={selectClass}
              >
                <option value="">-- Pilih Kewarganegaraan --</option>
                <option value="WNI">WNI (Warga Negara Indonesia)</option>
                <option value="WNA">WNA (Warga Negara Asing)</option>
              </select>
            </div>

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
          </div>

          <div>
            <FieldLabel required htmlFor={`alamat_${fieldNamePrefix}`}>
              Alamat Lengkap Domisili
            </FieldLabel>
            <textarea
              rows={2}
              id={`alamat_${fieldNamePrefix}`}
              name="alamat_peserta"
              value={formData.alamat_peserta}
              onChange={(e) => setField("alamat_peserta", e.target.value)}
              placeholder="Nama jalan, RT/RW, kelurahan, kecamatan, kota..."
              className={textareaClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel required htmlFor={`kode_pos_${fieldNamePrefix}`}>
                Kode Pos
              </FieldLabel>
              <input
                type="text"
                id={`kode_pos_${fieldNamePrefix}`}
                name="kode_pos"
                value={formData.kode_pos || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 5)
                  setField("kode_pos", value)
                }}
                inputMode="numeric"
                maxLength={5}
                placeholder="5 digit kode pos..."
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Kontak & Karir Pekerjaan */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <SectionHeading
          title="2. Kontak & Jabatan Pekerjaan"
          description="Informasi profesi dan saluran komunikasi untuk jadwal asesmen"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel required htmlFor={`wa_${fieldNamePrefix}`}>
              Nomor WhatsApp Aktif
            </FieldLabel>
            <div className="h-10 px-3 rounded-lg border border-slate-300 bg-white flex items-center focus-within:border-brand-600 transition">
              <PhoneInputWithCountrySelect
                international
                defaultCountry="ID"
                placeholder="Contoh: +62 812-3456-7890"
                value={formData.whatsapp || ""}
                onChange={(value) => setField("whatsapp", value || "")}
                className="w-full text-sm"
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

          <div>
            <FieldLabel required htmlFor={`jabatan_${fieldNamePrefix}`}>
              Jabatan / Posisi Pekerjaan
            </FieldLabel>
            <input
              type="text"
              id={`jabatan_${fieldNamePrefix}`}
              name="jabatan"
              value={formData.jabatan || ""}
              onChange={(e) => setField("jabatan", e.target.value)}
              placeholder="Contoh: Operator Mesin / Analis Mutu..."
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel required htmlFor={`pengalaman_${fieldNamePrefix}`}>
              Pengalaman Kerja Relevan
            </FieldLabel>
            <input
              type="text"
              id={`pengalaman_${fieldNamePrefix}`}
              name="pengalaman_kerja"
              value={formData.pengalaman_kerja || ""}
              onChange={(e) => setField("pengalaman_kerja", e.target.value)}
              placeholder="Contoh: 3 Tahun di Industri Plastik..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* 3. Unggah Dokumen Portofolio Asesmen */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <SectionHeading
          title="3. Unggah Berkas Persyaratan & Form APL"
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
            <FieldLabel required>Ijazah Terakhir</FieldLabel>
            <DropzoneUploader
              label="Unggah Ijazah"
              value={formData.ijazah}
              onChange={(file) => setField("ijazah", file)}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </div>

          <div>
            <FieldLabel required>Formulir APL-01 (Permohonan)</FieldLabel>
            <DropzoneUploader
              label="Unggah Form APL-01"
              value={formData.apl_01}
              onChange={(file) => setField("apl_01", file)}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </div>

          <div>
            <FieldLabel required>Formulir APL-02 (Asesmen Mandiri)</FieldLabel>
            <DropzoneUploader
              label="Unggah Form APL-02"
              value={formData.apl_02}
              onChange={(file) => setField("apl_02", file)}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel optional>
              Dokumen Portofolio Tambahan / Sertifikat Terkait
            </FieldLabel>
            <DropzoneUploader
              label="Unggah Portofolio Tambahan"
              value={formData.upload_lainya}
              onChange={(file) => setField("upload_lainya", file)}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormDataPesertaLSP
