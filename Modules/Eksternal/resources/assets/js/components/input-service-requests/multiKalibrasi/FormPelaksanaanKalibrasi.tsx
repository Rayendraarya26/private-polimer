import React, { useState, useEffect } from "react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import { UserCheck, Building2, Truck, Languages, Globe } from "lucide-react"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  OptionGroup,
  OptionCard,
  OptionIcon,
  textareaClass,
  cx,
} from "./WizardUI"

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
    <StepPanel
      icon={UserCheck}
      title="Metode & Lokasi Pelaksanaan Kalibrasi"
      description="Tentukan tempat kalibrasi dilakukan serta bahasa yang dicantumkan pada sertifikat hasil kalibrasi."
    >
      {/* 1. Lokasi Pelaksanaan Kalibrasi */}
      <div>
        <FieldLabel htmlFor={`lokasi`} required>
          Lokasi Pelaksanaan Kalibrasi
        </FieldLabel>

        <OptionGroup label="Lokasi Pelaksanaan" cols={2}>
          <OptionCard
            id="lokasi-labkal"
            compact
            selected={formData.lokasi === "LABKAL BBKKP"}
            onSelect={() => handleChange("lokasi", "LABKAL BBKKP")}
            title="Laboratorium Kalibrasi BBKKP"
            description="Instrumen diantar atau dikirim ke laboratorium BBKKP"
            leading={<OptionIcon icon={Building2} active={formData.lokasi === "LABKAL BBKKP"} />}
          />
          <OptionCard
            id="lokasi-onsite"
            compact
            selected={formData.lokasi === "Tempat Client"}
            onSelect={() => handleChange("lokasi", "Tempat Client")}
            title="On-site / Tempat Client"
            description="Petugas kalibrasi hadir langsung ke fasilitas Anda"
            leading={<OptionIcon icon={Truck} active={formData.lokasi === "Tempat Client"} />}
          />
        </OptionGroup>
      </div>

      {/* 2. Bahasa Laporan Hasil Kalibrasi */}
      <div className="pt-6 border-t border-slate-200">
        <FieldLabel htmlFor={`lokasi`} required>
          Bahasa Sertifikat
        </FieldLabel>

        <OptionGroup label="Bahasa Sertifikat" cols={2}>
          <OptionCard
            id="bahasa-id"
            compact
            selected={formData.bahasa === "indonesia"}
            onSelect={() => handleChange("bahasa", "indonesia")}
            title="Bahasa Indonesia"
            description="Format sertifikat resmi standar KAN / SNI"
            leading={<OptionIcon icon={Languages} active={formData.bahasa === "indonesia"} />}
          />
          <OptionCard
            id="bahasa-en"
            compact
            selected={formData.bahasa === "inggris"}
            onSelect={() => handleChange("bahasa", "inggris")}
            title="English"
            description="Official calibration certificate for export / audit"
            leading={<OptionIcon icon={Globe} active={formData.bahasa === "inggris"} />}
          />
        </OptionGroup>
      </div>

      {/* 3. Uraian Kalibrasi Yang Dikehendaki */}
      <div className="pt-6 border-t border-slate-200">
        <div>
          <FieldLabel htmlFor="input-uraian-kalibrasi" optional>
            Uraian Kalibrai / Catatan
          </FieldLabel>
          <textarea
            id="input-uraian-kalibrasi"
            rows={3}
            maxLength={500}
            className={textareaClass}
            placeholder="Contoh: Titik ukur timbangan difokuskan pada rentang 50g, 100g, dan 200g. Harap konfirmasi sebelum pengujian dimulai..."
            value={formData.uraian}
            onChange={(e) => handleChange("uraian", e.target.value)}
          />
          <FieldHint>Maksimal 500 karakter. Informasi ini akan menjadi catatan awal analis teknis laboratorium.</FieldHint>
        </div>
      </div>
    </StepPanel>
  )
}

export default FormPelaksanaanKalibrasi
