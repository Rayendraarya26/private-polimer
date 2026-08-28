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
  Briefcase,
  Clock,
  FileSpreadsheet,
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
              Data resmi entitas pemohon sertifikasi sesuai akta legalitas dan profil perusahaan.
            </p>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
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
                Bentuk Badan Hukum
              </label>
              <select
                value={formData.badan_hukum || "PT"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, badan_hukum: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="PT">PT (Perseroan Terbatas)</option>
                <option value="CV">CV (Commanditaire Vennootschap)</option>
                <option value="UD">UD (Usaha Dagang)</option>
                <option value="Koperasi">Koperasi</option>
                <option value="BUMN/BUMD">BUMN / BUMD</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Kepemilikan Perusahaan
              </label>
              <select
                value={formData.jenis_perusahaan || "Swasta Nasional"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, jenis_perusahaan: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="Swasta Nasional">Swasta Nasional (PMDN)</option>
                <option value="PMA">Penanaman Modal Asing (PMA)</option>
                <option value="BUMN">BUMN / Pemerintah</option>
                <option value="UMKM">UMKM / Perseorangan</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Akta Pendirian / SK Kemenkumham
              </label>
              <input
                type="text"
                value={formData.nomor_akta_pendirian || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nomor_akta_pendirian: e.target.value }))
                }
                placeholder="Nomor Akta Pendirian"
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
                Nama Wakil Manajemen (MR)
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
                Narahubung / Kontak Person (PIC) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.kontak_person || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, kontak_person: e.target.value }))
                }
                placeholder="Nama Lengkap PIC"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                No. Telepon Kantor
              </label>
              <input
                type="text"
                value={formData.no_telp || ""}
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
                value={formData.no_whatsapp || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, no_whatsapp: e.target.value }))
                }
                placeholder="Contoh: 081234567890"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Fax Perusahaan
              </label>
              <input
                type="text"
                value={formData.fax || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fax: e.target.value }))
                }
                placeholder="Contoh: (021) 7890124"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">
                Email Resmi Perusahaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="corporate@company.co.id"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Kantor Pusat <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.alamat_kantor || ""}
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

      {/* 2. DATA KETENAGAKERJAAN & OPERASIONAL */}
      <Card className="border-slate-200 shadow-soft overflow-hidden">
        <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-200 flex items-center gap-2.5">
          <Users2 className="w-5 h-5 text-brand-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              2. Data Kondisi Ketenagakerjaan & Operasional Perusahaan
            </h3>
            <p className="text-[11px] text-slate-500">
              Rincian jumlah personil, pembagian shift kerja, dan fasilitas untuk penghitungan mandays audit LSPro.
            </p>
          </div>
        </div>

        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah Karyawan Total <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.jumlah_karyawan_total || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jumlah_karyawan_total: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="Total personil"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none font-semibold text-brand-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah Personil Manajemen
              </label>
              <input
                type="number"
                min="0"
                value={formData.jumlah_manajemen || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jumlah_manajemen: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="Staf manajerial"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah Personil Administrasi
              </label>
              <input
                type="number"
                min="0"
                value={formData.jumlah_administrasi || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jumlah_administrasi: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="Staf administrasi"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah Personil Operasional / Pabrik
              </label>
              <input
                type="number"
                min="0"
                value={formData.jumlah_operasional || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jumlah_operasional: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="Operator produksi"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah Karyawan Part-Time
              </label>
              <input
                type="number"
                min="0"
                value={formData.jumlah_part_time || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jumlah_part_time: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="Paruh waktu"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah Karyawan Non-Permanen / Kontrak
              </label>
              <input
                type="number"
                min="0"
                value={formData.jumlah_non_permanen || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jumlah_non_permanen: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="Outsourcing / Kontrak"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah Shift Operasional
              </label>
              <select
                value={formData.jumlah_shift || 1}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jumlah_shift: parseInt(e.target.value) || 1,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value={1}>1 Shift (Normal)</option>
                <option value={2}>2 Shift</option>
                <option value={3}>3 Shift (24 Jam)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah Bagian / Departemen
              </label>
              <input
                type="number"
                min="1"
                value={formData.jumlah_bagian || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jumlah_bagian: parseInt(e.target.value) || 1,
                  }))
                }
                placeholder="Jumlah divisi"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Rincian Karyawan per Shift */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Rincian Personil per Shift Kerja</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  Karyawan Shift 1 (Pagi/Utama)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.jumlah_shift_1 || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      jumlah_shift_1: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="Jumlah personil shift 1"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  Karyawan Shift 2 (Siang/Sore)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.jumlah_shift_2 || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      jumlah_shift_2: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="Jumlah personil shift 2"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">
                  Karyawan Shift 3 (Malam)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.jumlah_shift_3 || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      jumlah_shift_3: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="Jumlah personil shift 3"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Luas Fasilitas & Berkas Gabungan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Luas Tanah Perusahaan (m²)
              </label>
              <input
                type="text"
                value={formData.luas_tanah || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, luas_tanah: e.target.value }))
                }
                placeholder="Contoh: 5.000 m²"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Luas Bangunan Pabrik (m²)
              </label>
              <input
                type="text"
                value={formData.luas_bangunan || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, luas_bangunan: e.target.value }))
                }
                placeholder="Contoh: 3.200 m²"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Upload File Berkas Gabungan (Opsional)
              </label>
              <input
                type="file"
                accept=".pdf,.zip,.rar"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    file_berkas_gabungan: e.target.files?.[0] || null,
                  }))
                }
                className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
              />
              {formData.file_berkas_gabungan && (
                <p className="text-[10px] text-brand-600 font-medium truncate mt-1">
                  File: {formData.file_berkas_gabungan.name}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. DATA FASILITAS PABRIK (MULTI-PABRIK) */}
      <Card className="border-slate-200 shadow-soft overflow-hidden">
        <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Factory className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                3. Lokasi Fasilitas Pabrik & Tempat Audit Lapangan
              </h3>
              <p className="text-[11px] text-slate-500">
                Daftarkan seluruh fasilitas lokasi pabrik yang akan diaudit kesesuaiannya oleh tim auditor BBSPJIKKP.
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
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
                    Negara Lokasi Pabrik
                  </label>
                  <input
                    type="text"
                    value={p.negara || "Indonesia"}
                    onChange={(e) => updatePabrik(idx, "negara", e.target.value)}
                    placeholder="Indonesia"
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

                <div className="md:col-span-3">
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
                    No. Telepon Pabrik
                  </label>
                  <input
                    type="text"
                    value={p.kontak_pabrik || ""}
                    onChange={(e) => updatePabrik(idx, "kontak_pabrik", e.target.value)}
                    placeholder="Contoh: (021) 8901234"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    No. HP / WhatsApp PIC Pabrik
                  </label>
                  <input
                    type="text"
                    value={p.no_hp || ""}
                    onChange={(e) => updatePabrik(idx, "no_hp", e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kegiatan Utama Pabrik
                  </label>
                  <input
                    type="text"
                    value={p.kegiatan_utama || ""}
                    onChange={(e) => updatePabrik(idx, "kegiatan_utama", e.target.value)}
                    placeholder="Contoh: Pencetakan sol sepatu, perakitan, QA"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jumlah Karyawan Pabrik
                  </label>
                  <input
                    type="number"
                    value={p.jumlah_karyawan || ""}
                    onChange={(e) =>
                      updatePabrik(idx, "jumlah_karyawan", parseInt(e.target.value) || 0)
                    }
                    placeholder="Jumlah personil pabrik"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Luas Tanah Pabrik (m²)
                  </label>
                  <input
                    type="text"
                    value={p.luas_tanah || ""}
                    onChange={(e) => updatePabrik(idx, "luas_tanah", e.target.value)}
                    placeholder="Contoh: 4.500 m²"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Luas Bangunan Pabrik (m²)
                  </label>
                  <input
                    type="text"
                    value={p.luas_bangunan || ""}
                    onChange={(e) => updatePabrik(idx, "luas_bangunan", e.target.value)}
                    placeholder="Contoh: 2.800 m²"
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
