import React from "react"
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
  Save,
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
import { Button } from "../../ui/Button"
import { Badge } from "../../ui/Badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/Card"
import {
  FormField,
  TextInput,
  TextareaInput,
  DateInput,
  RadioCardGroup,
  DropzoneUploader,
  LegalStatementBox,
} from "../../forms"

interface Step4TambahanKonfirmasiProps {
  sharedData: PengujianSharedData
  setSharedData: React.Dispatch<React.SetStateAction<PengujianSharedData>>
  samples: PengujianSampleItem[]
  submitting: boolean
  onBack: () => void
  onSubmit: (aksi: "draft" | "ajukan") => void
}

export const Step4TambahanKonfirmasi: React.FC<Step4TambahanKonfirmasiProps> = ({
  sharedData,
  setSharedData,
  samples,
  submitting,
  onBack,
  onSubmit,
}) => {
  const isMahasiswa = sharedData.kategori_tarif === "mahasiswa_pp54"
  const grandTotal = calculateGrandTotal(samples, sharedData.kategori_tarif)

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
      <Card className="border-brand-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                <FileCheck className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Tambahan, Pembayaran & Konfirmasi Akhir</span>
              </CardTitle>
              <CardDescription>
                Tentukan preferensi evaluasi, kehadiran di lab, metode pembayaran, unggah berkas pendukung, dan tinjau ringkasan pesanan uji.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* 1. DATA TAMBAHAN BAPC & SAMPEL (OPSIONAL) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Tag className="w-4 h-4 text-brand-600" />
              1. Data Tambahan BAPC & Penomoran Sampel (Opsional)
            </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tanggal BAPC */}
          <div>
            <FormField label="Tanggal BAPC" helperText="Opsional">
              <DateInput
                value={sharedData.tanggal_bapc}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    tanggal_bapc: e.target.value,
                  }))
                }
              />
            </FormField>
          </div>

          {/* Nomor BAPC */}
          <div>
            <FormField label="Nomor BAPC" helperText="Opsional">
              <TextInput
                placeholder="Nomor BAPC jika ada"
                value={sharedData.no_bapc}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    no_bapc: e.target.value,
                  }))
                }
              />
            </FormField>
          </div>

          {/* Nomor Sample */}
          <div>
            <FormField label="Nomor Sample" helperText="Opsional">
              <TextInput
                placeholder="Contoh: SMPL-2026-001"
                value={sharedData.no_sample}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    no_sample: e.target.value,
                  }))
                }
              />
            </FormField>
          </div>

          {/* Merek / Kode */}
          <div>
            <FormField label="Merek / Kode" helperText="Opsional">
              <TextInput
                placeholder="Merek atau kode spesimen"
                value={sharedData.merek_kode}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    merek_kode: e.target.value,
                  }))
                }
              />
            </FormField>
          </div>
        </div>
      </div>

          {/* 2. EVALUASI KESESUAIAN & KEHADIRAN DI LABORATORIUM */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-brand-600" />
              2. Evaluasi Kesesuaian & Kehadiran di Laboratorium
            </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Permintaan Evaluasi / Pernyataan Kesesuaian */}
          <div className="space-y-3 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="text-xs font-bold text-slate-800 block">
                Permintaan Evaluasi / Pernyataan Kesesuaian <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Apakah hasil pengujian memerlukan evaluasi status kesesuaian (lulus/tidak lulus) terhadap standar acuan?
              </p>
            </div>

            <RadioCardGroup
              name="permintaan_evaluasi"
              value={sharedData.permintaan_evaluasi ? "ya" : "tidak"}
              onChange={(val) => {
                const isYa = val === "ya"
                setSharedData((prev) => ({
                  ...prev,
                  permintaan_evaluasi: isYa,
                  catatan_evaluasi: isYa ? prev.catatan_evaluasi : "",
                }))
              }}
              gridCols={2}
              options={[
                { value: "ya", title: "Ya, butuh evaluasi", description: "Perlu status kelulusan spesifikasi" },
                { value: "tidak", title: "Tidak", description: "Hanya data angka hasil uji" },
              ]}
            />

            {sharedData.permintaan_evaluasi && (
              <div className="pt-2 animate-in fade-in-50 duration-200">
                <TextareaInput
                  rows={2}
                  placeholder="Sebutkan acuan standar (Contoh: Evaluasi terhadap ambang batas SNI 06-4965-1999 Kelas A)..."
                  value={sharedData.catatan_evaluasi}
                  onChange={(e) =>
                    setSharedData((prev) => ({
                      ...prev,
                      catatan_evaluasi: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </div>

          {/* Pilihan Menyaksikan Pengujian */}
          <div className="space-y-3 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-600" />
                Pilihan Menyaksikan Pengujian <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Apakah perwakilan instansi Anda ingin hadir langsung di laboratorium saat proses pengujian berlangsung?
              </p>
            </div>

            <RadioCardGroup
              name="menyaksikan_uji"
              value={sharedData.menyaksikan_uji ? "ya" : "tidak"}
              onChange={(val) => {
                const isYa = val === "ya"
                setSharedData((prev) => ({
                  ...prev,
                  menyaksikan_uji: isYa,
                  catatan_menyaksikan: isYa ? prev.catatan_menyaksikan : "",
                }))
              }}
              gridCols={2}
              options={[
                { value: "ya", title: "Ya, ingin hadir", description: "Menyaksikan pengujian di lab" },
                { value: "tidak", title: "Tidak hadir", description: "Diserahkan sepenuhnya ke lab" },
              ]}
            />

            {sharedData.menyaksikan_uji && (
              <div className="pt-2 space-y-2 animate-in fade-in-50 duration-200">
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Wajib mematuhi SOP K3 Laboratorium BBSPJIKKP dan mengenakan APD standar balai.</span>
                </div>
                <TextareaInput
                  rows={2}
                  placeholder="Sebutkan perkiraan tanggal hadir & nama personil perwakilan yang akan datang..."
                  value={sharedData.catatan_menyaksikan}
                  onChange={(e) =>
                    setSharedData((prev) => ({
                      ...prev,
                      catatan_menyaksikan: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

          {/* 3. METODE PEMBAYARAN */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-brand-600" />
              3. Tata Cara Pembayaran PNBP
            </h3>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Pilih Metode Pembayaran <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Upload className="w-4 h-4 text-brand-600" />
              4. Unggah Surat Pengantar & Dokumen Persyaratan
            </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* No Surat Pengantar */}
          <div>
            <FormField label="Nomor Surat Pengantar" helperText="Opsional">
              <TextInput
                placeholder="Contoh: 123/EXT-QA/IX/2026"
                value={sharedData.no_surat_pengantar}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    no_surat_pengantar: e.target.value,
                  }))
                }
              />
            </FormField>
          </div>

          {/* Tanggal Surat Pengantar */}
          <div>
            <FormField label="Tanggal Surat Pengantar" helperText="Opsional">
              <DateInput
                value={sharedData.tgl_surat_pengantar}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    tgl_surat_pengantar: e.target.value,
                  }))
                }
              />
            </FormField>
          </div>

          {/* File Surat Pengantar */}
          <div className="md:col-span-2">
            <DropzoneUploader
              label="Unggah Berkas Surat Pengantar (Opsional)"
              helperText="Format dokumen: PDF, PNG, atau JPG (Maksimal 5 MB)"
              accept=".pdf,.png,.jpg,.jpeg"
              maxSizeMB={5}
              value={sharedData.file_surat_pengantar}
              onChange={(file) =>
                setSharedData((prev) => ({
                  ...prev,
                  file_surat_pengantar: file,
                }))
              }
            />
          </div>

          {/* Upload KTM (Wajib jika Kategori Tarif Mahasiswa PP 54) */}
          {isMahasiswa && (
            <div className="md:col-span-2">
              <DropzoneUploader
                label="Unggah Kartu Tanda Mahasiswa (KTM) Aktif (Wajib)"
                helperText="Lampirkan foto atau scan dokumen KTM aktif Anda sebagai bukti legalitas untuk verifikasi tarif pendidikan (Maksimal 5 MB)"
                accept=".pdf,.png,.jpg,.jpeg"
                maxSizeMB={5}
                value={sharedData.file_ktm}
                onChange={(file) =>
                  setSharedData((prev) => ({
                    ...prev,
                    file_ktm: file,
                  }))
                }
              />
            </div>
          )}
        </div>
      </div>

          {/* 5. RINGKASAN PERMOHONAN (ORDER REVIEW) */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
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

          <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
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
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 via-brand-50/25 to-white border border-slate-200/90 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">
              Total Estimasi Biaya Pengujian:
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900">{formatRupiah(grandTotal)}</span>
          </div>
          <Badge variant="primary" size="md" className="shadow-xs">
            {samples.length} Sampel Terdaftar
          </Badge>
        </div>
      </div>

          {/* 6. PERNYATAAN & INTEGRITAS */}
          <div className="pt-6 border-t border-slate-200">
            <LegalStatementBox
              checked={sharedData.setuju_syarat}
              onChange={(val) =>
                setSharedData((prev) => ({
                  ...prev,
                  setuju_syarat: val,
                }))
              }
              title="Pernyataan Keabsahan Sampel & Persetujuan Ketentuan Layanan"
              badgeText="LHU Terakreditasi KAN"
              keyPoints={[
                "Data spesifikasi dan fisik sampel yang diserahkan benar milik pemohon serta layak uji.",
                "Mematuhi prosedur keselamatan kerja (K3) dan melaksanakan pembayaran sesuai tarif PNBP resmi.",
              ]}
              legalTitle="Baca Syarat & Ketentuan Pengujian Laboratorium Lengkap"
              legalFullText={
                "Saya menyatakan dengan sesungguhnya bahwa data dan sampel yang diserahkan adalah benar milik pemohon dan dalam kondisi yang layak untuk dilakukan pengujian laboratorium. Saya bersedia mematuhi seluruh prosedur keselamatan kerja, syarat dan ketentuan pengujian laboratorium BBSPJIKKP, serta melaksanakan pembayaran sesuai tarif PNBP resmi yang berlaku sesuai peraturan perundang-undangan."
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Sticky Navigation Buttons */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={submitting}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="h-[42px] px-5 rounded-xl font-semibold text-sm"
        >
          Sebelumnya
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={submitting}
            onClick={() => handleTriggerSubmit("draft")}
            leftIcon={<Save className="w-4 h-4 text-slate-600" />}
            className="h-[42px] px-5 rounded-xl font-medium text-sm border border-slate-200 hover:bg-slate-100"
          >
            Simpan Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            disabled={submitting}
            onClick={() => handleTriggerSubmit("ajukan")}
            rightIcon={!submitting ? <Send className="w-4 h-4" /> : undefined}
            isLoading={submitting}
            className="h-[42px] px-7 rounded-xl font-semibold text-sm shadow-md shadow-brand-500/15"
          >
            {submitting ? "Mengirim..." : "Kirim Permohonan"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Step4TambahanKonfirmasi
