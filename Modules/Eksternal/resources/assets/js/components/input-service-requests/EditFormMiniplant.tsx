import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import api from "../../utils/api"
import Head from "../common/Head"
import { Card, CardContent } from "../ui/Card"
import { Button } from "../ui/Button"
import { BackButton } from "../ui/BackButton"
import {
  Loader2,
  ArrowLeft,
  Send,
  Save,
  Factory,
} from "lucide-react"
import FormJenisMiniplant, { miniplantOptions } from "./multiMiniplant/FormJenisMiniplant"
import { FormDetailPermohonan, DetailPermohonanData } from "./multiMiniplant/FormDetailPermohonan"
import { FormPerlakuanMiniplant, SelectedPerlakuanItem } from "./multiMiniplant/FormPerlakuanMiniplant"
import { FormInformasiPelanggan, PelangganData } from "./multiMiniplant/FormInformasiPelanggan"
import { RevisionBannerCallout } from "../forms"

export const EditFormMiniplant: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [permohonan, setPermohonan] = useState<any>(null)

  const [selectedLayanan, setSelectedLayanan] = useState<string>("")
  const [detailPermohonan, setDetailPermohonan] = useState<DetailPermohonanData>({
    jasaDiminta: "",
    jenisBarang: "",
    jumlahBarang: "",
    perlakuanDiminta: "",
    tekananNilai: "",
    tekananSatuan: "",
    waktuNilai: "",
    waktuSatuan: "",
    temperaturNilai: "",
    temperaturSatuan: "",
  })
  const [selectedPerlakuan, setSelectedPerlakuan] = useState<Record<string, SelectedPerlakuanItem>>({})
  const [dataPelanggan, setDataPelanggan] = useState<PelangganData>({
    namaPemohon: "",
    no_telp: "",
    alamat: "",
  })
  const [setujuPernyataan, setSetujuPernyataan] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/eksternal/miniplant/${id}`)
        const formData = res?.data?.data

        if (!formData) {
          toast.error("Data permohonan miniplant tidak ditemukan.")
          return
        }

        setPermohonan(formData.permohonan || null)
        setSetujuPernyataan(Boolean(formData.setuju_pernyataan))
        setSelectedLayanan(formData.jenis_layanan_kode || "")

        setDetailPermohonan({
          jasaDiminta: formData.jasa_diminta || "",
          jenisBarang: formData.jenis_barang || "",
          jumlahBarang: formData.jumlah_barang ?? "",
          perlakuanDiminta: formData.perlakuan_diminta || "",
          tekananNilai: formData.tekanan_nilai ?? "",
          tekananSatuan: formData.tekanan_satuan || "",
          waktuNilai: formData.waktu_nilai ?? "",
          waktuSatuan: formData.waktu_satuan || "",
          temperaturNilai: formData.temperatur_nilai ?? "",
          temperaturSatuan: formData.temperatur_satuan || "",
        })

        setDataPelanggan({
          namaPemohon: formData.nama_pemohon || "",
          no_telp: formData.no_telp || "",
          alamat: formData.alamat_pemohon || "",
        })

        const rawItems = Array.isArray(formData.items) ? formData.items : []
        const mappedItems: Record<string, SelectedPerlakuanItem> = {}
        rawItems.forEach((item: any) => {
          const masterId = item.master_miniplant_id || item.masterMiniplant?.id
          if (masterId) {
            mappedItems[String(masterId)] = {
              checked: true,
              jumlah: Number(item.jumlah) || 1,
            }
          }
        })
        setSelectedPerlakuan(mappedItems)
      } catch (err: any) {
        console.error("Gagal memuat formulir miniplant:", err)
        toast.error("Gagal memuat data formulir permohonan miniplant.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  const activeOption = miniplantOptions.find((opt) => opt.value === selectedLayanan)
  const fasilitasJudul = activeOption?.title || "Jenis Layanan"

  const handleSelectLayanan = (layanan: string) => {
    if (layanan !== selectedLayanan) {
      setSelectedLayanan(layanan)
      setSelectedPerlakuan({})
    }
  }

  const validateForSubmit = (): boolean => {
    if (!selectedLayanan) {
      toast.error("Harap pilih jenis layanan miniplant terlebih dahulu.")
      return false
    }
    if (!detailPermohonan.jenisBarang?.trim()) {
      toast.error("Jenis barang/bahan wajib diisi.")
      return false
    }
    if (!detailPermohonan.jumlahBarang || Number(detailPermohonan.jumlahBarang) < 1) {
      toast.error("Jumlah barang minimal 1.")
      return false
    }
    const anyPerlakuanSelected = Object.values(selectedPerlakuan).some((p) => p.checked)
    if (!anyPerlakuanSelected) {
      toast.error("Harap pilih minimal 1 perlakuan yang diinginkan.")
      return false
    }
    if (!dataPelanggan.namaPemohon?.trim() || !dataPelanggan.no_telp?.trim() || !dataPelanggan.alamat?.trim()) {
      toast.error("Data pemohon (nama, telepon, alamat) wajib dilengkapi.")
      return false
    }
    return true
  }

  const handleSave = async (isAjukan: boolean = false) => {
    if (isAjukan) {
      if (!validateForSubmit()) return

      if (!setujuPernyataan) {
        toast.error("Anda harus menyetujui pernyataan pemohon sebelum mengajukan permohonan.")
        return
      }

      const confirmResult = await Swal.fire({
        title: permohonan?.status_workflow === "REVISI" ? "Kirimkan Perbaikan?" : "Ajukan Permohonan Miniplant?",
        text: "Pastikan seluruh data layanan miniplant dan perlakuan telah sesuai sebelum diajukan.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#0284c7",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Ya, Kirim Sekarang",
        cancelButtonText: "Periksa Kembali",
        reverseButtons: true,
      })

      if (!confirmResult.isConfirmed) return
    }

    try {
      setSubmitting(true)
      const payload = {
        aksi: isAjukan ? "ajukan" : "draft",
        jenis_layanan: selectedLayanan || "MKP",
        fasilitas: selectedLayanan || "MKP",
        detailPermohonan,
        selectedPerlakuan,
        dataPelanggan,
        setujuPernyataan: isAjukan ? true : setujuPernyataan,
      }

      const res = await api.put(`/eksternal/miniplant/${id}`, payload)

      if (res?.data?.success || res?.data?.status === "success") {
        toast.success(
          res.data.message ||
            (isAjukan ? "Permohonan miniplant berhasil diajukan!" : "Perubahan draft berhasil disimpan.")
        )
        navigate(`/permohonan/detail/${id}`)
      } else {
        toast.error(res?.data?.message || "Gagal menyimpan perubahan.")
      }
    } catch (err: any) {
      console.error("Gagal menyimpan miniplant:", err)
      const validationErrors = err?.response?.data?.errors
      if (validationErrors && typeof validationErrors === "object") {
        const firstKey = Object.keys(validationErrors)[0]
        const firstMsg = Array.isArray(validationErrors[firstKey])
          ? validationErrors[firstKey][0]
          : validationErrors[firstKey]
        toast.error(firstMsg || "Validasi data gagal.")
      } else {
        toast.error(err?.response?.data?.message || "Terjadi kesalahan saat menyimpan data.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <span className="text-xs font-medium text-slate-500">Memuat data permohonan miniplant...</span>
      </div>
    )
  }

  const isRevisi = permohonan?.status_workflow === "REVISI"

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <Head title={`Permohonan Layanan Miniplant ${permohonan?.no_permohonan ? `#${permohonan.no_permohonan}` : ""}`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Factory className="w-4 h-4" />
            <span>Layanan Miniplant BBSPJIKKP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Permohonan Layanan Miniplant
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lengkapi atau perbarui rincian permohonan layanan miniplant sebelum diajukan ke petugas.
          </p>
        </div>

        <BackButton to="/dashboard" />
      </div>

      {/* Alert Informasi Revisi jika ada */}
      {isRevisi && (
        <RevisionBannerCallout
          catatan={
            permohonan?.catatan_verifikasi ||
            permohonan?.catatan_revisi ||
            permohonan?.alasan_revisi ||
            "Mohon periksa dan perbaiki data permohonan miniplant sesuai catatan verifikator sebelum mengajukan kembali."
          }
          petugas={permohonan?.petugas_verifikasi || permohonan?.verified_by_name || "Verifikator Layanan Miniplant"}
          tanggal={permohonan?.tgl_verifikasi || permohonan?.updated_at}
        />
      )}

      <div className="space-y-6">
        <FormJenisMiniplant
          selectedLayanan={selectedLayanan}
          onSelectLayanan={handleSelectLayanan}
        />

        <FormDetailPermohonan
          formData={detailPermohonan}
          setFormData={setDetailPermohonan}
          fasilitasJudul={fasilitasJudul}
        />

        <FormPerlakuanMiniplant
          selectedLayanan={selectedLayanan}
          selectedPerlakuan={selectedPerlakuan}
          setSelectedPerlakuan={setSelectedPerlakuan}
        />

        <FormInformasiPelanggan
          formData={dataPelanggan}
          setFormData={setDataPelanggan}
        />
      </div>

      {/* Pernyataan Pemohon */}
      <Card className="border-slate-200">
        <CardContent className="pt-6 space-y-4">
          <label className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 hover:bg-slate-100/60 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={setujuPernyataan}
              onChange={(e) => setSetujuPernyataan(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 shrink-0 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                Pernyataan Keabsahan Data & Ketentuan Layanan Miniplant
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Saya menyatakan bahwa seluruh data dan rincian perlakuan yang diisi adalah benar dan siap diproses sesuai ketentuan layanan BBSPJIKKP.
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
            {isRevisi ? "Kirimkan Perbaikan ke Petugas" : "Ajukan Permohonan"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditFormMiniplant

