import React from "react"
import { SharedDataLSP } from "../../../types/lsp"
import { ProfileClientType } from "../../../types/profile"
import { Button } from "../../ui/Button"
import {
  Building2,
  CreditCard,
  FileCheck2,
  ArrowLeft,
  Save,
  Send,
} from "lucide-react"
import {
  FormField,
  TextInput,
  TextareaInput,
  RadioCardGroup,
  LegalStatementBox,
  StickyFormActions,
} from "../../forms"

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
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. Data Unit Usaha / Instansi Pemohon */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              1. Data {instansiLabel}
            </h3>
            <p className="text-xs text-slate-500">
              Identitas unit usaha atau instansi yang menaungi peserta uji kompetensi
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <FormField label={`Nama ${instansiLabel}`} required>
            <TextInput
              name="nama_instansi"
              value={sharedData.nama_instansi}
              onChange={(e) => setSharedData((prev) => ({ ...prev, nama_instansi: e.target.value }))}
              placeholder={`Masukkan nama ${instansiLabel.toLowerCase()}...`}
            />
          </FormField>

          <FormField label="Alamat Kantor / Unit Usaha" required>
            <TextareaInput
              rows={3}
              name="alamat_instansi"
              value={sharedData.alamat_instansi}
              onChange={(e) => setSharedData((prev) => ({ ...prev, alamat_instansi: e.target.value }))}
              placeholder="Alamat domisili lengkap..."
            />
          </FormField>

          <FormField label="Jenis Bidang Industri / Sektor Usaha" required>
            <TextInput
              name="jenis_produk"
              value={sharedData.jenis_produk}
              onChange={(e) => setSharedData((prev) => ({ ...prev, jenis_produk: e.target.value }))}
              placeholder="Contoh: Industri Plastik, Karet, Kemasan, Otomotif..."
            />
          </FormField>
        </div>
      </div>

      {/* 2. Metode Penagihan (hanya tampil jika peserta > 1) */}
      {participantCount > 1 && (
        <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                2. Metode Pembayaran & Penagihan ({participantCount} Peserta)
              </h3>
              <p className="text-xs text-slate-500">
                Tentukan skema penerbitan tagihan Virtual Account (VA) untuk seluruh peserta
              </p>
            </div>
          </div>

          <RadioCardGroup
            options={[
              {
                value: "together",
                title: "Gabung Tagihan (1 Invoice Kolektif)",
                description: `Satu nomor invoice dan Virtual Account diterbitkan sekaligus untuk total ${participantCount} peserta.`,
                icon: <CreditCard className="w-4 h-4" />,
              },
              {
                value: "split",
                title: "Split Bill (Invoice Per Peserta)",
                description: `Masing-masing dari ${participantCount} peserta mendapat nomor permohonan dan nomor VA terpisah.`,
                icon: <CreditCard className="w-4 h-4" />,
              },
            ]}
            value={sharedData.billing_type}
            onChange={(val) => setSharedData((prev) => ({ ...prev, billing_type: val as "together" | "split" }))}
            gridCols={2}
          />
        </div>
      )}

      {/* 3. Persetujuan Syarat & Ketentuan Asesmen dengan LegalStatementBox */}
      <LegalStatementBox
        title="3. Persetujuan Syarat & Ketentuan Asesmen"
        subtitle="Tata tertib dan kewajiban peserta uji kompetensi LSP BBKKP"
        bulletPoints={[
          "Bersedia hadir dan mengikuti rangkaian uji kompetensi sesuai jadwal yang ditetapkan oleh LSP BBKKP.",
          "Menyelesaikan dan mengumpulkan seluruh bukti portofolio asesmen mandiri secara jujur, akurat, dan dapat dipertanggungjawabkan.",
          "Melunasi tarif PNBP sertifikasi kompetensi sesuai batas waktu tagihan yang ditentukan sistem.",
          "Mematuhi seluruh kode etik profesi dan tata tertib asesmen LSP BBKKP.",
        ]}
        checkboxLabel="Saya menyatakan bahwa data yang diisi benar dan menyetujui seluruh ketentuan asesmen di atas."
        checked={sharedData.setuju_syarat}
        onChange={(checked) => setSharedData((prev) => ({ ...prev, setuju_syarat: checked }))}
        required
        subtext="Permohonan akan diverifikasi oleh tim sekretariat LSP BBKKP sebelum jadwal uji kompetensi diterbitkan."
      />

      {/* Navigasi & Action Buttons */}
      <StickyFormActions
        canGoBack={true}
        onBack={onBack}
        backLabel="Kembali ke Data Peserta"
        onSaveDraft={() => onSubmit("draft")}
        saveDraftLabel="Simpan Draft"
        onSubmit={() => onSubmit("ajukan")}
        submitLabel={
          participantCount > 1
            ? `Simpan & Ajukan (${participantCount} Peserta)`
            : "Simpan & Ajukan Permohonan"
        }
        isLastStep={true}
        isSubmitting={submitting}
        isSticky={true}
      />
    </div>
  )
}

export default StepDataBersamaLSP