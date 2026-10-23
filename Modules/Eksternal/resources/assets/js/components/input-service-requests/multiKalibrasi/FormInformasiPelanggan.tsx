import React, { useState, useEffect } from "react"
import { UserCheck } from "lucide-react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"

export interface PelangganData {
  namaPemohon: string
  no_telp?: string
  hasilKalibrasiUntuk: string
  alamatPemohon: string
  namaKirim?: string
  alamatKirim?: string
  opsiAlamatKirim?: "pemohon" | "pabrik" | "manual"
}

export interface FormInformasiPelangganProps {
  dataPelanggan?: PelangganData
  onChangePelanggan?: (data: PelangganData) => void
}

export const FormInformasiPelanggan: React.FC<FormInformasiPelangganProps> = ({
  dataPelanggan,
  onChangePelanggan,
}) => {
  const { profile, isLoading } = useProfileQuery()

  const detail = (profile?.detail || {}) as Record<string, any>
  const alamatPabrik = detail?.alamat_pabrik || detail?.pabrik_alamat || ""
  const profileAlamat =
    profile?.alamat_lengkap || profile?.alamat || detail?.alamat || detail?.alamat_lengkap || ""
  const profileName =
    profile?.name || profile?.nama || profile?.nama_lengkap || detail?.nama_lengkap || ""

  const [formData, setFormData] = useState<PelangganData>(() => ({
    namaPemohon: dataPelanggan?.namaPemohon || "",
    no_telp: dataPelanggan?.no_telp || "",
    hasilKalibrasiUntuk: dataPelanggan?.hasilKalibrasiUntuk || "",
    alamatPemohon: dataPelanggan?.alamatPemohon || "",
    namaKirim: dataPelanggan?.namaKirim || dataPelanggan?.namaPemohon || "",
    alamatKirim: dataPelanggan?.alamatKirim || dataPelanggan?.alamatPemohon || "",
    opsiAlamatKirim: dataPelanggan?.opsiAlamatKirim || "pemohon",
  }))

  const handleChange = (field: keyof PelangganData, value: string) => {
    const updated = { ...formData, [field]: value }

    if (field === "alamatPemohon" && (formData.opsiAlamatKirim || "pemohon") === "pemohon") {
      updated.alamatKirim = value
    }

    if (
      field === "namaPemohon" &&
      (!formData.namaKirim || formData.namaKirim === formData.namaPemohon)
    ) {
      updated.namaKirim = value
    }

    setFormData(updated)
    if (onChangePelanggan) onChangePelanggan(updated)
  }

  const handleSelectOpsiAlamat = (opsi: "pemohon" | "pabrik" | "manual") => {
    let targetAlamat = formData.alamatKirim || ""

    if (opsi === "pemohon") {
      targetAlamat = formData.alamatPemohon || profileAlamat || ""
    } else if (opsi === "pabrik") {
      targetAlamat = alamatPabrik || ""
    }

    const updated: PelangganData = {
      ...formData,
      opsiAlamatKirim: opsi,
      alamatKirim: targetAlamat,
      namaKirim: formData.namaKirim || formData.namaPemohon || profileName || "",
    }

    setFormData(updated)
    if (onChangePelanggan) onChangePelanggan(updated)
  }

  useEffect(() => {
    if (dataPelanggan) {
      setFormData({
        namaPemohon: dataPelanggan.namaPemohon || "",
        no_telp: dataPelanggan.no_telp || "",
        hasilKalibrasiUntuk: dataPelanggan.hasilKalibrasiUntuk || "",
        alamatPemohon: dataPelanggan.alamatPemohon || "",
        namaKirim: dataPelanggan.namaKirim || dataPelanggan.namaPemohon || "",
        alamatKirim: dataPelanggan.alamatKirim || dataPelanggan.alamatPemohon || "",
        opsiAlamatKirim: dataPelanggan.opsiAlamatKirim || "pemohon",
      })
    }
  }, [dataPelanggan])

  useEffect(() => {
    if (profile && !isLoading) {
      setFormData((prev) => {
        const defaultNama = prev.namaPemohon || profileName || ""
        const defaultAlamat = prev.alamatPemohon || profileAlamat || ""
        const defaultNamaKirim = prev.namaKirim || defaultNama || ""
        const defaultAlamatKirim = prev.alamatKirim || defaultAlamat || ""

        const next: PelangganData = {
          ...prev,
          namaPemohon: defaultNama,
          hasilKalibrasiUntuk:
            prev.hasilKalibrasiUntuk ||
            detail?.nama ||
            (profile as any)?.company_name ||
            defaultNama ||
            "",
          no_telp:
            prev.no_telp ||
            profile?.whatsapp ||
            detail?.whatsapp ||
            detail?.telepon ||
            detail?.pj_whatsapp ||
            "",
          alamatPemohon: defaultAlamat,
          namaKirim: defaultNamaKirim,
          alamatKirim: defaultAlamatKirim,
          opsiAlamatKirim: prev.opsiAlamatKirim || "pemohon",
        }
        if (onChangePelanggan) onChangePelanggan(next)
        return next
      })
    }
  }, [profile, isLoading])

  return (
    <Card className="rounded-xl border-slate-200 shadow-xs overflow-hidden">
      <CardHeader className="rounded-t-xl bg-white border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base text-slate-900">
              Informasi Pelanggan
            </CardTitle>
            <CardDescription>
              Data pemohon, identitas kepemilikan sertifikat, dan tujuan pengiriman laporan kalibrasi.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="namaPemohon" className="block text-xs font-medium text-slate-700 mb-1.5">
              Nama Pemohon / Kontak Person <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              name="namaPemohon"
              id="namaPemohon"
              value={formData.namaPemohon}
              onChange={(e) => handleChange("namaPemohon", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="hasil_kalibrasi" className="block text-xs font-medium text-slate-700 mb-1.5">
              Sertifikat Dibuat untuk <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: PT Industri Maju Bersama"
              name="hasil_kalibrasi"
              id="hasil_kalibrasi"
              value={formData.hasilKalibrasiUntuk}
              onChange={(e) => handleChange("hasilKalibrasiUntuk", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="no_telp" className="block text-xs font-medium text-slate-700 mb-1.5">
              No. Telepon <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: 08123456789"
              name="no_telp"
              id="no_telp"
              value={formData.no_telp || ""}
              onChange={(e) => handleChange("no_telp", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="alamatPemohon" className="block text-xs font-medium text-slate-700 mb-1.5">
              Alamat Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              id="alamatPemohon"
              name="alamatPemohon"
              placeholder="Alamat lengkap pemohon / instansi"
              value={formData.alamatPemohon}
              onChange={(e) => handleChange("alamatPemohon", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>
        </div>

        {/* Alamat Pengiriman Laporan Hasil Kalibrasi */}
        <div className="pt-5 border-t border-slate-200 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Alamat Pengiriman Laporan Hasil Kalibrasi <span className="text-rose-500">*</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tentukan penerima dan alamat tujuan pengiriman dokumen sertifikat atau laporan hasil kalibrasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <label
              className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                (formData.opsiAlamatKirim || "pemohon") === "pemohon"
                  ? "bg-slate-50 border-brand-600 text-slate-900"
                  : "border-slate-200 hover:bg-slate-50/60 text-slate-700"
              }`}
            >
              <input
                type="radio"
                name="opsiAlamatKirim"
                value="pemohon"
                checked={(formData.opsiAlamatKirim || "pemohon") === "pemohon"}
                onChange={() => handleSelectOpsiAlamat("pemohon")}
                className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <div className="text-xs min-w-0">
                <span className="font-semibold block text-slate-800">Sesuai Alamat Pemohon</span>
                <span className="text-[11px] text-slate-500 truncate block">
                  {formData.alamatPemohon || profileAlamat || "Gunakan alamat pemohon di atas"}
                </span>
              </div>
            </label>

            {alamatPabrik && (
              <label
                className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.opsiAlamatKirim === "pabrik"
                    ? "bg-slate-50 border-brand-600 text-slate-900"
                    : "border-slate-200 hover:bg-slate-50/60 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="opsiAlamatKirim"
                  value="pabrik"
                  checked={formData.opsiAlamatKirim === "pabrik"}
                  onChange={() => handleSelectOpsiAlamat("pabrik")}
                  className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div className="text-xs min-w-0">
                  <span className="font-semibold block text-slate-800">Sesuai Alamat Pabrik</span>
                  <span className="text-[11px] text-slate-500 truncate block">{alamatPabrik}</span>
                </div>
              </label>
            )}

            <label
              className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                formData.opsiAlamatKirim === "manual"
                  ? "bg-slate-50 border-brand-600 text-slate-900"
                  : "border-slate-200 hover:bg-slate-50/60 text-slate-700"
              }`}
            >
              <input
                type="radio"
                name="opsiAlamatKirim"
                value="manual"
                checked={formData.opsiAlamatKirim === "manual"}
                onChange={() => handleSelectOpsiAlamat("manual")}
                className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <div className="text-xs min-w-0">
                <span className="font-semibold block text-slate-800">Alamat Lainnya (Kustom)</span>
                <span className="text-[11px] text-slate-500 block">Ketik alamat pengiriman lain</span>
              </div>
            </label>
          </div>

          {(formData.opsiAlamatKirim || "pemohon") === "pemohon" && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 text-xs space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-slate-500 w-32 shrink-0">Nama Penerima:</span>
                <span className="font-semibold text-slate-800">
                  {formData.namaKirim || formData.namaPemohon || "-"}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-500 w-32 shrink-0">Alamat Pengiriman:</span>
                <span className="text-slate-700">
                  {formData.alamatPemohon || profileAlamat || "(Alamat pemohon belum diisi)"}
                </span>
              </div>
            </div>
          )}

          {formData.opsiAlamatKirim === "pabrik" && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-32 shrink-0">Nama Penerima:</span>
                  <span className="font-semibold text-slate-800">
                    {formData.namaKirim || formData.namaPemohon || "-"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-32 shrink-0">Alamat Pabrik:</span>
                  <span className="text-slate-700">{alamatPabrik}</span>
                </div>
              </div>
              <div className="pt-1">
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Nama Penerima Spesifik / Up. (Opsional)
                </label>
                <input
                  type="text"
                  placeholder={formData.namaPemohon || "Nama Lengkap Penerima"}
                  value={formData.namaKirim || ""}
                  onChange={(e) => handleChange("namaKirim", e.target.value)}
                  className="w-full sm:w-80 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-brand-600 transition-colors"
                />
              </div>
            </div>
          )}

          {formData.opsiAlamatKirim === "manual" && (
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="namaKirim" className="block text-xs font-medium text-slate-700 mb-1.5">
                    Nama Penerima <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap Penerima / Up. Bagian"
                    name="namaKirim"
                    id="namaKirim"
                    value={formData.namaKirim || ""}
                    onChange={(e) => handleChange("namaKirim", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-600 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="alamatKirim" className="block text-xs font-medium text-slate-700 mb-1.5">
                    Alamat Pengiriman <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    id="alamatKirim"
                    name="alamatKirim"
                    placeholder="Masukkan alamat lengkap tujuan pengiriman sertifikat / laporan..."
                    value={formData.alamatKirim || ""}
                    onChange={(e) => handleChange("alamatKirim", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-600 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export const FormPenanggungBiaya = FormInformasiPelanggan
export default FormInformasiPelanggan
