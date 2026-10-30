import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { SertifikasiFormData, SertifikasiPabrikItem, emptyPabrik } from "../../../types/sertifikasi"
import { Button } from "../../ui/Button"
import {
  Building2,
  MapPin,
  Users,
  Factory,
  Plus,
  Trash2,
  FileDown,
  Loader2,
  Copy,
} from "lucide-react"
import { DropzoneUploader } from "../../forms"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import useProfile from "../../../hooks/useProfile"
import {
  useProvincesQuery,
  useRegenciesQuery,
  useDistrictsQuery,
} from "../../../hooks/queries/useMasterQuery"
import api from "../../../utils/api"
import {
  StepPanel,
  FieldLabel,
  FieldHint,
  inputClass,
  selectClass,
  textareaClass,
  cx,
  WizardNav,
} from "../common/WizardUI"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  provinces?: any[]
  regencies?: any[]
  onNext: () => void
  onBack: () => void
}

const DAFTAR_NEGARA = [
  "Indonesia",
  "Malaysia",
  "Singapura",
  "Thailand",
  "Vietnam",
  "Filipina",
  "Jepang",
  "Korea Selatan",
  "Tiongkok",
  "Lainnya"
]

/**
 * Sub-komponen Kartu Pabrik dengan Cascading Master Wilayah & Logika Kondisional Negara
 */
interface PabrikCardItemProps {
  f: SertifikasiPabrikItem
  idx: number
  totalPabrik: number
  provinces: any[]
  loadingProvinces: boolean
  onUpdate: (index: number, field: keyof SertifikasiPabrikItem, value: any) => void
  onRemove: (index: number) => void
}

