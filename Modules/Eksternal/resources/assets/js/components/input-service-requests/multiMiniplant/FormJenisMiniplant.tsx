import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../ui/Card"
import { Layers, FlaskConical, Footprints, Factory, Loader2 } from "lucide-react"

export interface MiniplantOption {
    value: string
    title: string
    code: string
    desc: string
    icon: React.ReactNode
}

export const miniplantOptions: MiniplantOption[] = [
    {
        value: "F",
        title: "Finishing Karet",
        code: "F",
        desc: "Layanan proses finishing kulit seperti embossing, staking, pengecatan, pengeringan, penghalusan, glazing, dan berbagai perlakuan akhir kulit.",
        icon: <Layers className="w-5 h-5" />,
    },
    {
        value: "RPK",
        title: "Riset Penyamakan Kulit",
        code: "RPK",
        desc: "Layanan pengolahan kulit dari bahan mentah, pikel, atau wet blue menjadi kulit tersamak hingga proses finishing.",
        icon: <FlaskConical className="w-5 h-5" />,
    },
    {
        value: "PA",
        title: "Produk Kulit dan Alas Kaki",
        code: "PA",
        desc: "Layanan pembuatan dan pengolahan produk kulit serta alas kaki, termasuk desain customize, pemotongan, laser cutting, dan pembuatan berbagai produk kulit.",
        icon: <Footprints className="w-5 h-5" />,
    },
    {
        value: "MKP",
        title: "Miniplant Karet dan Plastik",
        code: "MKP",
        desc: "Layanan pengembangan produk atau proses karet dan plastik, karakterisasi material, reverse engineering, serta studi kelayakan.",
        icon: <Factory className="w-5 h-5" />,
    },
]

export interface FormJenisMiniplantProps {
    formData?: {
        selectedLayanan?: string
        [key: string]: any
    }
    setFormData?: React.Dispatch<React.SetStateAction<any>> | ((data: any) => void)
    selectedLayanan?: string
    onSelectLayanan?: (value: string) => void
    loading?: boolean
}

export const FormJenisMiniplant: React.FC<FormJenisMiniplantProps> = ({
    formData,
    setFormData,
    selectedLayanan: propSelectedLayanan,
    onSelectLayanan,
    loading = false,
}) => {
    const selectedLayanan = propSelectedLayanan ?? formData?.selectedLayanan ?? ""

    const handleSelect = (val: string) => {
        if (onSelectLayanan) {
            onSelectLayanan(val)
        }
        if (setFormData) {
            setFormData((prev: any) => {
                if (typeof prev === "object" && prev !== null) {
                    return { ...prev, selectedLayanan: val }
                }
                return { selectedLayanan: val }
            })
        }
    }

    return (
        <Card className="border-slate-200/80 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            Pilih Jenis Layanan Miniplant
                        </CardTitle>
                        <CardDescription>
                            Pilih layanan miniplant yang sesuai dengan kebutuhan Anda.
                        </CardDescription>
                    </div>
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
                </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
                <div className="py-4 flex justify-center items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {miniplantOptions.map((opt) => {
                            const isSelected = selectedLayanan === opt.value

                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`relative rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all duration-200 ${isSelected
                                        ? "border-brand-600 bg-brand-50/40 ring-2 ring-brand-600/10 shadow-sm"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSelected
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
                                            name="miniplant_option"
                                            value={opt.value}
                                            checked={isSelected}
                                            onChange={() => handleSelect(opt.value)}
                                            className="w-4 h-4 text-brand-600 focus:ring-brand-500 shrink-0 mt-1 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FormJenisMiniplant
