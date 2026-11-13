import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import api from "../../utils/api"
import Head from "../common/Head"
import { BackButton } from "../ui/BackButton"
import { Button } from "../ui/Button"
import { RevisionBannerCallout } from "../forms"
import { Loader2, ArrowLeft, Send, Save, ShieldCheck } from "lucide-react"
import {
  GrkVerifikasiFormData,
  INITIAL_DOKUMEN_ITEMS,
  INITIAL_EMISI_CATEGORIES,
} from "../../types/grk"
import { FormInformasiUmum } from "./multiGrk/verifikasi/FormInformasiUmum"
import { FormInformasiOrganisasi } from "./multiGrk/verifikasi/FormInformasiOrganisasi"
import { FormRuangLingkup } from "./multiGrk/verifikasi/FormRuangLingkup"
import { FormDokumen } from "./multiGrk/verifikasi/FormDokumen"
import { FormInformasiTambahan } from "./multiGrk/verifikasi/FormInformasiTambahan"
import { FormPernyataan } from "./multiGrk/verifikasi/FormPernyataan"

const INITIAL_FORM_DATA: GrkVerifikasiFormData = {
  merekSample: "",
  acuan: "",
  keterangan: "",
  uraianKebutuhan: "",
  namaPemilik: "",
  namaPimpinan: "",
  namaPj: "",
  jumlahFasilitas: "",
  kriteriaVerifikasi: "",
  kriteriaLainnyaText: "",
  periodeMulai: "",
  periodeSelesai: "",
  jumlahKaryawan: "",
  deskripsiAktivitas: "",
  organizationBoundary: "",
  reportingBoundary: [],
  jenisInventarisasi: [],
  jenisGasEmisi: [],
  metodologiPengumpulan: "",
  tingkatTransferData: "",
  materialitas: "",
  materialitasCustom: "",
  tingkatJaminan: "",
  emisiCategories: INITIAL_EMISI_CATEGORIES,
  useKonsultan: "",
  konsultanNama: "",
  konsultanInstitusi: "",
  isShareExternal: "",
  pihakEksternal: "",
  dokumenItems: INITIAL_DOKUMEN_ITEMS,
  pernyataanPerubahan: false,
  pernyataanPemohon: false,
}

