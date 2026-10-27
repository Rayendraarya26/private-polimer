import React, { useEffect } from "react"
import {
  FileText,
  Truck,
  ArrowRight,
  ArrowLeft,
  Building2,
  UserCheck,
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
import {
  FormField,
  TextInput,
  TextareaInput,
  RadioCardGroup,
} from "../../forms"

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
            <FormField
              label="Nama Pemohon"
              required
              helperText="Nama pemohon atau badan usaha yang mengajukan pengujian"
            >
              <TextInput
                value={sharedData.diajukan_oleh || applicantName}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    diajukan_oleh: e.target.value,
                  }))
                }
                placeholder="Nama Pemohon / Perusahaan"
              />
            </FormField>
          </div>

          {/* Penanggung Biaya Pengujian */}
          <div className="space-y-3">
            <FormField
              label="Penanggung Biaya Pengujian"
              required
              helperText="Tentukan entitas yang bertanggung jawab atas tagihan PNBP pengujian"
            >
              <RadioCardGroup
                name="opsiBiaya"
                value={sharedData.biaya_sama_dengan_pemohon ? "pemohon" : "pihak_lain"}
                onChange={(val) => {
                  const isPemohon = val === "pemohon"
                  setSharedData((prev) => ({
                    ...prev,
                    biaya_sama_dengan_pemohon: isPemohon,
                    biaya_ditanggung_oleh: isPemohon ? applicantName : (prev.biaya_sama_dengan_pemohon ? "" : prev.biaya_ditanggung_oleh),
                  }))
                }}
                gridCols={2}
                options={[
                  {
                    value: "pemohon",
                    title: "Sesuai Pemohon",
                    description: applicantName,
                    icon: <UserCheck className="w-4 h-4 text-brand-600" />,
                  },
                  {
                    value: "pihak_lain",
                    title: "Pihak Lain / Rekanan",
                    description: "Ketik nama pihak penanggung biaya",
                    icon: <Building2 className="w-4 h-4 text-slate-500" />,
                  },
                ]}
              />
            </FormField>

            {!sharedData.biaya_sama_dengan_pemohon && (
              <div className="mt-2.5 animate-in fade-in-50 duration-200">
                <TextInput
                  placeholder="Masukkan nama pihak lain penanggung biaya..."
                  value={sharedData.biaya_ditanggung_oleh}
                  onChange={(e) =>
                    setSharedData((prev) => ({
                      ...prev,
                      biaya_ditanggung_oleh: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </div>

          {/* ================= ALAMAT PENGIRIMAN LAPORAN HASIL PENGUJIAN ================= */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-600" />
                Alamat Pengiriman Laporan Hasil Pengujian <span className="text-rose-500">*</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Tentukan penerima dan alamat tujuan pengiriman fisik dokumen sertifikat atau laporan hasil pengujian
              </p>
            </div>

            {/* Opsi Pilihan Alamat Pengiriman */}
            <div className="space-y-3">
              <RadioCardGroup
                name="opsiAlamat"
                value={sharedData.alamat_sama_dengan_pemohon ? "pemohon" : "kustom"}
                onChange={(val) => {
                  const isPemohon = val === "pemohon"
                  setSharedData((prev) => ({
                    ...prev,
                    alamat_sama_dengan_pemohon: isPemohon,
                    laporan_dialamatkan_kepada: isPemohon
                      ? (profileAlamat ? `${applicantName} - ${profileAlamat}` : applicantName)
                      : (prev.alamat_sama_dengan_pemohon ? "" : prev.laporan_dialamatkan_kepada),
                  }))
                }}
                gridCols={2}
                options={[
                  {
                    value: "pemohon",
                    title: "Sesuai Alamat Pemohon",
                    description: profileAlamat || "Gunakan alamat pemohon di atas",
                  },
                  {
                    value: "kustom",
                    title: "Alamat Lainnya (Kustom)",
                    description: "Ketik alamat pengiriman fisik yang berbeda",
                  },
                ]}
              />

              {/* Tampilan Kondisional Berdasarkan Opsi yang Dipilih */}
              {sharedData.alamat_sama_dengan_pemohon ? (
                <div className="rounded-xl border border-brand-200/90 bg-brand-50/40 p-4 space-y-2 animate-in fade-in-50 duration-200">
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-900">
                    <span>Dokumen sertifikat / laporan akan dikirimkan ke alamat pemohon:</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-brand-100/80 text-xs space-y-1.5 shadow-2xs">
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
                <div className="animate-in fade-in-50 duration-200">
                  <FormField
                    label="Alamat Pengiriman Laporan"
                    required
                    helperText="Tuliskan nama penerima, alamat detail gedung/jalan, kecamatan, kota/kab, dan kode pos"
                  >
                    <TextareaInput
                      rows={3}
                      placeholder="Masukkan alamat lengkap tujuan pengiriman sertifikat / laporan hasil pengujian..."
                      value={sharedData.laporan_dialamatkan_kepada}
                      onChange={(e) =>
                        setSharedData((prev) => ({
                          ...prev,
                          laporan_dialamatkan_kepada: e.target.value,
                        }))
                      }
                    />
                  </FormField>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: KETERANGAN PERMINTAAN */}
          <div className="pt-4 border-t border-slate-200">
            <FormField
              label="Keterangan / Catatan Permintaan"
              helperText="Tuliskan catatan atau instruksi umum permohonan pengujian jika ada (opsional)"
            >
              <TextareaInput
                rows={3}
                placeholder="Tuliskan catatan atau instruksi umum permohonan pengujian jika ada..."
                value={sharedData.keterangan_permintaan}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    keterangan_permintaan: e.target.value,
                  }))
                }
              />
            </FormField>
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
          className="h-[42px] px-5 rounded-xl font-semibold text-sm"
        >
          Sebelumnya
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleValidateAndNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="h-[42px] px-6 rounded-xl font-semibold text-sm shadow-md shadow-brand-500/15"
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  )
}

export default Step2DataPermintaan

