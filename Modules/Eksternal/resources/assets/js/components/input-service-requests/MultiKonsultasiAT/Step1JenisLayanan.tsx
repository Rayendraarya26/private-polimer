import React, { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
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
        <Card className="border-slate-200/80 shadow-sm">
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

            <CardContent className="pt-4 space-y-3">
                {loading && (
                    <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Memuat daftar layanan...
                    </div>
                )}

                {error && <p className="text-xs text-rose-600 py-4 text-center">{error}</p>}

                {!loading &&
                    !error &&
                    items.map((opt) => {
                        const isSelected = layananKode === opt.kode

                        return (
                            <div
                                key={opt.kode}
                                onClick={() => setLayananKode(opt.kode)}
                                className={`rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 ${
                                    isSelected
                                        ? "border-brand-600 bg-brand-50/40 ring-2 ring-brand-600/10 shadow-sm"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-bold text-slate-900">
                                                {opt.nama}
                                            </span>
                                            {isSelected && (
                                                <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold">
                                                    Dipilih
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                            {KATEGORI_LABEL[opt.kategori] ?? opt.kategori}
                                        </span>
                                        {opt.deskripsi && (
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                {opt.deskripsi}
                                            </p>
                                        )}
                                    </div>

                                    <input
                                        type="radio"
                                        name="konsultasi_at_option"
                                        value={opt.kode}
                                        checked={isSelected}
                                        onChange={() => setLayananKode(opt.kode)}
                                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 shrink-0 mt-1 cursor-pointer"
                                    />
                                </div>

                                {opt.kode === "lainnya" && isSelected && (
                                    <div
                                        className="mt-4 pt-3.5 border-t border-brand-200/80"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Sebutkan Layanan Lainnya <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={layananLainnya}
                                            onChange={(e) => setLayananLainnya(e.target.value)}
                                            placeholder="Contoh: Audit Efisiensi Energi Mesin, Optimasi Formulasi Bahan, dll."
                                            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-xs"
                                            autoFocus
                                        />
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            Tuliskan kebutuhan spesifik konsultasi atau audit teknologi yang Anda perlukan.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
            </CardContent>
        </Card>
    )
}

export default Step1JenisLayanan
