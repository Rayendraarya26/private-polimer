import React, { useState } from "react"
import {
  CreditCard,
  Search,
  CheckCircle2,
  Eye,
  Download,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react"
import Head from "../../../components/common/Head"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card"
import { Badge } from "../../../components/ui/Badge"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import toast from "react-hot-toast"

interface PembayaranAdminItem {
  id: string
  no_transaksi: string
  nomor_invoice: string
  pelanggan: string
  metode: "VA_BNI" | "TRANSFER_MANUAL"
  va_number?: string
  nominal: number
  tgl_bayar: string
  status: "TERKONFIRMASI" | "MENUNGGU_VERIFIKASI" | "KADALUARSA"
  bukti_bayar_url?: string
}

export const AdminPembayaranManagementPage: React.FC = () => {
  const [payments, setPayments] = useState<PembayaranAdminItem[]>([
    {
      id: "1",
      no_transaksi: "PAY-2026-08001",
      nomor_invoice: "INV/2026/08/0038",
      pelanggan: "PT Surya Kulit Nusantara",
      metode: "VA_BNI",
      va_number: "9881234567890001",
      nominal: 4800000,
      tgl_bayar: "11 Agu 2026, 14:20 WIB",
      status: "TERKONFIRMASI",
    },
    {
      id: "2",
      no_transaksi: "PAY-2026-08002",
      nomor_invoice: "INV/2026/08/0039",
      pelanggan: "Bambang Sudiro, S.T.",
      metode: "TRANSFER_MANUAL",
      nominal: 2500000,
      tgl_bayar: "16 Agu 2026, 10:15 WIB",
      status: "MENUNGGU_VERIFIKASI",
      bukti_bayar_url: "#",
    },
  ])

  const [selectedProof, setSelectedProof] = useState<PembayaranAdminItem | null>(null)

  const handleConfirmManualPayment = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "TERKONFIRMASI" as const } : p))
    )
    toast.success("Pembayaran berhasil diverifikasi. Kuitansi resmi diterbitkan!")
    setSelectedProof(null)
  }

  return (
    <div className="space-y-6">
      <Head title="Monitoring Pembayaran & Kuitansi PNBP" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-600" />
            Konfirmasi Pembayaran & Kuitansi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring transaksi Virtual Account BNI dan verifikasi bukti bayar manual pelanggan.
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm">Riwayat Transaksi Masuk</CardTitle>
            <CardDescription>Daftar pembayaran tagihan layanan publik</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">No. Transaksi & Invoice</th>
                  <th className="py-3 px-4 font-bold">Pelanggan</th>
                  <th className="py-3 px-4 font-bold">Metode Pembayaran</th>
                  <th className="py-3 px-4 font-bold text-right">Nominal</th>
                  <th className="py-3 px-4 font-bold">Waktu Bayar</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-center">Aksi / Kuitansi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-brand-700">{pay.no_transaksi}</p>
                      <span className="text-[11px] text-slate-400">{pay.nomor_invoice}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{pay.pelanggan}</td>
                    <td className="py-3.5 px-4">
                      {pay.metode === "VA_BNI" ? (
                        <div>
                          <Badge variant="info">VA BNI Otomatis</Badge>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{pay.va_number}</p>
                        </div>
                      ) : (
                        <Badge variant="secondary">Transfer Manual</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      Rp {pay.nominal.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{pay.tgl_bayar}</td>
                    <td className="py-3.5 px-4">
                      {pay.status === "TERKONFIRMASI" ? (
                        <Badge variant="success">Terkonfirmasi</Badge>
                      ) : (
                        <Badge variant="warning">Perlu Verifikasi</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {pay.status === "MENUNGGU_VERIFIKASI" ? (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setSelectedProof(pay)}
                          >
                            Verifikasi Bukti
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            title="Unduh Kuitansi Resmi TTE"
                            leftIcon={<Download className="w-3.5 h-3.5" />}
                          >
                            Download Kuitansi
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Verifikasi Bukti Bayar Manual */}
      {selectedProof && (
        <Modal
          show={Boolean(selectedProof)}
          onClose={() => setSelectedProof(null)}
          title="Verifikasi Bukti Pembayaran Manual"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-bold text-brand-700">{selectedProof.nomor_invoice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="font-semibold text-slate-800">{selectedProof.pelanggan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nominal:</span>
                <span className="font-bold text-emerald-700">
                  Rp {selectedProof.nominal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 text-center space-y-2">
              <p className="text-xs text-slate-600 font-medium">Lampiran Bukti Transfer Pelanggan:</p>
              <div className="h-44 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-mono">
                [ Pratinjau Bukti Transfer Bank / Resi ATM ]
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button size="sm" variant="outline" onClick={() => setSelectedProof(null)}>
                Tutup
              </Button>
              <Button
                size="sm"
                variant="success"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => handleConfirmManualPayment(selectedProof.id)}
              >
                Konfirmasi & Terbitkan Kuitansi Lunas
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminPembayaranManagementPage
