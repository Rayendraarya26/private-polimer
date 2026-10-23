import React, { useEffect, useState } from "react"
import { Loader2, Cpu } from "lucide-react"
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

export interface Step1JenisLayananProps {
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
        <Card className="rounded-xl border-slate-200 shadow-xs overflow-hidden">
            <CardHeader className="rounded-t-xl bg-white border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                        <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                        <CardTitle className="text-base text-slate-900">
                            Pilihan Layanan Konsultasi & Audit Teknologi
                        </CardTitle>
                        <CardDescription>
                            Pilih bidang konsultasi, audit teknologi industri, atau pendampingan transformasi INDI 4.0 sesuai kebutuhan Anda.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
                {loading && (
                    <div className="flex items-center justify-center gap-2 py-12 text-xs text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                        <span>Memuat daftar layanan...</span>
                    </div>
                )}

                {error && (
                    <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-center">
                        <p className="text-xs font-medium text-rose-700">{error}</p>
                    </div>
                )}

                {/* Grid Pilihan Layanan 2 Kolom Sesuai Style Guide */}
                {!loading && !error && items.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((opt) => {
                            const isSelected = layananKode === opt.kode

                            return (
                                <label
                                    key={opt.kode}
                                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                                        isSelected
                                            ? "bg-slate-50 border-brand-600"
                                            : "border-slate-200 hover:bg-slate-50/60 bg-white"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="layanan_kode"
                                        value={opt.kode}
                                        checked={isSelected}
                                        onChange={() => setLayananKode(opt.kode)}
                                        className="mt-0.5 w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                                            {KATEGORI_LABEL[opt.kategori] ?? opt.kategori}
                                        </span>
                                        <span className="text-xs font-bold text-slate-900 block leading-snug">
                                            {opt.nama}
                                        </span>
                                        {opt.deskripsi && (
                                            <span className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2 block">
                                                {opt.deskripsi}
                                            </span>
                                        )}
                                    </div>
                                </label>
                            )
                        })}
                    </div>
                )}

                {/* Form Input Sederhana untuk Opsi 'Lainnya' */}
                {layananKode === "lainnya" && (
                    <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                        <label className="block text-xs font-medium text-slate-700">
                            Sebutkan Layanan Lainnya <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={layananLainnya}
                            onChange={(e) => setLayananLainnya(e.target.value)}
                            placeholder="Contoh: Audit Efisiensi Energi Mesin, Formulasi Komposit Karet, dll."
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 transition-colors"
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
