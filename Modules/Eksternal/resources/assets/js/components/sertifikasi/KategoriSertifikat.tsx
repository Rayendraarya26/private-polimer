import React, { useState, useEffect } from "react"
import api from "../../utils/api"
import { Button } from "../ui/Button"
import {
  Award,
  CheckCircle2,
  Loader2,
  PackageCheck,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  RotateCcw,
  FileText,
  UploadCloud,
  ExternalLink,
} from "lucide-react"
import { useKategoriSertifikatQuery, useKomoditiSertifikatQuery } from "../../hooks/queries/useMasterQuery"
import { useProfileQuery } from "../../hooks/queries/useProfileQuery"

export interface DokumenPersyaratan {
  id: string
  nama: string
  keterangan?: string
  wajib?: boolean
  file?: File | null
  fileName?: string
  fileSize?: string
  fileUrl?: string
  isFromProfile?: boolean
}

export interface KomoditiData {
  id?: string | number
  nama?: string
  merek: string
  tipe: string
  ukuran: string
  noSni: string
  satuanProduksi: string
  jumlahProduksi: number | string
  keterangan: string
}

interface Step2KategoriSertifikatProps {
  onNext?: () => void
  onBack?: () => void
  hideButtons?: boolean
  value?: string
  onChange?: (value: string) => void
  // Dukungan multi-komoditi (Array)
  komoditiListValue?: KomoditiData[]
  onChangeKomoditiList?: (data: KomoditiData[]) => void
  // Dukungan kelengkapan dokumen persyaratan
  dokumenListValue?: DokumenPersyaratan[]
  onChangeDokumenList?: (data: DokumenPersyaratan[]) => void
  // Backward compatibility untuk single object
  komoditiValue?: KomoditiData
  onChangeKomoditi?: (data: KomoditiData) => void
}

interface KategoriSertifikat {
  id: string
  lingkup: string
}

interface KomoditiItem {
  id: string
  nama: string
  sni: string
  ukuran?: string
  jumlahProduksi?: number
  kategori_id?: string
  satuanProduksi?: string
  keterangan?: string
}

const defaultDokumenList: DokumenPersyaratan[] = [
  {
    id: "surat_permohonan",
    nama: "Surat Permohonan Sertifikasi (SPPT SNI)",
    keterangan: "Format PDF maks. 5MB (Ditandatangani pimpinan/direktur)",
    wajib: true,
  },
  {
    id: "legalitas_perusahaan",
    nama: "Akta Pendirian Perusahaan & SK Kemenkumham",
    keterangan: "Format PDF maks. 10MB",
    wajib: true,
  },
  {
    id: "nib_iui",
    nama: "Nomor Induk Berusaha (NIB) / Izin Usaha Industri (IUI)",
    keterangan: "Format PDF maks. 5MB",
    wajib: true,
  },
  {
    id: "sertifikat_merek",
    nama: "Sertifikat Merek / Bukti Pendaftaran Merek (DJKI)",
    keterangan: "Format PDF maks. 5MB (Surat pelimpahan jika merek pihak lain)",
    wajib: true,
  },
  {
    id: "sistem_mutu",
    nama: "Sertifikat Sistem Manajemen Mutu (ISO 9001) / Manual Mutu",
    keterangan: "Format PDF maks. 10MB",
    wajib: false,
  },
  {
    id: "alur_produksi",
    nama: "Diagram Alir Proses Produksi & Denah/Layout Pabrik",
    keterangan: "Format PDF maks. 5MB",
    wajib: false,
  },
]

const emptyKomoditiForm: KomoditiData = {
  nama: "",
  merek: "",
  tipe: "",
  ukuran: "",
  noSni: "",
  satuanProduksi: "",
  jumlahProduksi: "",
  keterangan: "",
}

