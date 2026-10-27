import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../ui/Card"
import { FileText, Wrench } from "lucide-react"
import { FormField, TextInput, TextareaInput } from "../../forms"

export interface DetailPermohonanData {
    jasaDiminta?: 'proses' | 'mesin' | ''
    jenisBarang?: string
    jumlahBarang?: number | string
    perlakuanDiminta?: string
    tekananNilai?: number | string
    tekananSatuan?: string
    waktuNilai?: number | string
    waktuSatuan?: string
    temperaturNilai?: number | string
    temperaturSatuan?: string
}

export interface FormDetailPermohonanProps {
    formData?: DetailPermohonanData
    setFormData?: React.Dispatch<React.SetStateAction<DetailPermohonanData>>
    jenisLayananJudul?: string
    fasilitasJudul?: string
    loading?: boolean
}

export const FormDetailPermohonan: React.FC<FormDetailPermohonanProps> = ({
    formData,
    setFormData,
    jenisLayananJudul,
    fasilitasJudul,
    loading = false,
}) => {
    const handleChange = (field: keyof DetailPermohonanData, value: string) => {
        setFormData?.((prev) => ({
            ...(prev || {}),
            [field]: value,
        }))
    }

    return (
        <Card className="border-brand-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                            <FileText className="w-4 h-4 text-brand-600" />
                            Detail Permohonan
                        </CardTitle>
                        <CardDescription>
                            {jenisLayananJudul || fasilitasJudul || "Pilih jenis layanan yang dikehendaki"}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div>
                        <FormField label="Jenis Barang" required>
                            <TextInput
                                placeholder="Contoh: Kulit Sapi Wet Blue / Kompon Karet"
                                value={formData?.jenisBarang || ""}
                                onChange={(e) => handleChange("jenisBarang", e.target.value)}
                            />
                        </FormField>
                    </div>

                    <div>
                        <FormField label="Jumlah Barang" required>
                            <TextInput
                                type="number"
                                placeholder="Jumlah barang yang akan diproses"
                                min={1}
                                value={String(formData?.jumlahBarang ?? "")}
                                onChange={(e) => handleChange("jumlahBarang", e.target.value)}
                            />
                        </FormField>
                    </div>

                    <div className="md:col-span-2">
                        <FormField
                            label="Perlakuan yang Diminta"
                            helperText="Deskripsikan perlakuan atau catatan khusus yang diminta (opsional)"
                        >
                            <TextareaInput
                                rows={3}
                                placeholder="Deskripsikan perlakuan atau catatan khusus yang diminta..."
                                value={formData?.perlakuanDiminta || ""}
                                onChange={(e) => handleChange("perlakuanDiminta", e.target.value)}
                            />
                        </FormField>
                    </div>

                    {/* Parameter Teknis Tambahan (Opsional) */}
                    <div className="md:col-span-2 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                            <Wrench className="w-4 h-4 text-brand-600" />
                            <h4 className="text-xs font-bold text-slate-800">
                                Parameter Teknis Mesin / Proses <span className="text-slate-400 font-normal">(Opsional)</span>
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tekanan */}
                            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                                <label className="block text-xs font-bold text-slate-700">Tekanan</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <TextInput
                                        type="number"
                                        min={0}
                                        placeholder="Nilai"
                                        value={String(formData?.tekananNilai ?? "")}
                                        onChange={(e) => handleChange("tekananNilai", e.target.value)}
                                    />
                                    <TextInput
                                        placeholder="Satuan (bar, psi)"
                                        value={formData?.tekananSatuan || ""}
                                        onChange={(e) => handleChange("tekananSatuan", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Waktu */}
                            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                                <label className="block text-xs font-bold text-slate-700">Waktu</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <TextInput
                                        type="number"
                                        min={0}
                                        placeholder="Nilai"
                                        value={String(formData?.waktuNilai ?? "")}
                                        onChange={(e) => handleChange("waktuNilai", e.target.value)}
                                    />
                                    <TextInput
                                        placeholder="Satuan (menit, jam)"
                                        value={formData?.waktuSatuan || ""}
                                        onChange={(e) => handleChange("waktuSatuan", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Temperatur */}
                            <div className="md:col-span-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                                <label className="block text-xs font-bold text-slate-700">Temperatur</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <TextInput
                                        type="number"
                                        placeholder="Nilai"
                                        value={String(formData?.temperaturNilai ?? "")}
                                        onChange={(e) => handleChange("temperaturNilai", e.target.value)}
                                    />
                                    <TextInput
                                        placeholder="Satuan (°C)"
                                        value={formData?.temperaturSatuan || ""}
                                        onChange={(e) => handleChange("temperaturSatuan", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FormDetailPermohonan
