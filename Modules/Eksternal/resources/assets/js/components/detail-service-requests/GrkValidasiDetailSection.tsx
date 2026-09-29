import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import {
    FileSpreadsheet,
    Building2,
    Sliders,
    CheckCircle2,
    FileCheck2,
    FileText,
    ShieldCheck,
    Calendar,
    Layers,
    ExternalLink,
    Info,
    Check,
    Flame,
    Leaf,
    TrendingDown,
    Activity,
} from "lucide-react"

export interface GrkValidasiDokumenItem {
    id?: string | number
    kode_dokumen?: string
    nama_dokumen?: string
    status_ketersediaan?: string
    keterangan?: string
    file_path?: string
}

export interface GrkValidasiDetailData {
    id?: string | number
    merek_sample?: string
    nama_pemilik?: string
    nama_pimpinan?: string
    nama_pj?: string
    jumlah_karyawan?: number | string
    deskripsi_aktivitas?: string
    acuan_peraturan?: string
    ruang_lingkup_diajukan?: string
    uraian_kebutuhan?: string

    batasan_proyek?: string
    jenis_proyek_grk?: string[] | string
    periode_mulai?: string
    periode_selesai?: string
    kriteria_verifikasi?: string
    kriteria_lainnya?: string
    ssr_kuantifikasi?: string
    jenis_gas_emisi?: string[] | string
    jumlah_emisi_proyek_kgco2e?: number | string
    jumlah_emisi_baseline_kgco2e?: number | string
    materialitas_tipe?: string
    materialitas_custom?: string

    use_konsultan?: boolean | number | string
    konsultan_nama?: string
    konsultan_institusi?: string
    is_share_external?: boolean | number | string
    pihak_eksternal?: string

    pernyataan_perubahan?: boolean | number
    pernyataan_pemohon?: boolean | number
    pernyataan_at?: string

    dokumen?: GrkValidasiDokumenItem[]
    dokumen_items?: GrkValidasiDokumenItem[]
    dokumenItems?: GrkValidasiDokumenItem[]
}

export interface GrkValidasiDetailSectionProps {
    permohonan?: any
    formGrk?: GrkValidasiDetailData | any
    layananName?: string
    noOrder?: string
    formatIndoDate?: (dateStr?: string | null, withTime?: boolean, shortMonth?: boolean) => string
}

