import React from "react"
import {
  SertifikasiFormData,
  SertifikasiProductItem,
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
} from "lucide-react"

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

  // File upload per pengajuan
  const handleFileUpload = (
    pIdx: number,
    field: "dok_legalitas" | "dok_manual_mutu" | "dok_diagram_alir" | "dok_lainnya",
    file: File | null
  ) => {
    setFormData((prev) => {
      const updated = [...prev.pengajuan]
      updated[pIdx] = { ...updated[pIdx], [field]: file }
      return { ...prev, pengajuan: updated }
    })
  }

  return (
    <div className="space-y-8">
      {formData.pengajuan.map((p, pIdx) => {
        const selectedSkema = skemaList.find((s) => s.id === p.skema_id)

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
                    Tentukan ruang lingkup sertifikasi, komoditi produk SNI/ISO, dan unggah berkas kelengkapan.
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
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
                            placeholder="Contoh: Sepatu Pengaman Kulit / Ban Kendaraan"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Merk Dagang
                          </label>
                          <input
                            type="text"
                            value={item.merk_dagang || ""}
                            onChange={(e) =>
                              updateProductItem(pIdx, itemIdx, "merk_dagang", e.target.value)
                            }
                            placeholder="Contoh: Brand X / SafetyMax"
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
                            placeholder="Contoh: High-Cut Heavy Duty Seri 808"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Nomor Standar SNI / ISO
                          </label>
                          <input
                            type="text"
                            value={item.standar_sni_iso || ""}
                            onChange={(e) =>
                              updateProductItem(pIdx, itemIdx, "standar_sni_iso", e.target.value)
                            }
                            placeholder="Contoh: SNI 7079:2009 / SNI 0111:2020"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-semibold text-slate-700 mb-1">
                            Ruang Lingkup / Kapasitas Produksi
                          </label>
                          <input
                            type="text"
                            value={item.ruang_lingkup || ""}
                            onChange={(e) =>
                              updateProductItem(pIdx, itemIdx, "ruang_lingkup", e.target.value)
                            }
                            placeholder="Contoh: Kapasitas 50.000 pasang/tahun, cakupan ukuran 38-45"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Kelengkapan Berkas Dokumen */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <FileUp className="w-4 h-4 text-brand-600" />
                  <h4 className="text-xs font-bold text-slate-900">
                    Unggah Dokumen Persyaratan Sertifikasi
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dokumen Legalitas */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          1. Dokumen Legalitas Usaha
                        </span>
                        <span className="text-[11px] text-slate-500">
                          NIB / Izin Usaha Industri / NPWP / Akta Pendirian
                        </span>
                      </div>
                      {p.dok_legalitas && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(pIdx, "dok_legalitas", e.target.files?.[0] || null)}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                    {p.dok_legalitas && (
                      <p className="text-[10px] text-brand-600 font-medium truncate">
                        File: {p.dok_legalitas.name}
                      </p>
                    )}
                  </div>

                  {/* Dokumen Manual Mutu */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          2. Manual Mutu / Prosedur Mutu
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Dokumen manual ISO 9001 / pedoman mutu pabrik
                        </span>
                      </div>
                      {p.dok_manual_mutu && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(pIdx, "dok_manual_mutu", e.target.files?.[0] || null)}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                    {p.dok_manual_mutu && (
                      <p className="text-[10px] text-brand-600 font-medium truncate">
                        File: {p.dok_manual_mutu.name}
                      </p>
                    )}
                  </div>

                  {/* Dokumen Diagram Alir */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          3. Diagram Alir Proses Produksi
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Flowchart proses pembuatan produk & titik kendali kritis
                        </span>
                      </div>
                      {p.dok_diagram_alir && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(pIdx, "dok_diagram_alir", e.target.files?.[0] || null)}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                    {p.dok_diagram_alir && (
                      <p className="text-[10px] text-brand-600 font-medium truncate">
                        File: {p.dok_diagram_alir.name}
                      </p>
                    )}
                  </div>

                  {/* Dokumen Tambahan */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          4. Dokumen Tambahan / Sertifikat Terkait
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Daftar mesin, alat uji laboratorium, atau sertifikat lama
                        </span>
                      </div>
                      {p.dok_lainnya && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(pIdx, "dok_lainnya", e.target.files?.[0] || null)}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                    />
                    {p.dok_lainnya && (
                      <p className="text-[10px] text-brand-600 font-medium truncate">
                        File: {p.dok_lainnya.name}
                      </p>
                    )}
                  </div>
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
