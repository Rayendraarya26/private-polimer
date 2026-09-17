// components/input-service-requests/multiGrk/Step3Pernyataan.tsx
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/Card"
import { ShieldCheck, Handshake } from "lucide-react"
import { GrkValidasiFormData } from "../../../../types/grk"

interface Props {
    formData: GrkValidasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkValidasiFormData>>
}

export const FormPernyataan: React.FC<Props> = ({ formData, setFormData }) => {

    const pernyataanPerubahan = Boolean(formData.pernyataanPerubahan)
    const pernyataanPemohon = Boolean(formData.pernyataanPemohon ?? (formData as any).pernyataanPermohonan)

    const handleCheckboxChange = (field: "pernyataanPerubahan" | "pernyataanPemohon", checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: checked,
            ...(field === "pernyataanPemohon" ? {
                pernyataanPermohonan: checked
            } : {})
        }))
    }

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
            <Card className="border-brand-100 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-brand-600" />
                                Pernyataan
                            </CardTitle>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs bg-white">
                        <table className="w-full border-collapse text-left text-sm">
                            <tbody className="divide-y divide-slate-200">
                                <tr className="divide-x divide-slate-200 hover:bg-slate-50/30 transition-colors">
                                    <td className="px-5 py-4 w-[32%] sm:w-[26%] align-top font-semibold text-slate-800">
                                        <div className="flex justify-between items-start">
                                            <span>Perubahan pada Laporan</span>
                                            <span className="text-slate-400 font-normal">:</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 align-top">
                                        <label className="flex items-start gap-3 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                id="perubahan_laporan"
                                                name="perubahan_laporan"
                                                checked={pernyataanPerubahan}
                                                onChange={(e) => handleCheckboxChange("pernyataanPerubahan", e.target.checked)}
                                                className="mt-1 w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-700 leading-relaxed">
                                                Setelah Laporan*) diterbitkan, kami <strong className="font-bold text-slate-900">tidak akan</strong> meminta diadakannya perubahan pada laporan mengenai tanda-tanda contoh maupun alamat peminta Sertifikasi.
                                            </span>
                                        </label>
                                    </td>
                                </tr>

                                <tr className="divide-x divide-slate-200 hover:bg-slate-50/30 transition-colors">
                                    <td className="px-5 py-4 w-[32%] sm:w-[26%] align-top font-semibold text-slate-800">
                                        <div className="flex justify-between items-start">
                                            <span>Pernyataan Pemohon</span>
                                            <span className="text-slate-400 font-normal">:</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 align-top">
                                        <label className="flex items-start gap-3 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                id="pernyataan_pemohon"
                                                name="pernyataan_pemohon"
                                                checked={pernyataanPemohon}
                                                onChange={(e) => handleCheckboxChange("pernyataanPemohon", e.target.checked)}
                                                className="mt-1 w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-700 leading-relaxed">
                                                Kami telah mengisi data dengan benar, agar digunakan sebagaimana mestinya.
                                            </span>
                                        </label>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default FormPernyataan