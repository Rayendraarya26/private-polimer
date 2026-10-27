import React, { useState, useEffect } from "react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { UserCheck, Truck, Building2, MapPin, Phone, User, Home } from "lucide-react"
import {
  FormField,
  TextInput,
  TextareaInput,
  RadioCardGroup,
} from "../../forms"

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

    if (field === "alamatPemohon" && (formData.opsiAlamatKirim || "pemohon") === "pemohon") {
      updated.alamatKirim = value
    }

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
    <Card className="rounded-2xl border-slate-200/90 shadow-card bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-brand-50/70 via-sky-50/30 to-white pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-600 text-white shadow-2xs">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-900 tracking-tight">
              Informasi Pelanggan & Alamat Pengiriman
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Data pemohon, identitas kepemilikan sertifikat, dan tujuan pengiriman fisik laporan hasil kalibrasi
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-7 space-y-7">
        {/* Section 1: Data Pemohon */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Nama Pemohon / Kontak Person"
              required
              tooltip="Nama pejabat atau staf resmi yang mengajukan permohonan kalibrasi"
            >
              <TextInput
                placeholder="Contoh: Budi Santoso, S.T."
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                value={formData.namaPemohon}
                onChange={(e) => handleChange("namaPemohon", e.target.value)}
              />
            </FormField>

            <FormField
              label="Hasil Kalibrasi / Sertifikat Dibuat Untuk"
              required
              tooltip="Nama perusahaan, instansi, atau perorangan yang akan dicetak sebagai pemilik sah pada sertifikat kalibrasi"
              helperText="Pastikan ejaan nama PT / Pabrik sesuai dokumen legalitas"
            >
              <TextInput
                placeholder="Contoh: PT Industri Maju Bersama"
                leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
                value={formData.hasilKalibrasiUntuk}
                onChange={(e) => handleChange("hasilKalibrasiUntuk", e.target.value)}
              />
            </FormField>
          </div>

          <FormField
            label="Nomor Telepon / WhatsApp Pemohon"
            required
            tooltip="Nomor yang dapat dihubungi analis untuk konfirmasi teknis"
          >
            <TextInput
              type="tel"
              placeholder="Contoh: 081234567890"
              leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              value={formData.no_telp || ""}
              onChange={(e) => handleChange("no_telp", e.target.value)}
            />
          </FormField>

          <FormField
            label="Alamat Lengkap Pemohon / Kantor"
            required
            helperText="Alamat domisili resmi entitas pemilik alat"
          >
            <TextareaInput
              rows={3}
              placeholder="Tuliskan nama jalan, nomor bangunan, dan kota..."
              value={formData.alamatPemohon}
              onChange={(e) => handleChange("alamatPemohon", e.target.value)}
            />
          </FormField>
        </div>

        {/* Section 2: Tujuan Pengiriman Dokumen Fisik */}
        <div className="pt-6 border-t border-slate-200/80 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shadow-2xs">
              <Truck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Alamat Pengiriman Dokumen Fisik Sertifikat Kalibrasi <span className="text-rose-500">*</span>
              </h4>
              <p className="text-xs text-slate-500">
                Tentukan penerima dan alamat tujuan pengiriman kurir untuk hardcopy laporan hasil kalibrasi
              </p>
            </div>
          </div>

          <FormField label="Pilih Tujuan Pengiriman">
            <RadioCardGroup
              value={formData.opsiAlamatKirim || "pemohon"}
              onChange={(val) => handleSelectOpsiAlamat(val as any)}
              gridCols={2}
              options={[
                {
                  value: "pemohon",
                  title: "Sesuai Alamat Kantor",
                  description: "Dikirim ke alamat kantor pemohon yang tertera di atas",
                  icon: <Building2 className="w-4.5 h-4.5 text-brand-600" />,
                  badge: "Default",
                },
                {
                  value: "pabrik",
                  title: "Sesuai Alamat Pabrik",
                  description: "Dikirim ke lokasi fasilitas pabrik yang tersimpan di profil",
                  icon: <Home className="w-4.5 h-4.5 text-emerald-600" />,
                  badge: "Pabrik",
                },
                {
                  value: "manual",
                  title: "Alamat Berbeda (Kustom)",
                  description: "Tuliskan alamat penerima cabang atau lokasi lain",
                  icon: <MapPin className="w-4.5 h-4.5 text-amber-600" />,
                  badge: "Kustom",
                },
              ]}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            <FormField
              label="Nama Penerima Paket Dokumen"
              required
              helperText="Nama PIC atau divisi penerima surat (misal: Divisi QA/QC)"
            >
              <TextInput
                placeholder="Contoh: Budi Santoso (Divisi QA/QC)"
                value={formData.namaKirim || ""}
                onChange={(e) => handleChange("namaKirim", e.target.value)}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField
                label="Alamat Lengkap Pengiriman Dokumen"
                required
                helperText="Cantumkan kode pos dan instruksi kurir bila ada"
              >
                <TextareaInput
                  rows={3}
                  disabled={(formData.opsiAlamatKirim || "pemohon") === "pemohon"}
                  placeholder="Masukkan alamat tujuan pengiriman dokumen lengkap..."
                  value={formData.alamatKirim || ""}
                  onChange={(e) => handleChange("alamatKirim", e.target.value)}
                />
              </FormField>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormInformasiPelanggan
