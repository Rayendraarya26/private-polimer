import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { GraduationCap, ArrowLeft, ArrowRight, Loader2, Factory, FlaskConical, Footprints, Layers, UserCheck, ListChecks } from "lucide-react"
import FormPelatihanWizard from "../../components/input-service-requests/multiPelatihan/FormPelatihanWizard"
import { usePelatihanSkemaQuery } from "../../hooks/queries/useMasterQuery"

interface MiniplantOption {
    value: string
    title: string
    code: string
    desc: string
    icon: React.ReactNode
}

interface PerlakuanItem {
    id: string
    nama: string
    satuan: string
    biaya: number
}

const daftarPerlakuan: PerlakuanItem[] = [
    { id: "1", nama: "Pembuatan Kompon (Karet alam)", satuan: "per kg", biaya: 114000 },
    { id: "2", nama: "Pembuatan Kompon (Karet sintetis)", satuan: "per kg", biaya: 130000 },
    { id: "3", nama: "Pembuatan slab karet", satuan: "per lembar", biaya: 80000 },
    { id: "4", nama: "Pembuatan slab plastik", satuan: "per lembar", biaya: 65000 },
    { id: "5", nama: "Kematangan kompon / Rheometer", satuan: "per contoh", biaya: 137000 },
    { id: "6", nama: "Melt Flow Indexer", satuan: "per contoh", biaya: 160000 },
    { id: "7", nama: "Rebound Ressilience", satuan: "per contoh", biaya: 150000 },
]

const miniplantOptions: MiniplantOption[] = [
    {
        value: "F",
        title: "Finishing Karet",
        code: "F",
        desc: "Fasilitas pengerjaan akhir, perlakuan permukaan, dan finishing untuk produk berbasis karet.",
        icon: <Layers className="w-5 h-5" />,
    },
    {
        value: "RPK",
        title: "Riset Penyamakan Kulit",
        code: "RPK",
        desc: "Fasilitas riset formulasi, penyamakan, dan proses pengolahan kulit mentah menjadi produk kulit siap pakai.",
        icon: <FlaskConical className="w-5 h-5" />,
    },
    {
        value: "PA",
        title: "Produk Kulit dan Alas Kaki",
        code: "PA",
        desc: "Fasilitas desain pola, pemotongan, penjahitan, dan perakitan produk barang jadi kulit serta alas kaki.",
        icon: <Footprints className="w-5 h-5" />,
    },
    {
        value: "MKP",
        title: "Miniplant Karet dan Plastik",
        code: "MKP",
        desc: "Fasilitas pencampuran (compounding), ekstrusi, cetak injeksi, dan vulkanisasi untuk material karet dan plastik.",
        icon: <Factory className="w-5 h-5" />,
    },
]

