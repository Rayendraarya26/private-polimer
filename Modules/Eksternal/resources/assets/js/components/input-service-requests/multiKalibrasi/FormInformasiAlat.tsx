import React, { useState, useEffect, useMemo } from "react"
import { toast } from "react-hot-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { Plus, Trash2, Loader2, Wrench } from "lucide-react"
import { useMasterKalibrasiQuery } from "../../../hooks/queries/useMasterQuery"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import { SearchableSelect } from "../../ui/SearchableSelect"

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
}

export const FormInformasiAlat: React.FC<FormInformasiAlatProps> = ({
  dataAlat,
  onChangeDataAlat,
}) => {
  const { data: masterKalibrasi = [], isLoading: isLoadingMaster } = useMasterKalibrasiQuery()
  const { profile } = useProfileQuery()

  const kalibrasiOptions = useMemo(() => {
    return masterKalibrasi.map((item: any) => ({
      value: String(item.id),
      label: `${item.kalibrasi} (Rp ${Number(item.tarif_satuan || 0).toLocaleString("id-ID")})`,
    }))
  }, [masterKalibrasi])

  const isInternal = Boolean(
    (masterKalibrasi as any)?.is_internal ??
      (profile?.group?.id && profile.group.id !== "c3877540-427b-11ef-9454-0242ac120002")
  )

  const [alatList, setAlatList] = useState<AlatKalibrasiItem[]>(() => {
    if (dataAlat && dataAlat.length > 0) {
      return dataAlat
    }
    return [
      {
        id: "alat-1",
        namaAlat: "",
        merk: "",
        tipeModel: "",
        jumlah: 1,
        nomorSeriList: [""],
        kondisi: "",
        kalibrasiList: [],
      },
    ]
  })

  useEffect(() => {
    if (isInternal) {
      setAlatList((prev) => {
        let changed = false
        const updated = prev.map((alat) => {
          const updatedKalibrasi = alat.kalibrasiList.map((k) => {
            if (k.tarifSatuan !== 0) {
              changed = true
              return { ...k, tarifSatuan: 0 }
            }
            return k
          })
          return { ...alat, kalibrasiList: updatedKalibrasi }
        })
        return changed ? updated : prev
      })
    }
  }, [isInternal])

  const [selectedKalibrasiMap, setSelectedKalibrasiMap] = useState<Record<string, string>>({})

  useEffect(() => {
    if (dataAlat && dataAlat.length > 0) {
      setAlatList(dataAlat)
    } else if (dataAlat && dataAlat.length === 0) {
      setAlatList([
        {
          id: "alat-1",
          namaAlat: "",
          merk: "",
          tipeModel: "",
          jumlah: 1,
          nomorSeriList: [""],
          kondisi: "",
          kalibrasiList: [],
        },
      ])
      setSelectedKalibrasiMap({})
    }
  }, [dataAlat])

  const updateAlatList = (updated: AlatKalibrasiItem[]) => {
    setAlatList(updated)
    if (onChangeDataAlat) {
      onChangeDataAlat(updated)
    }
  }

  const handleTambahAlat = () => {
    const newId = `alat-${Date.now()}`
    const updated = [
      ...alatList,
      {
        id: newId,
        namaAlat: "",
        merk: "",
        tipeModel: "",
        jumlah: 1,
        nomorSeriList: [""],
        kondisi: "",
        kalibrasiList: [],
      },
    ]
    updateAlatList(updated)
  }

  const handleHapusAlat = (alatId: string) => {
    if (alatList.length <= 1) return
    const updated = alatList.filter((a) => a.id !== alatId)
    updateAlatList(updated)
  }

  const handleUpdateAlat = (alatId: string, field: keyof AlatKalibrasiItem, value: any) => {
    const updated = alatList.map((item) => {
      if (item.id !== alatId) return item

      if (field === "jumlah") {
        const newJumlah = Math.max(1, parseInt(value) || 1)
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

        const oldJumlah = item.jumlah
        const updatedKalibrasi = item.kalibrasiList.map((k) => ({
          ...k,
          jumlah: k.jumlah === oldJumlah ? newJumlah : Math.min(newJumlah, Math.max(1, k.jumlah)),
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
    updateAlatList(updated)
  }

  const handleUpdateNomorSeri = (alatId: string, index: number, value: string) => {
    const updated = alatList.map((item) => {
      if (item.id !== alatId) return item
      const updatedSerials = [...item.nomorSeriList]
      updatedSerials[index] = value
      return { ...item, nomorSeriList: updatedSerials }
    })
    updateAlatList(updated)
  }

  const handleTambahKalibrasiKeAlat = (alatId: string) => {
    const selectedMasterId = selectedKalibrasiMap[alatId]
    if (!selectedMasterId) return

    const masterItem = masterKalibrasi.find((m: any) => String(m.id) === String(selectedMasterId))
    if (!masterItem) return

    const updated = alatList.map((alat) => {
      if (alat.id !== alatId) return alat

      const existingIdx = alat.kalibrasiList.findIndex(
        (k) => String(k.masterKalibrasiId) === String(selectedMasterId)
      )

      if (existingIdx > -1) {
        const currentJumlah = alat.kalibrasiList[existingIdx].jumlah
        if (currentJumlah >= alat.jumlah) {
          toast.error(
            `Jumlah kalibrasi "${masterItem.kalibrasi}" sudah mencapai batas maksimal unit alat (${alat.jumlah} unit)`
          )
          return alat
        }
        const updatedList = [...alat.kalibrasiList]
        updatedList[existingIdx].jumlah = Math.min(alat.jumlah, currentJumlah + 1)
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
            tarifSatuan: isInternal ? 0 : Number(masterItem.tarif_satuan || 0),
            jumlah: alat.jumlah,
          },
        ],
      }
    })

    updateAlatList(updated)
    setSelectedKalibrasiMap((prev) => ({ ...prev, [alatId]: "" }))
  }

  const handleUpdateJumlahKalibrasi = (alatId: string, kalibrasiId: string, jumlah: number) => {
    const updated = alatList.map((alat) => {
      if (alat.id !== alatId) return alat
      const maxJumlah = Math.max(1, alat.jumlah)
      const val = Math.min(maxJumlah, Math.max(1, jumlah))
      return {
        ...alat,
        kalibrasiList: alat.kalibrasiList.map((k) =>
          k.id === kalibrasiId ? { ...k, jumlah: val } : k
        ),
      }
    })
    updateAlatList(updated)
  }

  const handleHapusKalibrasiDariAlat = (alatId: string, kalibrasiId: string) => {
    const updated = alatList.map((alat) => {
      if (alat.id !== alatId) return alat
      return {
        ...alat,
        kalibrasiList: alat.kalibrasiList.filter((k) => k.id !== kalibrasiId),
      }
    })
    updateAlatList(updated)
  }

  const grandTotalBiaya = alatList.reduce((accAlat, alat) => {
    const subtotalAlat = alat.kalibrasiList.reduce(
      (accK, k) => accK + k.jumlah * k.tarifSatuan,
      0
    )
    return accAlat + subtotalAlat
  }, 0)

  return (
    <Card className="rounded-xl border-slate-200 shadow-xs">
      <CardHeader className="rounded-t-xl bg-white border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base text-slate-900">
              Data Alat & Jenis Kalibrasi
            </CardTitle>
            <CardDescription>
              Lengkapi spesifikasi alat yang akan dikalibrasi beserta parameter pengujiannya.
            </CardDescription>
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
              <div key={alat.id}>
                {/* Subheader Alat */}
                <div className="bg-slate-50/70 px-6 py-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      Alat #{index + 1}
                      {alat.namaAlat ? ` - ${alat.namaAlat}` : ""}
                      {alat.tipeModel ? ` (${alat.tipeModel})` : ""}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {alat.merk ? `Merk: ${alat.merk} • ` : ""}
                      {alat.jumlah} Unit
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 mr-1.5">Subtotal:</span>
                      <span className="text-xs font-bold text-slate-900">
                        Rp {subtotalAlat.toLocaleString("id-ID")}
                      </span>
                    </div>

                    {alatList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleHapusAlat(alat.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Hapus alat ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* 1. Spesifikasi Alat */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800">
                      Spesifikasi Alat
                    </h4>

                    {/* Baris 1: Nama Alat, Merk, Tipe/Model */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Nama Alat <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Timbangan Analitik"
                          value={alat.namaAlat}
                          onChange={(e) => handleUpdateAlat(alat.id, "namaAlat", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Merk / Buatan <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Ohaus"
                          value={alat.merk}
                          onChange={(e) => handleUpdateAlat(alat.id, "merk", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Tipe / Model <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Pioneer PX"
                          value={alat.tipeModel}
                          onChange={(e) => handleUpdateAlat(alat.id, "tipeModel", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Baris 2: Jumlah Alat & Kondisi Alat */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Jumlah Alat (Unit) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={alat.jumlah}
                          onChange={(e) => handleUpdateAlat(alat.id, "jumlah", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-600 transition-colors"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor={`kondisi-${alat.id}`}
                          className="block text-xs font-medium text-slate-700 mb-1.5"
                        >
                          Kondisi Alat <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Baik / Normal"
                          name={`kondisi-${alat.id}`}
                          id={`kondisi-${alat.id}`}
                          value={alat.kondisi || ""}
                          onChange={(e) => handleUpdateAlat(alat.id, "kondisi", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Nomor Seri Masing-Masing Unit */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-800">
                        Nomor Seri <span className="text-rose-500">*</span>
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Masukkan nomor seri untuk setiap unit alat ({alat.jumlah} unit).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      {alat.nomorSeriList.map((seri, idx) => (
                        <div
                          key={idx}
                          className="flex items-stretch rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-colors"
                        >
                          <span className="inline-flex items-center justify-center bg-slate-50 text-slate-500 text-xs font-medium px-3 border-r border-slate-200 select-none shrink-0">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            placeholder={`No. Seri Unit ${idx + 1}`}
                            value={seri}
                            onChange={(e) => handleUpdateNomorSeri(alat.id, idx, e.target.value)}
                            style={{ border: "none", borderRadius: 0, boxShadow: "none" }}
                            className="w-full border-0 rounded-none bg-transparent px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 shadow-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Pilihan Jenis Kalibrasi */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Jenis Kalibrasi yang Dipilih <span className="text-rose-500">*</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Pilih parameter pengujian kalibrasi untuk {alat.namaAlat || `Alat #${index + 1}`}.
                      </p>
                    </div>

                    {/* Bar Pemilihan Jenis Kalibrasi */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex-1 w-full space-y-1">
                        <label className="block text-[11px] font-medium text-slate-700">
                          Pilih Kalibrasi
                        </label>
                        <SearchableSelect
                          disabled={isLoadingMaster}
                          placeholder={
                            isLoadingMaster
                              ? "Memuat data master..."
                              : `-- Pilih Jenis Kalibrasi untuk ${alat.namaAlat || `Alat #${index + 1}`} --`
                          }
                          searchPlaceholder="Cari jenis kalibrasi atau alat..."
                          options={kalibrasiOptions}
                          value={selectedMasterId}
                          onChange={(val) =>
                            setSelectedKalibrasiMap((prev) => ({
                              ...prev,
                              [alat.id]: String(val),
                            }))
                          }
                          onClear={() =>
                            setSelectedKalibrasiMap((prev) => ({
                              ...prev,
                              [alat.id]: "",
                            }))
                          }
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={() => handleTambahKalibrasiKeAlat(alat.id)}
                        disabled={!selectedMasterId || isLoadingMaster}
                        className="flex items-center justify-center gap-1.5 rounded-lg px-4 h-[40px] text-xs font-semibold shrink-0"
                      >
                        {isLoadingMaster ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        Tambah
                      </Button>
                    </div>

                    {/* Tabel Daftar Kalibrasi */}
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
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
                              <td colSpan={5} className="px-3.5 py-5 text-center text-slate-400">
                                Belum ada jenis kalibrasi yang dipilih untuk alat ini.
                              </td>
                            </tr>
                          ) : (
                            alat.kalibrasiList.map((k) => (
                              <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-3.5 py-2.5 font-medium text-slate-800">
                                  {k.nama}
                                </td>
                                <td className="px-3.5 py-2 text-center">
                                  <input
                                    type="number"
                                    min={1}
                                    max={alat.jumlah}
                                    value={k.jumlah}
                                    onChange={(e) =>
                                      handleUpdateJumlahKalibrasi(
                                        alat.id,
                                        k.id,
                                        parseInt(e.target.value) || 1
                                      )
                                    }
                                    title={`Jumlah kalibrasi untuk ${k.nama} (Maksimal ${alat.jumlah} unit)`}
                                    className="w-16 text-center rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-brand-600"
                                  />
                                </td>
                                <td className="px-3.5 py-2.5 text-right text-slate-600">
                                  {k.tarifSatuan.toLocaleString("id-ID")}
                                </td>
                                <td className="px-3.5 py-2.5 text-right font-semibold text-slate-800">
                                  {(k.jumlah * k.tarifSatuan).toLocaleString("id-ID")}
                                </td>
                                <td className="px-2 py-2.5 text-center">
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
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Card: Tambah Alat & Estimasi Total */}
        <div className="px-6 py-4 bg-slate-50/70 rounded-b-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleTambahAlat}
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold border-slate-300 text-slate-700 hover:bg-white bg-white self-start"
          >
            <Plus className="w-4 h-4" />
            Tambah Alat
          </Button>

          <div className="sm:text-right">
            <span className="text-[11px] font-medium text-slate-500 block">
              Estimasi Total Tarif Kalibrasi
            </span>
            <span className="text-lg font-bold text-slate-900">
              Rp {grandTotalBiaya.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormInformasiAlat
