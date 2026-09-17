import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import {
  Languages,
  FileText,
  FlaskConical,
  FileCheck,
  Check,
  Sparkles,
} from "lucide-react"
import {
  emptyPengujianSample,
  initialPengujianSharedData,
  PengujianSampleItem,
  PengujianSharedData,
  calculateGrandTotal,
} from "../../../types/pengujian"
import { formatRupiah } from "./components/CostEstimationSummary"
import { useSubmitPengujianMutation } from "../../../hooks/queries/usePengujianQuery"
import Step1Bahasa from "./Step1Bahasa"
import Step2DataPermintaan from "./Step2DataPermintaan"
import Step3ParameterUji from "./Step3ParameterUji"
import Step4TambahanKonfirmasi from "./Step4TambahanKonfirmasi"

const STEPS = [
  {
    id: 0,
    title: "Bahasa Laporan",
    subtitle: "Pilihan LHU ID / EN",
    icon: Languages,
  },
  {
    id: 1,
    title: "Data Permintaan",
    subtitle: "Administrasi & Penagihan",
    icon: FileText,
  },
  {
    id: 2,
    title: "Parameter Uji",
    subtitle: "Multi-Sampel & Metode",
    icon: FlaskConical,
  },
  {
    id: 3,
    title: "Berkas & Konfirmasi",
    subtitle: "Surat Pengantar & Submit",
    icon: FileCheck,
  },
]

