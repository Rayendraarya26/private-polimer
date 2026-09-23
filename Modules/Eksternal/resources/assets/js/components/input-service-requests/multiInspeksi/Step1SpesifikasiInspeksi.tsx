import React from "react"
import {
  FileText,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { InspeksiFormData, JenisInspeksi } from "../../../types/inspeksi"
import { toast } from "react-hot-toast"

interface Step1SpesifikasiInspeksiProps {
  formData: InspeksiFormData
  setFormData: React.Dispatch<React.SetStateAction<InspeksiFormData>>
}

export const Step1SpesifikasiInspeksi: React.FC<Step1SpesifikasiInspeksiProps> = ({
  formData,
  setFormData,
}) => {
  const { dataPermohonan, dataSpesifikasi, dataPelaksanaan } = formData

  const handleJenisToggle = (jenis: JenisInspeksi) => {
    setFormData((prev) => {
      const current = prev.dataSpesifikasi.jenis_inspeksi
      let updated: JenisInspeksi[]
      if (current.includes(jenis)) {
        if (current.length === 1) {
          toast.error("Minimal satu jenis inspeksi harus dipilih")
          return prev
        }
        updated = current.filter((item) => item !== jenis)
      } else {
        updated = [...current, jenis]
      }
      return {
        ...prev,
        dataSpesifikasi: {
          ...prev.dataSpesifikasi,
          jenis_inspeksi: updated,
        },
      }
    })
  }

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <PackageCheck className="w-4 h-4 text-brand-600" />
              1. Spesifikasi Karung & Rencana Pelaksanaan Inspeksi
            </CardTitle>
            <CardDescription>
              Silakan lengkapi data surat permohonan, jenis inspeksi yang diminta, rincian karung plastik, serta jadwal pelaksanaan lapangan
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* 1. Data Surat Permohonan Klien */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Surat Permintaan / Pengantar Klien
              </h4>
              <p className="text-[11px] text-slate-500">
                Informasi nomor surat resmi dari perusahaan pemohon (jika ada)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor Surat Pemohon <span className="text-slate-400 font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: 018/KPA-DIR/VII/2026"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={dataPermohonan.no_surat_pemohon}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataPermohonan: {
                      ...prev.dataPermohonan,
                      no_surat_pemohon: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Surat Pemohon <span className="text-slate-400 font-normal">(opsional)</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={dataPermohonan.tgl_surat_pemohon}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dataPermohonan: {
                        ...prev.dataPermohonan,
                        tgl_surat_pemohon: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Jenis Inspeksi yang Diminta */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Jenis Inspeksi yang Diminta <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Pilih lingkup inspeksi kemasan yang dikehendaki (dapat memilih keduanya)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opsi 1: Inspeksi Kuantitas */}
            <div
              onClick={() => handleJenisToggle("kuantitas")}
              className={`cursor-pointer border rounded-xl p-4 transition-all flex items-start gap-3 select-none ${
                dataSpesifikasi.jenis_inspeksi.includes("kuantitas")
                  ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500/30"
                  : "border-slate-300 hover:border-slate-400 bg-white"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                  dataSpesifikasi.jenis_inspeksi.includes("kuantitas")
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {dataSpesifikasi.jenis_inspeksi.includes("kuantitas") && (
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Inspeksi Kuantitas</p>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Pemeriksaan jumlah partai/lot kemasan, verifikasi volume fisik, penandaan kemasan, dan
                  kesesuaian jumlah pesanan.
                </p>
              </div>
            </div>

            {/* Opsi 2: Inspeksi Kualitas */}
            <div
              onClick={() => handleJenisToggle("kualitas")}
              className={`cursor-pointer border rounded-xl p-4 transition-all flex items-start gap-3 select-none ${
                dataSpesifikasi.jenis_inspeksi.includes("kualitas")
                  ? "border-brand-500 bg-brand-50/60 ring-1 ring-brand-500/30"
                  : "border-slate-300 hover:border-slate-400 bg-white"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                  dataSpesifikasi.jenis_inspeksi.includes("kualitas")
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {dataSpesifikasi.jenis_inspeksi.includes("kualitas") && (
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Inspeksi Kualitas</p>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Pengujian kesesuaian dimensi kemasan, kerapatan anyaman/mesh, gramatur, kekuatan tarik,
                  jahitan, serta hasil printing logo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Spesifikasi Karung Plastik */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Objek & Karakteristik Karung Plastik
              </h4>
              <p className="text-[11px] text-slate-500">
                Spesifikasi teknis karung plastik kemasan yang akan diinspeksi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Komoditas / Nama Karung <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Karung Plastik Beras Bantuan Pangan"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={dataSpesifikasi.komoditas}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataSpesifikasi: {
                      ...prev.dataSpesifikasi,
                      komoditas: e.target.value,
                    },
                  }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kapasitas Karung <span className="text-rose-500">*</span>
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={dataSpesifikasi.kapasitas_karung}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataSpesifikasi: {
                      ...prev.dataSpesifikasi,
                      kapasitas_karung: e.target.value,
                    },
                  }))
                }
              >
                <option value="10 kg">10 kg (Standar Banpang)</option>
                <option value="5 kg">5 kg</option>
                <option value="20 kg">20 kg</option>
                <option value="25 kg">25 kg</option>
                <option value="50 kg">50 kg</option>
                <option value="Lainnya">Lainnya / Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Rincian Dimensi & Spesifikasi Karung yang Diminta
            </label>
            <textarea
              rows={3}
              placeholder="Lengkapi dengan dimensi panjang x lebar, anyaman/mesh, gramatur, jahitan, atau benang kuran yang diminta..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={dataSpesifikasi.spesifikasi_dimensi}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataSpesifikasi: {
                    ...prev.dataSpesifikasi,
                    spesifikasi_dimensi: e.target.value,
                  },
                }))
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Perkiraan Jumlah Partai / Lot Pemeriksaan <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                className="w-28 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={dataSpesifikasi.jumlah_partai_lot}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataSpesifikasi: {
                      ...prev.dataSpesifikasi,
                      jumlah_partai_lot: parseInt(e.target.value) || 1,
                    },
                  }))
                }
              />
              <span className="text-xs text-slate-600 font-medium">Partai / Lot</span>
            </div>
          </div>
        </div>

        {/* 4. Rencana Pelaksanaan & Lokasi Gudang */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Rencana Tanggal & Lokasi Pemeriksaan On-Site
              </h4>
              <p className="text-[11px] text-slate-500">
                Jadwal dan alamat fasilitas pabrik/gudang yang dikunjungi tim inspektur
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Rencana Tanggal Inspeksi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={dataPelaksanaan.tgl_rencana_inspeksi}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dataPelaksanaan: {
                        ...prev.dataPelaksanaan,
                        tgl_rencana_inspeksi: e.target.value,
                      },
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Lengkap Pabrik / Gudang Inspeksi <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: PT Karunia Plastindo Abadi - Jl. Raya Narogong Km 23.5, Desa Dayeuh, Kec. Cileungsi, Kab. Bogor, Jawa Barat"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={dataPelaksanaan.lokasi_inspeksi}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataPelaksanaan: {
                      ...prev.dataPelaksanaan,
                      lokasi_inspeksi: e.target.value,
                    },
                  }))
                }
                required
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step1SpesifikasiInspeksi
