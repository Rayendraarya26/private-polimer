import React, { useEffect } from "react"
import {
  Wallet,
  CheckSquare,
  Square,
} from "lucide-react"
import { InspeksiFormData } from "../../../types/inspeksi"
import useProfile from "../../../hooks/useProfile"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  inputClass,
  textareaClass,
} from "../common"

interface Step3BiayaDanPemohonProps {
  formData: InspeksiFormData
  setFormData: React.Dispatch<React.SetStateAction<InspeksiFormData>>
}

export const Step3BiayaDanPemohon: React.FC<Step3BiayaDanPemohonProps> = ({
  formData,
  setFormData,
}) => {
  const { profile } = useProfile()
  const { dataBiaya, dataPic } = formData

  // Autofill data profil pemohon saat load pertama kali
  useEffect(() => {
    if (!profile) return

    const detail = profile?.detail
    const companyName =
      detail?.nama ||
      (profile as any)?.company_name ||
      profile?.name ||
      ""

    const address = detail?.alamat || ""
    const email = profile?.email || detail?.surel || detail?.pj_surel || ""
    const picName = detail?.pj_nama || profile?.name || ""
    const phone =
      detail?.whatsapp ||
      detail?.pj_whatsapp ||
      detail?.telepon ||
      ""

    setFormData((prev) => ({
      ...prev,
      dataBiaya: {
        ...prev.dataBiaya,
        biaya_nama: prev.dataBiaya.biaya_sama_dengan_pemohon
          ? companyName
          : prev.dataBiaya.biaya_nama || companyName,
        biaya_alamat: prev.dataBiaya.biaya_sama_dengan_pemohon
          ? address
          : prev.dataBiaya.biaya_alamat || address,
        biaya_email: prev.dataBiaya.biaya_sama_dengan_pemohon
          ? email
          : prev.dataBiaya.biaya_email || email,
      },
      dataPic: {
        ...prev.dataPic,
        pemohon_pic_nama: prev.dataPic.pemohon_pic_nama || picName,
        pemohon_pic_kontak: prev.dataPic.pemohon_pic_kontak || phone,
        pemohon_pic_alamat: prev.dataPic.pemohon_pic_alamat || address,
      },
    }))
  }, [profile, setFormData])

  const handleToggleSamaDenganPemohon = () => {
    const nextVal = !dataBiaya.biaya_sama_dengan_pemohon
    const detail = profile?.detail
    const companyName =
      detail?.nama ||
      (profile as any)?.company_name ||
      profile?.name ||
      ""
    const address = detail?.alamat || ""
    const email = profile?.email || detail?.surel || detail?.pj_surel || ""

    setFormData((prev) => ({
      ...prev,
      dataBiaya: {
        ...prev.dataBiaya,
        biaya_sama_dengan_pemohon: nextVal,
        biaya_nama: nextVal ? companyName : "",
        biaya_alamat: nextVal ? address : "",
        biaya_email: nextVal ? email : "",
      },
    }))
  }

  return (
    <StepPanel
      icon={Wallet}
      title="Penanggung Biaya & Identitas Pemohon"
      description="Lengkapi data entitas penanggung biaya inspeksi serta kontak personel penanggung jawab (PIC)."
    >
      {/* 1. Biaya Inspeksi Ditanggung Oleh */}
      <div>
        <SectionHeading
          title="Biaya Inspeksi Ditanggung Oleh"
          description="Pihak yang bertanggung jawab atas pembiayaan jasa inspeksi operasional & PNBP."
          required
          action={
            <button
              type="button"
              onClick={handleToggleSamaDenganPemohon}
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 select-none cursor-pointer px-2.5 py-1 rounded-md hover:bg-brand-50 transition-colors"
            >
              {dataBiaya.biaya_sama_dengan_pemohon ? (
                <CheckSquare className="w-4 h-4 text-brand-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Sama dengan akun profil</span>
            </button>
          }
        />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="biaya_nama" required>
                Nama Perusahaan / Entitas Penanggung Biaya
              </FieldLabel>
              <input
                id="biaya_nama"
                type="text"
                placeholder="Contoh: PT. Karunia Plastindo Abadi"
                className={inputClass}
                value={dataBiaya.biaya_nama}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataBiaya: {
                      ...prev.dataBiaya,
                      biaya_nama: e.target.value,
                    },
                  }))
                }
              />
              <FieldHint>Nama badan usaha atau pihak yang akan menerima tagihan penawaran biaya</FieldHint>
            </div>

            <div>
              <FieldLabel htmlFor="biaya_email" optional>
                Email Penanggung Biaya / Keuangan
              </FieldLabel>
              <input
                id="biaya_email"
                type="email"
                placeholder="Contoh: finance@karuniaplastindo.com"
                className={inputClass}
                value={dataBiaya.biaya_email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataBiaya: {
                      ...prev.dataBiaya,
                      biaya_email: e.target.value,
                    },
                  }))
                }
              />
              <FieldHint>Alamat email untuk pengiriman invoice dan billing PNBP</FieldHint>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="biaya_alamat" optional>
              Alamat Lengkap Penanggung Biaya
            </FieldLabel>
            <textarea
              id="biaya_alamat"
              rows={2}
              placeholder="Contoh: Jln Raya Narogong Km 23.5, Desa Dayeuh, Kec. Cileungsi, Kab. Bogor, Jawa Barat"
              className={textareaClass}
              value={dataBiaya.biaya_alamat}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataBiaya: {
                    ...prev.dataBiaya,
                    biaya_alamat: e.target.value,
                  },
                }))
              }
            />
            <FieldHint>Alamat kantor domisili perusahaan penanggung biaya</FieldHint>
          </div>
        </div>
      </div>

      {/* 2. Permintaan Diajukan Kepada BBSPJIKKP Oleh */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Permintaan Inspeksi Diajukan Oleh (Personel PIC)"
          description="Kontak personel perwakilan yang bertanggung jawab atas kelancaran proses permohonan inspeksi ini."
          required
        />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="pemohon_pic_nama" required>
                Nama Lengkap PIC / Pemohon
              </FieldLabel>
              <input
                id="pemohon_pic_nama"
                type="text"
                placeholder="Contoh: Agung Budi Prasetya"
                className={inputClass}
                value={dataPic.pemohon_pic_nama}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataPic: {
                      ...prev.dataPic,
                      pemohon_pic_nama: e.target.value,
                    },
                  }))
                }
              />
              <FieldHint>Nama penanggung jawab operasional</FieldHint>
            </div>

            <div>
              <FieldLabel htmlFor="pemohon_pic_kontak" required>
                Nomor WhatsApp / HP Aktif
              </FieldLabel>
              <input
                id="pemohon_pic_kontak"
                type="text"
                placeholder="Contoh: 0856-9396-8191"
                className={inputClass}
                value={dataPic.pemohon_pic_kontak}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataPic: {
                      ...prev.dataPic,
                      pemohon_pic_kontak: e.target.value,
                    },
                  }))
                }
              />
              <FieldHint>Nomor aktif untuk koordinasi jadwal kedatangan tim inspektur</FieldHint>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="pemohon_pic_alamat" optional>
              Alamat Kantor / Unit Kerja PIC
            </FieldLabel>
            <textarea
              id="pemohon_pic_alamat"
              rows={2}
              placeholder="Alamat kantor atau pabrik tempat PIC bertugas..."
              className={textareaClass}
              value={dataPic.pemohon_pic_alamat}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataPic: {
                    ...prev.dataPic,
                    pemohon_pic_alamat: e.target.value,
                  },
                }))
              }
            />
            <FieldHint>Alamat unit kerja penanggung jawab</FieldHint>
          </div>
        </div>
      </div>
    </StepPanel>
  )
}

export default Step3BiayaDanPemohon
