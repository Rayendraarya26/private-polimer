import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../../ui/Card"
import { Globe } from "lucide-react"
import { GrkVerifikasiFormData } from "../../../../types/grk"
import { FormField, TextInput, TextareaInput } from "../../../forms"

interface Props {
    formData: GrkVerifikasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkVerifikasiFormData>>
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
                            Informasi Umum Verifikasi GRK
                        </CardTitle>
                        <CardDescription>
                            Tentukan identitas program verifikasi emisi dan standar acuan yang digunakan
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    {/* Verifikasi GRK */}
                    <div className="col-span-1 md:col-span-2">
                        <FormField
                            label="Verifikasi / Merek GRK"
                            required
                            helper="Contoh: Laporan Emisi Tahunan Fasilitas Manufaktur atau Merek Program GRK Organisasi"
                        >
                            <TextInput
                                placeholder="Masukkan merek contoh atau nama program verifikasi"
                                id="merek_sample"
                                value={formData.merekSample || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, merekSample: e.target.value }))
                                }
                            />
                        </FormField>
                    </div>

                    {/* Acuan Peraturan */}
                    <div className="col-span-1 md:col-span-2">
                        <FormField
                            label="Acuan Peraturan / Standar Verifikasi"
                            required
                            helper="Contoh: ISO 14064-1:2018, GHG Protocol Corporate Standard, Permen LHK 21/2022"
                        >
                            <TextInput
                                placeholder="Masukkan standar acuan peraturan atau metodologi"
                                id="acuan"
                                value={formData.acuan || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, acuan: e.target.value }))
                                }
                            />
                        </FormField>
                    </div>

                    {/* Ruang Lingkup yang Diajukan */}
                    <div className="md:col-span-2">
                        <FormField
                            label="Ruang Lingkup yang Diajukan"
                            required
                            helper="Cakupan batas organisasi, fasilitas fisik operasional, dan kategori emisi lingkup 1, 2, atau 3"
                        >
                            <TextareaInput
                                rows={3}
                                name="keterangan"
                                id="keterangan"
                                placeholder="Jelaskan batasan fasilitas dan ruang lingkup emisi GRK yang diajukan..."
                                value={formData.keterangan || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, keterangan: e.target.value }))
                                }
                            />
                        </FormField>
                    </div>

                    {/* Uraian Mengenai Penawaran */}
                    <div className="md:col-span-2">
                        <FormField
                            label="Uraian Mengenai Penawaran yang Dikehendaki"
                            required
                            helper="Jelaskan kebutuhan sertifikasi/verifikasi khusus, jadwal audit lapangan yang diharapkan, dll."
                        >
                            <TextareaInput
                                rows={3}
                                placeholder="Tuliskan rincian kebutuhan penawaran atau permintaan khusus..."
                                id="uraianKebutuhan"
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
