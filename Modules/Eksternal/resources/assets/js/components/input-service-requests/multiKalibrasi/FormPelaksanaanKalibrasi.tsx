import React, { useState, useEffect } from "react"
import { Settings2 } from "lucide-react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"

export interface PelaksanaanKalibrasiData {
  ruangLingkupAkreditasi?: string
  lokasi: string
  uraian: string
  bahasa: string
  namaKirim: string
  alamatKirim: string
}

export interface FormPelaksanaanKalibrasiProps {
  dataPelaksanaan?: PelaksanaanKalibrasiData
  onChangePelaksanaan?: (data: PelaksanaanKalibrasiData) => void
  lokasiPelaksanaan?: string
  onChangeLokasi?: (lokasi: string) => void
  uraianKalibrasi?: string
  onChangeUraian?: (uraian: string) => void
}

export const FormPelaksanaanKalibrasi: React.FC<FormPelaksanaanKalibrasiProps> = ({
  dataPelaksanaan,
  onChangePelaksanaan,
  lokasiPelaksanaan: propLokasi,
  onChangeLokasi,
  uraianKalibrasi: propUraian,
  onChangeUraian,
}) => {
  const { profile, isLoading } = useProfileQuery()

  const [formData, setFormData] = useState<PelaksanaanKalibrasiData>(() => ({
    ruangLingkupAkreditasi: dataPelaksanaan?.ruangLingkupAkreditasi || "Masuk Ruang Lingkup",
    lokasi: dataPelaksanaan?.lokasi || propLokasi || "",
    uraian: dataPelaksanaan?.uraian || propUraian || "",
    bahasa: dataPelaksanaan?.bahasa || "indonesia",
    namaKirim: dataPelaksanaan?.namaKirim || "",
    alamatKirim: dataPelaksanaan?.alamatKirim || "",
  }))

  const handleChange = (field: keyof PelaksanaanKalibrasiData, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    if (onChangePelaksanaan) onChangePelaksanaan(updated)
    if (field === "lokasi" && onChangeLokasi) onChangeLokasi(value)
    if (field === "uraian" && onChangeUraian) onChangeUraian(value)
  }

  useEffect(() => {
    if (dataPelaksanaan) {
      setFormData({
        ruangLingkupAkreditasi: dataPelaksanaan.ruangLingkupAkreditasi || "Masuk Ruang Lingkup",
        lokasi: dataPelaksanaan.lokasi || propLokasi || "",
        uraian: dataPelaksanaan.uraian || propUraian || "",
        bahasa: dataPelaksanaan.bahasa || "indonesia",
        namaKirim: dataPelaksanaan.namaKirim || "",
        alamatKirim: dataPelaksanaan.alamatKirim || "",
      })
    }
  }, [dataPelaksanaan, propLokasi, propUraian])

  useEffect(() => {
    if (profile && !isLoading) {
      const detail = (profile?.detail || {}) as Record<string, any>
      setFormData((prev) => {
        const next = {
          ...prev,
          namaKirim:
            prev.namaKirim ||
            profile?.name ||
            profile?.nama_lengkap ||
            detail?.nama_lengkap ||
            profile?.nama_pj ||
            detail?.nama_pj ||
            "",
          alamatKirim:
            prev.alamatKirim ||
            profile?.alamat_lengkap ||
            profile?.alamat ||
            detail?.alamat ||
            detail?.alamat_lengkap ||
            "",
        }
        if (onChangePelaksanaan) onChangePelaksanaan(next)
        return next
      })
    }
  }, [profile, isLoading])

  return (
    <Card className="rounded-xl border-slate-200 shadow-xs overflow-hidden">
      <CardHeader className="rounded-t-xl bg-white border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
            <Settings2 className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base text-slate-900">
              Pelaksanaan Kalibrasi
            </CardTitle>
            <CardDescription>
              Silakan lengkapi lokasi pelaksanaan, bahasa laporan, dan catatan teknis kalibrasi.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Lokasi Pelaksanaan Kalibrasi */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2.5">
            Lokasi Pelaksanaan Kalibrasi <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                formData.lokasi === "LABKAL BBKKP"
                  ? "bg-slate-50 border-brand-600"
                  : "border-slate-200 hover:bg-slate-50/60"
              }`}
            >
              <input
                type="radio"
                name="lokasi_pelaksanaan"
                value="LABKAL BBKKP"
                checked={formData.lokasi === "LABKAL BBKKP"}
                onChange={(e) => handleChange("lokasi", e.target.value)}
                className="mt-0.5 w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Laboratorium Kalibrasi BBKKP
                </span>
                <span className="text-[11px] text-slate-500">
                  Alat diantar atau dikirimkan ke laboratorium BBSPJIKKP
                </span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                formData.lokasi === "Tempat Client"
                  ? "bg-slate-50 border-brand-600"
                  : "border-slate-200 hover:bg-slate-50/60"
              }`}
            >
              <input
                type="radio"
                name="lokasi_pelaksanaan"
                value="Tempat Client"
                checked={formData.lokasi === "Tempat Client"}
                onChange={(e) => handleChange("lokasi", e.target.value)}
                className="mt-0.5 w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  On-Site (Di Lokasi / Pabrik Klien)
                </span>
                <span className="text-[11px] text-slate-500">
                  Petugas teknis melakukan kalibrasi di fasilitas pelanggan
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Bahasa Laporan Hasil Kalibrasi */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Bahasa yang Digunakan pada Laporan <span className="text-rose-500">*</span>
          </label>
          <div className="max-w-sm">
            <select
              value={formData.bahasa}
              onChange={(e) => handleChange("bahasa", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-600 transition-colors"
            >
              <option value="indonesia">Bahasa Indonesia</option>
              <option value="inggris">Bahasa Inggris (English)</option>
            </select>
          </div>
        </div>

        {/* Uraian Kalibrasi Yang Dikehendaki */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Uraian Kalibrasi / Catatan Khusus yang Dikehendaki
          </label>
          <textarea
            rows={3}
            placeholder="Masukkan instruksi khusus, rentang ukur tertentu, atau titik uji yang diinginkan (opsional)..."
            value={formData.uraian}
            onChange={(e) => handleChange("uraian", e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default FormPelaksanaanKalibrasi
