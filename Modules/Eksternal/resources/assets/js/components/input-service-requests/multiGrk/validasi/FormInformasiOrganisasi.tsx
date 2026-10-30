import React, { useEffect } from "react"
import useProfile from "../../../../hooks/useProfile"
import { Building } from "lucide-react"
import { GrkValidasiFormData } from "../../../../types/grk"
import { FormField, TextInput, TextareaInput } from "../../../forms"
import { StepPanel } from "../../common"

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

    return (
        <StepPanel
            icon={Building}
            title="Informasi Organisasi"
            description="Lengkapi identitas penanggung jawab dan profil organisasi untuk validasi GRK"
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
        </StepPanel>
    )
}

export default FormInformasiOrganisasi
