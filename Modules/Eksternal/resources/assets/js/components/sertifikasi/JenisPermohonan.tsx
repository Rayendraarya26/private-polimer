import React, { useState } from "react"
import { Button } from "../ui/Button"
import { Building2, RefreshCw } from "lucide-react"

interface Step1JenisPermohonanProps {
    onNext?: () => void
    hideButtons?: boolean
    valueJenis?: string
    onChangeJenis?: (val: string) => void
    valueSertifikat?: string
    onChangeSertifikat?: (val: string) => void
}

const Step1JenisPermohonan: React.FC<Step1JenisPermohonanProps> = ({ 
    onNext, 
    hideButtons,
    valueJenis = "",
    onChangeJenis,
    valueSertifikat = "",
    onChangeSertifikat
}) => {

    // State internal
    const [internalJenis, setInternalJenis] = useState<string>(valueJenis)
    const [internalSertifikat, setInternalSertifikat] = useState<string>(valueSertifikat)
    const uniqueId = React.useId()

    const selectedJenis = onChangeJenis ? valueJenis : internalJenis;
    const selectedSertifikat = onChangeSertifikat ? valueSertifikat : internalSertifikat;

    const handleJenisChange = (val: string) => {
        setInternalJenis(val)
        if (onChangeJenis) onChangeJenis(val)
    }

    const handleSertifikatChange = (val: string) => {
        setInternalSertifikat(val)
        if (onChangeSertifikat) onChangeSertifikat(val)
    }

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
            <div>
                <h3 className="text-lg font-bold text-slate-900">Jenis Permohonan</h3>
                <p className="text-xs text-slate-500 mt-1">
                    Silakan lengkapi informasi terkait jenis permohonan sertifikasi yang Anda ajukan.
                </p>
            </div>

            {/* Area Form Input */}
            <div className="py-6 flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6 md:gap-8 lg:gap-12">

                {/* Radio Button 1 (Pengajuan Sertifikat Baru) */}
                <label className="relative cursor-pointer group w-full md:w-1/2 max-w-[450px]">
                    <input
                        type="radio"
                        name={`jenis_permohonan_${uniqueId}`}
                        value="baru"
                        className="peer sr-only"
                        checked={selectedJenis === "baru"}
                        onChange={(e) => handleJenisChange(e.target.value)}
                    />

                    <div className="w-full h-full rounded-2xl border-2 border-slate-200 bg-white p-4 flex flex-col items-center gap-4 transition-all duration-300 hover:border-brand-300 hover:shadow-md peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-checked:shadow-brand-100 peer-checked:shadow-lg">
                        <div className="w-full aspect-[5/4] rounded-xl overflow-hidden bg-slate-50 shrink-0">
                            <img src="/images/sertifikasi-asset/pengajuan_baru.jpg" alt="Sertifikat Baru" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center flex-1 flex items-center justify-center">
                            <p className="text-sm sm:text-base font-semibold text-slate-800">Pengajuan Sertifikat Baru</p>
                        </div>
                    </div>
                </label>

                {/* Radio Button 2 (Perpanjangan Sertifikat) */}
                <label className="relative cursor-pointer group w-full md:w-1/2 max-w-[450px]">
                    <input
                        type="radio"
                        name={`jenis_permohonan_${uniqueId}`}
                        value="perpanjangan"
                        className="peer sr-only"
                        checked={selectedJenis === "perpanjangan"}
                        onChange={(e) => handleJenisChange(e.target.value)}
                    />

                    <div className="w-full h-full rounded-2xl border-2 border-slate-200 bg-white p-4 flex flex-col items-center gap-4 transition-all duration-300 hover:border-brand-300 hover:shadow-md peer-checked:border-brand-600 peer-checked:bg-brand-50 peer-checked:shadow-brand-100 peer-checked:shadow-lg">
                        <div className="w-full aspect-[5/4] rounded-xl overflow-hidden bg-slate-50 shrink-0">
                            <img src="/images/sertifikasi-asset/pengajuan_lama.jpg" alt="Sertifikat lama" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center flex-1 flex items-center justify-center">
                            <p className="text-sm sm:text-base font-semibold text-slate-800">Perpanjangan Sertifikat</p>
                        </div>
                    </div>
                </label>

            </div>

            {/* Pilihan Sertifikat Lama (Muncul hanya jika perpanjangan dipilih) */}
            {selectedJenis === "perpanjangan" && (
                <div className="animate-in slide-in-from-top-4 fade-in duration-300 max-w-xl mx-auto w-full pt-2 pb-6">
                    <label htmlFor="sertifikatLama" className="block text-sm font-semibold text-slate-700 mb-2 text-center">
                        Pilih Sertifikat yang Ingin Diperpanjang
                    </label>
                    <select
                        id="sertifikatLama"
                        name="sertifikatLama"
                        value={selectedSertifikat}
                        onChange={(e) => handleSertifikatChange(e.target.value)}
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-brand-500 focus:ring-brand-500 focus:outline-none transition-colors bg-white shadow-sm cursor-pointer"
                    >
                        <option value="">-- Pilih Sertifikat --</option>
                        <option value="sert-1">Sistem Manajemen Mutu (SNI ISO 9001)</option>
                        <option value="sert-2">Sistem Manajemen Lingkungan (SNI ISO 14001)</option>
                        <option value="sert-3">Sertifikasi Produk (SPPT SNI)</option>
                        <option value="sert-4">Industri Hijau</option>
                    </select>
                </div>
            )}

            {/* Action Buttons */}
            {!hideButtons && (
                <div className="flex justify-end items-center pt-4 border-t border-slate-100">
                    <Button
                        type="button"
                        onClick={onNext}
                        disabled={!selectedJenis || (selectedJenis === "perpanjangan" && !selectedSertifikat)}
                        className="px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Selanjutnya
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Step1JenisPermohonan