import React, { useRef } from "react"
import {
  FileCheck,
  Upload,
  Calendar,
  FileText,
  Building2,
  GraduationCap,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  Loader2,
  X,
  ShieldCheck,
  Eye,
  Info,
  Sparkles,
  Tag,
} from "lucide-react"
import { toast } from "react-hot-toast"
import {
  calculateGrandTotal,
  calculateSampleSubtotal,
  CaraPembayaran,
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
      if (sharedData.permintaan_evaluasi && !sharedData.catatan_evaluasi.trim()) {
        toast.error("Silakan tuliskan acuan standar spesifikasi untuk evaluasi kesesuaian")
        return
      }
      if (sharedData.menyaksikan_uji && !sharedData.catatan_menyaksikan.trim()) {
        toast.error("Silakan tuliskan perkiraan tanggal hadir dan nama personil yang akan menyaksikan pengujian")
        return
      }
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
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Step Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Tahap 4: Tambahan, Pembayaran & Konfirmasi Akhir
            </h2>
            <p className="text-xs text-slate-500">
              Tentukan preferensi evaluasi, kehadiran di lab, metode pembayaran, unggah berkas pendukung, dan tinjau ringkasan pesanan uji.
            </p>
          </div>
        </div>
      </div>

      {/* 1. DATA TAMBAHAN BAPC & SAMPEL (OPSIONAL) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Tag className="w-4 h-4 text-brand-600" />
          1. Data Tambahan BAPC & Penomoran Sampel (Opsional)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Tanggal BAPC */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Tanggal BAPC (Opsional)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={sharedData.tanggal_bapc}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    tanggal_bapc: e.target.value,
                  }))
                }
                className="w-full bg-white text-slate-900 text-xs rounded-lg border border-slate-300 pl-10 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Nomor BAPC */}
          <div>
            <Input
              label="Nomor BAPC (Opsional)"
              placeholder="Nomor BAPC jika ada"
              value={sharedData.no_bapc}
              onChange={(e) =>
                setSharedData((prev) => ({
                  ...prev,
                  no_bapc: e.target.value,
                }))
              }
            />
          </div>

          {/* Nomor Sample */}
          <div>
            <Input
              label="Nomor Sample (Opsional)"
              placeholder="Contoh: SMPL-2026-001"
              value={sharedData.no_sample}
              onChange={(e) =>
                setSharedData((prev) => ({
                  ...prev,
                  no_sample: e.target.value,
                }))
              }
            />
          </div>

          {/* Merek / Kode */}
          <div>
            <Input
              label="Merek / Kode (Opsional)"
              placeholder="Merek atau kode spesimen"
              value={sharedData.merek_kode}
              onChange={(e) =>
                setSharedData((prev) => ({
                  ...prev,
                  merek_kode: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* 2. EVALUASI KESESUAIAN & KEHADIRAN DI LABORATORIUM */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sparkles className="w-4 h-4 text-brand-600" />
          2. Evaluasi Kesesuaian & Kehadiran di Laboratorium
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Permintaan Evaluasi / Pernyataan Kesesuaian */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="text-xs font-bold text-slate-800 block">
                Permintaan Evaluasi / Pernyataan Kesesuaian <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Apakah hasil pengujian memerlukan evaluasi status kesesuaian (lulus/tidak lulus) terhadap standar acuan?
              </p>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="permintaan_evaluasi"
                  checked={sharedData.permintaan_evaluasi === true}
                  onChange={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      permintaan_evaluasi: true,
                    }))
                  }
                  className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                />
                <span>Ya, butuh evaluasi</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="permintaan_evaluasi"
                  checked={sharedData.permintaan_evaluasi === false}
                  onChange={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      permintaan_evaluasi: false,
                      catatan_evaluasi: "",
                    }))
                  }
                  className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                />
                <span>Tidak (Hanya data numerik)</span>
              </label>
            </div>

            {sharedData.permintaan_evaluasi && (
              <div className="pt-2 animate-in fade-in-50 duration-200">
                <textarea
                  rows={2}
                  placeholder="Sebutkan acuan standar (Contoh: Evaluasi terhadap ambang batas SNI 06-4965-1999 Kelas A)..."
                  value={sharedData.catatan_evaluasi}
                  onChange={(e) =>
                    setSharedData((prev) => ({
                      ...prev,
                      catatan_evaluasi: e.target.value,
                    }))
                  }
                  className="w-full text-xs rounded-lg border border-brand-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400"
                />
              </div>
            )}
          </div>

          {/* Pilihan Menyaksikan Pengujian */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-600" />
                Pilihan Menyaksikan Pengujian <span className="text-rose-500">*</span>
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Apakah perwakilan instansi Anda ingin hadir langsung di laboratorium saat proses pengujian berlangsung?
              </p>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="menyaksikan_uji"
                  checked={sharedData.menyaksikan_uji === true}
                  onChange={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      menyaksikan_uji: true,
                    }))
                  }
                  className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                />
                <span>Ya, ingin hadir</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="menyaksikan_uji"
                  checked={sharedData.menyaksikan_uji === false}
                  onChange={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      menyaksikan_uji: false,
                      catatan_menyaksikan: "",
                    }))
                  }
                  className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                />
                <span>Tidak hadir</span>
              </label>
            </div>

            {sharedData.menyaksikan_uji && (
              <div className="pt-2 space-y-2 animate-in fade-in-50 duration-200">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Wajib mematuhi SOP K3 Laboratorium BBSPJIKKP dan mengenakan APD standar balai.</span>
                </div>
                <textarea
                  rows={2}
                  placeholder="Sebutkan perkiraan tanggal hadir & nama personil perwakilan yang akan datang..."
                  value={sharedData.catatan_menyaksikan}
                  onChange={(e) =>
                    setSharedData((prev) => ({
                      ...prev,
                      catatan_menyaksikan: e.target.value,
                    }))
                  }
                  className="w-full text-xs rounded-lg border border-brand-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. METODE PEMBAYARAN */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <CreditCard className="w-4 h-4 text-brand-600" />
          3. Tata Cara Pembayaran PNBP
        </h3>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Pilih Metode Pembayaran <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "transfer" as CaraPembayaran,
                title: "Transfer BNI VA",
                desc: "Nomor Virtual Account terbit otomatis & verifikasi pembayaran real-time",
              },
              {
                id: "tunai" as CaraPembayaran,
                title: "Tunai di Loket",
                desc: "Pembayaran langsung di loket kasir PTSP BBSPJIKKP Yogyakarta",
              },
              {
                id: "dibayar_di_belakang" as CaraPembayaran,
                title: "Dibayar di Belakang",
                desc: "Khusus instansi rekanan dengan perjanjian kerja sama resmi (MoU/PKS)",
              },
            ].map((method) => {
              const isSelected = sharedData.cara_pembayaran === method.id
              return (
                <div
                  key={method.id}
                  onClick={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      cara_pembayaran: method.id,
                    }))
                  }
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-brand-50/70 border-brand-600 ring-2 ring-brand-500/10 shadow-2xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{method.title}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{method.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {sharedData.cara_pembayaran === "dibayar_di_belakang" && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 animate-in fade-in-50 duration-200 mt-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">Ketentuan Pembayaran di Belakang:</p>
                <p className="text-[11px] text-amber-800">
                  Permohonan akan diverifikasi oleh bagian Pemasaran & Kerjasama BBSPJIKKP untuk memastikan
                  keabsahan masa berlaku dokumen MoU / PKS instansi Anda sebelum pengerjaan uji dimulai.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. UNGGAH BERKAS PERSYARATAN */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Upload className="w-4 h-4 text-brand-600" />
          4. Unggah Surat Pengantar & Dokumen Persyaratan
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
              Unggah Berkas Surat Pengantar (PDF/Gambar, Maks. 5MB)
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

      {/* 5. RINGKASAN PERMOHONAN (ORDER REVIEW) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600" />
            5. Ringkasan Formulir Pengujian Laboratorium
          </h3>
          <Badge variant="primary" size="sm">
            {samples.length} Sampel Terdaftar
          </Badge>
        </div>

        {/* Info Grid Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
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
              Metode Pembayaran
            </span>
            <span className="font-bold text-slate-800 uppercase">
              {sharedData.cara_pembayaran.replace(/_/g, " ")}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Pemohon Terdaftar
              </span>
              <span className="font-semibold text-slate-800">
                {sharedData.diajukan_oleh || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Penanggung Jawab Biaya
              </span>
              <span className="font-semibold text-slate-800">
                {sharedData.biaya_ditanggung_oleh || "-"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Alamat Tujuan LHU
              </span>
              <span className="font-semibold text-slate-800">
                {sharedData.laporan_dialamatkan_kepada || "-"}
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
                            • {p.nama} <span className="text-brand-700 font-medium font-mono">({p.metode_uji})</span>
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
        <div className="p-4 rounded-xl bg-brand-900 text-white flex items-center justify-between shadow-xs">
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

      {/* 6. PERNYATAAN & INTEGRITAS */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          6. Pernyataan & Persetujuan Ketentuan Layanan
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
            milik pemohon dan dalam kondisi yang layak untuk dilakukan pengujian laboratorium.
            Saya bersedia mematuhi seluruh prosedur keselamatan, syarat dan ketentuan pengujian
            laboratorium BBSPJIKKP, serta melaksanakan pembayaran sesuai tarif PNBP resmi yang berlaku.
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
          Kembali ke Contoh Uji
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
