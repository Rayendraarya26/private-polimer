import React from "react"
import { toast } from "react-hot-toast"
import { KalibrasiItem, emptyKalibrasiItem } from "../../../types/kalibrasi"
import FormDataAlatKalibrasi from "./FormDataAlatKalibrasi"
import { Button } from "../../ui/Button"
import { Plus, Trash2, ArrowRight, Gauge, Layers, Info } from "lucide-react"

interface Props {
  items: KalibrasiItem[]
  setItems: React.Dispatch<React.SetStateAction<KalibrasiItem[]>>
  nextId: number
  setNextId: React.Dispatch<React.SetStateAction<number>>
  activeId: number
  setActiveId: React.Dispatch<React.SetStateAction<number>>
  onNext: () => void
}

export const Step1DataAlatKalibrasi: React.FC<Props> = ({
  items,
  setItems,
  nextId,
  setNextId,
  activeId,
  setActiveId,
  onNext,
}) => {
  const addItem = () => {
    const newItem = emptyKalibrasiItem(nextId)
    setItems((prev) => [...prev, newItem])
    setActiveId(nextId)
    setNextId((prev) => prev + 1)
    toast.success(`Alat #${items.length + 1} berhasil ditambahkan`)
  }

  const removeItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (items.length === 1) {
      toast.error("Minimal harus ada 1 alat/instrumen yang didaftarkan")
      return
    }
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id)
      if (activeId === id) setActiveId(next[next.length - 1].id)
      return next
    })
    toast.success("Alat berhasil dihapus dari daftar")
  }

  const updateItem = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const file = type === "file" ? (e.target as HTMLInputElement).files?.[0] ?? null : null

    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it
        if (type === "file") return { ...it, [name]: file }
        if (name === "jumlah") return { ...it, jumlah: Math.max(1, parseInt(value) || 1) }
        return { ...it, [name]: value }
      })
    )
  }

  const activeItem = items.find((it) => it.id === activeId) || items[0]
  const activeIndex = items.findIndex((it) => it.id === (activeItem?.id ?? items[0]?.id))

  return (
    <div className="space-y-6">
      {/* Banner Informasi Kalibrasi */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-4 rounded-2xl border border-emerald-200/70 shadow-2xs flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950">
              Daftar Alat & Instrumen Ukur ({items.length} Instrumen Didaftarkan)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Anda dapat mendaftarkan beberapa alat ukur sekaligus dalam satu kali pengajuan kalibrasi.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={addItem}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Tambah Alat Lainnya
        </Button>
      </div>

      {/* Tab Navigation for Multiple Instruments */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {items.map((it, idx) => {
          const isActive = it.id === activeItem?.id
          const hasTitle = Boolean(it.nama_alat && it.merek)

          return (
            <div
              key={it.id}
              onClick={() => setActiveId(it.id)}
              className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-xl cursor-pointer border text-xs font-semibold shrink-0 transition-all ${
                isActive
                  ? "bg-brand-600 text-white border-brand-600 shadow-sm ring-2 ring-brand-500/20"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? "bg-white text-brand-600" : "bg-slate-100 text-slate-600"
                }`}
              >
                {idx + 1}
              </div>

              <span className="max-w-[140px] truncate">
                {it.nama_alat ? it.nama_alat : `Alat #${idx + 1}`}
              </span>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => removeItem(it.id, e)}
                  className={`p-1 rounded-md transition-colors ${
                    isActive
                      ? "text-white/80 hover:text-white hover:bg-white/20"
                      : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  }`}
                  title="Hapus alat ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )
        })}

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-brand-600 hover:border-brand-400 text-xs font-semibold shrink-0 transition-colors bg-slate-50/50"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Alat</span>
        </button>
      </div>

      {/* Active Instrument Form */}
      {activeItem && (
        <FormDataAlatKalibrasi
          item={activeItem}
          index={activeIndex}
          onChange={(e) => updateItem(activeItem.id, e)}
        />
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          Total: <span className="font-bold text-slate-800">{items.length} jenis alat</span> (
          {items.reduce((acc, curr) => acc + (curr.jumlah || 1), 0)} unit instrumen)
        </p>

        <Button
          type="button"
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 shadow-sm"
        >
          Lanjut ke Informasi Penyerahan & Pemohon
        </Button>
      </div>
    </div>
  )
}

export default Step1DataAlatKalibrasi
