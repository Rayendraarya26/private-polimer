import React, { useState, useMemo } from "react"
import {
  Search,
  CheckSquare,
  Square,
  Sliders,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
  HelpCircle,
} from "lucide-react"
import {
  KategoriTarif,
  MasterParameterUji,
} from "../../../../types/pengujian"
import { useParametersByKomoditiQuery } from "../../../../hooks/queries/usePengujianQuery"
import { formatRupiah } from "./CostEstimationSummary"
import { Button } from "../../../ui/Button"
import { Badge } from "../../../ui/Badge"

interface ParameterSelectorProps {
  isOpen: boolean
  onClose: () => void
  komoditiId: number | null
  komoditiNama: string
  selectedParameters: MasterParameterUji[]
  onSelectParameters: (parameters: MasterParameterUji[]) => void
  kategoriTarif: KategoriTarif
}

export const ParameterSelector: React.FC<ParameterSelectorProps> = ({
  isOpen,
  onClose,
  komoditiId,
  komoditiNama,
  selectedParameters,
  onSelectParameters,
  kategoriTarif,
}) => {
  const [search, setSearch] = useState("")
  const [tempSelected, setTempSelected] = useState<MasterParameterUji[]>(selectedParameters)

  // Fetch parameters list via TanStack Query
  const { data: parameterList = [], isLoading, isError } = useParametersByKomoditiQuery(komoditiId)

  // Sinkronisasi state saat modal dibuka
  React.useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedParameters)
      setSearch("")
    }
  }, [isOpen, selectedParameters])

  // Filter parameter berdasarkan pencarian
  const filteredParameters = useMemo(() => {
    if (!search.trim()) return parameterList
    const q = search.toLowerCase()
    return parameterList.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.metode_uji.toLowerCase().includes(q) ||
        p.kode.toLowerCase().includes(q)
    )
  }, [parameterList, search])

  const isMahasiswa = kategoriTarif === "mahasiswa_pp54"

  const toggleParameter = (param: MasterParameterUji) => {
    const exists = tempSelected.some((p) => p.id === param.id)
    if (exists) {
      setTempSelected((prev) => prev.filter((p) => p.id !== param.id))
    } else {
      setTempSelected((prev) => [...prev, param])
    }
  }

  const handleSelectAll = () => {
    setTempSelected(parameterList)
  }

  const handleDeselectAll = () => {
    setTempSelected([])
  }

  const handleApply = () => {
    onSelectParameters(tempSelected)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <Sliders className="w-4 h-4" />
              <span>Katalog Parameter Pengujian</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Pilih Parameter Uji: {komoditiNama || "Komoditas Terpilih"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Centang parameter yang ingin diuji untuk sampel ini. Tarif di bawah telah disesuaikan
              dengan kategori tarif Anda.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Bulk Select Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama parameter, metode SNI/ASTM, atau kode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs py-1.5 px-3"
            >
              Pilih Semua
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              className="text-xs py-1.5 px-3"
            >
              Batal Semua
            </Button>
          </div>
        </div>

        {/* Parameters List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
              <span>Memuat parameter uji laboratorium...</span>
            </div>
          )}

          {isError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Gagal memuat parameter uji dari server. Silakan coba kembali.</span>
            </div>
          )}

          {!isLoading && !isError && filteredParameters.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs space-y-1">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">Parameter tidak ditemukan</p>
              <p>Coba gunakan kata kunci pencarian metode atau parameter yang berbeda.</p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            filteredParameters.map((param) => {
              const isChecked = tempSelected.some((p) => p.id === param.id)
              const tarif = isMahasiswa ? param.tarif_mahasiswa : param.tarif_umum

              return (
                <div
                  key={param.id}
                  onClick={() => toggleParameter(param)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isChecked
                      ? "bg-brand-50/70 border-brand-500 shadow-2xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="pt-0.5 shrink-0 text-brand-600">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {param.nama}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-slate-100 text-slate-600 border border-slate-200">
                          {param.kode}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-brand-700">
                          Metode: {param.metode_uji}
                        </span>
                        {param.satuan && (
                          <span className="text-slate-400">• Satuan: {param.satuan}</span>
                        )}
                      </p>
                      {param.deskripsi && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {param.deskripsi}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-brand-700 block">
                      {formatRupiah(tarif)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {isMahasiswa ? "Tarif Mahasiswa" : "Tarif PNBP"}
                    </span>
                  </div>
                </div>
              )
            })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-brand-700">{tempSelected.length}</span> parameter dipilih
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApply}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Terapkan Parameter ({tempSelected.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParameterSelector
