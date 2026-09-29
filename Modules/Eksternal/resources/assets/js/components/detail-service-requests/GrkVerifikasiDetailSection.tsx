import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import {
    FileSpreadsheet,
    Building2,
    Sliders,
    CheckCircle2,
    FileCheck2,
    FileText,
    User,
    ShieldCheck,
    Calendar,
    Layers,
    Activity,
    ExternalLink,
    Info,
    Check,
    X,
    Flame,
    Factory,
    Globe,
    Briefcase,
    Filter,
} from "lucide-react"

export interface GrkEmisiItem {
    id?: string | number
    kategori_nama?: string
    subkategori_code?: string
    subkategori_nama?: string
    sumber?: string
    jumlah?: number | string | null
    justifikasi?: string
    is_checked?: boolean | number
}

export interface GrkDokumenItem {
    id?: string | number
    nama_dokumen?: string
    status_ketersediaan?: string
    keterangan?: string
    file_path?: string
}

export interface GrkDetailData {
    id?: string | number
    merek_sample?: string
    nama_pemilik?: string
    nama_pimpinan?: string
    nama_pj?: string
    jumlah_karyawan?: number | string
    jumlah_fasilitas?: number | string
    deskripsi_aktivitas?: string
    total_emisi_ton_co2e?: number | string
    tingkat_jaminan?: string
    periode_mulai?: string
    periode_selesai?: string
    materialitas_tipe?: string
    materialitas_custom?: string
    acuan_peraturan?: string
    ruang_lingkup_diajukan?: string
    kriteria_verifikasi?: string
    kriteria_lainnya?: string
    organization_boundary?: string
    metodologi_pengumpulan?: string
    tingkat_transfer_data?: string
    use_konsultan?: boolean | number
    konsultan_nama?: string
    konsultan_institusi?: string
    pernyataan_at?: string
    emisi?: GrkEmisiItem[]
    dokumen?: GrkDokumenItem[]
}

export interface GrkVerifikasiDetailSectionProps {
    permohonan?: any
    formGrk?: GrkDetailData | any
    layananName?: string
    noOrder?: string
    formatIndoDate?: (dateStr?: string | null, withTime?: boolean, shortMonth?: boolean) => string
}

