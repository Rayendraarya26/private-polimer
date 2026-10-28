import React from "react"
import {
  FileCheck,
  CreditCard,
  Upload,
  Sparkles,
  Tag,
  ArrowLeft,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Receipt,
  FileText,
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
import { DropzoneUploader, DateInput, StickyFormActions } from "../../forms"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  OptionCard,
  OptionGroup,
  inputClass,
  textareaClass,
  cx,
} from "./components/WizardUI"

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

  const paymentOptions: {
    id: CaraPembayaran
    title: string
    desc: string
    icon: React.ElementType
  }[] = [
    {
      id: "transfer",
      title: "Transfer BNI Virtual Account",
      desc: "Nomor VA terbit otomatis & verifikasi pembayaran langsung realtime.",
      icon: CreditCard,
    },
    {
      id: "tunai",
      title: "Tunai di Loket PTSP",
      desc: "Pembayaran langsung di loket kasir PTSP BBSPJIKKP Yogyakarta.",
      icon: Receipt,
    },
    {
      id: "dibayar_di_belakang",
      title: "Dibayar di Belakang (PKS / MoU)",
      desc: "Khusus instansi mitra yang memiliki perjanjian kerja sama aktif.",
      icon: Building2,
    },
  ]

  const PaymentIcon: React.FC<{ icon: React.ElementType; active: boolean }> = ({ icon: Icon, active }) => (
    <span
      className={cx(
        "w-8 h-8 rounded-md border flex items-center justify-center shrink-0 transition-colors",
        active
          ? "border-brand-500 bg-brand-50 text-brand-700"
          : "border-slate-200 bg-white text-slate-500 group-hover:border-slate-300"
      )}
    >
      <Icon className="w-4 h-4" />
    </span>
  )

  return (
    <div className="space-y-6">
      <StepPanel
        icon={FileCheck}
        title="Tambahan, Pembayaran & Konfirmasi"
        description="Periksa kembali detail permohonan, pilih metode pembayaran, dan unggah berkas pendukung."
      >
        <div className="space-y-8">
          {/* 1. DATA TAMBAHAN BAPC & SAMPEL */}
          <div>
            <SectionHeading
              title="Data BAPC & Penomoran Sampel"
              optional
              description="Jika pengujian sampel ini berkaitan dengan Berita Acara Pengambilan Contoh (BAPC)."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="input-tgl-bapc" optional>
                  Tanggal BAPC
                </FieldLabel>
                <DateInput
                  id="input-tgl-bapc"
                  className="h-10 text-sm rounded-lg focus:ring-0 focus:border-brand-600 shadow-none"
                  value={sharedData.tanggal_bapc}
                  onChange={(e) =>
                    setSharedData((prev) => ({
                      ...prev,
                      tanggal_bapc: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <FieldLabel htmlFor="input-no-bapc" optional>
                  Nomor BAPC
                </FieldLabel>
                <input
                  id="input-no-bapc"
                  type="text"
                  className={inputClass}
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

              <div>
                <FieldLabel htmlFor="input-no-sample" optional>
                  Nomor Sampel
                </FieldLabel>
                <input
                  id="input-no-sample"
                  type="text"
                  className={inputClass}
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

              <div>
                <FieldLabel htmlFor="input-merek-kode" optional>
                  Merek / Kode
                </FieldLabel>
                <input
                  id="input-merek-kode"
                  type="text"
                  className={inputClass}
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

          {/* 2. EVALUASI KESESUAIAN & KEHADIRAN */}
          <div className="pt-6 border-t border-slate-200">
            <SectionHeading
              title="Evaluasi Kesesuaian & Kehadiran"
              required
              description="Preferensi evaluasi terhadap standar serta kehadiran menyaksikan pengujian di laboratorium."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Evaluasi */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4 shadow-none flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="min-h-[46px]">
                    <h4 className="text-sm font-bold text-slate-900">
                      Permintaan Evaluasi / Kesesuaian <span className="text-rose-500">*</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Pernyataan kesesuaian (lulus/tidak lulus) terhadap standar acuan spesifikasi.
                    </p>
                  </div>

                  <OptionGroup label="Permintaan Evaluasi" cols={1}>
                    <OptionCard
                      compact
                      selected={sharedData.permintaan_evaluasi}
                      onSelect={() =>
                        setSharedData((prev) => ({
                          ...prev,
                          permintaan_evaluasi: true,
                        }))
                      }
                      title="Ya, butuh evaluasi kesesuaian"
                      description="Disertai status kelulusan spesifikasi standar acuan"
                    />
                    <OptionCard
                      compact
                      selected={!sharedData.permintaan_evaluasi}
                      onSelect={() =>
                        setSharedData((prev) => ({
                          ...prev,
                          permintaan_evaluasi: false,
                          catatan_evaluasi: "",
                        }))
                      }
                      title="Tidak butuh evaluasi"
                      description="Hanya cantumkan data numerik hasil uji laboratorium"
                    />
                  </OptionGroup>
                </div>

                {sharedData.permintaan_evaluasi && (
                  <div className="pt-3 border-t border-slate-200 animate-[wizardFadeUp_.25s_ease-out] space-y-1.5">
                    <FieldLabel htmlFor="input-catatan-evaluasi" required>
                      Acuan Standar Evaluasi
                    </FieldLabel>
                    <textarea
                      id="input-catatan-evaluasi"
                      rows={2}
                      className={textareaClass}
                      placeholder="Sebutkan acuan standar (misal: SNI 06-4965-1999 Kelas A)..."
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

              {/* Menyaksikan */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4 shadow-none flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="min-h-[46px]">
                    <h4 className="text-sm font-bold text-slate-900">
                      Menyaksikan Pengujian di Lab <span className="text-rose-500">*</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Kehadiran perwakilan instansi langsung saat proses pengujian di laboratorium.
                    </p>
                  </div>

                  <OptionGroup label="Menyaksikan Pengujian" cols={1}>
                    <OptionCard
                      compact
                      selected={sharedData.menyaksikan_uji}
                      onSelect={() =>
                        setSharedData((prev) => ({
                          ...prev,
                          menyaksikan_uji: true,
                        }))
                      }
                      title="Ya, ingin hadir menyaksikan"
                      description="Hadir langsung di laboratorium BBSPJIKKP"
                    />
                    <OptionCard
                      compact
                      selected={!sharedData.menyaksikan_uji}
                      onSelect={() =>
                        setSharedData((prev) => ({
                          ...prev,
                          menyaksikan_uji: false,
                          catatan_menyaksikan: "",
                        }))
                      }
                      title="Tidak hadir menyaksikan"
                      description="Proses pengujian diserahkan sepenuhnya ke lab"
                    />
                  </OptionGroup>
                </div>

                {sharedData.menyaksikan_uji && (
                  <div className="pt-3 border-t border-slate-200 animate-[wizardFadeUp_.25s_ease-out] space-y-2">
                    <FieldLabel htmlFor="input-catatan-menyaksikan" required>
                      Perkiraan Tanggal & Nama Personil
                    </FieldLabel>
                    <textarea
                      id="input-catatan-menyaksikan"
                      rows={2}
                      className={textareaClass}
                      placeholder="Perkiraan tanggal hadir & nama personil perwakilan..."
                      value={sharedData.catatan_menyaksikan}
                      onChange={(e) =>
                        setSharedData((prev) => ({
                          ...prev,
                          catatan_menyaksikan: e.target.value,
                        }))
                      }
                    />
                    <FieldHint>Wajib mematuhi SOP K3 dan APD yang berlaku di laboratorium.</FieldHint>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. METODE PEMBAYARAN */}
          <div className="pt-6 border-t border-slate-200">
            <SectionHeading
              title="Tata Cara Pembayaran PNBP"
              required
              description="Pilih kanal pembayaran tarif resmi Penerimaan Negara Bukan Pajak."
            />

            <OptionGroup label="Metode Pembayaran" cols={2}>
              {paymentOptions.map((opt) => (
                <OptionCard
                  key={opt.id}
                  id={`opsi-bayar-${opt.id}`}
                  compact
                  selected={sharedData.cara_pembayaran === opt.id}
                  onSelect={() =>
                    setSharedData((prev) => ({
                      ...prev,
                      cara_pembayaran: opt.id,
                    }))
                  }
                  leading={<PaymentIcon icon={opt.icon} active={sharedData.cara_pembayaran === opt.id} />}
                  title={opt.title}
                  description={opt.desc}
                />
              ))}
            </OptionGroup>

            {sharedData.cara_pembayaran === "dibayar_di_belakang" && (
              <div className="mt-3.5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-900 animate-[wizardFadeUp_.25s_ease-out] shadow-none">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">Ketentuan Pembayaran di Belakang:</p>
                  <p className="text-amber-800 leading-relaxed">
                    Permohonan akan diverifikasi oleh Tim Pemasaran & Kerjasama BBSPJIKKP untuk memastikan
                    keaktifan dokumen kerja sama (PKS/MoU) instansi Anda sebelum pengujian diproses.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 4. BERKAS PENDUKUNG */}
          <div className="pt-6 border-t border-slate-200">
            <SectionHeading
              title="Surat Pengantar & Berkas Pendukung"
              description="Lampirkan berkas surat permohonan atau dokumen pendukung pengujian."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <FieldLabel htmlFor="input-no-surat" optional>
                  Nomor Surat Pengantar
                </FieldLabel>
                <input
                  id="input-no-surat"
                  type="text"
                  className={inputClass}
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

              <div>
                <FieldLabel htmlFor="input-tgl-surat" optional>
                  Tanggal Surat Pengantar
                </FieldLabel>
                <DateInput
                  id="input-tgl-surat"
                  className="h-10 text-sm rounded-lg focus:ring-0 focus:border-brand-600 shadow-none"
                  value={sharedData.tgl_surat_pengantar}
                  onChange={(e) =>
                    setSharedData((prev) => ({
                      ...prev,
                      tgl_surat_pengantar: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <FieldLabel optional>Berkas Surat Pengantar</FieldLabel>
                <DropzoneUploader
                  label="Pilih atau tarik berkas surat pengantar di sini"
                  helperText="Format didukung: PDF, PNG, JPG (Maksimal 5 MB)"
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

              {isMahasiswa && (
                <div className="pt-3 border-t border-slate-100 animate-[wizardFadeUp_.25s_ease-out]">
                  <FieldLabel required>
                    Kartu Tanda Mahasiswa (KTM) Aktif
                  </FieldLabel>
                  <DropzoneUploader
                    label="Unggah scan / foto Kartu Tanda Mahasiswa (KTM)"
                    helperText="Wajib untuk verifikasi tarif pendidikan penelitian mahasiswa (Maksimal 5 MB)"
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

          {/* 5. RINGKASAN PERMOHONAN */}
          <div className="pt-6 border-t border-slate-200">
            <SectionHeading
              title="Ringkasan Formulir Pengujian Laboratorium"
              description="Tinjauan menyeluruh sebelum permohonan resmi dikirimkan."
              action={
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  {samples.length} Sampel Terdaftar
                </span>
              }
            />

            {/* Info Grid Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs mb-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Bahasa Laporan
                </span>
                <span className="font-bold text-slate-800">
                  {sharedData.bahasa_laporan === "en" ? "English (Report)" : "Bahasa Indonesia (LHU)"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Kategori Tarif
                </span>
                <span className="font-bold text-slate-800">
                  {isMahasiswa ? "Tarif Mahasiswa (PP 54)" : "Tarif Umum"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                  Metode Pembayaran
                </span>
                <span className="font-bold text-slate-800 uppercase">
                  {sharedData.cara_pembayaran.replace(/_/g, " ")}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
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

            {/* Breakdown sampel */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Rincian Sampel & Parameter ({samples.length} sampel)
              </p>
              <div className="space-y-3">
                {samples.map((s, idx) => {
                  const subtotal = calculateSampleSubtotal(s, sharedData.kategori_tarif)
                  return (
                    <div
                      key={s.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 text-[13px] space-y-2.5 shadow-none"
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-md bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-900 truncate">
                            {s.nama_sampel || `Sampel ${idx + 1}`}
                          </span>
                          <span className="text-xs text-slate-500 hidden sm:inline">
                            · {s.jumlah_sampel} {s.satuan_sampel} ({s.bentuk_sampel})
                          </span>
                        </div>
                        <span className="font-bold text-brand-700 text-sm shrink-0">
                          {formatRupiah(subtotal)}
                        </span>
                      </div>

                      <div className="space-y-1 pl-8">
                        {s.selected_parameters.map((p) => {
                          const rate = isMahasiswa ? p.tarif_mahasiswa : p.tarif_umum
                          return (
                            <div
                              key={p.id}
                              className="flex items-center justify-between gap-3 text-xs text-slate-600"
                            >
                              <span className="truncate">
                                • {p.nama} <span className="font-mono text-slate-400">({p.metode_uji})</span>
                              </span>
                              <span className="font-medium text-slate-800 shrink-0">
                                {formatRupiah(rate)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Grand Total */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-none">
              <div>
                <span className="block text-xs font-semibold text-slate-500">Total Estimasi Biaya</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {samples.length} Sampel Terdaftar
              </span>
            </div>
          </div>

          {/* 6. PERNYATAAN INTEGRITAS */}
          <div className="pt-6 border-t border-slate-200">
            <label
              htmlFor="checkbox-setuju-syarat"
              className={cx(
                "group relative flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer select-none transition-all duration-150 shadow-none",
                sharedData.setuju_syarat
                  ? "border-2 border-brand-600 bg-white"
                  : "border border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <input
                id="checkbox-setuju-syarat"
                type="checkbox"
                checked={sharedData.setuju_syarat}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    setuju_syarat: e.target.checked,
                  }))
                }
                className="mt-0.5 w-5 h-5 rounded-md border-slate-300 text-brand-600 focus:ring-0 shrink-0 cursor-pointer"
              />
              <div className="text-xs sm:text-[13px] leading-relaxed text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">
                  Pernyataan Keabsahan Sampel & Persetujuan Layanan <span className="text-rose-500">*</span>
                </span>
                Saya menyatakan dengan sesungguhnya bahwa data dan sampel yang diserahkan adalah benar milik pemohon dan dalam kondisi layak untuk dilakukan pengujian laboratorium, bersedia mematuhi seluruh prosedur keselamatan kerja (K3), serta menyelesaikan pembayaran sesuai tarif PNBP resmi yang berlaku.
              </div>
            </label>
          </div>
        </div>
      </StepPanel>

      {/* Tombol Aksi Navigasi (Tidak Sticky Bottom) */}
      <StickyFormActions
        canGoBack={true}
        onBack={onBack}
        onSaveDraft={() => handleTriggerSubmit("draft")}
        onSubmit={() => handleTriggerSubmit("ajukan")}
        isLastStep={true}
        isSubmitting={submitting}
        isSticky={false}
      />
    </div>
  )
}

export default Step4TambahanKonfirmasi
