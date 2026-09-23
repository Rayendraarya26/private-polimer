import React, { useRef } from "react"
import {
  ShieldCheck,
  UploadCloud,
  FileText,
  AlertCircle,
  PackageCheck,
  Building2,
  Calendar,
  X,
  FileCheck2,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { InspeksiFormData } from "../../../types/inspeksi"
import { toast } from "react-hot-toast"

interface Step4PernyataanKonfirmasiProps {
  formData: InspeksiFormData
  setFormData: React.Dispatch<React.SetStateAction<InspeksiFormData>>
  setujuPernyataan: boolean
  onChangePernyataan: (setuju: boolean) => void
}

export const Step4PernyataanKonfirmasi: React.FC<Step4PernyataanKonfirmasiProps> = ({
  formData,
  setFormData,
  setujuPernyataan,
  onChangePernyataan,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { dataPermohonan, dataSpesifikasi, dataPelaksanaan, dataPenerima, dataBiaya, dataPic } =
    formData

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10 MB")
      return
    }

    setFormData((prev) => ({
      ...prev,
      file_surat_permohonan: file,
    }))
    toast.success(`File ${file.name} berhasil dipilih`)
  }

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      file_surat_permohonan: null,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              4. Berkas Surat Permohonan & Pernyataan Integritas
            </CardTitle>
            <CardDescription>
              Periksa kembali rincian data permohonan inspeksi sebelum menyetujui pernyataan dan mengirim permohonan
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* 1. Upload Berkas Surat Permohonan */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Unggah Surat Permintaan / Pengantar Resmi
              </h4>
              <p className="text-[11px] text-slate-500">
                Scan surat permohonan resmi bertanda tangan dan berstempel perusahaan (PDF / JPG / PNG, max 10MB)
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />

          {formData.file_surat_permohonan ? (
            <div className="flex items-center justify-between p-3.5 bg-brand-50/60 border border-brand-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {formData.file_surat_permohonan.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {(formData.file_surat_permohonan.size / 1024 / 1024).toFixed(2)} MB • Berkas siap diunggah
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-white hover:bg-brand-50/30"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Klik di sini untuk memilih file scan surat permohonan
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Format yang didukung: PDF, JPG, PNG (maksimal 10 MB)
              </p>
            </div>
          )}
        </div>

        {/* 2. Ringkasan Data Permohonan (Format sama persis dengan FormPernyataan.tsx) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Ringkasan Spesifikasi */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <PackageCheck className="w-4 h-4 text-brand-600" />
              Objek & Spesifikasi Inspeksi
            </h4>
            <div className="text-xs space-y-1.5 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Jenis Inspeksi:</span>
                <span className="font-semibold text-slate-800 uppercase">
                  {dataSpesifikasi.jenis_inspeksi.join(" & ")}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Komoditas:</span>
                <span className="font-semibold text-slate-800">{dataSpesifikasi.komoditas}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Kapasitas:</span>
                <span className="font-semibold text-slate-800">{dataSpesifikasi.kapasitas_karung}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Jumlah Partai:</span>
                <span className="font-semibold text-slate-800">{dataSpesifikasi.jumlah_partai_lot} Lot</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Bahasa Laporan:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  Bahasa {dataPelaksanaan.bahasa_laporan}
                </span>
              </div>
            </div>
          </div>

          {/* Card Ringkasan Pelaksanaan & Pihak Terkait */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              Pelaksanaan & Pihak Terkait
            </h4>
            <div className="text-xs space-y-1.5 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Rencana Pelaksanaan:</span>
                <span className="font-semibold text-slate-800">
                  {dataPelaksanaan.tgl_rencana_inspeksi || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Hasil Dibuat Untuk:</span>
                <span className="font-semibold text-brand-700">{dataPenerima.penerima_hasil_nama}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Penanggung Biaya:</span>
                <span className="font-semibold text-slate-800">{dataBiaya.biaya_nama}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Personel PIC:</span>
                <span className="font-semibold text-slate-800">
                  {dataPic.pemohon_pic_nama} ({dataPic.pemohon_pic_kontak})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Lokasi Gudang:</span>
                <span className="text-slate-700 truncate block">
                  {dataPelaksanaan.lokasi_inspeksi || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Klausul Pernyataan Pemohon */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
          <h4 className="text-xs font-bold text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Pernyataan Pemohon Jasa Inspeksi
          </h4>

          <ul className="space-y-1.5 text-xs text-amber-950/80 leading-relaxed list-disc list-inside">
            <li>
              Seluruh data dan informasi yang disampaikan dalam formulir ini adalah sesuai dengan kondisi yang sebenarnya;
            </li>
            <li>
              Jika terdapat kesalahan atau ketidaksesuaian dari informasi tersebut, maka menjadi tanggung jawab peminta Jasa Inspeksi sepenuhnya;
            </li>
            <li>
              Salinan resmi Sertifikat Hasil Inspeksi akan dikirimkan kepada{" "}
              <strong className="text-slate-900 font-semibold">
                {dataPenerima.penerima_hasil_nama || "Perum BULOG"}
              </strong>{" "}
              sebagai tembusan pelaporan.
            </li>
          </ul>

          <div className="pt-2 border-t border-amber-200/80">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded border-amber-300 text-brand-600 focus:ring-brand-500"
                checked={setujuPernyataan}
                onChange={(e) => onChangePernyataan(e.target.checked)}
              />
              <span className="text-xs font-semibold text-slate-800">
                Saya telah membaca, memahami, dan menyetujui seluruh klausul pernyataan di atas dengan penuh tanggung jawab.
              </span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step4PernyataanKonfirmasi
