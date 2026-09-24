import React, { useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../ui/Card"
import { UserCheck, Loader2 } from "lucide-react"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"

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

    const jasaDiminta = formData?.jasaDiminta || ""


    return (
        <Card className="border-brand-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                            <UserCheck className="w-4 h-4 text-brand-600" />
                            Detail Permohonan
                        </CardTitle>
                        <CardDescription>
                            {jenisLayananJudul || fasilitasJudul || "Pilih jenis layanan yang dikehendaki"}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    <div className="md:col-span-1 md:col-start-1">
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            Jasa yang Diminta <span className="text-rose-500">*</span>
                        </label>
                        <select
                            name="jasa_diminta"
                            id="jasa_diminta"
                            value={jasaDiminta}
                            onChange={(e) => handleChange("jasaDiminta", e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors cursor-pointer"
                        >
                            <option>--- Pilih Jasa yang Diminta ---</option>
                            <option value="proses">Proses</option>
                            <option value="mesin">Mesin</option>
                        </select>
                    </div>

                    <div className="md:col-span-1 md:col-start-1">
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            Jenis Barang <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Jenis Barang"
                            name="jenis_barang"
                            id="jenis_barang"
                            value={formData?.jenisBarang}
                            onChange={(e) => handleChange("jenisBarang", e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                            Jumlah Barang <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Jumlah barang yang akan diproses"
                            name="jumlah_barang"
                            id="jumlah_barang"
                            min={1}
                            value={formData?.jumlahBarang}
                            onChange={(e) => handleChange("jumlahBarang", e.target.value)}
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                        />
                    </div>

                    <div className="md:col-span-2">
                        {jasaDiminta ? (
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Perlakuan yang diminta<span className="text-rose-500">*</span>
                            </label>
                        ) : null}


                        {jasaDiminta === 'proses' ? (
                            <textarea
                                rows={4}
                                id="perlakuan_diminta"
                                name="perlakuan_diminta"
                                placeholder="Perlakuan yang diminta"
                                value={formData?.perlakuanDiminta}
                                onChange={(e) => handleChange("perlakuanDiminta", e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                            />
                        ) : jasaDiminta === 'mesin' ? (
                            <div className="space-y-3.5 max-w-2xl pt-1">
                                {/* Tekanan */}
                                <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr_60px_130px] items-center gap-3">
                                    <label htmlFor="tekanan_nilai" className="text-xs font-semibold text-slate-700">
                                        Tekanan
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault()
                                        }}
                                        placeholder="Nilai Tekanan"
                                        name="tekanan_nilai"
                                        id="tekanan_nilai"
                                        value={formData?.tekananNilai}
                                        onChange={(e) => handleChange("tekananNilai", e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                    />
                                    <span className="text-xs font-semibold text-slate-600 sm:text-center">
                                        Satuan
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Misal: bar, psi"
                                        name="tekanan_satuan"
                                        id="tekanan_satuan"
                                        value={formData?.tekananSatuan}
                                        onChange={(e) => handleChange("tekananSatuan", e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                    />
                                </div>

                                {/* Waktu */}
                                <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr_60px_130px] items-center gap-3">
                                    <label htmlFor="waktu_nilai" className="text-xs font-semibold text-slate-700">
                                        Waktu
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault()
                                        }}
                                        placeholder="Nilai Waktu"
                                        name="waktu_nilai"
                                        id="waktu_nilai"
                                        value={formData?.waktuNilai}
                                        onChange={(e) => handleChange("waktuNilai", e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                    />
                                    <span className="text-xs font-semibold text-slate-600 sm:text-center">
                                        Satuan
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Misal: menit, jam"
                                        name="waktu_satuan"
                                        id="waktu_satuan"
                                        value={formData?.waktuSatuan}
                                        onChange={(e) => handleChange("waktuSatuan", e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                    />
                                </div>

                                {/* Temperatur */}
                                <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr_60px_130px] items-center gap-3">
                                    <label htmlFor="temperatur_nilai" className="text-xs font-semibold text-slate-700">
                                        Temperatur
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Nilai Temperatur"
                                        name="temperatur_nilai"
                                        id="temperatur_nilai"
                                        value={formData?.temperaturNilai}
                                        onChange={(e) => handleChange("temperaturNilai", e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                    />
                                    <span className="text-xs font-semibold text-slate-600 sm:text-center">
                                        Satuan
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Misal: °C"
                                        name="temperatur_satuan"
                                        id="temperatur_satuan"
                                        value={formData?.temperaturSatuan}
                                        onChange={(e) => handleChange("temperaturSatuan", e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                    />
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}

export default FormDetailPermohonan
