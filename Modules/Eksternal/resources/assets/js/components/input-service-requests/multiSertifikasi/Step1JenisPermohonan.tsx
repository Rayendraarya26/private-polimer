import React, { useEffect, useState } from "react"
import { SertifikasiFormData, emptyPengajuan } from "../../../types/sertifikasi"
import { Card, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { Plus, Trash2, Award, History, ArrowRight, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react"
import api from "../../../utils/api"
import { FormField, SelectInput, RadioCardGroup, RadioCardOption } from "../../forms"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  onNext: () => void
}

export interface SertifikatRiwayatOption {
  id: string
  no_permohonan: string
  nomor_sertifikat: string
  lingkup_id?: string
  skema_sertifikasi?: string
  komoditi?: string
  sni?: string
  tanggal_terbit?: string
  tgl_terbit?: string
  status?: string
}

export const Step1JenisPermohonan: React.FC<Props> = ({ formData, setFormData, onNext }) => {
  const [riwayatSertifikat, setRiwayatSertifikat] = useState<SertifikatRiwayatOption[]>([])
  const [isLoadingRiwayat, setIsLoadingRiwayat] = useState(false)

  useEffect(() => {
    const fetchRiwayat = async () => {
      setIsLoadingRiwayat(true)
      try {
        const res = await api.get("/eksternal/sertifikasi/riwayat-aktif")
        if (res.data && (res.data.success || res.data.status === "success")) {
          const list = res.data.results || res.data.data || []
          setRiwayatSertifikat(list)
        }
      } catch (err) {
        console.error("Gagal mengambil riwayat sertifikat:", err)
      } finally {
        setIsLoadingRiwayat(false)
      }
    }

    fetchRiwayat()
  }, [])

  const addPengajuan = () => {
    if (formData.pengajuan.length >= 2) {
      return
    }
    setFormData((prev) => ({
      ...prev,
      pengajuan: [...prev.pengajuan, emptyPengajuan(Date.now())],
    }))
  }

  const removePengajuan = (index: number) => {
    if (formData.pengajuan.length <= 1) return
    setFormData((prev) => ({
      ...prev,
      pengajuan: prev.pengajuan.filter((_, i) => i !== index),
    }))
  }

  const setJenisPengajuan = (index: number, jenis: "baru" | "lama") => {
    setFormData((prev) => {
      const updated = [...prev.pengajuan]
      updated[index] = {
        ...updated[index],
        jenis_pengajuan: jenis,
        sertifikat_lama_id: jenis === "baru" ? "" : updated[index].sertifikat_lama_id,
        sertifikat_lama_text: jenis === "baru" ? "" : updated[index].sertifikat_lama_text,
      }
      return { ...prev, pengajuan: updated }
    })
  }

  const selectSertifikatLama = (index: number, certId: string) => {
    const selected = riwayatSertifikat.find((c) => String(c.id) === String(certId) || c.nomor_sertifikat === certId)
    setFormData((prev) => {
      const updated = [...prev.pengajuan]
      if (selected) {
        updated[index] = {
          ...updated[index],
          sertifikat_lama_id: String(selected.id),
          sertifikat_lama_text: selected.nomor_sertifikat,
          skema_id: selected.lingkup_id ? String(selected.lingkup_id) : updated[index].skema_id,
        }
      } else {
        updated[index] = {
          ...updated[index],
          sertifikat_lama_id: "",
          sertifikat_lama_text: "",
        }
      }
      return { ...prev, pengajuan: updated }
    })
  }

  const radioOptions: RadioCardOption[] = [
    {
      value: "baru",
      title: "Pengajuan Sertifikat Baru",
      description: "Untuk produk komoditi atau sistem manajemen yang baru pertama kali diajukan sertifikasinya di BBKKP.",
      icon: <Award className="w-4 h-4" />,
    },
    {
      value: "lama",
      title: "Perpanjangan Sertifikat (Re-Sertifikasi)",
      description: "Untuk memperpanjang masa berlaku sertifikat SNI/ISO yang sudah mendekati habis masa berlaku.",
      icon: <History className="w-4 h-4" />,
    },
  ]

  const certOptions = riwayatSertifikat.map((cert) => ({
    value: String(cert.id),
    label: `${cert.nomor_sertifikat} — ${cert.skema_sertifikasi || cert.komoditi || "Sertifikat"} ${
      cert.tanggal_terbit || cert.tgl_terbit ? `(Terbit: ${cert.tanggal_terbit || cert.tgl_terbit})` : ""
    }`,
  }))

  return (
    <div className="space-y-6">
      {formData.pengajuan.map((p, idx) => {
        const selectedCert = riwayatSertifikat.find(
          (c) => String(c.id) === String(p.sertifikat_lama_id) || c.nomor_sertifikat === p.sertifikat_lama_text
        )

        return (
          <Card key={p.id || idx} className="border-slate-200 overflow-hidden shadow-soft">
            <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-800">
                  Pengajuan Sertifikasi #{idx + 1}
                </h3>
              </div>

              {formData.pengajuan.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePengajuan(idx)}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus Pengajuan
                </button>
              )}
            </div>

            <CardContent className="p-5 sm:p-6 space-y-5">
              <FormField label="Pilih Jenis Permohonan" required>
                <RadioCardGroup
                  options={radioOptions}
                  value={p.jenis_pengajuan}
                  onChange={(val) => setJenisPengajuan(idx, val as "baru" | "lama")}
                  gridCols={2}
                />
              </FormField>

              {/* Dropdown Referensi Sertifikat Lama jika perpanjangan */}
              {p.jenis_pengajuan === "lama" && (
                <div className="pt-1 animate-in fade-in-50 duration-200">
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-4">
                    <FormField
                      label="Pilih Sertifikat yang Ingin Diperpanjang"
                      required
                      helperText={
                        isLoadingRiwayat
                          ? "Sedang memuat riwayat sertifikat..."
                          : "Sistem akan memvalidasi nomor registrasi dan riwayat masa berlaku sertifikat di database SIS BBSPJIKKP."
                      }
                    >
                      <SelectInput
                        value={p.sertifikat_lama_id || ""}
                        onChange={(val) => selectSertifikatLama(idx, String(val))}
                        options={certOptions}
                        placeholder={
                          isLoadingRiwayat
                            ? "-- Sedang memuat riwayat sertifikat... --"
                            : "-- Pilih Sertifikat Aktif Perusahaan --"
                        }
                        disabled={isLoadingRiwayat}
                      />
                    </FormField>

                    {/* Info Card Sertifikat Terpilih */}
                    {selectedCert && (
                      <div className="p-3.5 bg-white border border-amber-200 rounded-xl space-y-1.5 text-xs animate-in fade-in-50 duration-150">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Sertifikat Terpilih: {selectedCert.nomor_sertifikat}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                          <p><span className="font-semibold text-slate-800">Skema:</span> {selectedCert.skema_sertifikasi || "-"}</p>
                          <p><span className="font-semibold text-slate-800">Tanggal Terbit:</span> {selectedCert.tanggal_terbit || selectedCert.tgl_terbit || "-"}</p>
                          <p><span className="font-semibold text-slate-800">No. Permohonan:</span> {selectedCert.no_permohonan || "-"}</p>
                          <p><span className="font-semibold text-slate-800">Status:</span> <span className="text-emerald-600 font-bold">Aktif</span></p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      {/* Button Tambah Pengajuan (Maksimal 2) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
          <span>
            {formData.pengajuan.length >= 2
              ? "Batas maksimal 2 pengajuan permohonan sertifikasi telah tercapai."
              : "Anda dapat mengajukan maksimal 2 permohonan sertifikasi sekaligus dalam satu formulir."}
          </span>
        </div>

        {formData.pengajuan.length < 2 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPengajuan}
            leftIcon={<Plus className="w-4 h-4 text-brand-600" />}
            className="border-brand-200 text-brand-700 hover:bg-brand-50 shrink-0 font-semibold"
          >
            Tambah Pengajuan
          </Button>
        ) : (
          <span className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 text-xs font-semibold shrink-0">
            Maksimal 2 Pengajuan
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="px-6"
        >
          Lanjut ke Langkah 2
        </Button>
      </div>
    </div>
  )
}

export default Step1JenisPermohonan
