import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/Card"
import { Building } from "lucide-react"
import { GrkValidasiFormData } from "../../../../types/grk"

interface Props {
    formData: GrkValidasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkValidasiFormData>>
}

export const FormRuangLingkup: React.FC<Props> = ({
    formData,
    setFormData,
}) => {
    const handleCheckboxArrayToggle = (
        field: "jenisProyekGrk" | "jenisGasEmisi",
        value: string
    ) => {
        setFormData((prev) => {
            const list = prev[field] || []
            const exists = list.includes(value)
            return {
                ...prev,
                [field]: exists ? list.filter((item) => item !== value) : [...list, value],
            }
        })
    }

    return (
        <Card className="border-brand-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Building className="w-4 h-4 text-brand-600" />
                            Informasi Lingkup
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                <div className="space-y-6">
                    {/* Batasan Proyek */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Batasan Proyek <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            id="batasan_proyek"
                            name="batasan_proyek"
                            placeholder="Deskripsi batasan proyek"
                            value={formData.batasanProyek || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, batasanProyek: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>

                    {/* Jenis Proyek GRK */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Jenis Proyek GRK <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-4">
                            <label
                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 cursor-pointer transition-colors shadow-xs"
                            >
                                <input
                                    type="checkbox"
                                    name="jenis_proyek_grk[]"
                                    value="Pengurangan Emisi GRK"
                                    id="jenis_proyek_1"
                                    checked={formData.jenisProyekGrk?.includes("Pengurangan Emisi GRK") || false}
                                    onChange={() => handleCheckboxArrayToggle("jenisProyekGrk", "Pengurangan Emisi GRK")}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                                />
                                <span className="text-sm font-medium text-slate-700">Pengurangan Emisi GRK</span>
                            </label>

                            <label
                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 cursor-pointer transition-colors shadow-xs"
                            >
                                <input
                                    type="checkbox"
                                    name="jenis_proyek_grk[]"
                                    value="Peningkatan Serapan GRK"
                                    id="jenis_proyek_2"
                                    checked={formData.jenisProyekGrk?.includes("Peningkatan Serapan GRK") || false}
                                    onChange={() => handleCheckboxArrayToggle("jenisProyekGrk", "Peningkatan Serapan GRK")}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                                />
                                <span className="text-sm font-medium text-slate-700">Peningkatan Serapan GRK</span>
                            </label>
                        </div>
                    </div>


                    {/* Input Periode Waktu */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Periode Waktu <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <input
                                type={formData.periodeMulai ? "date" : "text"}
                                placeholder="Tgl Mulai"
                                value={formData.periodeMulai || ""}
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => {
                                    if (!e.target.value) e.target.type = "text"
                                }}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, periodeMulai: e.target.value }))
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                            <input
                                type={formData.periodeSelesai ? "date" : "text"}
                                placeholder="Tgl Selesai"
                                min={formData.periodeMulai || undefined}
                                value={formData.periodeSelesai || ""}
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => {
                                    if (!e.target.value) e.target.type = "text"
                                }}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, periodeSelesai: e.target.value }))
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">
                                Kriteria Verifikasi <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3 pt-1">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="14064-2"
                                        name="kriteria_verifikasi"
                                        value="14064-2"
                                        checked={formData?.kriteriaVerifikasi === "14064-2"}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                kriteriaVerifikasi: e.target.value,
                                            }))
                                        }
                                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                    />
                                    <label htmlFor="14064-2" className="ms-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                                        14064-2
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="lainnya"
                                            name="kriteria_verifikasi"
                                            value="lainnya"
                                            checked={formData?.kriteriaVerifikasi === "lainnya"}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    kriteriaVerifikasi: e.target.value,
                                                }))
                                            }
                                            className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                        />
                                        <label htmlFor="lainnya" className="ms-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                                            Lainnya
                                        </label>
                                    </div>
                                    {formData?.kriteriaVerifikasi === "lainnya" && (
                                        <div className="pl-6 pt-1">
                                            <input
                                                type="text"
                                                placeholder="Kriteria lainnya"
                                                value={formData?.kriteriaLainnyaText || ""}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        kriteriaLainnyaText: e.target.value,
                                                    }))
                                                }
                                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">
                                Jumlah Karyawan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Jumlah Karyawan"
                                value={formData.jumlahKaryawan || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, jumlahKaryawan: e.target.value }))
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Sumber/Source GRK */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Sumber/Source, Penyerap/Sink, dan/atau Penampung/Reservoir (SSR) GRK yang dikuantifikasi (Sebutkan) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            id="ssr_kuantifikasi"
                            name="ssr_kuantifikasi"
                            placeholder="Sebutkan SSR GRK yang dikuantifikasi"
                            value={formData.ssrKuantifikasi || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, ssrKuantifikasi: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>

                    {/* 4. Jenis Emisi/Serapan GRK */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Jenis Emisi/Serapan GRK <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            {[
                                { id: "CO2", label: <>CO<sub>2</sub></> },
                                { id: "CH4", label: <>CH<sub>4</sub></> },
                                { id: "N20", label: <>N<sub>2</sub>O</> },
                                { id: "HFCS", label: <>HFC<sub>S</sub></> },
                                { id: "PFCS", label: <>PFC<sub>S</sub></> },
                                { id: "SF6", label: <>SF<sub>6</sub></> },
                            ].map((gas) => (
                                <label
                                    key={gas.id}
                                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 cursor-pointer transition-colors shadow-xs"
                                >
                                    <input
                                        type="checkbox"
                                        name="bt_jns_emisi[]"
                                        value={gas.id}
                                        id={`bt_jns_emisi_${gas.id}`}
                                        checked={formData.jenisGasEmisi?.includes(gas.id) || false}
                                        onChange={() => handleCheckboxArrayToggle("jenisGasEmisi", gas.id)}
                                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                                    />
                                    <span className="text-xs font-semibold text-slate-700">
                                        {gas.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>


                    {/* Jumlah Emisi Serapan Proyek */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Jumlah Emisi/Serapan GRK Proyek (kgCO2eq)<span className="text-red-500">*</span>
                        </label>
                        <div className="max-w-xl space-y-2">
                            <input
                                type="number"
                                step="any"
                                placeholder="Jumlah Serapan Proyek (kgCO2eq)"
                                id="jumlah_emisi_serapan"
                                value={formData.jumlahEmisiProyek || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        jumlahEmisiProyek: e.target.value,
                                    }))
                                }
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors text-slate-800 shadow-xs"
                            />
                        </div>
                    </div>
                    
                    {/* Jumlah Emisi/Serapan GRK Baseline */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Jumlah Emisi/Serapan GRK Baseline (kgCO2eq)<span className="text-red-500">*</span>
                        </label>
                        <div className="max-w-xl space-y-2">
                            <input
                                type="number"
                                step="any"
                                placeholder="Jumlah Serapan Baseline (kgCO2eq)"
                                id="jumlah_emisi_serapan_baseline"
                                value={formData.jumlahEmisiBaseline || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        jumlahEmisiBaseline: e.target.value,
                                    }))
                                }
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors text-slate-800 shadow-xs"
                            />
                        </div>
                    </div>
                    
                    
                    {/* 7. Materialitas (materiality) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Materialitas (materiality) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 cursor-pointer transition-colors shadow-xs">
                                <input
                                    type="radio"
                                    name="materialitas"
                                    id="materialitas_default"
                                    value="default"
                                    checked={formData.materialitas === "default"}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            materialitas: e.target.value,
                                        }))
                                    }
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span className="text-sm font-medium text-slate-700">
                                    ≤ 5% (jika tidak ditetapkan oleh program)
                                </span>
                            </label>

                            <div className="flex flex-wrap items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:border-brand-300 transition-colors shadow-xs">
                                <input
                                    type="radio"
                                    name="materialitas"
                                    id="materialitas_program"
                                    value="program"
                                    checked={formData.materialitas === "program"}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            materialitas: e.target.value,
                                        }))
                                    }
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
                                />
                                <label htmlFor="materialitas_program" className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                                    <span>≤</span>
                                    <input
                                        type="text"
                                        placeholder="Kriteria"
                                        value={formData.materialitasCustom || ""}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                materialitas: "program",
                                                materialitasCustom: e.target.value,
                                            }))
                                        }}
                                        onFocus={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                materialitas: "program",
                                            }))
                                        }
                                        className="w-24 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                                    />
                                    <span>% (jika ditetapkan oleh program)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

export default FormRuangLingkup 