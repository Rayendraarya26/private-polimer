import React from "react"
import { toast } from "react-hot-toast"
import { ProfileClientType } from "../../../types/profile"
import { ParticipantLSP } from "../../../types/lsp"
import PhoneInputWithCountrySelect from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { User, Briefcase, FileUp, CheckCircle2, ShieldAlert } from "lucide-react"

const MAX_FILE_SIZE = 3 * 1024 * 1024

const allowedTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
]

interface Props {
  formData: ParticipantLSP
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
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
  jenisPelanggan,
  detail,
  pilihanProfil,
  onPilihanProfilChange,
  isFieldDisabled,
}) => {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    label: string
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Ukuran file ${label} maksimal 3 MB`)
      e.target.value = ""
      return
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error(`${label} harus berupa berkas PDF atau gambar (JPG/PNG)`)
      e.target.value = ""
      return
    }

    onChange(e as any)
  }

  return (
    <div className="space-y-6">
      {/* Profil Selector Card (for Instansi / Perusahaan) */}
      {jenisPelanggan !== ProfileClientType.PERORANGAN && (
        <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Pilih Sumber Data Peserta <span className="text-rose-500">*</span>
          </label>
          <select
            value={pilihanProfil}
            onChange={onPilihanProfilChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          >
            <option value="Manual">Input Manual (Pegawai / Calon Asesi Delegasi)</option>
            <option value="pimpinan">Pimpinan ({detail?.pimpinan || "Data Kosong"})</option>
            <option value="penanggung_jawab">Penanggung Jawab / PIC ({detail?.pj_nama || "Data Kosong"})</option>
          </select>
          <p className="text-[11px] text-slate-500">
            Pilih apakah peserta adalah pimpinan, penanggung jawab, atau staf lainnya.
          </p>
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nama Lengkap (tanpa gelar disarankan) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={onChange}
            disabled={isFieldDisabled}
            placeholder="Masukkan nama lengkap peserta..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
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
              onChange={onChange}
              placeholder="Kota kelahiran..."
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
              onChange={onChange}
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
              onChange={onChange}
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
              Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nik_peserta"
              value={formData.nik_peserta || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 16)
                onChange({
                  ...e,
                  target: { name: "nik_peserta", value },
                } as any)
              }}
              inputMode="numeric"
              maxLength={16}
              placeholder="16 digit NIK..."
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
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            >
              <option value="">-- Pilih --</option>
              <option value="WNI">WNI (Warga Negara Indonesia)</option>
              <option value="WNA">WNA (Warga Negara Asing)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pendidikan Terakhir <span className="text-rose-500">*</span>
            </label>
            <select
              name="pendidikan"
              value={formData.pendidikan}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
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

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Lengkap Domisili <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              name="alamat_peserta"
              value={formData.alamat_peserta}
              onChange={onChange}
              placeholder="Nama jalan, RT/RW, kelurahan, kecamatan, kota..."
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
              value={formData.kode_pos || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 5)
                onChange({
                  ...e,
                  target: { name: "kode_pos", value },
                } as any)
              }}
              inputMode="numeric"
              maxLength={5}
              placeholder="5 digit..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
            </label>
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
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Email Aktif <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              disabled={isFieldDisabled}
              placeholder="email@example.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jabatan / Posisi Pekerjaan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="jabatan"
              value={formData.jabatan || ""}
              onChange={onChange}
              placeholder="Contoh: Operator Mesin / Analis Mutu..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pengalaman Kerja Relevan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="pengalaman_kerja"
              value={formData.pengalaman_kerja || ""}
              onChange={onChange}
              placeholder="Contoh: 3 Tahun di Industri Plastik..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>
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
                Format: PDF, JPG, PNG, JPEG • Maksimal 3 MB per dokumen
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Upload KTP */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Kartu Tanda Penduduk (KTP) <span className="text-rose-500">*</span>
            </label>
            <input
              type="file"
              name="ktp_peserta"
              accept=".pdf, image/*"
              onChange={(e) => handleFileChange(e, "KTP")}
              className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              required
            />
            {formData.ktp_peserta && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> File: {formData.ktp_peserta.name}
              </p>
            )}
          </div>

          {/* Upload Ijazah */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Ijazah Terakhir <span className="text-rose-500">*</span>
            </label>
            <input
              type="file"
              name="ijazah"
              accept=".pdf, image/*"
              onChange={(e) => handleFileChange(e, "Ijazah")}
              className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              required
            />
            {formData.ijazah && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> File: {formData.ijazah.name}
              </p>
            )}
          </div>

          {/* Upload APL-01 */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Formulir APL-01 (Permohonan) <span className="text-rose-500">*</span>
            </label>
            <input
              type="file"
              name="apl_01"
              accept=".pdf, image/*"
              onChange={(e) => handleFileChange(e, "APL-01")}
              className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              required
            />
            {formData.apl_01 && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> File: {formData.apl_01.name}
              </p>
            )}
          </div>

          {/* Upload APL-02 */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Formulir APL-02 (Asesmen Mandiri) <span className="text-rose-500">*</span>
            </label>
            <input
              type="file"
              name="apl_02"
              accept=".pdf, image/*"
              onChange={(e) => handleFileChange(e, "APL-02")}
              className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              required
            />
            {formData.apl_02 && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> File: {formData.apl_02.name}
              </p>
            )}
          </div>

          {/* Upload Dokumen Lainnya */}
          <div className="sm:col-span-2 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Dokumen Portofolio Tambahan / Sertifikat Terkait <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="file"
              name="upload_lainya"
              accept=".pdf, image/*"
              onChange={(e) => handleFileChange(e, "Dokumen Lainnya")}
              className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
            {formData.upload_lainya && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> File: {formData.upload_lainya.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormDataPesertaLSP
