import React, { useEffect } from "react"
import useProfile from "../../../../hooks/useProfile";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../../ui/Card";
import { Building, Info } from "lucide-react";
import { GrkVerifikasiFormData } from "../../../../types/grk";

interface Props {
    formData: GrkVerifikasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkVerifikasiFormData>>
}

export const FormInformasiOrganisasi: React.FC<Props> = ({
    formData,
    setFormData
}) => {

    const { profile } = useProfile()
    const detailProfile = profile?.detail

    useEffect(() => {
        if (!detailProfile && !profile) return

        setFormData((prev) => ({
            ...prev,
            namaPemilik: prev.namaPemilik || detailProfile?.pemilik || detailProfile?.nama || profile?.name || "",
            namaPimpinan: prev.namaPimpinan || detailProfile?.pimpinan || "",
            namaPj: prev.namaPj || detailProfile?.pj_nama || "",

        }))
    }, [detailProfile, profile])


    return (
        <Card className="border-brand-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Building className="w-4 h-4 text-brand-600" />
                            Informasi Organisasi
                        </CardTitle>
                        <CardDescription>
                            Masukkan informasi organisasi
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Input Nama Pemilik */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Nama Pemilik <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Nama Pemilik"
                            value={formData.namaPemilik || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, namaPemilik: e.target.value }))
                            }
                            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors text-slate-800"
                        />
                    </div>

                    {/* Input Nama Pimpinan */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Nama Pimpinan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Nama Pimpinan"
                            value={formData.namaPimpinan || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, namaPimpinan: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>

                    {/* Input Nama Penanggung Jawab Program */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Nama Penanggung Jawab Program <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Nama Penanggung Jawab Program"
                            value={formData.namaPj || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, namaPj: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>

                    {/* Input Jumlah Fasilitas */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Jumlah Fasilitas <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Jumlah Fasilitas"
                            value={formData.jumlahFasilitas || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, jumlahFasilitas: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>

                    {/* Kriteria Verifikasi */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Kriteria Verifikasi <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-3 pt-1">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="14064-1"
                                    name="kriteria_verifikasi"
                                    value="14064-1"
                                    checked={formData?.kriteriaVerifikasi === "14064-1"}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            kriteriaVerifikasi: e.target.value,
                                        }))
                                    }
                                    className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                />
                                <label htmlFor="14064-1" className="ms-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                                    14064-1
                                </label>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="lainnya"
                                        name="kriteria_verifikasi"
                                        value="lainnya"
                                        checked={formData?.kriteriaVerifikasi === "lainnya"}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                kriteriaVerifikasi: e.target.value,
                                            }))
                                        }
                                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-slate-300"
                                    />
                                    <label htmlFor="lainnya" className="ms-2.5 text-sm font-medium text-slate-700 cursor-pointer">
                                        Lainnya
                                    </label>
                                </div>
                                {formData?.kriteriaVerifikasi === "lainnya" && (
                                    <div className="pl-6 pt-1">
                                        <input
                                            type="text"
                                            placeholder="Kriteria lainnya"
                                            value={formData?.kriteriaLainnyaText || ""}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    kriteriaLainnyaText: e.target.value,
                                                }))
                                            }
                                            className="w-full md:w-1/2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Input Periode Pelaporan */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Periode Pelaporan <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type={formData.periodeMulai ? "date" : "text"}
                                placeholder="Tgl Mulai"
                                min={new Date().toLocaleDateString("en-CA")}
                                value={formData.periodeMulai || ""}
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => {
                                    if (!e.target.value) e.target.type = "text"
                                }}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, periodeMulai: e.target.value }))
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                            <input
                                type={formData.periodeSelesai ? "date" : "text"}
                                placeholder="Tgl Selesai"
                                min={formData.periodeMulai || new Date().toLocaleDateString("en-CA")}
                                value={formData.periodeSelesai || ""}
                                onFocus={(e) => (e.target.type = "date")}
                                onBlur={(e) => {
                                    if (!e.target.value) e.target.type = "text"
                                }}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, periodeSelesai: e.target.value }))
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Input Jumlah Karyawan */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Jumlah Karyawan <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Jumlah Karyawan"
                            value={formData.jumlahKaryawan || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, jumlahKaryawan: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>

                    {/* Input Deskripsi Aktivitas Perusahaan */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                            Deskripsi aktivitas perusahaan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Deskripsi aktivitas perusahaan"
                            value={formData.deskripsiAktivitas || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, deskripsiAktivitas: e.target.value }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                        />
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}


export default FormInformasiOrganisasi
