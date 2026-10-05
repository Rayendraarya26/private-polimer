import React from "react"
import { CreditCard, Eye, CheckCircle, FileText, FileCheck2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { getFileUrl } from "../../utils/fileHelpers"

export interface BiayaPenawaranTabProps {
  id?: string
  noOrder: string
  permohonan: any
  status: string
  isPup?: boolean
  isPelatihan?: boolean
  isLsp?: boolean
  isGrk?: boolean
  isInspeksi?: boolean
  penawaran: any
  totalBiayaPenawaran: number
  rincianList: any[]
  formPupData?: any
  isPenawaranDisetujui: boolean
  isPenawaranDitolak: boolean
  isPendingApproval: boolean
  approvalLoading: boolean
  requestingTte: string | null
  openPdfDoc: (url: string, title: string, filename: string) => void
  openInvoice: (params: { id?: string; no_permohonan: string }) => void
  openKuitansi: (params: { id?: string; no_permohonan: string }) => void
  handleApprovalPenawaran: (status: "SETUJU" | "TOLAK") => void
  handleRequestTteInvoice: () => void
  handleRequestTteKuitansi: () => void
  onOpenRejectModal: () => void
}

export const BiayaPenawaranTab: React.FC<BiayaPenawaranTabProps> = ({
  id,
  noOrder,
  permohonan,
  status,
  isPup = false,
  isPelatihan = false,
  isLsp = false,
  isGrk = false,
  isInspeksi = false,
  penawaran,
  totalBiayaPenawaran,
  rincianList,
  formPupData,
  isPenawaranDisetujui,
  isPenawaranDitolak,
  isPendingApproval,
  approvalLoading,
  requestingTte,
  openPdfDoc,
  openInvoice,
  openKuitansi,
  handleApprovalPenawaran,
  handleRequestTteInvoice,
  handleRequestTteKuitansi,
  onOpenRejectModal,
}) => {
  const hasPenawaranInfo = Boolean(
    penawaran ||
      status === "MENUNGGU_PERSETUJUAN_PELANGGAN" ||
      status === "PENAWARAN_BIAYA" ||
      totalBiayaPenawaran > 0 ||
      rincianList.length > 0 ||
      permohonan?.file_surat_penawaran ||
      permohonan?.harga_permohonan ||
      isPup
  )

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Surat Penawaran Biaya Card */}
      {hasPenawaranInfo ? (
        <Card className="rounded-2xl shadow-soft overflow-hidden border border-slate-200 bg-white">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  isPenawaranDisetujui || isPup
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isPup
                    ? "Rincian Tagihan Biaya Uji Profisiensi"
                    : isPelatihan
                      ? "Penawaran Biaya Bimbingan Teknis & Pelatihan"
                      : isLsp
                        ? "Penawaran Biaya Sertifikasi Profesi (LSP)"
                        : isGrk
                          ? "Penawaran Biaya Validasi & Verifikasi GRK"
                          : isInspeksi
                            ? "Penawaran Biaya Jasa Inspeksi"
                            : "Surat Penawaran Biaya Layanan Sertifikasi"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isPup
                    ? "Rincian tarif PNBP resmi keikutsertaan Uji Profisiensi Kalibrasi sesuai skema terpilih."
                    : isPelatihan
                      ? "Rincian tarif dan estimasi biaya bimbingan teknis / pelatihan industri."
                      : isLsp
                        ? "Rincian biaya uji kompetensi dan sertifikasi profesi BNSP."
                        : isGrk
                          ? "Rincian estimasi biaya penugasan validator/verifikator gas rumah kaca."
                          : isInspeksi
                            ? "Rincian tarif PNBP resmi jasa inspeksi karung plastik banpang."
                            : isPendingApproval
                              ? "Tim Marketing telah menerbitkan estimasi biaya definitif. Mohon tinjau dan berikan persetujuan Anda."
                              : isPenawaranDisetujui
                                ? "Penawaran biaya telah disetujui. Menunggu atau telah diterbitkan tagihan resmi."
                                : "Penawaran biaya dalam peninjauan oleh Marketing."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  isPup || isPenawaranDisetujui
                    ? "success"
                    : isPenawaranDitolak
                      ? "danger"
                      : isPendingApproval
                        ? "warning"
                        : "neutral"
                }
              >
                {isPup
                  ? "Tarif PNBP Ditetapkan"
                  : isPenawaranDisetujui
                    ? "Telah Disetujui"
                    : isPenawaranDitolak
                      ? "Ditolak / Negosiasi"
                      : isPendingApproval
                        ? "Menunggu Persetujuan"
                        : "Dalam Proses"}
              </Badge>
            </div>
          </div>

          <CardContent className="p-5 space-y-4">
            {/* Banner Diskon Bundling jika ada */}
            {isPup && Number(formPupData?.diskon_nominal) > 0 && (
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <span>
                    <strong>Paket Diskon Bundling Spesial:</strong> Anda mendapatkan potongan biaya
                    sebesar{" "}
                    <strong>
                      Rp {Number(formPupData.diskon_nominal).toLocaleString("id-ID")}
                    </strong>{" "}
                    untuk pendaftaran paket Centrifuge + Overhead Stirrer.
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] shrink-0">
                  Hemat Rp {Number(formPupData.diskon_nominal).toLocaleString("id-ID")}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Biaya Penawaran
                </span>
                <span className="text-xl font-extrabold text-brand-700 mt-1 block">
                  Rp {totalBiayaPenawaran.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Dokumen Surat Penawaran
                </span>
                {penawaran?.file_surat_penawaran ? (
                  <button
                    type="button"
                    onClick={() =>
                      openPdfDoc(
                        getFileUrl(penawaran.file_surat_penawaran),
                        "Surat Penawaran Biaya Resmi",
                        `Penawaran-Biaya-${permohonan?.no_permohonan || id}.pdf`
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 mt-2 text-left"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Lihat Surat Penawaran Resmi (PDF)
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 mt-2 block">
                    Dokumen dilampirkan via sistem
                  </span>
                )}
              </div>

              {penawaran?.catatan && (
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 shadow-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Catatan Marketing
                  </span>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {penawaran.catatan}
                  </p>
                </div>
              )}
            </div>

            {/* Rincian Komponen Biaya Table */}
            {rincianList.length > 0 && (
              <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden bg-white">
                <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 text-xs font-bold text-slate-700">
                  Rincian Komponen Biaya
                </div>
                <div className="divide-y divide-slate-100">
                  {rincianList.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/50"
                    >
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800">
                          {item.nama_item || item.item_bayar || `Item #${idx + 1}`}
                        </span>
                        <span className="text-slate-400 text-[11px] ml-2">
                          Qty: {item.qty || item.kuantitas || 1}
                        </span>
                      </div>
                      <span
                        className={`font-mono font-bold ${
                          Number(item.subtotal || item.harga_satuan || 0) < 0
                            ? "text-emerald-600"
                            : "text-slate-800"
                        }`}
                      >
                        {Number(item.subtotal || item.harga_satuan || 0) < 0 ? "-Rp " : "Rp "}
                        {Math.abs(
                          Number(
                            item.subtotal ||
                              (item.nominal || item.harga_satuan || 0) *
                                (item.qty || item.kuantitas || 1)
                          )
                        ).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tombol Aksi Persetujuan jika pending */}
            {isPendingApproval && (
              <div className="pt-3 flex items-center gap-3 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprovalPenawaran("SETUJU")}
                  isLoading={approvalLoading}
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                >
                  Setujui Penawaran Biaya Ini
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenRejectModal}
                  disabled={approvalLoading}
                  className="text-amber-800 border-amber-300 hover:bg-amber-100 text-xs"
                >
                  Ajukan Negosiasi / Tolak
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 space-y-2">
          <CreditCard className="w-8 h-8 mx-auto text-slate-400" />
          <h4 className="text-sm font-bold text-slate-700">Penawaran Biaya Belum Diterbitkan</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tim Kami sedang meninjau lingkup permohonan sertifikasi Anda untuk menerbitkan penawaran
            biaya resmi.
          </p>
        </div>
      )}

      {/* Rincian Tagihan & Dokumen Billing Lengkap */}
      <Card className="rounded-2xl border-slate-200 shadow-soft">
        <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
            <FileText className="w-4 h-4 text-brand-600" />
            Status Billing & Dokumen Keuangan
          </CardTitle>
          <Badge variant={permohonan?.status_bayar === "LUNAS" ? "success" : "warning"}>
            {permohonan?.status_bayar === "LUNAS" ? "Lunas" : "Menunggu Pembayaran"}
          </Badge>
        </CardHeader>
        <CardContent className="p-5 pt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kotak Invoice */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Dokumen Invoice</span>
                {permohonan?.pdf_tte ? (
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg">
                    TTE BSrE Sah
                  </span>
                ) : permohonan?.tte_invoice_requested ? (
                  <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200 rounded-lg">
                    Menunggu TTE Bendahara
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] bg-slate-200/70 text-slate-600 font-semibold rounded-lg">
                    Digital Seal
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-[11px]">
                Surat tagihan resmi berisi rincian tarif layanan dan nomor rekening perbendaharaan.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<FileText className="w-3.5 h-3.5" />}
                  onClick={() => openInvoice({ id, no_permohonan: noOrder })}
                  className="flex-1 justify-center"
                >
                  Buka Invoice
                </Button>
                {!permohonan?.pdf_tte && !permohonan?.tte_invoice_requested && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRequestTteInvoice}
                    isLoading={requestingTte === "invoice"}
                    className="text-xs"
                    title="Minta TTE BSrE Resmi Bendahara"
                  >
                    Minta TTE
                  </Button>
                )}
              </div>
            </div>

            {/* Kotak Kuitansi */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Kuitansi Pembayaran</span>
                {permohonan?.status_bayar === "LUNAS" ? (
                  permohonan?.kuitansi_pdf_tte ? (
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 rounded-lg">
                      TTE BSrE Sah
                    </span>
                  ) : permohonan?.tte_kuitansi_requested ? (
                    <span className="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200 rounded-lg">
                      Menunggu TTE Bendahara
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 font-semibold rounded-lg">
                      Lunas
                    </span>
                  )
                ) : (
                  <span className="px-2 py-0.5 text-[10px] bg-slate-200/70 text-slate-500 font-semibold rounded-lg">
                    Belum Terbit
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-[11px]">
                Bukti bayar sah yang diterbitkan otomatis saat status transaksi telah terverifikasi
                lunas.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant={permohonan?.status_bayar === "LUNAS" ? "success" : "outline"}
                  size="sm"
                  disabled={permohonan?.status_bayar !== "LUNAS"}
                  leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
                  onClick={() => openKuitansi({ id, no_permohonan: noOrder })}
                  className="flex-1 justify-center"
                >
                  Buka Kuitansi
                </Button>
                {permohonan?.status_bayar === "LUNAS" &&
                  !permohonan?.kuitansi_pdf_tte &&
                  !permohonan?.tte_kuitansi_requested && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleRequestTteKuitansi}
                      isLoading={requestingTte === "kuitansi"}
                      className="text-xs"
                      title="Minta TTE BSrE Resmi Bendahara"
                    >
                      Minta TTE
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BiayaPenawaranTab
