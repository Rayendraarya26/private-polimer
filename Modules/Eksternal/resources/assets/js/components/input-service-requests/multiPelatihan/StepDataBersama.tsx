import React from "react"
import { SharedData, ParticipantData } from "../../../types/pelatihan"
import { ProfileClientType } from "../../../types/profile"
import KapabilitasPelatihan from "./KapabilitasPelatihan"
import {
  Building2,
  BookOpen,
  Layers,
  CreditCard,
  FileCheck2,
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
  sharedData: SharedData
  setSharedData: React.Dispatch<React.SetStateAction<SharedData>>
  participants: ParticipantData[]
  setParticipants: React.Dispatch<React.SetStateAction<ParticipantData[]>>
  jenisPelanggan: string | undefined
  detail: any
  participantCount: number
  submitting: boolean
  kapabilitas: any
  onBack: () => void
  onSubmit: (aksi: "draft" | "ajukan") => void
}

const StepDataBersama: React.FC<Props> = ({
  sharedData,
  setSharedData,
  participants,
  setParticipants,
  jenisPelanggan,
  participantCount,
  submitting,
  kapabilitas,
  onBack,
  onSubmit,
}) => {
  const showLSPForm =
    kapabilitas === 1 && sharedData.program === "Pelatihan dan Uji Kompetensi"

  const instansiLabel =
    jenisPelanggan === ProfileClientType.PERORANGAN
      ? "Unit Usaha / Tempat Bekerja"
      : jenisPelanggan === ProfileClientType.INSTANSI_PEMERINTAH
      ? "Instansi Pemerintah"
      : "Badan Usaha / Perusahaan"

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* 1. Data Unit Usaha / Instansi */}
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
              Identitas entitas pengirim atau unit kerja pemohon pelatihan
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
              placeholder="Alamat kantor lengkap..."
            />
          </FormField>

          <FormField label="Jenis Produk / Sektor Industri" required>
            <TextInput
              name="jenis_produk"
              value={sharedData.jenis_produk}
              onChange={(e) => setSharedData((prev) => ({ ...prev, jenis_produk: e.target.value }))}
              placeholder="Contoh: Manufaktur Kemasan Plastik, Komponen Otomotif Karet..."
            />
          </FormField>
        </div>
      </div>

      {/* 2. Informasi Kebutuhan Materi Pelatihan */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              2. Kebutuhan Kurikulum & Sasaran Pelatihan
            </h3>
            <p className="text-xs text-slate-500">
              Uraikan kendala operasional teknis dan topik yang ingin dipelajari secara mendalam
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            label="Permasalahan yang Timbul Terkait Materi / Produksi"
            required
            helperText="Deskripsikan masalah teknis produksi atau kendala mutu yang dihadapi"
          >
            <TextareaInput
              rows={3}
              name="masalah_materi"
              value={sharedData.masalah_materi}
              onChange={(e) => setSharedData((prev) => ({ ...prev, masalah_materi: e.target.value }))}
              placeholder="Deskripsikan masalah teknis produksi atau kendala mutu yang dihadapi..."
            />
          </FormField>

          <FormField
            label="Hal Khusus yang Ingin Dipelajari / Dikuasai"
            required
            helperText="Contoh: Teknik formulasi aditif, optimasi setting cetak injeksi, pengujian mekanik SNI..."
          >
            <TextareaInput
              rows={3}
              name="hal_dipelajari"
              value={sharedData.hal_dipelajari}
              onChange={(e) => setSharedData((prev) => ({ ...prev, hal_dipelajari: e.target.value }))}
              placeholder="Contoh: Teknik formulasi aditif, optimasi setting cetak injeksi, pengujian mekanik SNI..."
            />
          </FormField>
        </div>
      </div>

      {/* 3. Paket / Program Pilihan */}
      <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              3. Paket Program Pelatihan
            </h3>
            <p className="text-xs text-slate-500">
              Pilih apakah hanya mengikuti bimbingan teknis atau bundling dengan uji kompetensi LSP
            </p>
          </div>
        </div>

        <RadioCardGroup
          options={[
            {
              value: "Pelatihan",
              title: "Pelatihan / Bimbingan Teknis Standar",
              description:
                "Mendapatkan sertifikat pelatihan teknis resmi yang diterbitkan oleh Balai Besar Kimia dan Kemasan (BBKKP).",
              icon: <BookOpen className="w-4 h-4" />,
            },
            ...(kapabilitas === 1
              ? [
                  {
                    value: "Pelatihan dan Uji Kompetensi",
                    title: "Pelatihan + Uji Kompetensi LSP",
                    description:
                      "Termasuk asesmen langsung untuk mendapatkan Sertifikasi Kompetensi Profesi berlisensi BNSP.",
                    badge: "Bundling BNSP",
                    icon: <Layers className="w-4 h-4" />,
                  },
                ]
              : []),
          ]}
          value={sharedData.program}
          onChange={(val) => setSharedData((prev) => ({ ...prev, program: val as any }))}
          gridCols={2}
        />
      </div>

      {/* Form Tambahan LSP Uji Kompetensi jika bundling dipilih */}
      {showLSPForm && (
        <div className="animate-in fade-in-50 duration-300">
          <KapabilitasPelatihan
            participants={participants}
            setParticipants={setParticipants}
          />
        </div>
      )}

      {/* 4. Metode Penagihan (hanya tampil jika peserta > 1) */}
      {participantCount > 1 && (
        <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                4. Metode Pembayaran & Penagihan ({participantCount} Peserta)
              </h3>
              <p className="text-xs text-slate-500">
                Pilih opsi penggabungan atau pemisahan tagihan invoice
              </p>
            </div>
          </div>

          <RadioCardGroup
            options={[
              {
                value: "together",
                title: "Gabung Tagihan (1 Invoice Bersama)",
                description: `Satu invoice kolektif mencakup seluruh biaya ${participantCount} peserta.`,
                icon: <CreditCard className="w-4 h-4" />,
              },
              {
                value: "split",
                title: "Split Bill (Invoice Terpisah)",
                description: "Masing-masing peserta menerima nomor tagihan dan Virtual Account mandiri.",
                icon: <CreditCard className="w-4 h-4" />,
              },
            ]}
            value={sharedData.billing_type}
            onChange={(val) => setSharedData((prev) => ({ ...prev, billing_type: val as any }))}
            gridCols={2}
          />
        </div>
      )}

      {/* 5. Persetujuan Syarat & Ketentuan Pelatihan */}
      <LegalStatementBox
        title="5. Persetujuan Syarat & Ketentuan Pelatihan"
        subtitle="Tata tertib dan komitmen kehadiran peserta pelatihan BBKKP"
        bulletPoints={[
          "Peserta berkomitmen mengikuti seluruh rangkaian sesi bimbingan teknis sampai selesai.",
          "Menyelesaikan evaluasi, studi kasus, atau praktikum laboratorium yang diberikan instruktur.",
          "Melunasi tarif PNBP biaya pelatihan sesuai invoice sebelum tanggal pelaksanaan dimulai.",
        ]}
        checkboxLabel="Dengan ini saya menyatakan bahwa data pendaftaran valid dan menyetujui seluruh ketentuan di atas."
        checked={sharedData.setuju_syarat}
        onChange={(checked) => setSharedData((prev) => ({ ...prev, setuju_syarat: checked }))}
        required
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
            ? `Ajukan (${participantCount} Peserta)`
            : "Simpan & Ajukan Permohonan"
        }
        isLastStep={true}
        isSubmitting={submitting}
        isSticky={true}
      />
    </div>
  )
}

export default StepDataBersama
