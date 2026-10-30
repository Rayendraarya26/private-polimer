import React from "react"
import { toast } from "react-hot-toast"
import { FormHalalPayload, BahanHalalItem, ProdukHalalItem } from "../../../types/halal"
import {
  Boxes,
  Plus,
  Trash2,
  Package,
  Layers,
  CheckCircle,
} from "lucide-react"
import {
  DropzoneUploader,
  CollapsibleGuideline,
  DateInput,
} from "../../forms"
import { Button } from "../../ui/Button"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  inputClass,
  selectClass,
  textareaClass,
} from "../common"

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
    <StepPanel
      icon={Boxes}
      title="Bahan, Kemasan, Produk & Alur PPH"
      description="Daftarkan seluruh rincian bahan baku/penolong/pembersih, produk yang diajukan sertifikasi, serta bagan alur proses produksi halal."
    >
      {/* 1. Data Bahan & Kemasan */}
      <div>
        <SectionHeading
          title="Daftar Bahan, Kemasan & Cleaning Agent"
          required
          description="Cantumkan semua bahan baku, bahan penolong, bahan pembersih (cleaning agent), dan kemasan kontak pangan."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddBahan}
              leftIcon={<Plus className="w-4 h-4 text-brand-600" />}
              className="text-xs h-9 px-3 rounded-lg border-brand-200 text-brand-700 bg-white hover:bg-brand-50 shadow-none shrink-0"
            >
              Tambah Bahan
            </Button>
          }
        />

        {isSelfDeclare && (
          <div className="mb-4">
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
          </div>
        )}

        <div className="space-y-4">
          {bahanList.map((bahan, idx) => {
            const isDarker = idx % 2 === 1
            return (
              <div
                key={bahan.id}
                className={`p-5 rounded-xl border border-slate-200 space-y-4 shadow-none transition-colors ${
                  isDarker ? "bg-slate-50/75" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
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
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus Bahan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Kategori Bahan</FieldLabel>
                    <select
                      className={selectClass}
                      value={bahan.jenis_bahan}
                      onChange={(e) => handleUpdateBahan(bahan.id, "jenis_bahan", e.target.value)}
                    >
                      {JENIS_BAHAN_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel required>Nama Bahan</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Contoh: Tepung Tapioka / Sunco"
                      value={bahan.nama_bahan}
                      onChange={(e) => handleUpdateBahan(bahan.id, "nama_bahan", e.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel optional>Produsen / Pabrik Pembuat</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Contoh: PT Bogasari Flour Mills"
                      value={bahan.produsen}
                      onChange={(e) => handleUpdateBahan(bahan.id, "produsen", e.target.value)}
                    />
                  </div>

                  <div>
                    <FieldLabel optional>Pemasok / Supplier</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Toko Bahan Kue / Distributor"
                      value={bahan.supplier || ""}
                      onChange={(e) => handleUpdateBahan(bahan.id, "supplier", e.target.value)}
                    />
                  </div>
                </div>

                {/* Status Sertifikat Halal Bahan */}
                <div className="pt-3 border-t border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
                          className="text-brand-600 focus:ring-0 w-4 h-4"
                        />
                        <span>Sudah Bersertifikat Halal</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                        <input
                          type="radio"
                          name={`is_bersertifikat_${bahan.id}`}
                          checked={bahan.is_bersertifikat === false}
                          onChange={() => handleUpdateBahan(bahan.id, "is_bersertifikat", false)}
                          className="text-brand-600 focus:ring-0 w-4 h-4"
                        />
                        <span>Bahan Alami / Positif List (KMA 1360)</span>
                      </label>
                    </div>
                  </div>

                  {bahan.is_bersertifikat ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                      <div>
                        <FieldLabel>Lembaga Penerbit</FieldLabel>
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="BPJPH / LPPOM MUI"
                          value={bahan.lembaga_penerbit || "BPJPH"}
                          onChange={(e) => handleUpdateBahan(bahan.id, "lembaga_penerbit", e.target.value)}
                        />
                      </div>

                      <div>
                        <FieldLabel>Nomor Sertifikat Halal</FieldLabel>
                        <input
                          type="text"
                          className={`${inputClass} font-mono`}
                          placeholder="ID0000000000 / 00..."
                          value={bahan.no_sertifikat || ""}
                          onChange={(e) => handleUpdateBahan(bahan.id, "no_sertifikat", e.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <FieldLabel optional>Masa Berlaku Sertifikat</FieldLabel>
                        <DateInput
                          value={bahan.tgl_berlaku || ""}
                          onChange={(e) => handleUpdateBahan(bahan.id, "tgl_berlaku", e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic bg-slate-100/70 p-3 rounded-lg border border-slate-200">
                      * Bahan tanpa sertifikat halal diperkenankan hanya untuk bahan alami nabati/mineral murni tanpa proses kimia atau kemasan primer non-kritis (sesuai Keputusan Menteri Agama No. 1360).
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. Data Produk yang Didaftarkan */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Daftar Produk yang Disertifikasi"
          required
          description={`Rincian varian produk yang dimohonkan sertifikat halalnya ${isSelfDeclare ? "(Maksimal 10 produk untuk Self Declare)" : ""}.`}
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddProduk}
              leftIcon={<Plus className="w-4 h-4 text-brand-600" />}
              className="text-xs h-9 px-3 rounded-lg border-brand-200 text-brand-700 bg-white hover:bg-brand-50 shadow-none shrink-0"
            >
              Tambah Produk
            </Button>
          }
        />

        <div className="space-y-4">
          {produkList.map((prod, idx) => {
            const isDarker = idx % 2 === 1
            return (
              <div
                key={prod.id}
                className={`p-5 rounded-xl border border-slate-200 space-y-4 shadow-none transition-colors ${
                  isDarker ? "bg-slate-50/75" : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-bold text-slate-800">
                      {prod.nama_produk || `Produk #${idx + 1}`}
                    </span>
                  </div>

                  {produkList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduk(prod.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Klasifikasi Produk</FieldLabel>
                    <select
                      className={selectClass}
                      value={prod.klasifikasi}
                      onChange={(e) => handleUpdateProduk(prod.id, "klasifikasi", e.target.value)}
                    >
                      {KLASIFIKASI_PRODUK_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel required>Merk / Brand Dagang</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Contoh: Keripik Mak Nyus"
                      value={prod.merk || ""}
                      onChange={(e) => handleUpdateProduk(prod.id, "merk", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FieldLabel required>Nama Lengkap Produk & Varian</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Contoh: Keripik Singkong Rasa Balado Pedas 150g"
                      value={prod.nama_produk}
                      onChange={(e) => handleUpdateProduk(prod.id, "nama_produk", e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <FieldLabel optional>Rincian Komposisi / Deskripsi Produk</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Contoh: Singkong, minyak goreng kelapa sawit, cabai bubuk, garam, bawang putih"
                      value={prod.rincian || ""}
                      onChange={(e) => handleUpdateProduk(prod.id, "rincian", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Alur Proses Produksi */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Alur Proses Produksi Halal (PPH)"
          required
          description="Uraikan tahapan pembuatan produk dari penerimaan bahan mentah, pengolahan, hingga pengemasan."
        />

        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="textarea-alur-proses" required>
              Narasi Alur Proses Produksi
            </FieldLabel>
            <textarea
              id="textarea-alur-proses"
              rows={4}
              className={textareaClass}
              placeholder="Contoh: 1. Penerimaan bahan baku dan pemeriksaan sertifikat halal -> 2. Pencucian dan pemotongan singkong -> 3. Penggorengan pada suhu 160°C -> 4. Penirisan minyak dan pencampuran bumbu -> 5. Pengemasan dengan sealer dan pengecekan kerapatan -> 6. Penyimpanan di gudang bersih."
              value={payload.alur_proses || ""}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  alur_proses: e.target.value,
                }))
              }
            />
          </div>

          <DropzoneUploader
            label="Unggah Bagan Alur Proses Produksi"
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
    </StepPanel>
  )
}
