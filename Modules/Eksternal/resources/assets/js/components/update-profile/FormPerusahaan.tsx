import React, { memo, useMemo } from "react"
import useProfile from "../../hooks/useProfile"
import useEditProfilePerusahaan from "../../hooks/profile/useEditProfilePerusahaan"
import { PerusahaanBadanHukumType, PerusahaanJenisType } from "../../types/profile"
import {
  Building,
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
} from "lucide-react"
import useRequestOTP from "../../hooks/useRequestOTP"
import { getPlainE164PhoneNumber } from "../../utils/common"
import { YesNoOption } from "../../types/core"
import PhoneInputWithCountrySelect from "react-phone-number-input"
import "react-phone-number-input/style.css"
import useRegions from "../../hooks/profile/useRegions"
import { Button } from "../ui/Button"

const FormPerusahaan: React.FC = () => {
  const { profile } = useProfile()
  const { rhf, errors, submitting, onSubmit } = useEditProfilePerusahaan()
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
          {/* Section 1: Profil Perusahaan */}
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  1. Profil Badan Usaha / Perusahaan
                </h3>
                <p className="text-xs text-slate-500">
                  Data legalitas badan hukum, jenis usaha, dan kontak kantor
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Perusahaan / Pabrik <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: PT Sumber Polimer Indonesia..."
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                  errors?.nama?.message ? "border-rose-500" : "border-slate-300"
                }`}
                {...rhf.register("nama")}
              />
              {errors?.nama?.message && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.nama.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bentuk Badan Hukum <span className="text-rose-500">*</span>
                </label>
                <select
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.badan_hukum?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("badan_hukum")}
                >
                  <option value="" disabled>-- Pilih Badan Hukum --</option>
                  {Object.values(PerusahaanBadanHukumType).map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </select>
                {errors?.badan_hukum?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.badan_hukum.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kategori / Jenis Perusahaan <span className="text-rose-500">*</span>
                </label>
                <select
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.jenis?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("jenis")}
                >
                  <option value="" disabled>-- Pilih Jenis --</option>
                  {Object.values(PerusahaanJenisType).map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </select>
                {errors?.jenis?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.jenis.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Pemilik Perusahaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama pemilik / owner..."
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.pemilik?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("pemilik")}
                />
                {errors?.pemilik?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.pemilik.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Direktur / Pimpinan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama pimpinan utama..."
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.pimpinan?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("pimpinan")}
                />
                {errors?.pimpinan?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.pimpinan.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Telepon Kantor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 0217654321"
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.telepon?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("telepon")}
                />
                {errors?.telepon?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.telepon.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor Fax <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nomor Fax..."
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.fax?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("fax")}
                />
                {errors?.fax?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.fax.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Perusahaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="info@perusahaan.com"
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor WhatsApp Kantor Perusahaan <span className="text-rose-500">*</span>
              </label>
              <PhoneInputWithCountrySelect
                international
                defaultCountry="ID"
                placeholder="Contoh: +62 812-3456-7890"
                value={rhf.watch("whatsapp")}
                onChange={(v) => rhf.setValue("whatsapp", v)}
                className="w-full"
              />
              {errors?.whatsapp?.message && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.whatsapp.message}</p>
              )}
            </div>
          </div>

          {/* Section 2: Wilayah & Alamat */}
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  2. Lokasi Pabrik / Kantor Perusahaan
                </h3>
                <p className="text-xs text-slate-500">
                  Alamat domisili operasional dan pengiriman sampel
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
                Alamat Lengkap Perusahaan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                disabled={isAddressDisabled}
                placeholder={
                  isAddressDisabled
                    ? "Pilih provinsi, kabupaten, dan kecamatan terlebih dahulu..."
                    : "Kawasan Industri, Jl..."
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
                    Dropdown wilayah terkunci karena alamat telah terisi. Ingin memindahkan alamat pabrik ke wilayah lain?
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
                  3. Nomor Legalitas & Izin Usaha
                </h3>
                <p className="text-xs text-slate-500">
                  Data perpajakan, NIB OSS, Akta Pendirian, dan Izin Usaha Industri
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  NPWP Perusahaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="NPWP Perusahaan..."
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
                  placeholder="NIB OSS..."
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.nib?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("nib")}
                />
                {errors?.nib?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.nib.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor Akta Pendirian
                </label>
                <input
                  type="text"
                  placeholder="Nomor Akta Notaris..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  {...rhf.register("no_akta_pendirian")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Izin Usaha Industri (IUP/IUI)
                </label>
                <input
                  type="text"
                  placeholder="Nomor IUP..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  {...rhf.register("iup")}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Penanggung Jawab (PIC) */}
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  4. Kontak Penanggung Jawab (PIC Layanan)
                </h3>
                <p className="text-xs text-slate-500">
                  Staf perwakilan yang mengurus pengajuan pengujian / sertifikasi
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap PIC <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama PIC perusahaan..."
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.pj_nama?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("pj_nama")}
                />
                {errors?.pj_nama?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.pj_nama.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email PIC <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="pic@perusahaan.com"
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                    errors?.pj_surel?.message ? "border-rose-500" : "border-slate-300"
                  }`}
                  {...rhf.register("pj_surel")}
                />
                {errors?.pj_surel?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.pj_surel.message}</p>
                )}
              </div>
            </div>

            {/* WhatsApp PIC */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor WhatsApp PIC <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
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
                    size="sm"
                    disabled={requesting}
                    onClick={() => getWhatsappOTP(rhf.getValues("pj_whatsapp"))}
                    isLoading={requesting}
                    className="shrink-0 shadow-sm"
                  >
                    Kirim Kode OTP
                  </Button>
                )}
              </div>

              {errors?.pj_whatsapp?.message && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.pj_whatsapp.message}</p>
              )}

              {!isRequested && !isWhatsappChanged && profile?.detail?.pj_whatsapp_verified === YesNoOption.YES && (
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mt-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nomor WhatsApp PIC Terverifikasi</span>
                </div>
              )}
            </div>

            {isRequested && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <label className="block text-xs font-bold text-amber-900">
                  Kode Verifikasi OTP PIC
                </label>
                <input
                  type="text"
                  placeholder="Masukkan 6 digit kode OTP"
                  className="w-full rounded-lg border border-amber-300 bg-white px-3.5 py-2 text-xs text-slate-900"
                  {...rhf.register("pj_whatsapp_otp")}
                />
                {errors?.pj_whatsapp_otp?.message && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.pj_whatsapp_otp.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Dokumen Legalitas & Simpan (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Dokumen Legalitas Perusahaan
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

            {/* Dokumen Akta Pendirian */}
            <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Akta Pendirian</span>
                {profile?.detail?.dok_akta_pendirian && (
                  <a
                    href={profile.detail.dok_akta_pendirian}
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
                  rhf.setValue("dok_akta_pendirian", (e.target as HTMLInputElement).files?.[0] || null)
                }
                className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              />
            </div>

            {/* Dokumen IUP */}
            <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Izin Usaha (IUP/IUI)</span>
                {profile?.detail?.dok_iup && (
                  <a
                    href={profile.detail.dok_iup}
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
                  rhf.setValue("dok_iup", (e.target as HTMLInputElement).files?.[0] || null)
                }
                className="w-full text-xs text-slate-500 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              />
            </div>
          </div>

          {/* Action Button Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md"
              isLoading={submitting}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Simpan Profil Perusahaan
            </Button>
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Pastikan data perusahaan dan nomor PIC telah sesuai sebelum menyimpan.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default memo(FormPerusahaan)