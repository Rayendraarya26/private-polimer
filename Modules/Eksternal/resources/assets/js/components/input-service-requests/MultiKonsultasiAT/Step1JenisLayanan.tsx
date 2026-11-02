import React, { useEffect, useState } from "react"
import { Loader2, Cpu } from "lucide-react"
import {
    StepPanel,
    SectionHeading,
    OptionGroup,
    OptionCard,
    FieldLabel,
    FieldHint,
    Callout,
    inputClass,
} from "./WizardUI"
import {
    getMasterKonsultasiAt,
    MasterKonsultasiAtItem,
} from "../../../services/konsultasiAt"

const SERVICE_DESCRIPTIONS: Record<string, string> = {
    sertifikat_produk_sni:
        "Pendampingan pemenuhan persyaratan mutu produk dan penyusunan dokumen sertifikasi tanda kesesuaian SNI.",
    smm_iso_9001:
        "Pendampingan penyusunan dokumen dan penerapan Sistem Manajemen Mutu (SMM ISO 9001) untuk skala industri.",
    industri_hijau:
        "Pendampingan penyusunan dokumen dan implementasi pemenuhan Standar Sertifikasi Industri Hijau (SIH).",
    manajemen_lingkungan:
        "Pendampingan penyusunan dokumen dan penerapan Sistem Manajemen Lingkungan (SML ISO 14001).",
    manajemen_keselamatan_kesehatan_kerja:
        "Pendampingan penyusunan dokumen dan penerapan Sistem Manajemen K3 (SMK3 / ISO 45001) industri.",
    manajemen_keamanan_pangan:
        "Penyusunan dokumen dan penerapan Sistem Manajemen Keamanan Pangan (SMKP / ISO 22000).",
    haccp:
        "Penyusunan dokumen sistem manajemen bahaya dan implementasi HACCP pada proses produksi industri.",
    sistem_jaminan_produk_halal:
        "Penyusunan dokumen dan pendampingan implementasi Sistem Jaminan Produk Halal (SJPH).",
    audit_teknologi:
        "Evaluasi menyeluruh infrastruktur & sistem teknologi untuk efisiensi, mitigasi risiko, serta rekomendasi strategi industri.",
    indi_4_0:
        "Asesmen kesiapan transformasi digital dan otomatisasi proses industri berbasis Indonesia Industry 4.0 Readiness Index.",
    lainnya:
        "Konsultasi sistem manajemen, audit teknologi, atau kebutuhan problem solving khusus lainnya.",
}

const DEFAULT_DESCRIPTION = "Layanan konsultasi dan audit teknologi industri BBSPJIKKP."

const KATEGORI_LABEL: Record<string, string> = {
    konsultasi: "Konsultasi",
    audit_teknologi: "Audit Teknologi",
    indi_4_0: "INDI 4.0",
    lainnya: "Lainnya",
}

export interface Step1JenisLayananProps {
    layananKode: string
    setLayananKode: (val: string) => void
    layananLainnya: string
    setLayananLainnya: (val: string) => void
}

export const Step1JenisLayanan: React.FC<Step1JenisLayananProps> = ({
    layananKode,
    setLayananKode,
    layananLainnya,
    setLayananLainnya,
}) => {
    const [items, setItems] = useState<MasterKonsultasiAtItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let active = true
        getMasterKonsultasiAt()
            .then((data) => active && setItems(data))
            .catch(() => active && setError("Gagal memuat daftar layanan. Silakan muat ulang halaman."))
            .finally(() => active && setLoading(false))
        return () => {
            active = false
        }
    }, [])

    return (
        <StepPanel
            icon={Cpu}
            title="Pilih Layanan Konsultasi & Audit Teknologi"
            description="Pilih satu fokus layanan konsultasi atau audit teknologi yang sesuai dengan kebutuhan industri Anda."
        >
            <div className="space-y-6">
                <SectionHeading
                    title="Layanan yang Dibutuhkan"
                    description="Pilih fokus layanan konsultasi atau audit teknologi yang ingin diajukan."
                    required
                />

                {loading && (
                    <div className="flex items-center justify-center gap-2 py-12 text-xs text-slate-500">
                        <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                        <span>Memuat daftar layanan...</span>
                    </div>
                )}

                {error && (
                    <Callout tone="danger">
                        {error}
                    </Callout>
                )}

                {!loading && !error && items.length > 0 && (
                    <OptionGroup label="Pilihan Layanan" cols={2}>
                        {items.map((opt) => {
                            const desc = SERVICE_DESCRIPTIONS[opt.kode] || opt.deskripsi || DEFAULT_DESCRIPTION
                            const isSelected = layananKode === opt.kode

                            return (
                                <OptionCard
                                    key={opt.kode}
                                    selected={isSelected}
                                    onSelect={() => setLayananKode(opt.kode)}
                                    radioPosition="left"
                                    category={KATEGORI_LABEL[opt.kategori] ?? opt.kategori}
                                    title={opt.nama}
                                    description={desc}
                                />
                            )
                        })}
                    </OptionGroup>
                )}

                {/* Form Input Sederhana untuk Opsi 'Lainnya' */}
                {layananKode === "lainnya" && (
                    <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 animate-in fade-in-50 duration-200">
                        <FieldLabel required htmlFor="input-layanan-lainnya">
                            Sebutkan Layanan Lainnya
                        </FieldLabel>
                        <input
                            type="text"
                            id="input-layanan-lainnya"
                            value={layananLainnya}
                            onChange={(e) => setLayananLainnya(e.target.value)}
                            placeholder="Contoh: Audit Efisiensi Energi Mesin, Formulasi Komposit Karet, dll."
                            className={inputClass}
                            autoFocus
                        />
                        <FieldHint>
                            Tuliskan kebutuhan spesifik konsultasi atau audit teknologi yang Anda perlukan.
                        </FieldHint>
                    </div>
                )}
            </div>
        </StepPanel>
    )
}

export default Step1JenisLayanan
