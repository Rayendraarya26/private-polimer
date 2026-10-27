import React, { useState, useEffect, useMemo } from "react"
import { toast } from "react-hot-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import {
  Toolbox,
  Plus,
  Trash2,
  Settings,
  Loader2,
  Info,
  Calculator,
  ShieldCheck,
  Copy,
  CheckCircle2,
  Tag,
} from "lucide-react"
import { useMasterKalibrasiQuery } from "../../../hooks/queries/useMasterQuery"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import {
  FormField,
  TextInput,
  SelectInput,
  RepeaterAccordion,
  RepeaterItem,
} from "../../forms"
import { TwoRowSelect } from "../../ui/TwoRowSelect"

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

  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number>(0)
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
      setSelectedKalibrasiMap({})
      setActiveAccordionIndex(0)
    }
  }, [dataAlat])

  // Helper untuk update state lokal dan sinkronkan langsung ke parent wizard
  const updateAlatList = (updated: AlatKalibrasiItem[]) => {
    setAlatList(updated)
    if (onChangeDataAlat) {
      onChangeDataAlat(updated)
    }
  }

  // Handler: Tambah Alat Baru
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
        kondisi: "Baik / Normal",
        kalibrasiList: [],
      },
    ]
    updateAlatList(updated)
    setActiveAccordionIndex(updated.length - 1)
  }

  // Handler: Duplikat Spesifikasi Alat Terakhir
  const handleDuplikatAlatTerakhir = () => {
    if (alatList.length === 0) return
    const lastAlat = alatList[alatList.length - 1]
    const newId = `alat-${Date.now()}`

    const clonedKalibrasi: KalibrasiUjiItem[] = lastAlat.kalibrasiList.map((k, idx) => ({
      ...k,
      id: `${newId}-kal-${idx}-${Date.now()}`,
    }))

    const duplicatedAlat: AlatKalibrasiItem = {
      id: newId,
      namaAlat: lastAlat.namaAlat,
      merk: lastAlat.merk,
      tipeModel: lastAlat.tipeModel,
      jumlah: lastAlat.jumlah,
      nomorSeriList: Array(lastAlat.jumlah).fill(""),
      kondisi: lastAlat.kondisi || "Baik / Normal",
      kalibrasiList: clonedKalibrasi,
    }

    const updated = [...alatList, duplicatedAlat]
    updateAlatList(updated)
    setActiveAccordionIndex(updated.length - 1)
    toast.success(`Spesifikasi "${lastAlat.namaAlat || 'Alat'}" berhasil diduplikasi. Silakan isi nomor serinya.`)
  }

  // Handler: Hapus Alat
  const handleHapusAlat = (alatId: string) => {
    if (alatList.length <= 1) return
    const updated = alatList.filter((a) => a.id !== alatId)
    updateAlatList(updated)
    setActiveAccordionIndex(Math.max(0, updated.length - 1))
  }

  // Handler: Update Spesifikasi Alat
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

  // Map to RepeaterItem for RepeaterAccordion
  const repeaterItems: RepeaterItem[] = useMemo(() => {
    return alatList.map((alat, idx) => {
      const subtotal = (alat.kalibrasiList || []).reduce(
        (acc, k) => acc + k.jumlah * k.tarifSatuan,
        0
      )
      const isComplete = Boolean(
        alat.namaAlat?.trim() &&
        alat.merk?.trim() &&
        alat.kalibrasiList &&
        alat.kalibrasiList.length > 0
      )

      return {
        id: alat.id,
        title: alat.namaAlat
          ? `${alat.namaAlat}${alat.tipeModel ? ` (${alat.tipeModel})` : ""}`
          : `Instrumen / Alat #${idx + 1}`,
        subtitle: `${alat.merk ? `Merk: ${alat.merk} • ` : ""}${alat.jumlah} Unit • ${alat.kalibrasiList.length} Parameter Uji`,
        subtotalBadge: `Rp ${subtotal.toLocaleString("id-ID")}`,
        isComplete,
      }
    })
  }, [alatList])

  return (
    <div className="space-y-6">
      {/* Top Banner Guide */}
      <Card className="rounded-2xl border-brand-100/80 shadow-soft bg-gradient-to-r from-brand-50/70 via-sky-50/30 to-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-brand-100/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-600 text-white shadow-2xs">
                <Toolbox className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base text-slate-900 tracking-tight">
                  Daftar Alat & Parameter Kalibrasi
                </CardTitle>
                <CardDescription className="text-xs text-slate-600">
                  Daftarkan instrumen ukur yang akan dikalibrasi, tentukan nomor seri, dan pilih parameter pengujiannya
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-900 bg-brand-100/80 px-3 py-1 rounded-full border border-brand-200">
                {alatList.length} Jenis Alat ({totalUnitAlat} Unit)
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Smart Repeater Accordion: Solves endless scrolling and fatigue */}
      <RepeaterAccordion
        items={repeaterItems}
        activeIndex={activeAccordionIndex}
        onActiveIndexChange={setActiveAccordionIndex}
        onAddItem={handleTambahAlat}
        onDuplicateLast={alatList.length > 0 ? handleDuplikatAlatTerakhir : undefined}
        onDeleteItem={handleHapusAlat}
        addLabel="+ Tambah Alat Lain"
        duplicateLabel="📑 Duplikat Spesifikasi Terakhir"
      >
        {(item, index) => {
          const alat = alatList[index]
          if (!alat) return null
          const selectedMasterId = selectedKalibrasiMap[alat.id] || ""

          return (
            <div className="space-y-6">
              {/* 1. Spesifikasi Alat */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  Informasi Spesifikasi Alat #{index + 1}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama Alat */}
                  <FormField
                    label="Nama Alat"
                    required
                    tooltip="Nama baku instrumen, contoh: Timbangan Analitik, Caliper, Pressure Gauge"
                  >
                    <TextInput
                      placeholder="Contoh: Timbangan Analitik"
                      value={alat.namaAlat}
                      onChange={(e) => handleUpdateAlat(alat.id, "namaAlat", e.target.value)}
                    />
                  </FormField>

                  {/* Merk / Buatan */}
                  <FormField
                    label="Merk / Pabrikan"
                    required
                    tooltip="Nama pabrikan pembuat alat"
                  >
                    <TextInput
                      placeholder="Contoh: Ohaus / Mitutoyo"
                      value={alat.merk}
                      onChange={(e) => handleUpdateAlat(alat.id, "merk", e.target.value)}
                    />
                  </FormField>

                  {/* Tipe / Model */}
                  <FormField
                    label="Tipe / Model"
                    required
                    tooltip="Nomor model yang tertera pada nameplate alat"
                  >
                    <TextInput
                      placeholder="Contoh: Pioneer PX224"
                      value={alat.tipeModel}
                      onChange={(e) => handleUpdateAlat(alat.id, "tipeModel", e.target.value)}
                    />
                  </FormField>

                  {/* Jumlah Unit */}
                  <FormField
                    label="Jumlah Unit"
                    required
                    tooltip="Jumlah unit fisik alat dengan tipe yang sama"
                  >
                    <TextInput
                      type="number"
                      min={1}
                      value={alat.jumlah}
                      onChange={(e) => handleUpdateAlat(alat.id, "jumlah", e.target.value)}
                    />
                  </FormField>

                  {/* Kondisi Alat */}
                  <div className="md:col-span-2">
                    <FormField
                      label="Kondisi Fisik & Operasional Alat"
                      required
                      helperText="Jelaskan bila ada catatan kelengkapan asesoris, kabel daya, atau sensor"
                    >
                      <TextInput
                        placeholder="Contoh: Baik / Normal / Bersih dengan adaptor daya"
                        value={alat.kondisi}
                        onChange={(e) => handleUpdateAlat(alat.id, "kondisi", e.target.value)}
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* 2. Nomor Seri Masing-Masing Unit */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-brand-600" />
                      Nomor Seri Masing-Masing Unit ({alat.jumlah} Unit) <span className="text-rose-500">*</span>
                    </h5>
                    <p className="text-xs text-slate-500">
                      Nomor seri wajib diisi unik untuk setiap unit instrumen yang diajukan
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {alat.nomorSeriList.map((seri, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        #{sIdx + 1}
                      </span>
                      <TextInput
                        placeholder={`No. Seri Unit ke-${sIdx + 1}`}
                        value={seri}
                        onChange={(e) => handleUpdateNomorSeri(alat.id, sIdx, e.target.value)}
                        className="font-mono text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Pilihan Jenis Kalibrasi Khusus untuk Alat Ini */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                      Pilihan Parameter / Jenis Kalibrasi
                    </h4>
                    <p className="text-xs text-slate-500">
                      Pilih lingkup kalibrasi resmi yang terdaftar pada master BBSPJIKKP
                    </p>
                  </div>
                </div>

                {/* Dropdown Pemilihan Jenis Kalibrasi */}
                <div className="flex flex-col sm:flex-row items-end gap-3 p-4 bg-brand-50/40 rounded-2xl border border-brand-100">
                  <div className="flex-1 w-full">
                    <FormField
                      label="Cari & Pilih Jenis Kalibrasi"
                      helperText="Ketik nama alat atau metode kalibrasi untuk mencari"
                    >
                      <SelectInput
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
                      />
                    </FormField>
                  </div>

                  <Button
                    type="button"
                    onClick={() => handleTambahKalibrasiKeAlat(alat.id)}
                    disabled={!selectedMasterId || isLoadingMaster}
                    leftIcon={isLoadingMaster ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    className="h-[42px] px-5 text-xs font-bold bg-brand-600 hover:bg-brand-700 shadow-sm shrink-0"
                  >
                    Tambahkan Kalibrasi
                  </Button>
                </div>

                {/* Tabel Daftar Kalibrasi untuk Alat Ini */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                  <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                        <th className="px-4 py-3 w-[45%]">Jenis Kalibrasi</th>
                        <th className="px-3 py-3 w-[15%] text-center">Jumlah Kalibrasi</th>
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
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              {k.nama}
                            </td>
                            <td className="px-3 py-3 text-center">
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
                                title={`Jumlah kalibrasi (Maksimal ${alat.jumlah} unit)`}
                                className="w-20 text-center rounded-xl border border-slate-300 py-1.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
        }}
      </RepeaterAccordion>

      {/* Floating / Sticky Grand Total Banner */}
      <Card className="rounded-2xl border-slate-200/90 shadow-card bg-gradient-to-r from-slate-50 via-brand-50/25 to-white overflow-hidden">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-2xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase block">
                Total Estimasi Biaya PNBP Kalibrasi:
              </span>
              <p className="text-xs text-slate-400">
                Mengacu pada PP PNBP Kemenperin resmi yang berlaku
              </p>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
              Rp {grandTotalBiaya.toLocaleString("id-ID")}
            </h3>
            <span className="text-xs font-semibold text-brand-700">
              {alatList.length} Instrumen • {totalUnitAlat} Total Unit
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FormInformasiAlat
