import React from "react"
import {
  SertifikasiFormData,
  SertifikasiPabrikItem,
  emptyPabrik,
} from "../../../types/sertifikasi"
import { Card, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import {
  Building2,
  Factory,
  Plus,
  Trash2,
  MapPin,
  Users2,
  Maximize2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  UserCheck,
  ShieldCheck,
} from "lucide-react"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  provinces: any[]
  regencies: any[]
  onNext: () => void
  onBack: () => void
}

export const Step3PerusahaanDanPabrik: React.FC<Props> = ({
  formData,
  setFormData,
  provinces,
  regencies,
  onNext,
  onBack,
}) => {
  // Multi-Pabrik management
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
      {/* 1. DATA LEGALITAS & PROFIL PERUSAHAAN */}
      <Card className="border-slate-200 shadow-soft overflow-hidden">
        <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-200 flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-brand-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              1. Data Legalitas & Profil Badan Usaha Pemohon
            </h3>
            <p className="text-[11px] text-slate-500">
              Data resmi entitas pemohon sertifikasi (otomatis terisi dari profil akun).
            </p>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Perusahaan / Badan Usaha <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama_perusahaan}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nama_perusahaan: e.target.value }))
                }
                placeholder="Contoh: PT Industri Karet & Polimer Nusantara"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Akta Pendirian / NIB
              </label>
              <input
                type="text"
                value={formData.nomor_akta_pendirian || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nomor_akta_pendirian: e.target.value }))
                }
                placeholder="Nomor Akta Pendirian / SK Kemenkumham"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Pemilik / Direktur Utama
              </label>
              <input
                type="text"
                value={formData.nama_pemilik || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nama_pemilik: e.target.value }))
                }
                placeholder="Nama Pemilik / Direktur"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Pimpinan Perusahaan
              </label>
              <input
                type="text"
                value={formData.nama_pimpinan || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nama_pimpinan: e.target.value }))
                }
                placeholder="Nama Pimpinan Perusahaan"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Wakil Manajemen (Management Representative)
              </label>
              <input
                type="text"
                value={formData.nama_wakil_manajemen || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nama_wakil_manajemen: e.target.value }))
                }
                placeholder="Nama MR / Penanggung Jawab Mutu"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. Telepon Perusahaan
              </label>
              <input
                type="text"
                value={formData.no_telp}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, no_telp: e.target.value }))
                }
                placeholder="Contoh: (021) 7890123"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. WhatsApp PIC / Narahubung <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.no_whatsapp}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, no_whatsapp: e.target.value }))
                }
                placeholder="Contoh: 081234567890"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Email Resmi Perusahaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="corporate@company.co.id"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Kantor Pusat <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.alamat_kantor}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, alamat_kantor: e.target.value }))
                }
                placeholder="Alamat lengkap kantor pusat perusahaan"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. DATA FASILITAS PABRIK (MULTI-PABRIK) */}
      <Card className="border-slate-200 shadow-soft overflow-hidden">
        <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Factory className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                2. Lokasi Fasilitas Pabrik & Tempat Audit Lapangan
              </h3>
              <p className="text-[11px] text-slate-500">
                Daftarkan seluruh fasilitas lokasi pabrik yang akan diaudit kesesuaiannya oleh tim auditor BBKKP.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPabrik}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-semibold text-brand-700 border-brand-200 hover:bg-brand-50"
          >
            Tambah Lokasi Pabrik
          </Button>
        </div>

        <CardContent className="p-6 space-y-6">
          {formData.pabrik.map((p, idx) => (
            <div
              key={p.id || idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-brand-700 flex items-center gap-1.5">
                  <Factory className="w-4 h-4" /> Fasilitas Pabrik #{idx + 1}
                </span>

                {formData.pabrik.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePabrik(idx)}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus Pabrik
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Pabrik / Unit Produksi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={p.nama_pabrik}
                    onChange={(e) => updatePabrik(idx, "nama_pabrik", e.target.value)}
                    placeholder="Contoh: Pabrik Plant 1 Cikarang"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    No. Telepon / Kontak Pabrik
                  </label>
                  <input
                    type="text"
                    value={p.kontak_pabrik || ""}
                    onChange={(e) => updatePabrik(idx, "kontak_pabrik", e.target.value)}
                    placeholder="Contoh: (021) 8901234 / 08123456789"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alamat Lengkap Pabrik <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={p.alamat_pabrik}
                    onChange={(e) => updatePabrik(idx, "alamat_pabrik", e.target.value)}
                    placeholder="Alamat jalan, kawasan industri, nomor, RT/RW lokasi fasilitas pabrik"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Provinsi Lokasi Pabrik
                  </label>
                  <select
                    value={p.provinsi_id || ""}
                    onChange={(e) => updatePabrik(idx, "provinsi_id", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="">-- Pilih Provinsi --</option>
                    {provinces.map((prov) => (
                      <option key={prov.id || prov.prov_id} value={prov.id || prov.prov_id}>
                        {prov.nama || prov.prov_nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jumlah Tenaga Kerja / Karyawan
                  </label>
                  <input
                    type="number"
                    value={p.jumlah_karyawan || ""}
                    onChange={(e) =>
                      updatePabrik(idx, "jumlah_karyawan", parseInt(e.target.value) || 0)
                    }
                    placeholder="Jumlah karyawan produksi & staf"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Kembali ke Langkah 2
        </Button>
        <Button
          type="button"
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="px-6"
        >
          Lanjut ke Langkah 4
        </Button>
      </div>
    </div>
  )
}

export default Step3PerusahaanDanPabrik
