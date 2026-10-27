import React from "react"
import {
  ShieldCheck,
  PackageCheck,
  Building2,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { InspeksiFormData } from "../../../types/inspeksi"
import { DropzoneUploader, LegalStatementBox } from "../../forms"

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
  const { dataSpesifikasi, dataPelaksanaan, dataPenerima, dataBiaya, dataPic } = formData

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
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">
            Surat Permintaan / Pengantar Resmi <span className="text-rose-500">*</span>
          </label>
          <DropzoneUploader
            value={formData.file_surat_permohonan}
            onChange={(file) =>
              setFormData((prev) => ({
                ...prev,
                file_surat_permohonan: file,
              }))
            }
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={10}
            label="Unggah Scan Surat Permohonan Resmi"
            helperText="Scan surat permohonan resmi bertanda tangan dan berstempel perusahaan (PDF / JPG / PNG, maks 10 MB)"
          />
        </div>

        {/* 2. Ringkasan Data Permohonan */}
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
                  {dataSpesifikasi.jenis_inspeksi.join(" & ") || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Komoditas:</span>
                <span className="font-semibold text-slate-800">{dataSpesifikasi.komoditas || "-"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Kapasitas:</span>
                <span className="font-semibold text-slate-800">{dataSpesifikasi.kapasitas_karung || "-"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Jumlah Partai:</span>
                <span className="font-semibold text-slate-800">{dataSpesifikasi.jumlah_partai_lot || 0} Lot</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Bahasa Laporan:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  Bahasa {dataPelaksanaan.bahasa_laporan || "-"}
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
                <span className="font-semibold text-brand-700">{dataPenerima.penerima_hasil_nama || "-"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Penanggung Biaya:</span>
                <span className="font-semibold text-slate-800">{dataBiaya.biaya_nama || "-"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Personel PIC:</span>
                <span className="font-semibold text-slate-800">
                  {dataPic.pemohon_pic_nama || "-"} ({dataPic.pemohon_pic_kontak || "-"})
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
        <LegalStatementBox
          checked={setujuPernyataan}
          onChange={onChangePernyataan}
          title="Pernyataan Pemohon Jasa Inspeksi"
          subtitle="Konfirmasi kebenaran data dan persetujuan tembusan pelaporan"
          bulletPoints={[
            "Seluruh data dan informasi yang disampaikan dalam formulir ini adalah sesuai dengan kondisi yang sebenarnya.",
            "Jika terdapat kesalahan atau ketidaksesuaian dari informasi tersebut, maka menjadi tanggung jawab peminta Jasa Inspeksi sepenuhnya.",
            `Salinan resmi Sertifikat Hasil Inspeksi akan dikirimkan kepada ${dataPenerima.penerima_hasil_nama || "instansi penerima hasil"} sebagai tembusan pelaporan.`,
          ]}
          checkboxLabel="Saya telah membaca, memahami, dan menyetujui seluruh klausul pernyataan di atas dengan penuh tanggung jawab."
        />
      </CardContent>
    </Card>
  )
}

export default Step4PernyataanKonfirmasi
