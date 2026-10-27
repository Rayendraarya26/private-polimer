import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { ShieldCheck, Info, UserCheck, MapPinHouse, Toolbox, CheckCircle2, AlertCircle } from "lucide-react"
import { AlatKalibrasiItem } from "./FormInformasiAlat"
import { PelaksanaanKalibrasiData } from "./FormPelaksanaanKalibrasi"
import { PelangganData } from "./FormInformasiPelanggan"
import { LegalStatementBox } from "../../forms"

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
    <Card className="rounded-2xl border-slate-200/90 shadow-card bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-brand-50/70 via-sky-50/30 to-white pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-600 text-white shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-900 tracking-tight">
              Pernyataan & Ringkasan Permohonan Kalibrasi
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Periksa kembali seluruh spesifikasi instrumen dan alamat sebelum menandatangani persetujuan pengajuan
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-7 space-y-7">
        {/* 1. Ringkasan Pelanggan & Pelaksanaan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card Ringkasan Pelanggan */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
              <UserCheck className="w-4 h-4 text-brand-600" />
              Identitas Pemohon
            </h4>
            <div className="text-xs sm:text-sm space-y-2">
              <div>
                <span className="text-slate-400 block text-xs font-semibold">Nama Pemohon:</span>
                <span className="font-bold text-slate-900">
                  {dataPelanggan?.namaPemohon?.trim() || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-semibold">Sertifikat Dibuat Atas Nama:</span>
                <span className="font-bold text-brand-900">
                  {dataPelanggan?.hasilKalibrasiUntuk?.trim() || "-"}
                </span>
              </div>
              {dataPelanggan?.no_telp && (
                <div>
                  <span className="text-slate-400 block text-xs font-semibold">Kontak Telepon / WhatsApp:</span>
                  <span className="font-medium text-slate-800 font-mono">
                    {dataPelanggan.no_telp.trim()}
                  </span>
                </div>
              )}
              <div>
                <span className="text-slate-400 block text-xs font-semibold">Alamat Domisili Kantor:</span>
                <span className="text-slate-700 leading-relaxed block">
                  {dataPelanggan?.alamatPemohon?.trim() || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Card Ringkasan Pelaksanaan & Pengiriman */}
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
              <MapPinHouse className="w-4 h-4 text-emerald-600" />
              Pelaksanaan & Tujuan Pengiriman
            </h4>
            <div className="text-xs sm:text-sm space-y-2">
              <div>
                <span className="text-slate-400 block text-xs font-semibold">Lokasi Pelaksanaan:</span>
                <span className="font-bold text-brand-700">
                  {dataPelaksanaan?.lokasi === "Tempat Client"
                    ? "On-Site (Di Lokasi / Fasilitas Klien)"
                    : dataPelaksanaan?.lokasi === "LABKAL BBKKP"
                    ? "Laboratorium Kalibrasi BBKKP (Yogyakarta)"
                    : "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-semibold">Bahasa Dokumen Sertifikat:</span>
                <span className="font-medium text-slate-800">
                  {dataPelaksanaan?.bahasa === "inggris" ? "English (Official Certificate)" : "Bahasa Indonesia (LHU Standar SNI/KAN)"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs font-semibold">Penerima & Alamat Kirim Hardcopy:</span>
                <span className="text-slate-700 leading-relaxed block">
                  {(dataPelanggan?.namaKirim || dataPelaksanaan?.namaKirim) ? `${dataPelanggan?.namaKirim || dataPelaksanaan?.namaKirim} — ` : ""}
                  {dataPelanggan?.alamatKirim || dataPelaksanaan?.alamatKirim || "-"}
                </span>
              </div>
              {dataPelaksanaan?.uraian && (
                <div>
                  <span className="text-slate-400 block text-xs font-semibold">Catatan Khusus Pengujian:</span>
                  <span className="text-slate-700 italic block">"{dataPelaksanaan.uraian}"</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Ringkasan Alat & Kalibrasi */}
        <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
          <div className="bg-slate-100/80 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Toolbox className="w-4 h-4 text-brand-600" />
              Rincian Instrumen ({dataAlat.length} Jenis Alat • {totalUnitAlat} Total Unit)
            </h4>
            <span className="text-xs font-black text-brand-700 font-mono">
              Total: {grandTotalBiaya === 0 ? "Rp 0 (Internal BBKKP)" : `Rp ${grandTotalBiaya.toLocaleString("id-ID")}`}
            </span>
          </div>

          <div className="divide-y divide-slate-200 bg-white">
            {dataAlat.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
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
                  <div key={alat.id || idx} className="p-5 space-y-3 hover:bg-slate-50/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                            Alat #{idx + 1}
                          </span>
                          <h5 className="text-sm font-bold text-slate-900">
                            {alat.namaAlat?.trim() || "Nama Alat Belum Diisi"}
                          </h5>
                        </div>
                        <p className="text-xs text-slate-500">
                          Merk: {alat.merk || "-"} | Tipe/Model: {alat.tipeModel || "-"} | Kondisi: {alat.kondisi || "-"} | Jumlah: {alat.jumlah} Unit
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Subtotal Biaya</span>
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          Rp {subtotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Nomor Seri */}
                    {serials.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-slate-400 font-medium">No. Seri:</span>
                        {serials.map((sn, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg text-slate-700 font-mono text-xs"
                          >
                            {sn}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Rincian Parameter Kalibrasi */}
                    {alat.kalibrasiList && alat.kalibrasiList.length > 0 ? (
                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Parameter Pengujian Kalibrasi:
                        </span>
                        <div className="space-y-1">
                          {alat.kalibrasiList.map((kal, kIdx) => (
                            <div
                              key={kal.id || kIdx}
                              className="flex items-center justify-between text-xs text-slate-700"
                            >
                              <span>
                                • {kal.nama} <span className="text-slate-400 font-medium">({kal.jumlah}x)</span>
                              </span>
                              <span className="font-mono font-semibold text-slate-800">
                                {(kal.tarifSatuan || 0) === 0 ? (
                                  <span className="text-emerald-700 font-semibold">Rp 0 (Gratis)</span>
                                ) : (
                                  `Rp ${((kal.tarifSatuan || 0) * (kal.jumlah || 1)).toLocaleString("id-ID")}`
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 italic">
                        Belum ada parameter kalibrasi yang dipilih untuk alat ini.
                      </p>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* 3. Pernyataan & Ketetapan Sertifikat */}
        <LegalStatementBox
          checked={setuju}
          onChange={handleChange}
          title="Pernyataan Keabsahan Data & Ketetapan Sertifikat Kalibrasi"
          badgeText="Akreditasi KAN LK-005-IDN"
          keyPoints={[
            "Data identitas fisik alat (merk, tipe/model, nomor seri) dan alamat resmi pemohon bersifat final setelah sertifikat terbit.",
            "Estimasi biaya mengikuti tarif resmi PNBP kalibrasi yang berlaku di BBSPJIKKP Yogyakarta.",
          ]}
          legalTitle="Baca Ketentuan Penerbitan & Akreditasi KAN Lengkap"
          legalFullText={
            "Setelah sertifikat kalibrasi ini diterbitkan secara sah, pemohon menyatakan dengan sesungguhnya tidak akan meminta diadakannya perubahan data pada laporan mengenai tanda-tanda identitas fisik alat maupun alamat resmi pemohon kalibrasi. Sertifikat kalibrasi yang diterbitkan oleh Laboratorium Kalibrasi BBSPJIKKP telah terakreditasi oleh Komite Akreditasi Nasional (KAN) dengan nomor LK-005-IDN dan merujuk langsung pada data yang telah diverifikasi pada formulir ini."
          }
        />
      </CardContent>
    </Card>
  )
}

export default FormPernyataan
