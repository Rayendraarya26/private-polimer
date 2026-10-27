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
  GraduationCap,
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
import {
  FormField,
  TextInput,
  TextareaInput,
  SelectInput,
  DateInput,
  DropzoneUploader,
} from "../forms"

const FormPerorangan: React.FC = () => {
  const { profile } = useProfile()
  const { rhf, errors, submitting, onSubmit } = useEditProfilePerorangan()
  const { provinces, regencies, districts, loading: loadingRegions } = useRegions(
    rhf.watch("prov_id"),
    rhf.watch("kab_id")
  )
  const watchAlamat = rhf.watch("alamat")
  const watchProvinsi = rhf.watch("prov_id")
  const watchKabupaten = rhf.watch("kab_id")
  const watchKecamatan = rhf.watch("kec_id")
  const isRegionLocked =
    !!watchAlamat &&
    watchAlamat.trim().length > 0 &&
    !!watchProvinsi &&
    !!watchKabupaten &&
    !!watchKecamatan
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
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 shadow-2xs">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  1. Identitas Pribadi Pemohon
                </h3>
                <p className="text-xs text-slate-500">
                  Data diri lengkap sesuai Kartu Tanda Penduduk (KTP)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Nama Lengkap"
                required
                error={errors?.nama?.message}
              >
                <TextInput
                  placeholder="Masukkan nama lengkap..."
                  leftIcon={<User className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.nama?.message}
                  {...rhf.register("nama")}
                />
              </FormField>

              <FormField
                label="Nomor Induk Kependudukan (NIK)"
                required
                tooltip="16 digit angka sesuai KTP"
                error={errors?.nik?.message}
              >
                <TextInput
                  type="text"
                  placeholder="16 digit NIK..."
                  leftIcon={<CreditCard className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.nik?.message}
                  {...rhf.register("nik")}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormField
                label="Tempat Lahir"
                required
                error={errors?.tempat_lahir?.message}
              >
                <TextInput
                  placeholder="Kota kelahiran..."
                  hasError={!!errors?.tempat_lahir?.message}
                  {...rhf.register("tempat_lahir")}
                />
              </FormField>

              <FormField
                label="Tanggal Lahir"
                required
                error={errors?.tanggal_lahir?.message}
              >
                <DateInput
                  hasError={!!errors?.tanggal_lahir?.message}
                  value={rhf.watch("tanggal_lahir")}
                  onChange={(e) => rhf.setValue("tanggal_lahir", e.target.value)}
                />
              </FormField>

              <FormField
                label="Jenis Kelamin"
                required
                error={errors?.jenis_kelamin?.message}
              >
                <SelectInput
                  placeholder="-- Pilih --"
                  options={Object.values(PelangganGender).map((value) => ({
                    value,
                    label: value,
                  }))}
                  value={rhf.watch("jenis_kelamin")}
                  onChange={(val) => rhf.setValue("jenis_kelamin", val as any)}
                  hasError={!!errors?.jenis_kelamin?.message}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Kewarganegaraan"
                required
                error={errors?.kewarganegaraan?.message}
              >
                <TextInput
                  placeholder="Contoh: WNI"
                  hasError={!!errors?.kewarganegaraan?.message}
                  {...rhf.register("kewarganegaraan")}
                />
              </FormField>

              <FormField
                label="Alamat Surel (Email)"
                required
                error={errors?.surel?.message}
              >
                <TextInput
                  type="email"
                  placeholder="email@example.com"
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.surel?.message}
                  {...rhf.register("surel")}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Pendidikan Terakhir"
                required
                error={errors?.pendidikan_terakhir?.message}
              >
                <SelectInput
                  placeholder="-- Pilih Jenjang Pendidikan --"
                  options={refEducations.map((r) => ({
                    value: r.value,
                    label: r.text,
                  }))}
                  value={rhf.watch("pendidikan_terakhir")}
                  onChange={(val) => rhf.setValue("pendidikan_terakhir", val as any)}
                  hasError={!!errors?.pendidikan_terakhir?.message}
                />
              </FormField>

              {rhf.watch("pendidikan_terakhir") === "OTHER" && (
                <FormField
                  label="Pendidikan Lainnya"
                  required
                >
                  <TextInput
                    placeholder="Sebutkan jenjang..."
                    {...rhf.register("pendidikan_lainnya")}
                  />
                </FormField>
              )}
            </div>

            {/* WhatsApp Verification */}
            <FormField
              label="Nomor WhatsApp Aktif"
              required
              tooltip="Digunakan untuk pengiriman kode OTP verifikasi dan komunikasi hasil uji"
              error={errors?.whatsapp?.message}
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
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
                    size="md"
                    disabled={requesting}
                    onClick={() => getWhatsappOTP(rhf.getValues("whatsapp"))}
                    isLoading={requesting}
                    className="shrink-0 shadow-sm font-semibold"
                  >
                    Kirim Kode OTP
                  </Button>
                )}
              </div>

              {!isRequested && !isWhatsappChanged && profile?.detail?.whatsapp_verified === YesNoOption.YES && (
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold mt-2 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nomor WhatsApp telah terverifikasi resmi</span>
                </div>
              )}
            </FormField>

            {isRequested && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 animate-in fade-in-50 duration-200">
                <label className="block text-xs font-bold text-amber-950">
                  Masukkan 6 Digit Kode Verifikasi OTP WhatsApp
                </label>
                <TextInput
                  type="text"
                  placeholder="Contoh: 123456"
                  maxLength={6}
                  hasError={!!errors?.whatsapp_otp?.message}
                  {...rhf.register("whatsapp_otp")}
                />
                {errors?.whatsapp_otp?.message && (
                  <p className="text-xs text-rose-600 font-medium">{errors.whatsapp_otp.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Wilayah & Alamat */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shadow-2xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  2. Wilayah & Alamat Domisili
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih wilayah administrasi secara berjenjang untuk menentukan alamat
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormField
                label="Provinsi"
                required
                action={loadingRegions && <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />}
              >
                <SelectInput
                  disabled={isRegionLocked}
                  placeholder="-- Pilih Provinsi --"
                  searchPlaceholder="Cari provinsi..."
                  options={provinces.map((p) => ({ value: p.id, label: p.nama }))}
                  value={rhf.watch("prov_id") || ""}
                  onChange={(val) => {
                    rhf.setValue("prov_id", String(val))
                    rhf.setValue("kab_id", "")
                    rhf.setValue("kec_id", "")
                    rhf.setValue("alamat", "")
                  }}
                  onClear={() => {
                    rhf.setValue("prov_id", "")
                    rhf.setValue("kab_id", "")
                    rhf.setValue("kec_id", "")
                    rhf.setValue("alamat", "")
                  }}
                />
              </FormField>

              <FormField
                label="Kabupaten / Kota"
                required
                action={loadingRegions && <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />}
              >
                <SelectInput
                  disabled={isRegionLocked || !rhf.watch("prov_id")}
                  placeholder="-- Pilih Kabupaten/Kota --"
                  searchPlaceholder="Cari kabupaten/kota..."
                  options={regencies.map((k) => ({ value: k.id, label: k.nama }))}
                  value={rhf.watch("kab_id") || ""}
                  onChange={(val) => {
                    rhf.setValue("kab_id", String(val))
                    rhf.setValue("kec_id", "")
                    rhf.setValue("alamat", "")
                  }}
                  onClear={() => {
                    rhf.setValue("kab_id", "")
                    rhf.setValue("kec_id", "")
                    rhf.setValue("alamat", "")
                  }}
                />
              </FormField>

              <FormField
                label="Kecamatan"
                required
                action={loadingRegions && <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />}
              >
                <SelectInput
                  disabled={isRegionLocked || !rhf.watch("kab_id")}
                  placeholder="-- Pilih Kecamatan --"
                  searchPlaceholder="Cari kecamatan..."
                  options={districts.map((d) => ({ value: d.id, label: d.nama }))}
                  value={rhf.watch("kec_id") || ""}
                  onChange={(val) => {
                    rhf.setValue("kec_id", String(val))
                    rhf.setValue("alamat", "")
                  }}
                  onClear={() => {
                    rhf.setValue("kec_id", "")
                    rhf.setValue("alamat", "")
                  }}
                />
              </FormField>
            </div>

            <FormField
              label="Alamat Lengkap (Jalan, RT/RW, No. Rumah)"
              required
              helperText="Tuliskan nama jalan, nomor rumah, dan RT/RW secara jelas"
              error={errors?.alamat?.message}
            >
              <TextareaInput
                rows={3}
                disabled={isAddressDisabled}
                placeholder={
                  isAddressDisabled
                    ? "Harap pilih provinsi, kabupaten, dan kecamatan terlebih dahulu..."
                    : "Contoh: Jl. Diponegoro No. 12, RT 02/RW 04"
                }
                hasError={!!errors?.alamat?.message}
                {...rhf.register("alamat")}
              />
            </FormField>

            {/* Tombol Ganti Wilayah Jelas di Bawah Form */}
            {isRegionLocked && (
              <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-rose-900 leading-relaxed">
                  <RotateCcw className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    Wilayah terkunci karena alamat telah terisi. Ingin memindahkan alamat ke wilayah lain?
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<RotateCcw className="w-3.5 h-3.5 text-rose-600" />}
                  className="shrink-0 whitespace-nowrap bg-white border-rose-300 text-rose-700 hover:bg-rose-100 hover:border-rose-400 font-semibold text-xs"
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

          {/* Section 3: Legalitas & Perpajakan */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-2xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  3. Nomor Pokok Pajak & Berusaha
                </h3>
                <p className="text-xs text-slate-500">
                  Data perpajakan untuk penerbitan kuitansi resmi PNBP
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Nomor Pokok Wajib Pajak (NPWP)"
                required
                tooltip="15 atau 16 digit NPWP pribadi"
                error={errors?.npwp?.message}
              >
                <TextInput
                  type="text"
                  placeholder="15 atau 16 digit NPWP..."
                  leftIcon={<CreditCard className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.npwp?.message}
                  {...rhf.register("npwp")}
                />
              </FormField>

              <FormField
                label="Nomor Induk Berusaha (NIB)"
                required
                tooltip="13 digit NIB perseorangan dari OSS"
                error={errors?.nib?.message}
              >
                <TextInput
                  type="text"
                  placeholder="13 digit NIB..."
                  leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.nib?.message}
                  {...rhf.register("nib")}
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Unggah Dokumen & Tombol Simpan (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shadow-2xs">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Dokumen Legalitas Pemohon
                </h3>
                <p className="text-xs text-slate-500">Format PDF/Gambar, Maks. 5 MB</p>
              </div>
            </div>

            {/* Dokumen NPWP */}
            <FormField
              label="Dokumen NPWP Pribadi"
              required
              error={errors?.dok_npwp?.message}
            >
              <DropzoneUploader
                value={rhf.watch("dok_npwp") || profile?.detail?.dok_npwp}
                onChange={(file) => rhf.setValue("dok_npwp", file as any)}
                hasError={!!errors?.dok_npwp?.message}
                label="Unggah File NPWP"
                helperText="PDF / Gambar (Maks. 5 MB)"
              />
            </FormField>

            {/* Dokumen NIB */}
            <FormField
              label="Dokumen NIB Perseorangan"
              required
              error={errors?.dok_nib?.message}
            >
              <DropzoneUploader
                value={rhf.watch("dok_nib") || profile?.detail?.dok_nib}
                onChange={(file) => rhf.setValue("dok_nib", file as any)}
                hasError={!!errors?.dok_nib?.message}
                label="Unggah File NIB"
                helperText="PDF / Gambar (Maks. 5 MB)"
              />
            </FormField>
          </div>

          {/* Action Button Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-3 sticky top-24">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md font-bold text-sm bg-brand-600 hover:bg-brand-700"
              isLoading={submitting || requesting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Simpan Perubahan Data
            </Button>
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              Pastikan data yang Anda isi telah benar dan sesuai dengan dokumen legalitas asli.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default memo(FormPerorangan)