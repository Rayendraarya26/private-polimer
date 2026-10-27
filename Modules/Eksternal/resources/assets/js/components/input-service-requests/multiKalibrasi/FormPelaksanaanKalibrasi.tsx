import React, { useState, useEffect } from "react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { UserCheck, ShieldCheck, Building2, Truck, Globe, FileText } from "lucide-react"
import {
  FormField,
  RadioCardGroup,
  TextareaInput,
} from "../../forms"

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
    <Card className="rounded-2xl border-slate-200/90 shadow-card bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-brand-50/70 via-sky-50/30 to-white pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-600 text-white shadow-2xs">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-900 tracking-tight">
              Metode & Lokasi Pelaksanaan Kalibrasi
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Tentukan tempat kalibrasi dilakukan serta bahasa yang dicantumkan pada sertifikat hasil kalibrasi
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-7 space-y-7">
        {/* Lokasi Pelaksanaan Kalibrasi */}
        <FormField
          label="Lokasi Pelaksanaan Kalibrasi"
          required
          tooltip="Pilih apakah instrumen Anda dikirim ke laboratorium BBKKP di Yogyakarta atau dikalibrasi on-site di pabrik Anda"
          helperText="Untuk layanan On-Site, tanggal pelaksanaan dan biaya akomodasi verifikator akan dikoordinasikan lebih lanjut"
        >
          <RadioCardGroup
            value={formData.lokasi}
            onChange={(val) => handleChange("lokasi", val)}
            gridCols={2}
            options={[
              {
                value: "LABKAL BBKKP",
                title: "Laboratorium Kalibrasi BBKKP",
                description: "Instrumen fisik diantar langsung atau dikirimkan melalui jasa ekspedisi ke laboratorium BBSPJIKKP di Yogyakarta.",
                icon: <Building2 className="w-5 h-5 text-brand-600" />,
                badge: "In-House Lab",
              },
              {
                value: "Tempat Client",
                title: "On-Site (Di Lokasi / Fasilitas Klien)",
                description: "Petugas analis teknis BBSPJIKKP hadir langsung melakukan pengujian kalibrasi di pabrik atau fasilitas industri Anda.",
                icon: <Truck className="w-5 h-5 text-emerald-600" />,
                badge: "On-Site Visit",
              },
            ]}
          />
        </FormField>

        {/* Bahasa Laporan Hasil Kalibrasi */}
        <FormField
          label="Bahasa Laporan / Sertifikat Kalibrasi"
          required
          tooltip="Bahasa resmi yang akan dicantumkan pada sertifikat kalibrasi hasil akhir"
        >
          <RadioCardGroup
            value={formData.bahasa}
            onChange={(val) => handleChange("bahasa", val)}
            gridCols={2}
            options={[
              {
                value: "indonesia",
                title: "Bahasa Indonesia",
                description: "Sertifikat kalibrasi resmi diterbitkan dalam format Bahasa Indonesia standar SNI/KAN.",
                icon: <FileText className="w-5 h-5 text-brand-600" />,
                badge: "Standar",
              },
              {
                value: "inggris",
                title: "English (International Report)",
                description: "Official calibration certificate issued in English for multinational audit or export purposes.",
                icon: <Globe className="w-5 h-5 text-indigo-600" />,
                badge: "Bilingual / Global",
              },
            ]}
          />
        </FormField>

        {/* Uraian Kalibrasi Yang Dikehendaki */}
        <FormField
          label="Uraian Kalibrasi / Catatan Khusus Yang Dikehendaki"
          helperText="Tuliskan jika terdapat rentang ukur tertentu, titik uji khusus, atau instruksi khusus pengerjaan"
        >
          <TextareaInput
            rows={3}
            showCount
            maxLength={500}
            placeholder="Contoh: Titik ukur timbangan difokuskan pada rentang 50g, 100g, dan 200g. Harap konfirmasi sebelum pengujian dimulai..."
            value={formData.uraian}
            onChange={(e) => handleChange("uraian", e.target.value)}
          />
        </FormField>
      </CardContent>
    </Card>
  )
}

export default FormPelaksanaanKalibrasi
