import React from "react"
import {
  ShieldCheck,
  PackageCheck,
  Building2,
} from "lucide-react"
import { InspeksiFormData } from "../../../types/inspeksi"
import { DropzoneUploader } from "../../forms"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  SummaryRow,
} from "../common"

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
    <StepPanel
      icon={ShieldCheck}
      title="Berkas Surat Permohonan & Pernyataan Integritas"
      description="Periksa kembali rincian data permohonan inspeksi sebelum menyetujui pernyataan dan mengirim pengajuan."
    >
      {/* 1. Upload Berkas Surat Permohonan */}
      <div>
        <SectionHeading
          title="Unggah Surat Permohonan / Pengantar Resmi"
          description="Lampirkan scan dokumen surat permohonan resmi bertanda tangan dan berstempel instansi/perusahaan."
          required
        />

        <div className="space-y-2">
          <FieldLabel required>Scan Surat Permintaan Resmi</FieldLabel>
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
            helperText="Format berkas PDF, JPG, atau PNG (Maksimal 10 MB)"
          />
        </div>
      </div>

      {/* 2. Ringkasan Data Permohonan */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Ringkasan Data Permohonan Inspeksi"
          description="Tinjau kesesuaian rincian spesifikasi karung, penerima laporan, dan entitas penanggung biaya."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Kolom Kiri: Spesifikasi Karung */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2 mb-3.5">
              <PackageCheck className="w-4 h-4 text-brand-600" />
              Objek & Spesifikasi Inspeksi
            </h4>

            <div className="space-y-2">
              <SummaryRow
                label="Jenis Inspeksi"
                value={
                  <span className="uppercase font-bold text-brand-700">
                    {dataSpesifikasi.jenis_inspeksi.join(" & ") || "-"}
                  </span>
                }
              />
              <SummaryRow
                label="Nama Komoditas"
                value={dataSpesifikasi.komoditas || "-"}
              />
              <SummaryRow
                label="Kapasitas Karung"
                value={dataSpesifikasi.kapasitas_karung || "-"}
              />
              <SummaryRow
                label="Jumlah Partai / Lot"
                value={`${dataSpesifikasi.jumlah_partai_lot || 1} Partai / Lot`}
              />
              <SummaryRow
                label="Bahasa Laporan"
                value={
                  dataPelaksanaan.bahasa_laporan === "inggris"
                    ? "English (Internasional)"
                    : "Bahasa Indonesia (Standar Nasional)"
                }
              />
              {dataSpesifikasi.spesifikasi_dimensi && (
                <SummaryRow
                  label="Rincian Spesifikasi"
                  value={
                    <span className="text-slate-600 italic">
                      "{dataSpesifikasi.spesifikasi_dimensi}"
                    </span>
                  }
                />
              )}
            </div>
          </div>

          {/* Kolom Kanan: Pelaksanaan & Penanggung Biaya */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2 mb-3.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Pelaksanaan & Pihak Terkait
            </h4>

            <div className="space-y-2">
              <SummaryRow
                label="Rencana Pelaksanaan"
                value={dataPelaksanaan.tgl_rencana_inspeksi || "-"}
              />
              <SummaryRow
                label="Hasil Dibuat Untuk"
                value={dataPenerima.penerima_hasil_nama || "-"}
                highlight
              />
              <SummaryRow
                label="Penanggung Biaya"
                value={dataBiaya.biaya_nama || "-"}
              />
              <SummaryRow
                label="Personel PIC"
                value={
                  dataPic.pemohon_pic_nama
                    ? `${dataPic.pemohon_pic_nama} (${dataPic.pemohon_pic_kontak || "-"})`
                    : "-"
                }
              />
              <SummaryRow
                label="Lokasi Gudang / Pabrik"
                value={
                  <span className="text-slate-700 leading-relaxed block">
                    {dataPelaksanaan.lokasi_inspeksi || "-"}
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Klausul Pernyataan Pemohon */}
      <div className="pt-6 border-t border-slate-200">
        <label
          htmlFor="checkbox-setuju-pernyataan"
          className="flex items-start gap-3 cursor-pointer select-none"
        >
          <input
            id="checkbox-setuju-pernyataan"
            type="checkbox"
            checked={setujuPernyataan}
            onChange={(e) => onChangePernyataan(e.target.checked)}
            className="mt-0.5 w-4.5 h-4.5 rounded border-slate-300 text-brand-600 focus:ring-0 shrink-0 cursor-pointer"
          />
          <div className="text-xs sm:text-[13px] leading-relaxed text-slate-700">
            <span className="font-bold text-slate-900 block mb-1">
              PERNYATAAN PEMOHON JASA INSPEKSI<span className="text-rose-500">*</span>
            </span>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 mb-2">
              <li>
                Seluruh data dan informasi spesifikasi yang disampaikan dalam formulir ini adalah benar, sah, dan sesuai kondisi riil di lapangan.
              </li>
              <li>
                Jika terdapat kekeliruan atau ketidaksesuaian data objek inspeksi, maka sepenuhnya menjadi tanggung jawab peminta Jasa Inspeksi.
              </li>
              <li>
                Salinan resmi Sertifikat Hasil Inspeksi akan dikirimkan kepada{" "}
                <strong className="text-slate-900">
                  {dataPenerima.penerima_hasil_nama || "instansi penerima hasil"}
                </strong>{" "}
                sebagai tembusan pelaporan.
              </li>
            </ul>
            <span className="text-slate-800 font-medium">
              Saya telah membaca, memahami, dan menyetujui seluruh klausul pernyataan di atas dengan penuh tanggung jawab.
            </span>
          </div>
        </label>
      </div>
    </StepPanel>
  )
}

export default Step4PernyataanKonfirmasi
