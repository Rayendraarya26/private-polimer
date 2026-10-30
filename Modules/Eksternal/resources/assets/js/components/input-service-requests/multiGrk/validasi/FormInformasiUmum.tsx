import React from "react"
import { Globe } from "lucide-react"
import { GrkValidasiFormData } from "../../../../types/grk"
import { FormField, TextInput, TextareaInput } from "../../../forms"
import { StepPanel } from "../../common"

interface Props {
    formData: GrkValidasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkValidasiFormData>>
}

export const FormInformasiUmum: React.FC<Props> = ({
    formData,
    setFormData
}) => {
    return (
        <StepPanel
            icon={Globe}
            title="Informasi Umum Validasi GRK"
            description="Tentukan identitas rencana proyek mitigasi emisi dan standar acuan yang digunakan"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="md:col-span-1">
                        <FormField label="Nama / Merek Proyek Contoh" required>
                            <TextInput
                                placeholder="Merek Contoh Proyek"
                                value={formData.merekSample || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, merekSample: e.target.value }))
                                }
                            />
                        </FormField>
                    </div>

                    <div className="md:col-span-1">
                        <FormField label="Acuan Peraturan / Standar" required>
                            <TextInput
                                placeholder="Contoh: ISO 14064-2 / Regulasi NEK"
                                value={formData.acuan || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, acuan: e.target.value }))
                                }
                            />
                        </FormField>
                    </div>

                    <div className="md:col-span-2">
                        <FormField label="Ruang Lingkup yang Diajukan" required>
                            <TextareaInput
                                rows={3}
                                placeholder="Deskripsi ruang lingkup proyek validasi..."
                                value={formData.keterangan || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, keterangan: e.target.value }))
                                }
                            />
                        </FormField>
                    </div>

                    <div className="md:col-span-2">
                        <FormField label="Uraian Mengenai Penawaran yang Dikehendaki" required>
                            <TextareaInput
                                rows={3}
                                placeholder="Uraian kebutuhan validasi atau target validasi yang diinginkan..."
                                value={formData.uraianKebutuhan || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, uraianKebutuhan: e.target.value }))
                                }
                            />
                        </FormField>
                    </div>
                </div>
        </StepPanel>
    )
}

export default FormInformasiUmum
