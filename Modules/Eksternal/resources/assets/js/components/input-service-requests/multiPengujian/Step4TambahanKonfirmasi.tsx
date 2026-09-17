import React, { useRef } from "react"
import {
  FileCheck,
  Upload,
  Calendar,
  FileText,
  Building2,
  GraduationCap,
  CreditCard,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  Loader2,
  X,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { toast } from "react-hot-toast"
import {
  calculateGrandTotal,
  calculateSampleSubtotal,
  PengujianSampleItem,
  PengujianSharedData,
} from "../../../types/pengujian"
import { formatRupiah } from "./components/CostEstimationSummary"
import { Input } from "../../ui/Input"
import { Button } from "../../ui/Button"
import { Badge } from "../../ui/Badge"

interface Step4TambahanKonfirmasiProps {
  sharedData: PengujianSharedData
  setSharedData: React.Dispatch<React.SetStateAction<PengujianSharedData>>
  samples: PengujianSampleItem[]
  submitting: boolean
  onBack: () => void
  onSubmit: (aksi: "draft" | "ajukan") => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export const Step4TambahanKonfirmasi: React.FC<Step4TambahanKonfirmasiProps> = ({
  sharedData,
  setSharedData,
  samples,
  submitting,
  onBack,
  onSubmit,
}) => {
  const suratPengantarInputRef = useRef<HTMLInputElement>(null)
  const ktmInputRef = useRef<HTMLInputElement>(null)

  const isMahasiswa = sharedData.kategori_tarif === "mahasiswa_pp54"
  const grandTotal = calculateGrandTotal(samples, sharedData.kategori_tarif)

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "file_surat_pengantar" | "file_ktm"
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Ukuran file maksimal 5 MB (File Anda: ${(file.size / (1024 * 1024)).toFixed(2)} MB)`)
      e.target.value = ""
      return
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file hanya mendukung PDF, PNG, JPG, atau JPEG")
      e.target.value = ""
      return
    }

    setSharedData((prev) => ({
      ...prev,
      [field]: file,
    }))
    toast.success(`File ${file.name} berhasil diunggah`)
  }

  const handleRemoveFile = (field: "file_surat_pengantar" | "file_ktm") => {
    setSharedData((prev) => ({
      ...prev,
      [field]: null,
    }))
    if (field === "file_surat_pengantar" && suratPengantarInputRef.current) {
      suratPengantarInputRef.current.value = ""
    }
    if (field === "file_ktm" && ktmInputRef.current) {
      ktmInputRef.current.value = ""
    }
  }

  const handleTriggerSubmit = (aksi: "draft" | "ajukan") => {
    if (aksi === "ajukan") {
      if (isMahasiswa && !sharedData.file_ktm) {
        toast.error("Anda memilih Tarif Mahasiswa. Wajib mengunggah berkas Kartu Tanda Mahasiswa (KTM)")
        return
      }
      if (!sharedData.setuju_syarat) {
        toast.error("Anda wajib mencentang persetujuan syarat & ketentuan pengujian laboratorium")
        return
      }
    }
    onSubmit(aksi)
  }

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tahap 4: Dokumen Pendukung & Konfirmasi Akhir
            </h2>
            <p className="text-xs text-slate-500">
              Lengkapi berkas surat pengantar atau KTM, tinjau ringkasan pesanan uji, dan setujui
              pernyataan integritas.
            </p>
          </div>
        </div>
      </div>

      {/* 1. UPLOAD BERKAS PENDUKUNG */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Upload className="w-4 h-4 text-brand-600" />
          1. Unggah Surat Pengantar & Dokumen Persyaratan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* No Surat Pengantar */}
          <div>
            <Input
              label="Nomor Surat Pengantar (Opsional)"
              placeholder="Contoh: 123/EXT-QA/IX/2026"
              value={sharedData.no_surat_pengantar}
              onChange={(e) =>
                setSharedData((prev) => ({
                  ...prev,
                  no_surat_pengantar: e.target.value,
                }))
              }
            />
          </div>

          {/* Tanggal Surat Pengantar */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Tanggal Surat Pengantar (Opsional)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={sharedData.tgl_surat_pengantar}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    tgl_surat_pengantar: e.target.value,
                  }))
                }
                className="w-full bg-white text-slate-900 text-xs rounded-lg border border-slate-300 pl-10 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* File Surat Pengantar */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Unggah Berkas Surat Pengantar (PDF/Gambar, Max 5MB)
            </label>
            {sharedData.file_surat_pengantar ? (
              <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="font-bold text-slate-900 truncate">
                    {sharedData.file_surat_pengantar.name}
                  </span>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    ({(sharedData.file_surat_pengantar.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile("file_surat_pengantar")}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => suratPengantarInputRef.current?.click()}
                className="p-5 rounded-xl border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/30 cursor-pointer text-center transition-all"
              >
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-700">
                  Klik untuk memilih file Surat Pengantar
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Format didukung: PDF, PNG, JPG (Maks. 5 MB)</p>
                <input
                  ref={suratPengantarInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "file_surat_pengantar")}
                />
              </div>
            )}
          </div>

          {/* Upload KTM (Wajib jika Kategori Tarif Mahasiswa PP 54) */}
          {isMahasiswa && (
            <div className="md:col-span-2 p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 space-y-3 animate-in fade-in-50 duration-200">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Unggah Kartu Tanda Mahasiswa (KTM) Aktif <span className="text-rose-600">*</span>
                  </h4>
                  <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                    Anda memilih <strong>Tarif Mahasiswa PP 54</strong>. Lampirkan foto / scan KTM aktif
                    sebagai bukti legalitas untuk verifikasi tarif pendidikan oleh admin balai.
                  </p>
                </div>
              </div>

              {sharedData.file_ktm ? (
                <div className="p-3.5 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900 truncate">
                      {sharedData.file_ktm.name}
                    </span>
                    <span className="text-[11px] text-slate-500 shrink-0">
                      ({(sharedData.file_ktm.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile("file_ktm")}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => ktmInputRef.current?.click()}
                  className="p-5 rounded-xl border-2 border-dashed border-amber-400 bg-white hover:bg-amber-50/50 cursor-pointer text-center transition-all"
                >
                  <Upload className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-amber-900">
                    Pilih File Foto / Scan KTM Anda (Wajib)
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">Format: PDF, PNG, JPG (Maks. 5 MB)</p>
                  <input
                    ref={ktmInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "file_ktm")}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. RINGKASAN PERMOHONAN (ORDER REVIEW) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
            2. Ringkasan Formulir Pengujian Laboratorium
          </h3>
          <Badge variant="primary" size="sm">
            {samples.length} Sampel Uji
          </Badge>
        </div>

        {/* Info Grid Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Bahasa Laporan
            </span>
            <span className="font-bold text-slate-800">
              {sharedData.bahasa_laporan === "en" ? "English (Report)" : "Bahasa Indonesia (LHU)"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Kategori Tarif
            </span>
            <span className="font-bold text-slate-800">
              {isMahasiswa ? "Tarif Mahasiswa (PP 54)" : "Tarif Umum"}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Metode Bayar
            </span>
            <span className="font-bold text-slate-800 uppercase">
              {sharedData.cara_pembayaran.replace("_", " ")}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-3 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Penanggung Jawab Biaya
              </span>
              <span className="font-semibold text-slate-700">
                {sharedData.biaya_ditanggung_oleh}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Alamat Pengiriman LHU
              </span>
              <span className="font-semibold text-slate-700">
                {sharedData.laporan_dialamatkan_kepada}
              </span>
            </div>
          </div>
        </div>

        {/* Sampel & Parameter Breakdown Table */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-800">Rincian Sampel & Parameter Pengujian:</h4>
          <div className="space-y-3">
            {samples.map((s, idx) => {
              const subtotal = calculateSampleSubtotal(s, sharedData.kategori_tarif)
              return (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900">{s.nama_sampel}</span>
                      <span className="text-[11px] text-slate-500">
                        ({s.bentuk_sampel}, {s.jumlah_sampel} {s.satuan_sampel})
                      </span>
                    </div>
                    <span className="font-bold text-brand-700">{formatRupiah(subtotal)}</span>
                  </div>

                  <div className="space-y-1 pl-7">
                    {s.selected_parameters.map((p) => {
                      const rate = isMahasiswa ? p.tarif_mahasiswa : p.tarif_umum
                      return (
                        <div key={p.id} className="flex items-center justify-between text-[11px] text-slate-600">
                          <span>
                            • {p.nama} <span className="text-slate-400">({p.metode_uji})</span>
                          </span>
                          <span className="font-mono">{formatRupiah(rate)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Grand Total Banner */}
        <div className="p-4 rounded-xl bg-brand-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs text-brand-200 font-semibold block uppercase tracking-wider">
              Total Estimasi Biaya Pengujian:
            </span>
            <span className="text-xl sm:text-2xl font-black">{formatRupiah(grandTotal)}</span>
          </div>
          <Badge variant="primary" size="lg" className="bg-white/15 text-white border-white/20">
            {samples.length} Sampel Terdaftar
          </Badge>
        </div>
      </div>

      {/* 3. PERNYATAAN & INTEGRITAS */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          3. Pernyataan & Persetujuan Ketentuan Layanan
        </h3>

        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={sharedData.setuju_syarat}
            onChange={(e) =>
              setSharedData((prev) => ({
                ...prev,
                setuju_syarat: e.target.checked,
              }))
            }
            className="w-4 h-4 mt-0.5 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
          />
          <span className="text-xs text-slate-700 leading-relaxed">
            Saya menyatakan dengan sesungguhnya bahwa data dan sampel yang diserahkan adalah benar
            milik instansi/perorangan pemohon dan dalam kondisi yang layak untuk dilakukan pengujian.
            Saya bersedia mematuhi seluruh prosedur keselamatan, syarat dan ketentuan pengujian
            laboratorium BBSPJIKKP, serta melaksanakan pembayaran sesuai tarif PNBP resmi yang ditetapkan.
          </span>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="px-5 py-2.5 font-semibold text-xs"
        >
          Kembali ke Parameter Uji
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => handleTriggerSubmit("draft")}
            className="px-4 py-2.5 font-semibold text-xs"
          >
            Simpan Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            disabled={submitting || !sharedData.setuju_syarat || (isMahasiswa && !sharedData.file_ktm)}
            onClick={() => handleTriggerSubmit("ajukan")}
            leftIcon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            className="px-6 py-2.5 font-semibold text-xs shadow-xs"
          >
            {submitting ? "Sedang Mengirim..." : "Ajukan Permohonan Pengujian"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Step4TambahanKonfirmasi
