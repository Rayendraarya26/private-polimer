import React, { useState, useEffect } from "react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import useProfile from "../../../hooks/useProfile"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { UserCheck, Info } from "lucide-react"

export interface PelaksanaanKalibrasiData {
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
    lokasi: dataPelaksanaan?.lokasi || propLokasi || "LABKAL BBKKP",
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
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <UserCheck className="w-4 h-4 text-brand-600" />
              Pelaksanaan & Laporan Hasil Kalibrasi
            </CardTitle>
            <CardDescription>
              Silahkan lengkapi informasi pelaksanaan kalibrasi
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-1 space-y-3">
        {/* Pemisah / Bagian Lokasi & Uraian */}
        <div className="pt-3 space-y-5">
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-brand-600" />
              Lokasi Pelaksanaan Kalibrasi <span className="text-rose-500">*</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.lokasi === "LABKAL BBKKP"
                    ? "bg-brand-50/70 border-brand-400 ring-2 ring-brand-500/20"
                    : "border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <input
                  type="radio"
                  name="lokasi_pelaksanaan"
                  value="LABKAL BBKKP"
                  checked={formData.lokasi === "LABKAL BBKKP"}
                  onChange={(e) => handleChange("lokasi", e.target.value)}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Laboratorium Kalibrasi BBKKP
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Alat diantar atau dikirimkan ke laboratorium BBSPJIKKP
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.lokasi === "Tempat Client"
                    ? "bg-brand-50/70 border-brand-400 ring-2 ring-brand-500/20"
                    : "border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <input
                  type="radio"
                  name="lokasi_pelaksanaan"
                  value="Tempat Client"
                  checked={formData.lokasi === "Tempat Client"}
                  onChange={(e) => handleChange("lokasi", e.target.value)}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    On-Site (Di Lokasi / Pabrik Klien)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Petugas teknis kalibrasi melakukan kalibrasi di fasilitas pelanggan
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Uraian Kalibrasi Yang Dikehendaki */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Uraian Kalibrasi / Catatan Khusus Yang Dikehendaki
            </label>
            <textarea
              rows={3}
              placeholder="Masukkan instruksi khusus, rentang ukur tertentu, atau titik uji yang diinginkan (opsional)..."
              value={formData.uraian}
              onChange={(e) => handleChange("uraian", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Bagian Laporan Hasil Kalibrasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Bahasa yang digunakan pada laporan <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.bahasa}
              onChange={(e) => handleChange("bahasa", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
            >
              <option value="indonesia">Indonesia</option>
              <option value="inggris">English</option>
            </select>
          </div>

          <p className="md:col-span-2 block text-sm font-bold text-slate-800 border-t border-slate-200 pt-3">
            Alamat Pengiriman Laporan Hasil Kalibrasi
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Nama Penerima <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nama Lengkap Penerima"
              name="namaKirim"
              id="namaKirim"
              value={formData.namaKirim}
              onChange={(e) => handleChange("namaKirim", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Alamat Pengiriman <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              id="alamatKirim"
              name="alamatKirim"
              placeholder="Alamat lengkap tujuan pengiriman sertifikat / laporan"
              value={formData.alamatKirim}
              onChange={(e) => handleChange("alamatKirim", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormPelaksanaanKalibrasi
