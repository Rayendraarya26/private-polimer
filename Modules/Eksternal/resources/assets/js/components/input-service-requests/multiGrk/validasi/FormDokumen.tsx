// components/input-service-requests/multiGrk/Step2TambahanDanDokumen.tsx
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/Card"
import { FileText, Info } from "lucide-react"
import { GrkValidasiFormData, INITIAL_DOKUMEN_ITEMS } from "../../../../types/grk"

interface Props {
    formData: GrkValidasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkValidasiFormData>>
}

export const FormDokumen: React.FC<Props> = ({ formData, setFormData }) => {
    const dokumenItems =
        formData.dokumenItems && formData.dokumenItems.length > 0
            ? formData.dokumenItems
            : formData.dokumenItem && formData.dokumenItem.length > 0
                ? formData.dokumenItem
                : INITIAL_DOKUMEN_ITEMS

    const handleDokumenChange = (id: string, value: string) => {
        setFormData((prev) => {
            const currentItems =
                prev.dokumenItems && prev.dokumenItems.length > 0
                    ? prev.dokumenItems
                    : prev.dokumenItem && prev.dokumenItem.length > 0
                        ? prev.dokumenItem
                        : INITIAL_DOKUMEN_ITEMS

            const updatedItems = currentItems.map((item) =>
                item.id === id ? { ...item, keterangan: value } : item
            )

            return {
                ...prev,
                dokumenItems: updatedItems,
                dokumenItem: updatedItems,
            }
        })
    }

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
            <Card className="border-brand-100 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="w-4 h-4 text-brand-600" />
                                Ketersediaan Dokumen
                            </CardTitle>
                        </div>

                    </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-4">
                    <p className="text-xs font-medium text-slate-700">
                        Dokumen Dapat di upload setelah kajian permohonan.
                    </p>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 pt-0.5">
                        <Info className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>Jika ada maka sebutkan nomor dokumen, jika tidak ada berikan keterangan tidak ada</span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs mt-3 bg-white">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
                                    <th colSpan={2} className="px-5 py-3 text-xs font-bold text-slate-800">
                                        Dokumen
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {dokumenItems.map((item) => (
                                    <tr key={item.id} className="divide-x divide-slate-200 hover:bg-slate-50/30 transition-colors">
                                        <td className="px-5 py-4 w-[40%] align-top text-xs font-medium text-slate-800 leading-relaxed">
                                            {item.title}
                                        </td>
                                        <td className="px-5 py-4 w-[60%] align-top space-y-1.5">
                                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                                Keterangan
                                            </label>
                                            <textarea
                                                rows={3}
                                                id={item.id}
                                                name={item.id}
                                                value={item.keterangan}
                                                onChange={(e) => handleDokumenChange(item.id, e.target.value)}
                                                placeholder="Sebutkan nomor dokumen atau berikan keterangan tidak ada"
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors resize-y"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default FormDokumen
