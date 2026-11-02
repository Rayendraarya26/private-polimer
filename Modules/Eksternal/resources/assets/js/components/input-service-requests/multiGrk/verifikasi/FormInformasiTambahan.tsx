import React from "react"
import { Building } from "lucide-react"
import { GrkVerifikasiFormData } from "../../../../types/grk"
import { FormField } from "../../../forms"
import { StepPanel, inputClass } from "../../common"

interface Props {
    formData: GrkVerifikasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkVerifikasiFormData>>
}

export const FormInformasiTambahan: React.FC<Props> = ({ formData, setFormData }) => {
    const {
        useKonsultan = "",
        konsultanNama = "",
        konsultanInstitusi = "",
        isShareExternal = "",
        pihakEksternal = "",
    } = formData

    const handleChange = (field: keyof GrkVerifikasiFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const setUseKonsultan = (val: string) => handleChange("useKonsultan", val)
    const setKonsultanNama = (val: string) => handleChange("konsultanNama", val)
    const setKonsultanInstitusi = (val: string) => handleChange("konsultanInstitusi", val)
    const setIsShareExternal = (val: string) => handleChange("isShareExternal", val)
    const setPihakEksternal = (val: string) => handleChange("pihakEksternal", val)

    return (
        <StepPanel
            icon={Building}
            title="Informasi Tambahan"
            description="Informasi keterlibatan konsultan dan publikasi kepada pihak eksternal"
        >
            <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-800">
                            Apakah perusahaan telah melibatkan konsultan untuk inventarisasi dan pelaporan emisi GRK? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            <label className={`flex items-center gap-2.5 h-10 px-3.5 rounded-lg border cursor-pointer select-none transition-all text-sm ${useKonsultan === "ya" ? "border-brand-600 bg-brand-50/40 text-brand-900 font-medium" : "border-slate-300 bg-white hover:border-slate-400 text-slate-700"}`}>
                                <input
                                    type="radio"
                                    name="use_konsultan"
                                    value="ya"
                                    id="konsultan_ya"
                                    checked={useKonsultan === "ya"}
                                    onChange={(e) => setUseKonsultan(e.target.value)}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span>Ya</span>
                            </label>

                            <label className={`flex items-center gap-2.5 h-10 px-3.5 rounded-lg border cursor-pointer select-none transition-all text-sm ${useKonsultan === "tidak" ? "border-brand-600 bg-brand-50/40 text-brand-900 font-medium" : "border-slate-300 bg-white hover:border-slate-400 text-slate-700"}`}>
                                <input
                                    type="radio"
                                    name="use_konsultan"
                                    value="tidak"
                                    id="konsultan_tidak"
                                    checked={useKonsultan === "tidak"}
                                    onChange={(e) => setUseKonsultan(e.target.value)}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span>Tidak</span>
                            </label>
                        </div>
                    </div>

                    {useKonsultan === "ya" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-1 animate-in fade-in-50 duration-200">
                            <FormField label="Nama Konsultan" required>
                                <input
                                    type="text"
                                    id="konsultan_nama"
                                    name="konsultan_nama"
                                    value={konsultanNama}
                                    onChange={(e) => setKonsultanNama(e.target.value)}
                                    placeholder="Masukkan nama konsultan"
                                    className={inputClass}
                                />
                            </FormField>

                            <FormField label="Institusi / Lembaga Konsultan" required>
                                <input
                                    type="text"
                                    id="konsultan_institusi"
                                    name="konsultan_institusi"
                                    value={konsultanInstitusi}
                                    onChange={(e) => setKonsultanInstitusi(e.target.value)}
                                    placeholder="Masukkan nama institusi konsultan"
                                    className={inputClass}
                                />
                            </FormField>
                        </div>
                    )}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-800">
                            Apakah perusahaan membagikan informasi GRK ke pihak eksternal? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            <label className={`flex items-center gap-2.5 h-10 px-3.5 rounded-lg border cursor-pointer select-none transition-all text-sm ${isShareExternal === "ya" ? "border-brand-600 bg-brand-50/40 text-brand-900 font-medium" : "border-slate-300 bg-white hover:border-slate-400 text-slate-700"}`}>
                                <input
                                    type="radio"
                                    name="isShareExternal"
                                    value="ya"
                                    id="isShareExternalYa"
                                    checked={isShareExternal === "ya"}
                                    onChange={(e) => setIsShareExternal(e.target.value)}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span>Ya</span>
                            </label>

                            <label className={`flex items-center gap-2.5 h-10 px-3.5 rounded-lg border cursor-pointer select-none transition-all text-sm ${isShareExternal === "tidak" ? "border-brand-600 bg-brand-50/40 text-brand-900 font-medium" : "border-slate-300 bg-white hover:border-slate-400 text-slate-700"}`}>
                                <input
                                    type="radio"
                                    name="isShareExternal"
                                    value="tidak"
                                    id="isShareExternalTidak"
                                    checked={isShareExternal === "tidak"}
                                    onChange={(e) => setIsShareExternal(e.target.value)}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span>Tidak</span>
                            </label>
                        </div>
                    </div>

                    {isShareExternal === "ya" && (
                        <div className="pt-1 max-w-lg animate-in fade-in-50 duration-200">
                            <FormField label="Nama Pihak Eksternal" required helperText="Sebutkan entitas, lembaga, atau publikasi pihak eksternal tujuan">
                                <input
                                    type="text"
                                    id="pihak_eksternal"
                                    name="pihak_eksternal"
                                    value={pihakEksternal}
                                    onChange={(e) => setPihakEksternal(e.target.value)}
                                    placeholder="Contoh: Kementerian LHK, Bursa Efek / IDX, Publik"
                                    className={inputClass}
                                />
                            </FormField>
                        </div>
                    )}
                </div>
        </StepPanel>
    )
}

export default FormInformasiTambahan
