import React, { useEffect } from "react"
import { FileText, Truck, Building2, UserCheck, MapPin } from "lucide-react"
import { toast } from "react-hot-toast"
import { PengujianSharedData } from "../../../types/pengujian"
import useProfile from "../../../hooks/useProfile"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  OptionCard,
  OptionGroup,
  WizardNav,
  inputClass,
  textareaClass,
  cx,
} from "./components/WizardUI"

interface Step2DataPermintaanProps {
  sharedData: PengujianSharedData
  setSharedData: React.Dispatch<React.SetStateAction<PengujianSharedData>>
  onNext: () => void
  onBack: () => void
}

const OptionIcon: React.FC<{ icon: React.ElementType; active: boolean }> = ({ icon: Icon, active }) => (
  <span
    className={cx(
      "w-8 h-8 rounded-md border flex items-center justify-center shrink-0 transition-colors",
      active
        ? "border-brand-500 bg-brand-50 text-brand-700"
        : "border-slate-200 bg-white text-slate-500 group-hover:border-slate-300"
    )}
  >
    <Icon className="w-4 h-4" />
  </span>
)

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

  const handleSelectBiaya = (isPemohon: boolean) =>
    setSharedData((prev) => ({
      ...prev,
      biaya_sama_dengan_pemohon: isPemohon,
      biaya_ditanggung_oleh: isPemohon
        ? applicantName
        : prev.biaya_sama_dengan_pemohon
        ? ""
        : prev.biaya_ditanggung_oleh,
    }))

  const handleSelectAlamat = (isPemohon: boolean) =>
    setSharedData((prev) => ({
      ...prev,
      alamat_sama_dengan_pemohon: isPemohon,
      laporan_dialamatkan_kepada: isPemohon
        ? (profileAlamat ? `${applicantName} - ${profileAlamat}` : applicantName)
        : prev.alamat_sama_dengan_pemohon
        ? ""
        : prev.laporan_dialamatkan_kepada,
    }))

  return (
    <div className="space-y-6">
      <StepPanel
        icon={FileText}
        title="Data Permintaan & Administrasi"
        description="Lengkapi data pemohon, siapa yang menanggung biaya, dan ke mana laporan hasil uji dikirim."
      >
        <div className="space-y-8">
          {/* 1. PEMOHON & BIAYA */}
          <div>
            <SectionHeading title="Pemohon & Penanggung Biaya" />

            <div className="mb-4">
              <FieldLabel htmlFor="input-nama-pemohon" required>
                NAMA PEMOHON
              </FieldLabel>
              <input
                id="input-nama-pemohon"
                type="text"
                className={inputClass}
                value={sharedData.diajukan_oleh || applicantName}
                onChange={(e) =>
                  setSharedData((prev) => ({
                    ...prev,
                    diajukan_oleh: e.target.value,
                  }))
                }
                placeholder="Nama pemohon / perusahaan"
              />
            </div>

            <FieldLabel required>PENANGGUNG BIAYA PENGUJIAN</FieldLabel>
            <OptionGroup label="Penanggung Biaya Pengujian">
              <OptionCard
                id="opsi-biaya-pemohon"
                compact
                selected={sharedData.biaya_sama_dengan_pemohon}
                onSelect={() => handleSelectBiaya(true)}
                leading={<OptionIcon icon={UserCheck} active={sharedData.biaya_sama_dengan_pemohon} />}
                title="Pemohon sendiri"
                description={applicantName}
              />
              <OptionCard
                id="opsi-biaya-pihak-lain"
                compact
                selected={!sharedData.biaya_sama_dengan_pemohon}
                onSelect={() => handleSelectBiaya(false)}
                leading={<OptionIcon icon={Building2} active={!sharedData.biaya_sama_dengan_pemohon} />}
                title="Pihak lain / rekanan"
                description="Isi nama pihak penanggung biaya"
              />
            </OptionGroup>

            {!sharedData.biaya_sama_dengan_pemohon && (
              <div className="mt-3 animate-[wizardFadeUp_.25s_ease-out]">
                <input
                  id="input-biaya-pihak-lain"
                  type="text"
                  className={inputClass}
                  placeholder="Nama pihak lain penanggung biaya"
                  value={sharedData.biaya_ditanggung_oleh}
                  onChange={(e) =>
                    setSharedData((prev) => ({
                      ...prev,
                      biaya_ditanggung_oleh: e.target.value,
                    }))
                  }
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* 2. ALAMAT PENGIRIMAN */}
          <div className="pt-6 border-t border-slate-200">
            <SectionHeading
              title="Alamat Pengiriman Laporan"
              required
              description="Ke mana dokumen fisik laporan hasil uji akan dikirim."
            />

            <OptionGroup label="Pilihan Alamat Pengiriman">
              <OptionCard
                id="opsi-alamat-pemohon"
                compact
                selected={sharedData.alamat_sama_dengan_pemohon}
                onSelect={() => handleSelectAlamat(true)}
                leading={<OptionIcon icon={MapPin} active={sharedData.alamat_sama_dengan_pemohon} />}
                title="Sesuai alamat pemohon"
                description="Gunakan alamat yang terdaftar di profil"
              />
              <OptionCard
                id="opsi-alamat-lain"
                compact
                selected={!sharedData.alamat_sama_dengan_pemohon}
                onSelect={() => handleSelectAlamat(false)}
                leading={<OptionIcon icon={Truck} active={!sharedData.alamat_sama_dengan_pemohon} />}
                title="Alamat lain"
                description="Ketik alamat pengiriman yang berbeda"
              />
            </OptionGroup>

            <div className="mt-4">
              {sharedData.alamat_sama_dengan_pemohon ? (
                <div
                  key="alamat-pemohon"
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 shadow-none animate-[wizardFadeUp_.25s_ease-out]"
                >
                  <p className="text-xs font-semibold text-slate-500 mb-3">
                    Laporan akan dikirim ke:
                  </p>
                  <dl className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-sm">
                    <dt className="text-slate-500">Nama penerima</dt>
                    <dd className="font-semibold text-slate-900">{applicantName}</dd>
                    <dt className="text-slate-500">Alamat</dt>
                    <dd className={profileAlamat ? "text-slate-800 leading-relaxed" : "text-amber-700"}>
                      {profileAlamat || "Alamat belum diisi pada profil — pilih \"Alamat lain\" untuk mengetik manual."}
                    </dd>
                  </dl>
                </div>
              ) : (
                <div key="alamat-kustom" className="animate-[wizardFadeUp_.25s_ease-out]">
                  <FieldLabel htmlFor="input-alamat-kustom" required>
                    Alamat lengkap pengiriman
                  </FieldLabel>
                  <textarea
                    id="input-alamat-kustom"
                    rows={3}
                    className={textareaClass}
                    placeholder="Nama penerima, nama gedung/jalan, kecamatan, kota/kabupaten, kode pos"
                    value={sharedData.laporan_dialamatkan_kepada}
                    onChange={(e) =>
                      setSharedData((prev) => ({
                        ...prev,
                        laporan_dialamatkan_kepada: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* 3. CATATAN */}
          <div className="pt-6 border-t border-slate-200">
            <SectionHeading
              title="Keterangan / Catatan Permintaan"
              optional
              description="Tuliskan instruksi khusus jika ada (misal: kebutuhan khusus penanganan sampel atau tenggat waktu)."
            />
            <textarea
              id="input-catatan-permintaan"
              rows={3}
              className={textareaClass}
              placeholder="Tuliskan instruksi khusus jika ada..."
              value={sharedData.keterangan_permintaan}
              onChange={(e) =>
                setSharedData((prev) => ({
                  ...prev,
                  keterangan_permintaan: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </StepPanel>

      <WizardNav onBack={onBack} onNext={handleValidateAndNext} />
    </div>
  )
}

export default Step2DataPermintaan
