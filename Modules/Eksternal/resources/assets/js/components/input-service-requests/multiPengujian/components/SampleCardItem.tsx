import React, { useState, useMemo } from "react"
import {
  Trash2,
  Layers,
  Search,
  Loader2,
  AlertCircle,
  HelpCircle,
  Check,
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
import { SearchableSelect } from "../../../ui/SearchableSelect"
import { formatRupiah } from "./CostEstimationSummary"
import { FieldLabel, inputClass, cx } from "./WizardUI"

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

const selectClass = cx(inputClass, "cursor-pointer pr-9")

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
  const idPrefix = `sampel-${index + 1}`

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

  const komoditiOptions = useMemo(() => {
    return komoditiList.map((kmd) => ({
      value: kmd.id,
      label: kmd.nama,
    }))
  }, [komoditiList])

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

  const selectedCount = sample.selected_parameters.length
  const allSelected = parameterList.length > 0 && selectedCount === parameterList.length

  return (
    <div className="bg-white">
      {/* Header Sampel */}
      <div className="px-5 sm:px-7 py-4 bg-slate-50 flex items-center gap-3 sm:gap-4 border-b border-slate-200">
        <span className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-none">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-[15px] font-bold text-slate-900 truncate">
            {sample.nama_sampel || <span className="text-slate-400 font-semibold">Sampel {index + 1} — belum diberi nama</span>}
          </h4>
          <p className="text-[13px] text-slate-500 truncate">
            {sample.komoditi_nama || "Komoditas belum dipilih"}
            {selectedCount > 0 && <> · {selectedCount} parameter</>}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="block text-[11px] text-slate-500">Subtotal</span>
          <span className={cx("text-[15px] font-bold", subtotal > 0 ? "text-brand-700" : "text-slate-400")}>
            {formatRupiah(subtotal)}
          </span>
        </div>

        {canDelete && (
          <button
            type="button"
            id={`${idPrefix}-hapus`}
            onClick={() => onDelete(sample.id)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0"
            title="Hapus sampel ini"
            aria-label={`Hapus sampel ${index + 1}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Isi Sampel */}
      <div className="px-5 sm:px-7 py-6 space-y-5">
        {/* Nama & Komoditas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor={`${idPrefix}-nama`} required>
              Nama sampel / bahan uji
            </FieldLabel>
            <input
              id={`${idPrefix}-nama`}
              type="text"
              className={inputClass}
              placeholder="Contoh: Kompon karet tapak sepatu tipe A"
              value={sample.nama_sampel}
              onChange={(e) => onUpdate({ ...sample, nama_sampel: e.target.value })}
            />
          </div>

          <div>
            <FieldLabel required>Komoditas</FieldLabel>
            <SearchableSelect
              placeholder="Pilih komoditas pengujian"
              searchPlaceholder="Cari komoditas..."
              options={komoditiOptions}
              value={sample.master_komoditi_id || ""}
              onChange={(val) => handleKomoditiChange(String(val))}
              onClear={() => handleKomoditiChange("")}
              className="h-10 text-sm rounded-lg py-0 focus:ring-0 focus:border-brand-600 shadow-none"
            />
          </div>
        </div>

        {/* Detail fisik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor={`${idPrefix}-bentuk`}>Bentuk</FieldLabel>
            <select
              id={`${idPrefix}-bentuk`}
              value={sample.bentuk_sampel}
              onChange={(e) => onUpdate({ ...sample, bentuk_sampel: e.target.value })}
              className={selectClass}
            >
              {BENTUK_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor={`${idPrefix}-jumlah`} required>
              Jumlah
            </FieldLabel>
            <div className="flex h-10 rounded-lg border border-slate-300 bg-white overflow-hidden transition focus-within:border-brand-600 focus-within:ring-0 shadow-none">
              <input
                id={`${idPrefix}-jumlah`}
                type="number"
                min={1}
                required
                value={sample.jumlah_sampel}
                onChange={(e) =>
                  onUpdate({ ...sample, jumlah_sampel: parseInt(e.target.value, 10) || 1 })
                }
                className="w-full min-w-0 h-full border-0 rounded-none bg-transparent px-3 text-sm text-slate-900 focus:outline-none focus:ring-0"
              />
              <select
                aria-label="Satuan"
                value={sample.satuan_sampel}
                onChange={(e) => onUpdate({ ...sample, satuan_sampel: e.target.value })}
                className="w-auto h-full border-0 border-l border-slate-200 rounded-none bg-slate-50 pl-2.5 pr-7 text-sm text-slate-700 cursor-pointer focus:outline-none focus:ring-0"
              >
                {SATUAN_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor={`${idPrefix}-kondisi`}>Kondisi</FieldLabel>
            <select
              id={`${idPrefix}-kondisi`}
              value={sample.kondisi_sampel}
              onChange={(e) => onUpdate({ ...sample, kondisi_sampel: e.target.value })}
              className={selectClass}
            >
              {KONDISI_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor={`${idPrefix}-lot`} optional>
              No. Lot / Bets
            </FieldLabel>
            <input
              id={`${idPrefix}-lot`}
              type="text"
              placeholder="LOT-2026-X"
              value={sample.no_lot_bets}
              onChange={(e) => onUpdate({ ...sample, no_lot_bets: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        {/* Parameter Uji */}
        <div className="pt-5 border-t border-slate-100">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Parameter uji <span className="text-rose-500">*</span>
              </p>
              <p className="text-[13px] text-slate-500">
                {sample.master_komoditi_id
                  ? "Centang parameter yang ingin diuji untuk sampel ini."
                  : "Pilih komoditas terlebih dahulu."}
              </p>
            </div>
            {sample.master_komoditi_id && parameterList.length > 0 && (
              <p className="text-[13px] text-slate-500 shrink-0">
                <span className="font-bold text-brand-700">{selectedCount}</span> / {parameterList.length} dipilih
              </p>
            )}
          </div>

          {/* Belum pilih komoditas */}
          {!sample.master_komoditi_id && (
            <div className="rounded-xl border-2 border-dashed border-slate-200 py-9 px-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Belum ada parameter</p>
              <p className="text-[13px] text-slate-500 mt-1 max-w-sm mx-auto">
                Daftar parameter uji akan muncul setelah Anda memilih <strong>Komoditas</strong> di atas.
              </p>
            </div>
          )}

          {sample.master_komoditi_id && (
            <div className="space-y-3">
              {/* Cari + Pilih semua */}
              {parameterList.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id={`${idPrefix}-cari-parameter`}
                      type="text"
                      placeholder="Cari parameter atau metode (misal: SNI, ASTM, kuat tarik)"
                      value={paramSearch}
                      onChange={(e) => setParamSearch(e.target.value)}
                      className={cx(inputClass, "pl-10")}
                    />
                  </div>
                  <button
                    type="button"
                    id={`${idPrefix}-pilih-semua`}
                    onClick={allSelected ? handleDeselectAllParams : handleSelectAllParams}
                    className="h-10 px-4 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:border-brand-500 hover:text-brand-700 transition-colors shrink-0 shadow-none"
                  >
                    {allSelected ? "Kosongkan pilihan" : "Pilih semua"}
                  </button>
                </div>
              )}

              {loadingParams && (
                <div className="flex items-center justify-center py-8 text-sm text-slate-500 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-700" />
                  Memuat parameter pengujian...
                </div>
              )}

              {errorParams && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-[13px] text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Gagal memuat parameter uji. Silakan coba kembali.
                </div>
              )}

              {!loadingParams && !errorParams && filteredParameters.length === 0 && (
                <div className="py-8 text-center text-[13px] text-slate-500">
                  <HelpCircle className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                  {paramSearch
                    ? <>Parameter dengan kata kunci "{paramSearch}" tidak ditemukan.</>
                    : "Belum ada parameter untuk komoditas ini."}
                </div>
              )}

              {!loadingParams && !errorParams && filteredParameters.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[400px] overflow-y-auto pr-1 -mr-1">
                  {filteredParameters.map((param) => {
                    const isChecked = sample.selected_parameters.some((p) => p.id === param.id)
                    const rate = isMahasiswa ? param.tarif_mahasiswa : param.tarif_umum

                    return (
                      <button
                        type="button"
                        key={param.id}
                        role="checkbox"
                        aria-checked={isChecked}
                        onClick={() => toggleParameter(param)}
                        style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
                        className={cx(
                          "group flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all duration-150 select-none shadow-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0",
                          isChecked
                            ? "border-2 border-brand-600 bg-white"
                            : "border border-slate-200 bg-white hover:border-slate-300"
                        )}
                      >
                        <span
                          className={cx(
                            "w-[18px] h-[18px] rounded-md border flex items-center justify-center shrink-0 transition-colors",
                            isChecked
                              ? "bg-brand-600 border-brand-600 text-white"
                              : "border-slate-300 bg-white group-hover:border-slate-400"
                          )}
                        >
                          {isChecked && <Check className="w-3 h-3" strokeWidth={2.5} />}
                        </span>

                        <span className="flex-1 min-w-0">
                          <span className="block text-[13px] font-semibold text-slate-900 leading-snug">
                            {param.nama}
                          </span>
                          <span className="block mt-0.5 text-[11px] text-slate-500 font-mono truncate">
                            {param.metode_uji}
                            {param.satuan && <span className="font-sans"> · {param.satuan}</span>}
                          </span>
                        </span>

                        <span className={cx("text-xs sm:text-[13px] font-bold shrink-0", isChecked ? "text-brand-700" : "text-slate-700")}>
                          {formatRupiah(rate)}
                        </span>
                      </button>
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
