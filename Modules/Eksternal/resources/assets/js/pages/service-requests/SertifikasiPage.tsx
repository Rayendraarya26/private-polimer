import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { ArrowLeft, Plus, Trash2, Send, Loader2, Clock, RefreshCw, FileText } from "lucide-react"
import Step1JenisPermohonan from "../../components/sertifikasi/JenisPermohonan"
import Step2KategoriSertifikat, { KomoditiData, DokumenPersyaratan } from "../../components/sertifikasi/KategoriSertifikat"
import Step3KondisiPerusahaan, { KondisiPerusahaanData, defaultKondisiPerusahaan } from "../../components/sertifikasi/KondisiPerusahaan"
import Step4Pernyataan from "../../components/sertifikasi/Pernyataan"
import { useSertifikasiDraft } from "../../hooks/useSertifikasiDraft"
import { useProfileQuery } from "../../hooks/queries/useProfileQuery"
import api from "../../utils/api"
import toast from "react-hot-toast"

export interface PengajuanItem {
  id: number
  jenisPermohonan: string
  sertifikatLama: string
  kategoriSertifikat: string
  komoditis?: KomoditiData[]
  komoditi?: KomoditiData
  dokumens?: DokumenPersyaratan[]
  kondisiPerusahaan: string
}

const SertifikasiPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAgreed, setIsAgreed] = useState(false)

  const { profile } = useProfileQuery()
  const userId = profile?.user_id || "guest"

  // State array untuk menampung maksimal 2 pengajuan skema sertifikasi
  const [pengajuans, setPengajuans] = useState<PengajuanItem[]>([
    {
      id: Date.now(),
      jenisPermohonan: "baru",
      sertifikatLama: "",
      kategoriSertifikat: "",
      komoditis: [],
      komoditi: {
        merek: "",
        tipe: "",
        noSni: "",
        ukuran: "",
        jumlahProduksi: 0,
        satuanProduksi: "",
        keterangan: "",
      },
      dokumens: [],
      kondisiPerusahaan: "",
    }
  ])

  // State kondisi perusahaan & ketenagakerjaan (Tingkat entitas pemohon)
  const [kondisiPerusahaan, setKondisiPerusahaan] = useState<KondisiPerusahaanData>(defaultKondisiPerusahaan)

  const addPengajuan = () => {
    if (pengajuans.length < 2) {
      setPengajuans([
        ...pengajuans,
        {
          id: Date.now(),
          jenisPermohonan: "baru",
          sertifikatLama: "",
          kategoriSertifikat: "",
          komoditis: [],
          komoditi: {
            merek: "",
            tipe: "",
            noSni: "",
            ukuran: "",
            jumlahProduksi: 0,
            satuanProduksi: "",
            keterangan: "",
          },
          dokumens: [],
          kondisiPerusahaan: "",
        }
      ])
    }
  }

  const removePengajuan = (idToRemove: number) => {
    setPengajuans(prev => prev.filter(p => p.id !== idToRemove))
  }

  const updateFormData = (idToUpdate: number, field: string, value: any) => {
    setPengajuans(prev => prev.map(p => {
      if (p.id === idToUpdate) {
        return { ...p, [field]: value }
      }
      return p
    }))
  }

  const handleNext = () => {
    // Validasi Step 1
    if (currentStep === 1) {
      const invalid = pengajuans.some(p => !p.jenisPermohonan || (p.jenisPermohonan === 'perpanjangan' && !p.sertifikatLama))
      if (invalid) {
        toast.error("Harap lengkapi jenis permohonan untuk semua pengajuan")
        return
      }
    }

    // Validasi Step 2
    if (currentStep === 2) {
      const invalid = pengajuans.some(p => !p.kategoriSertifikat || !p.komoditis || p.komoditis.length === 0)
      if (invalid) {
        toast.error("Harap pilih skema sertifikasi dan minimal 1 data komoditas")
        return
      }
    }

    // Validasi Step 3
    if (currentStep === 3) {
      if (!kondisiPerusahaan.namaPerusahaan || !kondisiPerusahaan.nomorAktaPendirian) {
        toast.error("Nama perusahaan dan nomor akta pendirian wajib diisi")
        return
      }
      if (Number(kondisiPerusahaan.jumlahKaryawanTotal) <= 0) {
        toast.error("Total karyawan harus lebih dari 0")
        return
      }
    }

    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => setCurrentStep(prev => prev - 1)

  const {
    existingDraft,
    setExistingDraft,
    isSaving,
    error,
    lastSaved,
    autoSave,
    clearDraft
  } = useSertifikasiDraft(userId)

  useEffect(() => {
    // Jangan autosave jika banner draft yang belum dipulihkan/dibuang masih aktif
    if (existingDraft) return

    autoSave({
      currentStep,
      pengajuans,
      kondisiPerusahaan,
      isAgreed
    })
  }, [currentStep, pengajuans, kondisiPerusahaan, isAgreed, autoSave, existingDraft])

  // Handler Submit Permohonan ke Backend API (Draft atau Ajukan)
  const handleSubmitPermohonan = async (aksi: 'draft' | 'ajukan' = 'ajukan') => {
    try {
      setIsSubmitting(true)
      const loadingToastId = toast.loading(aksi === 'ajukan' ? "Mengirim permohonan sertifikasi..." : "Menyimpan draf permohonan...")

      const formData = new FormData()

      formData.append("aksi", aksi)
      formData.append("setuju_pernyataan", isAgreed ? "1" : "0")

      // 1. Data Ketenagakerjaan
      formData.append("jumlah_karyawan_total", String(kondisiPerusahaan.jumlahKaryawanTotal || 1))
      formData.append("jumlah_manajemen", String(kondisiPerusahaan.jumlahManajemen || 0))
      formData.append("jumlah_administrasi", String(kondisiPerusahaan.jumlahAdministrasi || 0))
      formData.append("jumlah_operasional", String(kondisiPerusahaan.jumlahOperasional || 0))
      formData.append("jumlah_part_time", String(kondisiPerusahaan.jumlahPartTime || 0))
      formData.append("jumlah_shift_1", String(kondisiPerusahaan.jumlahShift1 || 0))
      formData.append("jumlah_shift_2", String(kondisiPerusahaan.jumlahShift2 || 0))
      formData.append("jumlah_shift_3", String(kondisiPerusahaan.jumlahShift3 || 0))
      formData.append("jumlah_non_permanen", String(kondisiPerusahaan.jumlahNonPermanen || 0))

      // 2. Data Fasilitas & Multi-Pabrik
      formData.append("luas_tanah", String(kondisiPerusahaan.luasTanah || 0))
      formData.append("luas_bangunan", String(kondisiPerusahaan.luasBangunan || 0))
      
      if (kondisiPerusahaan.pabrikList && kondisiPerusahaan.pabrikList.length > 0) {
        kondisiPerusahaan.pabrikList.forEach((pabrik, idx) => {
          formData.append(`pabrik_json[${idx}][nama_pabrik]`, pabrik.namaPabrik || "")
          formData.append(`pabrik_json[${idx}][no_telp]`, pabrik.noTelp || "")
          formData.append(`pabrik_json[${idx}][no_hp]`, pabrik.noHp || "")
          formData.append(`pabrik_json[${idx}][fax]`, pabrik.fax || "")
          formData.append(`pabrik_json[${idx}][negara]`, pabrik.negara || "Indonesia")
          formData.append(`pabrik_json[${idx}][kode_pos]`, pabrik.kodePos || "")
          formData.append(`pabrik_json[${idx}][alamat_pabrik]`, pabrik.alamatPabrik || "")
          formData.append(`pabrik_json[${idx}][jumlah_karyawan]`, String(pabrik.jumlahKaryawan || 0))
          formData.append(`pabrik_json[${idx}][kegiatan_utama]`, pabrik.kegiatanUtama || "")
          formData.append(`pabrik_json[${idx}][luas_tanah]`, String(pabrik.luasTanah || 0))
          formData.append(`pabrik_json[${idx}][luas_bangunan]`, String(pabrik.luasBangunan || 0))
        })
      }

      // 3. Array Pengajuan (Skema + Komoditas + Dokumen)
      pengajuans.forEach((pengajuan, pIdx) => {
        formData.append(`pengajuans[${pIdx}][lingkup_id]`, pengajuan.kategoriSertifikat)
        formData.append(`pengajuans[${pIdx}][jenis_pengajuan]`, pengajuan.jenisPermohonan || "baru")
        if (pengajuan.sertifikatLama) {
          formData.append(`pengajuans[${pIdx}][sertifikat_lama_nomor]`, pengajuan.sertifikatLama)
        }

        // Komoditas List
        if (pengajuan.komoditis && pengajuan.komoditis.length > 0) {
          pengajuan.komoditis.forEach((kom, kIdx) => {
            formData.append(`pengajuans[${pIdx}][komoditas][${kIdx}][merek]`, kom.merek || "")
            formData.append(`pengajuans[${pIdx}][komoditas][${kIdx}][tipe]`, kom.tipe || "")
            formData.append(`pengajuans[${pIdx}][komoditas][${kIdx}][no_sni]`, kom.noSni || "")
            formData.append(`pengajuans[${pIdx}][komoditas][${kIdx}][ukuran]`, kom.ukuran || "")
            formData.append(`pengajuans[${pIdx}][komoditas][${kIdx}][jumlah_produksi]`, String(kom.jumlahProduksi || 0))
            formData.append(`pengajuans[${pIdx}][komoditas][${kIdx}][satuan_produksi]`, kom.satuanProduksi || "Unit")
            formData.append(`pengajuans[${pIdx}][komoditas][${kIdx}][keterangan]`, kom.keterangan || "")
          })
        }

        // Berkas File Unggahan pada Step 2
        if (pengajuan.dokumens) {
          pengajuan.dokumens.forEach((dok) => {
            if (dok.file) {
              if (dok.id === "kuesioner" || dok.id === "pertanyaan_tambahan") {
                formData.append("file_kuesioner", dok.file)
              } else if (dok.id === "manual_mutu") {
                formData.append("file_manual_mutu", dok.file)
              } else if (dok.id === "proses_produksi") {
                formData.append("file_proses_produksi", dok.file)
              } else if (dok.id === "daftar_peralatan") {
                formData.append("file_daftar_peralatan", dok.file)
              } else if (dok.id === "denah_lokasi") {
                formData.append("file_denah_lokasi", dok.file)
              } else if (dok.id === "surat_permohonan") {
                formData.append("file_surat_permohonan", dok.file)
              }
            }
          })
        }
      })

      // Berkas Gabungan dari Step 3 (jika diunggah)
      if (kondisiPerusahaan.fileBerkasGabungan && !formData.has("file_surat_permohonan")) {
        formData.append("file_surat_permohonan", kondisiPerusahaan.fileBerkasGabungan)
      }

      // Kirim data ke endpoint API Backend
      const response = await api.post("/eksternal/sertifikasi", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      toast.dismiss(loadingToastId)

      if (response.data?.success) {
        toast.success(response.data.message || (aksi === 'ajukan' ? "Permohonan sertifikasi berhasil diajukan!" : "Draf permohonan berhasil disimpan!"))
        await clearDraft() // Bersihkan draft IndexedDB
        navigate("/permohonan")
      } else {
        toast.error(response.data?.message || "Gagal memproses permohonan.")
      }
    } catch (error: any) {
      console.error("Gagal mengajukan sertifikasi:", error)
      const errorMsg = error?.response?.data?.message || "Terjadi kesalahan saat memproses permohonan."
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Head title="Pengajuan Sertifikasi" />

      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pendaftaran Sertifikasi
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Kami melayani berbagai jenis sertifikasi untuk mendukung pemenuhan standar mutu dan kredibilitas perusahaan Anda.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/permohonan")}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="shrink-0"
        >
          Kembali ke Katalog
        </Button>
      </div>

      {/* Banner Pemulihan Draf */}
      {existingDraft && (
        <div className="p-4 bg-gradient-to-r from-amber-50 via-amber-50/80 to-orange-50/50 border border-amber-200/90 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shadow-xs shrink-0 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-amber-950">Draf Formulir Ditemukan</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-200/70 text-amber-900 border border-amber-300/60">
                  Tersimpan Otomatis
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                Terakhir disimpan pada <span className="font-semibold text-amber-950">{new Date(existingDraft.updatedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>. Ingin melanjutkan pengisian sebelumnya?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-amber-200/70">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => clearDraft()}
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
              className="text-slate-700 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 shadow-none"
            >
              Buang Draf
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (existingDraft.currentStep) setCurrentStep(existingDraft.currentStep)
                if (existingDraft.pengajuans) setPengajuans(existingDraft.pengajuans)
                if (existingDraft.kondisiPerusahaan) setKondisiPerusahaan(existingDraft.kondisiPerusahaan)
                if (existingDraft.isAgreed !== undefined) setIsAgreed(existingDraft.isAgreed)
                setExistingDraft(null) // Tutup banner setelah dipulihkan
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm font-medium"
            >
              Lanjutkan Draf
            </Button>
          </div>
        </div>
      )}

      {/* Progress Stepper Card */}
      <Card className="border-brand-100 shadow-sm">
        <CardHeader className="pt-6 pb-5 border-b border-slate-100 bg-slate-50/30">
          <div className="flex justify-between items-start w-full relative">
            <div className="absolute top-4 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 z-0"></div>

            {[
              { num: 1, label: "Jenis Permohonan" },
              { num: 2, label: "Kategori Sertifikat" },
              { num: 3, label: "Kondisi Perusahaan" },
              { num: 4, label: "Pernyataan" },
            ].map((step, idx) => {
              const isActive = currentStep >= step.num;
              return (
                <div key={idx} className="relative z-10 flex flex-col items-center w-1/4 px-1 transition-all duration-300">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-sm transition-colors duration-300 ${isActive
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-400"
                      }`}
                  >
                    {step.num}
                  </div>
                  <div className={`mt-2.5 text-[11px] leading-tight text-center transition-colors duration-300 ${isActive ? "font-semibold text-brand-700" : "font-medium text-slate-500"}`}>
                    {step.label}
                  </div>
                </div>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="pt-6 bg-slate-50/50">

          {/* STEP 1 & STEP 2: Render per-skema pengajuan */}
          {currentStep <= 2 && (
            <div className="space-y-6">
              {pengajuans.map((pengajuan, index) => (
                <Card key={pengajuan.id} className="border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 text-sm">
                      Pengajuan {index + 1}
                    </h3>
                    {pengajuans.length > 1 && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removePengajuan(pengajuan.id)}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        className="h-8 text-xs"
                      >
                        Hapus
                      </Button>
                    )}
                  </div>

                  <div className="p-6 bg-white">
                    {currentStep === 1 && (
                      <Step1JenisPermohonan
                        hideButtons
                        valueJenis={pengajuan.jenisPermohonan}
                        onChangeJenis={(val) => updateFormData(pengajuan.id, 'jenisPermohonan', val)}
                        valueSertifikat={pengajuan.sertifikatLama}
                        onChangeSertifikat={(val) => updateFormData(pengajuan.id, 'sertifikatLama', val)}
                      />
                    )}
                    {currentStep === 2 && (
                      <Step2KategoriSertifikat
                        hideButtons
                        value={pengajuan.kategoriSertifikat}
                        onChange={(val) => updateFormData(pengajuan.id, 'kategoriSertifikat', val)}
                        komoditiListValue={pengajuan.komoditis || []}
                        onChangeKomoditiList={(data) => updateFormData(pengajuan.id, 'komoditis', data)}
                        dokumenListValue={pengajuan.dokumens || []}
                        onChangeDokumenList={(data) => updateFormData(pengajuan.id, 'dokumens', data)}
                      />
                    )}
                  </div>
                </Card>
              ))}

              {/* Tombol Tambah Pengajuan (Maksimal 2 skema di Step 1) */}
              {pengajuans.length < 2 && currentStep === 1 && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={addPengajuan}
                    leftIcon={<Plus className="w-4 h-4" />}
                    className="border-dashed border-2 text-brand-600 border-brand-200 hover:border-brand-400 hover:bg-brand-50"
                  >
                    Tambah Pengajuan Skema Lain
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Kondisi Perusahaan (Tingkat Pemohon Global) */}
          {currentStep === 3 && (
            <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
              <div className="p-6">
                <Step3KondisiPerusahaan
                  hideButtons
                  value={kondisiPerusahaan}
                  onChange={setKondisiPerusahaan}
                />
              </div>
            </Card>
          )}

          {/* STEP 4: Pernyataan Hukum */}
          {currentStep === 4 && (
            <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
              <div className="p-6">
                <Step4Pernyataan
                  hideButtons
                  isChecked={isAgreed}
                  onCheckChange={setIsAgreed}
                />
              </div>
            </Card>
          )}

          {/* Navigasi Lanjut / Kembali Utama */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-6 bg-white"
              >
                Kembali
              </Button>
            ) : <div />}

            <div className="flex items-center gap-3">
              {currentStep === 4 && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => handleSubmitPermohonan('draft')}
                  leftIcon={<FileText className="w-4 h-4" />}
                  className="px-5 text-slate-700 bg-white hover:bg-slate-50"
                >
                  Simpan Draf
                </Button>
              )}

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="px-6"
                >
                  Selanjutnya
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={!isAgreed || isSubmitting}
                  onClick={() => handleSubmitPermohonan('ajukan')}
                  leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Mengirim Permohonan..." : "Kirim Permohonan"}
                </Button>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default SertifikasiPage
