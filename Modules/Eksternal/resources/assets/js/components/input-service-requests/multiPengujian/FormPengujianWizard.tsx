import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import {
  Languages,
  FileText,
  FlaskConical,
  FileCheck,
  Check,
  RotateCcw,
  AlertTriangle,
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
import { Modal } from "../../ui/Modal"
import { Button } from "../../ui/Button"
import Step1Bahasa from "./Step1Bahasa"
import Step2DataPermintaan from "./Step2DataPermintaan"
import Step3ParameterUji from "./Step3ParameterUji"
import Step4TambahanKonfirmasi from "./Step4TambahanKonfirmasi"

const STORAGE_KEY = "polimer_draft_multi_pengujian"

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
  const [submitting, setSubmitting] = useState(false)
  const [showResetModal, setShowResetModal] = useState<boolean>(false)
  const [formKey, setFormKey] = useState<number>(0)

  // 1. Inisialisasi step dari localStorage jika ada draf tersimpan
  const [step, setStep] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.step === "number" && parsed.step >= 0 && parsed.step < STEPS.length) {
          return parsed.step
        }
      }
    } catch (e) {
      console.error("Error loading draft step:", e)
    }
    return 0
  })

  // 2. Inisialisasi sharedData dari localStorage
  const [sharedData, setSharedData] = useState<PengujianSharedData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.sharedData) {
          return {
            ...initialPengujianSharedData,
            ...parsed.sharedData,
            file_surat_pengantar: null,
            file_ktm: null,
          }
        }
      }
    } catch (e) {
      console.error("Error loading draft sharedData:", e)
    }
    return initialPengujianSharedData
  })

  // 3. Inisialisasi samples dari localStorage
  const [samples, setSamples] = useState<PengujianSampleItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed.samples) && parsed.samples.length > 0) {
          return parsed.samples.map((s: any) => ({
            ...s,
            foto_sampel: null,
          }))
        }
      }
    } catch (e) {
      console.error("Error loading draft samples:", e)
    }
    return [emptyPengujianSample(Date.now())]
  })

  // Helper untuk mengecek apakah form sedang terisi data draf oleh user
  const checkIsFormFilled = (
    currentStep: number,
    shared: PengujianSharedData,
    items: PengujianSampleItem[]
  ): boolean => {
    if (currentStep > 0) return true
    if (shared.bahasa_laporan !== "id") return true
    if (Boolean(shared.diajukan_oleh?.trim())) return true
    if (Boolean(shared.keterangan_permintaan?.trim())) return true
    if (shared.kategori_tarif !== "umum") return true
    if (items.length > 1) return true

    return items.some(
      (s) =>
        Boolean(s.nama_sampel?.trim()) ||
        Boolean(s.no_lot_bets?.trim()) ||
        Boolean(s.catatan_khusus?.trim()) ||
        (Array.isArray(s.selected_parameters) && s.selected_parameters.length > 0)
    )
  }

  // Status draf: true jika ada draf tersimpan di storage atau user mulai mengisi form
  const [hasDraft, setHasDraft] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (
          (typeof parsed.step === "number" && parsed.step > 0) ||
          (Array.isArray(parsed.samples) && parsed.samples.length > 1) ||
          (Array.isArray(parsed.samples) &&
            parsed.samples.some(
              (s: any) =>
                Boolean(s.nama_sampel?.trim()) ||
                (Array.isArray(s.selected_parameters) && s.selected_parameters.length > 0)
            )) ||
          Boolean(parsed.sharedData?.diajukan_oleh?.trim()) ||
          Boolean(parsed.sharedData?.keterangan_permintaan?.trim()) ||
          parsed.sharedData?.bahasa_laporan !== "id" ||
          parsed.sharedData?.kategori_tarif !== "umum"
        ) {
          return true
        }
      }
    } catch (e) {
      console.error("Error reading draft status:", e)
    }
    return false
  })

  // Aktifkan hasDraft saat data mulai diisi oleh user
  useEffect(() => {
    if (!hasDraft) {
      const isFilled = checkIsFormFilled(step, sharedData, samples)
      if (isFilled) {
        setHasDraft(true)
      }
    }
  }, [hasDraft, step, sharedData, samples])

  // Sinkronisasi otomatis ke localStorage setiap ada perubahan data
  useEffect(() => {
    try {
      if (hasDraft) {
        const { file_surat_pengantar, file_ktm, ...safeSharedData } = sharedData
        const safeSamples = samples.map(({ foto_sampel, ...s }) => s)

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            step,
            sharedData: safeSharedData,
            samples: safeSamples,
          })
        )
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error("Gagal menyimpan draf pengujian ke localStorage:", error)
    }
  }, [hasDraft, step, sharedData, samples])

  // Handler: Hapus Draf dan Reset Formulir
  const confirmResetDraft = () => {
    setShowResetModal(false)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error("Gagal menghapus draf pengujian:", e)
    }
    setSharedData({ ...initialPengujianSharedData })
    setSamples([emptyPengujianSample(Date.now())])
    setStep(0)
    setHasDraft(false)
    setFormKey((prev) => prev + 1)
    toast.success("Draf formulir pengujian berhasil direset.")
  }

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
        parameters: s.selected_parameters.map((p) => ({
          id: p.id,
          kode: p.kode,
          nama: p.nama,
          metode_uji: p.metode_uji,
          satuan: p.satuan,
          tarif: sharedData.kategori_tarif === "mahasiswa_pp54" ? p.tarif_mahasiswa : p.tarif_umum,
        })),
      }))
      formData.append("samples", JSON.stringify(serializedSamples))

      // Eksekusi API Submit via TanStack Mutation
      const result = await submitMutation.mutateAsync(formData)

      // Hapus draf di localStorage setelah permohonan berhasil dikirim/disimpan
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        console.error("Gagal membersihkan draft storage setelah submit:", e)
      }

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
    <div className="space-y-4">
      {/* Tombol Reset Draft (display: none saat tidak ada draf tersimpan) */}
      <div className={hasDraft ? "flex justify-end -mb-1" : "hidden"}>
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors cursor-pointer"
          title="Reset Seluruh Draf Formulir"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Draft</span>
        </button>
      </div>

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
      <div key={`step-contents-${formKey}`} className="space-y-6">
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

      {/* Modal Konfirmasi Reset Draf (Sesuai Tema Polimer) */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        size="sm"
        className="max-w-md p-0 overflow-hidden rounded-2xl"
      >
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200/80 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>

          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">
            Reset Draft Formulir?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            Seluruh data bahasa laporan, administrasi pemohon, contoh uji, dan parameter yang telah diisi akan dihapus dan kembali ke langkah awal.
          </p>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowResetModal(false)}
              className="flex-1 rounded-xl py-2.5 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={confirmResetDraft}
              className="flex-1 rounded-xl py-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              Ya, Reset Draft
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default FormPengujianWizard
