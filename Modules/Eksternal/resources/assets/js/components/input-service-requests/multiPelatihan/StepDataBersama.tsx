import React from "react"
import { SharedData, ParticipantData } from "../../../types/pelatihan"
import { ProfileClientType } from "../../../types/profile"
import KapabilitasPelatihan from "./KapabilitasPelatihan"
import { Button } from "../../ui/Button"
import {
  Building2,
  BookOpen,
  Layers,
  CreditCard,
  FileCheck2,
  ArrowLeft,
  Save,
  Send,
} from "lucide-react"

interface Props {
  sharedData: SharedData
  setSharedData: React.Dispatch<React.SetStateAction<SharedData>>
  participants: ParticipantData[]
  setParticipants: React.Dispatch<React.SetStateAction<ParticipantData[]>>
  jenisPelanggan: string | undefined
  detail: any
  participantCount: number
  submitting: boolean
  kapabilitas: any
  onBack: () => void
  onSubmit: (aksi: "draft" | "ajukan") => void
}

const StepDataBersama: React.FC<Props> = ({
  sharedData,
  setSharedData,
  participants,
  setParticipants,
  jenisPelanggan,
  participantCount,
  submitting,
  kapabilitas,
  onBack,
  onSubmit,
}) => {
  const showLSPForm =
    kapabilitas === 1 && sharedData.program === "Pelatihan dan Uji Kompetensi"

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      {/* 1. Data Unit Usaha / Instansi */}
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
              Identitas entitas pengirim atau unit kerja pemohon pelatihan
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
            placeholder="Alamat kantor lengkap..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Jenis Produk / Sektor Industri <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="jenis_produk"
            value={sharedData.jenis_produk}
            onChange={handleChange}
            placeholder="Contoh: Manufaktur Kemasan Plastik, Komponen Otomotif Karet..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>
      </div>

      {/* 2. Informasi Kebutuhan Materi Pelatihan */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              2. Kebutuhan Kurikulum & Sasaran Pelatihan
            </h3>
            <p className="text-xs text-slate-500">
              Uraikan kendala operasional teknis dan topik yang ingin dipelajari secara mendalam
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Permasalahan yang Timbul Terkait Materi / Produksi <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            name="masalah_materi"
            value={sharedData.masalah_materi}
            onChange={handleChange}
            placeholder="Deskripsikan masalah teknis produksi atau kendala mutu yang dihadapi..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Hal Khusus yang Ingin Dipelajari / Dikuasai <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            name="hal_dipelajari"
            value={sharedData.hal_dipelajari}
            onChange={handleChange}
            placeholder="Contoh: Teknik formulasi aditif, optimasi setting cetak injeksi, pengujian mekanik SNI..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>
      </div>

      {/* 3. Paket / Program Pilihan */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              3. Paket Program Pelatihan
            </h3>
            <p className="text-xs text-slate-500">
              Pilih apakah hanya mengikuti bimbingan teknis atau bundling dengan uji kompetensi LSP
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              sharedData.program === "Pelatihan"
                ? "bg-brand-50/60 border-brand-300 ring-2 ring-brand-500/20"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name="program"
              value="Pelatihan"
              checked={sharedData.program === "Pelatihan"}
              onChange={handleChange}
              className="mt-1 text-brand-600 focus:ring-brand-500"
              required
            />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 block">
                Pelatihan / Bimbingan Teknis Standar
              </span>
              <p className="text-slate-500 leading-relaxed">
                Mendapatkan sertifikat pelatihan teknis resmi yang diterbitkan oleh Balai Besar Kimia dan Kemasan (BBKKP).
              </p>
            </div>
          </label>

          {kapabilitas === 1 && (
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                sharedData.program === "Pelatihan dan Uji Kompetensi"
                  ? "bg-brand-50/60 border-brand-300 ring-2 ring-brand-500/20"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="program"
                value="Pelatihan dan Uji Kompetensi"
                checked={sharedData.program === "Pelatihan dan Uji Kompetensi"}
                onChange={handleChange}
                className="mt-1 text-brand-600 focus:ring-brand-500"
              />
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 block">
                    Pelatihan + Uji Kompetensi LSP
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                    Bundling BNSP
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Termasuk asesmen langsung untuk mendapatkan Sertifikasi Kompetensi Profesi berlisensi BNSP.
                </p>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Form Tambahan LSP Uji Kompetensi jika bundling dipilih */}
      {showLSPForm && (
        <div className="animate-in fade-in-50 duration-300">
          <KapabilitasPelatihan
            participants={participants}
            setParticipants={setParticipants}
          />
        </div>
      )}

      {/* 4. Metode Penagihan (hanya tampil jika peserta > 1) */}
      {participantCount > 1 && (
        <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                4. Metode Pembayaran & Penagihan ({participantCount} Peserta)
              </h3>
              <p className="text-xs text-slate-500">
                Pilih opsi penggabungan atau pemisahan tagihan invoice
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  Gabung Tagihan (1 Invoice Bersama)
                </span>
                <p className="text-slate-500 leading-relaxed">
                  Satu invoice kolektif mencakup seluruh biaya {participantCount} peserta.
                </p>
              </div>
            </label>

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
                  Split Bill (Invoice Terpisah)
                </span>
                <p className="text-slate-500 leading-relaxed">
                  Masing-masing peserta menerima nomor tagihan dan Virtual Account mandiri.
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* 5. Persetujuan & Komitmen Pelatihan */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              5. Persetujuan Syarat & Ketentuan Pelatihan
            </h3>
            <p className="text-xs text-slate-500">
              Tata tertib dan komitmen kehadiran peserta pelatihan BBKKP
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
          <ol className="list-decimal list-inside space-y-1.5 font-medium text-slate-600">
            <li>Peserta berkomitmen mengikuti seluruh rangkaian sesi bimbingan teknis sampai selesai.</li>
            <li>Menyelesaikan evaluasi, studi kasus, atau praktikum laboratorium yang diberikan instruktur.</li>
            <li>Melunasi tarif PNBP biaya pelatihan sesuai invoice sebelum tanggal pelaksanaan dimulai.</li>
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
              Dengan ini saya menyatakan bahwa data pendaftaran valid dan menyetujui seluruh ketentuan di atas. <span className="text-rose-500">*</span>
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
              ? `Ajukan (${participantCount} Peserta)`
              : "Simpan & Ajukan Permohonan"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StepDataBersama
