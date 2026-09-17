import React, { useEffect } from "react"
import useProfile from "../../../../hooks/useProfile";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../../ui/Card";
import { Building, Info, Globe } from "lucide-react";
import { GrkVerifikasiFormData } from "../../../../types/grk";

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
                        <CardTitle className="text-base flex items-center gap-2">
                            <Globe className="w-4 h-4 text-brand-600" />
                            Informasi Umum
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Verifikasi GRK<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Merek Contoh"
                            id="merek_sample"
                            value={formData.merekSample || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, merekSample: e.target.value }))
                            }
                            className="w-full md:max-w-[calc(50%-1rem)] px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors text-slate-800"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Acuan Peraturan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Acuan Peraturan"
                            id="acuan"
                            value={formData.acuan || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, acuan: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>


                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Ruang Lingkup yang Diajukan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            name="keterangan"
                            id="keterangan"
                            placeholder="Deskripsi Lainnya"
                            value={formData.keterangan || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, keterangan: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>



                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Uraian mengenai penawaran yang dikehendaki<span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Uraian kebutuhan sertifikasi"
                            id="uraianKebutuhan"
                            value={formData.uraianKebutuhan || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, uraianKebutuhan: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}


export default FormInformasiUmum
