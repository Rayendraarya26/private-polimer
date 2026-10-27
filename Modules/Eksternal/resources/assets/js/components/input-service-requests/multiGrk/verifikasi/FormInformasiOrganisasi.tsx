import React, { useEffect } from "react"
import useProfile from "../../../../hooks/useProfile"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../../ui/Card"
import { Building, Sparkles } from "lucide-react"
import { GrkVerifikasiFormData } from "../../../../types/grk"
import { FormField, TextInput, TextareaInput } from "../../../forms"

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
    }, [detailProfile, profile, setFormData])

    const handleApplyProfile = () => {
        if (!detailProfile && !profile) return
        setFormData((prev) => ({
            ...prev,
            namaPemilik: detailProfile?.pemilik || detailProfile?.nama || profile?.name || prev.namaPemilik || "",
            namaPimpinan: detailProfile?.pimpinan || prev.namaPimpinan || "",
            namaPj: detailProfile?.pj_nama || prev.namaPj || "",
        }))
    }

    return (
        <Card className="border-brand-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                            <Building className="w-4 h-4 text-brand-600" />
                            Informasi Organisasi Verifikasi GRK
                        </CardTitle>
                        <CardDescription>
                            Lengkapi data identitas pimpinan, fasilitas operasional, dan periode pelaporan
                        </CardDescription>
                    </div>

                    {profile && (
                        <button
                            type="button"
                            onClick={handleApplyProfile}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                            title="Salin ulang data nama pimpinan dan pemilik dari profil akun Anda"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                            Gunakan Profil Akun
                        </button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    {/* Input Nama Pemilik */}
                    <FormField label="Nama Pemilik" required>
                        <TextInput
                            placeholder="Masukkan nama pemilik organisasi/perusahaan"
                            value={formData.namaPemilik || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, namaPemilik: e.target.value }))
                            }
                        />
                    </FormField>

                    {/* Input Nama Pimpinan */}
                    <FormField label="Nama Pimpinan" required>
                        <TextInput
                            placeholder="Masukkan nama direktur / pimpinan utama"
                            value={formData.namaPimpinan || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, namaPimpinan: e.target.value }))
                            }
                        />
                    </FormField>

                    {/* Input Nama Penanggung Jawab Program */}
                    <FormField
                        label="Nama Penanggung Jawab Program"
                        required
                        helper="Personel PIC verifikasi GRK"
                    >
                        <TextInput
                            placeholder="Masukkan nama penanggung jawab program"
                            value={formData.namaPj || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, namaPj: e.target.value }))
                            }
                        />
                    </FormField>

                    {/* Input Jumlah Fasilitas */}
                    <FormField
                        label="Jumlah Fasilitas Operasional"
                        required
                        helper="Jumlah pabrik, cabang, atau unit fisik yang diverifikasi"
                    >
                        <TextInput
                            type="number"
                            min={1}
                            placeholder="Contoh: 1"
                            value={formData.jumlahFasilitas || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, jumlahFasilitas: e.target.value }))
                            }
                        />
                    </FormField>

                    {/* Kriteria Verifikasi */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-bold text-slate-800">
                            Kriteria Verifikasi <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                            <label className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all shadow-xs ${formData?.kriteriaVerifikasi === "14064-1" ? "border-brand-500 bg-brand-50/40 text-brand-900 font-semibold" : "border-slate-200 bg-white hover:border-brand-300 text-slate-700"}`}>
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
                                <span className="text-xs">ISO 14064-1</span>
                            </label>

                            <label className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all shadow-xs ${formData?.kriteriaVerifikasi === "lainnya" ? "border-brand-500 bg-brand-50/40 text-brand-900 font-semibold" : "border-slate-200 bg-white hover:border-brand-300 text-slate-700"}`}>
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
                                <span className="text-xs">Lainnya</span>
                            </label>
                        </div>

                        {formData?.kriteriaVerifikasi === "lainnya" && (
                            <div className="pt-2 max-w-md animate-in fade-in-50 duration-200">
                                <TextInput
                                    placeholder="Sebutkan kriteria acuan lainnya..."
                                    value={formData?.kriteriaLainnyaText || ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            kriteriaLainnyaText: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/* Input Periode Pelaporan */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                            label="Periode Pelaporan Mulai"
                            required
                            helper="Awal rentang inventarisasi emisi"
                        >
                            <TextInput
                                type="date"
                                placeholder="Tgl Mulai"
                                value={formData.periodeMulai || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, periodeMulai: e.target.value }))
                                }
                            />
                        </FormField>

                        <FormField
                            label="Periode Pelaporan Selesai"
                            required
                            helper="Akhir rentang inventarisasi emisi"
                        >
                            <TextInput
                                type="date"
                                placeholder="Tgl Selesai"
                                min={formData.periodeMulai}
                                value={formData.periodeSelesai || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, periodeSelesai: e.target.value }))
                                }
                            />
                        </FormField>
                    </div>

                    {/* Input Jumlah Karyawan */}
                    <div className="md:col-span-2">
                        <FormField
                            label="Jumlah Total Karyawan"
                            required
                            helper="Total tenaga kerja di seluruh fasilitas terdaftar dalam lingkup verifikasi"
                        >
                            <TextInput
                                type="number"
                                min={1}
                                placeholder="Contoh: 150"
                                value={formData.jumlahKaryawan || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, jumlahKaryawan: e.target.value }))
                                }
                            />
                        </FormField>
                    </div>

                    {/* Input Deskripsi Aktivitas Perusahaan */}
                    <div className="md:col-span-2">
                        <FormField
                            label="Deskripsi Aktivitas Perusahaan"
                            required
                            helper="Ringkasan proses industri, jenis operasional, dan kegiatan utama entitas"
                        >
                            <TextareaInput
                                rows={3}
                                placeholder="Jelaskan ringkasan aktivitas operasional atau kegiatan industri perusahaan..."
                                value={formData.deskripsiAktivitas || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, deskripsiAktivitas: e.target.value }))
                                }
                            />
                        </FormField>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FormInformasiOrganisasi