export const EditFormGrkVerifikasi: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [permohonan, setPermohonan] = useState<any>(null)
  const [formData, setFormData] = useState<GrkVerifikasiFormData>(INITIAL_FORM_DATA)

  useEffect(() => {
    const fetchEditData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/eksternal/grk/verifikasi/${id}`)
        const data = res?.data?.data
        const detailRaw = data?.detail_permohonan || data?.detailPermohonan
        const detailObj = Array.isArray(detailRaw) ? detailRaw[0] : detailRaw
        const form = detailObj?.formable || data?.formable || data
        setPermohonan(data?.permohonan || (data?.no_permohonan ? data : null))

        if (form) {
          const rawDok = Array.isArray(form.dokumen_items)
            ? form.dokumen_items
            : Array.isArray(form.dokumenItems)
              ? form.dokumenItems
              : []
          const mappedDokumen = INITIAL_DOKUMEN_ITEMS.map((item) => {
            const found = rawDok.find(
              (d: any) => d.kode_dokumen === item.id || d.id === item.id
            )
            return found
              ? { ...item, keterangan: found.keterangan || "" }
              : item
          })

          const rawEmisi = Array.isArray(form.emisi_items)
            ? form.emisi_items
            : Array.isArray(form.emisiItems)
              ? form.emisiItems
              : []
          const mappedEmisi = rawEmisi.length > 0
            ? INITIAL_EMISI_CATEGORIES.map((cat) => ({
                ...cat,
                items: cat.items.map((sub) => {
                  const found = rawEmisi.find(
                    (e: any) => e.subkategori_code === sub.code || e.subkategori_code === sub.id
                  )
                  return found
                    ? {
                        ...sub,
                        checked: Boolean(found.is_checked),
                        sumber: found.sumber || "",
                        jumlah: found.jumlah !== null && found.jumlah !== undefined ? String(found.jumlah) : "",
                        justifikasi: found.justifikasi || "",
                      }
                    : sub
                }),
              }))
            : INITIAL_EMISI_CATEGORIES

          setFormData((prev) => ({
            ...prev,
            merekSample: form.merek_sample || form.merekSample || prev.merekSample,
            acuan: form.acuan_peraturan || form.acuan || prev.acuan,
            keterangan: form.ruang_lingkup_diajukan || form.keterangan || prev.keterangan,
            uraianKebutuhan: form.uraian_kebutuhan || form.uraianKebutuhan || prev.uraianKebutuhan,
            namaPemilik: form.nama_pemilik || form.namaPemilik || prev.namaPemilik,
            namaPimpinan: form.nama_pimpinan || form.namaPimpinan || prev.namaPimpinan,
            namaPj: form.nama_pj || form.namaPj || prev.namaPj,
            jumlahFasilitas: form.jumlah_fasilitas !== null && form.jumlah_fasilitas !== undefined ? String(form.jumlah_fasilitas) : prev.jumlahFasilitas,
            kriteriaVerifikasi: form.kriteria_verifikasi || form.kriteriaVerifikasi || prev.kriteriaVerifikasi,
            kriteriaLainnyaText: form.kriteria_lainnya || form.kriteriaLainnyaText || prev.kriteriaLainnyaText,
            periodeMulai: form.periode_mulai ? String(form.periode_mulai).slice(0, 10) : (form.periodeMulai || prev.periodeMulai),
            periodeSelesai: form.periode_selesai ? String(form.periode_selesai).slice(0, 10) : (form.periodeSelesai || prev.periodeSelesai),
            jumlahKaryawan: form.jumlah_karyawan !== null && form.jumlah_karyawan !== undefined ? String(form.jumlah_karyawan) : prev.jumlahKaryawan,
            deskripsiAktivitas: form.deskripsi_aktivitas || form.deskripsiAktivitas || prev.deskripsiAktivitas,
            organizationBoundary: form.organization_boundary || form.organizationBoundary || prev.organizationBoundary,
            reportingBoundary: Array.isArray(form.reporting_boundary) ? form.reporting_boundary : prev.reportingBoundary,
            jenisInventarisasi: Array.isArray(form.jenis_inventarisasi) ? form.jenis_inventarisasi : prev.jenisInventarisasi,
            jenisGasEmisi: Array.isArray(form.jenis_gas_emisi) ? form.jenis_gas_emisi : prev.jenisGasEmisi,
            metodologiPengumpulan: form.metodologi_pengumpulan || form.metodologiPengumpulan || prev.metodologiPengumpulan,
            tingkatTransferData: form.tingkat_transfer_data || form.tingkatTransferData || prev.tingkatTransferData,
            materialitas: form.materialitas_tipe || form.materialitas || prev.materialitas,
            materialitasCustom: form.materialitas_custom || form.materialitasCustom || prev.materialitasCustom,
            tingkatJaminan: form.tingkat_jaminan || form.tingkatJaminan || prev.tingkatJaminan,
            emisiCategories: mappedEmisi,
            useKonsultan: form.use_konsultan ? "ya" : form.use_konsultan === false ? "tidak" : prev.useKonsultan,
            konsultanNama: form.konsultan_nama || prev.konsultanNama,
            konsultanInstitusi: form.konsultan_institusi || prev.konsultanInstitusi,
            isShareExternal: form.is_share_external ? "ya" : form.is_share_external === false ? "tidak" : prev.isShareExternal,
            pihakEksternal: form.pihak_eksternal || prev.pihakEksternal,
            dokumenItems: mappedDokumen,
            pernyataanPerubahan: Boolean(form.pernyataan_perubahan),
            pernyataanPemohon: Boolean(form.pernyataan_pemohon),
          }))
        }
      } catch (err) {
        console.error("Gagal memuat data verifikasi GRK:", err)
        toast.error("Gagal memuat data permohonan verifikasi GRK.")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchEditData()
  }, [id])

  const handleSave = async (ajukan: boolean) => {
    const aksi = ajukan ? "ajukan" : "draft"

    if (ajukan) {
      if (!formData.pernyataanPerubahan || !formData.pernyataanPemohon) {
        toast.error("Harap setujui semua pernyataan sebelum mengirim permohonan.")
        return
      }

      const isRevisi = permohonan?.status_workflow === "REVISI"
      const confirmResult = await Swal.fire({
        title: isRevisi ? "Kirimkan Perbaikan Permohonan?" : "Ajukan Verifikasi GRK?",
        text: isRevisi
          ? "Permohonan yang sudah diperbaiki akan dikirim kembali ke petugas untuk diverifikasi."
          : "Pastikan seluruh data verifikasi GRK sudah lengkap dan sesuai sebelum diajukan.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: isRevisi ? "Ya, Kirim Perbaikan" : "Ya, Ajukan",
        cancelButtonText: "Batal",
        confirmButtonColor: "#0f766e",
      })
      if (!confirmResult.isConfirmed) return
    }

    try {
      setSubmitting(true)
      const payload = {
        ...formData,
        merekSample: formData.merekSample?.trim() || (aksi === "draft" ? "Draft Verifikasi GRK" : ""),
        aksi,
        is_draft: !ajukan,
      }

      const response = await api.post(`/eksternal/grk/verifikasi/${id}`, payload)

      if (response.data?.success) {
        toast.success(
          response.data?.message ||
            (ajukan
              ? "Permohonan verifikasi GRK berhasil diajukan!"
              : "Perubahan draft verifikasi GRK berhasil disimpan!")
        )
        navigate(`/permohonan/detail/${id}`)
      } else {
        toast.error(response.data?.message || "Gagal memproses permohonan verifikasi GRK.")
      }
    } catch (error: any) {
      console.error("Error updating GRK verifikasi:", error)
      const validationErrors = error?.response?.data?.errors
      if (validationErrors && typeof validationErrors === "object") {
        const firstKey = Object.keys(validationErrors)[0]
        const firstMsg = Array.isArray(validationErrors[firstKey])
          ? validationErrors[firstKey][0]
          : validationErrors[firstKey]
        toast.error(firstMsg || "Validasi data gagal.")
      } else {
        toast.error(error?.response?.data?.message || "Terjadi kesalahan saat menyimpan data.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <span className="text-xs font-medium text-slate-500">Memuat data permohonan verifikasi GRK...</span>
      </div>
    )
  }

  const isRevisi = permohonan?.status_workflow === "REVISI"

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <Head title={`Permohonan Verifikasi GRK ${permohonan?.no_permohonan ? `#${permohonan.no_permohonan}` : ""}`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Lembaga Validasi & Verifikasi (LVV BBSPJIKKP)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Permohonan Verifikasi Gas Rumah Kaca (GRK)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lengkapi atau perbarui data inventarisasi emisi GRK organisasi sebelum diajukan ke petugas.
            {permohonan?.no_permohonan ? ` (${permohonan.no_permohonan})` : ""}
          </p>
        </div>

        <BackButton to="/dashboard" />
      </div>

      {/* Banner Revisi */}
      {isRevisi && (
        <RevisionBannerCallout
          catatan={
            permohonan?.catatan_verifikasi ||
            permohonan?.catatan_revisi ||
            permohonan?.catatan_admin ||
            "Mohon periksa dan perbaiki data permohonan verifikasi GRK sesuai catatan verifikator sebelum mengajukan kembali."
          }
          petugas={permohonan?.petugas_verifikasi || permohonan?.verified_by_name || "Tim Verifikator LVV"}
          tanggal={permohonan?.tgl_verifikasi || permohonan?.updated_at}
        />
      )}

      {/* Semua Section Form */}
      <div className="space-y-6">
        <FormInformasiUmum formData={formData} setFormData={setFormData} />
        <FormInformasiOrganisasi formData={formData} setFormData={setFormData} />
        <FormRuangLingkup formData={formData} setFormData={setFormData} />
        <FormDokumen formData={formData} setFormData={setFormData} />
        <FormInformasiTambahan formData={formData} setFormData={setFormData} />
        <FormPernyataan formData={formData} setFormData={setFormData} />
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
            onClick={() => handleSave(false)}
            disabled={submitting}
            leftIcon={<Save className="w-4 h-4" />}
            className="h-[42px] px-5 rounded-xl font-medium"
          >
            Simpan Draft Perubahan
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => handleSave(true)}
            disabled={submitting}
            isLoading={submitting}
            leftIcon={<Send className="w-4 h-4" />}
            className="h-[42px] px-6 rounded-xl font-semibold shadow-md shadow-brand-500/15"
          >
            {isRevisi ? "Kirimkan Perbaikan ke Petugas" : "Ajukan Verifikasi GRK"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditFormGrkVerifikasi

