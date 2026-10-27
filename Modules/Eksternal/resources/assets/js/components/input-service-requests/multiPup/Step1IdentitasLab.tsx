import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { Building2, User, Phone, Mail, FileSignature, MapPin, Loader2 } from "lucide-react"
import { PupFormData } from "../../../types/pup"
import api from "../../../utils/api"
import useRegions from "../../../hooks/profile/useRegions"
import { FormField, TextInput, TextareaInput, SelectInput } from "../../forms"

interface Step1Props {
  formData: PupFormData
  onChange: (field: keyof PupFormData, value: any) => void
  onLoadingChange?: (loading: boolean) => void
}

export const Step1IdentitasLab: React.FC<Step1Props> = ({
  formData,
  onChange,
  onLoadingChange,
}) => {
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true)
  const [isSameContact, setIsSameContact] = useState<boolean>(false)
  const [selectedProvId, setSelectedProvId] = useState<string>("")
  const { provinces, regencies, loading: loadingRegions } = useRegions(selectedProvId)

  // Autofill data profil dari akun user yang sedang login jika form masih kosong
  useEffect(() => {
    let isMounted = true

    const fetchUserProfile = async () => {
      // Jika data profil sudah terisi lengkap (misal navigasi bolak-balik antar step), langsung tampilkan form
      if (formData.nama_pengisi && formData.email_pemohon && formData.nama_lab_kalibrasi) {
        setLoadingProfile(false)
        onLoadingChange?.(false)
        return
      }

      try {
        setLoadingProfile(true)
        onLoadingChange?.(true)

        const res = await api.get("/eksternal/user")
        if (!isMounted) return

        const userData = res?.data?.data || res?.data?.results || res?.data
        if (userData) {
          const detail = userData.detail || {}
          const compNama = detail.nama || userData.instansi_nama || userData.perusahaan_nama
          const compAlamat = detail.alamat || userData.instansi_alamat || userData.perusahaan_alamat

          if (!formData.nama_pengisi && userData.name) {
            onChange("nama_pengisi", userData.name)
          }
          if (!formData.email_pemohon && userData.email) {
            onChange("email_pemohon", userData.email)
          }
          if (!formData.nama_lab_kalibrasi && compNama) {
            onChange("nama_lab_kalibrasi", compNama)
          }
          if (!formData.alamat_lab_kalibrasi && compAlamat) {
            onChange("alamat_lab_kalibrasi", compAlamat)
          }
          if (!formData.no_wa_narahubung && (detail.pj_whatsapp || userData.phone)) {
            onChange("no_wa_narahubung", detail.pj_whatsapp || userData.phone)
          }
          if (!formData.nama_narahubung && detail.pj_nama) {
            onChange("nama_narahubung", detail.pj_nama)
          }
          if (!formData.email_official_lab && (detail.pj_surel || userData.email)) {
            onChange("email_official_lab", detail.pj_surel || userData.email)
          }

          // Inisialisasi provinsi dari profil jika ada
          if (detail.prov_id && !selectedProvId) {
            setSelectedProvId(String(detail.prov_id))
          }
        }
      } catch (err) {
        // Abaikan error autofill jika tidak login/offline
      } finally {
        if (isMounted) {
          setLoadingProfile(false)
          onLoadingChange?.(false)
        }
      }
    }

    fetchUserProfile()

    return () => {
      isMounted = false
    }
  }, [])

  // Deteksi kecocokan awal nama narahubung dengan pengisi
  useEffect(() => {
    if (
      formData.nama_pengisi &&
      formData.nama_narahubung &&
      formData.nama_pengisi.trim() === formData.nama_narahubung.trim()
    ) {
      setIsSameContact(true)
    }
  }, [formData.nama_pengisi, formData.nama_narahubung])

  // Coba sinkronkan selectedProvId jika formData.provinsi_lab ada dan provinces sudah ter-load
  useEffect(() => {
    if (!selectedProvId && formData.provinsi_lab && provinces.length > 0) {
      const matchProv = provinces.find(
        (p) => p.nama.toLowerCase() === formData.provinsi_lab?.toLowerCase()
      )
      if (matchProv) {
        setSelectedProvId(String(matchProv.id))
      }
    }
  }, [provinces, formData.provinsi_lab, selectedProvId])

  // Handler sinkronisasi checkbox contact person
  const handleToggleSameContact = (checked: boolean) => {
    setIsSameContact(checked)
    if (checked) {
      onChange("nama_narahubung", formData.nama_pengisi)
    }
  }

  const handleNamaPengisiChange = (val: string) => {
    onChange("nama_pengisi", val)
    if (isSameContact) {
      onChange("nama_narahubung", val)
    }
  }

  const handleNamaNarahubungChange = (val: string) => {
    onChange("nama_narahubung", val)
    if (val.trim() !== formData.nama_pengisi.trim()) {
      setIsSameContact(false)
    }
  }

  // Tampilan Loading State (Skeleton Loader)
  if (loadingProfile) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Banner info loading */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50/80 via-sky-50/60 to-white border border-brand-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-600 text-white shadow-xs">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Menyiapkan Formulir & Sinkronisasi Profil Akun...
              </h4>
              <p className="text-[11px] text-slate-500">
                Mohon tunggu sejenak, kami sedang menyelaraskan data instansi/perusahaan dan kontak resmi Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Skeleton Card 1: Informasi Pengisi */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-5 h-5 bg-slate-200 rounded-md"></div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              <div className="h-9 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              <div className="h-9 bg-slate-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const provOptions = provinces.map((p) => ({
    value: String(p.id),
    label: p.nama,
  }))

  const currentReg = regencies.find((r) => r.nama === formData.kota_kabupaten_lab)
  const selectedRegId = currentReg ? String(currentReg.id) : ""

  const regOptions = regencies.map((k) => ({
    value: String(k.id),
    label: k.nama,
  }))

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Kartu 1: Identitas Pengisi & Narahubung */}
      <Card className="border-brand-100/80 shadow-xs overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-brand-50/50 via-sky-50/30 to-white pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
            <User className="w-4 h-4 text-brand-600" />
            1. Informasi Pengisi & Narahubung Teknis
          </CardTitle>
          <CardDescription>
            Kontak penanggung jawab teknis untuk koordinasi pendaftaran, jadwal sirkulasi artefak, dan laporan hasil
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nama Pengisi Formulir" required>
              <TextInput
                placeholder="Masukkan nama lengkap pengisi"
                value={formData.nama_pengisi}
                onChange={(e) => handleNamaPengisiChange(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
              />
            </FormField>

            <FormField label="Email Pemohon" required>
              <TextInput
                type="email"
                placeholder="contoh@domain.com"
                value={formData.email_pemohon}
                onChange={(e) => onChange("email_pemohon", e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              />
            </FormField>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Nama Narahubung / Contact Person <span className="text-rose-500">*</span>
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs text-brand-700 hover:text-brand-800 cursor-pointer font-medium select-none">
                  <input
                    type="checkbox"
                    checked={isSameContact}
                    onChange={(e) => handleToggleSameContact(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>Sama dengan pengisi</span>
                </label>
              </div>
              <TextInput
                placeholder="Nama narahubung operasional"
                value={formData.nama_narahubung}
                onChange={(e) => handleNamaNarahubungChange(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <FormField label="Nomor WhatsApp Narahubung" required>
              <TextInput
                placeholder="Contoh: 08123456789"
                value={formData.no_wa_narahubung}
                onChange={(e) => onChange("no_wa_narahubung", e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Kartu 2: Data Laboratorium Kalibrasi */}
      <Card className="border-slate-200 shadow-xs overflow-hidden">
        <CardHeader className="bg-slate-50/70 pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
            <Building2 className="w-4 h-4 text-emerald-600" />
            2. Data Laboratorium Kalibrasi Peserta
          </CardTitle>
          <CardDescription>
            Identitas resmi laboratorium yang akan menerima dan mengkalibrasi artefak uji profisiensi
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nama Laboratorium Kalibrasi" required>
              <TextInput
                placeholder="Contoh: Laboratorium Kalibrasi PT ..."
                value={formData.nama_lab_kalibrasi}
                onChange={(e) => onChange("nama_lab_kalibrasi", e.target.value)}
              />
            </FormField>

            <FormField label="Email Official Laboratorium Kalibrasi" required>
              <TextInput
                type="email"
                placeholder="kalibrasi@perusahaan.co.id"
                value={formData.email_official_lab}
                onChange={(e) => onChange("email_official_lab", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Alamat Lengkap Laboratorium Kalibrasi" required>
            <TextareaInput
              rows={2}
              placeholder="Jalan, Kawasan Industri, Gedung, dsb."
              value={formData.alamat_lab_kalibrasi}
              onChange={(e) => onChange("alamat_lab_kalibrasi", e.target.value)}
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Provinsi Lokasi Laboratorium"
              required
              helperText={loadingRegions ? "Sedang memuat wilayah..." : undefined}
            >
              <SelectInput
                value={selectedProvId}
                onChange={(val) => {
                  const pId = String(val)
                  setSelectedProvId(pId)
                  const foundP = provinces.find((p) => String(p.id) === pId)
                  onChange("provinsi_lab", foundP ? foundP.nama : "")
                  onChange("kota_kabupaten_lab", "")
                }}
                options={provOptions}
                placeholder="-- Pilih Provinsi --"
              />
            </FormField>

            <FormField
              label="Kabupaten / Kota Lokasi Laboratorium"
              required
              helperText={
                !selectedProvId
                  ? "Pilih provinsi terlebih dahulu"
                  : loadingRegions
                  ? "Sedang memuat kabupaten..."
                  : undefined
              }
            >
              <SelectInput
                disabled={!selectedProvId}
                value={selectedRegId}
                onChange={(val) => {
                  const kId = String(val)
                  const foundK = regencies.find((r) => String(r.id) === kId)
                  onChange("kota_kabupaten_lab", foundK ? foundK.nama : "")
                }}
                options={regOptions}
                placeholder={
                  !selectedProvId
                    ? "-- Pilih Provinsi Terlebih Dahulu --"
                    : "-- Pilih Kabupaten / Kota --"
                }
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Kartu 3: Personil Pengesah Formulir */}
      <Card className="border-slate-200 shadow-xs overflow-hidden">
        <CardHeader className="bg-slate-50/70 pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
            <FileSignature className="w-4 h-4 text-indigo-600" />
            3. Personil Pengesah Pendaftaran
          </CardTitle>
          <CardDescription>
            Pejabat/personil yang berwenang menandatangani dan mengesahkan permohonan keikutsertaan Uji Profisiensi
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nama Personil Penandatangan / Pengesah" required>
              <TextInput
                placeholder="Nama lengkap beserta gelar jika ada"
                value={formData.nama_personil_pengesah}
                onChange={(e) => onChange("nama_personil_pengesah", e.target.value)}
              />
            </FormField>

            <FormField label="Jabatan Personil Pengesah" required>
              <TextInput
                placeholder="Contoh: Manajer Teknis / Kepala Laboratorium"
                value={formData.jabatan_personil_pengesah}
                onChange={(e) => onChange("jabatan_personil_pengesah", e.target.value)}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Step1IdentitasLab
