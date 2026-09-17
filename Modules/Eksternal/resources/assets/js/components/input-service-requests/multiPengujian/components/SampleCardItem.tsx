import React, { useState } from "react"
import {
  Trash2,
  Sliders,
  Layers,
  FlaskConical,
  X,
  Sparkles,
  Tag,
  Package,
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
import { Input } from "../../../ui/Input"
import { Button } from "../../../ui/Button"
import { Badge } from "../../../ui/Badge"
import { ParameterSelector } from "./ParameterSelector"
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
  const [isParamModalOpen, setIsParamModalOpen] = useState(false)
  const isMahasiswa = kategoriTarif === "mahasiswa_pp54"

  const subtotal = calculateSampleSubtotal(sample, kategoriTarif)

  const handleKomoditiChange = (komoditiIdStr: string) => {
    const id = komoditiIdStr ? parseInt(komoditiIdStr, 10) : null
    const selected = komoditiList.find((k) => k.id === id)
    onUpdate({
      ...sample,
      master_komoditi_id: id,
      komoditi_nama: selected ? selected.nama : "",
      selected_parameters: [], // Reset parameters jika komoditas diganti
    })
  }

  const handleRemoveParameter = (paramId: number) => {
    onUpdate({
      ...sample,
      selected_parameters: sample.selected_parameters.filter((p) => p.id !== paramId),
    })
  }

  const handleApplyParameters = (newParams: MasterParameterUji[]) => {
    onUpdate({
      ...sample,
      selected_parameters: newParams,
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
              {sample.komoditi_nama || "Komoditas belum dipilih"} • {sample.selected_parameters.length} parameter uji
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
      <div className="p-6 space-y-5">
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
                className="w-full bg-white text-slate-900 text-xs rounded-lg border border-slate-300 pl-10 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all cursor-pointer"
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
              Menentukan daftar parameter uji dan metode laboratorium yang relevan
            </p>
          </div>
        </div>

        {/* Row 2: Bentuk, Jumlah, Satuan, No. Lot & Kondisi */}
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

          {/* Jumlah / Volume */}
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

          {/* Nomor Lot / Bets */}
          <div>
            <Input
              label="No. Lot / Bets"
              placeholder="LOT-2026-X (opsional)"
              value={sample.no_lot_bets}
              onChange={(e) => onUpdate({ ...sample, no_lot_bets: e.target.value })}
            />
          </div>

          {/* Kondisi Fisik Sampel */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Kondisi Fisik
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
        </div>

        {/* Row 3: Parameter Uji Section */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-600" />
                Parameter Uji yang Dipilih ({sample.selected_parameters.length})
              </span>
              <p className="text-[11px] text-slate-500">
                Pilih metode pengujian yang akan dilakukan di laboratorium untuk sampel ini.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!sample.master_komoditi_id}
              onClick={() => setIsParamModalOpen(true)}
              leftIcon={<Sliders className="w-3.5 h-3.5 text-brand-600" />}
              className="text-xs"
            >
              {!sample.master_komoditi_id
                ? "Pilih Komoditas Dahulu"
                : sample.selected_parameters.length === 0
                ? "+ Pilih Parameter Uji"
                : "Ubah Parameter Uji"}
            </Button>
          </div>

          {/* Selected Parameters Chips */}
          {sample.selected_parameters.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
              Belum ada parameter uji yang dipilih untuk sampel ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sample.selected_parameters.map((param) => {
                const rate = isMahasiswa ? param.tarif_mahasiswa : param.tarif_umum
                return (
                  <div
                    key={param.id}
                    className="p-2.5 rounded-lg bg-brand-50/50 border border-brand-200/80 flex items-center justify-between gap-2 text-xs text-slate-800"
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate text-slate-900">{param.nama}</p>
                      <p className="text-[10px] text-slate-500">
                        {param.metode_uji} • {formatRupiah(rate)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveParameter(param.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Hapus parameter ini"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Parameter Selector Modal */}
      {isParamModalOpen && (
        <ParameterSelector
          isOpen={isParamModalOpen}
          onClose={() => setIsParamModalOpen(false)}
          komoditiId={sample.master_komoditi_id}
          komoditiNama={sample.komoditi_nama || ""}
          selectedParameters={sample.selected_parameters}
          onSelectParameters={handleApplyParameters}
          kategoriTarif={kategoriTarif}
        />
      )}
    </div>
  )
}

export default SampleCardItem
