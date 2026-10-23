import React, { useState, useEffect } from "react"
import { FileCheck } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { AlatKalibrasiItem } from "./FormInformasiAlat"
import { PelaksanaanKalibrasiData } from "./FormPelaksanaanKalibrasi"
import { PelangganData } from "./FormInformasiPelanggan"

export interface FormPernyataanProps {
  dataAlat?: AlatKalibrasiItem[]
  dataPelaksanaan?: PelaksanaanKalibrasiData
  dataPelanggan?: PelangganData
  setujuPernyataan?: boolean
  onChangePernyataan?: (setuju: boolean) => void
}

export const FormPernyataan: React.FC<FormPernyataanProps> = ({
  dataAlat = [],
  dataPelaksanaan,
  dataPelanggan,
  setujuPernyataan: propPernyataan,
  onChangePernyataan,
}) => {
  const [setuju, setSetuju] = useState<boolean>(propPernyataan ?? false)

  useEffect(() => {
    if (propPernyataan !== undefined) {
      setSetuju(propPernyataan)
    }
  }, [propPernyataan])

  const handleChange = (val: boolean) => {
    setSetuju(val)
    if (onChangePernyataan) onChangePernyataan(val)
  }

  const grandTotalBiaya = dataAlat.reduce((acc, alat) => {
    const subtotal = (alat.kalibrasiList || []).reduce(
      (kAcc, k) => kAcc + (k.tarifSatuan || 0) * (k.jumlah || 1),
      0
    )
    return acc + subtotal
  }, 0)

  return (
    <Card className="rounded-xl border-slate-200 shadow-xs overflow-hidden">
      <CardHeader className="rounded-t-xl bg-white border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base text-slate-900">
              Pernyataan & Ringkasan Permohonan
            </CardTitle>
            <CardDescription>
              Periksa kembali rincian data permohonan kalibrasi sebelum menyetujui pernyataan dan mengirim permohonan.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* 1. Ringkasan Pelanggan & Pelaksanaan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
              Informasi Pelanggan
            </h4>
            <div className="text-xs space-y-2 pt-0.5">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Nama Pemohon</span>
                <span className="col-span-2 font-semibold text-slate-800">
                  {dataPelanggan?.namaPemohon?.trim() || "-"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Sertifikat Untuk</span>
                <span className="col-span-2 font-semibold text-slate-800">
                  {dataPelanggan?.hasilKalibrasiUntuk?.trim() || "-"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">No. Telepon</span>
                <span className="col-span-2 text-slate-800">
                  {dataPelanggan?.no_telp?.trim() || "-"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Alamat Pemohon</span>
                <span className="col-span-2 text-slate-700">
                  {dataPelanggan?.alamatPemohon?.trim() || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
              Pelaksanaan & Pengiriman Laporan
            </h4>
            <div className="text-xs space-y-2 pt-0.5">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Lokasi Kalibrasi</span>
                <span className="col-span-2 font-semibold text-slate-800">
                  {dataPelaksanaan?.lokasi === "Tempat Client"
                    ? "On-Site (Di Lokasi Klien)"
                    : dataPelaksanaan?.lokasi === "LABKAL BBKKP"
                      ? "Laboratorium Kalibrasi BBKKP"
                      : "-"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Bahasa Laporan</span>
                <span className="col-span-2 text-slate-800">
                  {dataPelaksanaan?.bahasa === "inggris" ? "English" : "Indonesia"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-slate-500">Tujuan Kirim</span>
                <span className="col-span-2 text-slate-700">
                  {dataPelanggan?.namaKirim || dataPelaksanaan?.namaKirim
                    ? `${dataPelanggan?.namaKirim || dataPelaksanaan?.namaKirim} - `
                    : ""}
                  {dataPelanggan?.alamatKirim || dataPelaksanaan?.alamatKirim || "-"}
                </span>
              </div>
              {dataPelaksanaan?.uraian && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-slate-500">Catatan Khusus</span>
                  <span className="col-span-2 text-slate-700">
                    {dataPelaksanaan.uraian}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Ringkasan Alat & Kalibrasi */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800">
              Daftar Alat & Layanan Kalibrasi ({dataAlat.length} Alat)
            </h4>
            <span className="text-xs font-bold text-slate-900">
              Total: {grandTotalBiaya === 0 ? "Rp 0" : `Rp ${grandTotalBiaya.toLocaleString("id-ID")}`}
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {dataAlat.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                Belum ada data alat yang ditambahkan.
              </div>
            ) : (
              dataAlat.map((alat, idx) => {
                const subtotal = (alat.kalibrasiList || []).reduce(
                  (kAcc, k) => kAcc + (k.tarifSatuan || 0) * (k.jumlah || 1),
                  0
                )
                const serials = (alat.nomorSeriList || []).filter(Boolean)

                return (
                  <div key={alat.id || idx} className="p-4 bg-white space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">
                          {idx + 1}. {alat.namaAlat?.trim() || "Nama Alat Belum Diisi"}
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          Merk: {alat.merk || "-"} • Tipe/Model: {alat.tipeModel || "-"} • Kondisi: {alat.kondisi || "-"} • Jumlah: {alat.jumlah} Unit
                          {serials.length > 0 ? ` • No. Seri: ${serials.join(", ")}` : ""}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-xs font-semibold text-slate-900">
                          Rp {subtotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {alat.kalibrasiList && alat.kalibrasiList.length > 0 ? (
                      <div className="bg-slate-50/70 rounded-md p-2.5 border border-slate-200/80 space-y-1">
                        {alat.kalibrasiList.map((kal, kIdx) => (
                          <div
                            key={kal.id || kIdx}
                            className="flex items-center justify-between text-xs text-slate-700"
                          >
                            <span>
                              - {kal.nama} ({kal.jumlah}x)
                            </span>
                            <span className="font-medium text-slate-800">
                              Rp {((kal.tarifSatuan || 0) * (kal.jumlah || 1)).toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400">
                        Belum ada parameter kalibrasi yang dipilih untuk alat ini.
                      </p>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* 3. Box Pernyataan Utama */}
        <label className="flex items-start gap-3 p-4 rounded-lg bg-slate-50/70 border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={setuju}
            onChange={(e) => handleChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 shrink-0 cursor-pointer"
          />
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">
              Pernyataan Keabsahan Data & Ketetapan Laporan <span className="text-rose-500">*</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Setelah laporan ini diterbitkan, maka kami tidak akan meminta diadakannya perubahan pada laporan mengenai tanda-tanda alat maupun alamat peminta kalibrasi.
            </p>
          </div>
        </label>

        {/* 4. Informasi Ketentuan Tambahan */}
        <div className="p-4 rounded-lg bg-slate-50/50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800">
            Ketentuan Penerbitan Sertifikat / Laporan Kalibrasi:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
            <li>
              Pastikan nomor seri, merek, tipe/model, serta data penanggung biaya yang telah diisikan pada langkah sebelumnya sudah benar dan sesuai fisik instrumen.
            </li>
            <li>
              Sertifikat kalibrasi yang diterbitkan oleh Laboratorium Kalibrasi BBSPJIKKP (LK-005-IDN) akan merujuk langsung pada data yang telah diverifikasi dalam formulir ini.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormPernyataan
