import React, { useState, useEffect } from "react"
import { ShieldCheck, UserCheck, MapPinHouse } from "lucide-react"
import { AlatKalibrasiItem } from "./FormInformasiAlat"
import { PelaksanaanKalibrasiData } from "./FormPelaksanaanKalibrasi"
import { PelangganData } from "./FormInformasiPelanggan"
import { StepPanel, SectionHeading } from "./WizardUI"

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

  const totalUnitAlat = dataAlat.reduce((acc, a) => acc + (Number(a.jumlah) || 1), 0)

  return (
    <StepPanel
      icon={ShieldCheck}
      title="Pernyataan & Ringkasan Permohonan Kalibrasi"
      description="Periksa kembali seluruh spesifikasi instrumen dan alamat sebelum menandatangani persetujuan pengajuan."
    >
      {/* 1. Ringkasan Pelanggan & Pelaksanaan */}
      <div>
        <SectionHeading
          title="Ringkasan Data Pemohon & Pelaksanaan"
          description="Tinjauan menyeluruh informasi administrasi dan pengiriman sertifikat."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Kiri: Identitas Pemohon */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2 mb-3.5">
              <UserCheck className="w-4 h-4 text-brand-600" />
              Identitas Pemohon
            </h4>

            <div className="space-y-2 text-xs sm:text-[13px]">
              <div className="grid grid-cols-[190px_10px_1fr] items-start py-0.5">
                <span className="text-slate-500 font-medium">Nama Pemohon</span>
                <span className="text-slate-400">:</span>
                <span className="font-bold text-slate-900">
                  {dataPelanggan?.namaPemohon?.trim() || "-"}
                </span>
              </div>

              <div className="grid grid-cols-[190px_10px_1fr] items-start py-0.5">
                <span className="text-slate-500 font-medium">Sertifikat Dibuat Atas Nama</span>
                <span className="text-slate-400">:</span>
                <span className="font-bold text-brand-700">
                  {dataPelanggan?.hasilKalibrasiUntuk?.trim() || "-"}
                </span>
              </div>

              {dataPelanggan?.no_telp && (
                <div className="grid grid-cols-[190px_10px_1fr] items-start py-0.5">
                  <span className="text-slate-500 font-medium">Kontak Telepon / WhatsApp</span>
                  <span className="text-slate-400">:</span>
                  <span className="font-medium text-slate-800 font-mono">
                    {dataPelanggan.no_telp.trim()}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-[190px_10px_1fr] items-start py-0.5">
                <span className="text-slate-500 font-medium">Alamat Domisili Kantor</span>
                <span className="text-slate-400">:</span>
                <span className="text-slate-700 leading-relaxed">
                  {dataPelanggan?.alamatPemohon?.trim() || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Kanan: Pelaksanaan & Pengiriman */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2 mb-3.5">
              <MapPinHouse className="w-4 h-4 text-emerald-600" />
              Pelaksanaan & Tujuan Pengiriman
            </h4>

            <div className="space-y-2 text-xs sm:text-[13px]">
              <div className="grid grid-cols-[190px_10px_1fr] items-start py-0.5">
                <span className="text-slate-500 font-medium">Lokasi Pelaksanaan</span>
                <span className="text-slate-400">:</span>
                <span className="font-bold text-brand-700">
                  {dataPelaksanaan?.lokasi === "Tempat Client"
                    ? "On-Site (Di Lokasi / Fasilitas Klien)"
                    : dataPelaksanaan?.lokasi === "LABKAL BBKKP"
                      ? "Laboratorium Kalibrasi BBKKP (Yogyakarta)"
                      : "-"}
                </span>
              </div>

              <div className="grid grid-cols-[190px_10px_1fr] items-start py-0.5">
                <span className="text-slate-500 font-medium">Bahasa Dokumen Sertifikat</span>
                <span className="text-slate-400">:</span>
                <span className="font-medium text-slate-800">
                  {dataPelaksanaan?.bahasa === "inggris"
                    ? "English"
                    : "Bahasa Indonesia"}
                </span>
              </div>

              <div className="grid grid-cols-[190px_10px_1fr] items-start py-0.5">
                <span className="text-slate-500 font-medium">Penerima & Alamat Kirim Hardcopy</span>
                <span className="text-slate-400">:</span>
                <span className="text-slate-700 leading-relaxed">
                  {(dataPelanggan?.namaKirim || dataPelaksanaan?.namaKirim)
                    ? `${dataPelanggan?.namaKirim || dataPelaksanaan?.namaKirim} — `
                    : ""}
                  {dataPelanggan?.alamatKirim || dataPelaksanaan?.alamatKirim || "-"}
                </span>
              </div>

              {dataPelaksanaan?.uraian && (
                <div className="grid grid-cols-[190px_10px_1fr] items-start py-0.5">
                  <span className="text-slate-500 font-medium">Catatan Khusus Pengujian</span>
                  <span className="text-slate-400">:</span>
                  <span className="text-slate-700 italic">
                    "{dataPelaksanaan.uraian.trim()}"
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Daftar Alat Dikalibrasi */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title={`Daftar Alat Dikalibrasi (${totalUnitAlat} Alat)`}
        />

        <div className="space-y-4">
          {dataAlat.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 rounded-xl border border-slate-200 bg-slate-50/50">
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
                <div
                  key={alat.id || idx}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm"
                >
                  {/* Header Alat */}
                  <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-slate-600 text-sm font-normal">Alat #{idx + 1} | </span>
                      <strong className="text-slate-900 text-sm font-bold">
                        {alat.namaAlat?.trim() || "Nama Alat Belum Diisi"}
                      </strong>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                      Subtotal: <strong className="text-slate-900 font-mono">Rp {subtotal.toLocaleString("id-ID")}</strong>
                    </span>
                  </div>

                  {/* Body Alat */}
                  <div className="p-4 space-y-3.5 text-xs sm:text-[13px]">
                    {/* Baris Spesifikasi Utama */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <small className="text-slate-400 block text-xs font-medium mb-0.5">Merk / Pabrik</small>
                        <span className="text-slate-800 font-semibold">{alat.merk || "-"}</span>
                      </div>
                      <div>
                        <small className="text-slate-400 block text-xs font-medium mb-0.5">Tipe / Model</small>
                        <span className="text-slate-800 font-semibold">{alat.tipeModel || "-"}</span>
                      </div>
                      <div>
                        <small className="text-slate-400 block text-xs font-medium mb-0.5">Jumlah Unit</small>
                        <span className="text-slate-800 font-semibold">{alat.jumlah || 1} Unit</span>
                      </div>
                    </div>

                    {/* Baris Kondisi Alat (Row Baru, Tanpa Badge) */}
                    <div className="pt-2.5 border-t border-slate-100">
                      <small className="text-slate-400 block text-xs font-medium mb-0.5">Kondisi Alat</small>
                      <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                        {alat.kondisi || "-"}
                      </p>
                    </div>

                    {/* Tabel Nomor Seri */}
                    {serials.length > 0 && (
                      <div className="pt-2.5 border-t border-slate-100">
                        <small className="text-slate-500 font-semibold block mb-1.5 text-xs">Nomor Seri:</small>
                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                              <tr>
                                <th className="py-2 px-3 font-bold w-12 text-center border-r border-slate-200">No</th>
                                <th className="py-2 px-3 font-bold">Nomor Seri</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                              {serials.map((sn, sIdx) => (
                                <tr key={sIdx} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-3 text-center border-r border-slate-200 font-mono text-slate-500">
                                    {sIdx + 1}
                                  </td>
                                  <td className="py-2 px-3 font-mono text-slate-800 font-medium">
                                    {sn}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Tabel Parameter Kalibrasi */}
                    {alat.kalibrasiList && alat.kalibrasiList.length > 0 ? (
                      <div className="pt-2.5 border-t border-slate-100">
                        <small className="text-slate-500 font-semibold block mb-1.5 text-xs">Item / Parameter Tarif:</small>
                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                              <tr>
                                <th className="py-2 px-3 font-bold w-12 text-center border-r border-slate-200">No</th>
                                <th className="py-2 px-3 font-bold">Parameter Kalibrasi</th>
                                <th className="py-2 px-3 font-bold text-end w-36 sm:w-44">Tarif</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                              {alat.kalibrasiList.map((kal, kIdx) => (
                                <tr key={kal.id || kIdx} className="hover:bg-slate-50/50">
                                  <td className="py-2 px-3 text-center border-r border-slate-200 font-mono text-slate-500">
                                    {kIdx + 1}
                                  </td>
                                  <td className="py-2 px-3 text-slate-800 font-medium">
                                    {kal.nama} {kal.jumlah > 1 ? <span className="text-slate-400 font-normal">({kal.jumlah}x)</span> : null}
                                  </td>
                                  <td className="py-2 px-3 text-end font-semibold text-slate-800 font-mono">
                                    {(kal.tarifSatuan || 0) === 0 ? (
                                      <span className="text-emerald-700 font-semibold">Rp 0 (Gratis)</span>
                                    ) : (
                                      `Rp ${((kal.tarifSatuan || 0) * (kal.jumlah || 1)).toLocaleString("id-ID")}`
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 italic pt-2 border-t border-slate-100">
                        Belum ada parameter kalibrasi yang dipilih untuk alat ini.
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Flat Grand Total Card */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-none">
          <div>
            <span className="block text-xs font-semibold text-slate-500">Total Estimasi Biaya PNBP</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rp {grandTotalBiaya.toLocaleString("id-ID")}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {dataAlat.length} Alat ({totalUnitAlat} Unit)
          </span>
        </div>
      </div>

      {/* 3. Pernyataan & Ketetapan Sertifikat */}
      <div className="pt-6 border-t border-slate-200">
        <label
          htmlFor="checkbox-setuju-pernyataan"
          className="flex items-start gap-3 cursor-pointer select-none"
        >
          <input
            id="checkbox-setuju-pernyataan"
            type="checkbox"
            checked={setuju}
            onChange={(e) => handleChange(e.target.checked)}
            className="mt-0.5 w-4.5 h-4.5 rounded border-slate-300 text-brand-600 focus:ring-0 shrink-0 cursor-pointer"
          />
          <div className="text-xs sm:text-[13px] leading-relaxed text-slate-700">
            <span className="font-bold text-slate-900 block mb-1">
              PERNYATAAN<span className="text-rose-500">*</span>
            </span>
            Saya menyatakan bahwa seluruh data yang diajukan adalah benar dan valid. Setelah laporan ini diterbitkan, maka saya tidak akan minta diadakannya perubahan pada laporan mengenai tanda-tanda alat maupun alamat peminta kalibrasi
          </div>
        </label>
      </div>
    </StepPanel>
  )
}

export default FormPernyataan
