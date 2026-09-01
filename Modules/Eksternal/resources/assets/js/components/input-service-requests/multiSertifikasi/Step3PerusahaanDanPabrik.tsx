import React, { useEffect } from "react"
import { SertifikasiFormData, SertifikasiPabrikItem, emptyPabrik } from "../../../types/sertifikasi"
import { Card, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import {
  Building2,
  MapPin,
  Users,
  Factory,
  Plus,
  Trash2,
  FileDown,
  UploadCloud,
  FileText
} from "lucide-react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import useProfile from "../../../hooks/useProfile"

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
      jenis_perusahaan: prev.jenis_perusahaan || (detail.jenis_perusahaan || "Swasta"),
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
    <div className="space-y-8">
      {/* 1. Data Perusahaan */}
      <Card className="border-slate-200 shadow-soft overflow-hidden">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
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

        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nama Perusahaan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Nama Perusahaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama_perusahaan || ""}
                onChange={(e) => setFormData({ ...formData, nama_perusahaan: e.target.value })}
                placeholder="PT. Example"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Nomor Akta Pendirian */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Nomor Akta Pendirian <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nomor_akta_pendirian || ""}
                onChange={(e) => setFormData({ ...formData, nomor_akta_pendirian: e.target.value })}
                placeholder="123/AHU/1990"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Nama Pemilik */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Nama Pemilik <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama_pemilik || ""}
                onChange={(e) => setFormData({ ...formData, nama_pemilik: e.target.value })}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Nama Pimpinan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Nama Pimpinan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama_pimpinan || ""}
                onChange={(e) => setFormData({ ...formData, nama_pimpinan: e.target.value })}
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Nama Wakil Manajemen */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Nama Wakil Manajemen <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama_wakil_manajemen || ""}
                onChange={(e) => setFormData({ ...formData, nama_wakil_manajemen: e.target.value })}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Telp (Perusahaan) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Telp (Perusahaan) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.no_telp || ""}
                onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
                placeholder="02212345678"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Fax */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">Fax</label>
              <input
                type="text"
                value={formData.fax || ""}
                onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                placeholder="123-4124-4123"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Nomor HP (CP) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Nomor HP (CP) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.no_whatsapp || ""}
                onChange={(e) => setFormData({ ...formData, no_whatsapp: e.target.value })}
                placeholder="08123456789"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Bentuk Hukum */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Bentuk Hukum <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.badan_hukum || "PT"}
                onChange={(e) => setFormData({ ...formData, badan_hukum: e.target.value })}
                placeholder="PT"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Status Perusahaan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Status Perusahaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.jenis_perusahaan || "Swasta"}
                onChange={(e) => setFormData({ ...formData, jenis_perusahaan: e.target.value })}
                placeholder="Swasta"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Data Lokasi Perusahaan */}
      <Card className="border-slate-200 shadow-soft overflow-hidden">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
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

        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Negara */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Negara <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.negara || "Indonesia"}
                onChange={(e) => setFormData({ ...formData, negara: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              >
                {DAFTAR_NEGARA.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Provinsi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Provinsi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.provinsi || ""}
                onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                placeholder="Contoh: Jawa Timur / D.I. Yogyakarta"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Kabupaten / Kota */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Kabupaten / Kota <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.kabupaten || ""}
                onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                placeholder="Contoh: Kota Yogyakarta / Kab. Sleman"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Kecamatan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Kecamatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.kecamatan || ""}
                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                placeholder="Contoh: Umbulharjo"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Alamat Lengkap */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-800">
                Alamat Lengkap <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.alamat_kantor || ""}
                onChange={(e) => setFormData({ ...formData, alamat_kantor: e.target.value })}
                placeholder="Jl. Contoh No. 1, Jakarta"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Luas Tanah */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Luas Tanah (m²) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.luas_tanah || ""}
                onChange={(e) => setFormData({ ...formData, luas_tanah: e.target.value })}
                placeholder="Contoh: 1500"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Luas Bangunan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Luas Bangunan (m²) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.luas_bangunan || ""}
                onChange={(e) => setFormData({ ...formData, luas_bangunan: e.target.value })}
                placeholder="Contoh: 800"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Data Operasional */}
      <Card className="border-slate-200 shadow-soft overflow-hidden">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
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

        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Jumlah Shift */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Jumlah Shift (dalam sehari) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={formData.jumlah_shift === undefined || formData.jumlah_shift === null ? 1 : formData.jumlah_shift}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleNumericChange("jumlah_shift", e.target.value)}
                placeholder="1"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>

            {/* Jumlah Bagian */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Jumlah Bagian <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={formData.jumlah_bagian === undefined || formData.jumlah_bagian === null ? "" : formData.jumlah_bagian}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleNumericChange("jumlah_bagian", e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-xs"
              />
            </div>
          </div>

          {/* Rincian Jumlah Karyawan */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Jumlah Karyawan <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                Total: {formData.jumlah_karyawan_total || 0} Orang
              </span>
            </div>

            <div className="space-y-2.5 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              {/* Manajemen */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-700 w-40">1. Manajemen</span>
                <div className="relative flex-1 max-w-xs">
                  <input
                    type="number"
                    min={0}
                    value={formData.jumlah_manajemen === undefined || formData.jumlah_manajemen === null ? "" : formData.jumlah_manajemen}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleNumericChange("jumlah_manajemen", e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="absolute right-3 top-2 text-[11px] font-semibold text-slate-400">Orang</span>
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="absolute right-3 top-2 text-[11px] font-semibold text-slate-400">Orang</span>
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="absolute right-3 top-2 text-[11px] font-semibold text-slate-400">Orang</span>
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
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <span className="absolute right-3 top-2 text-[11px] font-semibold text-slate-400">Orang</span>
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
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <span className="absolute right-3 top-2 text-[11px] font-semibold text-slate-400">Orang</span>
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
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <span className="absolute right-3 top-2 text-[11px] font-semibold text-slate-400">Orang</span>
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
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="absolute right-3 top-2 text-[11px] font-semibold text-slate-400">Orang</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Data Pabrik */}
      <Card className="border-slate-200 shadow-soft overflow-hidden">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Factory className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Data Pabrik</h3>
              <p className="text-[11px] text-slate-500">2.2. Detail Lokasi Pabrik <span className="text-rose-500">*</span></p>
            </div>
          </div>
          <span className="px-3 py-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-full text-xs font-bold">
            {formData.pabrik.length} Pabrik Terdaftar
          </span>
        </div>

        <CardContent className="p-6 space-y-6">
          {formData.pabrik.map((f, idx) => (
            <div key={f.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {f.nama_pabrik || `Pabrik #${idx + 1}`}
                  </span>
                </div>
                {formData.pabrik.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePabrik(idx)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus Pabrik
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nama Pabrik */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Nama Pabrik <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={f.nama_pabrik}
                    onChange={(e) => updatePabrik(idx, "nama_pabrik", e.target.value)}
                    placeholder="PT. Example"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* No Telp */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">No Telp</label>
                  <input
                    type="text"
                    value={f.kontak_pabrik || ""}
                    onChange={(e) => updatePabrik(idx, "kontak_pabrik", e.target.value)}
                    placeholder="02212345678"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* No HP */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">No HP</label>
                  <input
                    type="text"
                    value={f.no_hp || ""}
                    onChange={(e) => updatePabrik(idx, "no_hp", e.target.value)}
                    placeholder="-"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Fax */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Fax</label>
                  <input
                    type="text"
                    value={f.fax || ""}
                    onChange={(e) => updatePabrik(idx, "fax", e.target.value)}
                    placeholder="-"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Negara */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Negara <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={f.negara || "Indonesia"}
                    onChange={(e) => updatePabrik(idx, "negara", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {DAFTAR_NEGARA.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* Kode Pos */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Kode Pos</label>
                  <input
                    type="text"
                    value={f.kode_pos || ""}
                    onChange={(e) => updatePabrik(idx, "kode_pos", e.target.value)}
                    placeholder="-"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Alamat Pabrik */}
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Alamat Pabrik <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={f.alamat_pabrik}
                    onChange={(e) => updatePabrik(idx, "alamat_pabrik", e.target.value)}
                    placeholder="Jl. Contoh No. 1, Jakarta"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Jumlah Karyawan */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Jumlah Karyawan</label>
                  <input
                    type="number"
                    min={0}
                    value={f.jumlah_karyawan === undefined || f.jumlah_karyawan === null ? "" : f.jumlah_karyawan}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const raw = e.target.value
                      updatePabrik(idx, "jumlah_karyawan", raw === "" ? "" : parseInt(raw, 10) || 0)
                    }}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Kegiatan Utama */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Kegiatan Utama</label>
                  <input
                    type="text"
                    value={f.kegiatan_utama || ""}
                    onChange={(e) => updatePabrik(idx, "kegiatan_utama", e.target.value)}
                    placeholder="-"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Luas Tanah */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Luas Tanah</label>
                  <input
                    type="text"
                    value={f.luas_tanah || ""}
                    onChange={(e) => updatePabrik(idx, "luas_tanah", e.target.value)}
                    placeholder="-"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Luas Bangunan */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Luas Bangunan</label>
                  <input
                    type="text"
                    value={f.luas_bangunan || ""}
                    onChange={(e) => updatePabrik(idx, "luas_bangunan", e.target.value)}
                    placeholder="-"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={addPabrik}
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs font-bold text-brand-600 border-dashed border-2 border-brand-300 hover:bg-brand-50 px-6 py-2.5"
            >
              + Tambah Data Pabrik
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 5. Formulir Kelengkapan Permohonan */}
      <Card className="border-slate-200 shadow-soft overflow-hidden">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Formulir Kelengkapan Permohonan</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            2.3. Lengkapi formulir berikut dan upload kembali dokumen :
          </p>
        </div>

        <CardContent className="p-6 space-y-5">
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
            <label className="block text-xs font-bold text-slate-800">
              Upload Berkas Gabungan <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setFormData({ ...formData, file_berkas_gabungan: file })
                }}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border border-slate-300 rounded-xl cursor-pointer bg-white"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Upload file merupakan <span className="font-semibold text-slate-600">form 1, form 2, dan form 3</span> digabung dengan format PDF.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigasi Lanjut & Kembali */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <Button variant="outline" type="button" onClick={onBack} className="px-6">
          Kembali
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}

export default Step3PerusahaanDanPabrik
