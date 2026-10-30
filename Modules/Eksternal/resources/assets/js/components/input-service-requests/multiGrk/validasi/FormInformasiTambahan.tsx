import React from "react"
import { Building } from "lucide-react"
import { GrkValidasiFormData } from "../../../../types/grk"
import { FormField, TextInput } from "../../../forms"
import { StepPanel } from "../../common"

interface Props {
    formData: GrkValidasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkValidasiFormData>>
}

export const FormInformasiTambahan: React.FC<Props> = ({ formData, setFormData }) => {
    const {
        useKonsultan = "",
        konsultanNama = "",
        konsultanInstitusi = "",
        isShareExternal = "",
        pihakEksternal = "",
    } = formData

    const handleChange = (field: keyof GrkValidasiFormData, value: string) => {
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
                            <label className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all shadow-xs ${useKonsultan === "ya" ? "border-brand-500 bg-brand-50/40 text-brand-900 font-semibold" : "border-slate-200 bg-white hover:border-brand-300 text-slate-700"}`}>
                                <input
                                    type="radio"
                                    name="use_konsultan"
                                    value="ya"
                                    id="konsultan_ya"
                                    checked={useKonsultan === "ya"}
                                    onChange={(e) => setUseKonsultan(e.target.value)}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span className="text-xs">Ya</span>
                            </label>

                            <label className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all shadow-xs ${useKonsultan === "tidak" ? "border-brand-500 bg-brand-50/40 text-brand-900 font-semibold" : "border-slate-200 bg-white hover:border-brand-300 text-slate-700"}`}>
                                <input
                                    type="radio"
                                    name="use_konsultan"
                                    value="tidak"
                                    id="konsultan_tidak"
                                    checked={useKonsultan === "tidak"}
                                    onChange={(e) => setUseKonsultan(e.target.value)}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span className="text-xs">Tidak</span>
                            </label>
                        </div>
                    </div>

                    {useKonsultan === "ya" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-1 animate-in fade-in-50 duration-200">
                            <FormField label="Nama Konsultan" required>
                                <TextInput
                                    id="konsultan_nama"
                                    name="konsultan_nama"
                                    value={konsultanNama}
                                    onChange={(e) => setKonsultanNama(e.target.value)}
                                    placeholder="Masukkan nama konsultan"
                                />
                            </FormField>

                            <FormField label="Institusi / Lembaga Konsultan" required>
                                <TextInput
                                    id="konsultan_institusi"
                                    name="konsultan_institusi"
                                    value={konsultanInstitusi}
                                    onChange={(e) => setKonsultanInstitusi(e.target.value)}
                                    placeholder="Masukkan nama institusi konsultan"
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
                            <label className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all shadow-xs ${isShareExternal === "ya" ? "border-brand-500 bg-brand-50/40 text-brand-900 font-semibold" : "border-slate-200 bg-white hover:border-brand-300 text-slate-700"}`}>
                                <input
                                    type="radio"
                                    name="isShareExternal"
                                    value="ya"
                                    id="isShareExternalYa"
                                    checked={isShareExternal === "ya"}
                                    onChange={(e) => setIsShareExternal(e.target.value)}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span className="text-xs">Ya</span>
                            </label>

                            <label className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all shadow-xs ${isShareExternal === "tidak" ? "border-brand-500 bg-brand-50/40 text-brand-900 font-semibold" : "border-slate-200 bg-white hover:border-brand-300 text-slate-700"}`}>
                                <input
                                    type="radio"
                                    name="isShareExternal"
                                    value="tidak"
                                    id="isShareExternalTidak"
                                    checked={isShareExternal === "tidak"}
                                    onChange={(e) => setIsShareExternal(e.target.value)}
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <span className="text-xs">Tidak</span>
                            </label>
                        </div>
                    </div>

                    {isShareExternal === "ya" && (
                        <div className="pt-1 max-w-lg animate-in fade-in-50 duration-200">
                            <FormField label="Nama Pihak Eksternal" required helperText="Sebutkan entitas, lembaga, atau publikasi pihak eksternal tujuan">
                                <TextInput
                                    id="pihak_eksternal"
                                    name="pihak_eksternal"
                                    value={pihakEksternal}
                                    onChange={(e) => setPihakEksternal(e.target.value)}
                                    placeholder="Contoh: Kementerian LHK, Bursa Efek / IDX, Publik"
                                />
                            </FormField>
                        </div>
                    )}
                </div>
        </StepPanel>
    )
}

export default FormInformasiTambahan
