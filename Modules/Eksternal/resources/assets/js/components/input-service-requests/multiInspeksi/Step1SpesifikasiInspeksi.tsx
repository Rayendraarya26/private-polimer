import React from "react"
import {
  PackageCheck,
  FileText,
  ShieldCheck,
  Layers,
  MapPin,
  Check,
} from "lucide-react"
import { InspeksiFormData, JenisInspeksi } from "../../../types/inspeksi"
import { toast } from "react-hot-toast"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  FieldHint,
  QuantityStepper,
  inputClass,
  selectClass,
  textareaClass,
  cx,
} from "../common"

interface Step1SpesifikasiInspeksiProps {
  formData: InspeksiFormData
  setFormData: React.Dispatch<React.SetStateAction<InspeksiFormData>>
}

export const Step1SpesifikasiInspeksi: React.FC<Step1SpesifikasiInspeksiProps> = ({
  formData,
  setFormData,
}) => {
  const { dataPermohonan, dataSpesifikasi, dataPelaksanaan } = formData

  const handleJenisToggle = (jenis: JenisInspeksi) => {
    setFormData((prev) => {
      const current = prev.dataSpesifikasi.jenis_inspeksi
      let updated: JenisInspeksi[]
      if (current.includes(jenis)) {
        if (current.length === 1) {
          toast.error("Minimal satu jenis inspeksi harus dipilih")
          return prev
        }
        updated = current.filter((item) => item !== jenis)
      } else {
        updated = [...current, jenis]
      }
      return {
        ...prev,
        dataSpesifikasi: {
          ...prev.dataSpesifikasi,
          jenis_inspeksi: updated,
        },
      }
    })
  }

  const isKuantitas = dataSpesifikasi.jenis_inspeksi.includes("kuantitas")
  const isKualitas = dataSpesifikasi.jenis_inspeksi.includes("kualitas")

  return (
    <StepPanel
      icon={PackageCheck}
      title="Spesifikasi Karung & Rencana Pelaksanaan Inspeksi"
      description="Lengkapi surat pengantar pemohon, jenis inspeksi yang diminta, rincian karung plastik, serta jadwal pelaksanaan lapangan."
    >
      {/* 1. Data Surat Permohonan Klien */}
      <div>
        <SectionHeading
          title="Surat Permintaan / Pengantar Klien"
          description="Informasi surat resmi dari perusahaan atau instansi pemohon (jika ada)."
          optional
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="no_surat_pemohon" optional>
              Nomor Surat Pemohon
            </FieldLabel>
            <input
              id="no_surat_pemohon"
              type="text"
              placeholder="Contoh: 018/KPA-DIR/VII/2026"
              className={inputClass}
              value={dataPermohonan.no_surat_pemohon}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataPermohonan: {
                    ...prev.dataPermohonan,
                    no_surat_pemohon: e.target.value,
                  },
                }))
              }
            />
            <FieldHint>Nomor surat resmi pengantar jika permohonan bersurat resmi</FieldHint>
          </div>

          <div>
            <FieldLabel htmlFor="tgl_surat_pemohon" optional>
              Tanggal Surat Pemohon
            </FieldLabel>
            <input
              id="tgl_surat_pemohon"
              type="date"
              className={inputClass}
              value={dataPermohonan.tgl_surat_pemohon}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataPermohonan: {
                    ...prev.dataPermohonan,
                    tgl_surat_pemohon: e.target.value,
                  },
                }))
              }
            />
            <FieldHint>Tanggal surat yang tertera pada pengantar resmi</FieldHint>
          </div>
        </div>
      </div>

      {/* 2. Jenis Inspeksi yang Diminta */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Jenis Inspeksi yang Diminta"
          description="Pilih lingkup inspeksi kemasan yang dikehendaki (dapat memilih salah satu atau keduanya)."
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Opsi 1: Inspeksi Kuantitas */}
          <div
            role="checkbox"
            aria-checked={isKuantitas}
            tabIndex={0}
            onClick={() => handleJenisToggle("kuantitas")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleJenisToggle("kuantitas")
              }
            }}
            className={cx(
              "group relative flex items-start gap-3 rounded-lg border text-left cursor-pointer select-none transition-all duration-150 p-4 shadow-none outline-none focus:outline-none ring-0",
              isKuantitas
                ? "border-2 border-brand-600 bg-white"
                : "border border-slate-200 bg-white hover:border-slate-300"
            )}
          >
            <span
              className={cx(
                "w-8 h-8 rounded-md border flex items-center justify-center shrink-0 transition-colors mt-0.5",
                isKuantitas
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 bg-white text-slate-500 group-hover:border-slate-300"
              )}
            >
              <PackageCheck className="w-4 h-4" />
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] font-bold text-slate-900 leading-snug">
                  Inspeksi Kuantitas
                </p>
                <span
                  className={cx(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 transition-colors",
                    isKuantitas
                      ? "bg-brand-100/80 text-brand-700 border-brand-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  )}
                >
                  Fisik & Lot
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Pemeriksaan jumlah partai/lot kemasan, verifikasi volume fisik, penandaan kemasan, dan
                kesesuaian jumlah pesanan.
              </p>
            </div>

            <span className="shrink-0 mt-0.5">
              {isKuantitas ? (
                <span className="w-[18px] h-[18px] rounded-md border border-brand-600 flex items-center justify-center text-brand-600 bg-white">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
              ) : (
                <span className="w-[18px] h-[18px] rounded-md border border-slate-300 block bg-white" />
              )}
            </span>
          </div>

          {/* Opsi 2: Inspeksi Kualitas */}
          <div
            role="checkbox"
            aria-checked={isKualitas}
            tabIndex={0}
            onClick={() => handleJenisToggle("kualitas")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleJenisToggle("kualitas")
              }
            }}
            className={cx(
              "group relative flex items-start gap-3 rounded-lg border text-left cursor-pointer select-none transition-all duration-150 p-4 shadow-none outline-none focus:outline-none ring-0",
              isKualitas
                ? "border-2 border-brand-600 bg-white"
                : "border border-slate-200 bg-white hover:border-slate-300"
            )}
          >
            <span
              className={cx(
                "w-8 h-8 rounded-md border flex items-center justify-center shrink-0 transition-colors mt-0.5",
                isKualitas
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 bg-white text-slate-500 group-hover:border-slate-300"
              )}
            >
              <ShieldCheck className="w-4 h-4" />
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] font-bold text-slate-900 leading-snug">
                  Inspeksi Kualitas
                </p>
                <span
                  className={cx(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 transition-colors",
                    isKualitas
                      ? "bg-brand-100/80 text-brand-700 border-brand-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  )}
                >
                  Uji Teknis
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Pengujian kesesuaian dimensi kemasan, kerapatan anyaman/mesh, gramatur, kekuatan tarik,
                jahitan, serta hasil printing logo.
              </p>
            </div>

            <span className="shrink-0 mt-0.5">
              {isKualitas ? (
                <span className="w-[18px] h-[18px] rounded-md border border-brand-600 flex items-center justify-center text-brand-600 bg-white">
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
              ) : (
                <span className="w-[18px] h-[18px] rounded-md border border-slate-300 block bg-white" />
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Spesifikasi Karung Plastik */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Objek & Karakteristik Karung Plastik"
          description="Spesifikasi teknis karung plastik kemasan yang akan diperiksa oleh tim inspektur."
          required
        />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="komoditas_karung" required>
                Komoditas / Nama Karung
              </FieldLabel>
              <input
                id="komoditas_karung"
                type="text"
                placeholder="Contoh: Karung Plastik Beras Bantuan Pangan"
                className={inputClass}
                value={dataSpesifikasi.komoditas}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataSpesifikasi: {
                      ...prev.dataSpesifikasi,
                      komoditas: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <div>
              <FieldLabel htmlFor="kapasitas_karung" required>
                Kapasitas Karung
              </FieldLabel>
              <select
                id="kapasitas_karung"
                className={selectClass}
                value={dataSpesifikasi.kapasitas_karung}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataSpesifikasi: {
                      ...prev.dataSpesifikasi,
                      kapasitas_karung: e.target.value,
                    },
                  }))
                }
              >
                <option value="">-- Pilih Kapasitas Karung --</option>
                <option value="5 kg">5 kg</option>
                <option value="10 kg">10 kg</option>
                <option value="20 kg">20 kg</option>
                <option value="25 kg">25 kg</option>
                <option value="50 kg">50 kg</option>
                <option value="Lainnya">Lainnya / Custom</option>
              </select>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="spesifikasi_dimensi" optional>
              Rincian Dimensi & Spesifikasi Karung yang Diminta
            </FieldLabel>
            <textarea
              id="spesifikasi_dimensi"
              rows={3}
              placeholder="Contoh: Kemasan beras 10kg, dimensi 30 cm x 45 cm, anyaman 10x10, gramatur dan jahitan sesuai spesifikasi tender..."
              className={textareaClass}
              value={dataSpesifikasi.spesifikasi_dimensi}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataSpesifikasi: {
                    ...prev.dataSpesifikasi,
                    spesifikasi_dimensi: e.target.value,
                  },
                }))
              }
            />
            <FieldHint>Uraikan dimensi panjang/lebar, anyaman, gramatur, atau jahitan khusus jika ada</FieldHint>
          </div>

          <div>
            <FieldLabel htmlFor="jumlah_partai_lot" required>
              Perkiraan Jumlah Partai / Lot Pemeriksaan
            </FieldLabel>
            <div className="flex items-center gap-3">
              <QuantityStepper
                value={dataSpesifikasi.jumlah_partai_lot || 1}
                min={1}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataSpesifikasi: {
                      ...prev.dataSpesifikasi,
                      jumlah_partai_lot: val,
                    },
                  }))
                }
                title="Jumlah Partai / Lot"
              />
              <span className="text-xs text-slate-600 font-medium">Partai / Lot</span>
            </div>
            <FieldHint>Jumlah partai atau lot yang akan diambil sampel pemeriksaannya di lapangan</FieldHint>
          </div>
        </div>
      </div>

      {/* 4. Rencana Pelaksanaan & Lokasi Gudang */}
      <div className="pt-6 border-t border-slate-200">
        <SectionHeading
          title="Rencana Tanggal & Lokasi Pemeriksaan On-Site"
          description="Jadwal dan alamat fasilitas pabrik/gudang yang dikunjungi tim inspektur."
          required
        />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="tgl_rencana_inspeksi" required>
                Rencana Tanggal Inspeksi
              </FieldLabel>
              <input
                id="tgl_rencana_inspeksi"
                type="date"
                className={inputClass}
                value={dataPelaksanaan.tgl_rencana_inspeksi}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dataPelaksanaan: {
                      ...prev.dataPelaksanaan,
                      tgl_rencana_inspeksi: e.target.value,
                    },
                  }))
                }
              />
              <FieldHint>Estimasi tanggal kesiapan inspeksi di lokasi pabrik/gudang</FieldHint>
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="lokasi_inspeksi" required>
              Alamat Lengkap Pabrik / Gudang Inspeksi
            </FieldLabel>
            <textarea
              id="lokasi_inspeksi"
              rows={2}
              placeholder="Contoh: PT Cahaya Abadi Sentosa - Jl. Raya Solo-Sragen Km. 7, Desa Jaten, Kec. Jaten, Kab. Karanganyar, Jawa Tengah"
              className={textareaClass}
              value={dataPelaksanaan.lokasi_inspeksi}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dataPelaksanaan: {
                    ...prev.dataPelaksanaan,
                    lokasi_inspeksi: e.target.value,
                  },
                }))
              }
            />
            <FieldHint>Alamat detail tempat karung disimpan dan siap diperiksa</FieldHint>
          </div>
        </div>
      </div>
    </StepPanel>
  )
}

export default Step1SpesifikasiInspeksi