const PabrikCardItem: React.FC<PabrikCardItemProps> = ({
  f,
  idx,
  totalPabrik,
  provinces,
  loadingProvinces,
  onUpdate,
  onRemove,
}) => {
  const isDomestic = (f.negara || "Indonesia") === "Indonesia"

  const [selectedProvId, setSelectedProvId] = useState<string | number>(f.provinsi_id || "")
  const [selectedKabId, setSelectedKabId] = useState<string | number>(f.kabupaten_id || "")

  // Eager-matching ID jika user sudah memiliki nilai provinsi/kabupaten
  useEffect(() => {
    if (!selectedProvId && f.provinsi && provinces.length > 0) {
      const found = provinces.find(
        (p: any) =>
          p.nama?.toLowerCase() === f.provinsi?.toLowerCase() ||
          String(p.id) === String(f.provinsi_id || f.provinsi)
      )
      if (found) setSelectedProvId(found.id)
    }
  }, [provinces, f.provinsi, f.provinsi_id, selectedProvId])

  const { data: rawRegencies = [], isLoading: loadingRegencies } = useRegenciesQuery(selectedProvId)
  const regencies = Array.isArray(rawRegencies) ? rawRegencies : []

  useEffect(() => {
    if (!selectedKabId && f.kabupaten && regencies.length > 0) {
      const found = regencies.find(
        (k: any) =>
          k.nama?.toLowerCase() === f.kabupaten?.toLowerCase() ||
          String(k.id) === String(f.kabupaten_id || f.kabupaten)
      )
      if (found) setSelectedKabId(found.id)
    }
  }, [regencies, f.kabupaten, f.kabupaten_id, selectedKabId])

  const { data: rawDistricts = [], isLoading: loadingDistricts } = useDistrictsQuery(selectedKabId)
  const districts = Array.isArray(rawDistricts) ? rawDistricts : []

  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 transition-all hover:border-slate-300">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
            {idx + 1}
          </span>
          <span className="text-xs font-bold text-slate-900">
            {f.nama_pabrik || `Pabrik #${idx + 1}`}
          </span>
        </div>
        {totalPabrik > 1 && (
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus Pabrik
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nama Pabrik */}
        <div>
          <FieldLabel required>Nama Pabrik</FieldLabel>
          <input
            type="text"
            value={f.nama_pabrik}
            onChange={(e) => onUpdate(idx, "nama_pabrik", e.target.value)}
            placeholder="PT. Example"
            className={inputClass}
          />
        </div>

        {/* No Telp */}
        <div>
          <FieldLabel>No Telp</FieldLabel>
          <input
            type="text"
            value={f.kontak_pabrik || ""}
            onChange={(e) => onUpdate(idx, "kontak_pabrik", e.target.value)}
            placeholder="02212345678"
            className={inputClass}
          />
        </div>

        {/* No HP */}
        <div>
          <FieldLabel>No HP</FieldLabel>
          <input
            type="text"
            value={f.no_hp || ""}
            onChange={(e) => onUpdate(idx, "no_hp", e.target.value)}
            placeholder="-"
            className={inputClass}
          />
        </div>

        {/* Fax */}
        <div>
          <FieldLabel>Fax</FieldLabel>
          <input
            type="text"
            value={f.fax || ""}
            onChange={(e) => onUpdate(idx, "fax", e.target.value)}
            placeholder="-"
            className={inputClass}
          />
        </div>

        {/* Negara */}
        <div>
          <FieldLabel required>Negara</FieldLabel>
          <select
            value={f.negara || "Indonesia"}
            onChange={(e) => {
              const newCountry = e.target.value
              onUpdate(idx, "negara", newCountry)
              if (newCountry !== "Indonesia") {
                setSelectedProvId("")
                setSelectedKabId("")
                onUpdate(idx, "provinsi", "")
                onUpdate(idx, "provinsi_id", "")
                onUpdate(idx, "kabupaten", "")
                onUpdate(idx, "kabupaten_id", "")
                onUpdate(idx, "kecamatan", "")
                onUpdate(idx, "kecamatan_id", "")
              }
            }}
            className={selectClass}
          >
            {DAFTAR_NEGARA.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Kode Pos */}
        <div>
          <FieldLabel>Kode Pos</FieldLabel>
          <input
            type="text"
            value={f.kode_pos || ""}
            onChange={(e) => onUpdate(idx, "kode_pos", e.target.value)}
            placeholder="-"
            className={inputClass}
          />
        </div>

        {/* Cascading Region Master Dropdowns (Hanya ditampilkan jika Negara = Indonesia) */}
        {isDomestic && (
          <>
            {/* Provinsi Pabrik */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required className="mb-0">Provinsi</FieldLabel>
                {loadingProvinces && <Loader2 className="w-3 h-3 animate-spin text-brand-600" />}
              </div>
              <select
                value={selectedProvId || ""}
                onChange={(e) => {
                  const pId = e.target.value
                  const found = provinces.find((p: any) => String(p.id) === String(pId))
                  setSelectedProvId(pId)
                  setSelectedKabId("")
                  onUpdate(idx, "provinsi_id", pId)
                  onUpdate(idx, "provinsi", found?.nama || "")
                  onUpdate(idx, "kabupaten_id", "")
                  onUpdate(idx, "kabupaten", "")
                  onUpdate(idx, "kecamatan_id", "")
                  onUpdate(idx, "kecamatan", "")
                }}
                className={selectClass}
              >
                <option value="">-- Pilih Provinsi --</option>
                {provinces.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Kabupaten / Kota Pabrik */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required className="mb-0">Kabupaten / Kota</FieldLabel>
                {loadingRegencies && <Loader2 className="w-3 h-3 animate-spin text-brand-600" />}
              </div>
              <select
                disabled={!selectedProvId}
                value={selectedKabId || ""}
                onChange={(e) => {
                  const kId = e.target.value
                  const found = regencies.find((k: any) => String(k.id) === String(kId))
                  setSelectedKabId(kId)
                  onUpdate(idx, "kabupaten_id", kId)
                  onUpdate(idx, "kabupaten", found?.nama || "")
                  onUpdate(idx, "kecamatan_id", "")
                  onUpdate(idx, "kecamatan", "")
                }}
                className={cx(selectClass, !selectedProvId && "bg-slate-100 cursor-not-allowed")}
              >
                <option value="">
                  {selectedProvId ? "-- Pilih Kabupaten/Kota --" : "-- Pilih Provinsi Dahulu --"}
                </option>
                {regencies.map((k: any) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Kecamatan Pabrik */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel required className="mb-0">Kecamatan</FieldLabel>
                {loadingDistricts && <Loader2 className="w-3 h-3 animate-spin text-brand-600" />}
              </div>
              <select
                disabled={!selectedKabId}
                value={f.kecamatan_id || ""}
                onChange={(e) => {
                  const kecId = e.target.value
                  const found = districts.find((d: any) => String(d.id) === String(kecId))
                  onUpdate(idx, "kecamatan_id", kecId)
                  onUpdate(idx, "kecamatan", found?.nama || "")
                }}
                className={cx(selectClass, !selectedKabId && "bg-slate-100 cursor-not-allowed")}
              >
                <option value="">
                  {selectedKabId ? "-- Pilih Kecamatan --" : "-- Pilih Kab/Kota Dahulu --"}
                </option>
                {districts.map((d: any) => (
                  <option key={d.id} value={d.id}>
                    {d.nama}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Alamat Pabrik */}
        <div className="md:col-span-2">
          <FieldLabel required>Alamat Pabrik</FieldLabel>
          <textarea
            rows={2}
            value={f.alamat_pabrik}
            onChange={(e) => onUpdate(idx, "alamat_pabrik", e.target.value)}
            placeholder="Jl. Contoh No. 1, Jakarta"
            className={textareaClass}
          />
        </div>

        {/* Jumlah Karyawan */}
        <div>
          <FieldLabel>Jumlah Karyawan</FieldLabel>
          <input
            type="number"
            min={0}
            value={f.jumlah_karyawan === undefined || f.jumlah_karyawan === null ? "" : f.jumlah_karyawan}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const raw = e.target.value
              onUpdate(idx, "jumlah_karyawan", raw === "" ? "" : parseInt(raw, 10) || 0)
            }}
            placeholder="0"
            className={inputClass}
          />
        </div>

        {/* Kegiatan Utama */}
        <div>
          <FieldLabel>Kegiatan Utama</FieldLabel>
          <input
            type="text"
            value={f.kegiatan_utama || ""}
            onChange={(e) => onUpdate(idx, "kegiatan_utama", e.target.value)}
            placeholder="-"
            className={inputClass}
          />
        </div>

        {/* Luas Tanah */}
        <div>
          <FieldLabel>Luas Tanah</FieldLabel>
          <input
            type="text"
            value={f.luas_tanah || ""}
            onChange={(e) => onUpdate(idx, "luas_tanah", e.target.value)}
            placeholder="-"
            className={inputClass}
          />
        </div>

        {/* Luas Bangunan */}
        <div>
          <FieldLabel>Luas Bangunan</FieldLabel>
          <input
            type="text"
            value={f.luas_bangunan || ""}
            onChange={(e) => onUpdate(idx, "luas_bangunan", e.target.value)}
            placeholder="-"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}

export const Step3PerusahaanDanPabrik: React.FC<Props> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const { profile: queryProfile } = useProfileQuery()
  const { profile: reduxProfile } = useProfile()
  const profileData = queryProfile || reduxProfile
  const detail = (profileData?.detail || profileData?.pelanggan?.detail || profileData?.results?.detail || profileData) as Record<string, any> | undefined

  // Master Wilayah Hooks
  const { data: rawProvinces = [], isLoading: loadingProvinces } = useProvincesQuery()
  const provinces = Array.isArray(rawProvinces) ? rawProvinces : []

  const isCompanyDomestic = (formData.negara || "Indonesia") === "Indonesia"

  const [selectedCompanyProvId, setSelectedCompanyProvId] = useState<string | number>("")
  const [selectedCompanyKabId, setSelectedCompanyKabId] = useState<string | number>("")

  // Eager-matching ID jika formData sudah memiliki nama / id provinsi
  useEffect(() => {
    if (!selectedCompanyProvId && formData.provinsi && provinces.length > 0) {
      const found = provinces.find(
        (p: any) =>
          p.nama?.toLowerCase() === formData.provinsi?.toLowerCase() ||
          String(p.id) === String(formData.provinsi)
      )
      if (found) setSelectedCompanyProvId(found.id)
    }
  }, [provinces, formData.provinsi, selectedCompanyProvId])

  const { data: rawCompanyRegencies = [], isLoading: loadingCompanyRegencies } = useRegenciesQuery(selectedCompanyProvId)
  const companyRegencies = Array.isArray(rawCompanyRegencies) ? rawCompanyRegencies : []

  useEffect(() => {
    if (!selectedCompanyKabId && formData.kabupaten && companyRegencies.length > 0) {
      const found = companyRegencies.find(
        (k: any) =>
          k.nama?.toLowerCase() === formData.kabupaten?.toLowerCase() ||
          String(k.id) === String(formData.kabupaten)
      )
      if (found) setSelectedCompanyKabId(found.id)
    }
  }, [companyRegencies, formData.kabupaten, selectedCompanyKabId])

  const { data: rawCompanyDistricts = [], isLoading: loadingCompanyDistricts } = useDistrictsQuery(selectedCompanyKabId)
  const companyDistricts = Array.isArray(rawCompanyDistricts) ? rawCompanyDistricts : []

  const [jenisPerusahaanList, setJenisPerusahaanList] = useState<any[]>([])
  useEffect(() => {
    api.get('/eksternal/master/jenis-perusahaan')
      .then(res => setJenisPerusahaanList(res?.data?.data || []))
      .catch(() => { })
  }, [])

  // Prefill otomatis dari profil perusahaan
  useEffect(() => {
    if (!detail) return
    setFormData((prev) => ({
      ...prev,
      nama_perusahaan: prev.nama_perusahaan || detail.nama || profileData?.nama || profileData?.name || "",
      nomor_akta_pendirian: prev.nomor_akta_pendirian || detail.no_akta_pendirian || detail.nib || "",
      nama_pemilik: prev.nama_pemilik || detail.pemilik || "",
      nama_pimpinan: prev.nama_pimpinan || detail.pimpinan || "",
      nama_wakil_manajemen: prev.nama_wakil_manajemen || detail.pj_nama || "",
      no_telp: prev.no_telp || detail.telepon || "",
      no_whatsapp: prev.no_whatsapp || detail.whatsapp || detail.pj_whatsapp || "",
      fax: prev.fax || detail.fax || "",
      email: prev.email || detail.surel || profileData?.surel || profileData?.email || "",
      badan_hukum: prev.badan_hukum || (detail.bentuk_badan_usaha || "PT"),
      jenis_perusahaan_id: prev.jenis_perusahaan_id || detail.jenis_perusahaan_id || 1,
      jenis_perusahaan: prev.jenis_perusahaan || detail.jenis_perusahaan || detail.jenis || "Produsen / Pabrikan",
      negara: prev.negara || "Indonesia",
      alamat_kantor: prev.alamat_kantor || detail.alamat || "",
    }))
  }, [detail, profileData, setFormData])

  // Hitung total karyawan otomatis
  useEffect(() => {
    const m = Number(formData.jumlah_manajemen || 0)
    const a = Number(formData.jumlah_administrasi || 0)
    const pt = Number(formData.jumlah_part_time || 0)
    const s1 = Number(formData.jumlah_shift_1 || 0)
    const s2 = Number(formData.jumlah_shift_2 || 0)
    const s3 = Number(formData.jumlah_shift_3 || 0)
    const non = Number(formData.jumlah_non_permanen || 0)
    const totalOp = s1 + s2 + s3
    const total = m + a + pt + totalOp + non

    setFormData((prev) => {
      if (prev.jumlah_operasional === totalOp && prev.jumlah_karyawan_total === total) return prev
      return {
        ...prev,
        jumlah_operasional: totalOp,
        jumlah_karyawan_total: total,
      }
    })
  }, [
    formData.jumlah_manajemen,
    formData.jumlah_administrasi,
    formData.jumlah_part_time,
    formData.jumlah_shift_1,
    formData.jumlah_shift_2,
    formData.jumlah_shift_3,
    formData.jumlah_non_permanen,
    setFormData,
  ])

  // Helper untuk input angka agar ketika diketik angka 0 tidak mengganjal
  const handleNumericChange = (field: keyof SertifikasiFormData, rawValue: string) => {
    if (rawValue === "") {
      setFormData((prev) => ({ ...prev, [field]: "" as any }))
      return
    }
    const parsed = parseInt(rawValue, 10)
    setFormData((prev) => ({ ...prev, [field]: isNaN(parsed) ? "" : parsed }))
  }

  // Handler Pabrik
  const addPabrik = () => {
    setFormData((prev) => ({
      ...prev,
      pabrik: [...prev.pabrik, emptyPabrik(Date.now())],
    }))
  }

  const duplicateLastPabrik = () => {
    if (formData.pabrik.length === 0) return
    const lastPabrik = formData.pabrik[formData.pabrik.length - 1]
    const duplicated: SertifikasiPabrikItem = {
      ...lastPabrik,
      id: Date.now(),
      nama_pabrik: `${lastPabrik.nama_pabrik || "Pabrik"} (Salinan)`,
    }
    setFormData((prev) => ({
      ...prev,
      pabrik: [...prev.pabrik, duplicated],
    }))
    toast.success("Data pabrik berhasil diduplikasi.")
  }

  const removePabrik = (index: number) => {
    if (formData.pabrik.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      pabrik: prev.pabrik.filter((_, i) => i !== index),
    }))
  }

  const updatePabrik = (index: number, field: keyof SertifikasiPabrikItem, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.pabrik]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, pabrik: updated }
    })
  }

  return (
    <div className="space-y-6">
      <StepPanel
        icon={Building2}
        title="Kondisi Perusahaan"
        description="Legalitas PT & fasilitas pabrik"
      >
        <div className="space-y-6">
          {/* 1. Data Perusahaan */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-none overflow-hidden">
            <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Data Perusahaan</h3>
                <p className="text-[11px] text-slate-500">
                  Identitas resmi badan usaha dan penanggung jawab manajemen.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Perusahaan */}
                <div>
                  <FieldLabel required>Nama Perusahaan</FieldLabel>
                  <input
                    type="text"
                    value={formData.nama_perusahaan || ""}
                    onChange={(e) => setFormData({ ...formData, nama_perusahaan: e.target.value })}
                    placeholder="PT. Example"
                    className={inputClass}
                  />
                </div>

                {/* Nomor Akta Pendirian */}
                <div>
                  <FieldLabel required>Nomor Akta Pendirian</FieldLabel>
                  <input
                    type="text"
                    value={formData.nomor_akta_pendirian || ""}
                    onChange={(e) => setFormData({ ...formData, nomor_akta_pendirian: e.target.value })}
                    placeholder="AHU-001234.AH.01.01.Tahun 2020"
                    className={inputClass}
                  />
                </div>

                {/* Nama Pemilik */}
                <div>
                  <FieldLabel required>Nama Pemilik</FieldLabel>
                  <input
                    type="text"
                    value={formData.nama_pemilik || ""}
                    onChange={(e) => setFormData({ ...formData, nama_pemilik: e.target.value })}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>

                {/* Nama Pimpinan */}
                <div>
                  <FieldLabel required>Nama Pimpinan</FieldLabel>
                  <input
                    type="text"
                    value={formData.nama_pimpinan || ""}
                    onChange={(e) => setFormData({ ...formData, nama_pimpinan: e.target.value })}
                    placeholder="Jane Doe"
                    className={inputClass}
                  />
                </div>

                {/* Nama Wakil Manajemen */}
                <div>
                  <FieldLabel required>Nama Wakil Manajemen (MR)</FieldLabel>
                  <input
                    type="text"
                    value={formData.nama_wakil_manajemen || ""}
                    onChange={(e) => setFormData({ ...formData, nama_wakil_manajemen: e.target.value })}
                    placeholder="Alex Smith"
                    className={inputClass}
                  />
                </div>

                {/* Email Perusahaan */}
                <div>
                  <FieldLabel required>Email Perusahaan</FieldLabel>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@perusahaan.co.id"
                    className={inputClass}
                  />
                </div>

                {/* Nomor Telepon Kantor */}
                <div>
                  <FieldLabel required>Nomor Telepon Kantor</FieldLabel>
                  <input
                    type="text"
                    value={formData.no_telp || ""}
                    onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
                    placeholder="021-1234567"
                    className={inputClass}
                  />
                </div>

                {/* Nomor Fax */}
                <div>
                  <FieldLabel>Nomor Fax</FieldLabel>
                  <input
                    type="text"
                    value={formData.fax || ""}
                    onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                    placeholder="021-1234568"
                    className={inputClass}
                  />
                </div>

                {/* Nomor HP (CP) */}
                <div>
                  <FieldLabel required>Nomor HP (CP)</FieldLabel>
                  <input
                    type="text"
                    value={formData.no_whatsapp || ""}
                    onChange={(e) => setFormData({ ...formData, no_whatsapp: e.target.value })}
                    placeholder="08123456789"
                    className={inputClass}
                  />
                </div>

                {/* Bentuk Hukum */}
                <div>
                  <FieldLabel required>Bentuk Hukum</FieldLabel>
                  <input
                    type="text"
                    value={formData.badan_hukum || "PT"}
                    onChange={(e) => setFormData({ ...formData, badan_hukum: e.target.value })}
                    placeholder="PT"
                    className={inputClass}
                  />
                </div>

                {/* Jenis / Peran Perusahaan */}
                <div className="md:col-span-2">
                  <FieldLabel required>Jenis / Peran Perusahaan</FieldLabel>
                  <select
                    value={
                      formData.jenis_perusahaan_id ||
                      jenisPerusahaanList.find(
                        (j: any) =>
                          j.nama?.toLowerCase() === formData.jenis_perusahaan?.toLowerCase() ||
                          String(j.id) === String(formData.jenis_perusahaan)
                      )?.id ||
                      1
                    }
                    onChange={(e) => {
                      const selectedId = Number(e.target.value)
                      const selectedObj = jenisPerusahaanList.find((j: any) => Number(j.id) === selectedId)
                      setFormData({
                        ...formData,
                        jenis_perusahaan_id: selectedId,
                        jenis_perusahaan: selectedObj?.nama || "Produsen / Pabrikan",
                      })
                    }}
                    className={selectClass}
                  >
                    {jenisPerusahaanList.length > 0 ? (
                      jenisPerusahaanList.map((item: any) => (
                        <option key={item.id} value={item.id}>
                          {item.nama}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value={1}>Produsen / Pabrikan</option>
                        <option value={2}>Distributor / Penyalur</option>
                        <option value={3}>Importir</option>
                        <option value={4}>Eksportir</option>
                        <option value={5}>Perdagangan Umum</option>
                        <option value={6}>Jasa</option>
                        <option value={7}>Agen / Perwakilan Resmi</option>
                      </>
                    )}
                  </select>
                  <FieldHint>
                    Pilih peran bisnis perusahaan (misal: Produsen untuk pabrik pembuat barang).
                  </FieldHint>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Data Lokasi Perusahaan */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-none overflow-hidden">
            <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Data Lokasi Perusahaan</h3>
                <p className="text-[11px] text-slate-500">
                  Alamat domisili kantor pusat dan dimensi luas lahan.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Negara */}
                <div>
                  <FieldLabel required>Negara</FieldLabel>
                  <select
                    value={formData.negara || "Indonesia"}
                    onChange={(e) => {
                      const newCountry = e.target.value
                      setFormData((prev) => ({
                        ...prev,
                        negara: newCountry,
                        ...(newCountry !== "Indonesia" ? { provinsi: "", kabupaten: "", kecamatan: "" } : {})
                      }))
                      if (newCountry !== "Indonesia") {
                        setSelectedCompanyProvId("")
                        setSelectedCompanyKabId("")
                      }
                    }}
                    className={selectClass}
                  >
                    {DAFTAR_NEGARA.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kode Pos */}
                <div>
                  <FieldLabel>Kode Pos</FieldLabel>
                  <input
                    type="text"
                    value={formData.kode_pos || ""}
                    onChange={(e) => setFormData({ ...formData, kode_pos: e.target.value })}
                    placeholder="Contoh: 55161"
                    className={inputClass}
                  />
                </div>

                {/* Cascading Region Master Dropdowns (Hanya ditampilkan jika Negara = Indonesia) */}
                {isCompanyDomestic && (
                  <>
                    {/* Provinsi */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <FieldLabel required className="mb-0">Provinsi</FieldLabel>
                        {loadingProvinces && <Loader2 className="w-3 h-3 animate-spin text-brand-600" />}
                      </div>
                      <select
                        value={selectedCompanyProvId || ""}
                        onChange={(e) => {
                          const pId = e.target.value
                          const found = provinces.find((p: any) => String(p.id) === String(pId))
                          setSelectedCompanyProvId(pId)
                          setSelectedCompanyKabId("")
                          setFormData((prev) => ({
                            ...prev,
                            provinsi: found?.nama || pId,
                            kabupaten: "",
                            kecamatan: "",
                          }))
                        }}
                        className={selectClass}
                      >
                        <option value="">-- Pilih Provinsi --</option>
                        {provinces.map((p: any) => (
                          <option key={p.id} value={p.id}>
                            {p.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kabupaten / Kota */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <FieldLabel required className="mb-0">Kabupaten / Kota</FieldLabel>
                        {loadingCompanyRegencies && <Loader2 className="w-3 h-3 animate-spin text-brand-600" />}
                      </div>
                      <select
                        disabled={!selectedCompanyProvId}
                        value={selectedCompanyKabId || ""}
                        onChange={(e) => {
                          const kId = e.target.value
                          const found = companyRegencies.find((k: any) => String(k.id) === String(kId))
                          setSelectedCompanyKabId(kId)
                          setFormData((prev) => ({
                            ...prev,
                            kabupaten: found?.nama || kId,
                            kecamatan: "",
                          }))
                        }}
                        className={cx(selectClass, !selectedCompanyProvId && "bg-slate-100 cursor-not-allowed")}
                      >
                        <option value="">
                          {selectedCompanyProvId ? "-- Pilih Kabupaten/Kota --" : "-- Pilih Provinsi Dahulu --"}
                        </option>
                        {companyRegencies.map((k: any) => (
                          <option key={k.id} value={k.id}>
                            {k.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kecamatan */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <FieldLabel required className="mb-0">Kecamatan</FieldLabel>
                        {loadingCompanyDistricts && <Loader2 className="w-3 h-3 animate-spin text-brand-600" />}
                      </div>
                      <select
                        disabled={!selectedCompanyKabId}
                        value={
                          companyDistricts.find(
                            (d: any) =>
                              d.nama?.toLowerCase() === formData.kecamatan?.toLowerCase() ||
                              String(d.id) === String(formData.kecamatan)
                          )?.id || ""
                        }
                        onChange={(e) => {
                          const kecId = e.target.value
                          const found = companyDistricts.find((d: any) => String(d.id) === String(kecId))
                          setFormData((prev) => ({
                            ...prev,
                            kecamatan: found?.nama || kecId,
                          }))
                        }}
                        className={cx(selectClass, !selectedCompanyKabId && "bg-slate-100 cursor-not-allowed")}
                      >
                        <option value="">
                          {selectedCompanyKabId ? "-- Pilih Kecamatan --" : "-- Pilih Kab/Kota Dahulu --"}
                        </option>
                        {companyDistricts.map((d: any) => (
                          <option key={d.id} value={d.id}>
                            {d.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Alamat Lengkap */}
                <div className="md:col-span-2">
                  <FieldLabel required>Alamat Lengkap</FieldLabel>
                  <textarea
                    rows={3}
                    value={formData.alamat_kantor || ""}
                    onChange={(e) => setFormData({ ...formData, alamat_kantor: e.target.value })}
                    placeholder="Jl. Contoh No. 1, Jakarta"
                    className={textareaClass}
                  />
                </div>

                {/* Luas Tanah */}
                <div>
                  <FieldLabel required>Luas Tanah (m²)</FieldLabel>
                  <input
                    type="text"
                    value={formData.luas_tanah || ""}
                    onChange={(e) => setFormData({ ...formData, luas_tanah: e.target.value })}
                    placeholder="Contoh: 1500"
                    className={inputClass}
                  />
                </div>

                {/* Luas Bangunan */}
                <div>
                  <FieldLabel required>Luas Bangunan (m²)</FieldLabel>
                  <input
                    type="text"
                    value={formData.luas_bangunan || ""}
                    onChange={(e) => setFormData({ ...formData, luas_bangunan: e.target.value })}
                    placeholder="Contoh: 800"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Data Operasional */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-none overflow-hidden">
            <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Data Operasional</h3>
                <p className="text-[11px] text-slate-500">
                  Struktur ketenagakerjaan dan sistem pembagian waktu shift operasional.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Jumlah Shift */}
                <div>
                  <FieldLabel required>Jumlah Shift (dalam sehari)</FieldLabel>
                  <input
                    type="number"
                    min={1}
                    value={formData.jumlah_shift === undefined || formData.jumlah_shift === null ? 1 : formData.jumlah_shift}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleNumericChange("jumlah_shift", e.target.value)}
                    placeholder="1"
                    className={inputClass}
                  />
                </div>

                {/* Jumlah Bagian */}
                <div>
                  <FieldLabel required>Jumlah Bagian / Divisi</FieldLabel>
                  <input
                    type="number"
                    min={1}
                    value={formData.jumlah_bagian === undefined || formData.jumlah_bagian === null ? 1 : formData.jumlah_bagian}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleNumericChange("jumlah_bagian", e.target.value)}
                    placeholder="1"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Rincian Karyawan */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900">
                  Rincian Karyawan Sesuai Ruang Lingkup Sertifikasi
                </h4>

                <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  {/* Manajemen */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-medium text-slate-700 w-40">1. Manajemen <span className="text-rose-500">*</span></span>
                    <div className="relative flex-1 max-w-xs">
                      <input
                        type="number"
                        min={0}
                        value={formData.jumlah_manajemen === undefined || formData.jumlah_manajemen === null ? "" : formData.jumlah_manajemen}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleNumericChange("jumlah_manajemen", e.target.value)}
                        placeholder="0"
                        className={cx(inputClass, "pr-14")}
                      />
                      <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-slate-400">Orang</span>
                    </div>
                  </div>

                  {/* Administrasi */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-medium text-slate-700 w-40">2. Administrasi</span>
                    <div className="relative flex-1 max-w-xs">
                      <input
                        type="number"
                        min={0}
                        value={formData.jumlah_administrasi === undefined || formData.jumlah_administrasi === null ? "" : formData.jumlah_administrasi}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleNumericChange("jumlah_administrasi", e.target.value)}
                        placeholder="0"
                        className={cx(inputClass, "pr-14")}
                      />
                      <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-slate-400">Orang</span>
                    </div>
                  </div>

                  {/* Part Time */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-medium text-slate-700 w-40">3. Part Time</span>
                    <div className="relative flex-1 max-w-xs">
                      <input
                        type="number"
                        min={0}
                        value={formData.jumlah_part_time === undefined || formData.jumlah_part_time === null ? "" : formData.jumlah_part_time}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleNumericChange("jumlah_part_time", e.target.value)}
                        placeholder="0"
                        className={cx(inputClass, "pr-14")}
                      />
                      <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-slate-400">Orang</span>
                    </div>
                  </div>

                  {/* Operasional Header */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/80">
                    <span className="text-xs font-bold text-slate-800 block">4. Operasional <span className="text-rose-500">*</span></span>

                    {/* Shift 1 */}
                    <div className="flex items-center justify-between gap-4 pl-4">
                      <span className="text-xs text-slate-600 w-36">• Shift 1</span>
                      <div className="relative flex-1 max-w-xs">
                        <input
                          type="number"
                          min={0}
                          value={formData.jumlah_shift_1 === undefined || formData.jumlah_shift_1 === null ? "" : formData.jumlah_shift_1}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => handleNumericChange("jumlah_shift_1", e.target.value)}
                          placeholder="0"
                          className={cx(inputClass, "pr-14")}
                        />
                        <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-slate-400">Orang</span>
                      </div>
                    </div>

                    {/* Shift 2 */}
                    <div className="flex items-center justify-between gap-4 pl-4">
                      <span className="text-xs text-slate-600 w-36">• Shift 2</span>
                      <div className="relative flex-1 max-w-xs">
                        <input
                          type="number"
                          min={0}
                          value={formData.jumlah_shift_2 === undefined || formData.jumlah_shift_2 === null ? "" : formData.jumlah_shift_2}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => handleNumericChange("jumlah_shift_2", e.target.value)}
                          placeholder="0"
                          className={cx(inputClass, "pr-14")}
                        />
                        <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-slate-400">Orang</span>
                      </div>
                    </div>

                    {/* Shift 3 */}
                    <div className="flex items-center justify-between gap-4 pl-4">
                      <span className="text-xs text-slate-600 w-36">• Shift 3</span>
                      <div className="relative flex-1 max-w-xs">
                        <input
                          type="number"
                          min={0}
                          value={formData.jumlah_shift_3 === undefined || formData.jumlah_shift_3 === null ? "" : formData.jumlah_shift_3}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => handleNumericChange("jumlah_shift_3", e.target.value)}
                          placeholder="0"
                          className={cx(inputClass, "pr-14")}
                        />
                        <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-slate-400">Orang</span>
                      </div>
                    </div>
                  </div>

                  {/* Non Permanen */}
                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-200/80">
                    <span className="text-xs font-medium text-slate-700 w-40">5. Non Permanen</span>
                    <div className="relative flex-1 max-w-xs">
                      <input
                        type="number"
                        min={0}
                        value={formData.jumlah_non_permanen === undefined || formData.jumlah_non_permanen === null ? "" : formData.jumlah_non_permanen}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => handleNumericChange("jumlah_non_permanen", e.target.value)}
                        placeholder="0"
                        className={cx(inputClass, "pr-14")}
                      />
                      <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-slate-400">Orang</span>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-3 border-t border-slate-200">
                    <div className="text-xs text-slate-600">
                      Total Karyawan Operasional:{" "}
                      <span className="font-bold text-slate-900">{formData.jumlah_operasional || 0}</span> Orang
                    </div>
                    <div className="text-xs text-slate-600">
                      Total Keseluruhan:{" "}
                      <span className="font-bold text-brand-700 text-sm">{formData.jumlah_karyawan_total || 0}</span> Orang
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Data Pabrik */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-none overflow-hidden">
            <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Factory className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Data Pabrik / Lokasi Fasilitas</h3>
                  <p className="text-[11px] text-slate-500">
                    Informasi lokasi pabrik atau fasilitas produksi yang diajukan dalam permohonan.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {formData.pabrik.length} Lokasi Pabrik
              </span>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {formData.pabrik.map((f, idx) => (
                <PabrikCardItem
                  key={f.id || idx}
                  f={f}
                  idx={idx}
                  totalPabrik={formData.pabrik.length}
                  provinces={provinces}
                  loadingProvinces={loadingProvinces}
                  onUpdate={updatePabrik}
                  onRemove={removePabrik}
                />
              ))}

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPabrik}
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="text-xs font-bold text-brand-600 border-dashed border-2 border-brand-300 hover:bg-brand-50 px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Tambah Lokasi Pabrik Baru
                </Button>
                {formData.pabrik.length > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={duplicateLastPabrik}
                    leftIcon={<Copy className="w-4 h-4" />}
                    className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    Duplikat Data Pabrik #{formData.pabrik.length}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 5. Formulir Kelengkapan Permohonan */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-none overflow-hidden">
            <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Formulir Kelengkapan Permohonan</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                2.3. Lengkapi formulir berikut dan upload kembali dokumen :
              </p>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {/* Tautan Unduh Template */}
              <div className="space-y-2 bg-brand-50/50 p-4 rounded-xl border border-brand-100">
                <a
                  href="/files/pengajuan/sertifikasi/F.01.01_Formulir_Permohonan_Sertifikasi_Rev_17.docx"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  <span>(Form 1 Permohonan Sertifikasi)</span>
                </a>
                <a
                  href="/files/pengajuan/sertifikasi/F.01.02_Daftar_Pertanyaan_Penilaian_Mandiri_Rev_13.docx"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  <span>(Form 2 Kondisi Umum Perusahaan)</span>
                </a>
                <a
                  href="/files/pengajuan/sertifikasi/F.01.03_Surat_Pernyataan_Pemberian_Lisensi_Rev_08.docx"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  <span>(Form 3 Surat Pernyataan Perusahaan)</span>
                </a>
              </div>

              {/* Upload Berkas Gabungan */}
              <div className="space-y-2">
                <DropzoneUploader
                  label="Unggah Berkas Gabungan (Form 1, 2, dan 3) *"
                  helperText="Gabungkan form 1, form 2, dan form 3 yang telah diisi dalam 1 file PDF (Maksimal 10 MB)"
                  accept=".pdf"
                  maxSizeMB={10}
                  value={formData.file_berkas_gabungan}
                  onChange={(file) => setFormData((prev) => ({ ...prev, file_berkas_gabungan: file }))}
                />
              </div>
            </div>
          </div>
        </div>
      </StepPanel>

      {/* Navigasi Lanjut & Kembali */}
      <WizardNav onBack={onBack} onNext={onNext} nextLabel="Selanjutnya" backLabel="Sebelumnya" />
    </div>
  )
}

export default Step3PerusahaanDanPabrik
