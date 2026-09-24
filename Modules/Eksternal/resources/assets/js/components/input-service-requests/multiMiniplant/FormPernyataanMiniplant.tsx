import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { ShieldCheck, Info, UserCheck, FileText, ListChecks } from "lucide-react"
import { DetailPermohonanData } from "./FormDetailPermohonan"
import { PelangganData } from "./FormInformasiPelanggan"
import { SelectedPerlakuanItem } from "./FormPerlakuanMiniplant"
import { useMasterMiniplantQuery } from "../../../hooks/queries/useMasterQuery"

export interface FormPernyataanMiniplantProps {
    jenisLayananJudul?: string
    fasilitasJudul?: string
    dataDetail?: DetailPermohonanData
    dataPelanggan?: PelangganData
    selectedPerlakuan: Record<string, SelectedPerlakuanItem>
    setujuPernyataan: boolean
    onChangePernyataan: (setuju: boolean) => void
    loading?: boolean
}

export const FormPernyataanMiniplant: React.FC<FormPernyataanMiniplantProps> = ({
    jenisLayananJudul,
    fasilitasJudul,
    dataDetail,
    dataPelanggan,
    selectedPerlakuan,
    setujuPernyataan,
    onChangePernyataan,
    loading = false,
}) => {
    const { data: masterItems = [] } = useMasterMiniplantQuery()

    const formatRupiah = (val: number) => {
        return `Rp ${new Intl.NumberFormat("id-ID").format(val)},-`
    }

    // Ambil daftar item yang dipilih
    const selectedItemList = Object.entries(selectedPerlakuan)
        .filter(([_, state]) => state.checked)
        .map(([id, state]) => {
            const master = masterItems.find((p) => String(p.id) === id)
            const qty = typeof state.jumlah === "number" ? state.jumlah : parseInt(String(state.jumlah), 10) || 0
            const biayaNum = Number(master?.biaya) || 0
            const subtotal = biayaNum * qty
            return {
                id,
                nama: master?.nama || "Perlakuan Miniplant",
                satuan: master?.satuan || "-",
                biaya: biayaNum,
                jumlah: qty,
                subtotal,
            }
        })

    const totalBiaya = selectedItemList.reduce((acc, item) => acc + item.subtotal, 0)

    return (
        <Card className="border-brand-100 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                            <ShieldCheck className="w-4 h-4 text-brand-600" />
                            Ringkasan Permohonan & Pernyataan
                        </CardTitle>
                        <CardDescription>
                            Periksa kembali data permohonan layanan miniplant Anda sebelum mengirim pengajuan
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                {/* 1. Ringkasan Jenis Layanan & Detail Barang */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-600" />
                        Jenis Layanan & Detail Barang
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="text-slate-500 block">Jenis Layanan:</span>
                            <span className="font-semibold text-slate-800">{jenisLayananJudul || fasilitasJudul || "-"}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">Jasa yang Diminta:</span>
                            <span className="font-semibold text-slate-800 uppercase">{dataDetail?.jasaDiminta || "-"}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">Jenis Barang:</span>
                            <span className="font-semibold text-slate-800">{dataDetail?.jenisBarang || "-"}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">Jumlah Barang:</span>
                            <span className="font-semibold text-slate-800">{dataDetail?.jumlahBarang || "-"}</span>
                        </div>
                        {dataDetail?.jasaDiminta === "proses" && dataDetail?.perlakuanDiminta && (
                            <div className="sm:col-span-2">
                                <span className="text-slate-500 block">Perlakuan yang Diminta:</span>
                                <p className="text-slate-800 mt-0.5 whitespace-pre-wrap">{dataDetail.perlakuanDiminta}</p>
                            </div>
                        )}
                        {dataDetail?.jasaDiminta === "mesin" && (
                            <div className="sm:col-span-2 flex flex-wrap gap-4 pt-1 border-t border-slate-200">
                                <div>
                                    <span className="text-slate-500">Tekanan: </span>
                                    <span className="font-semibold text-slate-800">{dataDetail?.tekananNilai ? `${dataDetail.tekananNilai} ${dataDetail.tekananSatuan || ""}` : "-"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Waktu: </span>
                                    <span className="font-semibold text-slate-800">{dataDetail?.waktuNilai ? `${dataDetail.waktuNilai} ${dataDetail.waktuSatuan || ""}` : "-"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Temperatur: </span>
                                    <span className="font-semibold text-slate-800">{dataDetail?.temperaturNilai ? `${dataDetail.temperaturNilai} ${dataDetail.temperaturSatuan || ""}` : "-"}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Ringkasan Perlakuan yang Dipilih */}
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                            <ListChecks className="w-4 h-4 text-brand-600" />
                            Rincian Perlakuan & Estimasi Biaya
                        </h3>
                        <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                            {selectedItemList.length} Dipilih
                        </span>
                    </div>

                    {selectedItemList.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500 italic">
                            Belum ada perlakuan yang dipilih.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 text-xs">
                            {selectedItemList.map((item) => (
                                <div key={item.id} className="p-3 sm:px-4 flex justify-between items-center gap-4">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-800">{item.nama}</p>
                                        <p className="text-[11px] text-slate-500">
                                            {item.jumlah} {item.satuan} × {formatRupiah(item.biaya)}
                                        </p>
                                    </div>
                                    <span className="font-bold text-slate-900 shrink-0">
                                        {formatRupiah(item.subtotal)}
                                    </span>
                                </div>
                            ))}
                            <div className="p-3 sm:px-4 bg-slate-50/80 flex justify-between items-center font-bold text-xs">
                                <span className="text-slate-700">Total Estimasi Biaya:</span>
                                <span className="text-brand-600 text-sm">{formatRupiah(totalBiaya)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Ringkasan Data Pelanggan */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-brand-600" />
                        Identitas Pemohon
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="text-slate-500 block">Nama Peminta Jasa:</span>
                            <span className="font-semibold text-slate-800">{dataPelanggan?.namaPemohon || "-"}</span>
                        </div>
                        <div>
                            <span className="text-slate-500 block">Nomor Telepon:</span>
                            <span className="font-semibold text-slate-800">{dataPelanggan?.no_telp || "-"}</span>
                        </div>
                        <div className="sm:col-span-2">
                            <span className="text-slate-500 block">Alamat Peminta Jasa:</span>
                            <span className="font-semibold text-slate-800">{dataPelanggan?.alamat || "-"}</span>
                        </div>
                    </div>
                </div>

                {/* 4. Kotak Pernyataan Pemohon */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                    <div className="flex items-start gap-2.5">
                        <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-slate-700 space-y-2">
                            <div>
                                <p className="font-bold text-slate-900">Pernyataan Pemohon Layanan Miniplant</p>
                                <p className="leading-relaxed text-slate-600 mt-0.5">
                                    Dengan ini saya menyatakan bahwa data yang diisikan dalam formulir permohonan ini adalah benar dan dapat dipertanggungjawabkan, serta bersedia mematuhi ketentuan dan SOP layanan miniplant yang berlaku di BBSPJIKKP.
                                </p>
                            </div>

                            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
                                <span className="font-semibold text-slate-800">Catatan :</span>
                                <ul className="list-disc list-inside mt-0.5 text-slate-600">
                                    <li>Hasil Pekerjaan yang tidak diambil lebih dari 2 (dua) bulan setelah tanggal pekerjaan selesai apabila terjadi kerusakan bukan menjadi tanggung jawab BBKKP</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={setujuPernyataan}
                                disabled={loading}
                                onChange={(e) => onChangePernyataan(e.target.checked)}
                                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <span className="text-xs font-semibold text-slate-800">
                                Saya telah membaca, memahami, dan menyetujui seluruh pernyataan di atas <span className="text-rose-500">*</span>
                            </span>
                        </label>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default FormPernyataanMiniplant
