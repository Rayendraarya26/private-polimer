import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { Card, CardHeader, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { ArrowLeft, Plus, Trash2, Send } from "lucide-react"
import Step1JenisPermohonan from "../../components/sertifikasi/JenisPermohonan"
import Step2KategoriSertifikat, { KomoditiData, DokumenPersyaratan } from "../../components/sertifikasi/KategoriSertifikat"
import Step3KondisiPerusahaan from "../../components/sertifikasi/KondisiPerusahaan"
import Step4Pernyataan from "../../components/sertifikasi/Pernyataan"
import { useSertifikasiDraft } from "../../hooks/useSertifikasiDraft"
import { useProfileQuery } from "../../hooks/queries/useProfileQuery"
import { Clock, RefreshCw } from "lucide-react"

interface PengajuanItem {
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

  const { profile } = useProfileQuery()
  const userId = profile?.user_id || "guest"

  // State array untuk menampung maksimal 2 pengajuan
  const [pengajuans, setPengajuans] = useState<PengajuanItem[]>([
    {
      id: Date.now(),
      jenisPermohonan: "",
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

  const [isAgreed, setIsAgreed] = useState(false)

  const addPengajuan = () => {
    if (pengajuans.length < 2) {
      setPengajuans([
        ...pengajuans,
        {
          id: Date.now(),
          jenisPermohonan: "",
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

  const handleNext = () => setCurrentStep(prev => prev + 1)
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
      isAgreed
    })
  }, [currentStep, pengajuans, isAgreed, autoSave, existingDraft])

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
            Kami melayani berbagai jenis sertifikasi untuk mendukung pemenuhan standar dan kredibilitas perusahaan Anda.
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

          {currentStep <= 3 ? (
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
                    {currentStep === 3 && (
                      <Step3KondisiPerusahaan
                        hideButtons
                      />
                    )}
                  </div>
                </Card>
              ))}

              {/* Tombol Tambah Pengajuan */}
              {pengajuans.length < 2 && currentStep === 1 && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={addPengajuan}
                    leftIcon={<Plus className="w-4 h-4" />}
                    className="border-dashed border-2 text-brand-600 border-brand-200 hover:border-brand-400 hover:bg-brand-50"
                  >
                    Tambah Pengajuan
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Step 4: Pernyataan (Satu untuk keseluruhan pengajuan) */
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
              <Button variant="outline" type="button" onClick={handleBack} className="px-6 bg-white">
                Kembali
              </Button>
            ) : <div></div>}

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="px-6"
                disabled={pengajuans.some(p => {
                  if (currentStep === 1) return !p.jenisPermohonan || (p.jenisPermohonan === 'perpanjangan' && !p.sertifikatLama)
                  if (currentStep === 2) return !p.kategoriSertifikat || !p.komoditis || p.komoditis.length === 0
                  return false
                })}
              >
                Selanjutnya
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!isAgreed}
                leftIcon={<Send className="w-4 h-4" />}
                className="px-6 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              >
                Kirim Permohonan
              </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default SertifikasiPage
