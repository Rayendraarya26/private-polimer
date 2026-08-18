import React from "react"
import { SharedDataLSP } from "../../../types/lsp"
import { ProfileClientType } from "../../../types/profile"
import { Button } from "../../ui/Button"
import {
  Building2,
  CreditCard,
  FileCheck2,
  ArrowLeft,
  Save,
  Send,
  Info,
  CheckCircle2,
} from "lucide-react"

interface Props {
  sharedData: SharedDataLSP
  setSharedData: React.Dispatch<React.SetStateAction<SharedDataLSP>>
  jenisPelanggan: string | undefined
  participantCount: number
  submitting: boolean
  onBack: () => void
  onSubmit: (aksi: "draft" | "ajukan") => void
}

const StepDataBersamaLSP: React.FC<Props> = ({
  sharedData,
  setSharedData,
  jenisPelanggan,
  participantCount,
  submitting,
  onBack,
  onSubmit,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setSharedData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setSharedData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const instansiLabel =
    jenisPelanggan === ProfileClientType.PERORANGAN
      ? "Unit Usaha / Tempat Bekerja"
      : jenisPelanggan === ProfileClientType.INSTANSI_PEMERINTAH
      ? "Instansi Pemerintah"
      : "Badan Usaha / Perusahaan"

  return (
    <div className="space-y-6">
      {/* 1. Data Unit Usaha / Instansi Pemohon */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              1. Data {instansiLabel}
            </h3>
            <p className="text-xs text-slate-500">
              Identitas unit usaha atau instansi yang menaungi peserta uji kompetensi
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nama {instansiLabel} <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="nama_instansi"
            value={sharedData.nama_instansi}
            onChange={handleChange}
            placeholder={`Masukkan nama ${instansiLabel.toLowerCase()}...`}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Alamat Kantor / Unit Usaha <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            name="alamat_instansi"
            value={sharedData.alamat_instansi}
            onChange={handleChange}
            placeholder="Alamat domisili lengkap..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Jenis Bidang Industri / Sektor Usaha <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="jenis_produk"
            value={sharedData.jenis_produk}
            onChange={handleChange}
            placeholder="Contoh: Industri Plastik, Karet, Kemasan, Otomotif..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>
      </div>

      {/* 2. Metode Penagihan (hanya tampil jika peserta > 1) */}
      {participantCount > 1 && (
        <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                2. Metode Pembayaran & Penagihan ({participantCount} Peserta)
              </h3>
              <p className="text-xs text-slate-500">
                Tentukan skema penerbitan tagihan Virtual Account (VA) untuk seluruh peserta
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Opsi 1: Together */}
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                sharedData.billing_type === "together"
                  ? "bg-brand-50/60 border-brand-300 ring-2 ring-brand-500/20"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="billing_type"
                value="together"
                checked={sharedData.billing_type === "together"}
                onChange={handleChange}
                className="mt-1 text-brand-600 focus:ring-brand-500"
              />
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-900 block">
                  Gabung Tagihan (1 Invoice Kolektif)
                </span>
                <p className="text-slate-500 leading-relaxed">
                  Satu nomor invoice dan Virtual Account diterbitkan sekaligus untuk total {participantCount} peserta.
                </p>
              </div>
            </label>

            {/* Opsi 2: Split Bill */}
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                sharedData.billing_type === "split"
                  ? "bg-brand-50/60 border-brand-300 ring-2 ring-brand-500/20"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="billing_type"
                value="split"
                checked={sharedData.billing_type === "split"}
                onChange={handleChange}
                className="mt-1 text-brand-600 focus:ring-brand-500"
              />
              <div className="text-xs space-y-1">
                <span className="font-bold text-slate-900 block">
                  Split Bill (Invoice Per Peserta)
                </span>
                <p className="text-slate-500 leading-relaxed">
                  Masing-masing dari {participantCount} peserta mendapat nomor permohonan dan nomor VA terpisah.
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* 3. Persetujuan & Komitmen Asesi */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              3. Persetujuan Syarat & Ketentuan Asesmen
            </h3>
            <p className="text-xs text-slate-500">
              Tata tertib dan kewajiban peserta uji kompetensi LSP BBKKP
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
          <ol className="list-decimal list-inside space-y-1.5 font-medium text-slate-600">
            <li>Bersedia hadir dan mengikuti rangkaian uji kompetensi sesuai jadwal yang ditetapkan oleh LSP.</li>
            <li>Menyelesaikan dan mengumpulkan seluruh bukti portofolio asesmen mandiri secara jujur dan akurat.</li>
            <li>Melunasi tarif PNBP sertifikasi kompetensi sesuai batas waktu tagihan yang ditentukan.</li>
            <li>Mematuhi kode etik profesi dan tata tertib asesmen LSP BBKKP.</li>
          </ol>
        </div>

        <label className="flex items-start gap-3 p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 cursor-pointer">
          <input
            type="checkbox"
            name="setuju_syarat"
            checked={sharedData.setuju_syarat}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            required
          />
          <div className="text-xs text-emerald-900">
            <span className="font-bold block">
              Saya menyatakan bahwa data yang diisi benar dan menyetujui seluruh ketentuan di atas. <span className="text-rose-500">*</span>
            </span>
            <span className="text-[11px] text-emerald-700">
              Permohonan akan diverifikasi oleh tim sekretariat LSP BBKKP sebelum jadwal uji kompetensi diterbitkan.
            </span>
          </div>
        </label>
      </div>

      {/* Navigasi & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={submitting}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Kembali ke Data Peserta
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={submitting}
            onClick={() => onSubmit("draft")}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Simpan Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            disabled={submitting}
            onClick={() => onSubmit("ajukan")}
            isLoading={submitting}
            leftIcon={<Send className="w-4 h-4" />}
            className="shadow-md"
          >
            {participantCount > 1
              ? `Simpan & Ajukan (${participantCount} Peserta)`
              : "Simpan & Ajukan Permohonan"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StepDataBersamaLSP