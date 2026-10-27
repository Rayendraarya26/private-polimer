import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { FormHalalPayload } from "../../../types/halal"
import {
  FormField,
  TextInput,
  DateInput,
  DropzoneUploader,
} from "../../forms"
import {
  UserCheck,
  Upload,
  FileText,
  ShieldAlert,
  Calendar,
  CheckCircle,
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
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <UserCheck className="w-4 h-4 text-brand-600" />
              3. Data & Berkas Penyelia Halal
            </CardTitle>
            <CardDescription>
              Penyelia Halal bertanggung jawab mengawasi penerapan Proses Produk Halal (PPH) dan wajib beragama Islam
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Section 1: Identitas & SK Penetapan Penyelia */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Identitas & SK Penetapan Penyelia Halal
              </h4>
              <p className="text-[11px] text-slate-500">
                Data identitas personel penyelia yang ditetapkan oleh pimpinan usaha
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              Sesuai ketentuan UU Jaminan Produk Halal, Penyelia Halal beragama Islam dan ditunjuk
              resmi oleh pimpinan perusahaan/pelaku usaha melalui Surat Keputusan (SK) Penetapan.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nama Lengkap Penyelia" required>
              <TextInput
                placeholder="Nama lengkap sesuai KTP"
                value={p.penyelia_nama}
                onChange={(e) => updatePenyelia("penyelia_nama", e.target.value)}
              />
            </FormField>

            <FormField label="Nomor KTP / NIK" required helperText="16 digit angka resmi KTP">
              <TextInput
                maxLength={16}
                placeholder="16 digit NIK KTP"
                value={p.penyelia_nik}
                onChange={(e) => updatePenyelia("penyelia_nik", e.target.value)}
                className="font-mono"
              />
            </FormField>

            <FormField label="Agama" required helperText="Wajib beragama Islam sesuai UU JPH">
              <TextInput
                value={p.penyelia_agama || "Islam"}
                readOnly
                disabled
                className="bg-slate-100 cursor-not-allowed text-slate-700 font-semibold"
              />
            </FormField>

            <FormField label="Nomor WhatsApp / HP Penyelia" required>
              <TextInput
                placeholder="0812xxxxxxxx"
                value={p.penyelia_kontak}
                onChange={(e) => updatePenyelia("penyelia_kontak", e.target.value)}
              />
            </FormField>

            <FormField label="Nomor SK Penetapan Penyelia">
              <TextInput
                placeholder="Contoh: SK/001/PH/2026"
                value={p.penyelia_no_sk}
                onChange={(e) => updatePenyelia("penyelia_no_sk", e.target.value)}
              />
            </FormField>

            <FormField label="Tanggal SK Penetapan">
              <DateInput
                value={p.penyelia_tgl_sk}
                onChange={(e) => updatePenyelia("penyelia_tgl_sk", e.target.value)}
              />
            </FormField>

            <FormField
              label="Nomor Sertifikat Pelatihan/Kompetensi"
              required={isReguler}
              helperText={isReguler ? "Wajib untuk jalur reguler" : "Opsional untuk Self Declare"}
            >
              <TextInput
                placeholder="Nomor sertifikat penyelia halal"
                value={p.penyelia_no_sertifikat}
                onChange={(e) => updatePenyelia("penyelia_no_sertifikat", e.target.value)}
              />
            </FormField>

            <FormField label="Tanggal Sertifikat Pelatihan">
              <DateInput
                value={p.penyelia_tgl_sertifikat}
                onChange={(e) => updatePenyelia("penyelia_tgl_sertifikat", e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {/* Section 2: Unggah Berkas Pendukung Penyelia Halal */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Unggah Berkas Pendukung Penyelia Halal
              </h4>
              <p className="text-[11px] text-slate-500">
                Format file PDF / JPG / PNG maksimal 10 MB per berkas
              </p>
            </div>
          </div>

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
      </CardContent>
    </Card>
  )
}
