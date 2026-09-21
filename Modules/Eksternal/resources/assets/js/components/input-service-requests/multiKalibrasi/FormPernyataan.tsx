import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { ShieldCheck, Info, UserCheck, MapPinHouse, Toolbox } from "lucide-react"
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

  // Hitung total estimasi biaya kalibrasi dari seluruh alat
  const grandTotalBiaya = dataAlat.reduce((acc, alat) => {
    const subtotal = (alat.kalibrasiList || []).reduce(
      (kAcc, k) => kAcc + (k.tarifSatuan || 0) * (k.jumlah || 1),
      0
    )
    return acc + subtotal
  }, 0)

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Pernyataan & Ringkasan Permohonan
            </CardTitle>
            <CardDescription>
              Periksa kembali rincian data permohonan kalibrasi sebelum menyetujui pernyataan dan mengirim permohonan
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* 1. Ringkasan Pelanggan & Pelaksanaan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Ringkasan Pelanggan */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <UserCheck className="w-4 h-4 text-brand-600" />
              Informasi Pelanggan
            </h4>
            <div className="text-xs space-y-1.5 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Nama Pemohon / Kontak:</span>
                <span className="font-semibold text-slate-800">
                  {dataPelanggan?.namaPemohon?.trim() || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Sertifikat Dibuat Untuk:</span>
                <span className="font-semibold text-slate-800">
                  {dataPelanggan?.hasilKalibrasiUntuk?.trim() || "-"}
                </span>
              </div>
              {dataPelanggan?.no_telp && (
                <div>
                  <span className="text-slate-500 block text-[11px]">No. Telepon / WhatsApp:</span>
                  <span className="font-medium text-slate-800">
                    {dataPelanggan.no_telp.trim()}
                  </span>
                </div>
              )}
              <div>
                <span className="text-slate-500 block text-[11px]">Alamat Pemohon:</span>
                <span className="text-slate-700">
                  {dataPelanggan?.alamatPemohon?.trim() || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Card Ringkasan Pelaksanaan & Pengiriman */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <MapPinHouse className="w-4 h-4 text-brand-600" />
              Pelaksanaan & Laporan Hasil
            </h4>
            <div className="text-xs space-y-1.5 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">Lokasi Pelaksanaan:</span>
                <span className="font-semibold text-brand-700">
                  {dataPelaksanaan?.lokasi === "Tempat Client"
                    ? "On-Site (Di Lokasi / Tempat Client)"
                    : "Laboratorium Kalibrasi BBKKP"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Bahasa Laporan:</span>
                <span className="font-medium text-slate-800">
                  {dataPelaksanaan?.bahasa === "inggris" ? "English" : "Indonesia"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Penerima & Alamat Kirim:</span>
                <span className="text-slate-700">
                  {dataPelaksanaan?.namaKirim ? `${dataPelaksanaan.namaKirim} - ` : ""}
                  {dataPelaksanaan?.alamatKirim || "-"}
                </span>
              </div>
              {dataPelaksanaan?.uraian && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Catatan Khusus / Uraian:</span>
                  <span className="text-slate-700 italic">"{dataPelaksanaan.uraian}"</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Ringkasan Alat & Kalibrasi */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Toolbox className="w-4 h-4 text-brand-600" />
              Daftar Alat & Layanan Kalibrasi ({dataAlat.length} Alat)
            </h4>
            <span className="text-xs font-bold text-brand-700">
              Total: Rp {grandTotalBiaya.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {dataAlat.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
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
                  <div key={alat.id || idx} className="p-4 bg-white space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200 mb-1">
                          Alat #{idx + 1}
                        </span>
                        <h5 className="text-xs font-bold text-slate-800">
                          {alat.namaAlat?.trim() || "Nama Alat Belum Diisi"}
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          Merek: {alat.merk || "-"} | Tipe/Model: {alat.tipeModel || "-"} | Kondisi: {alat.kondisi || "Baik / Normal"} | Jumlah: {alat.jumlah} Unit
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-[11px] text-slate-500 block">Subtotal Alat:</span>
                        <span className="text-xs font-bold text-slate-900">
                          Rp {subtotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Nomor Seri */}
                    {serials.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-500">No. Seri:</span>
                        {serials.map((sn, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-mono text-[10px]"
                          >
                            {sn}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Rincian Kalibrasi */}
                    {alat.kalibrasiList && alat.kalibrasiList.length > 0 ? (
                      <div className="bg-slate-50/70 rounded-lg p-2.5 border border-slate-200/80 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Jenis Kalibrasi yang Dipilih:
                        </span>
                        <div className="space-y-1">
                          {alat.kalibrasiList.map((kal, kIdx) => (
                            <div
                              key={kal.id || kIdx}
                              className="flex items-center justify-between text-xs text-slate-700"
                            >
                              <span>
                                • {kal.nama} <span className="text-slate-400">({kal.jumlah}x)</span>
                              </span>
                              <span className="font-medium text-slate-800">
                                Rp {((kal.tarifSatuan || 0) * (kal.jumlah || 1)).toLocaleString("id-ID")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-600 italic">
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
        <label className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100/60 cursor-pointer transition-colors">
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
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Setelah laporan ini diterbitkan, maka kami tidak akan minta diadakannya perubahan pada laporan mengenai tanda-tanda alat maupun alamat peminta kalibrasi.
            </p>
          </div>
        </label>

        {/* 4. Informasi Ketentuan Tambahan */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex items-start gap-3">
          <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">
              Ketentuan Penerbitan Sertifikat / Laporan Kalibrasi:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
              <li>Pastikan nomor seri, merek, tipe/model, serta data penanggung biaya yang telah diisikan pada langkah sebelumnya sudah benar dan sesuai fisik instrumen.</li>
              <li>Sertifikat kalibrasi yang diterbitkan oleh Laboratorium Kalibrasi BBSPJIKKP (LK-005-IDN) akan merujuk langsung pada data yang telah diverifikasi dalam formulir ini.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormPernyataan
