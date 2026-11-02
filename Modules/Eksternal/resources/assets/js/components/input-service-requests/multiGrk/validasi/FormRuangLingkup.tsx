import React from "react"
import { Building } from "lucide-react"
import { GrkValidasiFormData } from "../../../../types/grk"
import { StepPanel, inputClass, textareaClass } from "../../common"

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
        <StepPanel
            icon={Building}
            title="Informasi Lingkup"
            description="Tentukan batasan proyek, tipe mitigasi, serta cakupan gas rumah kaca"
        >
            <div className="space-y-6">
                    {/* Batasan Proyek */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
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
                            className={textareaClass}
                        />
                    </div>

                    {/* Jenis Proyek GRK */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            Jenis Proyek GRK <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            <label
                                className="flex items-center gap-2.5 h-10 px-3.5 rounded-lg border border-slate-300 bg-white hover:border-slate-400 cursor-pointer transition-colors text-sm font-medium text-slate-700"
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
                                <span>Pengurangan Emisi GRK</span>
                            </label>

                            <label
                                className="flex items-center gap-2.5 h-10 px-3.5 rounded-lg border border-slate-300 bg-white hover:border-slate-400 cursor-pointer transition-colors text-sm font-medium text-slate-700"
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
                                <span>Peningkatan Serapan GRK</span>
                            </label>
                        </div>
                    </div>


                    {/* Input Periode Waktu */}
                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            Periode Waktu <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="date"
                                placeholder="Tgl Mulai"
                                value={formData.periodeMulai || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, periodeMulai: e.target.value }))
                                }
                                className={inputClass}
                            />
                            <input
                                type="date"
                                placeholder="Tgl Selesai"
                                min={formData.periodeMulai || undefined}
                                value={formData.periodeSelesai || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, periodeSelesai: e.target.value }))
                                }
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Kriteria Verifikasi <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3 pt-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className={`flex items-center gap-2.5 h-10 px-3.5 rounded-lg border cursor-pointer select-none transition-all text-sm ${formData?.kriteriaVerifikasi === "14064-2" ? "border-brand-600 bg-brand-50/40 text-brand-900 font-medium" : "border-slate-300 bg-white hover:border-slate-400 text-slate-700"}`}>
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
                                        <span>ISO 14064-2</span>
                                    </label>

                                    <label className={`flex items-center gap-2.5 h-10 px-3.5 rounded-lg border cursor-pointer select-none transition-all text-sm ${formData?.kriteriaVerifikasi === "lainnya" ? "border-brand-600 bg-brand-50/40 text-brand-900 font-medium" : "border-slate-300 bg-white hover:border-slate-400 text-slate-700"}`}>
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
                                        <span>Lainnya</span>
                                    </label>
                                </div>

                                {formData?.kriteriaVerifikasi === "lainnya" && (
                                    <div className="pt-1 max-w-md animate-in fade-in-50 duration-200">
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
                                            className={inputClass}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Jumlah Karyawan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Jumlah Karyawan"
                                value={formData.jumlahKaryawan || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, jumlahKaryawan: e.target.value }))
                                }
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Sumber/Source GRK */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
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
                            className={textareaClass}
                        />
                    </div>

                    {/* 4. Jenis Emisi/Serapan GRK */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
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
                                    className="flex items-center gap-2 h-10 px-3.5 rounded-lg border border-slate-300 bg-white hover:border-slate-400 cursor-pointer transition-colors text-sm font-semibold text-slate-700"
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
                                    <span>
                                        {gas.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>


                    {/* Jumlah Emisi Serapan Proyek */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
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
                                className={inputClass}
                            />
                        </div>
                    </div>
                    
                    {/* Jumlah Emisi/Serapan GRK Baseline */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
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
                                className={inputClass}
                            />
                        </div>
                    </div>
                    
                    
                    {/* 7. Materialitas (materiality) */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            Materialitas (materiality) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            <label className={`flex items-center gap-2.5 h-10 px-3.5 rounded-lg border cursor-pointer select-none transition-all text-sm ${formData.materialitas === "default" ? "border-brand-600 bg-brand-50/40 text-brand-900 font-medium" : "border-slate-300 bg-white hover:border-slate-400 text-slate-700"}`}>
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
                                <span>
                                    ≤ 5% (jika tidak ditetapkan oleh program)
                                </span>
                            </label>

                            <div className={`flex flex-wrap items-center gap-2 h-10 px-3.5 rounded-lg border transition-all text-sm ${formData.materialitas === "program" ? "border-brand-600 bg-brand-50/40 text-brand-900 font-medium" : "border-slate-300 bg-white hover:border-slate-400 text-slate-700"}`}>
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
                                <label htmlFor="materialitas_program" className="flex flex-wrap items-center gap-2 cursor-pointer">
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
                                        className="w-20 h-7 rounded border border-slate-300 bg-white px-2 text-xs text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-0 transition-colors"
                                    />
                                    <span>% (jika ditetapkan oleh program)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
        </StepPanel>
    )
}

export default FormRuangLingkup 