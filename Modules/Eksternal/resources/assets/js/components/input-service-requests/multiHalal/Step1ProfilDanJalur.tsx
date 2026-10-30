import React, { useEffect } from "react"
import { toast } from "react-hot-toast"
import { FormHalalPayload, JalurPendaftaran, SkalaUsaha } from "../../../types/halal"
import useProfile from "../../../hooks/useProfile"
import { useProfileQuery } from "../../../hooks/queries/useProfileQuery"
import { Button } from "../../ui/Button"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  OptionCard,
  OptionGroup,
  inputClass,
  selectClass,
  textareaClass,
} from "../common"
import {
  Building2,
  User,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

interface Step1Props {
  payload: FormHalalPayload
  onChange: (updater: (prev: FormHalalPayload) => FormHalalPayload) => void
}

export const Step1ProfilDanJalur: React.FC<Step1Props> = ({ payload, onChange }) => {
  const { profile: reduxProfile, getMyProfile } = useProfile()
  const { profile: queryProfile } = useProfileQuery()
  const profile = reduxProfile || queryProfile

  // Pastikan profile terambil jika belum dimuat di store
  useEffect(() => {
    if (!profile && getMyProfile) {
      getMyProfile()
    }
  }, [profile, getMyProfile])

  const setJalur = (jalur: JalurPendaftaran) => {
    onChange((prev) => ({
      ...prev,
      dataPengajuan: {
        ...prev.dataPengajuan,
        jalur_pendaftaran: jalur,
      },
      dataPelakuUsaha: {
        ...prev.dataPelakuUsaha,
        skala_usaha: jalur === "self_declare" ? "mikro" : prev.dataPelakuUsaha.skala_usaha,
      },
    }))
  }

  const extractProfileData = (prof: any) => {
    if (!prof) return null

    const detail = prof.detail || {}
    const userObj = prof as Record<string, any>

    const namaUsaha =
      detail.nama ||
      userObj.company_name ||
      userObj.nama ||
      userObj.name ||
      ""

    const nib = detail.nib || userObj.nib || ""
    const npwp = detail.npwp || userObj.npwp || ""

    const pjNama =
      detail.pj_nama ||
      detail.pimpinan ||
      detail.pemilik ||
      userObj.name ||
      userObj.nama ||
      ""

    const pjKontak =
      detail.pj_whatsapp ||
      detail.whatsapp ||
      detail.telepon ||
      userObj.whatsapp ||
      userObj.phone ||
      userObj.telepon ||
      ""

    const pjEmail =
      detail.pj_surel ||
      detail.surel ||
      userObj.email ||
      ""

    const pjAlamat =
      detail.alamat ||
      detail.alamat_lengkap ||
      userObj.address ||
      userObj.alamat ||
      userObj.alamat_lengkap ||
      ""

    return {
      namaUsaha,
      nib,
      npwp,
      pjNama,
      pjKontak,
      pjEmail,
      pjAlamat,
    }
  }

  // Nilai default mengambil dari data profile secara langsung saat komponen pertama kali dimuat
  useEffect(() => {
    if (!profile) return

    const extracted = extractProfileData(profile)
    if (!extracted) return

    onChange((prev) => {
      const pu = prev.dataPelakuUsaha
      const shouldUpdateNama = !pu.nama_usaha && !!extracted.namaUsaha
      const shouldUpdateNib = !pu.nib && !!extracted.nib
      const shouldUpdateNpwp = !pu.npwp && !!extracted.npwp
      const shouldUpdatePjNama = !pu.pj_nama && !!extracted.pjNama
      const shouldUpdatePjKontak = !pu.pj_kontak && !!extracted.pjKontak
      const shouldUpdatePjEmail = !pu.pj_email && !!extracted.pjEmail
      const shouldUpdatePjAlamat = !pu.pj_alamat && !!extracted.pjAlamat

      if (
        !shouldUpdateNama &&
        !shouldUpdateNib &&
        !shouldUpdateNpwp &&
        !shouldUpdatePjNama &&
        !shouldUpdatePjKontak &&
        !shouldUpdatePjEmail &&
        !shouldUpdatePjAlamat
      ) {
        return prev
      }

      return {
        ...prev,
        dataPelakuUsaha: {
          ...pu,
          nama_usaha: shouldUpdateNama ? extracted.namaUsaha : pu.nama_usaha,
          nib: shouldUpdateNib ? extracted.nib : pu.nib,
          npwp: shouldUpdateNpwp ? extracted.npwp : pu.npwp,
          pj_nama: shouldUpdatePjNama ? extracted.pjNama : pu.pj_nama,
          pj_kontak: shouldUpdatePjKontak ? extracted.pjKontak : pu.pj_kontak,
          pj_email: shouldUpdatePjEmail ? extracted.pjEmail : pu.pj_email,
          pj_alamat: shouldUpdatePjAlamat ? extracted.pjAlamat : pu.pj_alamat,
        },
      }
    })
  }, [profile, onChange])

  const handleAutofillProfile = () => {
    if (!profile) {
      toast.error("Data profil belum tersedia")
      return
    }

    const extracted = extractProfileData(profile)
    if (!extracted) return

    onChange((prev) => ({
      ...prev,
      dataPelakuUsaha: {
        ...prev.dataPelakuUsaha,
        nama_usaha: extracted.namaUsaha || prev.dataPelakuUsaha.nama_usaha,
        nib: extracted.nib || prev.dataPelakuUsaha.nib,
        npwp: extracted.npwp || prev.dataPelakuUsaha.npwp,
        pj_nama: extracted.pjNama || prev.dataPelakuUsaha.pj_nama,
        pj_kontak: extracted.pjKontak || prev.dataPelakuUsaha.pj_kontak,
        pj_email: extracted.pjEmail || prev.dataPelakuUsaha.pj_email,
        pj_alamat: extracted.pjAlamat || prev.dataPelakuUsaha.pj_alamat,
      },
    }))
    toast.success("Data profil berhasil dimuat")
  }

  const jalur = payload.dataPengajuan.jalur_pendaftaran

  return (
    <StepPanel
      icon={ShieldCheck}
      title="Jalur Sertifikasi & Profil Pelaku Usaha"
      description="Pilih skema sertifikasi halal (Reguler / Self Declare) dan lengkapi data profil resmi pelaku usaha sesuai NIB OSS."
    >
      {/* 1. Skema & Jalur Sertifikasi */}
      <div>
        <SectionHeading
          title="Pilih Skema & Jalur Sertifikasi Halal"
          required
          description="Pilih jalur pengajuan sesuai dengan skala usaha dan karakteristik produk Anda."
        />

        <OptionGroup label="Jalur Sertifikasi" cols={2}>
          <OptionCard
            selected={jalur === "reguler"}
            onSelect={() => setJalur("reguler")}
            title="Jalur Reguler (Audit LPH)"
            badge="LPH BBSPJIKKP"
            description="Pemeriksaan dan audit kehalalan oleh Auditor Halal LPH untuk usaha Mikro, Kecil, Menengah, Besar, atau produk dengan proses/bahan berisiko."
          />
          <OptionCard
            selected={jalur === "self_declare"}
            onSelect={() => setJalur("self_declare")}
            title="Jalur Self Declare (SEHATI)"
            badge="Pernyataan Mandiri UMK"
            description="Pernyataan mandiri pelaku usaha mikro/kecil (SEHATI BPJPH) dengan kriteria produk tidak berisiko dan bahan pasti halal."
          />
        </OptionGroup>

        {/* Kuesioner Kelayakan Mandiri (Jika Jalur Self Declare) */}
        {jalur === "self_declare" && (
          <div className="p-4 sm:p-5 rounded-xl border space-y-3 mt-4 animate-[wizardFadeUp_.25s_ease-out]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-emerald-950">
                Kriteria Kelayakan Jalur Pernyataan Mandiri (Self Declare BPJPH)
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Pastikan seluruh kriteria di bawah ini terpenuhi sebelum mengajukan jalur Self Declare:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700">
              <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer shadow-none">
                <input
                  type="checkbox"
                  checked={payload.kuesionerSelfDeclare.is_mikro_kecil}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      kuesionerSelfDeclare: {
                        ...prev.kuesionerSelfDeclare,
                        is_mikro_kecil: e.target.checked,
                      },
                    }))
                  }
                  className="rounded border-slate-300 focus:ring-0 mt-0.5"
                />
                <span className="leading-snug">Termasuk skala usaha Mikro atau Kecil (NIB)</span>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer shadow-none">
                <input
                  type="checkbox"
                  checked={payload.kuesionerSelfDeclare.is_produk_tidak_berisiko}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      kuesionerSelfDeclare: {
                        ...prev.kuesionerSelfDeclare,
                        is_produk_tidak_berisiko: e.target.checked,
                      },
                    }))
                  }
                  className="rounded border-slate-300 focus:ring-0 mt-0.5"
                />
                <span className="leading-snug">Produk berupa barang dan tidak berisiko</span>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer shadow-none">
                <input
                  type="checkbox"
                  checked={payload.kuesionerSelfDeclare.is_bahan_pasti_halal}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      kuesionerSelfDeclare: {
                        ...prev.kuesionerSelfDeclare,
                        is_bahan_pasti_halal: e.target.checked,
                      },
                    }))
                  }
                  className="rounded border-slate-300 focus:ring-0 mt-0.5"
                />
                <span className="leading-snug">Bahan telah bersertifikat halal / KMA 1360</span>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 cursor-pointer shadow-none">
                <input
                  type="checkbox"
                  checked={payload.kuesionerSelfDeclare.is_proses_sederhana}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      kuesionerSelfDeclare: {
                        ...prev.kuesionerSelfDeclare,
                        is_proses_sederhana: e.target.checked,
                      },
                    }))
                  }
                  className="rounded border-slate-300 focus:ring-0 mt-0.5"
                />
                <span className="leading-snug">Proses produksi sederhana bebas kontaminasi najis</span>
              </label>
            </div>
          </div>
        )}

        {/* Jenis Pendaftaran & Kode Fasilitasi */}
        <div className="pt-6 border-t border-slate-200 mt-6 space-y-4">
          <FieldLabel required>Jenis Pendaftaran Sertifikasi</FieldLabel>
          <OptionGroup label="Jenis Pendaftaran" cols={2}>
            <OptionCard
              compact
              selected={payload.dataPengajuan.jenis_pendaftaran === "baru"}
              onSelect={() =>
                onChange((prev) => ({
                  ...prev,
                  dataPengajuan: { ...prev.dataPengajuan, jenis_pendaftaran: "baru" },
                }))
              }
              title="Pendaftaran Baru"
              description="Permohonan sertifikasi halal pertama kali untuk seluruh produk usaha"
            />
            <OptionCard
              compact
              selected={payload.dataPengajuan.jenis_pendaftaran === "pengembangan"}
              onSelect={() =>
                onChange((prev) => ({
                  ...prev,
                  dataPengajuan: { ...prev.dataPengajuan, jenis_pendaftaran: "pengembangan" },
                }))
              }
              title="Pengembangan Produk"
              description="Penambahan varian produk baru atau perluasan fasilitas pabrik"
            />
          </OptionGroup>

          <div className="pt-2">
            <FieldLabel htmlFor="input-kode-fasilitasi" optional>
              Kode Fasilitasi
            </FieldLabel>
            <input
              id="input-kode-fasilitasi"
              type="text"
              className={inputClass}
              placeholder="Contoh: FASILITASI-KEMENPERIN-2026"
              value={payload.dataPengajuan.kode_fasilitasi || ""}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  dataPengajuan: {
                    ...prev.dataPengajuan,
                    kode_fasilitasi: e.target.value,
                  },
                }))
              }
            />
            <FieldHint>Masukkan kode program/sponsor fasilitasi jika didanai oleh kementerian/dinas/BUMN.</FieldHint>
          </div>
        </div>
      </div>

      {/* 2. Data Usaha & Penanggung Jawab */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Data Usaha & Penanggung Jawab"
          required
          description="Data identitas resmi pelaku usaha sesuai NIB OSS."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutofillProfile}
              leftIcon={<User className="w-3.5 h-3.5 text-brand-600" />}
              className="text-xs h-9 px-3 rounded-lg border-brand-200 text-brand-700 bg-white hover:bg-brand-50 shadow-none shrink-0"
            >
              Gunakan Data Profil
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="input-nama-usaha" required>
              Nama Usaha / Perusahaan
            </FieldLabel>
            <input
              id="input-nama-usaha"
              type="text"
              className={inputClass}
              placeholder="Contoh: PT Sumber Berkah Pangan"
              value={payload.dataPelakuUsaha.nama_usaha}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  dataPelakuUsaha: {
                    ...prev.dataPelakuUsaha,
                    nama_usaha: e.target.value,
                  },
                }))
              }
            />
          </div>

          <div>
            <FieldLabel htmlFor="select-skala-usaha" required>
              Skala Usaha
            </FieldLabel>
            <select
              id="select-skala-usaha"
              className={selectClass}
              disabled={jalur === "self_declare"}
              value={payload.dataPelakuUsaha.skala_usaha}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  dataPelakuUsaha: {
                    ...prev.dataPelakuUsaha,
                    skala_usaha: e.target.value as SkalaUsaha,
                  },
                }))
              }
            >
              <option value="mikro">Usaha Mikro</option>
              <option value="kecil">Usaha Kecil</option>
              <option value="menengah">Usaha Menengah</option>
              <option value="besar">Usaha Besar</option>
              <option value="luar_negeri">Luar Negeri (PULN)</option>
            </select>
            {jalur === "self_declare" && (
              <FieldHint>Jalur Self Declare otomatis Usaha Mikro.</FieldHint>
            )}
          </div>

          <div>
            <FieldLabel htmlFor="input-nib" required>
              Nomor Induk Berusaha (NIB)
            </FieldLabel>
            <input
              id="input-nib"
              type="text"
              className={`${inputClass} font-mono`}
              placeholder="Nomor NIB 13 digit dari OSS"
              value={payload.dataPelakuUsaha.nib}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  dataPelakuUsaha: {
                    ...prev.dataPelakuUsaha,
                    nib: e.target.value,
                  },
                }))
              }
            />
            <FieldHint>13 digit angka resmi dari OSS RBA.</FieldHint>
          </div>

          <div>
            <FieldLabel htmlFor="input-npwp" optional>
              Nomor NPWP
            </FieldLabel>
            <input
              id="input-npwp"
              type="text"
              className={`${inputClass} font-mono`}
              placeholder="NPWP Perusahaan / Pribadi"
              value={payload.dataPelakuUsaha.npwp}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  dataPelakuUsaha: {
                    ...prev.dataPelakuUsaha,
                    npwp: e.target.value,
                  },
                }))
              }
            />
          </div>

          <div>
            <FieldLabel htmlFor="input-pj-nama" required>
              Nama Penanggung Jawab
            </FieldLabel>
            <input
              id="input-pj-nama"
              type="text"
              className={inputClass}
              placeholder="Nama Direktur / Pemilik Usaha"
              value={payload.dataPelakuUsaha.pj_nama}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  dataPelakuUsaha: {
                    ...prev.dataPelakuUsaha,
                    pj_nama: e.target.value,
                  },
                }))
              }
            />
            <FieldHint>Nama pimpinan / pemilik usaha sesuai KTP.</FieldHint>
          </div>

          <div>
            <FieldLabel htmlFor="input-pj-kontak" required>
              Nomor Kontak / WhatsApp PJ
            </FieldLabel>
            <input
              id="input-pj-kontak"
              type="text"
              className={inputClass}
              placeholder="0812xxxxxxxx"
              value={payload.dataPelakuUsaha.pj_kontak}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  dataPelakuUsaha: {
                    ...prev.dataPelakuUsaha,
                    pj_kontak: e.target.value,
                  },
                }))
              }
            />
          </div>

          <div className="md:col-span-2">
            <FieldLabel htmlFor="textarea-pj-alamat">
              Alamat Kantor Operasional
            </FieldLabel>
            <textarea
              id="textarea-pj-alamat"
              rows={2}
              className={textareaClass}
              placeholder="Alamat kantor / tempat usaha pemohon..."
              value={payload.dataPelakuUsaha.pj_alamat}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  dataPelakuUsaha: {
                    ...prev.dataPelakuUsaha,
                    pj_alamat: e.target.value,
                  },
                }))
              }
            />
          </div>
        </div>
      </div>
    </StepPanel>
  )
}
