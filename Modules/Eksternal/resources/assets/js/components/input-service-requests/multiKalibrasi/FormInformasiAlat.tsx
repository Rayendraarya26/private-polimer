import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { Toolbox, Plus, Trash2, Settings, Loader2, Info, Calculator, ShieldCheck } from "lucide-react"
import { useMasterKalibrasiQuery } from "../../../hooks/queries/useMasterQuery"

export interface KalibrasiUjiItem {
  id: string
  masterKalibrasiId: string
  nama: string
  tarifSatuan: number
  jumlah: number
}

export interface AlatKalibrasiItem {
  id: string
  namaAlat: string
  merk: string
  tipeModel: string
  jumlah: number
  nomorSeriList: string[]
  kondisi: string
  kalibrasiList: KalibrasiUjiItem[]
}

export interface FormInformasiAlatProps {
  dataAlat?: AlatKalibrasiItem[]
  onChangeDataAlat?: (alat: AlatKalibrasiItem[]) => void
  lokasiPelaksanaan?: string
  onChangeLokasi?: (lokasi: string) => void
  uraianKalibrasi?: string
  onChangeUraian?: (uraian: string) => void
}

export const FormInformasiAlat: React.FC<FormInformasiAlatProps> = ({
  lokasiPelaksanaan: propLokasi,
  onChangeLokasi,
  uraianKalibrasi: propUraian,
  onChangeUraian,
}) => {
  const { data: masterKalibrasi = [], isLoading: isLoadingMaster } = useMasterKalibrasiQuery()

  // State internal untuk multi-alat
  const [alatList, setAlatList] = useState<AlatKalibrasiItem[]>([
    {
      id: "alat-1",
      namaAlat: "",
      merk: "",
      tipeModel: "",
      jumlah: 1,
      nomorSeriList: [""],
      kondisi: "Baik / Normal",
      kalibrasiList: [],
    },
  ])

  // State untuk dropdown kalibrasi per alat: Record<alatId, selectedMasterId>
  const [selectedKalibrasiMap, setSelectedKalibrasiMap] = useState<Record<string, string>>({})

  // State lokasi & uraian
  const [lokasi, setLokasi] = useState<string>(propLokasi || "LABKAL BBKKP")
  const [uraian, setUraian] = useState<string>(propUraian || "")

  // Handler: Tambah Alat Baru
  const handleTambahAlat = () => {
    const newId = `alat-${Date.now()}`
    setAlatList((prev) => [
      ...prev,
      {
        id: newId,
        namaAlat: "",
        merk: "",
        tipeModel: "",
        jumlah: 1,
        nomorSeriList: [""],
        kondisi: "Baik / Normal",
        kalibrasiList: [],
      },
    ])
  }

  // Handler: Hapus Alat
  const handleHapusAlat = (alatId: string) => {
    if (alatList.length <= 1) return
    setAlatList((prev) => prev.filter((a) => a.id !== alatId))
  }

  // Handler: Update Spesifikasi Alat
  const handleUpdateAlat = (alatId: string, field: keyof AlatKalibrasiItem, value: any) => {
    setAlatList((prev) =>
      prev.map((item) => {
        if (item.id !== alatId) return item

        if (field === "jumlah") {
          const newJumlah = Math.max(1, parseInt(value) || 1)
          // Sinkronisasi ukuran nomorSeriList sesuai jumlah
          const currentSerials = [...item.nomorSeriList]
          let updatedSerials = currentSerials
          if (newJumlah > currentSerials.length) {
            updatedSerials = [
              ...currentSerials,
              ...Array(newJumlah - currentSerials.length).fill(""),
            ]
          } else if (newJumlah < currentSerials.length) {
            updatedSerials = currentSerials.slice(0, newJumlah)
          }

          // Sinkronisasi juga jumlah kalibrasi jika sebelumnya sudah terpilih
          const updatedKalibrasi = item.kalibrasiList.map((k) => ({
            ...k,
            jumlah: newJumlah,
          }))

          return {
            ...item,
            jumlah: newJumlah,
            nomorSeriList: updatedSerials,
            kalibrasiList: updatedKalibrasi,
          }
        }

        return { ...item, [field]: value }
      })
    )
  }

  // Handler: Update Nomor Seri spesifik per unit
  const handleUpdateNomorSeri = (alatId: string, index: number, value: string) => {
    setAlatList((prev) =>
      prev.map((item) => {
        if (item.id !== alatId) return item
        const updatedSerials = [...item.nomorSeriList]
        updatedSerials[index] = value
        return { ...item, nomorSeriList: updatedSerials }
      })
    )
  }

  // Handler: Tambah Jenis Kalibrasi ke Alat Tertentu
  const handleTambahKalibrasiKeAlat = (alatId: string) => {
    const selectedMasterId = selectedKalibrasiMap[alatId]
    if (!selectedMasterId) return

    const masterItem = masterKalibrasi.find((m: any) => m.id === selectedMasterId)
    if (!masterItem) return

    setAlatList((prev) =>
      prev.map((alat) => {
        if (alat.id !== alatId) return alat

        // Cek apakah jenis kalibrasi ini sudah ditambahkan pada alat ini
        const existingIdx = alat.kalibrasiList.findIndex(
          (k) => k.masterKalibrasiId === selectedMasterId
        )

        if (existingIdx > -1) {
          const updatedList = [...alat.kalibrasiList]
          updatedList[existingIdx].jumlah += 1
          return { ...alat, kalibrasiList: updatedList }
        }

        return {
          ...alat,
          kalibrasiList: [
            ...alat.kalibrasiList,
            {
              id: `${alatId}-kal-${Date.now()}`,
              masterKalibrasiId: masterItem.id,
              nama: masterItem.kalibrasi,
              tarifSatuan: Number(masterItem.tarif_satuan || 0),
              jumlah: alat.jumlah, // default mengikuti jumlah alat
            },
          ],
        }
      })
    )

    // Reset dropdown pilihan kalibrasi untuk alat ini
    setSelectedKalibrasiMap((prev) => ({ ...prev, [alatId]: "" }))
  }

  // Handler: Ubah jumlah pengujian kalibrasi
  const handleUpdateJumlahKalibrasi = (alatId: string, kalibrasiId: string, jumlah: number) => {
    const val = Math.max(1, jumlah)
    setAlatList((prev) =>
      prev.map((alat) => {
        if (alat.id !== alatId) return alat
        return {
          ...alat,
          kalibrasiList: alat.kalibrasiList.map((k) =>
            k.id === kalibrasiId ? { ...k, jumlah: val } : k
          ),
        }
      })
    )
  }

  // Handler: Hapus jenis kalibrasi dari alat
  const handleHapusKalibrasiDariAlat = (alatId: string, kalibrasiId: string) => {
    setAlatList((prev) =>
      prev.map((alat) => {
        if (alat.id !== alatId) return alat
        return {
          ...alat,
          kalibrasiList: alat.kalibrasiList.filter((k) => k.id !== kalibrasiId),
        }
      })
    )
  }

  // Hitung total keseluruhan
  const grandTotalBiaya = alatList.reduce((accAlat, alat) => {
    const subtotalAlat = alat.kalibrasiList.reduce(
      (accK, k) => accK + k.jumlah * k.tarifSatuan,
      0
    )
    return accAlat + subtotalAlat
  }, 0)

  const totalSemuaUnit = alatList.reduce((acc, a) => acc + (a.jumlah || 0), 0)

  return (
    <div className="space-y-6">
      <Card className="border-brand-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                <Toolbox className="w-4 h-4 text-brand-600" />
                Data Alat & Jenis Kalibrasi
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-200">
          <div className="divide-y divide-slate-200">
            {alatList.map((alat, index) => {
              const subtotalAlat = alat.kalibrasiList.reduce(
                (acc, k) => acc + k.jumlah * k.tarifSatuan,
                0
              )
              const selectedMasterId = selectedKalibrasiMap[alat.id] || ""

              return (
                <div key={alat.id} className="bg-white">
                  {/* Header Kartu Alat - Full Width */}
                  <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {alat.namaAlat ? alat.namaAlat : `Alat #${index + 1}`}
                      {alat.tipeModel && <span className="text-slate-500 font-normal"> ({alat.tipeModel})</span>}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {alat.merk ? `Merk: ${alat.merk}` : "Spesifikasi Alat"} • {alat.jumlah} Unit
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Subtotal Biaya
                    </span>
                    <span className="text-xs font-bold text-brand-700">
                      Rp {subtotalAlat.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {alatList.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleHapusAlat(alat.id)}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg h-auto"
                      title="Hapus alat ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* 1. Spesifikasi Alat */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                    Informasi Spesifikasi Alat
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nama Alat */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Nama Alat <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Timbangan"
                        value={alat.namaAlat}
                        onChange={(e) => handleUpdateAlat(alat.id, "namaAlat", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                      />
                    </div>

                    {/* Merk/Buatan */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Merk/Buatan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Ohaus"
                        value={alat.merk}
                        onChange={(e) => handleUpdateAlat(alat.id, "merk", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                      />
                    </div>

                    {/* Tipe/Model */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Tipe/Model <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Model A / Pioneer PX"
                        value={alat.tipeModel}
                        onChange={(e) => handleUpdateAlat(alat.id, "tipeModel", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                      />
                    </div>

                    {/* Banyaknya Alat (Jumlah) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Jumlah Alat (Unit) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={alat.jumlah}
                        onChange={(e) => handleUpdateAlat(alat.id, "jumlah", e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Nomor Seri Masing-Masing Unit */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Nomor Seri<span className="text-rose-500">*</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-1.5">
                    Masukkan no. seri untuk setiap unit alat
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {alat.nomorSeriList.map((seri, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-slate-500 min-w-[24px] text-center">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          placeholder={`No. Seri Unit ke-${idx + 1}`}
                          value={seri}
                          onChange={(e) => handleUpdateNomorSeri(alat.id, idx, e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Pilihan Jenis Kalibrasi Khusus untuk Alat Ini */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        Jenis Kalibrasi yang Dipilih untuk {alat.namaAlat || `Alat #${index + 1}`}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Pilih jenis pengujian kalibrasi untuk alat ini
                      </p>
                    </div>
                  </div>

                  {/* Dropdown Pemilihan Jenis Kalibrasi */}
                  <div className="flex flex-col sm:flex-row items-end gap-2.5 p-3.5 bg-brand-50/40 rounded-xl border border-brand-100">
                    <div className="flex-1 w-full space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Pilih Kalibrasi
                      </label>
                      <select
                        value={selectedMasterId}
                        onChange={(e) =>
                          setSelectedKalibrasiMap((prev) => ({
                            ...prev,
                            [alat.id]: e.target.value,
                          }))
                        }
                        disabled={isLoadingMaster}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
                      >
                        <option value="">
                          {isLoadingMaster
                            ? "Memuat data master..."
                            : `-- Pilih Jenis Kalibrasi untuk ${alat.namaAlat || `Alat #${index + 1}`} --`}
                        </option>
                        {masterKalibrasi.map((item: any) => (
                          <option key={item.id} value={item.id}>
                            {item.kalibrasi} — Rp {Number(item.tarif_satuan || 0).toLocaleString("id-ID")}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleTambahKalibrasiKeAlat(alat.id)}
                      disabled={!selectedMasterId || isLoadingMaster}
                      className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shrink-0"
                    >
                      {isLoadingMaster ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      Terapkan Kalibrasi
                    </Button>
                  </div>

                  {/* Tabel Daftar Kalibrasi untuk Alat Ini */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 divide-x divide-slate-200">
                          <th className="px-3.5 py-2.5 w-[50%]">Jenis Kalibrasi</th>
                          <th className="px-3.5 py-2.5 w-[15%] text-center">Jumlah</th>
                          <th className="px-3.5 py-2.5 w-[15%] text-right">Tarif Satuan (Rp)</th>
                          <th className="px-3.5 py-2.5 w-[15%] text-right">Subtotal (Rp)</th>
                          <th className="px-2 py-2.5 w-[5%] text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {alat.kalibrasiList.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-3.5 py-6 text-center text-slate-400 font-medium">
                              Belum ada jenis kalibrasi yang dipilih untuk alat ini. Silakan pilih dari dropdown di atas.
                            </td>
                          </tr>
                        ) : (
                          alat.kalibrasiList.map((k) => (
                            <tr key={k.id} className="divide-x divide-slate-200 hover:bg-slate-50/50 transition-colors">
                              <td className="px-3.5 py-2 font-medium text-slate-800">
                                {k.nama}
                              </td>
                              <td className="px-3.5 py-2 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  value={k.jumlah}
                                  onChange={(e) =>
                                    handleUpdateJumlahKalibrasi(
                                      alat.id,
                                      k.id,
                                      parseInt(e.target.value) || 1
                                    )
                                  }
                                  className="w-16 text-center rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-brand-500"
                                />
                              </td>
                              <td className="px-3.5 py-2 text-right text-slate-600">
                                {k.tarifSatuan.toLocaleString("id-ID")}
                              </td>
                              <td className="px-3.5 py-2 text-right font-bold text-slate-800">
                                {(k.jumlah * k.tarifSatuan).toLocaleString("id-ID")}
                              </td>
                              <td className="px-2 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleHapusKalibrasiDariAlat(alat.id, k.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                  title="Hapus jenis kalibrasi"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                        {alat.kalibrasiList.length > 0 && (
                          <tr className="bg-slate-50/80 font-bold border-t border-slate-200 divide-x divide-slate-200">
                            <td colSpan={3} className="px-3.5 py-2 text-slate-700 text-right">
                              Subtotal Alat #{index + 1}:
                            </td>
                            <td className="px-3.5 py-2 text-right text-brand-700">
                              Rp {subtotalAlat.toLocaleString("id-ID")}
                            </td>
                            <td></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tombol Tambah Alat Baru (di dalam Card) */}
      <div className="flex justify-center p-4 bg-slate-50/50 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={handleTambahAlat}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold border-brand-300 text-brand-700 hover:bg-brand-50 hover:border-brand-400 shadow-xs bg-white"
        >
          <Plus className="w-4 h-4" />
          Tambah Alat
        </Button>
      </div>
    </CardContent>
  </Card>

      {/* Informasi Umum & Lokasi Pelaksanaan */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="bg-slate-50/70 pb-3">
          <CardTitle className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-brand-600" />
            Lokasi Pelaksanaan & Uraian Kalibrasi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          {/* Lokasi Pelaksanaan */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Lokasi Pelaksanaan Kalibrasi <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${lokasi === "LABKAL BBKKP"
                  ? "bg-brand-50/70 border-brand-400 ring-2 ring-brand-500/20"
                  : "border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <input
                  type="radio"
                  name="lokasi_pelaksanaan"
                  value="LABKAL BBKKP"
                  checked={lokasi === "LABKAL BBKKP"}
                  onChange={(e) => {
                    setLokasi(e.target.value)
                    if (onChangeLokasi) onChangeLokasi(e.target.value)
                  }}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Laboratorium Kalibrasi BBKKP
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Alat diantar atau dikirimkan ke laboratorium BBSPJIKKP
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${lokasi === "Tempat Client"
                  ? "bg-brand-50/70 border-brand-400 ring-2 ring-brand-500/20"
                  : "border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <input
                  type="radio"
                  name="lokasi_pelaksanaan"
                  value="Tempat Client"
                  checked={lokasi === "Tempat Client"}
                  onChange={(e) => {
                    setLokasi(e.target.value)
                    if (onChangeLokasi) onChangeLokasi(e.target.value)
                  }}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    On-Site (Di Lokasi / Pabrik Klien)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Petugas teknis kalibrasi melakukan kalibrasi di fasilitas pelanggan
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Uraian Kalibrasi Yang Dikehendaki */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Uraian Kalibrasi / Catatan Khusus Yang Dikehendaki
            </label>
            <textarea
              rows={2}
              placeholder="Masukkan instruksi khusus, rentang ukur tertentu, atau titik uji yang diinginkan (opsional)..."
              value={uraian}
              onChange={(e) => {
                setUraian(e.target.value)
                if (onChangeUraian) onChangeUraian(e.target.value)
              }}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ringkasan Total Estimasi Biaya */}
      <div className="bg-gradient-to-r from-brand-900 to-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold text-brand-200 tracking-wider uppercase block">
            Estimasi Total Tarif Kalibrasi
          </span>
          <h3 className="text-xl font-black tracking-tight text-white mt-0.5">
            Rp {grandTotalBiaya.toLocaleString("id-ID")}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default FormInformasiAlat
