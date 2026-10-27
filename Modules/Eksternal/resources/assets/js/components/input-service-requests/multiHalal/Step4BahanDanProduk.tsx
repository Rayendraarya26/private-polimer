import React, { useState } from "react"
import { toast } from "react-hot-toast"
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
  Copy,
} from "lucide-react"
import {
  DropzoneUploader,
  CollapsibleGuideline,
  InfoTooltip,
  FormField,
  TextInput,
  SelectInput,
  DateInput,
  TextareaInput,
} from "../../forms"

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

const JENIS_BAHAN_SELECT_OPTIONS = JENIS_BAHAN_OPTIONS.map((opt) => ({
  value: opt,
  label: opt,
}))

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

const KLASIFIKASI_PRODUK_SELECT_OPTIONS = KLASIFIKASI_PRODUK_OPTIONS.map((opt) => ({
  value: opt,
  label: opt,
}))

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

  // Helper duplikat bahan terakhir
  const handleDuplicateBahan = () => {
    if (bahanList.length === 0) return
    const last = bahanList[bahanList.length - 1]
    const duplicated: BahanHalalItem = {
      ...last,
      id: `bahan-${Date.now()}`,
      nama_bahan: `${last.nama_bahan || "Bahan"} (Salinan)`,
    }
    onChange((prev) => ({
      ...prev,
      dataBahan: [...prev.dataBahan, duplicated],
    }))
    toast.success("Bahan berhasil diduplikasi.")
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
      toast.error("Untuk jalur Self Declare (SEHATI), maksimal produk yang dapat didaftarkan dalam 1 permohonan adalah 10 produk.")
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

  // Helper duplikat produk terakhir
  const handleDuplicateProduk = () => {
    if (produkList.length === 0) return
    if (isSelfDeclare && produkList.length >= 10) {
      toast.error("Untuk jalur Self Declare (SEHATI), maksimal produk yang dapat didaftarkan adalah 10 produk.")
      return
    }
    const last = produkList[produkList.length - 1]
    const duplicated: ProdukHalalItem = {
      ...last,
      id: `prod-${Date.now()}`,
      nama_produk: `${last.nama_produk || "Produk"} (Salinan)`,
      foto: null,
    }
    onChange((prev) => ({
      ...prev,
      dataProduk: [...prev.dataProduk, duplicated],
    }))
    toast.success("Produk berhasil diduplikasi.")
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
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleAddBahan}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Bahan
              </button>
              {bahanList.length > 0 && (
                <button
                  type="button"
                  onClick={handleDuplicateBahan}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplikat Bahan #{bahanList.length}
                </button>
              )}
            </div>
          </div>
          {isSelfDeclare && (
            <CollapsibleGuideline
              title="Ketentuan Bahan Jalur Self Declare (SEHATI BPJPH)"
              badgeText={hasCleaningAgent && hasKemasan ? "Syarat Terpenuhi" : "Perlu Dilengkapi"}
              variant={hasCleaningAgent && hasKemasan ? "emerald" : "amber"}
              expandLabel="Lihat Panduan Bahan"
              collapseLabel="Sembunyikan Panduan"
              summary={
                <div className="flex items-center gap-3 text-xs pt-0.5">
                  <span className={`inline-flex items-center gap-1 font-medium ${hasCleaningAgent ? "text-emerald-700 font-bold" : "text-amber-800"}`}>
                    <CheckCircle className={`w-3.5 h-3.5 ${hasCleaningAgent ? "text-emerald-600" : "text-slate-300"}`} />
                    Cleaning Agent: {hasCleaningAgent ? "Terisi" : "Belum ada"}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className={`inline-flex items-center gap-1 font-medium ${hasKemasan ? "text-emerald-700 font-bold" : "text-amber-800"}`}>
                    <CheckCircle className={`w-3.5 h-3.5 ${hasKemasan ? "text-emerald-600" : "text-slate-300"}`} />
                    Bahan Kemasan: {hasKemasan ? "Terisi" : "Belum ada"}
                  </span>
                </div>
              }
            >
              <div className="space-y-2 pt-1 text-xs">
                <p className="font-semibold text-slate-800">
                  Pastikan daftar bahan memenuhi 3 kriteria wajib BPJPH:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                  <li>Minimal mencakup 3 unsur: <strong>Bahan Baku Utama</strong>, <strong>Bahan Pembersih (Cleaning Agent)</strong>, dan <strong>Kemasan Primer</strong> kontak pangan.</li>
                  <li>Bahan berisiko wajib memiliki sertifikat halal resmi BPJPH / MUI yang masih aktif.</li>
                  <li>Bahan non-kritis (nabati/mineral murni tanpa proses kimia) diperkenankan tanpa sertifikat halal merujuk pada <em>Positive List</em> KMA No. 1360 Tahun 2021.</li>
                </ul>
              </div>
            </CollapsibleGuideline>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Kategori Bahan" required>
                    <SelectInput
                      value={bahan.jenis_bahan}
                      onChange={(val) => handleUpdateBahan(bahan.id, "jenis_bahan", String(val))}
                      options={JENIS_BAHAN_SELECT_OPTIONS}
                      isClearable={false}
                    />
                  </FormField>

                  <FormField label="Nama Bahan" required>
                    <TextInput
                      type="text"
                      placeholder="Contoh: Tepung Tapioka / Sunco"
                      value={bahan.nama_bahan}
                      onChange={(e) => handleUpdateBahan(bahan.id, "nama_bahan", e.target.value)}
                    />
                  </FormField>

                  <FormField label="Produsen / Pabrik Pembuat">
                    <TextInput
                      type="text"
                      placeholder="Contoh: PT Bogasari Flour Mills"
                      value={bahan.produsen}
                      onChange={(e) => handleUpdateBahan(bahan.id, "produsen", e.target.value)}
                    />
                  </FormField>

                  <FormField label="Pemasok / Supplier">
                    <TextInput
                      type="text"
                      placeholder="Toko Bahan Kue / Distributor"
                      value={bahan.supplier || ""}
                      onChange={(e) => handleUpdateBahan(bahan.id, "supplier", e.target.value)}
                    />
                  </FormField>
                </div>

                {/* Status Sertifikat Halal Bahan */}
                <div className="pt-2 border-t border-dashed border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-slate-700">
                      Status Sertifikasi Halal Bahan:
                    </span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                        <input
                          type="radio"
                          name={`is_bersertifikat_${bahan.id}`}
                          checked={bahan.is_bersertifikat === true}
                          onChange={() => handleUpdateBahan(bahan.id, "is_bersertifikat", true)}
                          className="text-brand-600 focus:ring-brand-500 w-4 h-4"
                        />
                        <span>Sudah Bersertifikat Halal</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                        <input
                          type="radio"
                          name={`is_bersertifikat_${bahan.id}`}
                          checked={bahan.is_bersertifikat === false}
                          onChange={() => handleUpdateBahan(bahan.id, "is_bersertifikat", false)}
                          className="text-brand-600 focus:ring-brand-500 w-4 h-4"
                        />
                        <span>Bahan Alami / Positif List (KMA 1360)</span>
                      </label>
                    </div>
                  </div>

                  {bahan.is_bersertifikat ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200/80">
                      <FormField label="Lembaga Penerbit">
                        <TextInput
                          type="text"
                          placeholder="BPJPH / LPPOM MUI"
                          value={bahan.lembaga_penerbit || "BPJPH"}
                          onChange={(e) => handleUpdateBahan(bahan.id, "lembaga_penerbit", e.target.value)}
                        />
                      </FormField>
                      <FormField label="Nomor Sertifikat Halal">
                        <TextInput
                          type="text"
                          placeholder="ID0000000000 / 00..."
                          value={bahan.no_sertifikat || ""}
                          onChange={(e) => handleUpdateBahan(bahan.id, "no_sertifikat", e.target.value)}
                          className="font-mono"
                        />
                      </FormField>
                      <div className="md:col-span-2">
                        <FormField label="Masa Berlaku Sertifikat">
                          <DateInput
                            value={bahan.tgl_berlaku || ""}
                            onChange={(e) => handleUpdateBahan(bahan.id, "tgl_berlaku", e.target.value)}
                          />
                        </FormField>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic bg-slate-100/60 p-3 rounded-xl border border-slate-200/60">
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
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleAddProduk}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Produk
              </button>
              {produkList.length > 0 && (
                <button
                  type="button"
                  onClick={handleDuplicateProduk}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplikat Produk #{produkList.length}
                </button>
              )}
            </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Klasifikasi Produk" required>
                    <SelectInput
                      value={prod.klasifikasi}
                      onChange={(val) => handleUpdateProduk(prod.id, "klasifikasi", String(val))}
                      options={KLASIFIKASI_PRODUK_SELECT_OPTIONS}
                      isClearable={false}
                    />
                  </FormField>

                  <FormField label="Merk / Brand Dagang" required>
                    <TextInput
                      type="text"
                      placeholder="Contoh: Keripik Mak Nyus"
                      value={prod.merk || ""}
                      onChange={(e) => handleUpdateProduk(prod.id, "merk", e.target.value)}
                    />
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Nama Lengkap Produk & Varian" required>
                      <TextInput
                        type="text"
                        placeholder="Contoh: Keripik Singkong Rasa Balado Pedas 150g"
                        value={prod.nama_produk}
                        onChange={(e) => handleUpdateProduk(prod.id, "nama_produk", e.target.value)}
                      />
                    </FormField>
                  </div>

                  <div className="md:col-span-2">
                    <FormField label="Rincian Komposisi / Deskripsi Produk">
                      <TextInput
                        type="text"
                        placeholder="Contoh: Singkong, minyak goreng kelapa sawit, cabai bubuk, garam, bawang putih"
                        value={prod.rincian || ""}
                        onChange={(e) => handleUpdateProduk(prod.id, "rincian", e.target.value)}
                      />
                    </FormField>
                  </div>
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
            <FormField label="Narasi Alur Proses Produksi" required>
              <TextareaInput
                rows={4}
                placeholder="Contoh: 1. Penerimaan bahan baku dan pemeriksaan sertifikat halal -> 2. Pencucian dan pemotongan singkong -> 3. Penggorengan pada suhu 160°C -> 4. Penirisan minyak dan pencampuran bumbu -> 5. Pengemasan dengan sealer dan pengecekan kerapatan -> 6. Penyimpanan di gudang bersih."
                value={payload.alur_proses || ""}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    alur_proses: e.target.value,
                  }))
                }
              />
            </FormField>
          </div>

          <div>
            <DropzoneUploader
              label="Unggah Bagan Alur Proses Produksi (Opsional)"
              helperText="Format dokumen: PDF, JPG, atau PNG (Maksimal 5 MB). Diagram alur PPH dari bahan baku hingga produk akhir."
              accept=".pdf,.jpg,.jpeg,.png"
              maxSizeMB={5}
              value={payload.file_alur_proses}
              onChange={(file) =>
                onChange((prev) => ({
                  ...prev,
                  file_alur_proses: file,
                }))
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
