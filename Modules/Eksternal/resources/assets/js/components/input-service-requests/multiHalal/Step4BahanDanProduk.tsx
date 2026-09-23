import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { FormHalalPayload, BahanHalalItem, ProdukHalalItem } from "../../../types/halal"
import {
  Boxes,
  Plus,
  Trash2,
  Package,
  Layers,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
} from "lucide-react"

interface Step4Props {
  payload: FormHalalPayload
  onChange: (updater: (prev: FormHalalPayload) => FormHalalPayload) => void
}

const JENIS_BAHAN_OPTIONS = [
  "Bahan Baku",
  "Bahan Tambahan/Penolong",
  "Cleaning Agent",
  "Kemasan",
]

const KLASIFIKASI_PRODUK_OPTIONS = [
  "Makanan",
  "Minuman",
  "Produk Olahan Daging / Ikan",
  "Produk Bakeri / Kue",
  "Bumbu & Rempah",
  "Snack / Keripik",
  "Barang Gunaan",
  "Lainnya",
]

export const Step4BahanDanProduk: React.FC<Step4Props> = ({ payload, onChange }) => {
  const isSelfDeclare = payload.dataPengajuan.jalur_pendaftaran === "self_declare"
  const bahanList = payload.dataBahan || []
  const produkList = payload.dataProduk || []

  // Helper tambah bahan
  const handleAddBahan = () => {
    const newBahan: BahanHalalItem = {
      id: `bahan-${Date.now()}`,
      jenis_bahan: "Bahan Baku",
      nama_bahan: "",
      produsen: "",
      supplier: "",
      lembaga_penerbit: "BPJPH",
      no_sertifikat: "",
      tgl_berlaku: "",
      is_bersertifikat: true,
    }
    onChange((prev) => ({
      ...prev,
      dataBahan: [...prev.dataBahan, newBahan],
    }))
  }

  // Helper update bahan
  const handleUpdateBahan = (id: string, field: keyof BahanHalalItem, value: any) => {
    onChange((prev) => ({
      ...prev,
      dataBahan: prev.dataBahan.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    }))
  }

  // Helper hapus bahan
  const handleRemoveBahan = (id: string) => {
    if (bahanList.length <= 1) return
    onChange((prev) => ({
      ...prev,
      dataBahan: prev.dataBahan.filter((b) => b.id !== id),
    }))
  }

  // Helper tambah produk
  const handleAddProduk = () => {
    if (isSelfDeclare && produkList.length >= 10) {
      alert("Untuk jalur Self Declare (SEHATI), maksimal produk yang dapat didaftarkan dalam 1 permohonan adalah 10 produk.")
      return
    }
    const newProduk: ProdukHalalItem = {
      id: `prod-${Date.now()}`,
      klasifikasi: "Makanan",
      rincian: "",
      nama_produk: "",
      merk: "",
      foto: null,
    }
    onChange((prev) => ({
      ...prev,
      dataProduk: [...prev.dataProduk, newProduk],
    }))
  }

  // Helper update produk
  const handleUpdateProduk = (id: string, field: keyof ProdukHalalItem, value: any) => {
    onChange((prev) => ({
      ...prev,
      dataProduk: prev.dataProduk.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }))
  }

  // Helper hapus produk
  const handleRemoveProduk = (id: string) => {
    if (produkList.length <= 1) return
    onChange((prev) => ({
      ...prev,
      dataProduk: prev.dataProduk.filter((p) => p.id !== id),
    }))
  }

  // Cek apakah ada cleaning agent dan kemasan (khusus Self-Declare)
  const hasCleaningAgent = bahanList.some(
    (b) => b.jenis_bahan.toLowerCase().includes("cleaning") || b.jenis_bahan.toLowerCase().includes("sabun")
  )
  const hasKemasan = bahanList.some((b) => b.jenis_bahan.toLowerCase().includes("kemasan"))

  return (
    <Card className="border-brand-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <Boxes className="w-4 h-4 text-brand-600" />
              4. Bahan, Kemasan, Produk & Alur Proses Halal (PPH)
            </CardTitle>
            <CardDescription>
              Daftarkan seluruh rincian bahan baku/penolong/pembersih, produk yang diajukan sertifikasi, serta bagan alur proses produksi halal
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Section 1: Data Bahan & Kemasan */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                <Boxes className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  Daftar Bahan, Kemasan & Cleaning Agent
                </h4>
                <p className="text-[11px] text-slate-500">
                  Cantumkan semua bahan baku, bahan penolong, bahan pembersih (cleaning agent), dan kemasan kontak pangan
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddBahan}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Bahan
            </button>
          </div>
          {isSelfDeclare && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Ketentuan Bahan Jalur Self Declare (SEHATI BPJPH):
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-amber-800">
                <li>Minimal mencakup 3 unsur: <strong>Bahan Baku Utama</strong>, <strong>Bahan Pembersih / Cleaning Agent</strong>, dan <strong>Kemasan Primer</strong>.</li>
                <li>Bahan kritis wajib sudah bersertifikat halal (BPJPH/MUI) atau termasuk dalam daftar <em>Positive List</em> KMA 1360 (bahan alami tidak berisiko).</li>
              </ul>
              <div className="flex items-center gap-3 pt-1 text-[11px]">
                <span className={`inline-flex items-center gap-1 ${hasCleaningAgent ? "text-emerald-700 font-semibold" : "text-amber-700"}`}>
                  <CheckCircle className={`w-3.5 h-3.5 ${hasCleaningAgent ? "text-emerald-600" : "text-slate-300"}`} /> Cleaning Agent
                </span>
                <span className={`inline-flex items-center gap-1 ${hasKemasan ? "text-emerald-700 font-semibold" : "text-amber-700"}`}>
                  <CheckCircle className={`w-3.5 h-3.5 ${hasKemasan ? "text-emerald-600" : "text-slate-300"}`} /> Bahan Kemasan
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {bahanList.map((bahan, idx) => (
              <div
                key={bahan.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-brand-200 transition-all shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {bahan.nama_bahan || `Bahan #${idx + 1}`}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                      {bahan.jenis_bahan}
                    </span>
                  </div>
                  {bahanList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBahan(bahan.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                      title="Hapus Bahan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Kategori Bahan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={bahan.jenis_bahan}
                      onChange={(e) => handleUpdateBahan(bahan.id, "jenis_bahan", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      {JENIS_BAHAN_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Bahan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Tepung Tapioka / Sunco"
                      value={bahan.nama_bahan}
                      onChange={(e) => handleUpdateBahan(bahan.id, "nama_bahan", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Produsen / Pabrik Pembuat
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: PT Bogasari Flour Mills"
                      value={bahan.produsen}
                      onChange={(e) => handleUpdateBahan(bahan.id, "produsen", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Pemasok / Supplier
                    </label>
                    <input
                      type="text"
                      placeholder="Toko Bahan Kue / Distributor"
                      value={bahan.supplier || ""}
                      onChange={(e) => handleUpdateBahan(bahan.id, "supplier", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {/* Status Sertifikat Halal Bahan */}
                <div className="pt-2 border-t border-dashed border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-slate-700">
                      Status Sertifikasi Halal Bahan:
                    </span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-700">
                        <input
                          type="radio"
                          name={`is_bersertifikat_${bahan.id}`}
                          checked={bahan.is_bersertifikat === true}
                          onChange={() => handleUpdateBahan(bahan.id, "is_bersertifikat", true)}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span>Sudah Bersertifikat Halal</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-700">
                        <input
                          type="radio"
                          name={`is_bersertifikat_${bahan.id}`}
                          checked={bahan.is_bersertifikat === false}
                          onChange={() => handleUpdateBahan(bahan.id, "is_bersertifikat", false)}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span>Bahan Alami / Positif List (KMA 1360)</span>
                      </label>
                    </div>
                  </div>

                  {bahan.is_bersertifikat ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-lg border border-slate-200/80">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Lembaga Penerbit
                        </label>
                        <input
                          type="text"
                          placeholder="BPJPH / LPPOM MUI"
                          value={bahan.lembaga_penerbit || "BPJPH"}
                          onChange={(e) => handleUpdateBahan(bahan.id, "lembaga_penerbit", e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Nomor Sertifikat Halal
                        </label>
                        <input
                          type="text"
                          placeholder="ID0000000000 / 00..."
                          value={bahan.no_sertifikat || ""}
                          onChange={(e) => handleUpdateBahan(bahan.id, "no_sertifikat", e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Masa Berlaku Sertifikat
                        </label>
                        <input
                          type="date"
                          value={bahan.tgl_berlaku || ""}
                          onChange={(e) => handleUpdateBahan(bahan.id, "tgl_berlaku", e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic bg-slate-100/60 p-2 rounded-md">
                      * Bahan tanpa sertifikat halal diperkenankan hanya untuk bahan alami nabati/mineral murni tanpa proses kimia atau kemasan primer non-kritis (sesuai Keputusan Menteri Agama No. 1360).
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Data Produk yang Didaftarkan */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  Daftar Produk yang Disertifikasi
                </h4>
                <p className="text-[11px] text-slate-500">
                  Rincian varian produk yang dimohonkan sertifikat halalnya {isSelfDeclare && "(Maksimal 10 produk untuk Self Declare)"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddProduk}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Produk
            </button>
          </div>

          <div className="space-y-3">
            {produkList.map((prod, idx) => (
              <div
                key={prod.id}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-brand-200 transition-all shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {prod.nama_produk || `Produk #${idx + 1}`}
                    </span>
                  </div>
                  {produkList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduk(prod.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Klasifikasi Produk <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={prod.klasifikasi}
                      onChange={(e) => handleUpdateProduk(prod.id, "klasifikasi", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      {KLASIFIKASI_PRODUK_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Merk / Brand Dagang <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Keripik Mak Nyus"
                      value={prod.merk || ""}
                      onChange={(e) => handleUpdateProduk(prod.id, "merk", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Lengkap Produk & Varian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Keripik Singkong Rasa Balado Pedas 150g"
                      value={prod.nama_produk}
                      onChange={(e) => handleUpdateProduk(prod.id, "nama_produk", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Rincian Komposisi / Deskripsi Produk
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Singkong, minyak goreng kelapa sawit, cabai bubuk, garam, bawang putih"
                    value={prod.rincian || ""}
                    onChange={(e) => handleUpdateProduk(prod.id, "rincian", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Alur Proses Produksi */}
        <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Alur Proses Produksi Halal (PPH)
              </h4>
              <p className="text-[11px] text-slate-500">
                Uraikan tahapan pembuatan produk dari penerimaan bahan mentah, pengolahan, hingga pengemasan
              </p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Narasi Alur Proses Produksi <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Contoh: 1. Penerimaan bahan baku dan pemeriksaan sertifikat halal -> 2. Pencucian dan pemotongan singkong -> 3. Penggorengan pada suhu 160°C -> 4. Penirisan minyak dan pencampuran bumbu -> 5. Pengemasan dengan sealer dan pengecekan kerapatan -> 6. Penyimpanan di gudang bersih."
              value={payload.alur_proses || ""}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  alur_proses: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unggah Bagan Alur Proses Produksi (Opsional / PDF, JPG, PNG maks 5MB)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-brand-500 transition-colors shadow-xs">
                <Upload className="w-4 h-4 text-slate-500" />
                Pilih File Diagram/Bagan
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null
                    onChange((prev) => ({ ...prev, file_alur_proses: f }))
                  }}
                />
              </label>
              {payload.file_alur_proses ? (
                <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                  <span className="truncate max-w-[200px]">{payload.file_alur_proses.name}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">Belum ada file bagan yang dipilih</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
