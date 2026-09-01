import React, { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import useProfile from "../../../hooks/useProfile"
import { useSertifikasi } from "../../../hooks/service-requests/useSertifikasi"
import { useSertifikasiDraft } from "../../../hooks/useSertifikasiDraft"
import {
  SertifikasiFormData,
  initialSertifikasiFormData,
} from "../../../types/sertifikasi"
import { useSertifikasiSkemaQuery, useProvincesQuery } from "../../../hooks/queries/useMasterQuery"
import Step1JenisPermohonan from "./Step1JenisPermohonan"
import Step2KategoriDanKomoditi from "./Step2KategoriDanKomoditi"
import Step3PerusahaanDanPabrik from "./Step3PerusahaanDanPabrik"
import Step4PernyataanKonfirmasi from "./Step4PernyataanKonfirmasi"
import { Layers, Package, Building2, CheckSquare, Check, Sparkles, RefreshCw, Trash2, FileEdit } from "lucide-react"

const STEPS = [
  { id: 0, title: "Jenis Permohonan", icon: Layers, desc: "Baru vs perpanjangan sertifikat" },
  { id: 1, title: "Kategori & Komoditi", icon: Package, desc: "Ruang lingkup, produk & dokumen" },
  { id: 2, title: "Kondisi Perusahaan", icon: Building2, desc: "Legalitas PT & fasilitas pabrik" },
  { id: 3, title: "Pernyataan & Kirim", icon: CheckSquare, desc: "Pakta integritas & konfirmasi" },
]

interface Props {
  skemaId?: string
}

export const FormSertifikasiWizard: React.FC<Props> = ({ skemaId }) => {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const detail = profile?.detail
  const userId = profile?.id || profile?.detail?.id || "guest"

  const { data: skemaList = [] } = useSertifikasiSkemaQuery()
  const { data: provinces = [] } = useProvincesQuery()

  const { submitting, createPermohonanSertifikasi } = useSertifikasi()
  const { existingDraft, autoSave, clearDraft, isSaving } = useSertifikasiDraft(String(userId))

  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<SertifikasiFormData>(() => {
    const init = { ...initialSertifikasiFormData }
    if (skemaId && init.pengajuan.length > 0) {
      init.pengajuan[0].skema_id = skemaId
    }
    return init
  })
  const [draftDismissed, setDraftDismissed] = useState(false)

  // Auto-save form data changes to IndexedDB
  useEffect(() => {
    // Only auto-save if user has filled at least some basic field
    if (formData.nama_perusahaan || formData.pengajuan.some(p => p.skema_id || p.items.some(i => i.nama_produk))) {
      autoSave(formData)
    }
  }, [formData, autoSave])

  // Restore Draft Action
  const handleRestoreDraft = () => {
    if (existingDraft) {
      const { draftId, updatedAt, ...rest } = existingDraft
      setFormData(rest)
      toast.success("Draf permohonan berhasil dipulihkan.")
      setDraftDismissed(true)
    }
  }

  // Discard Draft Action
  const handleDiscardDraft = async () => {
    await clearDraft()
    setDraftDismissed(true)
    toast.success("Draf lama telah dihapus.")
  }

  // Prefill from user profile if available
  useEffect(() => {
    if (!detail) return
    setFormData((prev) => ({
      ...prev,
      nama_perusahaan: prev.nama_perusahaan || detail.nama || "",
      nomor_akta_pendirian: prev.nomor_akta_pendirian || detail.no_akta_pendirian || detail.nib || "",
      nama_pemilik: prev.nama_pemilik || detail.pemilik || "",
      nama_pimpinan: prev.nama_pimpinan || detail.pimpinan || "",
      nama_wakil_manajemen: prev.nama_wakil_manajemen || detail.pj_nama || "",
      alamat_kantor: prev.alamat_kantor || detail.alamat || "",
      kontak_person: prev.kontak_person || detail.pimpinan || detail.pemilik || detail.pj_nama || "",
      no_telp: prev.no_telp || detail.telepon || "",
      no_whatsapp: prev.no_whatsapp || detail.whatsapp || detail.pj_whatsapp || "",
      email: prev.email || detail.surel || profile?.email || "",
    }))
  }, [detail, profile])

  // Step 1 Validation (Jenis Permohonan)
  const validateStep0 = () => {
    for (let i = 0; i < formData.pengajuan.length; i++) {
      const p = formData.pengajuan[i]
      if (!p.jenis_pengajuan) {
        toast.error(`Pengajuan #${i + 1}: Pilih jenis permohonan (Baru / Perpanjangan).`)
        return false
      }
      if (p.jenis_pengajuan === "lama" && !p.sertifikat_lama_text?.trim()) {
        toast.error(`Pengajuan #${i + 1}: Masukkan nomor / referensi sertifikat lama untuk perpanjangan.`)
        return false
      }
    }
    return true
  }

  // Step 2 Validation (Kategori, Komoditi & Dokumen)
  const validateStep1 = () => {
    for (let i = 0; i < formData.pengajuan.length; i++) {
      const p = formData.pengajuan[i]
      if (!p.skema_id) {
        toast.error(`Pengajuan #${i + 1}: Pilih ruang lingkup sertifikasi.`)
        return false
      }
      if (!p.items || p.items.length === 0) {
        toast.error(`Pengajuan #${i + 1}: Minimal harus mengisi 1 item komoditi/produk ke dalam tabel.`)
        return false
      }
      for (let j = 0; j < p.items.length; j++) {
        const item = p.items[j]
        if (!item.nama_produk?.trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Nama komoditi/produk wajib diisi.`)
          return false
        }
        if (!item.merk_dagang?.trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Merek dagang wajib diisi.`)
          return false
        }
        if (!item.tipe_jenis?.trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Tipe/jenis komoditi wajib diisi.`)
          return false
        }
        if (!item.ukuran?.trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Ukuran komoditi wajib diisi.`)
          return false
        }
        if (!item.kapasitas_produksi?.toString().trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Jumlah produksi/tahun wajib diisi.`)
          return false
        }
        if (!item.satuan_produksi?.trim()) {
          toast.error(`Pengajuan #${i + 1} - Item #${j + 1}: Satuan produksi wajib diisi.`)
          return false
        }
      }

      // Validasi dokumen persyaratan wajib
      const docList = p.dokumen_list || []
      for (const doc of docList) {
        if (doc.wajib && !doc.file && !doc.fileName && !doc.fileUrl && !doc.isFromProfile) {
          toast.error(`Pengajuan #${i + 1}: Dokumen "${doc.nama}" wajib diunggah.`)
          return false
        }
      }
    }
    return true
  }

  // Step 3 Validation (Perusahaan & Pabrik)
  const validateStep2 = () => {
    // 1. Data Perusahaan
    if (!formData.nama_perusahaan?.trim()) {
      toast.error("Nama Perusahaan / Badan Usaha wajib diisi.")
      return false
    }
    if (!formData.nomor_akta_pendirian?.trim()) {
      toast.error("Nomor Akta Pendirian wajib diisi.")
      return false
    }
    if (!formData.nama_pemilik?.trim()) {
      toast.error("Nama Pemilik wajib diisi.")
      return false
    }
    if (!formData.nama_pimpinan?.trim()) {
      toast.error("Nama Pimpinan wajib diisi.")
      return false
    }
    if (!formData.nama_wakil_manajemen?.trim()) {
      toast.error("Nama Wakil Manajemen wajib diisi.")
      return false
    }
    if (!formData.no_telp?.trim()) {
      toast.error("Nomor Telepon Perusahaan wajib diisi.")
      return false
    }
    if (!formData.no_whatsapp?.trim()) {
      toast.error("Nomor HP (CP) / WhatsApp wajib diisi.")
      return false
    }
    if (!formData.email?.trim()) {
      toast.error("Email resmi perusahaan wajib diisi.")
      return false
    }
    if (!formData.badan_hukum?.trim()) {
      toast.error("Bentuk Badan Hukum wajib diisi.")
      return false
    }
    if (!formData.jenis_perusahaan?.trim()) {
      toast.error("Status Perusahaan wajib diisi.")
      return false
    }

    // 2. Lokasi Domisili
    if (!formData.negara?.trim()) {
      toast.error("Negara domisili wajib dipilih.")
      return false
    }
    if (!formData.provinsi?.trim()) {
      toast.error("Provinsi domisili wajib diisi.")
      return false
    }
    if (!formData.kabupaten?.trim()) {
      toast.error("Kabupaten / Kota domisili wajib diisi.")
      return false
    }
    if (!formData.kecamatan?.trim()) {
      toast.error("Kecamatan domisili wajib diisi.")
      return false
    }
    if (!formData.alamat_kantor?.trim()) {
      toast.error("Alamat Lengkap Kantor Pusat wajib diisi.")
      return false
    }
    if (!formData.luas_tanah?.toString().trim()) {
      toast.error("Luas Tanah domisili kantor wajib diisi.")
      return false
    }
    if (!formData.luas_bangunan?.toString().trim()) {
      toast.error("Luas Bangunan domisili kantor wajib diisi.")
      return false
    }

    // 3. Operasional & Ketenagakerjaan
    if (formData.jumlah_shift === undefined || formData.jumlah_shift === null || Number(formData.jumlah_shift) < 1) {
      toast.error("Jumlah Shift operasional dalam sehari minimal 1.")
      return false
    }
    if (formData.jumlah_bagian === undefined || formData.jumlah_bagian === null || formData.jumlah_bagian === "") {
      toast.error("Jumlah Bagian operasional wajib diisi.")
      return false
    }
    if (!formData.jumlah_karyawan_total || Number(formData.jumlah_karyawan_total) <= 0) {
      toast.error("Total Jumlah Karyawan harus lebih dari 0 orang. Silakan isi rincian karyawan.")
      return false
    }

    // 4. Data Pabrik
    if (!formData.pabrik || formData.pabrik.length === 0) {
      toast.error("Minimal harus mendaftarkan 1 lokasi fasilitas pabrik.")
      return false
    }
    for (let i = 0; i < formData.pabrik.length; i++) {
      const f = formData.pabrik[i]
      if (!f.nama_pabrik?.trim()) {
        toast.error(`Fasilitas Pabrik #${i + 1}: Nama pabrik wajib diisi.`)
        return false
      }
      if (!f.negara?.trim()) {
        toast.error(`Fasilitas Pabrik #${i + 1}: Negara pabrik wajib dipilih.`)
        return false
      }
      if (!f.alamat_pabrik?.trim()) {
        toast.error(`Fasilitas Pabrik #${i + 1}: Alamat pabrik wajib diisi.`)
        return false
      }
    }

    // 5. Berkas Gabungan
    if (!formData.file_berkas_gabungan) {
      toast.error("Upload Berkas Gabungan (Form 1, Form 2, dan Form 3) wajib diisi.")
      return false
    }

    return true
  }

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return

    setStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSubmit = useCallback(
    async (aksi: "draft" | "ajukan") => {
      if (aksi === "ajukan") {
        if (!validateStep0() || !validateStep1() || !validateStep2()) return
        if (!formData.setuju_syarat) {
          toast.error("Anda harus menyetujui pakta integritas dan ketentuan layanan.")
          return
        }

        const confirm = await Swal.fire({
          title: "Kirim Permohonan Sertifikasi?",
          text: `Total ${formData.pengajuan.length} pengajuan sertifikasi akan dikirim ke Tim Marketing Balai Besar untuk diverifikasi.`,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#0284c7",
          cancelButtonColor: "#64748b",
          confirmButtonText: "Ya, Kirim Sekarang!",
          cancelButtonText: "Periksa Kembali",
        })

        if (!confirm.isConfirmed) return
      }

      await createPermohonanSertifikasi(
        { ...formData, aksi },
        async () => {
          await clearDraft()
          Swal.fire({
            title: aksi === "ajukan" ? "Permohonan Berhasil Dikirim!" : "Draft Berhasil Disimpan!",
            text:
              aksi === "ajukan"
                ? "Permohonan sertifikasi produk & sistem Anda sedang diproses dalam antrean verifikasi."
                : "Permohonan berhasil disimpan sebagai draft di dashboard akun Anda.",
            icon: "success",
            confirmButtonColor: "#0284c7",
          }).then(() => {
            navigate("/dashboard")
          })
        }
      )
    },
    [formData, createPermohonanSertifikasi, clearDraft, navigate]
  )

  return (
    <div className="space-y-6">
      {/* Banner Pemulihan Draf Offline (IndexedDB) */}
      {existingDraft && !draftDismissed && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 via-sky-50 to-indigo-50 border border-brand-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Draf Permohonan Tersimpan Ditemukan
              </h4>
              <p className="text-[11px] text-slate-600">
                Anda memiliki draf pengisian formulir sertifikasi di peramban ini ({existingDraft.updatedAt ? new Date(existingDraft.updatedAt).toLocaleString("id-ID") : "Sebelumnya"}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              Buang Draf
            </button>
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="px-3.5 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Lanjutkan Draf
            </button>
          </div>
        </div>
      )}

      {/* Stepper Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-soft">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {STEPS.map((s, idx) => {
            const Icon = s.icon
            const isCompleted = step > idx
            const isCurrent = step === idx

            return (
              <div
                key={s.id}
                onClick={() => {
                  if (idx < step) {
                    setStep(idx)
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isCurrent
                    ? "bg-brand-50/80 border-2 border-brand-600 shadow-sm"
                    : isCompleted
                    ? "bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70"
                    : "bg-transparent border border-transparent opacity-60"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-brand-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 block uppercase">
                    Langkah {idx + 1}
                  </span>
                  <p className="text-xs font-bold text-slate-900 truncate">{s.title}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Wizard Steps Content */}
      <div className="transition-all duration-300">
        {step === 0 && (
          <Step1JenisPermohonan
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        )}

        {step === 1 && (
          <Step2KategoriDanKomoditi
            formData={formData}
            setFormData={setFormData}
            skemaList={skemaList}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 2 && (
          <Step3PerusahaanDanPabrik
            formData={formData}
            setFormData={setFormData}
            provinces={provinces}
            regencies={[]}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <Step4PernyataanKonfirmasi
            formData={formData}
            setFormData={setFormData}
            skemaList={skemaList}
            submitting={submitting}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}

export default FormSertifikasiWizard
