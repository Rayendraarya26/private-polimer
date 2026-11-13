import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import {
  FlaskConical,
  Loader2,
  ArrowLeft,
  Save,
  Send,
} from "lucide-react"
import api from "../../utils/api"
import Head from "../common/Head"
import { Button } from "../ui/Button"
import { BackButton } from "../ui/BackButton"
import { RevisionBannerCallout } from "../forms"
import {
  emptyPengujianSample,
  initialPengujianSharedData,
  PengujianSampleItem,
  PengujianSharedData,
  calculateGrandTotal,
  MasterParameterUji,
} from "../../types/pengujian"
import { formatRupiah } from "./multiPengujian/components/CostEstimationSummary"
import Step1Bahasa from "./multiPengujian/Step1Bahasa"
import Step2DataPermintaan from "./multiPengujian/Step2DataPermintaan"
import Step3ParameterUji from "./multiPengujian/Step3ParameterUji"
import Step4TambahanKonfirmasi from "./multiPengujian/Step4TambahanKonfirmasi"

const normalizeDateInput = (val?: string | null): string => {
  if (!val) return ""
  return String(val).slice(0, 10)
}

export const EditFormPengujian: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [permohonanMeta, setPermohonanMeta] = useState<any>(null)
  const [existingSuratPengantarPath, setExistingSuratPengantarPath] = useState<string | null>(null)
  const [existingKtmPath, setExistingKtmPath] = useState<string | null>(null)

  const [sharedData, setSharedData] = useState<PengujianSharedData>(initialPengujianSharedData)
  const [samples, setSamples] = useState<PengujianSampleItem[]>([emptyPengujianSample(Date.now())])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [pengujianRes, permohonanRes] = await Promise.all([
          api.get(`/eksternal/pengujian/${id}`),
          api.get(`/eksternal/permohonan/${id}`).catch(() => null),
        ])

        const data = pengujianRes?.data?.data || pengujianRes?.data?.results
        const detail =
          permohonanRes?.data?.results?.detail ||
          permohonanRes?.data?.data?.detail ||
          permohonanRes?.data?.detail ||
          permohonanRes?.data?.data

        const form = data?.form_pengujian || detail?.form_data
        if (!form) {
          toast.error("Data formulir pengujian tidak ditemukan.")
          return
        }

        setPermohonanMeta({
          no_permohonan: data?.no_permohonan || detail?.no_permohonan,
          status_workflow: data?.status_workflow || detail?.status_workflow,
          catatan_admin: detail?.catatan_admin || detail?.catatan_revisi || detail?.catatan_verifikasi,
        })

        setExistingSuratPengantarPath(form.file_surat_pengantar || null)
        setExistingKtmPath(form.file_ktm || null)

        const kategoriTarif =
          form.kategori_tarif === "mahasiswa" || form.kategori_tarif === "mahasiswa_pp54"
            ? "mahasiswa_pp54"
            : "umum"

        setSharedData({
          ...initialPengujianSharedData,
          bahasa_laporan: form.bahasa_laporan === "en" ? "en" : "id",
          tanggal_permohonan:
            normalizeDateInput(form.tanggal_permohonan || form.created_at) ||
            initialPengujianSharedData.tanggal_permohonan,
          diajukan_oleh: form.diajukan_oleh || "",
          biaya_sama_dengan_pemohon: Boolean(form.biaya_sama_dengan_pemohon ?? true),
          biaya_ditanggung_oleh: form.biaya_ditanggung_oleh || "",
          alamat_sama_dengan_pemohon: Boolean(form.alamat_sama_dengan_pemohon ?? true),
          laporan_dialamatkan_kepada: form.laporan_dialamatkan_kepada || "",
          keterangan_permintaan: form.keterangan_permintaan || "",
          kategori_tarif: kategoriTarif,
          tanggal_bapc: normalizeDateInput(form.tanggal_bapc),
          no_bapc: form.no_bapc || "",
          no_sample: form.no_sample || "",
          merek_kode: form.merek_kode || "",
          permintaan_evaluasi: Boolean(form.permintaan_evaluasi),
          catatan_evaluasi: form.catatan_evaluasi || "",
          menyaksikan_uji: Boolean(form.menyaksikan_uji),
          catatan_menyaksikan: form.catatan_menyaksikan || "",
          cara_pembayaran: form.cara_pembayaran || "transfer",
          no_surat_pengantar: form.no_surat_pengantar || "",
          tgl_surat_pengantar: normalizeDateInput(form.tgl_surat_pengantar),
          file_surat_pengantar: null,
          file_ktm: null,
          setuju_syarat: Boolean(data?.status_workflow === "REVISI"),
        })

        const rawSamples: any[] = Array.isArray(form.samples) ? form.samples : []
        if (rawSamples.length > 0) {
          const mappedSamples: PengujianSampleItem[] = rawSamples.map((s: any, idx: number) => {
            const rawParams: any[] = Array.isArray(s.parameters) ? s.parameters : []
            const selectedParameters: MasterParameterUji[] = rawParams.map((p: any, pIdx: number) => {
              const tarifVal = Number(
                p.tarif ?? (kategoriTarif === "mahasiswa_pp54" ? p.tarif_mahasiswa : p.tarif_umum) ?? 0
              )
              return {
                id: Number(p.master_parameter_id || p.id || pIdx + 1),
                komoditi_id: Number(s.master_komoditi_id || 0),
                kode: p.kode_parameter || p.kode || "",
                nama: p.nama_parameter || p.nama || "",
                metode_uji: p.metode_uji || "",
                satuan: p.satuan || "",
                tarif_umum: Number(p.tarif_umum ?? tarifVal),
                tarif_mahasiswa: Number(p.tarif_mahasiswa ?? tarifVal),
              }
            })

            return {
              id: Date.now() + idx,
              nama_sampel: s.nama_sampel || "",
              bentuk_sampel: s.bentuk_sampel || "Lembaran / Film",
              jumlah_sampel: Number(s.jumlah_sampel) || 1,
              satuan_sampel: s.satuan_sampel || "Pcs",
              no_lot_bets: s.no_lot_bets || "",
              kondisi_sampel: s.kondisi_sampel || "Baik",
              master_komoditi_id: s.master_komoditi_id ? Number(s.master_komoditi_id) : null,
              selected_parameters: selectedParameters,
              foto_sampel: null,
              catatan_khusus: s.catatan_khusus || "",
            }
          })
          setSamples(mappedSamples)
        }
      } catch (err) {
        console.error("Gagal memuat data pengujian:", err)
        toast.error("Gagal memuat data permohonan pengujian.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const validateForSubmit = (): boolean => {
    if (!samples || samples.length === 0) {
      toast.error("Minimal harus ada 1 sampel pengujian.")
      return false
    }

    for (let i = 0; i < samples.length; i++) {
      const s = samples[i]
      if (!s.nama_sampel?.trim()) {
        toast.error(`Nama sampel #${i + 1} wajib diisi.`)
        return false
      }
      if (!s.selected_parameters || s.selected_parameters.length === 0) {
        toast.error(`Harap pilih minimal 1 parameter uji untuk ${s.nama_sampel || `Sampel #${i + 1}`}.`)
        return false
      }
    }

    if (sharedData.permintaan_evaluasi && !sharedData.catatan_evaluasi.trim()) {
      toast.error("Silakan tuliskan acuan standar spesifikasi untuk evaluasi kesesuaian.")
      return false
    }

    if (sharedData.menyaksikan_uji && !sharedData.catatan_menyaksikan.trim()) {
      toast.error("Silakan tuliskan perkiraan tanggal hadir dan nama personil yang akan menyaksikan pengujian.")
      return false
    }

    if (sharedData.kategori_tarif === "mahasiswa_pp54" && !sharedData.file_ktm && !existingKtmPath) {
      toast.error("Kategori Tarif Mahasiswa wajib mengunggah berkas Kartu Tanda Mahasiswa (KTM).")
      return false
    }

    if (!sharedData.setuju_syarat) {
      toast.error("Anda wajib mencentang persetujuan syarat & ketentuan pengujian laboratorium.")
      return false
    }

    return true
  }

  const handleSubmitForm = async (aksi: "draft" | "ajukan") => {
    if (aksi === "ajukan" && !validateForSubmit()) {
      return
    }

    const grandTotal = calculateGrandTotal(samples, sharedData.kategori_tarif)
    const isRevisi = permohonanMeta?.status_workflow === "REVISI"

    const confirm = await Swal.fire({
      title:
        aksi === "draft"
          ? "Simpan Perubahan Draf?"
          : isRevisi
            ? "Kirim Perbaikan Permohonan?"
            : "Ajukan Permohonan Pengujian?",
      text:
        aksi === "draft"
          ? `Simpan perubahan draf permohonan pengujian untuk ${samples.length} sampel?`
          : `Apakah Anda yakin ingin ${
              isRevisi ? "mengirimkan perbaikan" : "mengajukan"
            } permohonan pengujian untuk ${samples.length} sampel dengan estimasi total biaya ${formatRupiah(
              grandTotal
            )}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#94a3b8",
      confirmButtonText:
        aksi === "draft"
          ? "Ya, Simpan Draf"
          : isRevisi
            ? "Ya, Kirim Perbaikan"
            : "Ya, Ajukan Permohonan",
      cancelButtonText: "Periksa Kembali",
      reverseButtons: true,
    })

    if (!confirm.isConfirmed) return

    try {
      setSubmitting(true)

      const formData = new FormData()
      formData.append("bahasa_laporan", sharedData.bahasa_laporan)
      formData.append("tanggal_permohonan", sharedData.tanggal_permohonan)
      formData.append("diajukan_oleh", sharedData.diajukan_oleh || "")
      formData.append("biaya_sama_dengan_pemohon", sharedData.biaya_sama_dengan_pemohon ? "1" : "0")
      formData.append("biaya_ditanggung_oleh", sharedData.biaya_ditanggung_oleh || "")
      formData.append("alamat_sama_dengan_pemohon", sharedData.alamat_sama_dengan_pemohon ? "1" : "0")
      formData.append("laporan_dialamatkan_kepada", sharedData.laporan_dialamatkan_kepada || "")
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

      const serializedSamples = samples.map((s, idx) => ({
        urutan: idx + 1,
        nama_sampel: s.nama_sampel,
        bentuk_sampel: s.bentuk_sampel,
        jumlah_sampel: s.jumlah_sampel,
        satuan_sampel: s.satuan_sampel,
        no_lot_bets: s.no_lot_bets || "",
        kondisi_sampel: s.kondisi_sampel,
        master_komoditi_id: s.master_komoditi_id,
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

      const endpoint =
        aksi === "draft"
          ? `/eksternal/pengujian/${id}`
          : `/eksternal/pengujian/${id}/ajukan-ulang`

      const { data: result } = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success(
        result?.message ||
          (aksi === "draft"
            ? "Perubahan draf permohonan pengujian berhasil disimpan."
            : isRevisi
              ? "Perbaikan permohonan pengujian berhasil dikirim."
              : "Permohonan pengujian berhasil diajukan.")
      )

      navigate(`/permohonan/detail/${id}`)
    } catch (err: any) {
      console.error("Gagal menyimpan perubahan pengujian:", err)
      const msg = err?.response?.data?.message || "Gagal menyimpan perubahan permohonan pengujian."
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <span className="text-xs font-medium text-slate-500">Memuat data permohonan pengujian...</span>
      </div>
    )
  }

  const isRevisi = permohonanMeta?.status_workflow === "REVISI"

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <Head
        title={`${isRevisi ? "Edit Permohonan Pengujian" : "Lanjutkan Draf Pengujian"} ${
          permohonanMeta?.no_permohonan ? `#${permohonanMeta.no_permohonan}` : ""
        }`}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Laboratorium Pengujian BBKKP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isRevisi ? "Perbarui Data Pengujian" : "Lanjutkan Draf Pengujian"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {permohonanMeta?.no_permohonan ? `No. Permohonan: ${permohonanMeta.no_permohonan} — ` : ""}
            Lakukan perbaikan data sampel, parameter uji, dan unggah ulang berkas yang diperlukan.
          </p>
        </div>

        <BackButton to="/dashboard" />
      </div>

      {/* Alert Informasi Revisi jika ada */}
      {isRevisi && (
        <RevisionBannerCallout
          catatan={
            permohonanMeta?.catatan_admin ||
            "Mohon periksa dan perbaiki data permohonan pengujian sesuai catatan verifikator sebelum mengajukan kembali."
          }
          petugas="Verifikator Laboratorium Pengujian"
        />
      )}

      {/* Seluruh Section Form (Tersusun Vertikal Seperti Form Kalibrasi) */}
      <div className="space-y-6">
        <Step1Bahasa
          sharedData={sharedData}
          setSharedData={setSharedData}
          hideActions={true}
        />

        <Step2DataPermintaan
          sharedData={sharedData}
          setSharedData={setSharedData}
          hideActions={true}
        />

        <Step3ParameterUji
          samples={samples}
          setSamples={setSamples}
          kategoriTarif={sharedData.kategori_tarif}
          setKategoriTarif={(kategori) =>
            setSharedData((prev) => ({ ...prev, kategori_tarif: kategori }))
          }
          hideActions={true}
        />

        <Step4TambahanKonfirmasi
          sharedData={sharedData}
          setSharedData={setSharedData}
          samples={samples}
          submitting={submitting}
          onSubmit={handleSubmitForm}
          existingSuratPengantarPath={existingSuratPengantarPath}
          existingKtmPath={existingKtmPath}
          hideActions={true}
        />
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/permohonan/detail/${id}`)}
          disabled={submitting}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="h-[42px] px-5 rounded-xl font-medium"
        >
          Batal
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSubmitForm("draft")}
            disabled={submitting}
            leftIcon={<Save className="w-4 h-4" />}
            className="h-[42px] px-5 rounded-xl font-medium"
          >
            Simpan Draft Perubahan
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => handleSubmitForm("ajukan")}
            disabled={submitting}
            isLoading={submitting}
            leftIcon={<Send className="w-4 h-4" />}
            className="h-[42px] px-6 rounded-xl font-semibold shadow-md shadow-brand-500/15"
          >
            {isRevisi ? "Kirimkan Perbaikan ke Petugas" : "Ajukan Permohonan"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditFormPengujian
