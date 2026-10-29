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
} from "./WizardUI"
import {
    getMasterKonsultasiAt,
    MasterKonsultasiAtItem,
} from "../../../services/konsultasiAt"
import { TextInput } from "../../forms"

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
            description="Pilih satu layanan yang sesuai dengan kebutuhan Anda."
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

                {/* Grid Pilihan Layanan dengan OptionGroup & OptionCard standar kalibrasi */}
                {!loading && !error && items.length > 0 && (
                    <OptionGroup label="Pilihan Layanan" cols={2}>
                        {items.map((opt) => (
                            <OptionCard
                                key={opt.kode}
                                selected={layananKode === opt.kode}
                                onSelect={() => setLayananKode(opt.kode)}
                                category={KATEGORI_LABEL[opt.kategori] ?? opt.kategori}
                                title={opt.nama}
                                description={opt.deskripsi}
                            />
                        ))}
                    </OptionGroup>
                )}

                {/* Form Input Sederhana untuk Opsi 'Lainnya' */}
                {layananKode === "lainnya" && (
                    <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                        <FieldLabel required htmlFor="input-layanan-lainnya">
                            Sebutkan Layanan Lainnya
                        </FieldLabel>
                        <TextInput
                            id="input-layanan-lainnya"
                            value={layananLainnya}
                            onChange={(e) => setLayananLainnya(e.target.value)}
                            placeholder="Contoh: Audit Efisiensi Energi Mesin, Formulasi Komposit Karet, dll."
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
