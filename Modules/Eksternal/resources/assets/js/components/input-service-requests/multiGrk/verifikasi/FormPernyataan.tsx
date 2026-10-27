import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../../ui/Card"
import { ShieldCheck, CheckCheck } from "lucide-react"
import { GrkVerifikasiFormData } from "../../../../types/grk"
import { LegalStatementBox } from "../../../forms"

interface Props {
    formData: GrkVerifikasiFormData
    setFormData: React.Dispatch<React.SetStateAction<GrkVerifikasiFormData>>
}

export const FormPernyataan: React.FC<Props> = ({ formData, setFormData }) => {
    const pernyataanPerubahan = Boolean(formData.pernyataanPerubahan)
    const pernyataanPemohon = Boolean(formData.pernyataanPemohon ?? (formData as any).pernyataanPermohonan)
    const isAllChecked = pernyataanPerubahan && pernyataanPemohon

    const handleCheckboxChange = (field: "pernyataanPerubahan" | "pernyataanPemohon", checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: checked,
            ...(field === "pernyataanPemohon" ? {
                pernyataanPermohonan: checked
            } : {})
        }))
    }

    const handleToggleAll = () => {
        const nextState = !isAllChecked
        setFormData((prev) => ({
            ...prev,
            pernyataanPerubahan: nextState,
            pernyataanPemohon: nextState,
            pernyataanPermohonan: nextState,
        }))
    }

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
            <Card className="border-brand-100 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                                <ShieldCheck className="w-4 h-4 text-brand-600" />
                                Pernyataan Hukum & Persetujuan Pemohon
                            </CardTitle>
                            <CardDescription>
                                Harap telaah dan setujui klausul pertanggungjawaban serta komitmen verifikasi GRK berikut
                            </CardDescription>
                        </div>

                        <button
                            type="button"
                            onClick={handleToggleAll}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto shrink-0 ${
                                isAllChecked
                                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                                    : "bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200"
                            }`}
                        >
                            <CheckCheck className="w-3.5 h-3.5 text-brand-600" />
                            {isAllChecked ? "Batalkan Semua" : "Setujui Semua Klausul"}
                        </button>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-4">
                    {/* Klausul 1: Perubahan Laporan */}
                    <LegalStatementBox
                        title="Pernyataan Perubahan pada Laporan Verifikasi"
                        badgeText="Klausul Laporan"
                        subtitle="Komitmen bahwa setelah laporan verifikasi diterbitkan secara sah, pemohon tidak akan mengajukan perubahan pada tanda contoh maupun data identitas."
                        checked={pernyataanPerubahan}
                        onChange={(checked) => handleCheckboxChange("pernyataanPerubahan", checked)}
                        keyPoints={[
                            "Setelah Laporan diterbitkan, kami tidak akan meminta diadakannya perubahan pada laporan mengenai tanda-tanda contoh maupun alamat peminta Verifikasi/Sertifikasi."
                        ]}
                        legalTitle="Klausul Resmi Regulasi Laporan"
                        legalFullText="Setelah Laporan Verifikasi diterbitkan secara sah oleh Lembaga Validasi & Verifikasi (LVV) BBSPJIKKP, data identitas pemohon dan penandaan inventarisasi bersifat final dan tidak dapat diubah tanpa prosedur penerbitan ulang resmi sesuai regulasi KAN dan ISO 14065."
                    />

                    {/* Klausul 2: Integritas Pemohon */}
                    <LegalStatementBox
                        title="Pernyataan Kebenaran Data dan Integritas Pemohon"
                        badgeText="Integritas Pemohon"
                        subtitle="Pernyataan resmi bahwa seluruh data inventarisasi emisi GRK, bukti operasional fasilitas, dan dokumen legal adalah sah dan benar."
                        checked={pernyataanPemohon}
                        onChange={(checked) => handleCheckboxChange("pernyataanPemohon", checked)}
                        keyPoints={[
                            "Kami telah mengisi seluruh formulir dengan jujur, benar, dan sah secara hukum agar digunakan sebagaimana mestinya dalam proses verifikasi GRK."
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default FormPernyataan