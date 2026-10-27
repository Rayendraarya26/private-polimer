import React, { useEffect } from "react"
import useProfile from "../../../../hooks/useProfile"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../../ui/Card"
import { Building, Sparkles } from "lucide-react"
import { GrkValidasiFormData } from "../../../../types/grk"
import { FormField, TextInput, TextareaInput } from "../../../forms"

interface Props {
    formData: GrkValidasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkValidasiFormData>>
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
                            Informasi Organisasi
                        </CardTitle>
                        <CardDescription>
                            Lengkapi identitas penanggung jawab dan profil organisasi untuk validasi GRK
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
                    <div className="md:col-span-2">
                        <FormField
                            label="Nama Penanggung Jawab Program"
                            required
                            helper="Personel PIC yang bertanggung jawab atas program validasi GRK"
                        >
                            <TextInput
                                placeholder="Masukkan nama penanggung jawab program"
                                value={formData.namaPj || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, namaPj: e.target.value }))
                                }
                            />
                        </FormField>
                    </div>

                    {/* Input Deskripsi Aktivitas Perusahaan */}
                    <div className="md:col-span-2">
                        <FormField
                            label="Deskripsi Aktivitas Perusahaan"
                            required
                            helper="Ringkasan proses industri, jenis output produk, dan kegiatan utama entitas"
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
