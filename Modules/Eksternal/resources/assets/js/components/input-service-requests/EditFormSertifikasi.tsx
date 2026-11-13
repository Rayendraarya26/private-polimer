import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import api from "../../utils/api"
import { getFileUrl } from "../../utils/fileHelpers"
import Head from "../common/Head"
import { Card, CardContent } from "../ui/Card"
import { BackButton } from "../ui/BackButton"
import { Button } from "../ui/Button"
import { RevisionBannerCallout } from "../forms"
import { Loader2, ArrowLeft, Send, Save, Building2 } from "lucide-react"
import {
  SertifikasiFormData,
  initialSertifikasiFormData,
  defaultDokumenList,
} from "../../types/sertifikasi"
import { useSertifikasiSkemaQuery, useProvincesQuery } from "../../hooks/queries/useMasterQuery"
import Step1JenisPermohonan from "./multiSertifikasi/Step1JenisPermohonan"
import Step2KategoriDanKomoditi from "./multiSertifikasi/Step2KategoriDanKomoditi"
import Step3PerusahaanDanPabrik from "./multiSertifikasi/Step3PerusahaanDanPabrik"

export const EditFormSertifikasi: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [permohonan, setPermohonan] = useState<any>(null)
  const [formData, setFormData] = useState<SertifikasiFormData>(initialSertifikasiFormData)

  const { data: skemaList = [] } = useSertifikasiSkemaQuery()
  const { data: provinces = [] } = useProvincesQuery()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/eksternal/sertifikasi/${id}`)
        const data = res?.data?.data || res?.data?.results
        const fileUrls = res?.data?.results?.file_urls || {}
        const form = data?.form
        setPermohonan(data?.permohonan || null)

        if (form) {
          const dokPendukung =
            typeof form.dokumen_pendukung_json === "object" && form.dokumen_pendukung_json !== null
              ? form.dokumen_pendukung_json
              : {}

          const mappedDokList = defaultDokumenList.map((doc) => {
            let existingUrl: string | undefined
            if (doc.id === "surat_permohonan") {
              existingUrl = fileUrls.file_surat_permohonan || getFileUrl(form.file_surat_permohonan) || undefined
            } else if (doc.id === "legalitas_perusahaan") {
              existingUrl = getFileUrl(dokPendukung.dok_akta_pendirian) || undefined
            } else if (doc.id === "nib_iui") {
              existingUrl = getFileUrl(dokPendukung.dok_nib) || undefined
            } else if (doc.id === "npwp_perusahaan") {
              existingUrl = getFileUrl(dokPendukung.dok_npwp) || undefined
            } else if (doc.id === "sertifikat_merek") {
              existingUrl = getFileUrl(dokPendukung.dok_merek) || undefined
            } else if (doc.id === "sistem_mutu") {
              existingUrl = fileUrls.file_manual_mutu || getFileUrl(form.file_manual_mutu) || undefined
            } else if (doc.id === "alur_produksi") {
              existingUrl = fileUrls.file_proses_produksi || getFileUrl(form.file_proses_produksi) || undefined
            }

            return {
              ...doc,
              file: null,
              fileUrl: existingUrl,
              fileName: existingUrl ? "Berkas tersimpan" : undefined,
            }
          })

          const isLama =
            form.jenis_pengajuan === "lama" ||
            form.tipe_pengajuan === "PERPANJANG" ||
            form.tipe_pengajuan === "PERUBAHAN" ||
            form.tipe_pengajuan === "SURVEILANS"

          const items = Array.isArray(form.komoditas_json)
            ? form.komoditas_json
            : Array.isArray(form.items)
              ? form.items
              : []

          const pabrik =
            Array.isArray(form.pabrik_json) && form.pabrik_json.length > 0
              ? form.pabrik_json
              : Array.isArray(form.pabrik) && form.pabrik.length > 0
                ? form.pabrik
                : initialSertifikasiFormData.pabrik

          setFormData({
            ...initialSertifikasiFormData,
            pengajuan: [
              {
                id: form.id || Date.now(),
                jenis_pengajuan: isLama ? "lama" : "baru",
                sertifikat_lama_id: form.referensi_sertifikasi_id || "",
                skema_id: form.lingkup_layanan_id || "",
                items,
                dokumen_list: mappedDokList,
              },
            ],
            nama_perusahaan: form.nama_perusahaan || "",
            badan_hukum: form.badan_hukum || "",
            jenis_perusahaan: form.jenis_perusahaan || "",
            jenis_perusahaan_id: form.jenis_perusahaan_id || "",
            nomor_akta_pendirian: form.nomor_akta_pendirian || "",
            nama_pemilik: form.nama_pemilik || "",
            nama_pimpinan: form.nama_pimpinan || "",
            nama_wakil_manajemen: form.nama_wakil_manajemen || "",
            alamat_kantor: form.alamat_kantor || "",
            negara: form.negara || "Indonesia",
            provinsi: form.provinsi || "",
            kabupaten: form.kabupaten || "",
            kecamatan: form.kecamatan || "",
            kode_pos: form.kode_pos || "",
            kontak_person: form.kontak_person || "",
            no_telp: form.no_telp || "",
            no_whatsapp: form.no_whatsapp || "",
            fax: form.fax || "",
            email: form.email || "",
            jumlah_karyawan_total: form.jumlah_karyawan_total ?? 0,
            jumlah_manajemen: form.jumlah_manajemen ?? 0,
            jumlah_administrasi: form.jumlah_administrasi ?? 0,
            jumlah_operasional: form.jumlah_operasional ?? 0,
            jumlah_part_time: form.jumlah_part_time ?? 0,
            jumlah_non_permanen: form.jumlah_non_permanen ?? 0,
            jumlah_shift: form.jumlah_shift ?? 1,
            jumlah_shift_1: form.jumlah_shift_1 ?? 0,
            jumlah_shift_2: form.jumlah_shift_2 ?? 0,
            jumlah_shift_3: form.jumlah_shift_3 ?? 0,
            jumlah_bagian: form.jumlah_bagian ?? 0,
            luas_tanah: form.luas_tanah ?? "",
            luas_bangunan: form.luas_bangunan ?? "",
            pabrik,
            setuju_syarat: Boolean(form.setuju_syarat ?? true),
          })
        }
      } catch (err) {
        console.error("Gagal mengambil data sertifikasi:", err)
        toast.error("Gagal memuat data permohonan sertifikasi.")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  const handleUpdate = async (ajukan: boolean = false) => {
    const primaryPengajuan = formData.pengajuan[0]

    if (ajukan) {
      if (!formData.nama_perusahaan?.trim() || !formData.alamat_kantor?.trim() || !formData.no_whatsapp?.trim()) {
        toast.error("Lengkapi nama perusahaan, alamat kantor, dan WhatsApp PIC terlebih dahulu.")
        return
      }
      if (!primaryPengajuan?.items || primaryPengajuan.items.length === 0) {
        toast.error("Tambahkan minimal satu komoditi / produk yang diajukan.")
        return
      }
      if (!formData.setuju_syarat) {
        toast.error("Centang pernyataan keabsahan data terlebih dahulu.")
        return
      }

      const isRevisi = permohonan?.status_workflow === "REVISI"
      const confirmResult = await Swal.fire({
        title: isRevisi ? "Kirimkan Perbaikan Permohonan?" : "Ajukan Permohonan Sertifikasi?",
        text: isRevisi
          ? "Permohonan yang sudah diperbaiki akan dikirim kembali ke petugas untuk diverifikasi."
          : "Pastikan data perusahaan, komoditi, pabrik, dan dokumen sertifikasi sudah sesuai sebelum diajukan.",
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
      const payload = new FormData()
      payload.append("_method", "PUT")
      payload.append("aksi", ajukan ? "ajukan" : "draft")

      if (primaryPengajuan) {
        payload.append("jenis_pengajuan", primaryPengajuan.jenis_pengajuan || "baru")
        if (primaryPengajuan.sertifikat_lama_id) {
          payload.append("referensi_sertifikasi_id", String(primaryPengajuan.sertifikat_lama_id))
        }
        if (primaryPengajuan.skema_id) {
          payload.append("lingkup_layanan_id", String(primaryPengajuan.skema_id))
        }
        payload.append("komoditas_json", JSON.stringify(primaryPengajuan.items || []))

        primaryPengajuan.dokumen_list?.forEach((doc) => {
          if (doc.file instanceof File) {
            payload.append(doc.id, doc.file)
          }
        })
      }

      const scalarFields: Array<keyof SertifikasiFormData> = [
        "nama_perusahaan",
        "badan_hukum",
        "jenis_perusahaan",
        "jenis_perusahaan_id",
        "nomor_akta_pendirian",
        "nama_pemilik",
        "nama_pimpinan",
        "nama_wakil_manajemen",
        "alamat_kantor",
        "negara",
        "provinsi",
        "kabupaten",
        "kecamatan",
        "kode_pos",
        "kontak_person",
        "no_telp",
        "no_whatsapp",
        "fax",
        "email",
        "jumlah_karyawan_total",
        "jumlah_manajemen",
        "jumlah_administrasi",
        "jumlah_operasional",
        "jumlah_part_time",
        "jumlah_non_permanen",
        "jumlah_shift",
        "jumlah_shift_1",
        "jumlah_shift_2",
        "jumlah_shift_3",
        "jumlah_bagian",
        "luas_tanah",
        "luas_bangunan",
      ]

      scalarFields.forEach((key) => {
        const val = formData[key]
        if (val !== undefined && val !== null && val !== "") {
          payload.append(String(key), String(val))
        }
      })

      payload.append("pabrik_json", JSON.stringify(formData.pabrik || []))

      const res = await api.post(`/eksternal/sertifikasi/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success(
        res?.data?.message ||
          (ajukan
            ? "Permohonan sertifikasi berhasil diajukan!"
            : "Perubahan draft sertifikasi berhasil disimpan.")
      )
      navigate(`/permohonan/detail/${id}`)
    } catch (err: any) {
      const validationErrors = err?.response?.data?.errors
      if (validationErrors && typeof validationErrors === "object") {
        const firstKey = Object.keys(validationErrors)[0]
        const firstMsg = Array.isArray(validationErrors[firstKey])
          ? validationErrors[firstKey][0]
          : validationErrors[firstKey]
        toast.error(firstMsg || "Validasi data gagal.")
      } else {
        toast.error(err?.response?.data?.message || "Gagal memperbarui data permohonan.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <span className="text-xs font-medium text-slate-500">Memuat data permohonan sertifikasi...</span>
      </div>
    )
  }

  const isRevisi = permohonan?.status_workflow === "REVISI"

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <Head title={`Permohonan Sertifikasi Industri ${permohonan?.no_permohonan ? `#${permohonan.no_permohonan}` : ""}`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Layanan Sertifikasi Industri (LSPro BBSPJIKKP)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Permohonan Sertifikasi Industri
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lengkapi atau perbarui jenis permohonan, komoditi, data perusahaan, pabrik, dan berkas persyaratan sebelum diajukan.
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
            "Mohon periksa dan perbaiki data permohonan sertifikasi sesuai catatan verifikator sebelum mengajukan kembali."
          }
          petugas={permohonan?.petugas_verifikasi || permohonan?.verified_by_name || "Tim Verifikator Sertifikasi"}
          tanggal={permohonan?.tgl_verifikasi || permohonan?.updated_at}
        />
      )}

      {/* Semua Section Form Sertifikasi */}
      <div className="space-y-6">
        <Step1JenisPermohonan
          formData={formData}
          setFormData={setFormData}
          hideActions
        />

        <Step2KategoriDanKomoditi
          formData={formData}
          setFormData={setFormData}
          skemaList={skemaList}
          hideActions
        />

        <Step3PerusahaanDanPabrik
          formData={formData}
          setFormData={setFormData}
          provinces={provinces}
          hideActions
        />
      </div>

      {/* Pernyataan Pemohon */}
      <Card className="border-slate-200">
        <CardContent className="pt-6 space-y-4">
          <label className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 hover:bg-slate-100/60 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={formData.setuju_syarat}
              onChange={(e) => setFormData((prev) => ({ ...prev, setuju_syarat: e.target.checked }))}
              className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 shrink-0 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                Pernyataan Keabsahan Data & Ketentuan Layanan Sertifikasi
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Saya menyatakan bahwa seluruh data perusahaan, komoditi, fasilitas pabrik, serta dokumen pendukung yang diisi adalah benar dan siap diproses sesuai ketentuan LSPro BBSPJIKKP.
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

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
            onClick={() => handleUpdate(false)}
            disabled={submitting}
            leftIcon={<Save className="w-4 h-4" />}
            className="h-[42px] px-5 rounded-xl font-medium"
          >
            Simpan Draft Perubahan
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => handleUpdate(true)}
            disabled={submitting}
            isLoading={submitting}
            leftIcon={<Send className="w-4 h-4" />}
            className="h-[42px] px-6 rounded-xl font-semibold shadow-md shadow-brand-500/15"
          >
            {isRevisi ? "Kirimkan Perbaikan ke Petugas" : "Ajukan Sertifikasi"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditFormSertifikasi
