import React, { useState, useEffect, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { Badge } from "../../ui/Badge"
import { Button } from "../../ui/Button"
import {
  Layers,
  Search,
  CheckCircle2,
  Tag,
  Sparkles,
  MapPin,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Filter,
  Loader2,
} from "lucide-react"
import { PupFormData, PupSkemaItem, SelectedSkemaItem } from "../../../types/pup"
import api from "../../../utils/api"

interface Step2Props {
  formData: PupFormData
  onChange: (field: keyof PupFormData, value: any) => void
}

const CATEGORIES = [
  "Semua",
  "Suhu",
  "Suhu & Kelembaban",
  "Suhu & Tekanan",
  "Massa",
  "Volumetrik",
  "Tekanan",
  "Dimensi & Panjang",
  "Waktu & Frekuensi",
  "Kecepatan Putar",
  "Optik",
]

export const Step2PilihanSkema: React.FC<Step2Props> = ({ formData, onChange }) => {
  const [skemaList, setSkemaList] = useState<PupSkemaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")

  useEffect(() => {
    const fetchSkema = async () => {
      try {
        setLoading(true)
        const res = await api.get("/eksternal/pup/skema")
        const list = res?.data?.results?.skema || res?.data?.data || []
        setSkemaList(list)
      } catch (err) {
        console.error("Gagal memuat skema PUP:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSkema()
  }, [])

  // Filter list berdasarkan kategori dan pencarian
  const filteredSkema = useMemo(() => {
    return skemaList.filter((item) => {
      const matchCat =
        selectedCategory === "Semua" ||
        item.kategori.toLowerCase() === selectedCategory.toLowerCase()
      const matchSearch =
        searchTerm === "" ||
        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kode_skema.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
      return matchCat && matchSearch
    })
  }, [skemaList, selectedCategory, searchTerm])

  // Cek apakah skema terpilih
  const isSelected = (kodeSkema: string) => {
    return formData.skema_items.some((it) => it.kode_skema === kodeSkema)
  }

  // Toggle pilihan skema
  const handleToggleSkema = (skema: PupSkemaItem) => {
    const exists = isSelected(skema.kode_skema)
    let updated: SelectedSkemaItem[] = []

    if (exists) {
      updated = formData.skema_items.filter((it) => it.kode_skema !== skema.kode_skema)
    } else {
      updated = [
        ...formData.skema_items,
        {
          kode_skema: skema.kode_skema,
          slug: skema.slug,
          nama_skema: skema.nama,
          metode_kalibrasi_acuan: "",
          is_in_situ: skema.is_in_situ,
          tarif_pnbp: skema.harga_promo,
        },
      ]
    }
    onChange("skema_items", updated)
  }

  // Update metode acuan per skema
  const handleUpdateMetode = (kodeSkema: string, metode: string) => {
    const updated = formData.skema_items.map((it) => {
      if (it.kode_skema === kodeSkema) {
        return { ...it, metode_kalibrasi_acuan: metode }
      }
      return it
    })
    onChange("skema_items", updated)
  }

  // Hitung diskon bundling
  const hasCentrifuge = formData.skema_items.some(
    (it) => it.slug === "centrifuge" || it.kode_skema === "UP-CENTRIFUGE"
  )
  const hasOverhead = formData.skema_items.some(
    (it) => it.slug === "overhead_stirrer" || it.kode_skema === "UP-OVERHEAD-STIRRER"
  )
  const isBundleEligible = hasCentrifuge && hasOverhead

  const totalKotor = formData.skema_items.reduce((acc, it) => acc + (it.tarif_pnbp || 0), 0)
  const diskonNominal = isBundleEligible ? 1000000 : 0
  const totalBersih = Math.max(0, totalKotor - diskonNominal)

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Banner Notifikasi Diskon Bundling */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50/60 to-brand-50/50 border border-amber-200/80 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <span>Promo Diskon Bundling Spesial</span>
              {isBundleEligible && (
                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] uppercase tracking-wider font-bold">
                  Aktif (-Rp 1.000.000)
                </span>
              )}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Dapatkan potongan biaya sebesar <strong>Rp 1.000.000,00</strong> jika Anda memilih skema{" "}
              <strong className="text-amber-800">Centrifuge</strong> dan{" "}
              <strong className="text-amber-800">Overhead Stirrer</strong> sekaligus dalam formulir pendaftaran ini.
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama alat / skema kalibrasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium self-start sm:self-center">
            Dipilih: <strong className="text-brand-600 font-bold">{formData.skema_items.length}</strong> dari {skemaList.length} skema
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Container Katalog Skema UP (Scrollable Container) */}
      <div className="bg-slate-50/60 border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-slate-200/80 gap-1 text-xs">
          <div className="font-semibold text-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <span>Katalog Skema Uji Profisiensi ({filteredSkema.length} skema tersedia)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Scroll ke bawah di dalam area ini untuk memilih skema kalibrasi
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
            <span>Memuat katalog skema...</span>
          </div>
        ) : filteredSkema.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            Tidak ada skema yang cocok dengan filter kategori atau kata kunci pencarian.
          </div>
        ) : (
          <div className="max-h-[520px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkema.map((skema) => {
                const checked = isSelected(skema.kode_skema)
                const isCentrifugeOrOverhead =
                  skema.slug === "centrifuge" || skema.slug === "overhead_stirrer"

                return (
                  <div
                    key={skema.kode_skema}
                    onClick={() => handleToggleSkema(skema)}
                    className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
                      checked
                        ? "bg-brand-50/50 border-brand-500 ring-2 ring-brand-500/20 shadow-md"
                        : "bg-white border-slate-200 hover:border-brand-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Header Foto Artefak */}
                    <div className="relative bg-slate-100 h-44 w-full overflow-hidden border-b border-slate-100 flex items-center justify-center">
                      <img
                        src={skema.image}
                        alt={skema.nama}
                        className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                        onError={(e: any) => {
                          e.target.style.display = "none"
                        }}
                      />

                      {/* Badge In Situ */}
                      {skema.is_in_situ && (
                        <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/95 text-white text-[10px] font-bold shadow-xs">
                          <MapPin className="w-3 h-3" />
                          <span>In Situ (Yogyakarta)</span>
                        </div>
                      )}

                      {/* Badge Bundle Diskon */}
                      {isCentrifugeOrOverhead && (
                        <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-600/95 text-white text-[10px] font-bold shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          <span>Paket Diskon 1Jt</span>
                        </div>
                      )}

                      {/* Checkbox indicator */}
                      <div
                        className={`absolute top-2 right-2 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          checked
                            ? "bg-brand-600 text-white shadow-xs"
                            : "bg-white/90 border border-slate-300 text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          {skema.kategori}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-brand-600 transition-colors">
                          {skema.nama}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Tarif Keikutsertaan</span>
                          <span className="text-xs font-extrabold text-brand-700">
                            Rp {skema.harga_promo.toLocaleString("id-ID")}
                          </span>
                        </div>

                        <Button
                          type="button"
                          size="sm"
                          variant={checked ? "primary" : "outline"}
                          className={`text-[11px] h-7 px-3 rounded-lg pointer-events-none ${
                            checked ? "bg-brand-600 text-white" : "border-slate-300 text-slate-600"
                          }`}
                        >
                          {checked ? "Terpilih" : "Pilih"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bagian Input Metode Kalibrasi Acuan untuk Setiap Skema Terpilih */}
      {formData.skema_items.length > 0 && (
        <Card className="border-brand-200 bg-white shadow-xs">
          <CardHeader className="bg-gradient-to-r from-brand-50/60 to-sky-50/30 pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <BookOpen className="w-4 h-4 text-brand-600" />
              Metode Kalibrasi yang Ditetapkan Peserta
            </CardTitle>
            <CardDescription>
              Tuliskan judul acuan/referensi standar kalibrasi yang ditetapkan laboratorium Anda untuk setiap skema yang dipilih. (Contoh: SNSU PK.M-01:2024; ASTM E-542; DKD-R 6-1; dsb.)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="divide-y divide-slate-100">
              {formData.skema_items.map((item, idx) => (
                <div key={item.kode_skema} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      {idx + 1}. Metode Kalibrasi: <span className="text-brand-700">{item.nama_skema}</span>{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Rp {item.tarif_pnbp.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Tuliskan standar acuan metode kalibrasi..."
                    value={item.metode_kalibrasi_acuan}
                    onChange={(e) => handleUpdateMetode(item.kode_skema, e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Summary Bar */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <span className="text-[11px] text-slate-400">Total Estimasi Biaya</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-white tracking-tight">
              Rp {totalBersih.toLocaleString("id-ID")}
            </span>
            {diskonNominal > 0 && (
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                Hemat Rp {diskonNominal.toLocaleString("id-ID")}
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-slate-300 font-medium">
          {formData.skema_items.length === 0 ? (
            <span className="text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Pilih minimal 1 skema untuk melanjutkan
            </span>
          ) : (
            <span>{formData.skema_items.length} skema uji profisiensi dipilih</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step2PilihanSkema
