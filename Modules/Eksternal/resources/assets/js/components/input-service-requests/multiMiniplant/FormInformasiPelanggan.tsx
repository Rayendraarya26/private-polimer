import React, { useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../ui/Card"
import { UserCheck, User, Phone, MapPin } from "lucide-react"
import { toast } from "react-hot-toast"
import useProfile from "../../../hooks/useProfile"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import { FormField, TextInput, TextareaInput } from "../../forms"

export interface PelangganData {
    namaPemohon?: string
    no_telp?: string
    alamat?: string
}

export interface FormInformasiPelangganProps {
    formData?: PelangganData
    setFormData?: React.Dispatch<React.SetStateAction<PelangganData>>
    loading?: boolean
}

export const FormInformasiPelanggan: React.FC<FormInformasiPelangganProps> = ({
    formData,
    setFormData,
    loading = false,
}) => {
    const { profile: reduxProfile, loading: isLoadingRedux, getMyProfile } = useProfile()
    const { profile: queryProfile, isLoading: isLoadingQuery } = useProfileQuery()

    const profile = reduxProfile || queryProfile
    const isLoadingProfile = (isLoadingRedux || isLoadingQuery) && !profile

    // Pastikan profil user dimuat jika belum ada di Redux/Query
    useEffect(() => {
        if (!profile && getMyProfile) {
            getMyProfile()
        }
    }, [profile, getMyProfile])

    // Fungsi ekstraksi data pemohon dari profil pengguna yang login
    const extractProfileData = (raw: any) => {
        if (!raw) return null
        const userProfile = raw?.results || raw?.data || raw
        const detail = (userProfile?.detail || {}) as Record<string, any>

        const namaPemohon =
            detail?.pj_nama ||
            userProfile?.name ||
            userProfile?.nama ||
            detail?.nama ||
            detail?.pimpinan ||
            detail?.pemilik ||
            userProfile?.username ||
            ""

        const no_telp =
            detail?.pj_whatsapp ||
            detail?.whatsapp ||
            userProfile?.whatsapp ||
            detail?.telepon ||
            userProfile?.phone ||
            userProfile?.no_hp ||
            detail?.pj_telepon ||
            ""

        const alamat =
            detail?.alamat ||
            userProfile?.alamat ||
            detail?.alamat_perusahaan ||
            userProfile?.address ||
            ""

        return { namaPemohon, no_telp, alamat }
    }

    // Auto-fill data pemohon jika profil user login sudah siap
    useEffect(() => {
        const extracted = extractProfileData(profile)
        if (!extracted || !setFormData) return

        setFormData((prev) => {
            const isDummyName = prev?.namaPemohon === "Budi Santoso"
            const isDummyTelp = prev?.no_telp === "081234567890"
            const isDummyAlamat = prev?.alamat?.includes("Sokonandi")

            return {
                ...prev,
                namaPemohon: (!prev?.namaPemohon || isDummyName ? extracted.namaPemohon : prev.namaPemohon) || extracted.namaPemohon || "",
                no_telp: (!prev?.no_telp || isDummyTelp ? extracted.no_telp : prev.no_telp) || extracted.no_telp || "",
                alamat: (!prev?.alamat || isDummyAlamat ? extracted.alamat : prev.alamat) || extracted.alamat || "",
            }
        })
    }, [profile, setFormData])

    // Handler tombol isi ulang / sinkronisasi manual dari data profil
    const handleApplyProfileData = () => {
        const extracted = extractProfileData(profile)
        if (!extracted) {
            toast.error("Data profil akun belum berhasil dimuat.")
            return
        }

        setFormData?.((prev) => ({
            ...prev,
            namaPemohon: extracted.namaPemohon,
            no_telp: extracted.no_telp,
            alamat: extracted.alamat,
        }))
        toast.success("Data pemohon berhasil disinkronkan dari profil akun Anda!")
    }

    const handleChange = (field: keyof PelangganData, value: string) => {
        setFormData?.((prev) => ({
            ...(prev || {}),
            [field]: value,
        }))
    }

    const isFieldDisabled = loading || isLoadingProfile

    return (
        <Card className="border-brand-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                            <UserCheck className="w-4 h-4 text-brand-600" />
                            Informasi Pelanggan
                        </CardTitle>
                        <CardDescription>
                            Data identitas dan kontak pemohon layanan miniplant
                        </CardDescription>
                    </div>

                    <button
                        type="button"
                        onClick={handleApplyProfileData}
                        disabled={isFieldDisabled}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 bg-white border border-brand-200 hover:bg-brand-50 hover:border-brand-300 transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
                    >
                        <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                        <span>Gunakan Profil Akun</span>
                    </button>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    {/* Nama Pemohon */}
                    <div className="md:col-span-1">
                        <FormField label="Nama Peminta Jasa" required>
                            <TextInput
                                placeholder="Nama Lengkap Peminta Jasa"
                                disabled={isFieldDisabled}
                                value={formData?.namaPemohon || ""}
                                onChange={(e) => handleChange("namaPemohon", e.target.value)}
                                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                            />
                        </FormField>
                    </div>

                    {/* Nomor Telepon */}
                    <div className="md:col-span-1">
                        <FormField label="Nomor Telepon / WhatsApp" required>
                            <TextInput
                                type="tel"
                                placeholder="Contoh: 081234567890"
                                disabled={isFieldDisabled}
                                value={formData?.no_telp || ""}
                                onChange={(e) => handleChange("no_telp", e.target.value)}
                                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                            />
                        </FormField>
                    </div>

                    {/* Alamat */}
                    <div className="md:col-span-2">
                        <FormField label="Alamat Peminta Jasa" required>
                            <TextareaInput
                                rows={3}
                                placeholder="Alamat lengkap instansi / pemohon..."
                                disabled={isFieldDisabled}
                                value={formData?.alamat || ""}
                                onChange={(e) => handleChange("alamat", e.target.value)}
                            />
                        </FormField>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FormInformasiPelanggan
