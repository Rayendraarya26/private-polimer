import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/Card"
import { Building, Info } from "lucide-react"
import { GrkVerifikasiFormData, INITIAL_EMISI_CATEGORIES } from "../../../../types/grk"

interface Props {
    formData: GrkVerifikasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkVerifikasiFormData>>
}

export const FormRuangLingkup: React.FC<Props> = ({
    formData,
    setFormData,
}) => {
    const emisiCategories =
        formData.emisiCategories && formData.emisiCategories.length > 0
            ? formData.emisiCategories
            : INITIAL_EMISI_CATEGORIES

    const handleToggleSubKategori = (groupId: string, itemId: string) => {
        setFormData((prev) => {
            const categories =
                prev.emisiCategories && prev.emisiCategories.length > 0
                    ? prev.emisiCategories
                    : INITIAL_EMISI_CATEGORIES

            return {
                ...prev,
                emisiCategories: categories.map((group) => {
                    if (group.id !== groupId) return group
                    return {
                        ...group,
                        items: group.items.map((item) => {
                            if (item.id !== itemId) return item
                            return { ...item, checked: !item.checked }
                        }),
                    }
                }),
            }
        })
    }

    const handleSubKategoriChange = (
        groupId: string,
        itemId: string,
        field: "sumber" | "jumlah" | "justifikasi",
        value: string
    ) => {
        setFormData((prev) => {
            const categories =
                prev.emisiCategories && prev.emisiCategories.length > 0
                    ? prev.emisiCategories
                    : INITIAL_EMISI_CATEGORIES

            return {
                ...prev,
                emisiCategories: categories.map((group) => {
                    if (group.id !== groupId) return group
                    return {
                        ...group,
                        items: group.items.map((item) => {
                            if (item.id !== itemId) return item
                            return { ...item, [field]: value }
                        }),
                    }
                }),
            }
        })
    }

    const handleCheckboxArrayToggle = (
        field: "reportingBoundary" | "jenisInventarisasi" | "jenisGasEmisi",
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
                    {/* 1. Batasan Organisasi */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Batasan Organisasi (Organization boundary) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center gap-3 p-3 px-4 rounded-lg border border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50/20 cursor-pointer transition-colors shadow-xs">
                                <input
                                    type="radio"
                                    name="organization_boundary"
                                    value="internal"
                                    id="internal"
                                    checked={formData.organizationBoundary === "internal"}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            organizationBoundary: e.target.value,
                                        }))
                                    }
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span className="text-sm font-medium text-slate-700">
                                    Pendekatan Kendali <span className="text-xs text-slate-500 font-normal">(operational control)</span>
                                </span>
                            </label>
                            <label className="flex items-center gap-3 p-3 px-4 rounded-lg border border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50/20 cursor-pointer transition-colors shadow-xs">
                                <input
                                    type="radio"
                                    name="organization_boundary"
                                    value="external"
                                    id="external"
                                    checked={formData.organizationBoundary === "external"}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            organizationBoundary: e.target.value,
                                        }))
                                    }
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span className="text-sm font-medium text-slate-700">
                                    Pendekatan Saham <span className="text-xs text-slate-500 font-normal">(equity share control)</span>
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* 2. Batasan Pelaporan */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Batasan Pelaporan (Reporting boundary) <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 p-4 rounded-xl border border-slate-200/80 bg-slate-50/40">
                            {[
                                { id: "kategori_1", label: "Kategori 1 (Emisi Langsung)" },
                                { id: "kategori_2", label: "Kategori 2 (Emisi Tidak Langsung dari energi yang diimpor)" },
                                { id: "kategori_3", label: "Kategori 3 (Emisi tidak langsung dari transportasi)" },
                                { id: "kategori_4", label: "Kategori 4 (Emisi tidak langsung dari produk yang digunakan oleh organisasi)" },
                                { id: "kategori_5", label: "Kategori 5 (Emisi tidak langsung dari penggunaan produk organisasi)" },
                                { id: "kategori_6", label: "Kategori 6 (Emisi tidak langsung dari sumber lain)" },
                            ].map((cat) => (
                                <label
                                    key={cat.id}
                                    className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 cursor-pointer transition-all shadow-xs"
                                >
                                    <input
                                        type="checkbox"
                                        name="reporting_boundary"
                                        value={cat.id}
                                        id={cat.id}
                                        checked={formData.reportingBoundary?.includes(cat.id) || false}
                                        onChange={() => handleCheckboxArrayToggle("reportingBoundary", cat.id)}
                                        className="mt-0.5 w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                                    />
                                    <span className="text-xs font-medium text-slate-700 leading-snug">
                                        {cat.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 3. Jenis Inventarisasi GRK */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Jenis Inventarisasi GRK <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-4">
                            {["Emisi GRK", "Serapan GRK"].map((item) => (
                                <label
                                    key={item}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 cursor-pointer transition-colors shadow-xs"
                                >
                                    <input
                                        type="checkbox"
                                        name="emisi-grk"
                                        value={item}
                                        id={item}
                                        checked={formData.jenisInventarisasi?.includes(item) || false}
                                        onChange={() => handleCheckboxArrayToggle("jenisInventarisasi", item)}
                                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                                    />
                                    <span className="text-sm font-medium text-slate-700">{item}</span>
                                </label>
                            ))}
                        </div>
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

                    {/* 5. Metodologi Pengumpulan Data */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Metodologi Pengumpulan Data <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-4">
                            {["Sistem Manual", "Sistem Terkomputerisasi", "Kombinasi"].map((metode) => (
                                <label
                                    key={metode}
                                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 cursor-pointer transition-colors shadow-xs"
                                >
                                    <input
                                        type="radio"
                                        name="metodologi_pengumpulan_data"
                                        value={metode}
                                        id={`metodologi_${metode}`}
                                        checked={formData.metodologiPengumpulan === metode}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                metodologiPengumpulan: e.target.value,
                                            }))
                                        }
                                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                    />
                                    <span className="text-sm font-medium text-slate-700">{metode}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 6. Tingkat Transfer Data */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Tingkat Transfer Data <span className="text-red-500">*</span>
                        </label>
                        <div className="max-w-xl space-y-2">
                            <input
                                type="text"
                                placeholder="Tingkat Transfer Data"
                                value={formData.tingkatTransferData || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        tingkatTransferData: e.target.value,
                                    }))
                                }
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors text-slate-800 shadow-xs"
                            />
                            <div className="flex items-center gap-2 rounded-lg bg-sky-50 border border-sky-200/80 px-3.5 py-2 text-xs text-sky-800">
                                <Info className="w-4 h-4 text-sky-600 shrink-0" />
                                <span>Jumlah tingkat level transfer data dari paling bawah sampai sentral data</span>
                            </div>
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

                    {/* 8. Tingkat Jaminan (level of assurance) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">
                            Tingkat Jaminan (level of assurance) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-4">
                            <label className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 cursor-pointer transition-colors shadow-xs">
                                <input
                                    type="radio"
                                    name="tingkat_jaminan"
                                    id="tingkat_wajar"
                                    value="reasonable"
                                    checked={formData.tingkatJaminan === "reasonable"}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            tingkatJaminan: e.target.value,
                                        }))
                                    }
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span className="text-sm font-medium text-slate-700">
                                    Tingkat wajar (reasonable level)
                                </span>
                            </label>

                            <label className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/20 cursor-pointer transition-colors shadow-xs">
                                <input
                                    type="radio"
                                    name="tingkat_jaminan"
                                    id="tingkat_terbatas"
                                    value="limited"
                                    checked={formData.tingkatJaminan === "limited"}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            tingkatJaminan: e.target.value,
                                        }))
                                    }
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span className="text-sm font-medium text-slate-700">
                                    Tingkat terbatas (limited level)
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Kategori dan Sub Kategori Emisi & Serapan GRK */}
                    <div className="w-full space-y-3 pt-4 border-t border-slate-100">
                        <label className="block text-sm font-semibold text-slate-800">
                            Kategori dan Sub Kategori Emisi & Serapan GRK <span className="text-red-500">*</span>
                        </label>

                        {/* Info Notice */}
                        <div className="flex items-start gap-2.5 rounded-lg bg-sky-50 border border-sky-200/80 px-4 py-3 text-xs text-sky-800">
                            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed font-medium">
                                Apabila perusahaan terdapat emisi yang di hasilkan dari 1.1 s/d 1.5 maka wajib dilaporkan
                            </span>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200 divide-x divide-slate-200">
                                        <th className="px-3.5 py-3 w-[36%]">Kategori dan Sub Kategori</th>
                                        <th className="px-3.5 py-3 w-[22%]">Sumber Emisi/Serapan</th>
                                        <th className="px-3.5 py-3 w-[22%]">
                                            Jumlah Emisi/Serapan* (ton CO<sub>2</sub>e)
                                        </th>
                                        <th className="px-3.5 py-3 w-[20%]">Justifikasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {emisiCategories.map((group) => (
                                        <React.Fragment key={group.id}>
                                            {/* Category Header Row */}
                                            <tr className="bg-slate-200/80 text-slate-800 font-semibold border-t border-b border-slate-300">
                                                <td colSpan={4} className="px-3.5 py-2 text-xs">
                                                    {group.title}
                                                </td>
                                            </tr>
                                            {/* Subcategories */}
                                            {group.items.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className={`divide-x divide-slate-100 hover:bg-slate-50/60 transition-colors ${item.checked ? "bg-white" : "bg-slate-50/30"
                                                        }`}
                                                >
                                                    <td className="px-3.5 py-2">
                                                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.checked}
                                                                onChange={() => handleToggleSubKategori(group.id, item.id)}
                                                                className="mt-0.5 w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                                                            />
                                                            <span
                                                                className={`text-xs ${item.checked ? "text-slate-900 font-medium" : "text-slate-600"
                                                                    }`}
                                                            >
                                                                {item.code} {item.name}
                                                            </span>
                                                        </label>
                                                    </td>
                                                    <td className="p-1.5">
                                                        <input
                                                            type="text"
                                                            value={item.sumber}
                                                            disabled={!item.checked}
                                                            onChange={(e) =>
                                                                handleSubKategoriChange(group.id, item.id, "sumber", e.target.value)
                                                            }
                                                            placeholder={item.checked ? "Sumber emisi/serapan" : ""}
                                                            className={`w-full rounded border px-2.5 py-1.5 text-xs transition-colors ${item.checked
                                                                ? "border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                                                : "border-slate-200 bg-slate-100/70 text-slate-400 cursor-not-allowed"
                                                                }`}
                                                        />
                                                    </td>
                                                    <td className="p-1.5">
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            value={item.jumlah}
                                                            disabled={!item.checked}
                                                            onChange={(e) =>
                                                                handleSubKategoriChange(group.id, item.id, "jumlah", e.target.value)
                                                            }
                                                            placeholder={item.checked ? "0.00" : ""}
                                                            className={`w-full rounded border px-2.5 py-1.5 text-xs transition-colors ${item.checked
                                                                ? "border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                                                : "border-slate-200 bg-slate-100/70 text-slate-400 cursor-not-allowed"
                                                                }`}
                                                        />
                                                    </td>
                                                    <td className="p-1.5">
                                                        <input
                                                            type="text"
                                                            value={item.justifikasi}
                                                            disabled={!item.checked}
                                                            onChange={(e) =>
                                                                handleSubKategoriChange(group.id, item.id, "justifikasi", e.target.value)
                                                            }
                                                            placeholder={item.checked ? "Justifikasi" : ""}
                                                            className={`w-full rounded border px-2.5 py-1.5 text-xs transition-colors ${item.checked
                                                                ? "border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                                                : "border-slate-200 bg-slate-100/70 text-slate-400 cursor-not-allowed"
                                                                }`}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

export default FormRuangLingkup 