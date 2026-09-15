import React, { memo, useMemo } from "react"
import useProfile from "../../hooks/useProfile"
import useEditProfilePerorangan from "../../hooks/profile/useEditProfilePerorangan"
import {
  User,
  CreditCard,
  MapPin,
  FileText,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Download,
  RotateCcw,
  UploadCloud,
  Loader2,
  Save,
} from "lucide-react"
import { PelangganGender } from "../../types/profile"
import { refEducations } from "../../constants/common"
import useRequestOTP from "../../hooks/useRequestOTP"
import { getPlainE164PhoneNumber } from "../../utils/common"
import { YesNoOption } from "../../types/core"
import PhoneInputWithCountrySelect from "react-phone-number-input"
import "react-phone-number-input/style.css"
import useRegions from "../../hooks/profile/useRegions"
import { Button } from "../ui/Button"

const FormPerorangan: React.FC = () => {
  const { profile } = useProfile()
  const { rhf, errors, submitting, onSubmit } = useEditProfilePerorangan()
  const { provinces, regencies, districts, loading: loadingRegions } = useRegions(
    rhf.watch("prov_id"),
    rhf.watch("kab_id")
  )
  const watchAlamat = rhf.watch("alamat")
  const watchKecamatan = rhf.watch("kec_id")
  const isRegionLocked = !!watchAlamat && watchAlamat.trim().length > 0
  const isAddressDisabled = !watchKecamatan

  const { requesting, isRequested, getWhatsappOTP } = useRequestOTP()
  const isWhatsappChanged = useMemo<boolean>(() => {
    return (
      getPlainE164PhoneNumber(rhf.getValues("whatsapp")) !==
      getPlainE164PhoneNumber(profile?.detail?.whatsapp || "")
    )
  }, [rhf.watch("whatsapp"), profile])

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kolom Kiri: Form Input Fields (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Identitas Pribadi */}
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  1. Identitas Pribadi Pemohon
                </h3>
                <p className="text-xs text-slate-500">
                  Data diri lengkap sesuai Kartu Tanda Penduduk (KTP)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap..."
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.nama?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("nama")}
                />
                {errors?.nama?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.nama.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="16 digit NIK..."
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.nik?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("nik")}
                />
                {errors?.nik?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.nik.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tempat Lahir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Kota kelahiran..."
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.tempat_lahir?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("tempat_lahir")}
                />
                {errors?.tempat_lahir?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.tempat_lahir.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tanggal Lahir <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.tanggal_lahir?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("tanggal_lahir")}
                />
                {errors?.tanggal_lahir?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.tanggal_lahir.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <select
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.jenis_kelamin?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("jenis_kelamin")}
                >
                  <option value="" disabled>-- Pilih --</option>
                  {Object.values(PelangganGender).map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </select>
                {errors?.jenis_kelamin?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.jenis_kelamin.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kewarganegaraan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: WNI"
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.kewarganegaraan?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("kewarganegaraan")}
                />
                {errors?.kewarganegaraan?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.kewarganegaraan.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alamat Surel (Email) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.surel?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("surel")}
                />
                {errors?.surel?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.surel.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pendidikan Terakhir <span className="text-rose-500">*</span>
                </label>
                <select
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.pendidikan_terakhir?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("pendidikan_terakhir")}
                >
                  <option value="" disabled>-- Pilih Jenjang Pendidikan --</option>
                  {refEducations.map((r) => (
                    <option value={r.value} key={r.value}>
                      {r.text}
                    </option>
                  ))}
                </select>
                {errors?.pendidikan_terakhir?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.pendidikan_terakhir.message}</p>
                )}
              </div>

              {rhf.watch("pendidikan_terakhir") === "OTHER" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pendidikan Lainnya <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Sebutkan jenjang..."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800"
                    {...rhf.register("pendidikan_lainnya")}
                  />
                </div>
              )}
            </div>

            {/* WhatsApp Verification */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
              </label>

              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <div className="flex-1">
                  <PhoneInputWithCountrySelect
                    international
                    defaultCountry="ID"
                    placeholder="Contoh: +62 812-3456-7890"
                    value={rhf.watch("whatsapp")}
                    onChange={(v) => rhf.setValue("whatsapp", v)}
                    className="w-full"
                  />
                </div>

                {isWhatsappChanged && !!rhf.watch("whatsapp") && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={requesting}
                    onClick={() => getWhatsappOTP(rhf.getValues("whatsapp"))}
                    isLoading={requesting}
                    className="shrink-0 shadow-sm"
                  >
                    Kirim Kode OTP
                  </Button>
                )}
              </div>

              {errors?.whatsapp?.message && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.whatsapp.message}</p>
              )}

              {!isRequested && !isWhatsappChanged && profile?.detail?.whatsapp_verified === YesNoOption.YES && (
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mt-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nomor WhatsApp telah terverifikasi resmi</span>
                </div>
              )}
            </div>

            {isRequested && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <label className="block text-xs font-bold text-amber-900">
                  Kode Verifikasi OTP WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="Masukkan 6 digit kode OTP"
                  className="w-full rounded-lg border border-amber-300 bg-white px-3.5 py-2 text-xs text-slate-900"
                  {...rhf.register("whatsapp_otp")}
                />
                {errors?.whatsapp_otp?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.whatsapp_otp.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Wilayah & Alamat */}
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  2. Wilayah & Alamat Domisili
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih wilayah administrasi secara berjenjang untuk menentukan alamat
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Provinsi</span>
                  {loadingRegions && <Loader2 className="w-3 h-3 animate-spin text-brand-600" />}
                </label>
                <select
                  disabled={isRegionLocked}
                  value={rhf.watch("prov_id") || ""}
                  onChange={(e) => {
                    rhf.setValue("prov_id", e.target.value)
                    rhf.setValue("kab_id", "")
                    rhf.setValue("kec_id", "")
                    rhf.setValue("alamat", "")
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
                >
                  <option value="">-- Pilih Provinsi --</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Kabupaten / Kota</span>
                  {loadingRegions && <Loader2 className="w-3 h-3 animate-spin text-brand-600" />}
                </label>
                <select
                  disabled={isRegionLocked || !rhf.watch("prov_id")}
                  value={rhf.watch("kab_id") || ""}
                  onChange={(e) => {
                    rhf.setValue("kab_id", e.target.value)
                    rhf.setValue("kec_id", "")
                    rhf.setValue("alamat", "")
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
                >
                  <option value="">-- Pilih Kabupaten/Kota --</option>
                  {regencies.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Kecamatan</span>
                  {loadingRegions && <Loader2 className="w-3 h-3 animate-spin text-brand-600" />}
                </label>
                <select
                  disabled={isRegionLocked || !rhf.watch("kab_id")}
                  value={rhf.watch("kec_id") || ""}
                  onChange={(e) => {
                    rhf.setValue("kec_id", e.target.value)
                    rhf.setValue("alamat", "")
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
                >
                  <option value="">-- Pilih Kecamatan --</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Lengkap (Jalan, RT/RW, No. Rumah) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                disabled={isAddressDisabled}
                placeholder={
                  isAddressDisabled
                    ? "Pilih provinsi, kabupaten, dan kecamatan terlebih dahulu..."
                    : "Contoh: Jl. Diponegoro No. 12, RT 02/RW 04"
                }
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-100"
                {...rhf.register("alamat")}
              />
              {errors?.alamat?.message && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.alamat.message}</p>
              )}
            </div>

            {/* Tombol Ganti Wilayah Jelas di Bawah Form */}
            {isRegionLocked && (
              <div className="p-3.5 bg-rose-50/80 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-rose-900">
                  <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    Dropdown wilayah terkunci karena alamat telah terisi. Ingin memindahkan alamat ke wilayah lain?
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5 text-rose-600" />}
                  className="shrink-0 whitespace-nowrap bg-white border-rose-300 text-rose-700 hover:bg-rose-100 hover:border-rose-400 font-semibold"
                  onClick={() => {
                    rhf.setValue("alamat", "")
                    rhf.setValue("prov_id", "")
                    rhf.setValue("kab_id", "")
                    rhf.setValue("kec_id", "")
                  }}
                >
                  Ganti / Ubah Wilayah
                </Button>
              </div>
            )}
          </div>

          {/* Section 3: Legalitas Usaha */}
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  3. Nomor Pokok Pajak & Berusaha
                </h3>
                <p className="text-xs text-slate-500">
                  Data perpajakan untuk penerbitan kuitansi resmi PNBP
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor Pokok Wajib Pajak (NPWP) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="15 atau 16 digit NPWP..."
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.npwp?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("npwp")}
                />
                {errors?.npwp?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.npwp.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor Induk Berusaha (NIB) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="13 digit NIB..."
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.nib?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("nib")}
                />
                {errors?.nib?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.nib.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Unggah Dokumen & Tombol Simpan (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Dokumen Pendukung
                </h3>
                <p className="text-xs text-slate-500">Format PDF maks 5 MB</p>
              </div>
            </div>

            {/* Dokumen NPWP */}
            <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Dokumen NPWP <span className="text-rose-500">*</span>
                </span>
                {profile?.detail?.dok_npwp && (
                  <a
                    href={profile.detail.dok_npwp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </a>
                )}
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  rhf.setValue("dok_npwp", (e.target as HTMLInputElement).files?.[0] || null)
                }
                className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              />
              {errors?.dok_npwp?.message && (
                <p className="text-[11px] text-rose-500">{errors.dok_npwp.message}</p>
              )}
            </div>

            {/* Dokumen NIB */}
            <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Dokumen NIB <span className="text-rose-500">*</span>
                </span>
                {profile?.detail?.dok_nib && (
                  <a
                    href={profile.detail.dok_nib}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh
                  </a>
                )}
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  rhf.setValue("dok_nib", (e.target as HTMLInputElement).files?.[0] || null)
                }
                className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              />
              {errors?.dok_nib?.message && (
                <p className="text-[11px] text-rose-500">{errors.dok_nib.message}</p>
              )}
            </div>
          </div>

          {/* Action Button Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md"
              isLoading={submitting || requesting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Simpan Perubahan Data
            </Button>
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Pastikan data yang Anda isi telah benar dan sesuai dengan dokumen legalitas asli.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default memo(FormPerorangan)