export const GrkVerifikasiDetailSection: React.FC<GrkVerifikasiDetailSectionProps> = ({
    permohonan,
    formGrk,
    layananName = "Verifikasi GRK",
    noOrder = permohonan?.no_order || "-",
    formatIndoDate = (d) => (d ? String(d) : "-"),
}) => {
    const [filterAdaOnly, setFilterAdaOnly] = useState(false)
    const formData: GrkDetailData = formGrk || permohonan?.form_data || {}

    const emisiList: GrkEmisiItem[] = Array.isArray(formData?.emisi)
        ? formData.emisi
        : Array.isArray(permohonan?.form_grk_verifikasi?.[0]?.emisi)
            ? permohonan.form_grk_verifikasi[0].emisi
            : []

    const dokumenList: GrkDokumenItem[] = Array.isArray(formData?.dokumen)
        ? formData.dokumen
        : Array.isArray(permohonan?.form_grk_verifikasi?.[0]?.dokumen)
            ? permohonan.form_grk_verifikasi[0].dokumen
            : []

    const totalEmisiAda = emisiList.filter((e) => Boolean(e.is_checked)).length

    // Filter if user selects "Hanya yang Ada"
    const displayedEmisiList = filterAdaOnly
        ? emisiList.filter((e) => Boolean(e.is_checked))
        : emisiList

    // Group emisi by kategori_nama
    const groupedEmisi = displayedEmisiList.reduce<Record<string, GrkEmisiItem[]>>((acc, item) => {
        const key = item.kategori_nama || "Kategori Emisi Lainnya"
        if (!acc[key]) acc[key] = []
        acc[key].push(item)
        return acc
    }, {})

    const formatEmisi = (val: number | string | null | undefined) => {
        if (val === null || val === undefined || val === "") return "-"
        const num = Number(val)
        if (isNaN(num)) return String(val)
        return num.toLocaleString("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
        })
    }

    console.log("🔎 [DEBUG GRK VERIFIKASI] Data Props & Form:", {
        permohonan,
        formGrk,
        formData,
        emisiList: formData?.emisi,
        dokumenList: formData?.dokumen,
    })

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* ── 1. HIGHLIGHT STATS: TOTAL EMISI & PARAMETER KUNCI ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Emisi */}
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-soft">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        <span>Total Emisi Dilaporkan</span>
                        <Flame className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-emerald-900 font-mono tracking-tight">
                            {formatEmisi(formData?.total_emisi_ton_co2e ?? 0)}
                        </span>
                        <span className="text-xs font-semibold text-emerald-600">ton CO₂e</span>
                    </div>
                    <span className="text-[11px] text-emerald-600/90 mt-1 block">Akumulasi estimasi seluruh lingkup</span>
                </div>

                {/* Tingkat Jaminan */}
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-soft">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-sky-700">
                        <span>Tingkat Jaminan</span>
                        <ShieldCheck className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="mt-2">
                        <span className="text-xl font-bold text-sky-950 capitalize">
                            {formData?.tingkat_jaminan || "Reasonable"} Assurance
                        </span>
                    </div>
                    <span className="text-[11px] text-sky-600/90 mt-1 block">Level keyakinan audit verifikasi</span>
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
                    <span className="text-[11px] text-slate-400 mt-1 block">Rentang waktu pelaporan emisi</span>
                </div>

                {/* Ambang Materialitas */}
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-soft">
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-amber-700">
                        <span>Ambang Materialitas</span>
                        <Sliders className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="mt-2 text-sm font-bold text-amber-950">
                        {formData?.materialitas_tipe === "custom"
                            ? formData?.materialitas_custom || "Kustom"
                            : "Standar Default (5%)"}
                    </div>
                    <span className="text-[11px] text-amber-700/80 mt-1 block">Toleransi batas salah saji data</span>
                </div>
            </div>

            {/* ── 2. INFORMASI ORGANISASI & RUANG LINGKUP ── */}
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
                                {formData?.merek_sample || "Proyek GRK"}
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
                            <span className="text-slate-400 block font-medium">Penanggung Jawab (PJ) GRK:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">{formData?.nama_pj || "-"}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                                <span className="text-slate-400 block font-medium">Jumlah Karyawan:</span>
                                <span className="font-semibold text-slate-800 mt-0.5 block">
                                    {formData?.jumlah_karyawan ? `${formData.jumlah_karyawan} Orang` : "-"}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400 block font-medium">Jumlah Fasilitas / Site:</span>
                                <span className="font-semibold text-slate-800 mt-0.5 block">
                                    {formData?.jumlah_fasilitas ? `${formData.jumlah_fasilitas} Lokasi/Site` : "-"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Deskripsi Aktivitas Organisasi:</span>
                            <p className="font-medium text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                {formData?.deskripsi_aktivitas || "-"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Kolom Kanan: Parameter Standar & Batasan Audit */}
                <Card className="rounded-2xl border-slate-200 shadow-soft">
                    <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                            <Sliders className="w-4 h-4 text-brand-600" />
                            Parameter Standar & Batasan Verifikasi
                        </CardTitle>
                        <Badge variant="secondary" className="text-[10px]">ISO 14064</Badge>
                    </CardHeader>
                    <CardContent className="p-5 pt-4 space-y-3 text-xs">
                        <div>
                            <span className="text-slate-400 block font-medium">Acuan Standar / Regulasi:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">
                                {formData?.acuan_peraturan || "ISO 14064-1 / ISO 14064-3"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Ruang Lingkup Diajukan:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">
                                {formData?.ruang_lingkup_diajukan || "-"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Kriteria Verifikasi:</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                    {formData?.kriteria_verifikasi || "ISO 14064-1"}
                                </span>
                                {formData?.kriteria_lainnya && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                        {formData.kriteria_lainnya}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Batasan Organisasi (Boundary):</span>
                            <span className="font-semibold text-slate-800 mt-0.5 capitalize block">
                                {formData?.organization_boundary || "Internal / Operasional"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Metodologi Pengumpulan Data:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">
                                {formData?.metodologi_pengumpulan || "Sistem Manual / Spreadsheet Terintegrasi"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Tingkat Transfer Data:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">
                                {formData?.tingkat_transfer_data || "-"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Pihak Ketiga / Konsultan:</span>
                            {Boolean(formData?.use_konsultan) ? (
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
                    </CardContent>
                </Card>
            </div>

            {/* ── 3. RINCIAN INVENTARISASI EMISI GRK (TABEL SCOPE 1 - 6) ── */}
            <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
                <CardHeader className="border-b border-slate-100 py-3.5 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
                    <div>
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                            <FileSpreadsheet className="w-4 h-4 text-brand-600" />
                            Rincian Inventarisasi Emisi Gas Rumah Kaca (Scope 1 s.d. 6)
                        </CardTitle>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Menampilkan sumber emisi langsung dan tidak langsung sesuai batasan operasional
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setFilterAdaOnly(false)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${!filterAdaOnly
                                ? "bg-white text-slate-800 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            Semua ({emisiList.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterAdaOnly(true)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${filterAdaOnly
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                                }`}
                        >
                            <Check className="w-3 h-3" />
                            Dilaporkan ({totalEmisiAda})
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {displayedEmisiList.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                                    <tr>
                                        <th className="py-3 px-4 text-center w-24">STATUS</th>
                                        <th className="py-3 px-4 text-center w-20">KODE</th>
                                        <th className="py-3 px-4 min-w-[200px]">SUBKATEGORI EMISI</th>
                                        <th className="py-3 px-4 min-w-[220px]">SUMBER EMISI</th>
                                        <th className="py-3 px-4 text-right w-36">JUMLAH (TON CO₂E)</th>
                                        <th className="py-3 px-4 min-w-[220px]">JUSTIFIKASI / KETERANGAN</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {Object.entries(groupedEmisi).map(([kategoriNama, items]) => {
                                        const reportedInGroup = items.filter((i) => Boolean(i.is_checked)).length
                                        return (
                                            <React.Fragment key={kategoriNama}>
                                                {/* CATEGORY HEADER ROW: Spanning all 6 columns cleanly without flex on td */}
                                                <tr className="bg-slate-100/90 border-t-2 border-b border-slate-200">
                                                    <td colSpan={6} className="py-2.5 px-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="p-1 rounded-md bg-brand-100/70 text-brand-700">
                                                                    <Layers className="w-3.5 h-3.5" />
                                                                </span>
                                                                <span className="font-bold text-slate-800 text-xs">
                                                                    {kategoriNama}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* DETAIL ROWS */}
                                                {items.map((em, idx) => {
                                                    const isChecked = Boolean(em.is_checked)
                                                    return (
                                                        <tr
                                                            key={em.id || `${kategoriNama}-${idx}`}
                                                            className={`transition-colors ${isChecked
                                                                ? "bg-emerald-50/30 hover:bg-emerald-50/50"
                                                                : "hover:bg-slate-50/70"
                                                                }`}
                                                        >
                                                            <td className="py-3 px-4 text-center">
                                                                {isChecked ? (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                                                                        <Check className="w-3 h-3 text-emerald-700" /> Ada
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-400 border border-slate-200">
                                                                        Tidak
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                                                                {em.subkategori_code || "-"}
                                                            </td>
                                                            <td className="py-3 px-4 font-semibold text-slate-900">
                                                                {em.subkategori_nama || "-"}
                                                            </td>
                                                            <td className="py-3 px-4 text-slate-700">
                                                                {em.sumber ? (
                                                                    <span className="font-medium text-slate-800">{em.sumber}</span>
                                                                ) : (
                                                                    <span className="text-slate-300">-</span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-4 text-right font-mono font-bold">
                                                                {Number(em.jumlah) > 0 ? (
                                                                    <span className="text-emerald-800 text-xs font-bold">
                                                                        {formatEmisi(em.jumlah)}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-slate-300 font-normal">-</span>
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-4 text-slate-500 italic text-[11px] leading-relaxed">
                                                                {em.justifikasi ? (
                                                                    em.justifikasi
                                                                ) : (
                                                                    <span className="text-slate-300 not-italic">-</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </React.Fragment>
                                        )
                                    })}
                                </tbody>
                                <tfoot className="bg-slate-50 border-t-2 border-slate-200 text-xs font-bold">
                                    <tr>
                                        <td colSpan={4} className="py-3.5 px-4 text-right text-slate-700 uppercase tracking-wide">
                                            Total Emisi Akumulatif:
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-mono text-emerald-800 text-sm font-black">
                                            {formatEmisi(formData?.total_emisi_ton_co2e ?? 0)}
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-500 font-semibold text-[11px]">
                                            ton CO₂e
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-xs">
                            <Info className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                            {filterAdaOnly
                                ? "Tidak ada subkategori emisi dengan status 'Ada'."
                                : "Belum ada data rincian inventarisasi emisi yang tersimpan."}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── 4. DOKUMEN PERSYARATAN & BUKTI PENDUKUNG ── */}
            <Card className="rounded-2xl border-slate-200 shadow-soft overflow-hidden">
                <CardHeader className="border-b border-slate-100 py-3.5 px-5 flex flex-row items-center justify-between bg-slate-50/60">
                    <div>
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                            <FileCheck2 className="w-4 h-4 text-brand-600" />
                            Dokumen Persyaratan Validasi / Verifikasi GRK
                        </CardTitle>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Daftar kelengkapan dokumen pendukung dan verifikasi
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
                            Dokumen persyaratan belum diunggah atau tidak ditemukan.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default GrkVerifikasiDetailSection
