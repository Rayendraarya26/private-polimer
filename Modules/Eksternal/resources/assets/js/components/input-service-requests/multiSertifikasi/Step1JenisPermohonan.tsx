import React, { useEffect, useState } from "react"
import { SertifikasiFormData, emptyPengajuan, defaultDokumenList } from "../../../types/sertifikasi"
import { Button } from "../../ui/Button"
import { TwoRowSelect, TwoRowSelectOption } from "../../ui/TwoRowSelect"
import { Plus, Trash2, Award, History, CheckCircle2, Layers } from "lucide-react"
import api from "../../../utils/api"
import {
  StepPanel,
  FieldLabel,
  FieldHint,
  OptionGroup,
  OptionCard,
  OptionIcon,
  selectClass,
  WizardNav,
} from "../common/WizardUI"

interface Props {
  formData: SertifikasiFormData
  setFormData: React.Dispatch<React.SetStateAction<SertifikasiFormData>>
  onNext: () => void
  onBack?: () => void
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
  items?: any[]
  dokumen_list?: any
}

export const Step1JenisPermohonan: React.FC<Props> = ({ formData, setFormData, onNext, onBack }) => {
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
        // Salin data komoditas dari sertifikat sebelumnya
        let newItems = updated[index].items || []
        if (selected.items && Array.isArray(selected.items) && selected.items.length > 0) {
          newItems = selected.items.map((it: any, iIdx: number) => ({
            id: it.id || Date.now() + iIdx,
            komoditi_id: it.komoditi_id,
            nama_produk: it.nama_produk || it.komoditi || "Produk Bersertifikat",
            merk_dagang: it.merk_dagang || it.merek || "-",
            tipe_jenis: it.tipe_jenis || it.tipe || "-",
            ukuran: it.ukuran || "-",
            standar_sni_iso: it.standar_sni_iso || it.sni || "-",
            kapasitas_produksi: it.kapasitas_produksi ? String(it.kapasitas_produksi) : "1000",
            satuan_produksi: it.satuan_produksi || "Pcs",
            keterangan: it.keterangan || "Data dari sertifikat sebelumnya",
          }))
        } else if (selected.komoditi) {
          newItems = [
            {
              id: Date.now(),
              nama_produk: selected.komoditi,
              merk_dagang: "-",
              tipe_jenis: "-",
              ukuran: "-",
              standar_sni_iso: "-",
              kapasitas_produksi: "1000",
              satuan_produksi: "Pcs",
              keterangan: "Data dari sertifikat sebelumnya",
            },
          ]
        }

        // Salin dokumen dari sertifikat sebelumnya
        const baseDocs =
          updated[index].dokumen_list && updated[index].dokumen_list.length > 0
            ? [...updated[index].dokumen_list]
            : defaultDokumenList.map((d) => ({ ...d }))

        const updatedDocs = baseDocs.map((doc) => {
          let docInfo: any = null
          if (selected.dokumen_list) {
            if (Array.isArray(selected.dokumen_list)) {
              docInfo = selected.dokumen_list.find((d: any) => d.id === doc.id)
            } else if (typeof selected.dokumen_list === "object") {
              docInfo = selected.dokumen_list[doc.id]
            }
          }
          if (docInfo && (docInfo.fileUrl || docInfo.file_url || docInfo.fileName || docInfo.file_name)) {
            return {
              ...doc,
              fileName: docInfo.fileName || docInfo.file_name || doc.nama,
              fileUrl: docInfo.fileUrl || docInfo.file_url,
              fileSize: docInfo.fileSize || docInfo.file_size || "1.5 MB",
            }
          }
          return doc
        })

        updated[index] = {
          ...updated[index],
          sertifikat_lama_id: String(selected.id),
          sertifikat_lama_text: selected.nomor_sertifikat,
          skema_id: selected.lingkup_id ? String(selected.lingkup_id) : updated[index].skema_id,
          items: newItems,
          dokumen_list: updatedDocs,
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

  const radioOptions = [
    {
      value: "baru",
      title: "Pengajuan Sertifikat Baru",
      description: "Untuk produk komoditi atau sistem manajemen yang baru pertama kali diajukan sertifikasinya di BBKKP.",
      icon: Award,
    },
    {
      value: "lama",
      title: "Perpanjangan Sertifikat (Re-Sertifikasi)",
      description: "Untuk memperpanjang masa berlaku sertifikat SNI/ISO yang sudah mendekati habis masa berlaku.",
      icon: History,
    },
  ]

  const certOptions: TwoRowSelectOption[] = riwayatSertifikat
    .filter((cert) => {
      // Pastikan hanya sertifikasi industri (bukan labuji, kalibrasi, inspeksi, dsb)
      const skema = (cert.skema_sertifikasi || "").toLowerCase()
      const nonSertifikasiKeywords = [
        "pengujian",
        "labuji",
        "kalibrasi",
        "labkal",
        "profisiensi",
        "inspeksi",
        "audit teknologi",
        "konsultasi",
        "miniplant",
        "pelatihan",
        "transformasi industri",
      ]
      return !nonSertifikasiKeywords.some((k) => skema.includes(k))
    })
    .map((cert) => {
      const skema = cert.skema_sertifikasi || cert.komoditi || "Sertifikasi Industri"
      const tgl = cert.tanggal_terbit || cert.tgl_terbit
      const subLabel = tgl ? `${skema} (Terbit: ${tgl})` : skema

      return {
        value: String(cert.id),
        label: cert.nomor_sertifikat,
        subLabel: subLabel,
      }
    })

  return (
    <div className="space-y-6">
      <StepPanel
        icon={Layers}
        title="Jenis Permohonan"
        description="Baru vs perpanjangan sertifikat"
      >
        <div className="space-y-6">
          {formData.pengajuan.map((p, idx) => {
            const selectedCert = riwayatSertifikat.find(
              (c) => String(c.id) === String(p.sertifikat_lama_id) || c.nomor_sertifikat === p.sertifikat_lama_text
            )

            const isMultiPengajuan = formData.pengajuan.length > 1

            return (
              <div
                key={p.id || idx}
                className={
                  isMultiPengajuan
                    ? "rounded-xl border border-slate-200 bg-white shadow-none"
                    : "space-y-5"
                }
              >
                {isMultiPengajuan && (
                  <div className="bg-slate-50/90 px-5 sm:px-6 py-3.5 border-b border-slate-200 rounded-t-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800">
                        Pengajuan Sertifikasi #{idx + 1}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => removePengajuan(idx)}
                      className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  </div>
                )}

                <div className={isMultiPengajuan ? "p-5 sm:p-6 space-y-5" : "space-y-5"}>
                  <div>
                    <FieldLabel required>Pilih Jenis Permohonan</FieldLabel>
                    <OptionGroup label="Pilih Jenis Permohonan" cols={2}>
                      {radioOptions.map((opt) => {
                        const Icon = opt.icon
                        const isSelected = p.jenis_pengajuan === opt.value
                        return (
                          <OptionCard
                            key={opt.value}
                            selected={isSelected}
                            onSelect={() => setJenisPengajuan(idx, opt.value as "baru" | "lama")}
                            leading={<OptionIcon icon={Icon} active={isSelected} />}
                            title={opt.title}
                            description={opt.description}
                          />
                        )
                      })}
                    </OptionGroup>
                  </div>

                  {/* Dropdown Referensi Sertifikat Lama jika perpanjangan (tanpa background & border) */}
                  {p.jenis_pengajuan === "lama" && (
                    <div className="pt-2 space-y-4">
                      <div>
                        <FieldLabel required>Pilih Sertifikat yang Ingin Diperpanjang</FieldLabel>
                        <TwoRowSelect
                          options={certOptions}
                          value={p.sertifikat_lama_id || ""}
                          onChange={(val) => selectSertifikatLama(idx, String(val))}
                          onClear={() => selectSertifikatLama(idx, "")}
                          disabled={isLoadingRiwayat}
                          placeholder={
                            isLoadingRiwayat
                              ? "-- Sedang memuat riwayat sertifikat... --"
                              : "-- Pilih Sertifikat Aktif Perusahaan --"
                          }
                          searchPlaceholder="Cari nomor sertifikat atau skema..."
                          isClearable={false}
                        />
                        <FieldHint>
                          {isLoadingRiwayat
                            ? "Sedang memuat riwayat sertifikat..."
                            : ""}
                        </FieldHint>
                      </div>

                      {/* Info Card Sertifikat Terpilih */}
                      {selectedCert && (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs shadow-none">
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
                  )}
                </div>
              </div>
            )
          })}

          {/* Button Tambah Pengajuan (Maksimal 2, di tengah tanpa teks) */}
          {formData.pengajuan.length < 2 && (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPengajuan}
                leftIcon={<Plus className="w-4 h-4 text-brand-600" />}
                className="border-brand-200 text-brand-700 hover:bg-brand-50 font-semibold cursor-pointer px-5 py-2 rounded-xl"
              >
                Tambah Pengajuan
              </Button>
            </div>
          )}
        </div>
      </StepPanel>

      {/* Navigation */}
      <WizardNav onBack={onBack} onNext={onNext} backLabel="Kembali" nextLabel="Selanjutnya" />
    </div>
  )
}

export default Step1JenisPermohonan
