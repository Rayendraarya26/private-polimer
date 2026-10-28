import React, { useState, useEffect, useMemo } from "react"
import { toast } from "react-hot-toast"
import { Button } from "../../ui/Button"
import {
  Toolbox,
  Plus,
  Trash2,
  Loader2,
  Tag,
} from "lucide-react"
import { useMasterKalibrasiQuery } from "../../../hooks/queries/useMasterQuery"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import { TwoRowSelect } from "../../ui/TwoRowSelect"
import {
  StepPanel,
  FieldLabel,
  FieldHint,
  QuantityStepper,
  inputClass,
  cx,
} from "./WizardUI"

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
      label: item.kalibrasi,
      subLabel: `Tarif: Rp ${Number(item.tarif_satuan || 0).toLocaleString("id-ID")}`,
    }))
  }, [masterKalibrasi])

  const isInternal = Boolean(
    (masterKalibrasi as any)?.is_internal ??
    (profile?.group?.id && profile.group.id !== "c3877540-427b-11ef-9454-0242ac120002")
  )

  // State internal untuk multi-alat
  const [alatList, setAlatList] = useState<AlatKalibrasiItem[]>(() => {
    if (dataAlat && dataAlat.length > 0) {
      return dataAlat
    }
    return [
      {
        id: `alat-${Date.now()}`,
        namaAlat: "",
        merk: "",
        tipeModel: "",
        jumlah: 1,
        nomorSeriList: [""],
        kondisi: "Baik / Normal",
        kalibrasiList: [],
      },
    ]
  })

  const [selectedKalibrasiMap, setSelectedKalibrasiMap] = useState<Record<string, string>>({})

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

  useEffect(() => {
    if (dataAlat && dataAlat.length > 0) {
      setAlatList(dataAlat)
    } else if (dataAlat && dataAlat.length === 0) {
      setAlatList([
        {
          id: `alat-${Date.now()}`,
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
  }, [dataAlat])

  const updateAlatList = (updated: AlatKalibrasiItem[]) => {
    setAlatList(updated)
    if (onChangeDataAlat) {
      onChangeDataAlat(updated)
    }
  }

  // Handler: Tambah Alat Baru
  const handleTambahAlat = () => {
    const newAlat: AlatKalibrasiItem = {
      id: `alat-${Date.now()}`,
      namaAlat: "",
      merk: "",
      tipeModel: "",
      jumlah: 1,
      nomorSeriList: [""],
      kondisi: "Baik / Normal",
      kalibrasiList: [],
    }
    const updated = [...alatList, newAlat]
    updateAlatList(updated)
    toast.success("Instrumen alat baru berhasil ditambahkan")
  }


  // Handler: Hapus Alat
  const handleHapusAlat = (alatId: string, index: number) => {
    if (alatList.length <= 1) {
      toast.error("Minimal harus mendaftarkan 1 instrumen alat untuk dikalibrasi")
      return
    }
    const updated = alatList.filter((item) => item.id !== alatId)
    updateAlatList(updated)
    toast.success(`Alat #${index + 1} berhasil dihapus`)
  }

  // Handler: Update field spesifikasi alat
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

  // Handler: Update Nomor Seri spesifik per unit
  const handleUpdateNomorSeri = (alatId: string, index: number, value: string) => {
    const updated = alatList.map((item) => {
      if (item.id !== alatId) return item
      const updatedSerials = [...item.nomorSeriList]
      updatedSerials[index] = value
      return { ...item, nomorSeriList: updatedSerials }
    })
    updateAlatList(updated)
  }

  // Handler: Tambahkan Jenis Kalibrasi ke Alat Tertentu
  const handleTambahKalibrasiKeAlat = (alatId: string) => {
    const selectedMasterId = selectedKalibrasiMap[alatId]
    if (!selectedMasterId) return

    const masterItem = masterKalibrasi.find((m: any) => m.id === selectedMasterId)
    if (!masterItem) return

    const updated = alatList.map((alat) => {
      if (alat.id !== alatId) return alat

      const existingIdx = alat.kalibrasiList.findIndex(
        (k) => k.masterKalibrasiId === selectedMasterId
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

  // Handler: Ubah jumlah pengujian kalibrasi
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

  // Handler: Hapus jenis kalibrasi dari alat
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

  // Hitung total keseluruhan
  const grandTotalBiaya = useMemo(() => {
    return alatList.reduce((accAlat, alat) => {
      const subtotalAlat = (alat.kalibrasiList || []).reduce(
        (accK, k) => accK + k.jumlah * k.tarifSatuan,
        0
      )
      return accAlat + subtotalAlat
    }, 0)
  }, [alatList])

  // Total unit alat
  const totalUnitAlat = useMemo(() => {
    return alatList.reduce((acc, a) => acc + (Number(a.jumlah) || 1), 0)
  }, [alatList])

  return (
    <StepPanel
      icon={Toolbox}
      title="Daftar Alat & Parameter Kalibrasi"
      description="Daftarkan instrumen ukur yang akan dikalibrasi, tentukan nomor seri, dan pilih parameter pengujiannya."
      flush
    >
      {/* Daftar Instrumen / Alat dalam 1 Card */}
      <div className="divide-y divide-slate-200">
        {alatList.map((alat, index) => {
          const selectedMasterId = selectedKalibrasiMap[alat.id] || ""
          const subtotal = (alat.kalibrasiList || []).reduce(
            (acc, k) => acc + k.jumlah * k.tarifSatuan,
            0
          )
          const isOdd = index % 2 === 1

          return (
            <div
              key={alat.id}
              className={cx(
                "p-5 sm:p-7 space-y-6 transition-colors",
                isOdd ? "bg-slate-50/75" : "bg-white"
              )}
            >
              {/* Header Alat */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {alat.namaAlat?.trim() || `Instrumen / Alat #${index + 1}`}
                  </h3>
                  {alat.tipeModel && (
                    <span className="text-xs text-slate-500 hidden sm:inline truncate">
                      ({alat.tipeModel})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-brand-700 font-mono">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                  {alatList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleHapusAlat(alat.id, index)}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 hover:underline cursor-pointer"
                      title="Hapus instrumen ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 1. Spesifikasi Alat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor={`nama-alat-${alat.id}`} required>
                    Nama Alat
                  </FieldLabel>
                  <input
                    id={`nama-alat-${alat.id}`}
                    type="text"
                    className={inputClass}
                    placeholder="Contoh: Timbangan Analitik"
                    value={alat.namaAlat}
                    onChange={(e) => handleUpdateAlat(alat.id, "namaAlat", e.target.value)}
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`merk-alat-${alat.id}`} required>
                    Merk
                  </FieldLabel>
                  <input
                    id={`merk-alat-${alat.id}`}
                    type="text"
                    className={inputClass}
                    placeholder="Contoh: Ohaus / Mitutoyo"
                    value={alat.merk}
                    onChange={(e) => handleUpdateAlat(alat.id, "merk", e.target.value)}
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`tipe-alat-${alat.id}`} required>
                    Tipe / Model
                  </FieldLabel>
                  <input
                    id={`tipe-alat-${alat.id}`}
                    type="text"
                    className={inputClass}
                    placeholder="Contoh: Pioneer PX224"
                    value={alat.tipeModel}
                    onChange={(e) => handleUpdateAlat(alat.id, "tipeModel", e.target.value)}
                  />
                </div>

                <div>
                  <FieldLabel htmlFor={`jumlah-alat-${alat.id}`} required>
                    Jumlah Alat
                  </FieldLabel>
                  <input
                    id={`jumlah-alat-${alat.id}`}
                    type="number"
                    min={1}
                    className={inputClass}
                    value={alat.jumlah}
                    onChange={(e) => handleUpdateAlat(alat.id, "jumlah", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <FieldLabel htmlFor={`kondisi-alat-${alat.id}`} required>
                    Kondisi Alat
                  </FieldLabel>
                  <input
                    id={`kondisi-alat-${alat.id}`}
                    type="text"
                    className={inputClass}
                    placeholder="Contoh: Baik / Normal / Bersih dengan adaptor daya"
                    value={alat.kondisi}
                    onChange={(e) => handleUpdateAlat(alat.id, "kondisi", e.target.value)}
                  />
                </div>
              </div>

              {/* 2. Nomor Seri Masing-Masing Unit */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor={`nomor-seri-alat-${alat.id}`}
                    required
                  >
                    Nomor Seri Masing-Masing Alat
                  </FieldLabel>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {alat.nomorSeriList.map((seri, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        #{sIdx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder={`No. Seri Unit ke-${sIdx + 1}`}
                        value={seri}
                        onChange={(e) => handleUpdateNomorSeri(alat.id, sIdx, e.target.value)}
                        className={cx(inputClass, "font-mono text-xs")}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Pilihan Jenis Kalibrasi Khusus untuk Alat Ini */}
              <div className="space-y-3.5 pt-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Jenis Kalibrasi
                  </h4>
                  <p className="text-xs text-slate-500">
                    Pilih lingkup kalibrasi yang diinginkan
                  </p>
                </div>

                {/* Dropdown Pemilihan Jenis Kalibrasi */}
                <div
                  className={cx(
                    "flex flex-col sm:flex-row items-end gap-3 p-4 rounded-xl border border-slate-200 transition-colors",
                    isOdd ? "bg-white" : "bg-slate-50/70"
                  )}
                >
                  <div className="flex-1 w-full">
                    <FieldLabel htmlFor={`select-kalibrasi-${alat.id}`}>Jenis Kalibrasi</FieldLabel>
                    <TwoRowSelect
                      id={`select-kalibrasi-${alat.id}`}
                      disabled={isLoadingMaster}
                      placeholder={
                        isLoadingMaster
                          ? "Memuat data master..."
                          : `-- Pilih Jenis Kalibrasi untuk ${alat.namaAlat || `Alat #${index + 1}`} --`
                      }
                      searchPlaceholder="Ketik kata kunci kalibrasi..."
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
                      className="h-10 rounded-lg border-slate-300 text-sm shadow-none"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleTambahKalibrasiKeAlat(alat.id)}
                    disabled={!selectedMasterId || isLoadingMaster}
                    leftIcon={isLoadingMaster ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    className="h-10 px-5 text-xs font-semibold bg-brand-600 hover:bg-brand-700 rounded-lg shadow-none shrink-0"
                  >
                    Tambah
                  </Button>
                </div>

                {/* Tabel Daftar Kalibrasi untuk Alat Ini */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-none bg-white">
                  <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr
                        className={cx(
                          "text-slate-700 font-semibold border-b border-slate-200",
                          isOdd ? "bg-slate-100/70" : "bg-slate-50"
                        )}
                      >
                        <th className="px-4 py-3 w-[45%]">Jenis Kalibrasi</th>
                        <th className="px-3 py-3 w-[15%] text-center">Jumlah</th>
                        <th className="px-4 py-3 w-[20%] text-right font-mono">Tarif Satuan</th>
                        <th className="px-4 py-3 w-[20%] text-right font-mono">Subtotal</th>
                        <th className="px-3 py-3 w-[5%] text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {alat.kalibrasiList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium">
                            Belum ada jenis kalibrasi yang dipilih untuk alat ini. Silakan pilih jenis kalibrasi dari dropdown di atas.
                          </td>
                        </tr>
                      ) : (
                        alat.kalibrasiList.map((k) => (
                          <tr key={k.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-4 py-3 text-sm text-slate-800">
                              {k.nama}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <QuantityStepper
                                value={k.jumlah}
                                min={1}
                                max={alat.jumlah}
                                onChange={(val) =>
                                  handleUpdateJumlahKalibrasi(alat.id, k.id, val)
                                }
                                title={`Jumlah kalibrasi (Maksimal ${alat.jumlah} unit)`}
                              />
                            </td>
                            <td className="px-4 py-3 text-right text-slate-600 font-mono">
                              Rp {k.tarifSatuan.toLocaleString("id-ID")}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-slate-900 font-mono">
                              Rp {(k.jumlah * k.tarifSatuan).toLocaleString("id-ID")}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleHapusKalibrasiDariAlat(alat.id, k.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus jenis kalibrasi"
                              >
                                <Trash2 className="w-4 h-4" />
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
          )
        })}
      </div>

      {/* Toolbar Tambah Alat di Bagian Bawah Panel */}
      <div className="px-5 sm:px-7 py-3.5 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Perlu mengalibrasi lebih dari 1 instrumen dalam permohonan ini?
        </p>
        <Button
          type="button"
          id="btn-tambah-alat"
          variant="outline"
          onClick={handleTambahAlat}
          leftIcon={<Plus className="w-4 h-4 text-brand-600" />}
          className="w-full sm:w-auto h-10 px-4 rounded-lg font-semibold text-xs border-brand-300 bg-white text-brand-700 hover:bg-brand-50 hover:border-brand-400 shadow-none shrink-0"
        >
          Tambah Alat Lain
        </Button>
      </div>

      {/* Grand Total Footer di dalam 1 Card StepPanel yang sama */}
      <div className="px-5 sm:px-7 py-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="block text-xs font-semibold text-slate-500">Total Estimasi Biaya Kalibrasi</span>
          <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Rp {grandTotalBiaya.toLocaleString("id-ID")}
            </span>
            <span className="text-xs text-slate-500">
              · {alatList.length} instrumen · {totalUnitAlat} total unit
            </span>
          </div>
        </div>
      </div>
    </StepPanel>
  )
}

export default FormInformasiAlat