const Step2KategoriSertifikat: React.FC<Step2KategoriSertifikatProps> = ({
  onNext,
  onBack,
  hideButtons,
  value = "",
  onChange,
  komoditiListValue,
  onChangeKomoditiList,
  dokumenListValue,
  onChangeDokumenList,
  komoditiValue,
  onChangeKomoditi,
}) => {
  const [internalSelected, setInternalSelected] = useState<string>(value)
  const uniqueId = React.useId()
  const selectedKategori = onChange ? value : internalSelected

  // State daftar komoditi yang sudah dimasukkan ke dalam tabel
  const [komoditiItems, setKomoditiItems] = useState<KomoditiData[]>(() => {
    if (komoditiListValue && Array.isArray(komoditiListValue)) {
      return komoditiListValue
    }
    if (komoditiValue && (komoditiValue.merek || komoditiValue.noSni || komoditiValue.ukuran)) {
      return [{ ...komoditiValue, id: Date.now() }]
    }
    return []
  })

  // Sinkronisasi jika prop komoditiListValue dari parent berubah
  useEffect(() => {
    if (komoditiListValue && Array.isArray(komoditiListValue)) {
      setKomoditiItems(komoditiListValue)
    }
  }, [komoditiListValue])

  // State tabel kelengkapan dokumen (diinisialisasi dari draft parent jika ada)
  const [dokumenList, setDokumenList] = useState<DokumenPersyaratan[]>(() => {
    if (dokumenListValue && Array.isArray(dokumenListValue) && dokumenListValue.length > 0) {
      return defaultDokumenList.map((defDoc) => {
        const found = dokumenListValue.find((d) => d.id === defDoc.id)
        return found ? { ...defDoc, ...found } : defDoc
      })
    }
    return defaultDokumenList
  })

  // Sinkronisasi jika prop dokumenListValue berubah dari parent (misal saat draft dipulihkan)
  useEffect(() => {
    if (dokumenListValue && Array.isArray(dokumenListValue) && dokumenListValue.length > 0) {
      setDokumenList((prev) => {
        return defaultDokumenList.map((defDoc) => {
          const found = dokumenListValue.find((d) => d.id === defDoc.id)
          const current = prev.find((d) => d.id === defDoc.id)
          return found ? { ...defDoc, ...current, ...found } : (current || defDoc)
        })
      })
    }
  }, [dokumenListValue])

  const { profile } = useProfileQuery()
  const detailPerusahaan = profile?.detail

  // Inisialisasi otomatis dokumen legalitas yang sudah ada di profil perusahaan
  useEffect(() => {
    if (detailPerusahaan) {
      setDokumenList((prev) => {
        let changed = false
        const updated = prev.map((doc) => {
          // 1. Akta Pendirian & SK Kemenkumham
          if (doc.id === "legalitas_perusahaan" && detailPerusahaan.dok_akta_pendirian && !doc.fileUrl) {
            changed = true
            return {
              ...doc,
              isFromProfile: true,
              fileName: "Akta Pendirian (Tersedia dari Profil)",
              fileUrl: detailPerusahaan.dok_akta_pendirian,
            }
          }
          // 2. Nomor Induk Berusaha (NIB)
          if (doc.id === "nib_iui" && detailPerusahaan.dok_nib && !doc.fileUrl) {
            changed = true
            return {
              ...doc,
              isFromProfile: true,
              fileName: "NIB (Tersedia dari Profil)",
              fileUrl: detailPerusahaan.dok_nib,
            }
          }
          return doc
        })
        if (changed) {
          const serializableDocs = updated.map(({ file, ...rest }) => rest)
          onChangeDokumenList?.(serializableDocs)
        }
        return updated
      })
    }
  }, [detailPerusahaan, onChangeDokumenList])

  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null)

  const handleUploadDokumen = async (id: string, file: File | null) => {
    if (!file) return
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB"
    const tempUrl = URL.createObjectURL(file)

    // Set tampilan lokal sementara
    setDokumenList((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              file,
              fileName: file.name,
              fileSize: sizeMB,
              fileUrl: tempUrl,
            }
          : doc
      )
    )

    // Unggah ke backend
    setUploadingDocId(id)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("dokumen_id", id)

      const response = await api.post("/eksternal/sertifikasi/upload-dokumen", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data?.success && response.data?.results?.file_url) {
        setDokumenList((prev) => {
          const updated = prev.map((doc) =>
            doc.id === id
              ? {
                  ...doc,
                  fileUrl: response.data.results.file_url,
                  fileName: response.data.results.file_name || file.name,
                  fileSize: sizeMB,
                }
              : doc
          )
          // Simpan hanya data serializable (tanpa objek File binary) ke parent/IndexedDB
          const serializableDocs = updated.map(({ file, ...rest }) => rest)
          onChangeDokumenList?.(serializableDocs)
          return updated
        })
      }
    } catch (err) {
      console.error("Gagal mengunggah file:", err)
    } finally {
      setUploadingDocId(null)
    }
  }

  const handleRemoveDokumen = (id: string) => {
    setDokumenList((prev) => {
      const updated = prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              file: null,
              fileName: undefined,
              fileSize: undefined,
              fileUrl: undefined,
              isFromProfile: false,
            }
          : doc
      )
      const serializableDocs = updated.map(({ file, ...rest }) => rest)
      onChangeDokumenList?.(serializableDocs)
      return updated
    })
  }

  // State input form komoditi
  const [formInput, setFormInput] = useState<KomoditiData>(emptyKomoditiForm)
  const [selectedKomoditiId, setSelectedKomoditiId] = useState<string>("")
  const [isManualKomoditi, setIsManualKomoditi] = useState<boolean>(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formError, setFormError] = useState<string>("")

  const handleSelectKategori = (id: string) => {
    setInternalSelected(id)
    if (onChange) {
      onChange(id)
    }
  }

  // Query kategori sertifikat & komoditi dari API
  const { data: categories = [], isLoading, isError } = useKategoriSertifikatQuery()
  const { data: komoditiList = [], isLoading: isLoadingKomoditi } = useKomoditiSertifikatQuery(selectedKategori)

  // Handler saat memilih komoditi dari dropdown
  const handleSelectKomoditiDropdown = (selectedId: string) => {
    setSelectedKomoditiId(selectedId)
    setFormError("")

    if (selectedId === "manual") {
      setIsManualKomoditi(true)
      setFormInput((prev) => ({
        ...prev,
        nama: "",
        noSni: "",
      }))
    } else {
      setIsManualKomoditi(false)
      const found = komoditiList.find((k: KomoditiItem) => k.id === selectedId)
      if (found) {
        setFormInput((prev) => ({
          ...prev,
          nama: found.nama,
          noSni: found.sni || "",
        }))
      }
    }
  }

  // Sinkronisasi ke parent component
  const syncToParent = (items: KomoditiData[]) => {
    setKomoditiItems(items)
    if (onChangeKomoditiList) {
      onChangeKomoditiList(items)
    } else if (onChangeKomoditi && items.length > 0) {
      onChangeKomoditi(items[0])
    }
  }

  // Handler simpan / tambah komoditi ke tabel
  const handleSaveKomoditiToTable = () => {
    // Validasi field wajib
    if (!formInput.nama && !formInput.merek) {
      setFormError("Nama komoditi atau merek wajib diisi.")
      return
    }
    if (!formInput.merek) {
      setFormError("Merek produk wajib diisi.")
      return
    }
    if (!formInput.tipe) {
      setFormError("Tipe / varian komoditi wajib diisi.")
      return
    }
    if (!formInput.ukuran) {
      setFormError("Ukuran komoditi wajib diisi.")
      return
    }
    if (!formInput.satuanProduksi) {
      setFormError("Satuan produksi wajib diisi.")
      return
    }

    setFormError("")

    if (editingIndex !== null) {
      // Mode Edit
      const updated = [...komoditiItems]
      updated[editingIndex] = {
        ...formInput,
        id: updated[editingIndex].id || Date.now(),
      }
      syncToParent(updated)
      setEditingIndex(null)
    } else {
      // Mode Tambah Baru
      const newItem: KomoditiData = {
        ...formInput,
        id: Date.now(),
      }
      syncToParent([...komoditiItems, newItem])
    }

    // Reset Form Input
    setFormInput(emptyKomoditiForm)
    setSelectedKomoditiId("")
    setIsManualKomoditi(false)
  }

  // Handler Edit Item dari Tabel
  const handleEditItem = (index: number) => {
    const itemToEdit = komoditiItems[index]
    setFormInput(itemToEdit)
    setEditingIndex(index)
    setFormError("")

    // Cek apakah item ada di list dropdown standar
    const match = komoditiList.find((k: KomoditiItem) => k.nama === itemToEdit.nama)
    if (match) {
      setSelectedKomoditiId(match.id)
      setIsManualKomoditi(false)
    } else {
      setSelectedKomoditiId("manual")
      setIsManualKomoditi(true)
    }

    // Scroll halus ke form input
    const formEl = document.getElementById("form-komoditi-section")
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Handler Batal Edit
  const handleCancelEdit = () => {
    setEditingIndex(null)
    setFormInput(emptyKomoditiForm)
    setSelectedKomoditiId("")
    setIsManualKomoditi(false)
    setFormError("")
  }

  // Handler Hapus Item
  const handleDeleteItem = (index: number) => {
    const updated = komoditiItems.filter((_, idx) => idx !== index)
    syncToParent(updated)
    if (editingIndex === index) {
      handleCancelEdit()
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Kategori Sertifikat & Data Komoditi</h3>
        <p className="text-xs text-slate-500 mt-1">
          Silakan pilih kategori sertifikat yang Anda butuhkan dan daftarkan satu atau lebih data komoditi.
        </p>
      </div>

      {/* 1. Pemilihan Kategori Sertifikat */}
      <div className="py-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500 mb-4" />
            <p className="text-sm">Memuat daftar kategori...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-rose-500">
            <p className="text-sm font-medium">Gagal memuat kategori sertifikat. Silakan coba lagi.</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <p className="text-sm">Tidak ada kategori sertifikat yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category: KategoriSertifikat) => {
              const isSelected = selectedKategori === category.id

              return (
                <label key={category.id} className="relative cursor-pointer group">
                  <input
                    type="radio"
                    name={`kategori_sertifikat_${uniqueId}`}
                    value={category.id}
                    className="peer sr-only"
                    checked={isSelected}
                    onChange={(e) => handleSelectKategori(e.target.value)}
                  />

                  <div className="h-full bg-white p-5 rounded-xl border-2 border-slate-200 transition-all duration-300 flex flex-col hover:border-brand-300 hover:shadow-md peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-checked:shadow-brand-100 peer-checked:shadow-md">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div
                        className={`p-3 rounded-xl border transition-colors duration-300 ${isSelected
                          ? "bg-brand-100 border-brand-200 text-brand-600"
                          : "bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500"
                          }`}
                      >
                        <Award className="w-6 h-6" />
                      </div>

                      {isSelected && (
                        <div className="animate-in zoom-in duration-200">
                          <CheckCircle2 className="w-6 h-6 text-brand-600" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <h3
                        className={`text-sm font-bold leading-tight transition-colors duration-300 ${isSelected ? "text-brand-700" : "text-slate-800 group-hover:text-brand-600"
                          }`}
                      >
                        {category.lingkup}
                      </h3>
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
        )}

        {/* 2. Bagian Tabel & Form Input Komoditi */}
        {selectedKategori && (
          <div className="mt-8 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300 space-y-6">

            {/* Header Bagian Komoditi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Daftar Komoditi Permohonan</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tambahkan satu atau lebih komoditi yang diajukan untuk proses sertifikasi.
                  </p>
                </div>
              </div>

              {komoditiItems.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 font-semibold text-xs rounded-full self-start sm:self-center border border-brand-200">
                  <PackageCheck className="w-3.5 h-3.5" />
                  {komoditiItems.length} Komoditi Ditambahkan
                </span>
              )}
            </div>

            {/* A. TABEL DAFTAR KOMODITI */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4 w-12 text-center">No</th>
                      <th className="py-3 px-4">Komoditi</th>
                      <th className="py-3 px-4">No SNI</th>
                      <th className="py-3 px-4">Merek</th>
                      <th className="py-3 px-4">Tipe</th>
                      <th className="py-3 px-4">Ukuran</th>
                      <th className="py-3 px-4">Produksi / Tahun</th>
                      <th className="py-3 px-4">Keterangan</th>
                      <th className="py-3 px-4 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {komoditiItems.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 px-4 text-center bg-slate-50/50">
                          <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center space-y-2.5">
                            <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-1">
                              <PackageCheck className="w-6 h-6 text-slate-400 stroke-[1.5]" />
                            </div>
                            <p className="font-semibold text-slate-700 text-sm">
                              Belum ada data komoditi yang ditambahkan
                            </p>
                            <p className="text-xs text-slate-400 leading-relaxed text-center">
                              Silakan isi formulir di bawah ini dan klik tombol{" "}
                              <span className="font-semibold text-brand-600">"Tambah"</span>.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      komoditiItems.map((item, idx) => (
                        <tr
                          key={item.id || idx}
                          className={`hover:bg-slate-50/80 transition-colors ${editingIndex === idx ? "bg-amber-50/60" : ""
                            }`}
                        >
                          <td className="py-3.5 px-4 text-center font-medium text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {item.nama || "-"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
                              {item.noSni || "-"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-800 font-medium">
                            {item.merek || "-"}
                          </td>
                          <td className="py-3.5 px-4 text-slate-800">
                            {item.tipe || "-"}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">
                            {item.ukuran || "-"}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            <span className="font-semibold text-slate-900">
                              {item.jumlahProduksi ? Number(item.jumlahProduksi).toLocaleString("id-ID") : "0"}
                            </span>{" "}
                            <span className="text-slate-500 text-[11px]">{item.satuanProduksi || ""}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-[200px] truncate">
                            {item.keterangan || "-"}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditItem(idx)}
                                className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                                title="Edit Komoditi"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteItem(idx)}
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                title="Hapus Komoditi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* B. FORMULIR INPUT KOMODITI */}
            <div
              id="form-komoditi-section"
              className={`p-5 rounded-xl border transition-all ${editingIndex !== null
                ? "bg-amber-50/40 border-amber-300 ring-2 ring-amber-200/50"
                : "bg-slate-50 border-slate-200"
                }`}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  {/* <div className={`p-1.5 rounded-lg ${editingIndex !== null ? "bg-amber-100 text-amber-700" : "bg-brand-100 text-brand-700"}`}>
                    {editingIndex !== null ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div> */}
                  <div>
                    <h4 className="text-md font-bold text-slate-900">
                      {editingIndex !== null ? `Edit Komoditi (Item #${editingIndex + 1})` : "Data Komoditas"}
                    </h4>
                    {/* <p className="text-[11px] text-slate-500">
                      {editingIndex !== null
                        ? "Ubah data komoditi lalu klik Simpan Perubahan."
                        : "Lengkapi data komoditi dan masukkan ke dalam tabel permohonan."}
                    </p> */}
                  </div>
                </div>

                {editingIndex !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                    className="h-7 text-xs text-slate-600 bg-white"
                  >
                    Batal Edit
                  </Button>
                )}
              </div>

              {/* Pesan Error Validasi Form */}
              {formError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* Baris 1: Kiri - Komoditi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Komoditi<span className="text-rose-500">*</span>
                  </label>
                  <select
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    value={selectedKomoditiId}
                    onChange={(e) => handleSelectKomoditiDropdown(e.target.value)}
                  >
                    <option value="">-- Pilih Komoditi --</option>
                    {komoditiList.map((k: KomoditiItem) => (
                      <option key={k.id} value={k.id}>
                        {k.nama} {k.sni ? `(${k.sni})` : ""}
                      </option>
                    ))}
                    <option value="manual">+ Input Komoditi Lainnya</option>
                  </select>

                  {isManualKomoditi && (
                    <input
                      type="text"
                      placeholder="Masukkan nama komoditi..."
                      value={formInput.nama || ""}
                      onChange={(e) => setFormInput((prev) => ({ ...prev, nama: e.target.value }))}
                      className="w-full mt-2 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    />
                  )}
                </div>

                {/* Ukuran */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ukuran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 39-44 / Diameter 2 inch"
                    value={formInput.ukuran}
                    onChange={(e) => setFormInput((prev) => ({ ...prev, ukuran: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                  />
                </div>

                {/* No SNI */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No SNI
                  </label>
                  <input
                    disabled
                    type="text"
                    value={formInput.noSni || ""}
                    onChange={(e) => setFormInput((prev) => ({ ...prev, noSni: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800
                    disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Baris 2: Kanan - Jumlah Produksi/Tahun */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Produksi/Tahun <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Contoh: 10000"
                    value={formInput.jumlahProduksi}
                    onChange={(e) => setFormInput((prev) => ({ ...prev, jumlahProduksi: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                  />
                </div>

                {/* Baris 3: Kiri - Merek */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Merek <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Brand XYZ"
                    value={formInput.merek}
                    onChange={(e) => setFormInput((prev) => ({ ...prev, merek: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                  />
                </div>

                {/* Baris 3: Kanan - Satuan Produksi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Satuan Produksi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pcs / Pasang / Unit / Ton"
                    value={formInput.satuanProduksi}
                    onChange={(e) => setFormInput((prev) => ({ ...prev, satuanProduksi: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                  />
                </div>

                {/* Baris 4: Kiri - Tipe */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipe <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Type A, Low Cut"
                    value={formInput.tipe}
                    onChange={(e) => setFormInput((prev) => ({ ...prev, tipe: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                  />
                </div>

                {/* Baris 4: Kanan - Keterangan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Keterangan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={formInput.keterangan}
                    onChange={(e) => setFormInput((prev) => ({ ...prev, keterangan: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Tombol Simpan / Tambah ke Tabel */}
              <div className="mt-5 pt-4 border-t border-slate-200 flex justify-end gap-2">
                {editingIndex !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="px-4 text-xs"
                  >
                    Batal
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveKomoditiToTable}
                  leftIcon={editingIndex !== null ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  className="px-5 py-3 text-xs bg-brand-600 hover:bg-brand-700"
                >
                  {editingIndex !== null ? "Simpan Perubahan Komoditi" : "Tambah"}
                </Button>
              </div>
            </div>

            {/* 3. KELENGKAPAN DOKUMEN PERSYARATAN */}
            <div className="pt-8 border-t border-slate-200/80 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Kelengkapan Dokumen Persyaratan
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Silakan unggah dokumen persyaratan yang diperlukan untuk permohonan sertifikasi ini.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4 min-w-[240px]">Dokumen</th>
                        <th className="py-3 px-4 min-w-[200px]">Upload</th>
                        <th className="py-3 px-4 min-w-[220px]">Dokumen Anda</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dokumenList.map((doc, idx) => (
                        <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Kolom 1: No */}
                          <td className="py-3.5 px-4 text-center font-medium text-slate-500">
                            {idx + 1}
                          </td>

                          {/* Kolom 2: Dokumen */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-semibold text-slate-800 text-xs">
                                  {doc.nama}
                                </span>
                                {doc.wajib ? (
                                  <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 rounded">
                                    Wajib
                                  </span>
                                ) : (
                                  <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">
                                    Opsional
                                  </span>
                                )}
                              </div>
                              {doc.keterangan && (
                                <p className="text-[11px] text-slate-400 leading-normal">
                                  {doc.keterangan}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Kolom 3: Upload */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <label
                                className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium shadow-sm transition-all ${
                                  uploadingDocId === doc.id
                                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-wait"
                                    : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer hover:border-brand-400 hover:text-brand-600"
                                }`}
                              >
                                {uploadingDocId === doc.id ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                                    <span>Mengunggah...</span>
                                  </>
                                ) : (
                                  <>
                                    <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                                    <span>{doc.fileName ? "Ganti File" : "Pilih File"}</span>
                                    <input
                                      type="file"
                                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                      className="sr-only"
                                      disabled={uploadingDocId !== null}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0] || null
                                        handleUploadDokumen(doc.id, file)
                                      }}
                                    />
                                  </>
                                )}
                              </label>
                            </div>
                          </td>

                          {/* Kolom 4: Dokumen Anda */}
                          <td className="py-3.5 px-4">
                            {doc.fileName ? (
                              <div className="flex items-center justify-between gap-2 p-2 bg-emerald-50/70 border border-emerald-200 rounded-lg max-w-[280px]">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-emerald-900 truncate max-w-[150px]" title={doc.fileName}>
                                      {doc.fileName}
                                    </p>
                                    {doc.fileSize && (
                                      <span className="text-[10px] text-emerald-600">
                                        {doc.fileSize}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  {doc.fileUrl && (
                                    <a
                                      href={doc.fileUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1 text-emerald-700 hover:bg-emerald-100 rounded transition-colors"
                                      title="Lihat Berkas"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDokumen(doc.id)}
                                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                                    title="Hapus Berkas"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-500">
                                Belum diunggah
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {!hideButtons && (
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onBack} className="px-6">
            Kembali
          </Button>
          <Button
            type="button"
            onClick={onNext}
            disabled={!selectedKategori || komoditiItems.length === 0}
            className="px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya
          </Button>
        </div>
      )}
    </div>
  )
}

export default Step2KategoriSertifikat
