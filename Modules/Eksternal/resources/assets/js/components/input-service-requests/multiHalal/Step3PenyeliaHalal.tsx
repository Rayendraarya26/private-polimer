import React from "react"
import { FormHalalPayload } from "../../../types/halal"
import { DateInput, DropzoneUploader } from "../../forms"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  Callout,
  inputClass,
} from "../common"
import {
  UserCheck,
  ShieldAlert,
} from "lucide-react"

interface Step3Props {
  payload: FormHalalPayload
  onChange: (updater: (prev: FormHalalPayload) => FormHalalPayload) => void
}

export const Step3PenyeliaHalal: React.FC<Step3Props> = ({ payload, onChange }) => {
  const p = payload.dataPenyelia
  const isReguler = payload.dataPengajuan.jalur_pendaftaran === "reguler"

  const updatePenyelia = (field: string, val: string) => {
    onChange((prev) => ({
      ...prev,
      dataPenyelia: {
        ...prev.dataPenyelia,
        [field]: val,
      },
    }))
  }

  return (
    <StepPanel
      icon={UserCheck}
      title="Data & Berkas Penyelia Halal"
      description="Penyelia Halal bertanggung jawab mengawasi penerapan Proses Produk Halal (PPH) dan wajib beragama Islam."
    >
      {/* Ketentuan Hukum UU JPH */}
      <Callout tone="warning" icon={ShieldAlert}>
        Sesuai ketentuan UU Jaminan Produk Halal, Penyelia Halal wajib beragama Islam dan ditunjuk resmi oleh pimpinan perusahaan/pelaku usaha melalui Surat Keputusan (SK) Penetapan.
      </Callout>

      {/* 1. Identitas & SK Penetapan */}
      <div>
        <SectionHeading
          title="Identitas & SK Penetapan Penyelia Halal"
          required
          description="Data identitas personel penyelia yang ditetapkan oleh pimpinan usaha."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="input-penyelia-nama" required>
              Nama Lengkap Penyelia
            </FieldLabel>
            <input
              id="input-penyelia-nama"
              type="text"
              className={inputClass}
              placeholder="Nama lengkap sesuai KTP"
              value={p.penyelia_nama}
              onChange={(e) => updatePenyelia("penyelia_nama", e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="input-penyelia-nik" required>
              Nomor KTP / NIK
            </FieldLabel>
            <input
              id="input-penyelia-nik"
              type="text"
              maxLength={16}
              className={`${inputClass} font-mono`}
              placeholder="16 digit NIK KTP"
              value={p.penyelia_nik}
              onChange={(e) => updatePenyelia("penyelia_nik", e.target.value)}
            />
            <FieldHint>16 digit angka resmi KTP.</FieldHint>
          </div>

          <div>
            <FieldLabel htmlFor="input-penyelia-agama" required>
              Agama
            </FieldLabel>
            <input
              id="input-penyelia-agama"
              type="text"
              readOnly
              disabled
              className={`${inputClass} bg-slate-100 cursor-not-allowed text-slate-700 font-semibold`}
              value={p.penyelia_agama || "Islam"}
            />
            <FieldHint>Wajib beragama Islam sesuai UU JPH.</FieldHint>
          </div>

          <div>
            <FieldLabel htmlFor="input-penyelia-kontak" required>
              Nomor WhatsApp / HP Penyelia
            </FieldLabel>
            <input
              id="input-penyelia-kontak"
              type="text"
              className={inputClass}
              placeholder="0812xxxxxxxx"
              value={p.penyelia_kontak}
              onChange={(e) => updatePenyelia("penyelia_kontak", e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="input-penyelia-no-sk" optional>
              Nomor SK Penetapan Penyelia
            </FieldLabel>
            <input
              id="input-penyelia-no-sk"
              type="text"
              className={inputClass}
              placeholder="Contoh: SK/001/PH/2026"
              value={p.penyelia_no_sk}
              onChange={(e) => updatePenyelia("penyelia_no_sk", e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="input-penyelia-tgl-sk" optional>
              Tanggal SK Penetapan
            </FieldLabel>
            <DateInput
              value={p.penyelia_tgl_sk}
              onChange={(e) => updatePenyelia("penyelia_tgl_sk", e.target.value)}
            />
          </div>

          <div>
            <FieldLabel htmlFor="input-penyelia-sertifikat" required={isReguler} optional={!isReguler}>
              Nomor Sertifikat Pelatihan/Kompetensi
            </FieldLabel>
            <input
              id="input-penyelia-sertifikat"
              type="text"
              className={inputClass}
              placeholder="Nomor sertifikat penyelia halal"
              value={p.penyelia_no_sertifikat}
              onChange={(e) => updatePenyelia("penyelia_no_sertifikat", e.target.value)}
            />
            <FieldHint>{isReguler ? "Wajib untuk jalur reguler" : "Opsional untuk Self Declare"}</FieldHint>
          </div>

          <div>
            <FieldLabel htmlFor="input-penyelia-tgl-sertifikat" optional>
              Tanggal Sertifikat Pelatihan
            </FieldLabel>
            <DateInput
              value={p.penyelia_tgl_sertifikat}
              onChange={(e) => updatePenyelia("penyelia_tgl_sertifikat", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 2. Unggah Berkas Pendukung */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Unggah Berkas Pendukung Penyelia Halal"
          required
          description="Format file PDF / JPG / PNG maksimal 10 MB per berkas."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropzoneUploader
            label="SK Penetapan Penyelia"
            helperText="Surat penetapan resmi pimpinan (PDF/JPG/PNG)"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={10}
            value={payload.file_sk_penyelia}
            onChange={(file) => onChange((prev) => ({ ...prev, file_sk_penyelia: file }))}
          />

          <DropzoneUploader
            label="Salinan KTP Penyelia"
            helperText="Foto / scan e-KTP jelas terbaca (PDF/JPG/PNG)"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={10}
            value={payload.file_ktp_penyelia}
            onChange={(file) => onChange((prev) => ({ ...prev, file_ktp_penyelia: file }))}
          />

          <div className="md:col-span-2">
            <DropzoneUploader
              label="Sertifikat Pelatihan Penyelia"
              helperText="Sertifikat pelatihan PPH / SKKNI (PDF/JPG/PNG)"
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={10}
              value={payload.file_sertifikat_penyelia}
              onChange={(file) => onChange((prev) => ({ ...prev, file_sertifikat_penyelia: file }))}
            />
          </div>
        </div>
      </div>
    </StepPanel>
  )
}
