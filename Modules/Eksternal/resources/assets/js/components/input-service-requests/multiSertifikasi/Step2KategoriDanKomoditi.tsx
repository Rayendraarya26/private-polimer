import React, { useState, useEffect } from "react"
import { SertifikasiFormData, SertifikasiProductItem, defaultDokumenList } from "../../../types/sertifikasi"
import { Button } from "../../ui/Button"
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  FileText,
  UploadCloud,
  ExternalLink,
  Loader2,
  RotateCcw,
  Layers,
} from "lucide-react"
import { useKategoriSertifikatQuery, useKomoditiSertifikatQuery } from "../../../hooks/queries/useMasterQuery"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import useProfile from "../../../hooks/useProfile"
import api from "../../../utils/api"
import toast from "react-hot-toast"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  inputClass,
  selectClass,
  cx,
  WizardNav,
} from "../common/WizardUI"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  skemaList?: any[]
  onNext: () => void
  onBack: () => void
}

interface KomoditiMasterItem {
  id: string
  nama: string
  sni: string
  kategori_id?: string
}

export const Step2KategoriDanKomoditi: React.FC<Props> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [activePengajuanIdx, setActivePengajuanIdx] = useState<number>(0)
  const { data: kategoriList = [] } = useKategoriSertifikatQuery()
  const { profile: queryProfile } = useProfileQuery()
  const { profile: reduxProfile } = useProfile()

  const profileData = queryProfile || reduxProfile
  const detailPerusahaan = (
    profileData?.detail ||
    profileData?.pelanggan?.detail ||
    profileData?.results?.detail ||
    profileData?.data?.detail ||
    profileData
  ) as Record<string, any> | undefined

  // Ambil pengajuan aktif
  const currentPengajuan = formData.pengajuan[activePengajuanIdx] || formData.pengajuan[0] || {
    id: Date.now(),
    jenis_pengajuan: "baru",
    skema_id: "",
    items: [],
    dokumen_list: defaultDokumenList,
  }

  // State untuk form input penambahan komoditi
  const [selectedKomoditiId, setSelectedKomoditiId] = useState<string>("")
  const [selectedKomoditiObj, setSelectedKomoditiObj] = useState<KomoditiMasterItem | null>(null)
  const [formMerek, setFormMerek] = useState<string>("")
  const [formTipe, setFormTipe] = useState<string>("")
  const [formUkuran, setFormUkuran] = useState<string>("")
  const [formJumlahProduksi, setFormJumlahProduksi] = useState<string>("")
  const [formSatuanProduksi, setFormSatuanProduksi] = useState<string>("")
  const [formKeterangan, setFormKeterangan] = useState<string>("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // State upload file
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null)

  // Query Komoditi berdasarkan skema_id dari pengajuan aktif
  const activeSkemaId = currentPengajuan.skema_id || ""
  const { data: komoditiOptions = [], isLoading: isLoadingKomoditi, isFetching: isFetchingKomoditi } = useKomoditiSertifikatQuery(activeSkemaId)
  const isKomoditiLoading = isLoadingKomoditi || isFetchingKomoditi

  // Reset form komoditi saat ganti tab pengajuan
  useEffect(() => {
    setSelectedKomoditiId("")
    setSelectedKomoditiObj(null)
    setFormMerek("")
    setFormTipe("")
    setFormUkuran("")
    setFormJumlahProduksi("")
    setFormSatuanProduksi("")
    setFormKeterangan("")
    setEditingIndex(null)
  }, [activePengajuanIdx])

  // Sinkronisasi data lama (komoditi & dokumen) jika perpanjangan sertifikat dan items masih kosong
  useEffect(() => {
    if (
      currentPengajuan.jenis_pengajuan === "lama" &&
      currentPengajuan.sertifikat_lama_id &&
      (!currentPengajuan.items || currentPengajuan.items.length === 0)
    ) {
      api
        .get("/eksternal/sertifikasi/riwayat-aktif")
        .then((res) => {
          if (res.data && (res.data.success || res.data.status === "success")) {
            const list = res.data.results || res.data.data || []
            const selected = list.find(
              (c: any) =>
                String(c.id) === String(currentPengajuan.sertifikat_lama_id) ||
                c.nomor_sertifikat === currentPengajuan.sertifikat_lama_text
            )
            if (selected) {
              setFormData((prev) => {
                const updated = [...prev.pengajuan]
                const targetP = updated[activePengajuanIdx] || updated[0]
                if (targetP.items && targetP.items.length > 0) return prev

                let newItems = targetP.items || []
                if (selected.items && Array.isArray(selected.items) && selected.items.length > 0) {
                  newItems = selected.items.map((it: any, iIdx: number) => ({
                    id: it.id || Date.now() + iIdx,
                    komoditi_id: it.komoditi_id,
                    nama_produk: it.nama_produk || it.komoditi || "Produk Bersertifikat",
                    merk_dagang: it.merk_dagang || it.merek || "-",
                    tipe_jenis: it.tipe_jenis || it.tipe || "-",
                    ukuran: it.ukuran || "-",
                    standar_sni_iso: it.standar_sni_iso || it.sni || "-",
                    kapasitas_produksi: it.kapasitas_produksi ? String(it.kapasitas_produksi) : "1000",
                    satuan_produksi: it.satuan_produksi || "Pcs",
                    keterangan: it.keterangan || "Data dari sertifikat sebelumnya",
                  }))
                } else if (selected.komoditi) {
                  newItems = [
                    {
                      id: Date.now(),
                      nama_produk: selected.komoditi,
                      merk_dagang: "-",
                      tipe_jenis: "-",
                      ukuran: "-",
                      standar_sni_iso: "-",
                      kapasitas_produksi: "1000",
                      satuan_produksi: "Pcs",
                      keterangan: "Data dari sertifikat sebelumnya",
                    },
                  ]
                }

                const baseDocs =
                  targetP.dokumen_list && targetP.dokumen_list.length > 0
                    ? [...targetP.dokumen_list]
                    : defaultDokumenList.map((d) => ({ ...d }))

                const updatedDocs = baseDocs.map((doc) => {
                  let docInfo: any = null
                  if (selected.dokumen_list) {
                    if (Array.isArray(selected.dokumen_list)) {
                      docInfo = selected.dokumen_list.find((d: any) => d.id === doc.id)
                    } else if (typeof selected.dokumen_list === "object") {
                      docInfo = selected.dokumen_list[doc.id]
                    }
                  }
                  if (
                    docInfo &&
                    (docInfo.fileUrl || docInfo.file_url || docInfo.fileName || docInfo.file_name) &&
                    !doc.fileUrl
                  ) {
                    return {
                      ...doc,
                      fileName: docInfo.fileName || docInfo.file_name || doc.nama,
                      fileUrl: docInfo.fileUrl || docInfo.file_url,
                      fileSize: docInfo.fileSize || docInfo.file_size || "1.5 MB",
                    }
                  }
                  return doc
                })

                updated[activePengajuanIdx] = {
                  ...targetP,
                  items: newItems,
                  dokumen_list: updatedDocs,
                  skema_id: targetP.skema_id || (selected.lingkup_id ? String(selected.lingkup_id) : targetP.skema_id),
                }
                return { ...prev, pengajuan: updated }
              })
            }
          }
        })
        .catch((e) => console.error("Gagal sinkron riwayat sertifikat di langkah 2:", e))
    }
  }, [activePengajuanIdx, currentPengajuan.jenis_pengajuan, currentPengajuan.sertifikat_lama_id])

  // Auto-populate dokumen legalitas dari profil perusahaan (Akta, NIB, NPWP, Merek)
  useEffect(() => {
    if (!detailPerusahaan) return

    setFormData((prev) => {
      let changed = false
      const updatedPengajuan = prev.pengajuan.map((p) => {
        const docList = p.dokumen_list && p.dokumen_list.length > 0
          ? [...p.dokumen_list]
          : defaultDokumenList.map((d) => ({ ...d }))

        const updatedDocs = docList.map((doc) => {
          // 1. Akta Pendirian & SK Kemenkumham / SK Nomenklatur
          if (doc.id === "legalitas_perusahaan") {
            const url = detailPerusahaan.dok_akta_pendirian || detailPerusahaan.dok_sk_nomenklatur || detailPerusahaan.akta_pendirian || detailPerusahaan.sk_nomenklatur
            if (url && !doc.file && !doc.fileUrl) {
              changed = true
              return {
                ...doc,
                isFromProfile: true,
                fileName: detailPerusahaan.dok_akta_pendirian || detailPerusahaan.akta_pendirian ? "Akta Pendirian" : "SK Nomenklatur",
                fileUrl: url.startsWith("http") || url.startsWith("/") ? url : `/storage/${url}`,
              }
            }
          }

          // 2. Nomor Induk Berusaha (NIB) / Izin Usaha
          if (doc.id === "nib_iui") {
            const url = detailPerusahaan.dok_nib || detailPerusahaan.dok_iui || detailPerusahaan.dok_iup || detailPerusahaan.nib || detailPerusahaan.iui || detailPerusahaan.iup
            if (url && !doc.file && !doc.fileUrl) {
              changed = true
              return {
                ...doc,
                isFromProfile: true,
                fileName: "NIB / Izin Usaha",
                fileUrl: url.startsWith("http") || url.startsWith("/") ? url : `/storage/${url}`,
              }
            }
          }

          // 3. NPWP Perusahaan
          if (doc.id === "npwp_perusahaan") {
            const url = detailPerusahaan.dok_npwp || detailPerusahaan.npwp
            if (url && !doc.file && !doc.fileUrl) {
              changed = true
              return {
                ...doc,
                isFromProfile: true,
                fileName: "NPWP",
                fileUrl: url.startsWith("http") || url.startsWith("/") ? url : `/storage/${url}`,
              }
            }
          }

          // 4. Sertifikat Merek
          if (doc.id === "sertifikat_merek") {
            const url = detailPerusahaan.dok_merek || detailPerusahaan.dok_sertifikat_merek || detailPerusahaan.dok_lainnya || detailPerusahaan.merek
            if (url && !doc.file && !doc.fileUrl) {
              changed = true
              return {
                ...doc,
                isFromProfile: true,
                fileName: "Sertifikat Merek",
                fileUrl: url.startsWith("http") || url.startsWith("/") ? url : `/storage/${url}`,
              }
            }
          }

          return doc
        })

        return { ...p, dokumen_list: updatedDocs }
      })

      if (!changed) return prev
      return { ...prev, pengajuan: updatedPengajuan }
    })
  }, [detailPerusahaan, setFormData])

  // Handle pilih master komoditi
  const handleSelectKomoditi = (komoditiId: string) => {
    setSelectedKomoditiId(komoditiId)
    const found = komoditiOptions.find((k: KomoditiMasterItem) => String(k.id) === String(komoditiId))
    setSelectedKomoditiObj(found || null)
  }

  // Handle Tambah / Simpan Komoditi ke Tabel
  const handleAddOrUpdateKomoditi = () => {
    if (!selectedKomoditiObj && !selectedKomoditiId) {
      toast.error("Silakan pilih komoditi terlebih dahulu.")
      return
    }
    if (!formUkuran.trim()) {
      toast.error("Ukuran wajib diisi.")
      return
    }
    if (!formJumlahProduksi.toString().trim() || Number(formJumlahProduksi) <= 0) {
      toast.error("Jumlah produksi/tahun wajib diisi.")
      return
    }
    if (!formMerek.trim()) {
      toast.error("Merek wajib diisi.")
      return
    }
    if (!formSatuanProduksi.trim()) {
      toast.error("Satuan produksi wajib diisi.")
      return
    }
    if (!formTipe.trim()) {
      toast.error("Tipe wajib diisi.")
      return
    }
    if (!formKeterangan.trim()) {
      toast.error("Keterangan wajib diisi.")
      return
    }

    const newItem: SertifikasiProductItem = {
      id: editingIndex !== null ? (currentPengajuan.items[editingIndex]?.id || Date.now()) : Date.now(),
      komoditi_id: Number(selectedKomoditiObj?.id || selectedKomoditiId),
      nama_produk: selectedKomoditiObj?.nama || "Komoditi Terdaftar",
      standar_sni_iso: selectedKomoditiObj?.sni || "-",
      merk_dagang: formMerek.trim(),
      tipe_jenis: formTipe.trim(),
      ukuran: formUkuran.trim(),
      kapasitas_produksi: formJumlahProduksi.trim(),
      satuan_produksi: formSatuanProduksi.trim(),
      keterangan: formKeterangan.trim(),
    }

    setFormData((prev) => {
      const updated = [...prev.pengajuan]
      const targetP = updated[activePengajuanIdx] || updated[0]
      const currentItems = [...(targetP.items || [])]

      if (editingIndex !== null) {
        currentItems[editingIndex] = newItem
      } else {
        currentItems.push(newItem)
      }

      updated[activePengajuanIdx] = { ...targetP, items: currentItems }
      return { ...prev, pengajuan: updated }
    })

    // Reset Form
    setSelectedKomoditiId("")
    setSelectedKomoditiObj(null)
    setFormMerek("")
    setFormTipe("")
    setFormUkuran("")
    setFormJumlahProduksi("")
    setFormSatuanProduksi("")
    setFormKeterangan("")
    setEditingIndex(null)
    toast.success(editingIndex !== null ? "Perubahan komoditi berhasil disimpan." : "Komoditi berhasil ditambahkan ke daftar.")
  }

  // Handle Edit Komoditi
  const handleEditItem = (index: number) => {
    const item = currentPengajuan.items[index]
    if (!item) return

    setEditingIndex(index)
    setSelectedKomoditiId(String(item.komoditi_id || ""))
    setSelectedKomoditiObj({
      id: String(item.komoditi_id || ""),
      nama: item.nama_produk,
      sni: item.standar_sni_iso || "-",
    })
    setFormMerek(item.merk_dagang || "")
    setFormTipe(item.tipe_jenis || "")
    setFormUkuran(item.ukuran || "")
    setFormJumlahProduksi(item.kapasitas_produksi || "")
    setFormSatuanProduksi(item.satuan_produksi || "")
    setFormKeterangan(item.keterangan || "")
  }

  // Handle Hapus Komoditi
  const handleDeleteItem = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.pengajuan]
      const targetP = updated[activePengajuanIdx] || updated[0]
      const currentItems = (targetP.items || []).filter((_, i) => i !== index)
      updated[activePengajuanIdx] = { ...targetP, items: currentItems }
      return { ...prev, pengajuan: updated }
    })
    if (editingIndex === index) {
      setEditingIndex(null)
      setSelectedKomoditiId("")
      setSelectedKomoditiObj(null)
      setFormMerek("")
      setFormTipe("")
      setFormUkuran("")
      setFormJumlahProduksi("")
      setFormSatuanProduksi("")
      setFormKeterangan("")
    }
    toast.success("Komoditi berhasil dihapus dari daftar.")
  }

  // Handle Upload Dokumen Persyaratan
  const handleUploadDokumen = async (docId: string, file: File | null) => {
    if (!file) return

    // Validasi ukuran maksimal 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB.")
      return
    }

    setUploadingDocId(docId)
    const toastId = toast.loading(`Mengunggah ${file.name}...`)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)
      uploadFormData.append("folder", "sertifikasi/dokumen")

      const res = await api.post("/eksternal/upload", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const fileUrl = res.data?.data?.url || res.data?.url || ""
      const fileName = file.name
      const fileSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`

      setFormData((prev) => {
        const updated = [...prev.pengajuan]
        const targetP = updated[activePengajuanIdx] || updated[0]
        const docList = targetP.dokumen_list && targetP.dokumen_list.length > 0
          ? [...targetP.dokumen_list]
          : defaultDokumenList.map((d) => ({ ...d }))

        const updatedDocs = docList.map((d) => {
          if (d.id === docId) {
            return {
              ...d,
              file,
              fileName,
              fileUrl,
              fileSize,
              isFromProfile: false,
            }
          }
          return d
        })

        updated[activePengajuanIdx] = { ...targetP, dokumen_list: updatedDocs }
        return { ...prev, pengajuan: updated }
      })

      toast.success("Dokumen berhasil diunggah.", { id: toastId })
    } catch (err: any) {
      console.error("Gagal unggah file:", err)
      // Fallback local file state
      setFormData((prev) => {
        const updated = [...prev.pengajuan]
        const targetP = updated[activePengajuanIdx] || updated[0]
        const docList = targetP.dokumen_list && targetP.dokumen_list.length > 0
          ? [...targetP.dokumen_list]
          : defaultDokumenList.map((d) => ({ ...d }))

        const updatedDocs = docList.map((d) => {
          if (d.id === docId) {
            return {
              ...d,
              file,
              fileName: file.name,
              fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              isFromProfile: false,
            }
          }
          return d
        })

        updated[activePengajuanIdx] = { ...targetP, dokumen_list: updatedDocs }
        return { ...prev, pengajuan: updated }
      })
      toast.success("Dokumen dilampirkan (akan diunggah saat pengiriman).", { id: toastId })
    } finally {
      setUploadingDocId(null)
    }
  }

  // Handle Hapus Dokumen Persyaratan
  const handleRemoveDokumen = (docId: string) => {
    setFormData((prev) => {
      const updated = [...prev.pengajuan]
      const targetP = updated[activePengajuanIdx] || updated[0]
      const docList = targetP.dokumen_list && targetP.dokumen_list.length > 0
        ? [...targetP.dokumen_list]
        : defaultDokumenList.map((d) => ({ ...d }))

      const updatedDocs = docList.map((d) => {
        if (d.id === docId) {
          return {
            ...d,
            file: null,
            fileName: undefined,
            fileUrl: undefined,
            fileSize: undefined,
            isFromProfile: false,
          }
        }
        return d
      })

      updated[activePengajuanIdx] = { ...targetP, dokumen_list: updatedDocs }
      return { ...prev, pengajuan: updated }
    })
    toast.success("Dokumen berhasil dihapus.")
  }

  const itemsList = (currentPengajuan.items || []).filter(
    (item) => item.nama_produk || item.merk_dagang || item.komoditi_id
  )
  const docList = currentPengajuan.dokumen_list && currentPengajuan.dokumen_list.length > 0
    ? currentPengajuan.dokumen_list
    : defaultDokumenList

  return (
    <div className="space-y-6">
      <StepPanel
        icon={Package}
        title="Kategori & Komoditi"
        description="Ruang lingkup, produk & dokumen"
      >
        <div className="space-y-6">
          {/* Tab Switcher jika ada 2 pengajuan */}
          {formData.pengajuan.length > 1 && (
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
              {formData.pengajuan.map((p, idx) => (
                <button
                  key={p.id || idx}
                  type="button"
                  onClick={() => setActivePengajuanIdx(idx)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${activePengajuanIdx === idx
                      ? "bg-white text-brand-700 shadow-none border border-brand-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${activePengajuanIdx === idx ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                  >
                    {idx + 1}
                  </span>
                  <span>
                    Pengajuan #{idx + 1} ({p.jenis_pengajuan === "baru" ? "Sertifikat Baru" : "Perpanjangan"})
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* 1. Pilih Ruang Lingkup / Skema Kategori Sertifikat */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-none">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Layers className="w-4 h-4 text-brand-600" />
                <span>
                  Ruang Lingkup / Jenis Sertifikasi {formData.pengajuan.length > 1 ? `(Pengajuan #${activePengajuanIdx + 1})` : ""}
                </span>
              </div>
              {formData.pengajuan.length > 1 && (
                <span className="text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full">
                  {currentPengajuan.jenis_pengajuan === "baru" ? "Pengajuan Baru" : "Perpanjangan"}
                </span>
              )}
            </div>

            <div>
              <FieldLabel required>Pilih Ruang Lingkup Sertifikasi</FieldLabel>
              <select
                value={currentPengajuan.skema_id || ""}
                onChange={(e) => {
                  const strVal = e.target.value
                  setFormData((prev) => {
                    const updated = [...prev.pengajuan]
                    const targetP = updated[activePengajuanIdx] || updated[0]
                    updated[activePengajuanIdx] = { ...targetP, skema_id: strVal }
                    return { ...prev, pengajuan: updated }
                  })
                  setSelectedKomoditiId("")
                  setSelectedKomoditiObj(null)
                }}
                className={selectClass}
              >
                <option value="">-- Pilih Ruang Lingkup Sertifikasi --</option>
                {kategoriList.map((item: any) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.lingkup || item.nama || item.jenis_layanan}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bagian Komoditas & Dokumen Persyaratan hanya muncul jika Ruang Lingkup sudah dipilih */}
          {Boolean(activeSkemaId) && (
            <>
              {/* 2. Form Data Komoditas (Hanya untuk pengajuan baru, tidak perlu untuk perpanjangan) */}
              {currentPengajuan.jenis_pengajuan !== "lama" && (
                <div className="rounded-xl border border-slate-200 bg-white shadow-none overflow-hidden">
                  <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      {editingIndex !== null ? "Edit Data Komoditas" : "Data Komoditas"}
                    </h3>
                    {editingIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingIndex(null)
                          setSelectedKomoditiId("")
                          setSelectedKomoditiObj(null)
                          setFormMerek("")
                          setFormTipe("")
                          setFormUkuran("")
                          setFormJumlahProduksi("")
                          setFormSatuanProduksi("")
                          setFormKeterangan("")
                        }}
                        className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Batal Edit
                      </button>
                    )}
                  </div>

                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Komoditi */}
                      <div>
                        <FieldLabel required>Komoditi</FieldLabel>
                        <select
                          value={selectedKomoditiId}
                          onChange={(e) => handleSelectKomoditi(e.target.value)}
                          disabled={!activeSkemaId || isKomoditiLoading}
                          className={selectClass}
                        >
                          <option value="">
                            {isKomoditiLoading ? "-- Memuat Komoditi... --" : "-- Pilih Komoditi --"}
                          </option>
                          {komoditiOptions.map((k: KomoditiMasterItem) => (
                            <option key={k.id} value={String(k.id)}>
                              {k.nama}
                            </option>
                          ))}
                        </select>
                        {!activeSkemaId && (
                          <FieldHint>Pilih ruang lingkup sertifikasi di atas terlebih dahulu.</FieldHint>
                        )}
                      </div>

                      {/* Ukuran */}
                      <div>
                        <FieldLabel required>Ukuran</FieldLabel>
                        <input
                          type="text"
                          value={formUkuran}
                          onChange={(e) => setFormUkuran(e.target.value)}
                          placeholder="Contoh: 39-44 / Diameter 2 inch"
                          className={inputClass}
                        />
                      </div>

                      {/* No SNI */}
                      <div>
                        <FieldLabel>No SNI</FieldLabel>
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={selectedKomoditiObj?.sni || ""}
                          placeholder="-"
                          className={cx(inputClass, "bg-slate-50 text-slate-500 cursor-not-allowed")}
                        />
                        <FieldHint>Otomatis terisi berdasarkan komoditi</FieldHint>
                      </div>

                      {/* Jumlah Produksi/Tahun */}
                      <div>
                        <FieldLabel required>Jumlah Produksi/Tahun</FieldLabel>
                        <input
                          type="number"
                          value={formJumlahProduksi}
                          onChange={(e) => setFormJumlahProduksi(e.target.value)}
                          placeholder="Contoh: 10000"
                          className={inputClass}
                        />
                      </div>

                      {/* Merek */}
                      <div>
                        <FieldLabel required>Merek</FieldLabel>
                        <input
                          type="text"
                          value={formMerek}
                          onChange={(e) => setFormMerek(e.target.value)}
                          placeholder="Contoh: Brand XYZ"
                          className={inputClass}
                        />
                      </div>

                      {/* Satuan Produksi */}
                      <div>
                        <FieldLabel required>Satuan Produksi</FieldLabel>
                        <input
                          type="text"
                          value={formSatuanProduksi}
                          onChange={(e) => setFormSatuanProduksi(e.target.value)}
                          placeholder="Contoh: Pcs / Pasang / Unit / Ton"
                          className={inputClass}
                        />
                      </div>

                      {/* Tipe */}
                      <div>
                        <FieldLabel required>Tipe</FieldLabel>
                        <input
                          type="text"
                          value={formTipe}
                          onChange={(e) => setFormTipe(e.target.value)}
                          placeholder="Contoh: Type A, Low Cut"
                          className={inputClass}
                        />
                      </div>

                      {/* Keterangan */}
                      <div>
                        <FieldLabel required>Keterangan</FieldLabel>
                        <input
                          type="text"
                          value={formKeterangan}
                          onChange={(e) => setFormKeterangan(e.target.value)}
                          placeholder="Tambahkan keterangan spesifik bila ada"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="button"
                        onClick={handleAddOrUpdateKomoditi}
                        leftIcon={editingIndex === null ? <Plus className="w-4 h-4" /> : undefined}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-6 py-2.5 shadow-none"
                      >
                        {editingIndex !== null ? "Simpan Perubahan" : "Tambah"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Daftar Komoditi Permohonan (Tabel) */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-none overflow-hidden">
                <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Daftar Komoditi Permohonan {formData.pengajuan.length > 1 ? `(Pengajuan #${activePengajuanIdx + 1})` : ""}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {currentPengajuan.jenis_pengajuan === "lama"
                          ? "Daftar komoditi mengacu pada data sertifikat yang diperpanjang."
                          : "Tambahkan satu atau lebih komoditi yang diajukan untuk proses sertifikasi."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-3 w-10 text-center">NO</th>
                        <th className="py-3 px-4 min-w-[140px]">KOMODITI</th>
                        <th className="py-3 px-3 min-w-[120px]">NO SNI</th>
                        <th className="py-3 px-3 min-w-[100px]">MEREK</th>
                        <th className="py-3 px-3 min-w-[90px]">TIPE</th>
                        <th className="py-3 px-3 min-w-[90px]">UKURAN</th>
                        <th className="py-3 px-3 min-w-[120px]">PRODUKSI / TAHUN</th>
                        <th className="py-3 px-4 min-w-[120px]">KETERANGAN</th>
                        {currentPengajuan.jenis_pengajuan !== "lama" && (
                          <th className="py-3 px-3 w-20 text-center">AKSI</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {itemsList.length === 0 ? (
                        <tr>
                          <td
                            colSpan={currentPengajuan.jenis_pengajuan !== "lama" ? 9 : 8}
                            className="py-12 px-4 text-center"
                          >
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                                <Package className="w-6 h-6" />
                              </div>
                              <p className="text-xs font-bold text-slate-700">
                                Belum ada data komoditi yang ditambahkan
                              </p>
                              <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed">
                                {currentPengajuan.jenis_pengajuan === "lama" ? (
                                  "Data komoditas dari sertifikat sebelumnya belum ditemukan."
                                ) : (
                                  <>
                                    Silakan isi formulir di atas dan klik tombol{" "}
                                    <span className="font-semibold text-brand-600">"Tambah"</span>.
                                  </>
                                )}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        itemsList.map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-3 text-center font-semibold text-slate-500">{idx + 1}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-800">{item.nama_produk}</td>
                            <td className="py-3.5 px-3 text-slate-700">
                              {item.standar_sni_iso || "-"}
                            </td>
                            <td className="py-3.5 px-3 text-slate-700">{item.merk_dagang || "-"}</td>
                            <td className="py-3.5 px-3 text-slate-700">{item.tipe_jenis || "-"}</td>
                            <td className="py-3.5 px-3 text-slate-700">{item.ukuran || "-"}</td>
                            <td className="py-3.5 px-3 text-slate-700 font-semibold">
                              {item.kapasitas_produksi ? `${item.kapasitas_produksi} ${item.satuan_produksi || ""}` : "-"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">{item.keterangan || "-"}</td>
                            {currentPengajuan.jenis_pengajuan !== "lama" && (
                              <td className="py-3.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleEditItem(idx)}
                                    className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors cursor-pointer"
                                    title="Edit Komoditi"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteItem(idx)}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                    title="Hapus Komoditi"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Kelengkapan Dokumen Persyaratan (Tabel) */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-none overflow-hidden">
                <div className="bg-slate-50/90 px-6 py-3.5 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900">
                    Kelengkapan Dokumen Persyaratan {formData.pengajuan.length > 1 ? `(Pengajuan #${activePengajuanIdx + 1})` : ""}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Silakan unggah dokumen persyaratan yang diperlukan untuk permohonan sertifikasi ini.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4 w-12 text-center">NO</th>
                        <th className="py-3 px-4 min-w-[240px]">DOKUMEN</th>
                        <th className="py-3 px-4 min-w-[180px]">UPLOAD</th>
                        <th className="py-3 px-4 min-w-[220px]">DOKUMEN ANDA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {docList.map((doc, idx) => (
                        <tr key={doc.id || idx} className="hover:bg-slate-50/70 transition-colors">
                          {/* NO */}
                          <td className="py-4 px-4 text-center font-semibold text-slate-500">
                            {idx + 1}
                          </td>

                          {/* DOKUMEN */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-800 text-xs">
                                  {doc.nama}
                                </span>
                                {doc.wajib ? (
                                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 rounded">
                                    Wajib
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">
                                    Opsional
                                  </span>
                                )}
                              </div>
                              {doc.keterangan && (
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                  {doc.keterangan}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* UPLOAD */}
                          <td className="py-4 px-4">
                            <label
                              className={`relative inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-semibold shadow-none transition-all ${uploadingDocId === doc.id
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
                                  <span>{doc.file || doc.fileName || doc.fileUrl ? "Ganti File" : "Pilih File"}</span>
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
                          </td>

                          {/* DOKUMEN ANDA */}
                          <td className="py-4 px-4">
                            {doc.fileName || doc.file || doc.fileUrl ? (
                              <div className="flex items-center justify-between gap-2 p-2 bg-emerald-50/80 border border-emerald-200 rounded-xl max-w-[280px]">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-emerald-900 truncate max-w-[160px]" title={doc.fileName || doc.file?.name}>
                                      {doc.fileName || doc.file?.name || "Dokumen Terunggah"}
                                    </p>
                                    {doc.fileSize && (
                                      <span className="text-[10px] text-emerald-600 block">
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
                                      className="p-1 text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors"
                                      title="Lihat Berkas"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDokumen(doc.id)}
                                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                    title="Hapus Berkas"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${doc.wajib
                                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                                    : "bg-slate-100 text-slate-500"
                                  }`}
                              >
                                {doc.wajib ? "Wajib diunggah" : "Opsional"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </StepPanel>

      {/* Navigasi Lanjut & Kembali */}
      <WizardNav onBack={onBack} onNext={onNext} nextLabel="Selanjutnya" backLabel="Sebelumnya" />
    </div>
  )
}

export default Step2KategoriDanKomoditi
