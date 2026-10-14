import React, { useState, useEffect } from "react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { UserCheck, Truck, CheckCircle2 } from "lucide-react"

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
  const profileAlamat = profile?.alamat_lengkap || profile?.alamat || detail?.alamat || detail?.alamat_lengkap || ""
  const profileName = profile?.name || profile?.nama || profile?.nama_lengkap || detail?.nama_lengkap || ""

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
    let updated = { ...formData, [field]: value }

    // Jika opsi alamat adalah 'pemohon' dan user mengedit alamatPemohon, sinkronkan alamatKirim
    if (field === "alamatPemohon" && (formData.opsiAlamatKirim || "pemohon") === "pemohon") {
      updated.alamatKirim = value
    }

    // Jika user mengedit namaPemohon dan namaKirim masih kosong/sama dengan namaPemohon lama, sinkronkan namaKirim
    if (field === "namaPemohon" && (!formData.namaKirim || formData.namaKirim === formData.namaPemohon)) {
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

  // Sinkronisasi dataPelanggan dari props parent (misalnya saat reset draft)
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
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <UserCheck className="w-4 h-4 text-brand-600" />
              Informasi Pelanggan
            </CardTitle>
            <CardDescription>
              Data pemohon, identitas kepemilikan sertifikat, dan tujuan pengiriman laporan kalibrasi
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-start-1">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Nama Pemohon / Kontak Person <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              name="namaPemohon"
              id="namaPemohon"
              value={formData.namaPemohon}
              onChange={(e) => handleChange("namaPemohon", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Sertifikat Dibuat untuk */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Hasil Kalibrasi / Sertifikat Dibuat untuk <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: PT Industri Maju Bersama"
              name="hasil_kalibrasi"
              id="hasil_kalibrasi"
              value={formData.hasilKalibrasiUntuk}
              onChange={(e) => handleChange("hasilKalibrasiUntuk", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              No. Telpon <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: 08123456789"
              name="no_telp"
              id="no_telp"
              value={formData.no_telp || ""}
              onChange={(e) => handleChange("no_telp", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Alamat Pemohon / Instansi */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Alamat Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              id="alamatPemohon"
              name="alamatPemohon"
              placeholder="Alamat lengkap pemohon / instansi"
              value={formData.alamatPemohon}
              onChange={(e) => handleChange("alamatPemohon", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* ================= ALAMAT PENGIRIMAN LAPORAN HASIL KALIBRASI ================= */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-600" />
              Alamat Pengiriman Laporan Hasil Kalibrasi <span className="text-rose-500">*</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tentukan penerima dan alamat tujuan pengiriman fisik dokumen sertifikat atau laporan hasil kalibrasi
            </p>
          </div>

          {/* Opsi Pilihan Alamat */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Pilihan Alamat Pengiriman:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {/* Opsi 1: Sesuai Alamat Pemohon */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  (formData.opsiAlamatKirim || "pemohon") === "pemohon"
                    ? "bg-brand-50/80 border-brand-400 ring-2 ring-brand-500/20 text-brand-900"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
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

              {/* Opsi 2: Sesuai Alamat Pabrik (Jika profil memiliki alamat pabrik) */}
              {alamatPabrik && (
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.opsiAlamatKirim === "pabrik"
                      ? "bg-brand-50/80 border-brand-400 ring-2 ring-brand-500/20 text-brand-900"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
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

              {/* Opsi 3: Alamat Lainnya / Manual */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.opsiAlamatKirim === "manual"
                    ? "bg-brand-50/80 border-brand-400 ring-2 ring-brand-500/20 text-brand-900"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
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
          </div>

          {/* Tampilan Kondisional Berdasarkan Opsi yang Dipilih */}
          {(formData.opsiAlamatKirim || "pemohon") === "pemohon" && (
            <div className="rounded-xl border border-brand-200/90 bg-brand-50/40 p-4 space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-900">
                <span>Dokumen sertifikat / laporan akan dikirimkan ke alamat pemohon:</span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-brand-100/80 text-xs space-y-1.5 shadow-xs">
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-32 shrink-0">Nama Penerima:</span>
                  <span className="font-semibold text-slate-800">
                    {formData.namaKirim || formData.namaPemohon || "-"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-32 shrink-0">Alamat Pengiriman:</span>
                  <span className="text-slate-700 leading-relaxed">
                    {formData.alamatPemohon || profileAlamat || "(Alamat pemohon belum diisi pada form di atas)"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {formData.opsiAlamatKirim === "pabrik" && (
            <div className="rounded-xl border border-brand-200/90 bg-brand-50/40 p-4 space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dokumen sertifikat / laporan akan dikirimkan ke alamat pabrik:</span>
              </div>
              <div className="bg-white rounded-lg p-3 border border-brand-100/80 text-xs space-y-1.5 shadow-xs">
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-32 shrink-0">Nama Penerima:</span>
                  <span className="font-semibold text-slate-800">
                    {formData.namaKirim || formData.namaPemohon || "-"}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 w-32 shrink-0">Alamat Pabrik:</span>
                  <span className="text-slate-700 leading-relaxed">{alamatPabrik}</span>
                </div>
              </div>
              <div className="pt-1">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nama Penerima Spesifik / Up. <span className="text-slate-400 font-normal">(Opsional, default: nama pemohon)</span>
                </label>
                <input
                  type="text"
                  placeholder={formData.namaPemohon || "Nama Lengkap Penerima"}
                  value={formData.namaKirim || ""}
                  onChange={(e) => handleChange("namaKirim", e.target.value)}
                  className="w-full sm:w-80 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>
          )}

          {formData.opsiAlamatKirim === "manual" && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4 animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Nama Penerima <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap Penerima / Up. Bagian"
                    name="namaKirim"
                    id="namaKirim"
                    value={formData.namaKirim || ""}
                    onChange={(e) => handleChange("namaKirim", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Alamat Pengiriman <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    id="alamatKirim"
                    name="alamatKirim"
                    placeholder="Masukkan alamat lengkap tujuan pengiriman sertifikat / laporan hasil kalibrasi..."
                    value={formData.alamatKirim || ""}
                    onChange={(e) => handleChange("alamatKirim", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
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
