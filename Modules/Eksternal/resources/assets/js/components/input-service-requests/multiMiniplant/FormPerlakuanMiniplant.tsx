import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { ListChecks, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "../../ui/Button"
import { useMasterMiniplantQuery } from "../../../hooks/queries/useMasterQuery"
import { MasterMiniplantItem } from "../../../services/miniplant"

export type PerlakuanItem = MasterMiniplantItem

export interface SelectedPerlakuanItem {
    checked: boolean
    jumlah: number | string
}

export interface FormPerlakuanMiniplantProps {
    selectedLayanan?: string
    selectedPerlakuan: Record<string, SelectedPerlakuanItem>
    setSelectedPerlakuan: React.Dispatch<
        React.SetStateAction<Record<string, SelectedPerlakuanItem>>
    >
    loading?: boolean
}

export const FormPerlakuanMiniplant: React.FC<FormPerlakuanMiniplantProps> = ({
    selectedLayanan,
    selectedPerlakuan = {},
    setSelectedPerlakuan,
    loading = false,
}) => {
    // Ambil data langsung dari master miniplant via API/TanStack Query
    const {
        data: masterMiniplant = [],
        isLoading,
        isError,
        refetch,
    } = useMasterMiniplantQuery()

    // Filter perlakuan sesuai dengan kode layanan yang dipilih (F, RPK, PA, MKP)
    const filteredItems = React.useMemo(() => {
        if (!selectedLayanan) return masterMiniplant
        return masterMiniplant.filter(
            (item) => item.kode?.trim().toUpperCase() === selectedLayanan?.trim().toUpperCase()
        )
    }, [masterMiniplant, selectedLayanan])

    const handleToggle = (id: string | number) => {
        const key = String(id)
        setSelectedPerlakuan((prev) => {
            const current = prev[key]
            const isChecked = !current?.checked
            return {
                ...prev,
                [key]: {
                    checked: isChecked,
                    jumlah: isChecked ? (current?.jumlah && Number(current.jumlah) > 0 ? current.jumlah : 1) : (current?.jumlah || 1),
                },
            }
        })
    }

    const handleJumlahChange = (id: string | number, val: string) => {
        const key = String(id)
        if (val === "") {
            setSelectedPerlakuan((prev) => ({
                ...prev,
                [key]: {
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
            [key]: {
                checked: true,
                jumlah: num,
            },
        }))
    }

    const formatRupiah = (val: number) => {
        return `Rp ${new Intl.NumberFormat("id-ID").format(val)},-`
    }

    // Hitung total estimasi biaya dari item yang dicentang
    const totalEstimasiBiaya = React.useMemo(() => {
        return Object.entries(selectedPerlakuan).reduce((acc, [id, state]) => {
            if (!state.checked) return acc
            const item = masterMiniplant.find((p) => String(p.id) === id)
            if (!item) return acc
            const qty = typeof state.jumlah === "number" ? state.jumlah : parseInt(String(state.jumlah), 10) || 0
            const biaya = Number(item.biaya) || 0
            return acc + biaya * qty
        }, 0)
    }, [selectedPerlakuan, masterMiniplant])

    // Jumlah item yang dipilih
    const totalSelectedCount = React.useMemo(() => {
        return Object.values(selectedPerlakuan).filter((p) => p.checked).length
    }, [selectedPerlakuan])

    return (
        <Card className="border-brand-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                            <ListChecks className="w-4 h-4 text-brand-600" />
                            Perlakuan yang Diinginkan
                        </CardTitle>
                        <CardDescription>
                            Pilih jenis perlakuan dan tentukan kuantitas barang/contoh yang akan diproses
                        </CardDescription>
                    </div>

                    {totalSelectedCount > 0 && (
                        <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700">
                                {totalSelectedCount} perlakuan dipilih
                            </span>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-0 sm:p-6">
                {isLoading ? (
                    <div className="py-16 text-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
                        <p className="text-xs font-medium text-slate-600">
                            Memuat daftar master perlakuan miniplant...
                        </p>
                    </div>
                ) : isError ? (
                    <div className="py-12 px-4 text-center space-y-3">
                        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                        <p className="text-sm font-semibold text-slate-800">
                            Gagal memuat master data perlakuan
                        </p>
                        <p className="text-xs text-slate-500">
                            Terjadi kendala saat mengambil data master miniplant dari server.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                        >
                            Coba Lagi
                        </Button>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                        Tidak ada perlakuan yang tersedia untuk jenis layanan ini.
                    </div>
                ) : (
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
                                {filteredItems.map((item) => {
                                    const key = String(item.id)
                                    const isChecked = !!selectedPerlakuan[key]?.checked
                                    const jumlah = selectedPerlakuan[key]?.jumlah ?? ""
                                    const biayaNum = Number(item.biaya) || 0

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
                                                    disabled={loading}
                                                    onChange={() => handleToggle(item.id)}
                                                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer disabled:cursor-not-allowed"
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
                                                    disabled={!isChecked || loading}
                                                    value={isChecked ? jumlah : ""}
                                                    onChange={(e) => handleJumlahChange(item.id, e.target.value)}
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
                                                {formatRupiah(biayaNum)}
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
                )}
            </CardContent>
        </Card>
    )
}

export default FormPerlakuanMiniplant
