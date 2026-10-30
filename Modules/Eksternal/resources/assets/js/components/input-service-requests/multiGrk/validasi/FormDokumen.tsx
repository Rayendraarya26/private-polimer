import React from "react"
import { FileText, Info } from "lucide-react"
import { GrkValidasiFormData, INITIAL_DOKUMEN_ITEMS } from "../../../../types/grk"
import { TextareaInput } from "../../../forms"
import { StepPanel } from "../../common"

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
            <StepPanel
                icon={FileText}
                title="Ketersediaan Dokumen"
                description="Informasi kelengkapan dokumen pendukung permohonan validasi GRK"
            >
                <div className="space-y-4">
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
                                            <TextareaInput
                                                rows={3}
                                                id={item.id}
                                                name={item.id}
                                                value={item.keterangan}
                                                onChange={(e) => handleDokumenChange(item.id, e.target.value)}
                                                placeholder="Sebutkan nomor dokumen atau berikan keterangan tidak ada"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </StepPanel>
        </div>
    )
}

export default FormDokumen
