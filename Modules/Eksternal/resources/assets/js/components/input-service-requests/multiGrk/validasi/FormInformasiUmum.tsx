import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../../ui/Card"
import { Globe } from "lucide-react"
import { GrkValidasiFormData } from "../../../../types/grk"
import { FormField, TextInput, TextareaInput } from "../../../forms"

interface Props {
    formData: GrkValidasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkValidasiFormData>>
}

export const FormInformasiUmum: React.FC<Props> = ({
    formData,
    setFormData
}) => {
    return (
        <Card className="border-brand-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                            <Globe className="w-4 h-4 text-brand-600" />
                            Informasi Umum Validasi GRK
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
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
            </CardContent>
        </Card>
    )
}

export default FormInformasiUmum
