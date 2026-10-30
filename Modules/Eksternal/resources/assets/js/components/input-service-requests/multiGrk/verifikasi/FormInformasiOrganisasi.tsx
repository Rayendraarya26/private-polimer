import React, { useEffect } from "react"
import useProfile from "../../../../hooks/useProfile"
import { Building } from "lucide-react"
import { GrkVerifikasiFormData } from "../../../../types/grk"
import { FormField, TextInput, TextareaInput } from "../../../forms"
import { StepPanel } from "../../common"

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

    return (
        <StepPanel
            icon={Building}
            title="Informasi Organisasi Verifikasi GRK"
            description="Lengkapi data identitas pimpinan, fasilitas operasional, dan periode pelaporan"
        >
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
        </StepPanel>
    )
}

export default FormInformasiOrganisasi
