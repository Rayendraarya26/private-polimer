import React from "react"
import { SharedDataLSP } from "../../../types/lsp"
import { ProfileClientType } from "../../../types/profile"
import { Building2 } from "lucide-react"
import {
  StepPanel,
  SectionHeading,
  FieldLabel,
  OptionGroup,
  OptionCard,
  inputClass,
  textareaClass,
} from "../common"
import { FormWizardActions } from "../../forms"

interface Props {
  sharedData: SharedDataLSP
  setSharedData: React.Dispatch<React.SetStateAction<SharedDataLSP>>
  jenisPelanggan: string | undefined
  participantCount: number
  submitting: boolean
  onBack: () => void
  onSubmit: (aksi: "draft" | "ajukan") => void
}

const StepDataBersamaLSP: React.FC<Props> = ({
  sharedData,
  setSharedData,
  jenisPelanggan,
  participantCount,
  submitting,
  onBack,
  onSubmit,
}) => {
  const instansiLabel =
    jenisPelanggan === ProfileClientType.PERORANGAN
      ? "Unit Usaha / Tempat Bekerja"
      : jenisPelanggan === ProfileClientType.INSTANSI_PEMERINTAH
      ? "Instansi Pemerintah"
      : "Badan Usaha / Perusahaan"

  return (
    <StepPanel
      icon={Building2}
      title="Data Instansi & Persetujuan"
      description="Identitas unit usaha, metode penagihan, dan persetujuan syarat asesmen uji kompetensi."
    >
      <div className="space-y-6">
        {/* 1. Data Unit Usaha / Instansi Pemohon */}
        <div className="space-y-4">
          <SectionHeading
            title={`1. Data ${instansiLabel}`}
            description="Identitas unit usaha atau instansi yang menaungi peserta uji kompetensi"
            required
          />

          <div className="space-y-4">
            <div>
              <FieldLabel required htmlFor="nama_instansi">
                Nama {instansiLabel}
              </FieldLabel>
              <input
                type="text"
                id="nama_instansi"
                name="nama_instansi"
                value={sharedData.nama_instansi}
                onChange={(e) =>
                  setSharedData((prev) => ({ ...prev, nama_instansi: e.target.value }))
                }
                placeholder={`Masukkan nama ${instansiLabel.toLowerCase()}...`}
                className={inputClass}
              />
            </div>

            <div>
              <FieldLabel required htmlFor="alamat_instansi">
                Alamat Kantor / Unit Usaha
              </FieldLabel>
              <textarea
                rows={3}
                id="alamat_instansi"
                name="alamat_instansi"
                value={sharedData.alamat_instansi}
                onChange={(e) =>
                  setSharedData((prev) => ({ ...prev, alamat_instansi: e.target.value }))
                }
                placeholder="Alamat domisili kantor/perusahaan lengkap..."
                className={textareaClass}
              />
            </div>

            <div>
              <FieldLabel required htmlFor="jenis_produk">
                Jenis Bidang Industri / Sektor Usaha
              </FieldLabel>
              <input
                type="text"
                id="jenis_produk"
                name="jenis_produk"
                value={sharedData.jenis_produk}
                onChange={(e) =>
                  setSharedData((prev) => ({ ...prev, jenis_produk: e.target.value }))
                }
                placeholder="Contoh: Industri Plastik, Karet, Kemasan, Otomotif, dll."
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 2. Metode Penagihan (hanya tampil jika peserta > 1) */}
        {participantCount > 1 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <SectionHeading
              title={`2. Metode Pembayaran & Penagihan (${participantCount} Peserta)`}
              description="Tentukan skema penerbitan tagihan Virtual Account (VA) untuk seluruh peserta"
              required
            />

            <OptionGroup label="Metode Pembayaran & Penagihan" cols={2}>
              <OptionCard
                selected={sharedData.billing_type === "together"}
                onSelect={() =>
                  setSharedData((prev) => ({ ...prev, billing_type: "together" }))
                }
                radioPosition="left"
                title="Gabung Tagihan (1 Invoice Kolektif)"
                description={`Satu nomor invoice dan Virtual Account diterbitkan sekaligus untuk total ${participantCount} peserta.`}
              />
              <OptionCard
                selected={sharedData.billing_type === "split"}
                onSelect={() =>
                  setSharedData((prev) => ({ ...prev, billing_type: "split" }))
                }
                radioPosition="left"
                title="Split Bill (Invoice Per Peserta)"
                description={`Masing-masing dari ${participantCount} peserta mendapat nomor permohonan dan nomor VA terpisah.`}
              />
            </OptionGroup>
          </div>
        )}

        {/* 3. Persetujuan Syarat & Ketentuan Asesmen */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <SectionHeading
            title="3. Persetujuan Syarat & Ketentuan Asesmen"
            description="Tata tertib dan kewajiban peserta uji kompetensi LSP BBKKP"
            required
          />

          <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700 list-disc list-outside pl-5 leading-relaxed">
              <li>
                Bersedia hadir dan mengikuti rangkaian uji kompetensi sesuai jadwal yang ditetapkan oleh LSP BBKKP.
              </li>
              <li>
                Menyelesaikan dan mengumpulkan seluruh bukti portofolio asesmen mandiri secara jujur, akurat, dan dapat dipertanggungjawabkan.
              </li>
              <li>
                Melunasi tarif PNBP sertifikasi kompetensi sesuai batas waktu tagihan yang ditentukan sistem.
              </li>
              <li>
                Mematuhi seluruh kode etik profesi dan tata tertib asesmen LSP BBKKP.
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sharedData.setuju_syarat}
                  onChange={(e) =>
                    setSharedData((prev) => ({ ...prev, setuju_syarat: e.target.checked }))
                  }
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-0 focus:outline-none cursor-pointer"
                />
                <span className="text-xs sm:text-[13px] font-semibold text-slate-900 leading-snug">
                  Saya menyatakan bahwa data yang diisi benar dan menyetujui seluruh ketentuan asesmen di atas.
                  <span className="text-rose-500 ml-1">*</span>
                </span>
              </label>
              <p className="text-[11px] text-slate-400 mt-1 pl-7">
                Permohonan akan diverifikasi oleh tim sekretariat LSP BBKKP sebelum jadwal uji kompetensi diterbitkan.
              </p>
            </div>
          </div>
        </div>

        {/* Navigasi & Action Buttons */}
        <FormWizardActions
          canGoBack={true}
          onBack={onBack}
          backLabel="Kembali ke Data Peserta"
          onSaveDraft={() => onSubmit("draft")}
          saveDraftLabel="Simpan Draft"
          onSubmit={() => onSubmit("ajukan")}
          submitLabel="Kirim Permohonan Sertifikasi"
          isSubmitting={submitting}
        />
      </div>
    </StepPanel>
  )
}

export default StepDataBersamaLSP