export const FormPengujianWizard: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  // Master State
  const [sharedData, setSharedData] = useState<PengujianSharedData>(initialPengujianSharedData)
  const [samples, setSamples] = useState<PengujianSampleItem[]>([
    emptyPengujianSample(Date.now()),
  ])

  // TanStack Query Mutation
  const submitMutation = useSubmitPengujianMutation()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goNext = () => {
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    scrollToTop()
  }

  const goBack = () => {
    setStep((prev) => Math.max(prev - 1, 0))
    scrollToTop()
  }

  // Handle final submission (Draft atau Ajukan)
  const handleSubmitForm = async (aksi: "draft" | "ajukan") => {
    const grandTotal = calculateGrandTotal(samples, sharedData.kategori_tarif)

    const confirm = await Swal.fire({
      title: aksi === "draft" ? "Simpan Draft Permohonan?" : "Konfirmasi Permohonan Pengujian",
      text:
        aksi === "draft"
          ? `Apakah Anda yakin ingin menyimpan draft permohonan pengujian untuk ${samples.length} sampel?`
          : `Apakah Anda yakin ingin mengajukan permohonan pengujian untuk ${samples.length} sampel dengan estimasi total biaya ${formatRupiah(
              grandTotal
            )}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: aksi === "draft" ? "Ya, Simpan Draft" : "Ya, Ajukan Permohonan",
      cancelButtonText: "Periksa Kembali",
      reverseButtons: true,
    })

    if (!confirm.isConfirmed) return

    try {
      setSubmitting(true)

      // Membentuk FormData Payload
      const formData = new FormData()
      formData.append("aksi", aksi)
      formData.append("bahasa_laporan", sharedData.bahasa_laporan)
      formData.append("tanggal_permohonan", sharedData.tanggal_permohonan)
      formData.append("diajukan_oleh", sharedData.diajukan_oleh || "")
      formData.append("biaya_sama_dengan_pemohon", sharedData.biaya_sama_dengan_pemohon ? "1" : "0")
      formData.append("biaya_ditanggung_oleh", sharedData.biaya_ditanggung_oleh)
      formData.append("alamat_sama_dengan_pemohon", sharedData.alamat_sama_dengan_pemohon ? "1" : "0")
      formData.append("laporan_dialamatkan_kepada", sharedData.laporan_dialamatkan_kepada)
      formData.append("keterangan_permintaan", sharedData.keterangan_permintaan || "")

      formData.append("kategori_tarif", sharedData.kategori_tarif)
      formData.append("cara_pembayaran", sharedData.cara_pembayaran)
      formData.append("permintaan_evaluasi", sharedData.permintaan_evaluasi ? "1" : "0")
      formData.append("catatan_evaluasi", sharedData.catatan_evaluasi || "")
      formData.append("menyaksikan_uji", sharedData.menyaksikan_uji ? "1" : "0")
      formData.append("catatan_menyaksikan", sharedData.catatan_menyaksikan || "")

      formData.append("tanggal_bapc", sharedData.tanggal_bapc || "")
      formData.append("no_bapc", sharedData.no_bapc || "")
      formData.append("no_sample", sharedData.no_sample || "")
      formData.append("merek_kode", sharedData.merek_kode || "")
      formData.append("no_surat_pengantar", sharedData.no_surat_pengantar || "")
      formData.append("tgl_surat_pengantar", sharedData.tgl_surat_pengantar || "")

      if (sharedData.file_surat_pengantar) {
        formData.append("file_surat_pengantar", sharedData.file_surat_pengantar)
      }
      if (sharedData.file_ktm) {
        formData.append("file_ktm", sharedData.file_ktm)
      }

      // Serialisasi data sampel & parameter
      const serializedSamples = samples.map((s) => ({
        nama_sampel: s.nama_sampel,
        bentuk_sampel: s.bentuk_sampel,
        jumlah_sampel: s.jumlah_sampel,
        satuan_sampel: s.satuan_sampel,
        no_lot_bets: s.no_lot_bets || "",
        kondisi_sampel: s.kondisi_sampel,
        master_komoditi_id: s.master_komoditi_id,
        parameter_ids: s.selected_parameters.map((p) => p.id),
      }))
      formData.append("samples", JSON.stringify(serializedSamples))

      // Eksekusi API Submit via TanStack Mutation
      const result = await submitMutation.mutateAsync(formData)

      await Swal.fire({
        title: aksi === "draft" ? "Draft Berhasil Disimpan!" : "Permohonan Berhasil Diajukan!",
        text:
          result?.message ||
          `Permohonan pengujian laboratorium telah berhasil ${
            aksi === "draft" ? "disimpan sebagai draft" : "dikirim ke Balai Besar"
          }.`,
        icon: "success",
        confirmButtonColor: "#059669",
        confirmButtonText: "Lihat Daftar Permohonan",
      })

      // Redirect ke riwayat permohonan atau detail
      const redirectId = result?.data?.permohonan_id || result?.data?.id
      if (redirectId) {
        navigate(`/permohonan/detail/${redirectId}`)
      } else {
        navigate("/permohonan")
      }
    } catch (err: any) {
      console.error("Submit pengujian error:", err)
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan saat memproses permohonan pengujian"
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stepper Progress Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            const isActive = step === idx
            const isDone = step > idx

            return (
              <div
                key={s.id}
                onClick={() => {
                  // Izinkan kembali ke langkah sebelumnya yang sudah dilalui
                  if (idx < step) {
                    setStep(idx)
                    scrollToTop()
                  }
                }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  idx < step ? "cursor-pointer" : ""
                } ${
                  isActive
                    ? "bg-brand-50/90 border border-brand-300 ring-2 ring-brand-500/20 shadow-2xs"
                    : isDone
                    ? "bg-emerald-50/60 border border-emerald-200"
                    : "bg-slate-50 border border-slate-200/60 opacity-60"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    isDone
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isActive
                      ? "bg-brand-600 text-white shadow-md shadow-brand-500/30"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] font-bold tracking-wider uppercase block text-slate-500">
                    Langkah {idx + 1}
                  </span>
                  <p className="text-xs font-bold text-slate-800 truncate">{s.title}</p>
                  <p className="text-[11px] text-slate-500 hidden sm:block truncate">
                    {s.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Views */}
      {step === 0 && (
        <Step1Bahasa
          sharedData={sharedData}
          setSharedData={setSharedData}
          onNext={goNext}
        />
      )}

      {step === 1 && (
        <Step2DataPermintaan
          sharedData={sharedData}
          setSharedData={setSharedData}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 2 && (
        <Step3ParameterUji
          samples={samples}
          setSamples={setSamples}
          kategoriTarif={sharedData.kategori_tarif}
          setKategoriTarif={(kategori) =>
            setSharedData((prev) => ({ ...prev, kategori_tarif: kategori }))
          }
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 3 && (
        <Step4TambahanKonfirmasi
          sharedData={sharedData}
          setSharedData={setSharedData}
          samples={samples}
          submitting={submitting}
          onBack={goBack}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  )
}

export default FormPengujianWizard
