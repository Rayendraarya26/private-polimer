import React from "react"
import { ShieldCheck } from "lucide-react"
import { GrkValidasiFormData } from "../../../../types/grk"
import { StepPanel } from "../../common"

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
            <StepPanel
                icon={ShieldCheck}
                title="Pernyataan Hukum & Persetujuan Pemohon"
                description="Harap telaah dan setujui klausul pertanggungjawaban serta komitmen validasi GRK berikut"
            >
                <div className="space-y-6 divide-y divide-slate-200">
                    {/* Klausul 1: Perubahan Laporan */}
                    <div className="pt-2 first:pt-0">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={pernyataanPerubahan}
                                onChange={(e) => handleCheckboxChange("pernyataanPerubahan", e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 shrink-0 cursor-pointer"
                            />
                            <div className="text-sm leading-relaxed text-slate-700">
                                <span className="font-bold text-slate-900 block mb-1">
                                    Pernyataan Perubahan pada Laporan Validasi <span className="text-rose-500">*</span>
                                </span>
                                <p className="text-slate-600 mb-1.5">
                                    Setelah Laporan diterbitkan, kami tidak akan meminta diadakannya perubahan pada laporan mengenai tanda-tanda contoh maupun alamat peminta Validasi/Sertifikasi.
                                </p>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Setelah Laporan Validasi diterbitkan secara sah oleh Lembaga Validasi &amp; Verifikasi (LVV) BBSPJIKKP, data identitas pemohon dan penandaan contoh bersifat final dan tidak dapat diubah tanpa prosedur penerbitan ulang resmi sesuai regulasi KAN dan ISO 14065.
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Klausul 2: Integritas Pemohon */}
                    <div className="pt-6">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={pernyataanPemohon}
                                onChange={(e) => handleCheckboxChange("pernyataanPemohon", e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 shrink-0 cursor-pointer"
                            />
                            <div className="text-sm leading-relaxed text-slate-700">
                                <span className="font-bold text-slate-900 block mb-1">
                                    Pernyataan Kebenaran Data dan Integritas Pemohon <span className="text-rose-500">*</span>
                                </span>
                                <p className="text-slate-600">
                                    Kami telah mengisi seluruh formulir dengan jujur, benar, dan sah secara hukum agar digunakan sebagaimana mestinya dalam proses validasi GRK.
                                </p>
                            </div>
                        </label>
                    </div>
                </div>
            </StepPanel>
        </div>
    )
}

export default FormPernyataan