const MiniplantPage: React.FC = () => {
    const navigate = useNavigate()
    const [selectedSkema, setSelectedSkema] = useState("")
    const [selectedLayanan, setSelectedLayanan] = useState<string>("F")
    const [jasaDiminta, setJasaDiminta] = useState<string>("")
    const [selectedPerlakuan, setSelectedPerlakuan] = useState<
        Record<string, { checked: boolean; jumlah: number | string }>
    >({})

    const handleTogglePerlakuan = (id: string) => {
        setSelectedPerlakuan((prev) => {
            const current = prev[id]
            const isChecked = !current?.checked
            return {
                ...prev,
                [id]: {
                    checked: isChecked,
                    jumlah: isChecked ? (current?.jumlah && Number(current.jumlah) > 0 ? current.jumlah : 1) : (current?.jumlah || 1),
                },
            }
        })
    }

    const handleJumlahPerlakuanChange = (id: string, val: string) => {
        if (val === "") {
            setSelectedPerlakuan((prev) => ({
                ...prev,
                [id]: {
                    checked: true,
                    jumlah: "",
                },
            }))
            return
        }
        const parsed = parseInt(val, 10)
        const num = isNaN(parsed) ? 1 : Math.max(1, parsed)
        setSelectedPerlakuan((prev) => ({
            ...prev,
            [id]: {
                checked: true,
                jumlah: num,
            },
        }))
    }

    const formatRupiah = (val: number) => {
        return `${new Intl.NumberFormat("id-ID").format(val)},-`
    }

    const totalEstimasiBiaya = Object.entries(selectedPerlakuan).reduce((acc, [id, state]) => {
        if (!state.checked) return acc
        const item = daftarPerlakuan.find((p) => p.id === id)
        if (!item) return acc
        const qty = typeof state.jumlah === "number" ? state.jumlah : parseInt(state.jumlah, 10) || 0
        return acc + item.biaya * qty
    }, 0)

    const { data: skemaList = [], isLoading: loading } = usePelatihanSkemaQuery()

    const selectedSkemaData = skemaList.find((s: any) => s.id === selectedSkema)
    const kapabilitas = selectedSkemaData?.kapabilitas ?? 0

    const activeLayanan = miniplantOptions.find((opt) => opt.value === selectedLayanan)

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <Head title="Layanan Miniplant Kulit, Karet dan Plastik" />

            {/* Header & Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>Layanan Miniplant BBSPJIKKP</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Miniplant Kulit, Karet dan Plastik
                    </h1>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/permohonan")}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                    className="shrink-0"
                >
                    Kembali
                </Button>
            </div>

            {/* Option Selection Card */}
            <Card className="border-slate-200/80 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                Pilih Jenis Fasilitas Miniplant
                            </CardTitle>
                            <CardDescription>
                                Tentukan fasilitas atau layanan miniplant yang ingin diajukan
                            </CardDescription>
                        </div>
                        {loading && <Loader2 className="w-4 h-4 animate-spin text-brand-600" />}
                    </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                    <div className="py-4 flex justify-center items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {miniplantOptions.map((opt) => {
                                const isSelected = selectedLayanan === opt.value

                                return (
                                    <div
                                        key={opt.value}
                                        onClick={() => setSelectedLayanan(opt.value)}
                                        className={`relative rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all duration-200 ${isSelected
                                            ? "border-brand-600 bg-brand-50/40 ring-2 ring-brand-600/10 shadow-sm"
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSelected
                                                        ? "bg-brand-600 text-white shadow-sm"
                                                        : "bg-slate-100 text-slate-500"
                                                        }`}
                                                >
                                                    {opt.icon}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900">
                                                            {opt.title}
                                                        </span>
                                                        {isSelected && (
                                                            <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold">
                                                                Dipilih
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed">
                                                        {opt.desc}
                                                    </p>
                                                </div>
                                            </div>

                                            <input
                                                type="radio"
                                                name="miniplant_option"
                                                value={opt.value}
                                                checked={isSelected}
                                                onChange={() => setSelectedLayanan(opt.value)}
                                                className="w-4 h-4 text-brand-600 focus:ring-brand-500 shrink-0 mt-1 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Multi-step Form Wizard Container */}
            {selectedSkema && (
                <div className="animate-in fade-in-50 duration-300">
                    <FormPelatihanWizard skemaId={selectedSkema} kapabilitas={kapabilitas} />
                </div>
            )}

            <Card className="border-brand-100 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                                <UserCheck className="w-4 h-4 text-brand-600" />
                                Informasi Pelanggan
                            </CardTitle>
                            <CardDescription>
                                Data pemohon dan identitas kepemilikan sertifikat kalibrasi
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        <div className="md:col-span-1 md:col-start-1">
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Nama Peminta Jasa <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nama Lengkap Peminta Jasa"
                                name="namaPemohon"
                                id="namaPemohon"
                                // value={formData.namaKirim}
                                // onChange={(e) => handleChange("namaKirim", e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                            />
                        </div>

                        <div className="md:col-span-1 md:col-start-1">
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Nomor Telepon <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nomor Telepon / Kontak Peminta Jasa"
                                name="no_telp"
                                id="no_telp"
                                // value={formData.namaKirim}
                                // onChange={(e) => handleChange("namaKirim", e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Alamat<span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                rows={2}
                                id="alamat"
                                name="alamat"
                                placeholder="Alamat Peminta Jasa"
                                // value={formData.alamatKirim}
                                // onChange={(e) => handleChange("alamatKirim", e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                            />
                        </div>
                    </div>

                </CardContent>
            </Card>

            <Card className="border-brand-100 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                                <UserCheck className="w-4 h-4 text-brand-600" />
                                Detail Permohonan
                            </CardTitle>
                            <CardDescription>
                                {activeLayanan?.title}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        <div className="md:col-span-1 md:col-start-1">
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Jasa yang Diminta <span className="text-rose-500">*</span>
                            </label>
                            <select
                                name="jasa_diminta"
                                id="jasa_diminta"
                                value={jasaDiminta}
                                onChange={(e) => setJasaDiminta(e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors cursor-pointer"
                            >
                                <option>--- Pilih Jasa yang Diminta ---</option>
                                <option value="proses">Proses</option>
                                <option value="mesin">Mesin</option>
                            </select>
                        </div>

                        <div className="md:col-span-1 md:col-start-1">
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Jenis Barang <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Jenis Barang"
                                name="jenis_barang"
                                id="jenis_barang"
                                // value={formData.namaKirim}
                                // onChange={(e) => handleChange("namaKirim", e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                Jumlah Barang <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Jumlah barang yang akan diproses"
                                name="jumlah_barang"
                                id="jumlah_barang"
                                min={1}
                                // value={formData.namaKirim}
                                // onChange={(e) => handleChange("namaKirim", e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                            />
                        </div>

                        <div className="md:col-span-2">
                            {jasaDiminta ? (
                                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                                    Perlakuan yang diminta<span className="text-rose-500">*</span>
                                </label>
                            ) : null}


                            {jasaDiminta === 'proses' ? (
                                <textarea
                                    rows={4}
                                    id="perlakuan_diminta"
                                    name="perlakuan_diminta"
                                    placeholder="Perlakuan yang diminta"
                                    // value={formData.alamatKirim}
                                    // onChange={(e) => handleChange("alamatKirim", e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                />
                            ) : jasaDiminta === 'mesin' ? (
                                <div className="space-y-3.5 max-w-2xl pt-1">
                                    {/* Tekanan */}
                                    <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr_60px_130px] items-center gap-3">
                                        <label htmlFor="tekanan_nilai" className="text-xs font-semibold text-slate-700">
                                            Tekanan
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault()
                                            }}
                                            placeholder="Nilai Tekanan"
                                            name="tekanan_nilai"
                                            id="tekanan_nilai"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                        />
                                        <span className="text-xs font-semibold text-slate-600 sm:text-center">
                                            Satuan
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Misal: bar, psi"
                                            name="tekanan_satuan"
                                            id="tekanan_satuan"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                        />
                                    </div>

                                    {/* Waktu */}
                                    <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr_60px_130px] items-center gap-3">
                                        <label htmlFor="waktu_nilai" className="text-xs font-semibold text-slate-700">
                                            Waktu
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault()
                                            }}
                                            placeholder="Nilai Waktu"
                                            name="waktu_nilai"
                                            id="waktu_nilai"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                        />
                                        <span className="text-xs font-semibold text-slate-600 sm:text-center">
                                            Satuan
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Misal: menit, jam"
                                            name="waktu_satuan"
                                            id="waktu_satuan"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                        />
                                    </div>

                                    {/* Temperatur */}
                                    <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr_60px_130px] items-center gap-3">
                                        <label htmlFor="temperatur_nilai" className="text-xs font-semibold text-slate-700">
                                            Temperatur
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Nilai Temperatur"
                                            name="temperatur_nilai"
                                            id="temperatur_nilai"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                        />
                                        <span className="text-xs font-semibold text-slate-600 sm:text-center">
                                            Satuan
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Misal: °C"
                                            name="temperatur_satuan"
                                            id="temperatur_satuan"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-0 transition-colors"
                                        />
                                    </div>
                                </div>
                            ) : ''}
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Card Perlakuan yang Diinginkan */}
            <Card className="border-brand-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                                <ListChecks className="w-4 h-4 text-brand-600" />
                                Perlakuan yang Diinginkan
                            </CardTitle>
                            <CardDescription>
                                Pilih jenis perlakuan dan tentukan jumlah yang ingin diproses
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-xs text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800 text-white font-semibold text-xs">
                                    <th className="py-3 px-4 text-center w-16">Pilih</th>
                                    <th className="py-3 px-4">Perlakuan</th>
                                    <th className="py-3 px-4 text-center w-28">Jumlah</th>
                                    <th className="py-3 px-4 w-32">Satuan</th>
                                    <th className="py-3 px-4 text-right w-36">Biaya</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {daftarPerlakuan.map((item) => {
                                    const isChecked = !!selectedPerlakuan[item.id]?.checked
                                    const jumlah = selectedPerlakuan[item.id]?.jumlah ?? ""

                                    return (
                                        <tr
                                            key={item.id}
                                            className={`transition-colors ${
                                                isChecked
                                                    ? "bg-brand-50/50 hover:bg-brand-50/70"
                                                    : "bg-white hover:bg-slate-50"
                                            }`}
                                        >
                                            <td className="py-3 px-4 text-center">
                                                <input
                                                    type="checkbox"
                                                    id={`perlakuan-${item.id}`}
                                                    checked={isChecked}
                                                    onChange={() => handleTogglePerlakuan(item.id)}
                                                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <label
                                                    htmlFor={`perlakuan-${item.id}`}
                                                    className={`cursor-pointer font-medium select-none ${
                                                        isChecked
                                                            ? "text-brand-900 font-semibold"
                                                            : "text-slate-800"
                                                    }`}
                                                >
                                                    {item.nama}
                                                </label>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    disabled={!isChecked}
                                                    value={isChecked ? jumlah : ""}
                                                    onChange={(e) =>
                                                        handleJumlahPerlakuanChange(item.id, e.target.value)
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e" || e.key === "E")
                                                            e.preventDefault()
                                                    }}
                                                    placeholder="0"
                                                    className={`w-20 text-center rounded-lg border py-1.5 px-2 text-xs transition-colors ${
                                                        isChecked
                                                            ? "border-brand-400 bg-white text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-sm font-semibold"
                                                            : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                                                    }`}
                                                />
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 font-medium">
                                                {item.satuan}
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-slate-800">
                                                {formatRupiah(item.biaya)}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                            {totalEstimasiBiaya > 0 && (
                                <tfoot>
                                    <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-800">
                                        <td colSpan={4} className="py-3 px-4 text-right text-xs">
                                            Total Estimasi Biaya:
                                        </td>
                                        <td className="py-3 px-4 text-right text-sm text-brand-600 font-bold">
                                            {formatRupiah(totalEstimasiBiaya)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>



    )
}

export default MiniplantPage
