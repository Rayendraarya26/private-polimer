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
  GrkValidasiFormData,
  INITIAL_VALIDASI_FORM_DATA,
  INITIAL_DOKUMEN_ITEMS,
} from "../../types/grk"
import { FormInformasiUmum } from "./multiGrk/validasi/FormInformasiUmum"
import { FormInformasiOrganisasi } from "./multiGrk/validasi/FormInformasiOrganisasi"
import { FormRuangLingkup } from "./multiGrk/validasi/FormRuangLingkup"
import { FormDokumen } from "./multiGrk/validasi/FormDokumen"
import { FormInformasiTambahan } from "./multiGrk/validasi/FormInformasiTambahan"
import { FormPernyataan } from "./multiGrk/validasi/FormPernyataan"

export const EditFormGrkValidasi: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [permohonan, setPermohonan] = useState<any>(null)
  const [formData, setFormData] = useState<GrkValidasiFormData>(INITIAL_VALIDASI_FORM_DATA)

  useEffect(() => {
    const fetchEditData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/eksternal/grk/validasi/${id}`)
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

          setFormData((prev) => ({
            ...prev,
            merekSample: form.merek_sample || form.merekSample || prev.merekSample,
            acuan: form.acuan_peraturan || form.acuan || prev.acuan,
            keterangan: form.ruang_lingkup_diajukan || form.keterangan || prev.keterangan,
            uraianKebutuhan: form.uraian_kebutuhan || form.uraianKebutuhan || prev.uraianKebutuhan,
            namaPemilik: form.nama_pemilik || form.namaPemilik || prev.namaPemilik,
            namaPimpinan: form.nama_pimpinan || form.namaPimpinan || prev.namaPimpinan,
            namaPj: form.nama_pj || form.namaPj || prev.namaPj,
            deskripsiAktivitas: form.deskripsi_aktivitas || form.deskripsiAktivitas || prev.deskripsiAktivitas,
            batasanProyek: form.batasan_proyek || form.batasanProyek || prev.batasanProyek,
            jenisProyekGrk: Array.isArray(form.jenis_proyek_grk) ? form.jenis_proyek_grk : prev.jenisProyekGrk,
            periodeMulai: form.periode_mulai ? String(form.periode_mulai).slice(0, 10) : (form.periodeMulai || prev.periodeMulai),
            periodeSelesai: form.periode_selesai ? String(form.periode_selesai).slice(0, 10) : (form.periodeSelesai || prev.periodeSelesai),
            kriteriaVerifikasi: form.kriteria_verifikasi || form.kriteriaVerifikasi || prev.kriteriaVerifikasi,
            kriteriaLainnyaText: form.kriteria_lainnya || form.kriteriaLainnyaText || prev.kriteriaLainnyaText,
            jumlahKaryawan: form.jumlah_karyawan !== null && form.jumlah_karyawan !== undefined ? String(form.jumlah_karyawan) : prev.jumlahKaryawan,
            ssrKuantifikasi: form.ssr_kuantifikasi || form.ssrKuantifikasi || prev.ssrKuantifikasi,
            jenisGasEmisi: Array.isArray(form.jenis_gas_emisi) ? form.jenis_gas_emisi : prev.jenisGasEmisi,
            jumlahEmisiProyek: form.jumlah_emisi_proyek_kgco2e !== null && form.jumlah_emisi_proyek_kgco2e !== undefined ? String(form.jumlah_emisi_proyek_kgco2e) : (form.jumlahEmisiProyek || prev.jumlahEmisiProyek),
            jumlahEmisiBaseline: form.jumlah_emisi_baseline_kgco2e !== null && form.jumlah_emisi_baseline_kgco2e !== undefined ? String(form.jumlah_emisi_baseline_kgco2e) : (form.jumlahEmisiBaseline || prev.jumlahEmisiBaseline),
            materialitas: form.materialitas_tipe || form.materialitas || prev.materialitas,
            materialitasCustom: form.materialitas_custom || form.materialitasCustom || prev.materialitasCustom,
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
        console.error("Gagal memuat data validasi GRK:", err)
        toast.error("Gagal memuat data permohonan validasi GRK.")
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
        title: isRevisi ? "Kirimkan Perbaikan Permohonan?" : "Ajukan Validasi GRK?",
        text: isRevisi
          ? "Permohonan yang sudah diperbaiki akan dikirim kembali ke petugas untuk diverifikasi."
          : "Pastikan seluruh data validasi GRK sudah lengkap dan sesuai sebelum diajukan.",
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
        merekSample: formData.merekSample?.trim() || (aksi === "draft" ? "Draft Validasi GRK" : ""),
        aksi,
        is_draft: !ajukan,
      }

      const response = await api.post(`/eksternal/grk/validasi/${id}`, payload)

      if (response.data?.success) {
        toast.success(
          response.data?.message ||
            (ajukan
              ? "Permohonan validasi GRK berhasil diajukan!"
              : "Perubahan draft validasi GRK berhasil disimpan!")
        )
        navigate(`/permohonan/detail/${id}`)
      } else {
        toast.error(response.data?.message || "Gagal memproses permohonan validasi GRK.")
      }
    } catch (error: any) {
      console.error("Error updating GRK validasi:", error)
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
        <span className="text-xs font-medium text-slate-500">Memuat data permohonan validasi GRK...</span>
      </div>
    )
  }

  const isRevisi = permohonan?.status_workflow === "REVISI"

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <Head title={`Permohonan Validasi GRK ${permohonan?.no_permohonan ? `#${permohonan.no_permohonan}` : ""}`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Lembaga Validasi & Verifikasi (LVV BBSPJIKKP)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Permohonan Validasi Gas Rumah Kaca (GRK)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lengkapi atau perbarui data proyek validasi emisi GRK sebelum diajukan ke petugas.
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
            "Mohon periksa dan perbaiki data permohonan validasi GRK sesuai catatan verifikator sebelum mengajukan kembali."
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
            {isRevisi ? "Kirimkan Perbaikan ke Petugas" : "Ajukan Validasi GRK"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditFormGrkValidasi

