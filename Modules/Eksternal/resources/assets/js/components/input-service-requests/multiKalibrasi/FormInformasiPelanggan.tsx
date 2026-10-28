import React, { useState, useEffect } from "react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import { MapPinHouse } from "lucide-react"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  inputClass,
  textareaClass,
} from "./WizardUI"

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
  const profileAlamat = profile?.alamat_lengkap || profile?.alamat || detail?.alamat || detail?.alamat_lengkap || ""
  const profileName = profile?.name || profile?.nama || profile?.nama_lengkap || detail?.nama_lengkap || ""

  const [formData, setFormData] = useState<PelangganData>(() => ({
    namaPemohon: dataPelanggan?.namaPemohon || "",
    no_telp: dataPelanggan?.no_telp || "",
    hasilKalibrasiUntuk: dataPelanggan?.hasilKalibrasiUntuk || "",
    alamatPemohon: dataPelanggan?.alamatPemohon || "",
    namaKirim: dataPelanggan?.namaKirim || profileName || "",
    alamatKirim: dataPelanggan?.alamatKirim || profileAlamat || "",
    opsiAlamatKirim: "manual",
  }))

  const handleChange = (field: keyof PelangganData, value: string) => {
    const updated = { ...formData, [field]: value }
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
        namaKirim: dataPelanggan.namaKirim || profileName || "",
        alamatKirim: dataPelanggan.alamatKirim || profileAlamat || "",
        opsiAlamatKirim: "manual",
      })
    }
  }, [dataPelanggan])

  useEffect(() => {
    if (profile && !isLoading) {
      setFormData((prev) => {
        const defaultNama = prev.namaPemohon || profileName || ""
        const defaultAlamat = prev.alamatPemohon || profileAlamat || ""
        const defaultNamaKirim = prev.namaKirim || profileName || defaultNama || ""
        const defaultAlamatKirim = prev.alamatKirim || profileAlamat || defaultAlamat || ""

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
          opsiAlamatKirim: "manual",
        }
        if (onChangePelanggan) onChangePelanggan(next)
        return next
      })
    }
  }, [profile, isLoading])

  return (
    <StepPanel
      icon={MapPinHouse}
      title="Informasi Pelanggan & Pengalamatan Laporan"
      description="Data pemohon, identitas kepemilikan sertifikat, dan pengalamatan laporan hasil kalibrasi."
    >
      {/* 1. Data Pemohon */}
      <div>
        <SectionHeading
          title="Identitas Pemohon & Sertifikat"
          required
        />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="input-nama-pemohon" required>
                Nama Pemohon
              </FieldLabel>
              <input
                id="input-nama-pemohon"
                type="text"
                className={inputClass}
                placeholder="Contoh: Budi Santoso, S.T."
                value={formData.namaPemohon}
                onChange={(e) => handleChange("namaPemohon", e.target.value)}
              />
            </div>

            <div>
              <FieldLabel htmlFor="input-sertifikat-untuk" required>
                Sertifikat Dibuat Untuk
              </FieldLabel>
              <input
                id="input-sertifikat-untuk"
                type="text"
                className={inputClass}
                placeholder="Contoh: PT Industri Maju Bersama"
                value={formData.hasilKalibrasiUntuk}
                onChange={(e) => handleChange("hasilKalibrasiUntuk", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="input-no-telp" required>
                Nomor Telpon / Whatsapp Pemohon
                </FieldLabel>
                <input
                id="input-no-telp"
                type="tel"
                className={inputClass}
                placeholder="Contoh: 081234567890"
                value={formData.no_telp || ""}
                onChange={(e) => handleChange("no_telp", e.target.value)}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="input-alamat-pemohon" required>
              Alamat Lengkap Pemohon
            </FieldLabel>
            <textarea
              id="input-alamat-pemohon"
              rows={3}
              className={textareaClass}
              placeholder="Tuliskan nama jalan, nomor bangunan, dan kota..."
              value={formData.alamatPemohon}
              onChange={(e) => handleChange("alamatPemohon", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 2. Pengalamatan Laporan Kalibrasi */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Pengalamatan Laporan Kalibrasi"
          required
          description="Ke mana dokumen fisik laporan hasil uji akan dikirim."
        />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="input-nama-kirim" required>
                Nama
              </FieldLabel>
              <input
                id="input-nama-kirim"
                type="text"
                className={inputClass}
                placeholder="Masukkan nama..."
                value={formData.namaKirim || ""}
                onChange={(e) => handleChange("namaKirim", e.target.value)}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="input-alamat-kirim" required>
              Alamat
            </FieldLabel>
            <textarea
              id="input-alamat-kirim"
              rows={3}
              className={textareaClass}
              placeholder="Masukkan alamat lengkap..."
              value={formData.alamatKirim || ""}
              onChange={(e) => handleChange("alamatKirim", e.target.value)}
            />
          </div>
        </div>
      </div>
    </StepPanel>
  )
}

export default FormInformasiPelanggan
