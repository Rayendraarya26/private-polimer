import React from "react"
import { SertifikasiFormData, emptyProductItem } from "../../../../types/sertifikasi"
import { Card, CardContent } from "../../../ui/Card"
import { Package, Plus, Trash2, Tag, Award, Bookmark } from "lucide-react"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  onNext: () => void
  onBack: () => void
}

const SNI_PRESETS = [
  "SNI 0111:2009 (Sol Sepatu Karet)",
  "SNI 06-0084-2002 (Pipa PVC untuk Air Minum)",
  "SNI 1811:2007 (Helm Pengendara Kendaraan Bermotor)",
  "SNI 0098:2012 (Ban Mobil Penumpang)",
  "SNI ISO 9001:2015 (Sistem Manajemen Mutu)",
  "SNI ISO 14001:2015 (Sistem Manajemen Lingkungan)",
  "Standar Lainnya / Custom",
]

export const StepDataProduk: React.FC<Props> = ({ formData, setFormData, onNext, onBack }) => {
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, emptyProductItem(Date.now())],
    }))
  }

  const removeItem = (index: number) => {
    if (formData.items.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const updateItem = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.items]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, items: updated }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-600" />
            Daftar Produk / Komoditi Multi-Item
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tambahkan satu atau lebih produk yang ingin diajukan dalam satu berkas permohonan sertifikasi.
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold rounded-xl border border-brand-200 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Produk / Komoditi
        </button>
      </div>

      {formData.items.map((item, idx) => (
        <Card key={item.id || idx} className="border-slate-200/80 shadow-xs">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                Produk #{idx + 1}
              </span>

              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-rose-500 hover:text-rose-700 text-xs font-medium flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Item
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Produk / Komoditi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={item.nama_produk}
                    onChange={(e) => updateItem(idx, "nama_produk", e.target.value)}
                    placeholder="Contoh: Sepatu Pengaman Karet (Safety Shoes)"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <Package className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Merk Dagang (Brand)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={item.merk_dagang || ""}
                    onChange={(e) => updateItem(idx, "merk_dagang", e.target.value)}
                    placeholder="Contoh: KaretPro / StarFlex"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipe / Model / Varian
                </label>
                <input
                  type="text"
                  value={item.tipe_jenis || ""}
                  onChange={(e) => updateItem(idx, "tipe_jenis", e.target.value)}
                  placeholder="Contoh: Model Oxford, Tipe A & B, Ukuran 38-44"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Standar Acuan (SNI / ISO) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list={`sni-presets-${idx}`}
                    value={item.standar_sni_iso || ""}
                    onChange={(e) => updateItem(idx, "standar_sni_iso", e.target.value)}
                    placeholder="Ketik atau pilih nomor SNI acuan..."
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <Award className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
                  <datalist id={`sni-presets-${idx}`}>
                    {SNI_PRESETS.map((sni, i) => (
                      <option key={i} value={sni} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ruang Lingkup / Spesifikasi Teknis Khusus
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={item.ruang_lingkup || ""}
                    onChange={(e) => updateItem(idx, "ruang_lingkup", e.target.value)}
                    placeholder="Rincian dimensi, formula material, spesifikasi uji laboratorium yang dipersyaratkan..."
                    className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <Bookmark className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
        >
          &larr; Kembali
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-600/20 transition-all"
        >
          Lanjut ke Upload Berkas &rarr;
        </button>
      </div>
    </div>
  )
}

export default StepDataProduk
