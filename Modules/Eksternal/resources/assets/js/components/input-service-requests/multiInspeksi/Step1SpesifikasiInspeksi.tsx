import React from "react"
import {
  FileText,
  Calendar,
  Layers,
  MapPin,
  PackageCheck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { InspeksiFormData, JenisInspeksi } from "../../../types/inspeksi"
import { toast } from "react-hot-toast"
import {
  FormField,
  TextInput,
  DateInput,
  SelectInput,
  TextareaInput,
} from "../../forms"

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
    <Card className="border-brand-100 shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
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
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
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
            <FormField label="Nomor Surat Pemohon" helperText="Opsional jika ada pengantar resmi">
              <TextInput
                placeholder="Contoh: 018/KPA-DIR/VII/2026"
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
            </FormField>

            <FormField label="Tanggal Surat Pemohon" helperText="Opsional">
              <DateInput
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
            </FormField>
          </div>
        </div>

        {/* 2. Jenis Inspeksi yang Diminta */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
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
              className={`cursor-pointer border-2 rounded-2xl p-4 sm:p-5 transition-all flex items-start gap-3.5 select-none ${
                dataSpesifikasi.jenis_inspeksi.includes("kuantitas")
                  ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/15 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
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
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">Inspeksi Kuantitas</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pemeriksaan jumlah partai/lot kemasan, verifikasi volume fisik, penandaan kemasan, dan
                  kesesuaian jumlah pesanan.
                </p>
              </div>
            </div>

            {/* Opsi 2: Inspeksi Kualitas */}
            <div
              onClick={() => handleJenisToggle("kualitas")}
              className={`cursor-pointer border-2 rounded-2xl p-4 sm:p-5 transition-all flex items-start gap-3.5 select-none ${
                dataSpesifikasi.jenis_inspeksi.includes("kualitas")
                  ? "border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/15 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
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
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">Inspeksi Kualitas</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pengujian kesesuaian dimensi kemasan, kerapatan anyaman/mesh, gramatur, kekuatan tarik,
                  jahitan, serta hasil printing logo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Spesifikasi Karung Plastik */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormField label="Komoditas / Nama Karung" required>
                <TextInput
                  placeholder="Contoh: Karung Plastik Beras Bantuan Pangan"
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
                />
              </FormField>
            </div>

            <div>
              <FormField label="Kapasitas Karung" required>
                <SelectInput
                  value={dataSpesifikasi.kapasitas_karung}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      dataSpesifikasi: {
                        ...prev.dataSpesifikasi,
                        kapasitas_karung: String(val),
                      },
                    }))
                  }
                  placeholder="-- Pilih Kapasitas Karung --"
                  options={[
                    { value: "5 kg", label: "5 kg" },
                    { value: "10 kg", label: "10 kg" },
                    { value: "20 kg", label: "20 kg" },
                    { value: "25 kg", label: "25 kg" },
                    { value: "50 kg", label: "50 kg" },
                    { value: "Lainnya", label: "Lainnya / Custom" },
                  ]}
                />
              </FormField>
            </div>
          </div>

          <FormField
            label="Rincian Dimensi & Spesifikasi Karung yang Diminta"
            helperText="Opsional: dimensi, anyaman, gramatur, jahitan, dsb."
          >
            <TextareaInput
              rows={3}
              placeholder="Contoh: Kemasan beras 10kg, dimensi 30 cm x 45 cm, anyaman 10x10, gramatur dan jahitan sesuai spesifikasi..."
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
          </FormField>

          <FormField label="Perkiraan Jumlah Partai / Lot Pemeriksaan" required>
            <div className="flex items-center gap-3">
              <TextInput
                type="number"
                min={1}
                className="w-32"
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
          </FormField>
        </div>

        {/* 4. Rencana Pelaksanaan & Lokasi Gudang */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormField label="Rencana Tanggal Inspeksi" required>
                <DateInput
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
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Alamat Lengkap Pabrik / Gudang Inspeksi" required>
                <TextareaInput
                  rows={2}
                  placeholder="Contoh: PT Cahaya Abadi Sentosa - Jl. Raya Solo-Sragen Km. 7, Desa Jaten, Kec. Jaten, Kab. Karanganyar, Jawa Tengah"
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
                />
              </FormField>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step1SpesifikasiInspeksi
