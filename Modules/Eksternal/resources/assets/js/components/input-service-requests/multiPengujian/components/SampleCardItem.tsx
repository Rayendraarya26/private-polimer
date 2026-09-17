import React, { useState, useMemo } from "react"
import {
  Trash2,
  Layers,
  FlaskConical,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Tag,
  Loader2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
} from "lucide-react"
import {
  BentukSampel,
  calculateSampleSubtotal,
  KategoriTarif,
  KondisiSampel,
  MasterKomoditi,
  MasterParameterUji,
  PengujianSampleItem,
} from "../../../../types/pengujian"
import { useParametersByKomoditiQuery } from "../../../../hooks/queries/usePengujianQuery"
import { Input } from "../../../ui/Input"
import { Button } from "../../../ui/Button"
import { Badge } from "../../../ui/Badge"
import { formatRupiah } from "./CostEstimationSummary"

interface SampleCardItemProps {
  sample: PengujianSampleItem
  index: number
  komoditiList: MasterKomoditi[]
  kategoriTarif: KategoriTarif
  canDelete: boolean
  onUpdate: (updated: PengujianSampleItem) => void
  onDelete: (id: number) => void
}

const BENTUK_OPTIONS: BentukSampel[] = [
  "Lembaran / Film",
  "Butiran / Granul",
  "Serbuk",
  "Cairan",
  "Barang Jadi",
  "Lainnya",
]

const KONDISI_OPTIONS: KondisiSampel[] = ["Baik", "Tersegel", "Terbuka", "Rusak"]

const SATUAN_OPTIONS = ["Pcs", "Lembar", "kg", "gram", "liter", "ml", "Pasang", "Meter", "Roll"]

