import React, { useEffect, useState } from "react"
import { Loader2, Check } from "lucide-react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "../../ui/Card"
import {
    getMasterKonsultasiAt,
    MasterKonsultasiAtItem,
} from "../../../services/konsultasiAt"

const KATEGORI_LABEL: Record<string, string> = {
    konsultasi: "Konsultasi",
    audit_teknologi: "Audit Teknologi",
    indi_4_0: "INDI 4.0",
    lainnya: "Lainnya",
}

interface Step1JenisLayananProps {
    layananKode: string
    setLayananKode: (val: string) => void
    layananLainnya: string
    setLayananLainnya: (val: string) => void
}

export const Step1JenisLayanan: React.FC<Step1JenisLayananProps> = ({
    layananKode,
    setLayananKode,
    layananLainnya,
    setLayananLainnya,
}) => {
    const [items, setItems] = useState<MasterKonsultasiAtItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true
        getMasterKonsultasiAt()
            .then((data) => active && setItems(data))
            .catch(() => active && setError("Gagal memuat daftar layanan. Silakan muat ulang halaman."))
            .finally(() => active && setLoading(false))
        return () => {
            active = false
        }
    }, [])

    return (
        <Card className="border-slate-200/90 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div>
                    <CardTitle className="text-base flex items-center gap-2">
                        Pilih Layanan Konsultasi & Audit Teknologi
                    </CardTitle>
                    <CardDescription>
                        Pilih satu layanan yang sesuai dengan kebutuhan Anda.
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
                {loading && (
                    <div className="flex items-center justify-center gap-2 py-12 text-xs text-slate-500">
                        <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                        <span>Memuat daftar layanan...</span>
                    </div>
                )}

                {error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center">
                        <p className="text-xs font-medium text-rose-700">{error}</p>
                    </div>
                )}

                {/* Grid Pilihan Layanan 2 Kolom Bersih */}
                {!loading && !error && items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((opt) => {
                            const isSelected = layananKode === opt.kode

                            return (
                                <div
                                    key={opt.kode}
                                    onClick={() => setLayananKode(opt.kode)}
                                    className={`relative rounded-xl border p-4 cursor-pointer transition-all duration-150 flex items-start justify-between gap-3 ${
                                        isSelected
                                            ? "border-brand-600 bg-brand-50/30 ring-1 ring-brand-600 shadow-xs"
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40"
                                    }`}
                                >
                                    <div className="flex-1 min-w-0 pr-1">
                                        <p className="text-[11px] font-medium text-slate-400 mb-0.5">
                                            {KATEGORI_LABEL[opt.kategori] ?? opt.kategori}
                                        </p>
                                        <h3
                                            className={`text-sm font-semibold leading-snug transition-colors ${
                                                isSelected ? "text-brand-900" : "text-slate-800"
                                            }`}
                                        >
                                            {opt.nama}
                                        </h3>
                                        {opt.deskripsi && (
                                            <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                                                {opt.deskripsi}
                                            </p>
                                        )}
                                    </div>

                                    {/* Indikator Pilihan Centang / Radio */}
                                    <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                            isSelected
                                                ? "bg-brand-600 text-white"
                                                : "border-2 border-slate-300 bg-white"
                                        }`}
                                    >
                                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Form Input Sederhana untuk Opsi 'Lainnya' */}
                {layananKode === "lainnya" && (
                    <div className="mt-3 p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                        <label className="block text-xs font-semibold text-slate-800">
                            Sebutkan Layanan Lainnya <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={layananLainnya}
                            onChange={(e) => setLayananLainnya(e.target.value)}
                            placeholder="Contoh: Audit Efisiensi Energi Mesin, Formulasi Komposit Karet, dll."
                            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
                            autoFocus
                        />
                        <p className="text-[11px] text-slate-500">
                            Tuliskan kebutuhan spesifik konsultasi atau audit teknologi yang Anda perlukan.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default Step1JenisLayanan


