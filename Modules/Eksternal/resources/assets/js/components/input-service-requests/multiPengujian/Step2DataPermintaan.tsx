import React, { useEffect } from "react"
import {
  FileText,
  Truck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { PengujianSharedData } from "../../../types/pengujian"
import { Button } from "../../ui/Button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../ui/Card"
import useProfile from "../../../hooks/useProfile"

interface Step2DataPermintaanProps {
  sharedData: PengujianSharedData
  setSharedData: React.Dispatch<React.SetStateAction<PengujianSharedData>>
  onNext: () => void
  onBack: () => void
}

export const Step2DataPermintaan: React.FC<Step2DataPermintaanProps> = ({
  sharedData,
  setSharedData,
  onNext,
  onBack,
}) => {
  const { profile } = useProfile()
  const userObj = profile as Record<string, any> | null

  const detail = (profile?.detail || {}) as Record<string, any>
  const profileAlamat =
    detail?.alamat ||
    detail?.alamat_lengkap ||
    detail?.alamat_perusahaan ||
    detail?.pabrik_alamat ||
    detail?.alamat_pabrik ||
    userObj?.alamat_lengkap ||
    userObj?.alamat ||
    ""
  const applicantName =
    detail?.nama ||
    userObj?.company_name ||
    profile?.name ||
    userObj?.nama ||
    "Pemohon / Klien"

  // Autofill data profil pemohon saat pertama kali dimuat
  useEffect(() => {
    if (!profile) return

    setSharedData((prev) => {
      const companyOrPerson =
        detail?.nama ||
        userObj?.company_name ||
        profile.name ||
        userObj?.nama ||
        ""

      const targetAlamat = profileAlamat
        ? `${companyOrPerson} - ${profileAlamat}`
        : companyOrPerson

      return {
        ...prev,
        diajukan_oleh: prev.diajukan_oleh || companyOrPerson,
        biaya_ditanggung_oleh: prev.biaya_sama_dengan_pemohon
          ? companyOrPerson
          : prev.biaya_ditanggung_oleh,
        laporan_dialamatkan_kepada: prev.alamat_sama_dengan_pemohon
          ? targetAlamat
          : prev.laporan_dialamatkan_kepada,
      }
    })
  }, [profile, profileAlamat, setSharedData])

  const handleValidateAndNext = () => {
    const finalBiaya = sharedData.biaya_sama_dengan_pemohon
      ? applicantName
      : sharedData.biaya_ditanggung_oleh.trim()

    const finalAlamat = sharedData.alamat_sama_dengan_pemohon
      ? (profileAlamat ? `${applicantName} - ${profileAlamat}` : applicantName)
      : sharedData.laporan_dialamatkan_kepada.trim()

    if (!finalBiaya) {
      toast.error("Kolom 'Penanggung Biaya Pengujian' wajib diisi")
      return
    }

    if (!finalAlamat) {
      toast.error("Kolom 'Alamat Pengiriman Laporan Hasil Pengujian' wajib diisi")
      return
    }

    // Pastikan nilai terisi sebelum lanjut
    setSharedData((prev) => ({
      ...prev,
      diajukan_oleh: prev.diajukan_oleh || applicantName,
      biaya_ditanggung_oleh: finalBiaya,
      laporan_dialamatkan_kepada: finalAlamat,
    }))

    onNext()
  }

  return (
    <div className="space-y-6">
      <Card className="border-brand-100 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Data Permintaan & Administrasi</span>
              </CardTitle>
              <CardDescription>
                Data pemohon, penanggung jawab pembiayaan pengujian, dan tujuan pengiriman laporan hasil pengujian
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* SECTION 1: DATA IDENTITAS PEMOHON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Nama Pemohon <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={sharedData.diajukan_oleh || applicantName}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    diajukan_oleh: e.target.value,
                  }))
                }
                placeholder="Nama Pemohon / Perusahaan"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          {/* Penanggung Biaya Pengujian */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Penanggung Biaya Pengujian <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Opsi 1: Pemohon */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  sharedData.biaya_sama_dengan_pemohon
                    ? "bg-brand-50/80 border-brand-400 ring-2 ring-brand-500/20 text-brand-900"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="opsiBiaya"
                  checked={sharedData.biaya_sama_dengan_pemohon}
                  onChange={() => {
                    setSharedData((prev) => ({
                      ...prev,
                      biaya_sama_dengan_pemohon: true,
                      biaya_ditanggung_oleh: applicantName,
                    }))
                  }}
                  className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div className="text-xs min-w-0">
                  <span className="font-semibold block text-slate-800">Pemohon</span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {applicantName}
                  </span>
                </div>
              </label>

              {/* Opsi 2: Pihak Lain */}
              <label
                className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  !sharedData.biaya_sama_dengan_pemohon
                    ? "bg-brand-50/80 border-brand-400 ring-2 ring-brand-500/20 text-brand-900"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="opsiBiaya"
                  checked={!sharedData.biaya_sama_dengan_pemohon}
                  onChange={() => {
                    setSharedData((prev) => ({
                      ...prev,
                      biaya_sama_dengan_pemohon: false,
                      biaya_ditanggung_oleh: prev.biaya_sama_dengan_pemohon ? "" : prev.biaya_ditanggung_oleh,
                    }))
                  }}
                  className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div className="text-xs min-w-0">
                  <span className="font-semibold block text-slate-800">Pihak Lain</span>
                  <span className="text-[11px] text-slate-500 block">
                    Ketik nama pihak penanggung biaya
                  </span>
                </div>
              </label>
            </div>

            {!sharedData.biaya_sama_dengan_pemohon && (
              <div className="mt-2.5 animate-in fade-in-50 duration-200">
                <input
                  type="text"
                  placeholder="Masukkan nama pihak lain penanggung biaya..."
                  value={sharedData.biaya_ditanggung_oleh}
                  onChange={(e) =>
                    setSharedData((prev) => ({
                      ...prev,
                      biaya_ditanggung_oleh: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            )}
          </div>

          {/* ================= ALAMAT PENGIRIMAN LAPORAN HASIL PENGUJIAN ================= */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-600" />
                Alamat Pengiriman Laporan Hasil Pengujian <span className="text-rose-500">*</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tentukan penerima dan alamat tujuan pengiriman fisik dokumen sertifikat atau laporan hasil pengujian
              </p>
            </div>

            {/* Opsi Pilihan Alamat Pengiriman */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pilihan Alamat Pengiriman:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Opsi 1: Sesuai Alamat Pemohon */}
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    sharedData.alamat_sama_dengan_pemohon
                      ? "bg-brand-50/80 border-brand-400 ring-2 ring-brand-500/20 text-brand-900"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="opsiAlamat"
                    checked={sharedData.alamat_sama_dengan_pemohon}
                    onChange={() => {
                      setSharedData((prev) => ({
                        ...prev,
                        alamat_sama_dengan_pemohon: true,
                        laporan_dialamatkan_kepada: profileAlamat ? `${applicantName} - ${profileAlamat}` : applicantName,
                      }))
                    }}
                    className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <div className="text-xs min-w-0">
                    <span className="font-semibold block text-slate-800">Sesuai Alamat Pemohon</span>
                    <span className="text-[11px] text-slate-500 truncate block">
                      {profileAlamat || "Gunakan alamat pemohon di atas"}
                    </span>
                  </div>
                </label>

                {/* Opsi 2: Alamat Lainnya (Kustom) */}
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    !sharedData.alamat_sama_dengan_pemohon
                      ? "bg-brand-50/80 border-brand-400 ring-2 ring-brand-500/20 text-brand-900"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="opsiAlamat"
                    checked={!sharedData.alamat_sama_dengan_pemohon}
                    onChange={() => {
                      setSharedData((prev) => ({
                        ...prev,
                        alamat_sama_dengan_pemohon: false,
                        laporan_dialamatkan_kepada: prev.alamat_sama_dengan_pemohon ? "" : prev.laporan_dialamatkan_kepada,
                      }))
                    }}
                    className="mt-0.5 text-brand-600 focus:ring-brand-500 border-slate-300"
                  />
                  <div className="text-xs min-w-0">
                    <span className="font-semibold block text-slate-800">Alamat Lainnya (Kustom)</span>
                    <span className="text-[11px] text-slate-500 block">Ketik alamat pengiriman lain</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Tampilan Kondisional Berdasarkan Opsi yang Dipilih */}
            {sharedData.alamat_sama_dengan_pemohon ? (
              <div className="rounded-xl border border-brand-200/90 bg-brand-50/40 p-4 space-y-3 animate-in fade-in-50 duration-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-900">
                  <span>Dokumen sertifikat / laporan akan dikirimkan ke alamat pemohon:</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-brand-100/80 text-xs space-y-1.5 shadow-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-32 shrink-0">Nama Penerima:</span>
                    <span className="font-semibold text-slate-800">
                      {applicantName}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-500 w-32 shrink-0">Alamat Pengiriman:</span>
                    <span className="text-slate-700 leading-relaxed">
                      {profileAlamat || "(Alamat pemohon belum diisi pada profil)"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4 animate-in fade-in-50 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Alamat Pengiriman <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Masukkan alamat lengkap tujuan pengiriman sertifikat / laporan hasil pengujian..."
                      value={sharedData.laporan_dialamatkan_kepada}
                      onChange={(e) =>
                        setSharedData((prev) => ({
                          ...prev,
                          laporan_dialamatkan_kepada: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: KETERANGAN PERMINTAAN */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Keterangan / Catatan Permintaan <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan catatan atau instruksi umum permohonan pengujian jika ada..."
              value={sharedData.keterangan_permintaan}
              onChange={(e) =>
                setSharedData((prev) => ({
                  ...prev,
                  keterangan_permintaan: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-500 transition-colors placeholder:text-slate-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="px-5 py-2.5 font-semibold text-xs"
        >
          Sebelumnya
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleValidateAndNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="px-6 py-2.5 font-semibold text-xs shadow-xs"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}

export default Step2DataPermintaan
