import React, { useEffect, useState, useMemo } from "react"
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
  Gauge,
  Toolbox,
  UserCheck,
  MapPinHouse,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import FormInformasiAlat, { AlatKalibrasiItem } from "./multiKalibrasi/FormInformasiAlat"
import FormPelaksanaanKalibrasi, { PelaksanaanKalibrasiData } from "./multiKalibrasi/FormPelaksanaanKalibrasi"
import FormInformasiPelanggan, { PelangganData } from "./multiKalibrasi/FormInformasiPelanggan"

export const EditFormKalibrasi: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [permohonan, setPermohonan] = useState<any>(null)

  const [dataAlat, setDataAlat] = useState<AlatKalibrasiItem[]>([])
  const [dataPelaksanaan, setDataPelaksanaan] = useState<PelaksanaanKalibrasiData>({
    ruangLingkupAkreditasi: "",
    lokasi: "",
    uraian: "",
    bahasa: "indonesia",
    namaKirim: "",
    alamatKirim: "",
  })
  const [dataPelanggan, setDataPelanggan] = useState<PelangganData>({
    namaPemohon: "",
    no_telp: "",
    hasilKalibrasiUntuk: "",
    alamatPemohon: "",
  })
  const [setujuPernyataan, setSetujuPernyataan] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/eksternal/kalibrasi/${id}`)
        const formData = res?.data?.data

        if (!formData) {
          toast.error("Data permohonan kalibrasi tidak ditemukan.")
          return
        }

        setPermohonan(formData.permohonan || null)
        setSetujuPernyataan(Boolean(formData.setuju_pernyataan))

        // Map Data Pelanggan
        setDataPelanggan({
          namaPemohon: formData.nama_pemohon || "",
          no_telp: formData.no_telp || "",
          hasilKalibrasiUntuk: formData.hasil_kalibrasi_untuk || "",
          alamatPemohon: formData.alamat_pemohon || "",
        })

        // Map Data Pelaksanaan
        setDataPelaksanaan({
          ruangLingkupAkreditasi: formData.ruang_lingkup_akreditasi || "",
          lokasi: formData.lokasi_pelaksanaan || "",
          uraian: formData.uraian_kalibrasi || "",
          bahasa: formData.bahasa_laporan || "indonesia",
          namaKirim: formData.nama_penerima_kirim || "",
          alamatKirim: formData.alamat_pengiriman || "",
        })

        // Map Daftar Alat
        const rawAlatList = formData.alat_list || formData.alatList || []
        const mappedAlat: AlatKalibrasiItem[] = rawAlatList.map((alat: any, idx: number) => {
          const rawSeri = alat.seri_list || alat.seriList || alat.nomor_seri_list || []
          const rawItems = alat.item_list || alat.itemList || alat.kalibrasi_items || []

          return {
            id: alat.id || `alat-${idx}`,
            namaAlat: alat.nama_alat || "",
            merk: alat.merk || "",
            tipeModel: alat.tipe_model || "",
            jumlah: Number(alat.jumlah) || 1,
            kondisi: alat.kondisi || "Baik / Normal",
            nomorSeriList: rawSeri.map((s: any) => s.nomor_seri || ""),
            kalibrasiList: rawItems.map((item: any, kIdx: number) => ({
              id: item.id || `kal-${kIdx}`,
              masterKalibrasiId: item.master_kalibrasi_id || "",
              nama: item.nama_kalibrasi_snapshot || item.master_kalibrasi?.kalibrasi || "",
              tarifSatuan: Number(item.tarif_satuan_snapshot || 0),
              jumlah: Number(item.jumlah) || 1,
            })),
          }
        })

        setDataAlat(mappedAlat)
      } catch (err: any) {
        console.error("Gagal memuat formulir kalibrasi:", err)
        toast.error("Gagal memuat data formulir permohonan kalibrasi.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  // Total Estimasi Biaya
  const totalBiaya = useMemo(() => {
    return dataAlat.reduce((acc, alat) => {
      const subtotal = (alat.kalibrasiList || []).reduce(
        (kAcc, k) => kAcc + (k.tarifSatuan || 0) * (k.jumlah || 1),
        0
      )
      return acc + subtotal
    }, 0)
  }, [dataAlat])

  const validateForSubmit = (): boolean => {
    if (!dataAlat || dataAlat.length === 0) {
      toast.error("Harap tambahkan minimal 1 alat untuk dikalibrasi.")
      setActiveTab(0)
      return false
    }

    for (let i = 0; i < dataAlat.length; i++) {
      const alat = dataAlat[i]
      if (!alat.namaAlat?.trim()) {
        toast.error(`Nama alat #${i + 1} wajib diisi.`)
        setActiveTab(0)
        return false
      }
      if (!alat.kalibrasiList || alat.kalibrasiList.length === 0) {
        toast.error(`Harap pilih minimal 1 parameter kalibrasi untuk ${alat.namaAlat || `Alat #${i + 1}`}.`)
        setActiveTab(0)
        return false
      }
    }

    if (!dataPelaksanaan.lokasi) {
      toast.error("Harap tentukan lokasi pelaksanaan kalibrasi.")
      setActiveTab(1)
      return false
    }

    if (!dataPelanggan.namaPemohon?.trim()) {
      toast.error("Nama pemohon wajib diisi.")
      setActiveTab(2)
      return false
    }

    if (!dataPelanggan.hasilKalibrasiUntuk?.trim()) {
      toast.error("Pemilik sertifikat (hasil kalibrasi untuk) wajib diisi.")
      setActiveTab(2)
      return false
    }

    if (!dataPelanggan.alamatPemohon?.trim()) {
      toast.error("Alamat pemohon wajib diisi.")
      setActiveTab(2)
      return false
    }

    return true
  }

  const handleSave = async (isAjukan: boolean = false) => {
    if (isAjukan) {
      if (!validateForSubmit()) return

      if (!setujuPernyataan) {
        toast.error("Anda harus menyetujui pernyataan keabsahan sebelum mengajukan permohonan.")
        return
      }

      const confirmResult = await Swal.fire({
        title: permohonan?.status_workflow === "REVISI" ? "Kirimkan Perbaikan?" : "Ajukan Permohonan Kalibrasi?",
        text: "Pastikan seluruh data alat dan parameter kalibrasi telah sesuai sebelum diajukan.",
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
        dataAlat,
        dataPelaksanaan,
        dataPelanggan,
        setujuPernyataan: isAjukan ? true : setujuPernyataan,
      }

      const res = await api.put(`/eksternal/kalibrasi/${id}`, payload)

      if (res?.data?.success) {
        toast.success(
          res.data.message ||
          (isAjukan ? "Permohonan kalibrasi berhasil diajukan!" : "Perubahan draft berhasil disimpan.")
        )
        navigate(`/permohonan/detail/${id}`)
      } else {
        toast.error(res?.data?.message || "Gagal menyimpan perubahan.")
      }
    } catch (err: any) {
      console.error("Gagal menyimpan kalibrasi:", err)
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
        <span className="text-xs font-medium text-slate-500">Memuat data permohonan kalibrasi...</span>
      </div>
    )
  }

  const isRevisi = permohonan?.status_workflow === "REVISI"
  const isDraft = permohonan?.status_workflow === "DRAFT"

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <Head title={`Edit Permohonan Kalibrasi #${permohonan?.no_permohonan || ""}`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-1">
            <Gauge className="w-4 h-4" />
            <span>Laboratorium Kalibrasi (LABKAL)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Perbarui Data Kalibrasi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Lakukan perbaikan data dan unggah ulang berkas persyaratan yang diminta oleh verifikator.
          </p>
        </div>

        <BackButton to="/dashboard" />
      </div>


      {/* Alert Informasi Revisi jika ada */}
      {isRevisi && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Permohonan Ini Membutuhkan Perbaikan Data</span>
            <p className="text-amber-800 leading-relaxed">
              Silakan periksa dan perbarui data instrumen, pelaksanaan, maupun informasi pemohon di bawah ini. Setelah selesai, klik tombol <strong>"Kirimkan Perbaikan"</strong> agar ditinjau kembali oleh petugas kami.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <FormInformasiPelanggan
          dataPelanggan={dataPelanggan}
          onChangePelanggan={setDataPelanggan}
        />

        <FormPelaksanaanKalibrasi
          dataPelaksanaan={dataPelaksanaan}
          onChangePelaksanaan={setDataPelaksanaan}
        />

        <FormInformasiAlat
          dataAlat={dataAlat}
          onChangeDataAlat={setDataAlat}
        />

      </div>

      {/* Pernyataan Pemohon */}
      <Card className="border-slate-200 ">
        <CardContent className="pt-6 space-y-4">
          <label className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 hover:bg-slate-100/60 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={setujuPernyataan}
              onChange={(e) => setSetujuPernyataan(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 shrink-0 cursor-pointer"
            />
            <div className="space-y-1 ">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                Pernyataan Keabsahan Data & Ketetapan Laporan Kalibrasi
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setelah laporan kalibrasi diterbitkan, pemohon tidak akan meminta diadakannya perubahan pada laporan mengenai tanda-tanda alat maupun alamat peminta kalibrasi.
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <BackButton
          to={`/permohonan/detail/${id}`}
          disabled={submitting}
        >
          Batalkan Perubahan
        </BackButton>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleSave(false)}
            disabled={submitting}
            leftIcon={<Save className="w-4 h-4" />}
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
            className="shadow-md"
          >
            {isRevisi ? "Kirimkan Perbaikan ke Petugas" : "Ajukan Kalibrasi"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditFormKalibrasi
