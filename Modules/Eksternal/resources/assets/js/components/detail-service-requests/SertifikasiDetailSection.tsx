import React, { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import {
    Building2,
    Users,
    Factory,
    Package,
    FileCheck2,
    FileText,
    FileSpreadsheet,
    Calendar,
    CreditCard,
    Eye,
    Phone,
    Mail,
    MapPin,
    ShieldCheck,
    Sparkles,
    Layers,
    Clock,
    Briefcase,
    AlertCircle,
    Hash,
} from "lucide-react"
import { getFileUrl } from "../../utils/fileHelpers"

export interface SertifikasiDetailSectionProps {
    permohonan: any
    formData?: any
    lingkup?: any
    formatIndoDate?: (dateStr?: string | null, withTime?: boolean) => string
    openPdfDoc?: (url: string, title?: string, filename?: string) => void
    openInvoice?: (item: any) => void
    openKuitansi?: (item: any) => void
}

export const SertifikasiDetailSection: React.FC<SertifikasiDetailSectionProps> = ({
    permohonan,
    formData: propFormData,
    lingkup,
    formatIndoDate,
    openPdfDoc,
    openInvoice,
    openKuitansi,
}) => {
    // ── 1. RESOLVE DATA FORM & PERMOHONAN ──────────────────────────────────
    const formData = useMemo(() => {
        if (propFormData) return propFormData
        if (Array.isArray(permohonan?.form_sertifikasi) && permohonan.form_sertifikasi.length > 0) {
            return permohonan.form_sertifikasi[0]
        }
        if (permohonan?.form_sertifikasi && typeof permohonan.form_sertifikasi === "object") {
            return permohonan.form_sertifikasi
        }
        return permohonan?.form_data || permohonan?.form || {}
    }, [propFormData, permohonan])

    const userPelanggan = permohonan?.creator?.pelanggan
    const detailPerusahaan = userPelanggan?.detail || {}

    // ── 2. DATA IDENTITAS & LEGALITAS PERUSAHAAN ─────────────────────────────
    const namaPerusahaan =
        detailPerusahaan?.nama_perusahaan ||
        formData?.nama_perusahaan ||
        formData?.nama_pemohon ||
        permohonan?.creator?.name ||
        "Perusahaan Pemohon"

    const npwp = detailPerusahaan?.npwp || formData?.npwp || "-"
    const nib = detailPerusahaan?.nib || formData?.nib || "-"
    const noAkta = detailPerusahaan?.nomor_akta_pendirian || formData?.no_akta || formData?.nomor_akta_pendirian || "-"
    const badanHukum = formData?.badan_hukum || detailPerusahaan?.badan_hukum || "-"
    const jenisPerusahaan = formData?.jenis_perusahaan || detailPerusahaan?.jenis_perusahaan || "-"

    const alamatKantor =
        detailPerusahaan?.alamat_kantor ||
        formData?.alamat_kantor ||
        formData?.alamat_lengkap ||
        formData?.alamat ||
        "-"
    const provinsi = formData?.provinsi || detailPerusahaan?.provinsi || "-"
    const kabupaten = formData?.kabupaten || detailPerusahaan?.kabupaten || "-"
    const kecamatan = formData?.kecamatan || detailPerusahaan?.kecamatan || "-"
    const kodePos = formData?.kode_pos || detailPerusahaan?.kode_pos || "-"

    const luasTanah = formData?.luas_tanah || detailPerusahaan?.luas_tanah || "-"
    const luasBangunan = formData?.luas_bangunan || detailPerusahaan?.luas_bangunan || "-"

    // ── 3. DATA PIMPINAN & PIC (KONTAK PERSON) ──────────────────────────────
    const namaPemilik = formData?.nama_pemilik || detailPerusahaan?.nama_pemilik || "-"
    const namaPimpinan = detailPerusahaan?.nama_pimpinan || formData?.nama_pimpinan || "-"
    const wakilManajemen = detailPerusahaan?.nama_wakil_manajemen || formData?.nama_wakil_manajemen || "-"
    const pic = formData?.kontak_person || formData?.nama_pic || detailPerusahaan?.nama_pic || "-"
    const noWhatsapp = formData?.no_whatsapp || detailPerusahaan?.nomor_whatsapp || "-"
    const noTelp = formData?.no_telp || detailPerusahaan?.nomor_telp || "-"
    const email = formData?.email || detailPerusahaan?.email || permohonan?.creator?.email || "-"

    // ── 4. DATA KETENAGAKERJAAN & OPERASIONAL ──────────────────────────────
    const totalKaryawan = detailPerusahaan?.total_karyawan_tetap || formData?.jumlah_karyawan_total || formData?.jumlah_karyawan || "-"
    const karyawanManajemen = formData?.jumlah_manajemen ?? "-"
    const karyawanAdministrasi = formData?.jumlah_administrasi ?? "-"
    const karyawanOperasional = formData?.jumlah_operasional ?? "-"
    const karyawanShift1 = formData?.jumlah_shift_1 ?? "-"
    const karyawanShift2 = formData?.jumlah_shift_2 ?? "-"
    const karyawanShift3 = formData?.jumlah_shift_3 ?? "-"
    const karyawanNonPermanen = formData?.jumlah_non_permanen ?? "-"
    const karyawanPartTime = formData?.jumlah_part_time ?? "-"

    // ── 5. DATA PERMOHONAN & SKEMA ──────────────────────────────────────────
    const noPermohonan = permohonan?.no_permohonan || permohonan?.kode_order || "-"
    const statusWorkflow = permohonan?.status_workflow || "PERMOHONAN"
    const jenisPengajuan = formData?.jenis_pengajuan || formData?.tipe_pengajuan || "BARU"
    const skemaLayanan =
        lingkup?.lingkup ||
        lingkup?.nama ||
        formData?.nama_skema ||
        formData?.nama_layanan ||
        "Sertifikasi Produk & Sistem (LSPro BBKKP)"
    const tanggalOrder = permohonan?.tgl_order || permohonan?.created_at || null

    // ── 6. DAFTAR KOMODITAS & PRODUK SNI (ITEMS) ───────────────────────────
    const items = useMemo(() => {
        let raw: any[] = []
        if (Array.isArray(formData?.items) && formData.items.length > 0) {
            raw = formData.items
        } else if (formData?.komoditas_json) {
            raw = Array.isArray(formData.komoditas_json)
                ? formData.komoditas_json
                : typeof formData.komoditas_json === "string"
                    ? JSON.parse(formData.komoditas_json || "[]")
                    : [formData.komoditas_json]
        } else if (Array.isArray(formData?.komoditis) && formData.komoditis.length > 0) {
            raw = formData.komoditis
        } else if (formData?.kuesioner_kelayakan?.komoditas) {
            raw = Array.isArray(formData.kuesioner_kelayakan.komoditas)
                ? formData.kuesioner_kelayakan.komoditas
                : [formData.kuesioner_kelayakan.komoditas]
        } else if (permohonan?.komoditi || formData?.komoditi) {
            const kVal = permohonan?.komoditi || formData?.komoditi
            raw = Array.isArray(kVal) ? kVal : [{ nama_produk: kVal }]
        }

        return (raw || []).map((it: any, index: number) => {
            if (typeof it === "string") {
                return {
                    id: index,
                    nama_produk: it,
                    standar_sni_iso: null,
                    merk_dagang: null,
                    tipe_jenis: null,
                    estimasi_tarif: 0,
                }
            }
            return {
                id: it.id || index,
                nama_produk: it.nama_produk || it.nama_skema || it.nama_komoditi || it.komoditi_nama || it.nama || it.komoditi || "Produk Terdaftar",
                standar_sni_iso: it.standar_sni_iso || it.sni || it.standar_sni || it.standar || null,
                merk_dagang: it.merk_dagang || it.merk || it.merek || null,
                tipe_jenis: it.tipe_jenis || it.tipe || it.jenis || null,
                estimasi_tarif: Number(it.estimasi_tarif || it.tarif_pnbp || it.tarif || it.biaya || 0),
            }
        })
    }, [formData, permohonan])

    // ── 7. DAFTAR PABRIK & FASILITAS PRODUKSI ──────────────────────────────
    const pabriks = useMemo(() => {
        if (userPelanggan?.pabrik && Array.isArray(userPelanggan.pabrik) && userPelanggan.pabrik.length > 0) {
            return userPelanggan.pabrik
        }
        let raw: any[] = []
        if (Array.isArray(formData?.pabrik) && formData.pabrik.length > 0) {
            raw = formData.pabrik
        } else if (formData?.pabrik_json) {
            raw = Array.isArray(formData.pabrik_json)
                ? formData.pabrik_json
                : typeof formData.pabrik_json === "string"
                    ? JSON.parse(formData.pabrik_json || "[]")
                    : [formData.pabrik_json]
        } else if (Array.isArray(formData?.pabriks) && formData.pabriks.length > 0) {
            raw = formData.pabriks
        }
        return raw || []
    }, [formData, userPelanggan])

    // ── 8. DOKUMEN & BERKAS PERSYARATAN ─────────────────────────────────────
    const docs = useMemo(() => {
        const d: { key: string; label: string; url: string }[] = []

        const addDoc = (key: string, label: string, val: any) => {
            if (typeof val === "string" && val.trim()) {
                d.push({ key, label, url: val.trim() })
            }
        }

        addDoc("surat_permohonan", "Surat Permohonan Sertifikasi Resmi", formData?.file_surat_permohonan)
        addDoc("manual_mutu", "Manual Mutu / Dokumentasi Sistem Manajemen", formData?.file_manual_mutu)
        addDoc("proses_produksi", "Diagram Alir Proses Produksi", formData?.file_proses_produksi)
        addDoc("daftar_peralatan", "Daftar Peralatan & Kalibrasi Instrumen", formData?.file_daftar_peralatan)
        addDoc("denah_lokasi", "Denah / Tata Letak Pabrik & Fasilitas", formData?.file_denah_lokasi)
        addDoc("pertanyaan_tambahan", "Kuesioner Kelayakan & Asesmen Mandiri", formData?.file_pertanyaan_tambahan || formData?.file_kuesioner)
        addDoc("berkas_gabungan", "Berkas Gabungan Dokumen Pendukung", formData?.file_berkas_gabungan)
        addDoc("dokumen_legalitas", "Dokumen Legalitas Perusahaan (NIB / NPWP / Akta)", formData?.dok_legalitas || formData?.file_dokumen_pendukung)

        if (formData?.dokumen_persyaratan && typeof formData.dokumen_persyaratan === "object") {
            Object.entries(formData.dokumen_persyaratan).forEach(([k, v]) => {
                if (typeof v === "string" && v.trim() && !d.some((item) => item.key === k)) {
                    d.push({
                        key: k,
                        label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                        url: v.trim(),
                    })
                }
            })
        }

        return d
    }, [formData])

    const kuesionerKelayakan = formData?.kuesioner_kelayakan || {}
    const sistemMutu = kuesionerKelayakan?.sistem_mutu || formData?.sistem_mutu || "ISO 9001 / Terintegrasi"
    const lembagaSertifikasiMutu = kuesionerKelayakan?.lembaga_sertifikasi_mutu || formData?.lembaga_sertifikasi_mutu || "-"

    const totalBiaya = Number(permohonan?.total_harga || permohonan?.harga_permohonan || 0)
    const statusBayar = permohonan?.status_bayar || "BELUM"

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "-"
        if (formatIndoDate) return formatIndoDate(dateStr, false)
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    }

    const handleOpenDoc = (url: string, title: string) => {
        const fullUrl = getFileUrl(url)
        if (openPdfDoc) {
            openPdfDoc(fullUrl, title, `${title}.pdf`)
        } else {
            window.open(fullUrl, "_blank")
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in-50 duration-200">

            {/* Data Perusahaan */}
            <Card className="rounded-2xl border-slate-200 shadow-soft">
                <CardHeader className="border-b border-slate-100 pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <Building2 className="w-4 h-4 text-brand-600" />
                        Identitas & Legalitas Perusahaan
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="sm:col-span-2">
                            <span className="text-slate-400 block font-medium">Nama Perusahaan / Pemohon:</span>
                            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{namaPerusahaan}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Nomor Pokok Wajib Pajak (NPWP):</span>
                            <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{npwp}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Nomor Induk Berusaha (NIB):</span>
                            <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{nib}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Nomor Akta Pendirian:</span>
                            <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{noAkta}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Bentuk Badan Hukum / Usaha:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">{badanHukum} ({jenisPerusahaan})</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Total Tenaga Kerja Tetap:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">{totalKaryawan} Orang</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Luas Tanah & Bangunan:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">
                                Tanah: {luasTanah} m² | Bangunan: {luasBangunan} m²
                            </span>
                        </div>
                        <div className="sm:col-span-2">
                            <span className="text-slate-400 block font-medium">Alamat Kantor Pusat / Operasional:</span>
                            <span className="font-medium text-slate-700 mt-0.5 block bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                                {alamatKantor} {kecamatan !== "-" && `Kec. ${kecamatan}, `} {kabupaten !== "-" && `${kabupaten}, `} {provinsi !== "-" && `${provinsi} `} {kodePos !== "-" && `(${kodePos})`}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Data Pimpinan & Kontak */}
            <Card className="rounded-2xl border-slate-200 shadow-soft">
                <CardHeader className="border-b border-slate-100 pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <Users className="w-4 h-4 text-brand-600" />
                        Pimpinan & Kontak Person (PIC)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                            <span className="text-slate-400 block font-medium">Nama Pemilik Usaha:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">{namaPemilik}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Nama Pimpinan / Direktur:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">{namaPimpinan}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Wakil Manajemen (MR):</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">{wakilManajemen}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Penanggung Jawab Permohonan (PIC):</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">{pic}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Nomor WhatsApp & Telepon:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {noWhatsapp} / {noTelp}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block font-medium">Alamat Email Resmi:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                {email}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Data Komoditas */}
            <Card className="rounded-2xl border-slate-200 shadow-soft">
                <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <Package className="w-4 h-4 text-brand-600" />
                        Rincian Komoditi & Produk ({items.length} Item)
                    </CardTitle>
                    <Badge variant="outline">{jenisPengajuan}</Badge>
                </CardHeader>
                <CardContent className="p-5 pt-4">
                    {items.length > 0 ? (
                        <div className="space-y-3">
                            {items.map((item: any, idx: number) => (
                                <div
                                    key={item.id || idx}
                                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-[10px]">
                                                {idx + 1}
                                            </span>
                                            <span className="font-bold text-slate-900 text-sm">{item.nama_produk}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2.5 mt-2 pl-7 text-slate-500">
                                            {item.standar_sni_iso && (
                                                <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded-md border border-brand-200 font-semibold text-[11px]">
                                                    Standar: {item.standar_sni_iso}
                                                </span>
                                            )}
                                            {item.merk_dagang && (
                                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                                                    Merek: <b>{item.merk_dagang}</b>
                                                </span>
                                            )}
                                            {item.tipe_jenis && (
                                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                                                    Tipe: {item.tipe_jenis}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {item.estimasi_tarif > 0 && (
                                        <div className="text-right pl-7 sm:pl-0 shrink-0">
                                            <span className="text-[11px] text-slate-400 block">Estimasi Tarif:</span>
                                            <span className="font-bold text-slate-900">
                                                Rp {item.estimasi_tarif.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 italic">Belum ada komoditas atau produk yang dicatat.</p>
                    )}
                </CardContent>
            </Card>

            {/* Data Pabrik */}
            <Card className="rounded-2xl border-slate-200 shadow-soft">
                <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <Factory className="w-4 h-4 text-brand-600" />
                        Lokasi Pabrik & Fasilitas Produksi ({pabriks.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-4 space-y-3">
                    {pabriks.length > 0 ? (
                        pabriks.map((pabrik: any, idx: number) => (
                            <div
                                key={pabrik.id || idx}
                                className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs text-xs space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-[10px]">
                                            {idx + 1}
                                        </span>
                                        {pabrik.nama_pabrik || pabrik.nama || "Pabrik Produksi"}
                                    </div>
                                    {pabrik.status_pabrik && <Badge variant="outline">{pabrik.status_pabrik}</Badge>}
                                </div>
                                <div className="text-slate-600 flex items-start gap-1.5 pl-7">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                    <span>{pabrik.alamat_pabrik || pabrik.alamat || "-"}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pl-7 pt-1 text-slate-500">
                                    {pabrik.kontak_pabrik && <div>Kontak: {pabrik.kontak_pabrik}</div>}
                                    {pabrik.telepon_pabrik && <div>Telp: {pabrik.telepon_pabrik}</div>}
                                    {pabrik.luas_pabrik && <div>Luas: {pabrik.luas_pabrik} m²</div>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-slate-500 italic">Data pabrik mengacu pada alamat kantor operasional pemohon.</p>
                    )}
                </CardContent>
            </Card>

            {/* Kuesioner */}
            <Card className="rounded-2xl border-slate-200 shadow-soft">
                <CardHeader className="border-b border-slate-100 pb-3">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <FileSpreadsheet className="w-4 h-4 text-brand-600" />
                        Kuesioner Kelayakan & Asesmen Mandiri
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-4 text-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-slate-400 block font-medium">Sistem Manajemen Mutu yang Diterapkan:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">{sistemMutu}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-slate-400 block font-medium">Lembaga Penerbit Sertifikat Mutu:</span>
                            <span className="font-semibold text-slate-800 mt-0.5 block">{lembagaSertifikasiMutu}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>


            {/* Berkas */}
            <Card className="rounded-2xl border-slate-200 shadow-soft">
                <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <FileCheck2 className="w-4 h-4 text-brand-600" />
                        Berkas Permohonan Sertifikasi
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-4">
                    {docs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {docs.map((doc) => (
                                <div
                                    key={doc.key}
                                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-brand-50/40 hover:border-brand-300 transition-all flex items-center justify-between text-xs group"
                                >
                                    <div className="flex items-center gap-2.5 truncate">
                                        <div className="p-2 rounded-lg bg-white border border-slate-200 text-brand-600 shrink-0">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="truncate">
                                            <span className="font-semibold text-slate-800 block truncate">{doc.label}</span>
                                            <span className="text-[10px] text-slate-400 block truncate">Format: Berkas Digital</span>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 group-hover:text-brand-600 group-hover:border-brand-200 transition-all shrink-0 ml-2"
                                        onClick={() => handleOpenDoc(doc.url, doc.label)}
                                        title="Buka Pratinjau Berkas"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500 italic">Belum ada dokumen persyaratan yang diunggah.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default SertifikasiDetailSection