import React, { useState, useEffect } from "react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import useProfile from "../../../hooks/useProfile"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { UserCheck } from "lucide-react"

export interface PelangganData {
  namaPemohon: string
  no_telp?: string
  hasilKalibrasiUntuk: string
  alamatPemohon: string
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

  const [formData, setFormData] = useState<PelangganData>(() => ({
    namaPemohon: dataPelanggan?.namaPemohon || "",
    no_telp: dataPelanggan?.no_telp || "",
    hasilKalibrasiUntuk: dataPelanggan?.hasilKalibrasiUntuk || "",
    alamatPemohon: dataPelanggan?.alamatPemohon || "",
  }))

  const handleChange = (field: keyof PelangganData, value: string) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    if (onChangePelanggan) onChangePelanggan(updated)
  }

  useEffect(() => {
    if (profile && !isLoading) {
      const detail = (profile?.detail || {}) as Record<string, any>
      setFormData((prev) => {
        const next = {
          ...prev,
          namaPemohon: prev.namaPemohon || profile?.name || profile?.nama || "",
          hasilKalibrasiUntuk:
            prev.hasilKalibrasiUntuk ||
            detail?.nama ||
            (profile as any)?.company_name ||
            profile?.nama ||
            profile?.name ||
            "",
          no_telp:
            prev.no_telp ||
            profile?.whatsapp ||
            detail?.whatsapp ||
            detail?.telepon ||
            detail?.pj_whatsapp ||
            "",
          alamatPemohon: prev.alamatPemohon || profile?.alamat || detail?.alamat || "",
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
              Data pemohon dan identitas kepemilikan sertifikat kalibrasi
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
              Alamat Lengkap<span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              id="alamatPemohon"
              name="alamatPemohon"
              placeholder="Alamat lengkap"
              value={formData.alamatPemohon}
              onChange={(e) => handleChange("alamatPemohon", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Checkbox Penanggung Biaya */}

      </CardContent>
    </Card>
  )
}

export const FormPenanggungBiaya = FormInformasiPelanggan
export default FormInformasiPelanggan
