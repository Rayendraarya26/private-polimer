import React, { memo, useMemo } from "react"
import useEditProfileInstansi from "../../hooks/profile/useEditProfileInstansi"
import useProfile from "../../hooks/useProfile"
import {
  Landmark,
  User,
  CreditCard,
  MapPin,
  FileText,
  Phone,
  Mail,
  CheckCircle2,
  Download,
  RotateCcw,
  UploadCloud,
  Loader2,
  Save,
  Printer,
} from "lucide-react"
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
  DropzoneUploader,
} from "../forms"

const FormInstansi: React.FC = () => {
  const { profile } = useProfile()
  const { rhf, errors, submitting, onSubmit } = useEditProfileInstansi()
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
      getPlainE164PhoneNumber(rhf.getValues("pj_whatsapp")) !==
      getPlainE164PhoneNumber(profile?.detail?.pj_whatsapp || "")
    )
  }, [rhf.watch("pj_whatsapp"), profile])

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
          {/* Section 1: Data Umum Instansi */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 shadow-2xs">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  1. Profil Instansi Pemerintah
                </h3>
                <p className="text-xs text-slate-500">
                  Data legal instansi/kementerian/lembaga kedinasan pemohon
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Nama Resmi Instansi"
                required
                tooltip="Nama resmi instansi pemerintah, dinas, atau badan publik"
                error={errors?.nama?.message}
              >
                <TextInput
                  placeholder="Contoh: Dinas Perindustrian dan Perdagangan..."
                  leftIcon={<Landmark className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.nama?.message}
                  {...rhf.register("nama")}
                />
              </FormField>

              <FormField
                label="Nama Kepala Dinas / Pimpinan"
                required
                error={errors?.pimpinan?.message}
              >
                <TextInput
                  placeholder="Nama Kepala Dinas / Pimpinan..."
                  hasError={!!errors?.pimpinan?.message}
                  {...rhf.register("pimpinan")}
                />
              </FormField>
            </div>

            {/* Kontak Resmi Instansi */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormField
                label="Nomor Telepon Kantor"
                required
                error={errors?.telepon?.message}
              >
                <TextInput
                  type="tel"
                  placeholder="Contoh: 0274512345"
                  leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.telepon?.message}
                  {...rhf.register("telepon")}
                />
              </FormField>

              <FormField
                label="Nomor Fax Kantor"
                required
                error={errors?.fax?.message}
              >
                <TextInput
                  type="text"
                  placeholder="Contoh: 0274512346"
                  leftIcon={<Printer className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.fax?.message}
                  {...rhf.register("fax")}
                />
              </FormField>

              <FormField
                label="Email Resmi Kedinasan"
                required
                error={errors?.surel?.message}
              >
                <TextInput
                  type="email"
                  placeholder="dinas@go.id"
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.surel?.message}
                  {...rhf.register("surel")}
                />
              </FormField>
            </div>

            <FormField
              label="Nomor WhatsApp Resmi Instansi"
              required
              tooltip="Digunakan untuk notifikasi dan konfirmasi billing permohonan"
              error={errors?.whatsapp?.message}
            >
              <PhoneInputWithCountrySelect
                international
                defaultCountry="ID"
                placeholder="Contoh: +62 812-3456-7890"
                value={rhf.watch("whatsapp")}
                onChange={(v) => rhf.setValue("whatsapp", v)}
                className="w-full"
              />
            </FormField>
          </div>

          {/* Section 2: Wilayah & Alamat */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shadow-2xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  2. Lokasi Gedung Instansi
                </h3>
                <p className="text-xs text-slate-500">
                  Alamat domisili kantor pemerintahan pemohon
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
              label="Alamat Lengkap Kantor Instansi"
              required
              helperText="Tuliskan nama jalan, nomor kompleks perkantoran, dan gedung dinas"
              error={errors?.alamat?.message}
            >
              <TextareaInput
                rows={3}
                disabled={isAddressDisabled}
                placeholder={
                  isAddressDisabled
                    ? "Harap pilih provinsi, kabupaten, dan kecamatan terlebih dahulu..."
                    : "Contoh: Jl. Kusumanegara No. 123, Kompleks Balai Kota..."
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
                    Wilayah terkunci karena alamat telah terisi. Ingin memindahkan alamat instansi ke wilayah lain?
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

          {/* Section 3: Legalitas & SK */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-2xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  3. Legalitas & Nomenklatur
                </h3>
                <p className="text-xs text-slate-500">
                  NPWP Instansi Pemerintah, NIB (jika ada), dan nomor SK Nomenklatur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormField
                label="NPWP Instansi"
                required
                tooltip="NPWP instansi pemerintah atau bendahara pengeluaran"
                error={errors?.npwp?.message}
              >
                <TextInput
                  type="text"
                  placeholder="NPWP instansi..."
                  leftIcon={<CreditCard className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.npwp?.message}
                  {...rhf.register("npwp")}
                />
              </FormField>

              <FormField
                label="Nomor Induk Berusaha (NIB)"
                tooltip="Opsional jika instansi/BLU memiliki NIB OSS"
              >
                <TextInput
                  type="text"
                  placeholder="Opsional..."
                  leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
                  {...rhf.register("nib")}
                />
              </FormField>

              <FormField
                label="SK Nomenklatur Instansi"
                required
                tooltip="Nomor Surat Keputusan pembentukan atau nomenklatur resmi instansi"
                error={errors?.sk_nomenklatur?.message}
              >
                <TextInput
                  type="text"
                  placeholder="Contoh: SK Gub No. 45/2021"
                  hasError={!!errors?.sk_nomenklatur?.message}
                  {...rhf.register("sk_nomenklatur")}
                />
              </FormField>
            </div>
          </div>

          {/* Section 4: Penanggung Jawab (PIC) */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-card space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 shadow-2xs">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  4. Kontak Penanggung Jawab (PIC Operasional)
                </h3>
                <p className="text-xs text-slate-500">
                  Staf / pejabat yang mengkoordinasikan permohonan layanan
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Nama Lengkap Penanggung Jawab"
                required
                error={errors?.pj_nama?.message}
              >
                <TextInput
                  type="text"
                  placeholder="Nama lengkap PIC..."
                  leftIcon={<User className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.pj_nama?.message}
                  {...rhf.register("pj_nama")}
                />
              </FormField>

              <FormField
                label="Email Kedinasan PIC"
                required
                error={errors?.pj_surel?.message}
              >
                <TextInput
                  type="email"
                  placeholder="pic@dinas.go.id"
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  hasError={!!errors?.pj_surel?.message}
                  {...rhf.register("pj_surel")}
                />
              </FormField>
            </div>

            {/* WhatsApp PIC */}
            <FormField
              label="Nomor WhatsApp PIC"
              required
              tooltip="Digunakan untuk pengiriman kode OTP verifikasi dan komunikasi permohonan"
              error={errors?.pj_whatsapp?.message}
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="flex-1">
                  <PhoneInputWithCountrySelect
                    international
                    defaultCountry="ID"
                    placeholder="Contoh: +62 812-3456-7890"
                    value={rhf.watch("pj_whatsapp")}
                    onChange={(v) => rhf.setValue("pj_whatsapp", v)}
                    className="w-full"
                  />
                </div>

                {isWhatsappChanged && !!rhf.watch("pj_whatsapp") && (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    disabled={requesting}
                    onClick={() => getWhatsappOTP(rhf.getValues("pj_whatsapp"))}
                    isLoading={requesting}
                    className="shrink-0 shadow-sm font-semibold"
                  >
                    Kirim Kode OTP
                  </Button>
                )}
              </div>

              {!isRequested && !isWhatsappChanged && profile?.detail?.pj_whatsapp_verified === YesNoOption.YES && (
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold mt-2 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nomor WhatsApp PIC Telah Terverifikasi</span>
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
                  hasError={!!errors?.pj_whatsapp_otp?.message}
                  {...rhf.register("pj_whatsapp_otp")}
                />
                {errors?.pj_whatsapp_otp?.message && (
                  <p className="text-xs text-rose-600 font-medium">{errors.pj_whatsapp_otp.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Dokumen & Simpan (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shadow-2xs">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Dokumen Legalitas Instansi
                </h3>
                <p className="text-xs text-slate-500">Format PDF/Gambar, Maks. 5 MB</p>
              </div>
            </div>

            {/* Dokumen NPWP */}
            <FormField
              label="Dokumen NPWP Instansi"
              error={errors?.dok_npwp?.message}
            >
              <DropzoneUploader
                value={rhf.watch("dok_npwp") || profile?.detail?.dok_npwp}
                onChange={(file) => rhf.setValue("dok_npwp", file as any)}
                label="Unggah File NPWP Instansi"
                helperText="PDF / Gambar (Maks. 5 MB)"
              />
            </FormField>

            {/* Dokumen NIB */}
            <FormField
              label="Dokumen NIB (Opsional)"
              error={errors?.dok_nib?.message}
            >
              <DropzoneUploader
                value={rhf.watch("dok_nib") || profile?.detail?.dok_nib}
                onChange={(file) => rhf.setValue("dok_nib", file as any)}
                label="Unggah File NIB"
                helperText="PDF / Gambar (Maks. 5 MB)"
              />
            </FormField>

            {/* Dokumen SK Nomenklatur */}
            <FormField
              label="Dokumen SK Nomenklatur"
              required
              error={errors?.dok_sk_nomenklatur?.message}
            >
              <DropzoneUploader
                value={rhf.watch("dok_sk_nomenklatur") || profile?.detail?.dok_sk_nomenklatur}
                onChange={(file) => rhf.setValue("dok_sk_nomenklatur", file as any)}
                hasError={!!errors?.dok_sk_nomenklatur?.message}
                label="Unggah SK Nomenklatur"
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
              isLoading={submitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Simpan Profil Instansi
            </Button>
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              Pastikan data instansi dan nomor PIC telah terverifikasi sebelum menyimpan perubahan.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default memo(FormInstansi)