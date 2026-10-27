import React, { useEffect } from "react"
import {
  Wallet,
  UserCheck,
  Building2,
  Phone,
  Mail,
  CheckSquare,
  Square,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { InspeksiFormData } from "../../../types/inspeksi"
import useProfile from "../../../hooks/useProfile"
import {
  FormField,
  TextInput,
  TextareaInput,
} from "../../forms"

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
    <Card className="border-brand-100 shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
      <CardHeader className="bg-gradient-to-r from-brand-50/60 via-sky-50/40 to-white pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-slate-800">
              <Wallet className="w-4 h-4 text-brand-600" />
              3. Penanggung Biaya & Identitas Pemohon
            </CardTitle>
            <CardDescription>
              Lengkapi data entitas penanggung biaya inspeksi serta kontak personel penanggung jawab (PIC)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* 1. Biaya Inspeksi Ditanggung Oleh */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  Biaya Inspeksi Ditanggung Oleh
                </h4>
                <p className="text-[11px] text-slate-500">
                  Pihak yang bertanggung jawab atas pembiayaan jasa inspeksi
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleSamaDenganPemohon}
              className="flex items-center gap-2 text-xs font-medium text-brand-600 hover:text-brand-700 select-none cursor-pointer"
            >
              {dataBiaya.biaya_sama_dengan_pemohon ? (
                <CheckSquare className="w-4 h-4 text-brand-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>Sama dengan akun pemohon</span>
            </button>
          </div>

          <div className="space-y-4">
            <FormField label="Nama Perusahaan / Entitas Penanggung Biaya" required>
              <TextInput
                placeholder="Contoh: PT. Karunia Plastindo Abadi"
                leftIcon={<Building2 className="w-4 h-4 text-slate-400" />}
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
            </FormField>

            <FormField label="Alamat Lengkap Penanggung Biaya">
              <TextareaInput
                rows={2}
                placeholder="Contoh: Jln Raya Narogong Km 23.5, Desa Dayeuh, Kec. Cileungsi, Kab. Bogor, Jawa Barat"
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
            </FormField>

            <FormField label="Email Penanggung Biaya / Bagian Keuangan" helperText="Opsional">
              <TextInput
                type="email"
                placeholder="Contoh: adm.tender@karuniaplastindo.com"
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
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
            </FormField>
          </div>
        </div>

        {/* 2. Permintaan Diajukan Kepada BBSPJIKKP Oleh */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                Permintaan Inspeksi Diajukan Oleh (Personel PIC)
              </h4>
              <p className="text-[11px] text-slate-500">
                Kontak personel yang bertanggung jawab atas proses permohonan inspeksi ini
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nama Lengkap PIC / Pemohon" required>
              <TextInput
                placeholder="Contoh: Agung Budi Prasetya"
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
            </FormField>

            <FormField label="Nomor WhatsApp / HP Aktif" required>
              <TextInput
                placeholder="Contoh: 0856-9396-8191"
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
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
            </FormField>
          </div>

          <FormField label="Alamat Kantor / Unit Kerja PIC">
            <TextareaInput
              rows={2}
              placeholder="Alamat kantor atau pabrik tempat PIC bertugas..."
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
          </FormField>
        </div>
      </CardContent>
    </Card>
  )
}

export default Step3BiayaDanPemohon
