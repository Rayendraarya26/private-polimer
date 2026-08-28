import React, { useEffect } from "react"
import {
  SertifikasiFormData,
  SertifikasiProductItem,
  DokumenPersyaratanItem,
  defaultDokumenList,
  emptyProductItem,
} from "../../../types/sertifikasi"
import { Card, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import {
  Sparkles,
  Package,
  Plus,
  Trash2,
  FileUp,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Tag,
  Award,
  Layers,
  Download,
  Building,
  AlertCircle,
  FileCheck,
} from "lucide-react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  skemaList: any[]
  onNext: () => void
  onBack: () => void
}

export const Step2KategoriDanKomoditi: React.FC<Props> = ({
  formData,
  setFormData,
  skemaList,
  onNext,
  onBack,
}) => {
  const { profile } = useProfileQuery()
  const detailPerusahaan = profile?.detail

  // Auto-populate dokumen legalitas dari profil perusahaan (Akta & NIB)
  useEffect(() => {
    if (!detailPerusahaan) return

    setFormData((prev) => {
      let changed = false
      const updatedPengajuan = prev.pengajuan.map((p) => {
        const docList = p.dokumen_list && p.dokumen_list.length > 0 
          ? [...p.dokumen_list] 
          : defaultDokumenList.map((d) => ({ ...d }))

        const updatedDocs = docList.map((doc) => {
          if (doc.id === "legalitas_perusahaan" && detailPerusahaan.dok_akta_pendirian && !doc.file && !doc.isFromProfile) {
            changed = true
            return {
              ...doc,
              isFromProfile: true,
            }
          }
          if (doc.id === "nib_iui" && detailPerusahaan.dok_nib && !doc.file && !doc.isFromProfile) {
            changed = true
            return {
              ...doc,
              isFromProfile: true,
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

  const setSkemaId = (pIdx: number, skemaId: string) => {
    setFormData((prev) => {
      const updated = [...prev.pengajuan]
      updated[pIdx] = { ...updated[pIdx], skema_id: skemaId }
      return { ...prev, pengajuan: updated }
    })
  }

  // Multi-Item Komoditi management per pengajuan
  const addProductItem = (pIdx: number) => {
    setFormData((prev) => {
      const updated = [...prev.pengajuan]
      const currentItems = updated[pIdx].items || []
      updated[pIdx] = {
        ...updated[pIdx],
        items: [...currentItems, emptyProductItem(Date.now())],
      }
      return { ...prev, pengajuan: updated }
    })
  }

  const removeProductItem = (pIdx: number, itemIdx: number) => {
    setFormData((prev) => {
      const updated = [...prev.pengajuan]
      const currentItems = updated[pIdx].items || []
      if (currentItems.length <= 1) return prev
      updated[pIdx] = {
        ...updated[pIdx],
        items: currentItems.filter((_, i) => i !== itemIdx),
      }
      return { ...prev, pengajuan: updated }
    })
  }

  const updateProductItem = (
    pIdx: number,
    itemIdx: number,
    field: keyof SertifikasiProductItem,
    value: any
  ) => {
    setFormData((prev) => {
      const updated = [...prev.pengajuan]
      const currentItems = [...(updated[pIdx].items || [])]
      currentItems[itemIdx] = { ...currentItems[itemIdx], [field]: value }
      updated[pIdx] = { ...updated[pIdx], items: currentItems }
      return { ...prev, pengajuan: updated }
    })
  }

  // Structured Document upload handler
  const handleDocumentFileUpload = (
    pIdx: number,
    docId: string,
    file: File | null
  ) => {
    setFormData((prev) => {
      const updated = [...prev.pengajuan]
      const docList = updated[pIdx].dokumen_list || defaultDokumenList.map((d) => ({ ...d }))
      const updatedDocs = docList.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            file: file,
            isFromProfile: file ? false : doc.isFromProfile,
          }
        }
        return doc
      })
      updated[pIdx] = { ...updated[pIdx], dokumen_list: updatedDocs }

      // Map to legacy fields if applicable
      if (docId === "legalitas_perusahaan" || docId === "nib_iui") {
        updated[pIdx].dok_legalitas = file
      } else if (docId === "sistem_mutu") {
        updated[pIdx].dok_manual_mutu = file
      } else if (docId === "alur_produksi") {
        updated[pIdx].dok_diagram_alir = file
      } else if (docId === "dok_lainnya") {
        updated[pIdx].dok_lainnya = file
      }

      return { ...prev, pengajuan: updated }
    })
  }

  return (
    <div className="space-y-8">
      {formData.pengajuan.map((p, pIdx) => {
        const selectedSkema = skemaList.find((s) => s.id === p.skema_id)
        const docList = p.dokumen_list && p.dokumen_list.length > 0 
          ? p.dokumen_list 
          : defaultDokumenList

        return (
          <Card key={p.id || pIdx} className="border-slate-200 shadow-soft overflow-hidden">
            {/* Header Pengajuan */}
            <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                  {pIdx + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    Pengajuan #{pIdx + 1} ({p.jenis_pengajuan === "baru" ? "Sertifikat Baru" : `Perpanjangan: ${p.sertifikat_lama_text || "-"}`})
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Tentukan ruang lingkup sertifikasi, rincian produk SNI/ISO, dan unggah dokumen persyaratan.
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* 1. Pilih Ruang Lingkup Sertifikasi */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Ruang Lingkup / Jenis Sertifikasi <span className="text-rose-500">*</span>
                </label>
                <select
                  value={p.skema_id}
                  onChange={(e) => setSkemaId(pIdx, e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                >
                  <option value="">-- Pilih Ruang Lingkup Sertifikasi --</option>
                  {skemaList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.lingkup || item.nama}
                    </option>
                  ))}
                </select>
                {selectedSkema && (
                  <p className="text-[11px] text-brand-600 font-medium flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Skema terpilih: {selectedSkema.lingkup || selectedSkema.nama}
                  </p>
                )}
              </div>

              {/* 2. Daftar Komoditas Produk (Multi-Item) */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-600" />
                    <h4 className="text-xs font-bold text-slate-900">
                      Rincian Komoditi / Produk yang Diajukan
                    </h4>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addProductItem(pIdx)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    className="text-xs font-semibold text-brand-700 border-brand-200 hover:bg-brand-50"
                  >
                    Tambah Item Produk
                  </Button>
                </div>

                <div className="space-y-4">
                  {(p.items || []).map((item, itemIdx) => (
                    <div
                      key={item.id || itemIdx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                        <span className="text-xs font-bold text-brand-700 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" /> Item Produk #{itemIdx + 1}
                        </span>
                        {(p.items || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProductItem(pIdx, itemIdx)}
                            className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Hapus Item
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Nama Produk / Komoditi <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={item.nama_produk}
                            onChange={(e) =>
                              updateProductItem(pIdx, itemIdx, "nama_produk", e.target.value)
                            }
                            placeholder="Contoh: Sepatu Pengaman Kulit"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Merk Dagang <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={item.merk_dagang || ""}
                            onChange={(e) =>
                              updateProductItem(pIdx, itemIdx, "merk_dagang", e.target.value)
                            }
                            placeholder="Contoh: SafetyMax"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Tipe / Jenis / Seri
                          </label>
                          <input
                            type="text"
                            value={item.tipe_jenis || ""}
                            onChange={(e) =>
                              updateProductItem(pIdx, itemIdx, "tipe_jenis", e.target.value)
                            }
                            placeholder="Contoh: High-Cut Seri 808"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Ukuran / Spesifikasi
                          </label>
                          <input
                            type="text"
                            value={item.ukuran || ""}
                            onChange={(e) =>
                              updateProductItem(pIdx, itemIdx, "ukuran", e.target.value)
                            }
                            placeholder="Contoh: 38 - 45 / Diameter 15 mm"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Nomor Standar SNI / ISO <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={item.standar_sni_iso || ""}
                            onChange={(e) =>
                              updateProductItem(pIdx, itemIdx, "standar_sni_iso", e.target.value)
                            }
                            placeholder="Contoh: SNI 7079:2009"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Satuan Produksi
                          </label>
                          <select
                            value={item.satuan_produksi || "Unit/Tahun"}
                            onChange={(e) =>
                              updateProductItem(pIdx, itemIdx, "satuan_produksi", e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          >
                            <option value="Unit/Tahun">Unit/Tahun</option>
                            <option value="Pasang/Tahun">Pasang/Tahun</option>
                            <option value="Pcs/Tahun">Pcs/Tahun</option>
                            <option value="Ton/Tahun">Ton/Tahun</option>
                            <option value="Kg/Tahun">Kg/Tahun</option>
                            <option value="Liter/Tahun">Liter/Tahun</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Kapasitas Produksi / Tahun
                          </label>
                          <input
                            type="text"
                            value={item.kapasitas_produksi || ""}
                            onChange={(e) =>
                              updateProductItem(pIdx, itemIdx, "kapasitas_produksi", e.target.value)
                            }
                            placeholder="Contoh: 50.000"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-semibold text-slate-700 mb-1">
                            Keterangan Tambahan / Ruang Lingkup
                          </label>
                          <input
                            type="text"
                            value={item.keterangan || item.ruang_lingkup || ""}
                            onChange={(e) => {
                              updateProductItem(pIdx, itemIdx, "keterangan", e.target.value)
                              updateProductItem(pIdx, itemIdx, "ruang_lingkup", e.target.value)
                            }}
                            placeholder="Keterangan spesifikasi khusus atau cakupan audit"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Kelengkapan Berkas Dokumen Persyaratan BBSPJIKKP */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileUp className="w-4 h-4 text-brand-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Unggah Dokumen Persyaratan Sertifikasi
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Format berkas yang didukung: PDF, JPG, PNG (Maks. 10MB per file)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {docList.map((doc) => {
                    const isUploaded = !!doc.file
                    const isFromProfile = !!doc.isFromProfile && !doc.file

                    return (
                      <div
                        key={doc.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isUploaded || isFromProfile
                            ? "border-emerald-200 bg-emerald-50/30 ring-1 ring-emerald-500/10"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        } space-y-2`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-800">
                                {doc.nama}
                              </span>
                              {doc.wajib && (
                                <span className="text-rose-500 text-xs font-bold">*</span>
                              )}
                              {isFromProfile && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center gap-1">
                                  <FileCheck className="w-3 h-3" /> Tersedia dari Profil
                                </span>
                              )}
                              {isUploaded && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Terunggah
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {doc.keterangan}
                            </p>
                          </div>
                        </div>

                        {doc.templateUrl && (
                          <div className="pt-1">
                            <a
                              href={doc.templateUrl}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                            >
                              <Download className="w-3.5 h-3.5" /> Unduh Template Resmi (.docx)
                            </a>
                          </div>
                        )}

                        <div className="pt-1">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                            onChange={(e) =>
                              handleDocumentFileUpload(pIdx, doc.id, e.target.files?.[0] || null)
                            }
                            className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                          />
                          {doc.file && (
                            <p className="text-[10px] text-brand-600 font-medium truncate mt-1">
                              File dipilih: {doc.file.name} ({(doc.file.size / 1024).toFixed(1)} KB)
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Kembali ke Langkah 1
        </Button>
        <Button
          type="button"
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="px-6"
        >
          Lanjut ke Langkah 3
        </Button>
      </div>
    </div>
  )
}

export default Step2KategoriDanKomoditi