export const SampleCardItem: React.FC<SampleCardItemProps> = ({
  sample,
  index,
  komoditiList,
  kategoriTarif,
  canDelete,
  onUpdate,
  onDelete,
}) => {
  const [paramSearch, setParamSearch] = useState("")
  const isMahasiswa = kategoriTarif === "mahasiswa_pp54"
  const subtotal = calculateSampleSubtotal(sample, kategoriTarif)

  // Ambil data parameter untuk komoditas yang dipilih
  const {
    data: parameterList = [],
    isLoading: loadingParams,
    isError: errorParams,
  } = useParametersByKomoditiQuery(sample.master_komoditi_id)

  // Filter parameter berdasarkan pencarian
  const filteredParameters = useMemo(() => {
    if (!paramSearch.trim()) return parameterList
    const q = paramSearch.toLowerCase()
    return parameterList.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.metode_uji.toLowerCase().includes(q) ||
        p.kode.toLowerCase().includes(q)
    )
  }, [parameterList, paramSearch])

  const handleKomoditiChange = (komoditiIdStr: string) => {
    const id = komoditiIdStr ? parseInt(komoditiIdStr, 10) : null
    const selected = komoditiList.find((k) => k.id === id)
    onUpdate({
      ...sample,
      master_komoditi_id: id,
      komoditi_nama: selected ? selected.nama : "",
      selected_parameters: [], // Reset checklist jika ganti komoditas
    })
    setParamSearch("")
  }

  const toggleParameter = (param: MasterParameterUji) => {
    const exists = sample.selected_parameters.some((p) => p.id === param.id)
    const newSelected = exists
      ? sample.selected_parameters.filter((p) => p.id !== param.id)
      : [...sample.selected_parameters, param]

    onUpdate({
      ...sample,
      selected_parameters: newSelected,
    })
  }

  const handleSelectAllParams = () => {
    onUpdate({
      ...sample,
      selected_parameters: [...parameterList],
    })
  }

  const handleDeselectAllParams = () => {
    onUpdate({
      ...sample,
      selected_parameters: [],
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
      {/* Sample Header Bar */}
      <div className="p-4 sm:px-6 bg-gradient-to-r from-slate-50 via-brand-50/20 to-white border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            #{index + 1}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 truncate max-w-[220px] sm:max-w-md">
              {sample.nama_sampel || `Sampel #${index + 1} (Nama belum diisi)`}
            </h4>
            <p className="text-[11px] text-slate-500">
              {sample.komoditi_nama || "Komoditas belum dipilih"} • {sample.selected_parameters.length} parameter uji dicentang
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
              Subtotal Sampel
            </span>
            <span className="text-xs font-extrabold text-brand-700">
              {formatRupiah(subtotal)}
            </span>
          </div>

          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(sample.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
              title="Hapus sampel ini"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sample Body Fields */}
      <div className="p-6 space-y-6">
        {/* Row 1: Nama Sampel & Komoditas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nama Sampel / Bahan Uji"
            required
            leftIcon={<FlaskConical className="w-4 h-4" />}
            placeholder="Contoh: Kompon Karet Tapak Sepatu Tipe A"
            value={sample.nama_sampel}
            onChange={(e) => onUpdate({ ...sample, nama_sampel: e.target.value })}
            helperText="Nama spesifik material atau produk yang diserahkan untuk diuji"
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Komoditas / Ruang Lingkup Lab <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Layers className="w-4 h-4" />
              </div>
              <select
                value={sample.master_komoditi_id || ""}
                onChange={(e) => handleKomoditiChange(e.target.value)}
                className="w-full bg-white text-slate-900 text-xs rounded-lg border border-slate-300 pl-10 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer font-medium"
              >
                <option value="">-- Pilih Komoditas Pengujian --</option>
                {komoditiList.map((kmd) => (
                  <option key={kmd.id} value={kmd.id}>
                    {kmd.nama} ({kmd.ruang_lingkup})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Pilih ruang lingkup komoditas untuk menampilkan daftar parameter uji laboratorium
            </p>
          </div>
        </div>

        {/* Row 2: Bentuk, Jumlah, Satuan, No. Lot & Kondisi Fisik */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* Bentuk Fisik */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Bentuk Fisik
            </label>
            <select
              value={sample.bentuk_sampel}
              onChange={(e) => onUpdate({ ...sample, bentuk_sampel: e.target.value })}
              className="w-full bg-white text-slate-900 text-xs rounded-lg border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {BENTUK_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Jumlah */}
          <div>
            <Input
              label="Jumlah"
              type="number"
              min={1}
              required
              value={sample.jumlah_sampel}
              onChange={(e) =>
                onUpdate({ ...sample, jumlah_sampel: parseInt(e.target.value, 10) || 1 })
              }
            />
          </div>

          {/* Satuan */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Satuan
            </label>
            <select
              value={sample.satuan_sampel}
              onChange={(e) => onUpdate({ ...sample, satuan_sampel: e.target.value })}
              className="w-full bg-white text-slate-900 text-xs rounded-lg border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {SATUAN_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Kondisi Fisik Awal */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Kondisi Fisik Awal
            </label>
            <select
              value={sample.kondisi_sampel}
              onChange={(e) => onUpdate({ ...sample, kondisi_sampel: e.target.value })}
              className="w-full bg-white text-slate-900 text-xs rounded-lg border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {KONDISI_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Nomor Lot / Bets */}
          <div className="col-span-2 sm:col-span-1">
            <Input
              label="No. Lot / Bets"
              placeholder="LOT-2026-X (opsional)"
              value={sample.no_lot_bets}
              onChange={(e) => onUpdate({ ...sample, no_lot_bets: e.target.value })}
            />
          </div>
        </div>

        {/* Row 3: DAFTAR PARAMETER UJI (INLINE CHECKBOX SELECTOR) */}
        <div className="pt-3 border-t border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-brand-600" />
                Daftar Parameter Uji & Metode Acuan Standar
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Centang checkbox parameter yang akan diuji di laboratorium untuk sampel ini.
              </p>
            </div>

            {sample.master_komoditi_id && parameterList.length > 0 && (
              <Badge variant="primary" size="sm" className="self-start sm:self-auto">
                {sample.selected_parameters.length} dari {parameterList.length} Parameter Dicentang
              </Badge>
            )}
          </div>

          {/* State 1: Belum Pilih Komoditas */}
          {!sample.master_komoditi_id && (
            <div className="p-6 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 text-center space-y-2">
              <Layers className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Komoditas Belum Dipilih</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Silakan pilih <strong>Komoditas / Ruang Lingkup Lab</strong> pada pilihan di atas untuk memunculkan daftar parameter uji dan metode acuan yang tersedia.
              </p>
            </div>
          )}

          {/* State 2: Komoditas Terpilih */}
          {sample.master_komoditi_id && (
            <div className="space-y-3">
              {/* Toolbar Pencarian & Aksi Cepat */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari nama parameter atau metode acuan (misal: SNI, ASTM, Kuat Tarik)..."
                    value={paramSearch}
                    onChange={(e) => setParamSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllParams}
                    className="text-[11px] py-1 px-2.5 h-7"
                  >
                    Pilih Semua
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAllParams}
                    className="text-[11px] py-1 px-2.5 h-7"
                  >
                    Batal Semua
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              {loadingParams && (
                <div className="flex items-center justify-center py-8 text-xs text-slate-500 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                  <span>Memuat parameter pengujian laboratorium...</span>
                </div>
              )}

              {/* Error State */}
              {errorParams && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Gagal memuat parameter uji komoditas. Silakan coba kembali.</span>
                </div>
              )}

              {/* Empty Search Result */}
              {!loadingParams && !errorParams && filteredParameters.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400">
                  <HelpCircle className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                  <span>Parameter dengan kata kunci "{paramSearch}" tidak ditemukan.</span>
                </div>
              )}

              {/* Checkbox List Grid */}
              {!loadingParams && !errorParams && filteredParameters.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {filteredParameters.map((param) => {
                    const isChecked = sample.selected_parameters.some((p) => p.id === param.id)
                    const rate = isMahasiswa ? param.tarif_mahasiswa : param.tarif_umum

                    return (
                      <div
                        key={param.id}
                        onClick={() => toggleParameter(param)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 select-none ${
                          isChecked
                            ? "bg-brand-50/70 border-brand-500 shadow-2xs"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="pt-0.5 shrink-0 text-brand-600">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // Handled by parent div onClick
                              className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500 cursor-pointer pointer-events-none"
                            />
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 leading-snug">
                                {param.nama}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-100 text-slate-600 border border-slate-200">
                                {param.kode}
                              </span>
                            </div>

                            {/* METODE UJI BAKU (OTOMATIS MENYESUAIKAN PARAMETER) */}
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                              <span className="font-semibold text-brand-700 bg-brand-100/60 px-2 py-0.5 rounded text-[10.5px]">
                                Metode: {param.metode_uji}
                              </span>
                              {param.satuan && (
                                <span className="text-slate-400">• Satuan: {param.satuan}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-extrabold text-brand-700 block">
                            {formatRupiah(rate)}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {isMahasiswa ? "Tarif Mahasiswa" : "Tarif PNBP"}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SampleCardItem
