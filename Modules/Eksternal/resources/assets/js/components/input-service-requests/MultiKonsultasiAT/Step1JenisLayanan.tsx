import React from "react"
import { Layers, FlaskConical, Footprints, Factory } from "lucide-react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "../../ui/Card"

export interface JenisLayananKonsultasiAT {
    value: string
    title: string
    desc: string
    icon: React.ReactNode
}

export const jenisLayananKonsultasiAT: JenisLayananKonsultasiAT[] = [
    {
        value: "konsultasi",
        title: "Konsultasi",
        desc: "Layanan proses finishing kulit seperti embossing, staking, pengecatan, pengeringan, penghalusan, glazing, dan berbagai perlakuan akhir kulit.",
        icon: <Layers className="w-5 h-5" />,
    },
    {
        value: "audit_teknologi",
        title: "Audit Teknologi",
        desc: "Layanan pengolahan kulit dari bahan mentah, pikel, atau wet blue menjadi kulit tersamak hingga proses finishing.",
        icon: <FlaskConical className="w-5 h-5" />,
    },
    {
        value: "indi_4_0",
        title: "INDI 4.0",
        desc: "Layanan pembuatan dan pengolahan produk kulit serta alas kaki, termasuk desain customize, pemotongan, laser cutting, dan pembuatan berbagai produk kulit.",
        icon: <Footprints className="w-5 h-5" />,
    },
    {
        value: "lainnya",
        title: "Lainnya",
        desc: "Layanan pengembangan produk atau proses karet dan plastik, karakterisasi material, reverse engineering, serta studi kelayakan.",
        icon: <Factory className="w-5 h-5" />,
    },
]

export interface SubLayananKonsultasi {
    value: string
    title: string
}

export const subLayananKonsultasiOptions: SubLayananKonsultasi[] = [
    {
        value: "sertifikat_produk_sni",
        title: "Penyusunan Dokumen Sertifikat Produk SNI",
    },
    {
        value: "smm_iso_9001",
        title: "Penyusunan Dokumen dan Implementasi SMM ISO 9001",
    },
    {
        value: "industri_hijau",
        title: "Penyusunan Dokumen dan Implementasi Industri Hijau",
    },
    {
        value: "manajemen_lingkungan",
        title: "Penyusunan Dokumen Sistem Manajemen Lingkungan",
    },
    {
        value: "manajemen_keselamatan_kesehatan_kerja",
        title: "Penyusunan Dokumen Sistem Manajemen Keselamatan dan Kesehatan Kerja",
    },
    {
        value: "manajemen_keamanan_pangan",
        title: "Penyusunan Dokumen Sistem Manajemen Keamanan Pangan",
    },
    {
        value: "haccp",
        title: "Penyusunan Dokumen HACCP",
    },
    {
        value: "sistem_jaminan_produk_halal",
        title: "Penyusunan Dokumen Sistem Jaminan Produk Halal",
    },
]

interface Step1JenisLayananProps {
    selectedLayanan: string
    setSelectedLayanan: (val: string) => void
    subKonsultasi: string
    setSubKonsultasi: (val: string) => void
    subKonsultasiLainnya: string
    setSubKonsultasiLainnya: (val: string) => void
    layananLainnya: string
    setLayananLainnya: (val: string) => void
}

export const Step1JenisLayanan: React.FC<Step1JenisLayananProps> = ({
    selectedLayanan,
    setSelectedLayanan,
    subKonsultasi,
    setSubKonsultasi,
    subKonsultasiLainnya,
    setSubKonsultasiLainnya,
    layananLainnya,
    setLayananLainnya,
}) => {
    return (
        <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div>
                    <CardTitle className="text-base flex items-center gap-2">
                        Pilih Jenis Layanan Konsultasi & Audit Teknologi
                    </CardTitle>
                    <CardDescription>
                        Pilih layanan yang sesuai dengan kebutuhan Anda.
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
                <div className="py-2 flex justify-center items-center w-full">
                    <div className="grid grid-cols-1 gap-3.5 w-full">
                        {jenisLayananKonsultasiAT.map((opt) => {
                            const isSelected = selectedLayanan === opt.value

                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => setSelectedLayanan(opt.value)}
                                    className={`relative rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all duration-200 ${
                                        isSelected
                                            ? "border-brand-600 bg-brand-50/40 ring-2 ring-brand-600/10 shadow-sm"
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                                    isSelected
                                                        ? "bg-brand-600 text-white shadow-sm"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                {opt.icon}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-900">
                                                        {opt.title}
                                                    </span>
                                                    {isSelected && (
                                                        <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold">
                                                            Dipilih
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed">
                                                    {opt.desc}
                                                </p>
                                            </div>
                                        </div>

                                        <input
                                            type="radio"
                                            name="konsultasi_at_option"
                                            value={opt.value}
                                            checked={isSelected}
                                            onChange={() => setSelectedLayanan(opt.value)}
                                            className="w-4 h-4 text-brand-600 focus:ring-brand-500 shrink-0 mt-1 cursor-pointer"
                                        />
                                    </div>

                                    {/* Sub-Pilihan jika memilih Konsultasi */}
                                    {opt.value === "konsultasi" && isSelected && (
                                        <div
                                            className="mt-4 pt-3.5 border-t border-brand-200/80 space-y-3"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex items-center justify-between">
                                                <label className="block text-xs font-bold text-slate-800">
                                                    Pilih Bidang / Topik Konsultasi <span className="text-rose-500">*</span>
                                                </label>
                                                <span className="text-[10px] text-slate-500 font-medium">
                                                    Pilih salah satu bidang
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                {subLayananKonsultasiOptions.map((sub) => {
                                                    const isSubSelected = subKonsultasi === sub.value

                                                    return (
                                                        <div
                                                            key={sub.value}
                                                            onClick={() => setSubKonsultasi(sub.value)}
                                                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-2.5 ${
                                                                isSubSelected
                                                                    ? "border-brand-500 bg-white ring-2 ring-brand-500/20 shadow-xs"
                                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                                                            }`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="sub_konsultasi_option"
                                                                value={sub.value}
                                                                checked={isSubSelected}
                                                                onChange={() => setSubKonsultasi(sub.value)}
                                                                className="w-3.5 h-3.5 text-brand-600 focus:ring-brand-500 shrink-0 mt-0.5 cursor-pointer"
                                                            />
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-bold text-slate-800">
                                                                    {sub.title}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {subKonsultasi === "konsultasi_lainnya" && (
                                                <div className="mt-2.5">
                                                    <input
                                                        type="text"
                                                        value={subKonsultasiLainnya}
                                                        onChange={(e) => setSubKonsultasiLainnya(e.target.value)}
                                                        placeholder="Sebutkan topik konsultasi yang Anda butuhkan..."
                                                        className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-xs"
                                                        autoFocus
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {opt.value === "lainnya" && isSelected && (
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
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default Step1JenisLayanan