export const GrkValidasiDetailSection: React.FC<GrkValidasiDetailSectionProps> = ({
    permohonan,
    formGrk,
    layananName = "Validasi GRK",
    noOrder = permohonan?.no_order || "-",
    formatIndoDate = (d) => (d ? String(d) : "-"),
}) => {
    const formData: GrkValidasiDetailData = formGrk || permohonan?.form_data || {}

    // Dokumen fallback resolution
    const dokumenList: GrkValidasiDokumenItem[] = Array.isArray(formData?.dokumen)
        ? formData.dokumen
        : Array.isArray(formData?.dokumenItems)
            ? formData.dokumenItems
            : Array.isArray(formData?.dokumen_items)
                ? formData.dokumen_items
                : Array.isArray(permohonan?.form_grk_validasi?.[0]?.dokumen)
                    ? permohonan.form_grk_validasi[0].dokumen
                    : []

    // Helper parser array jika disimpan sebagai json string atau array
    const parseArrayField = (field: any): string[] => {
        if (Array.isArray(field)) return field
        if (typeof field === "string") {
            try {
                const parsed = JSON.parse(field)
                if (Array.isArray(parsed)) return parsed
            } catch {
                return field.split(",").map((s) => s.trim()).filter(Boolean)
            }
        }
        return []
    }

    const jenisProyekList = parseArrayField(formData?.jenis_proyek_grk)
    const jenisGasList = parseArrayField(formData?.jenis_gas_emisi)

    // Perhitungan baseline vs proyek
    const baselineKg = Number(formData?.jumlah_emisi_baseline_kgco2e) || 0
    const proyekKg = Number(formData?.jumlah_emisi_proyek_kgco2e) || 0
    const reduksiKg = baselineKg - proyekKg
    const baselineTon = baselineKg / 1000
    const proyekTon = proyekKg / 1000
    const reduksiTon = reduksiKg / 1000

    const formatNumber = (val: number | string | null | undefined, digits = 2) => {
        if (val === null || val === undefined || val === "") return "-"
        const num = Number(val)
        if (isNaN(num)) return String(val)
        return num.toLocaleString("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: digits,
        })
    }

    const renderGasLabel = (gasId: string) => {
        const idUpper = gasId.toUpperCase()
        switch (idUpper) {
            case "CO2":
                return <span>CO<sub>2</sub></span>
            case "CH4":
                return <span>CH<sub>4</sub></span>
            case "N2O":
            case "N20":
                return <span>N<sub>2</sub>O</span>
            case "HFCS":
                return <span>HFCs</span>
            case "PFCS":
                return <span>PFCs</span>
            case "SF6":
                return <span>SF<sub>6</sub></span>
            case "NF3":
                return <span>NF<sub>3</sub></span>
            default:
                return <span>{gasId}</span>
        }
    }

    const useKonsultan =
        formData?.use_konsultan === true ||
        formData?.use_konsultan === 1 ||
        formData?.use_konsultan === "1" ||
        formData?.use_konsultan === "ya"

    const isShareExternal =
        formData?.is_share_external === true ||
        formData?.is_share_external === 1 ||
        formData?.is_share_external === "1" ||
        formData?.is_share_external === "ya"

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* ── 1. HIGHLIGHT STATS: PARAMETER KUNCI & KUANTIFIKASI VALIDASI ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Estimasi Reduksi Emisi */}
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-soft">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        <span>Estimasi Reduksi Emisi</span>
                        <TrendingDown className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-emerald-900 font-mono tracking-tight">
                            {formatNumber(reduksiTon >= 0 ? reduksiTon : 0, 2)}
                        </span>
                        <span className="text-xs font-semibold text-emerald-600">ton CO₂e</span>
                    </div>
                    <span className="text-[11px] text-emerald-600/90 mt-1 block">
                        ≈ {formatNumber(reduksiKg >= 0 ? reduksiKg : 0, 0)} kg CO₂e (Baseline - Proyek)
                    </span>
                </div>

                {/* Emisi Baseline Proyek */}
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-soft">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-amber-700">
                        <span>Emisi Baseline</span>
                        <Flame className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-amber-950 font-mono tracking-tight">
                            {formatNumber(baselineTon, 2)}
                        </span>
                        <span className="text-xs font-semibold text-amber-700">ton CO₂e</span>
                    </div>
                    <span className="text-[11px] text-amber-700/80 mt-1 block">
                        ≈ {formatNumber(baselineKg, 0)} kg CO₂e (Skenario rujukan)
                    </span>
                </div>

                {/* Periode Pemantauan */}
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-soft">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-600">
                        <span>Periode Pemantauan</span>
                        <Calendar className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="mt-2 text-xs font-bold text-slate-800 leading-snug">
                        {formData?.periode_mulai ? formatIndoDate(formData.periode_mulai, false, true) : "-"}
                        <span className="text-slate-400 font-normal mx-1">s/d</span>
                        {formData?.periode_selesai ? formatIndoDate(formData.periode_selesai, false, true) : "-"}
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Rentang waktu pelaksanaan proyek</span>
                </div>

                {/* Ambang Materialitas */}
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-soft">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-sky-700">
                        <span>Ambang Materialitas</span>
                        <Sliders className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="mt-2 text-sm font-bold text-sky-950">
                        {formData?.materialitas_tipe === "program" || formData?.materialitas_custom
                            ? `≤ ${formData?.materialitas_custom || "5"}% (Program)`
                            : "Standar Default (≤ 5%)"}
                    </div>
                    <span className="text-[11px] text-sky-700/80 mt-1 block">Toleransi batas salah saji data</span>
                </div>
            </div>

            {/* ── 2. INFORMASI ORGANISASI & RUANG LINGKUP (LAYOUT 2 KOLOM IDENTIK VERIFIKASI) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Kolom Kiri: Struktur Organisasi Pemohon */}
                <Card className="rounded-2xl border-slate-200 shadow-soft">
                    <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                            <Building2 className="w-4 h-4 text-brand-600" />
                            Identitas & Pimpinan Organisasi
                        </CardTitle>
                        <Badge variant="outline">{layananName}</Badge>
                    </CardHeader>
                    <CardContent className="p-5 pt-4 space-y-3 text-xs">
                        <div>
                            <span className="text-slate-400 block font-medium">Nomor Permohonan:</span>
                            <span className="font-mono font-bold text-slate-900 text-sm mt-0.5 block">{noOrder}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Nama Merek / Sampel Proyek:</span>
                            <span className="font-bold text-brand-800 text-sm mt-0.5 block">
                                {formData?.merek_sample || "Proyek Validasi GRK"}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                                <span className="text-slate-400 block font-medium">Nama Pemilik Organisasi:</span>
                                <span className="font-semibold text-slate-800 mt-0.5 block">{formData?.nama_pemilik || "-"}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-medium">Pimpinan Puncak:</span>
                                <span className="font-semibold text-slate-800 mt-0.5 block">{formData?.nama_pimpinan || "-"}</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Penanggung Jawab (PJ) Proyek:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">{formData?.nama_pj || "-"}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Jumlah Karyawan / Personil:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">
                                {formData?.jumlah_karyawan ? `${formData.jumlah_karyawan} Orang` : "-"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Deskripsi Aktivitas Organisasi:</span>
                            <p className="font-medium text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-line">
                                {formData?.deskripsi_aktivitas || "-"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Kolom Kanan: Parameter Standar & Batasan Validasi */}
                <Card className="rounded-2xl border-slate-200 shadow-soft">
                    <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                            <Sliders className="w-4 h-4 text-brand-600" />
                            Parameter Standar & Batasan Validasi
                        </CardTitle>
                        <Badge variant="secondary" className="text-[10px]">ISO 14064-2</Badge>
                    </CardHeader>
                    <CardContent className="p-5 pt-4 space-y-3 text-xs">
                        <div>
                            <span className="text-slate-400 block font-medium">Acuan Standar / Regulasi:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">
                                {formData?.acuan_peraturan || "SNI ISO 14064-2 / SRN PPI"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Ruang Lingkup Diajukan:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">
                                {formData?.ruang_lingkup_diajukan || "-"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Kriteria Validasi:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                    {formData?.kriteria_verifikasi === "14064-2"
                                        ? "ISO 14064-2"
                                        : formData?.kriteria_verifikasi || "ISO 14064-2"}
                                </span>
                                {formData?.kriteria_lainnya && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                        {formData.kriteria_lainnya}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Uraian Kebutuhan Layanan:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">
                                {formData?.uraian_kebutuhan || "-"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Pihak Ketiga / Konsultan:</span>
                            {useKonsultan ? (
                                <div className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-800">
                                        Menggunakan Konsultan
                                    </span>
                                    <p className="mt-1 text-slate-700 font-medium">
                                        {formData?.konsultan_nama || "-"} ({formData?.konsultan_institusi || "-"})
                                    </p>
                                </div>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-slate-600 font-semibold mt-1">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    Mandiri (Tanpa Konsultan)
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Berbagi Data Pihak Eksternal:</span>
                            {isShareExternal ? (
                                <span className="font-semibold text-sky-800 mt-0.5 block">
                                    Ya ({formData?.pihak_eksternal || "-"})
                                </span>
                            ) : (
                                <span className="text-slate-600 mt-0.5 block">Tidak (Kerahasiaan Internal)</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── 3. RINCIAN PARAMETER TEKNIS PROYEK MITIGASI (DATA KHUSUS VALIDASI) ── */}
            <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
                <CardHeader className="border-b border-slate-100 py-3.5 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
                    <div>
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                            <Activity className="w-4 h-4 text-brand-600" />
                            Parameter Teknis & Kuantifikasi Emisi Proyek Validasi
                        </CardTitle>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Menampilkan batasan proyek, SSR kuantifikasi, jenis gas emisi, dan komparasi skenario baseline vs proyek
                        </p>
                    </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                    {/* Tags Jenis Proyek & Gas Emisi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                            <span className="text-slate-500 font-semibold text-xs flex items-center gap-1.5 mb-2">
                                <Leaf className="w-4 h-4 text-emerald-600" />
                                Jenis Proyek GRK:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {jenisProyekList.length > 0 ? (
                                    jenisProyekList.map((jns, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                                            {jns}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Belum ditentukan</span>
                                )}
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                            <span className="text-slate-500 font-semibold text-xs flex items-center gap-1.5 mb-2">
                                <Flame className="w-4 h-4 text-amber-600" />
                                Jenis Gas Rumah Kaca (GRK) yang Divalidasi:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {jenisGasList.length > 0 ? (
                                    jenisGasList.map((gas, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 font-mono"
                                        >
                                            {renderGasLabel(gas)}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Belum ditentukan</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Batasan Proyek & SSR */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="font-bold text-slate-800 block mb-1">Batasan Proyek (Project Boundary):</span>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {formData?.batasan_proyek || "-"}
                            </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <span className="font-bold text-slate-800 block mb-1">
                                Sumber, Sink, & Reservoir (SSR) yang Dikuantifikasi:
                            </span>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {formData?.ssr_kuantifikasi || "-"}
                            </p>
                        </div>
                    </div>

                    {/* Tabel Komparasi Emisi Skenario Proyek */}
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-xs text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                <tr>
                                    <th className="py-3 px-4 w-12 text-center">NO</th>
                                    <th className="py-3 px-4 min-w-[220px]">PARAMETER SKENARIO EMISI</th>
                                    <th className="py-3 px-4 text-right w-44">JUMLAH (KG CO₂E)</th>
                                    <th className="py-3 px-4 text-right w-44">KONVERSI (TON CO₂E)</th>
                                    <th className="py-3 px-4 min-w-[200px]">KETERANGAN</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                <tr className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3 px-4 text-center text-slate-400 font-mono">1</td>
                                    <td className="py-3 px-4 font-semibold text-slate-900">
                                        Emisi / Serapan GRK Baseline
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono font-bold">
                                        {formatNumber(baselineKg, 4)}
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono font-semibold">
                                        {formatNumber(baselineTon, 4)}
                                    </td>
                                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                                        Estimasi emisi kondisi eksisting tanpa proyek
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3 px-4 text-center text-slate-400 font-mono">2</td>
                                    <td className="py-3 px-4 font-semibold text-slate-900">
                                        Emisi / Serapan GRK Proyek
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono font-bold">
                                        {formatNumber(proyekKg, 4)}
                                    </td>
                                    <td className="py-3 px-4 text-right font-mono font-semibold">
                                        {formatNumber(proyekTon, 4)}
                                    </td>
                                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                                        Estimasi emisi aktual skenario proyek mitigasi
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot className="bg-slate-50 border-t text-xs font-bold">
                                <tr>
                                    <td colSpan={2} className="py-3.5 px-4 text-right text-emerald-950 uppercase tracking-wide">
                                        Estimasi Reduksi / Penurunan Emisi Bersih:
                                    </td>
                                    <td className="py-3.5 px-4 text-right font-mono text-emerald-900 text-sm font-black">
                                        {reduksiKg >= 0 ? `+${formatNumber(reduksiKg, 4)}` : formatNumber(reduksiKg, 4)}
                                    </td>
                                    <td className="py-3.5 px-4 text-right font-mono text-emerald-900 text-sm font-black">
                                        {reduksiTon >= 0 ? `+${formatNumber(reduksiTon, 4)}` : formatNumber(reduksiTon, 4)}
                                    </td>
                                    <td className="py-3.5 px-4 text-emerald-800 font-semibold text-[11px]">
                                        ton CO₂e (Diajukan untuk divalidasi)
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* ── 4. DOKUMEN PERSYARATAN & BUKTI PENDUKUNG (IDENTIK VERIFIKASI) ── */}
            <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
                <CardHeader className="border-b border-slate-100 py-3.5 px-5 flex flex-row items-center justify-between bg-slate-50/60">
                    <div>
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                            <FileCheck2 className="w-4 h-4 text-brand-600" />
                            Dokumen Persyaratan Validasi GRK
                        </CardTitle>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Daftar kelengkapan dokumen pendukung, Project Design Document (PDD/DRAM), dan formulir validasi
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {dokumenList.length} Dokumen
                    </span>
                </CardHeader>
                <CardContent className="p-0">
                    {dokumenList.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                    <tr>
                                        <th className="py-3 px-4 text-center w-14">NO</th>
                                        <th className="py-3 px-4 min-w-[220px]">NAMA DOKUMEN PERSYARATAN</th>
                                        <th className="py-3 px-4 w-40 text-center">STATUS KETERSEDIAAN</th>
                                        <th className="py-3 px-4 min-w-[200px]">KETERANGAN / NOMOR DOKUMEN</th>
                                        <th className="py-3 px-4 text-center w-36">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {dokumenList.map((dok, dIdx) => (
                                        <tr key={dok.id || dIdx} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-3 px-4 text-center text-slate-400 font-medium">
                                                {dIdx + 1}
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-slate-900">
                                                {dok.nama_dokumen || "-"}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {dok.status_ketersediaan === "TERSEDIA" ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                                                        <CheckCircle2 className="w-3 h-3" /> Tersedia
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                                        Tidak Tersedia
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">
                                                {dok.keterangan || <span className="text-slate-300">-</span>}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {dok.file_path ? (
                                                    <a
                                                        href={`/storage/${dok.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        Lihat File
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 text-[11px] font-medium">Lampiran Fisik</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-xs">
                            <Info className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                            Belum ada dokumen persyaratan yang tercatat untuk validasi proyek ini.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default GrkValidasiDetailSection
