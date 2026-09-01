import React, { useEffect, useState } from "react"
import { SertifikasiFormData, emptyPengajuan } from "../../../types/sertifikasi"
import { Card, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { Plus, Trash2, Award, History, ArrowRight, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react"
import api from "../../../utils/api"

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

            <CardContent className="p-5 sm:p-6 space-y-4">
              <div className="text-xs font-semibold text-slate-600 mb-2">
                Pilih Jenis Permohonan:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option: Pengajuan Baru */}
                <div
                  onClick={() => setJenisPengajuan(idx, "baru")}
                  className={`relative rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${p.jenis_pengajuan === "baru"
                      ? "border-brand-600 bg-brand-50/40 ring-2 ring-brand-600/10 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${p.jenis_pengajuan === "baru"
                          ? "bg-brand-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          Pengajuan Sertifikat Baru
                        </span>
                        {p.jenis_pengajuan === "baru" && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold">
                            Dipilih
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Untuk produk komoditi atau sistem manajemen yang baru pertama kali diajukan sertifikasinya di BBKKP.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Asesmen lengkap tahap 1 & 2</span>
                    <input
                      type="radio"
                      name={`jenis_pengajuan_${idx}`}
                      checked={p.jenis_pengajuan === "baru"}
                      onChange={() => setJenisPengajuan(idx, "baru")}
                      className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {/* Option: Perpanjangan */}
                <div
                  onClick={() => setJenisPengajuan(idx, "lama")}
                  className={`relative rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${p.jenis_pengajuan === "lama"
                      ? "border-brand-600 bg-brand-50/40 ring-2 ring-brand-600/10 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${p.jenis_pengajuan === "lama"
                          ? "bg-brand-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      <History className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          Perpanjangan Sertifikat (Re-Sertifikasi)
                        </span>
                        {p.jenis_pengajuan === "lama" && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold">
                            Dipilih
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Untuk memperpanjang masa berlaku sertifikat SNI/ISO yang sudah mendekati habis masa berlaku.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Audit siklus lanjutan / surveilans</span>
                    <input
                      type="radio"
                      name={`jenis_pengajuan_${idx}`}
                      checked={p.jenis_pengajuan === "lama"}
                      onChange={() => setJenisPengajuan(idx, "lama")}
                      className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Dropdown Referensi Sertifikat Lama jika perpanjangan */}
              {p.jenis_pengajuan === "lama" && (
                <div className="pt-2 animate-in fade-in-50 duration-200">
                  <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-amber-950">
                        Pilih Sertifikat yang Ingin Diperpanjang <span className="text-rose-500">*</span>
                      </label>
                      {isLoadingRiwayat && (
                        <span className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                          <Loader2 className="w-3 h-3 animate-spin" /> Memuat daftar sertifikat...
                        </span>
                      )}
                    </div>

                    <select
                      value={p.sertifikat_lama_id || ""}
                      onChange={(e) => selectSertifikatLama(idx, e.target.value)}
                      disabled={isLoadingRiwayat}
                      className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-xs cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {isLoadingRiwayat
                          ? "-- Sedang memuat riwayat sertifikat... --"
                          : "-- Pilih Sertifikat Aktif Perusahaan --"}
                      </option>
                      {riwayatSertifikat.map((cert) => (
                        <option key={cert.id} value={cert.id}>
                          {cert.nomor_sertifikat} — {cert.skema_sertifikasi || cert.komoditi} {cert.tanggal_terbit || cert.tgl_terbit ? `(Terbit: ${cert.tanggal_terbit || cert.tgl_terbit})` : ""}
                        </option>
                      ))}
                    </select>

                    {/* Info Card Sertifikat Terpilih */}
                    {selectedCert && (
                      <div className="p-3.5 bg-white/90 border border-amber-200 rounded-xl space-y-1.5 text-xs animate-in fade-in-50 duration-150">
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

                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Sistem akan memvalidasi nomor registrasi dan riwayat masa berlaku sertifikat di database SIS BBSPJIKKP.
                    </p>
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
