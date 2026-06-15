import React, { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { toast } from "react-hot-toast"
import useProfile from "../../../hooks/useProfile"
import { useLSP } from "../../../hooks/service-requests/useLSP"
import { ProfileClientType } from "../../../types/profile"
import {
  ParticipantLSP, SharedDataLSP,
  emptyParticipantLSP, initialSharedDataLSP
} from "../../../types/lsp"
import StepDataPesertaLSP from "./StepDataPesertaLSP"
import StepDataBersamaLSP from "./StepDataBersamaLSP"
















// ── Stepper ──────────────────────────────────────────────────
const StepperWrap = styled.div`
  display: flex; align-items: center; margin-bottom: 2rem;
`
const StepCircle = styled.div<{ $active: boolean; $done: boolean }>`
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px; flex-shrink: 0;
  border: 2px solid ${({ $active, $done }) => $done ? '#198754' : $active ? '#0d6efd' : '#dee2e6'};
  background: ${({ $active, $done }) => $done ? '#198754' : $active ? '#0d6efd' : 'transparent'};
  color: ${({ $active, $done }) => ($done || $active) ? '#fff' : '#adb5bd'};
  transition: all 0.2s;
`
const StepLabel = styled.span<{ $active: boolean; $done: boolean }>`
  font-size: 0.85rem;
  font-weight: ${({ $active }) => $active ? 600 : 400};
  color: ${({ $active, $done }) => $done ? '#198754' : $active ? '#0d6efd' : '#adb5bd'};
  white-space: nowrap; margin-left: 10px;
`
const StepLine = styled.div<{ $done: boolean }>`
  flex: 1; height: 2px;
  background: ${({ $done }) => $done ? '#198754' : '#dee2e6'};
  margin: 0 12px; transition: background 0.2s;
`








const STEPS = ['Data Peserta', 'Data Instansi & Persetujuan']








const Stepper: React.FC<{ current: number }> = ({ current }) => (
  <StepperWrap>
    {STEPS.map((label, i) => (
      <React.Fragment key={i}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StepCircle $active={current === i} $done={current > i}>
            {current > i ? '✓' : i + 1}
          </StepCircle>
          <StepLabel $active={current === i} $done={current > i}>{label}</StepLabel>
        </div>
        {i < STEPS.length - 1 && <StepLine $done={current > i} />}
      </React.Fragment>
    ))}
  </StepperWrap>
)
















// ── Wizard ────────────────────────────────────────────────────
interface Props { skemaId: string }








const FormLSPWizard: React.FC<Props> = ({ skemaId }) => {
  const { profile } = useProfile()
  const detail = profile?.detail
  const jenisPelanggan = detail?.type
  const isInstansi = jenisPelanggan !== ProfileClientType.PERORANGAN
  const { submitting, createPendaftaran } = useLSP()








  const [step, setStep] = useState(0)
  const [nextId, setNextId] = useState(1)
  const [activeId, setActiveId] = useState(0)
  const [participants, setParticipants] = useState<ParticipantLSP[]>([emptyParticipantLSP(0)])
  const [sharedData, setSharedData] = useState<SharedDataLSP>(initialSharedDataLSP)








  useEffect(() => {
    if (!detail) return
    if (jenisPelanggan === ProfileClientType.PERORANGAN) {
      setParticipants([{
        ...emptyParticipantLSP(0),
        nama_lengkap: detail.nama || '',
        gender: detail.jenis_kelamin || '',
        tempat_lahir: detail.tempat_lahir || '',
        tanggal_lahir: detail.tanggal_lahir || '',
        pendidikan: detail.pendidikan_terakhir || '',
        nik_peserta: detail.nik ? String(detail.nik) : '',
        kewarganegaraan: detail.kewarganegaraan || '',
        whatsapp: detail.whatsapp || '',
        email: detail.surel || '',
        alamat_peserta: detail.alamat || '',
      }])
    } else {
      setSharedData(prev => ({
        ...prev,
        nama_instansi: detail.nama || '',
        alamat_instansi: detail.alamat || '',
      }))
    }
  }, [detail, jenisPelanggan])








  // ───────────────────────── STEP 1 VALIDATION ─────────────────────────
  const goNext = () => {
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i]








      if (!p.nama_lengkap)    { toast.error(`Peserta ${i+1}: Nama Lengkap belum diisi`); setActiveId(p.id); return }
      if (!p.tempat_lahir)    { toast.error(`Peserta ${i+1}: Tempat Lahir belum diisi`); setActiveId(p.id); return }
      if (!p.tanggal_lahir)   { toast.error(`Peserta ${i+1}: Tanggal Lahir belum diisi`); setActiveId(p.id); return }
      if (!p.gender)          { toast.error(`Peserta ${i+1}: Jenis Kelamin belum dipilih`); setActiveId(p.id); return }
      if (!p.alamat_peserta)  { toast.error(`Peserta ${i+1}: Alamat belum diisi`); setActiveId(p.id); return }
      if (!p.nik_peserta)     { toast.error(`Peserta ${i+1}: NIK belum diisi`); setActiveId(p.id); return }
      if (!p.kewarganegaraan) { toast.error(`Peserta ${i+1}: Kewarganegaraan belum diisi`); setActiveId(p.id); return }
      if (!p.kode_pos) return toast.error(`Peserta ${i+1}: Kode pos belum diisi`)
      if (!p.pendidikan)      { toast.error(`Peserta ${i+1}: Pendidikan belum dipilih`); setActiveId(p.id); return }
      if (!p.whatsapp)        { toast.error(`Peserta ${i+1}: WhatsApp belum diisi`); setActiveId(p.id); return }
      if (!p.email)           { toast.error(`Peserta ${i+1}: Email belum diisi`); setActiveId(p.id); return }
      if (!p.jabatan)         { toast.error(`Peserta ${i+1}: Jabatan belum diisi`); setActiveId(p.id); return }
      if (!p.pengalaman_kerja){ toast.error(`Peserta ${i+1}: Pengalaman Kerja belum diisi`); setActiveId(p.id); return }








      if (!p.ktp_peserta) { toast.error(`Peserta ${i+1}: KTP wajib diupload`); setActiveId(p.id); return }
      if (!p.ijazah)      { toast.error(`Peserta ${i+1}: Ijazah wajib diupload`); setActiveId(p.id); return }
      if (!p.apl_01)      { toast.error(`Peserta ${i+1}: APL-01 wajib diupload`); setActiveId(p.id); return }
      if (!p.apl_02)      { toast.error(`Peserta ${i+1}: APL-02 wajib diupload`); setActiveId(p.id); return }








      if (!/^\d{5}$/.test(p.kode_pos || "")) return toast.error(`Peserta ${i+1}: Kode pos tidak valid`)

      // FORMAT VALIDATION
      if (p.nik_peserta && !/^\d{16}$/.test(p.nik_peserta)) {
        toast.error(`Peserta ${i+1}: NIK harus 16 digit`)
        setActiveId(p.id)
        return
      }

      if (
        p.whatsapp &&
        !/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(p.whatsapp.trim())
      ) {
        toast.error(`Peserta ${i+1}: WhatsApp tidak valid`)
        setActiveId(p.id)
        return
      }

      if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
        toast.error(`Peserta ${i+1}: Format email tidak valid`)
        setActiveId(p.id)
        return
      }
    }

    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }


  const goBack = () => {
    setStep(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }


  // ───────────────────────── STEP 2 SUBMIT ─────────────────────────
  const handleSubmitAll = useCallback(async (aksi: 'draft' | 'ajukan') => {


    if (!skemaId) {
      toast.error("Skema belum dipilih")
      return
    }


    // =========================
    // STEP 2 VALIDATION
    // =========================
    for (let i = 0; i < participants.length; i++) {



      const p = participants[i]


      // INSTANSI
      if (!sharedData.nama_instansi) {
        toast.error("Nama usaha belum diisi")
        setActiveId(p.id)
        return
      }

      if (!sharedData.alamat_instansi) {
        toast.error("Alamat belum diisi")
        setActiveId(p.id)
        return
      }



      if (!sharedData.jenis_produk) {
        toast.error("Jenis Bidang Industri belum diisi")
        setActiveId(p.id)
        return
      }



      if (!sharedData.setuju_syarat) {
        toast.error("Anda harus menyetujui syarat dan ketentuan")
        setActiveId(p.id)
        return
      }

      // PESERTA
      if (!p.nama_lengkap) {
        toast.error(`Peserta ${i + 1}: Nama Lengkap belum diisi`)
        setActiveId(p.id)
        return
      }

      if (!p.tempat_lahir) {
        toast.error(`Peserta ${i + 1}: Tempat Lahir belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.tanggal_lahir) {
        toast.error(`Peserta ${i + 1}: Tanggal Lahir belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.gender) {
        toast.error(`Peserta ${i + 1}: Jenis Kelamin belum dipilih`)
        setActiveId(p.id)
        return
      }
      if (!p.alamat_peserta) {
        toast.error(`Peserta ${i + 1}: Alamat belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.nik_peserta) {
        toast.error(`Peserta ${i + 1}: NIK belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.kewarganegaraan) {
        toast.error(`Peserta ${i + 1}: Kewarganegaraan belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.kode_pos) {
        toast.error(`Peserta ${i + 1}: Kode pos belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.pendidikan) {
        toast.error(`Peserta ${i + 1}: Pendidikan belum dipilih`)
        setActiveId(p.id)
        return
      }
      if (!p.whatsapp) {
        toast.error(`Peserta ${i + 1}: WhatsApp belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.email) {
        toast.error(`Peserta ${i + 1}: Email belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.jabatan) {
        toast.error(`Peserta ${i + 1}: Jabatan belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.pengalaman_kerja) {
        toast.error(`Peserta ${i + 1}: Pengalaman Kerja belum diisi`)
        setActiveId(p.id)
        return
      }
      if (!p.ktp_peserta) {
        toast.error(`Peserta ${i + 1}: Upload KTP belum dilakukan`)
        setActiveId(p.id)
        return
      }
      if (!p.ijazah) {
        toast.error(`Peserta ${i + 1}: Ijazah belum diupload`)
        setActiveId(p.id)
        return
      }
      if (!p.apl_01) {
        toast.error(`Peserta ${i + 1}: APL-01 belum diupload`)
        setActiveId(p.id)
        return
      }
      if (!p.apl_02) {
        toast.error(`Peserta ${i + 1}: APL-02 belum diupload`)
        setActiveId(p.id)
        return
      }
      // FORMAT
      if (!/^\d{16}$/.test(p.nik_peserta)) {
        toast.error(`Peserta ${i + 1}: NIK harus 16 digit`)
        setActiveId(p.id)
        return
      }
      if (
        !/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(p.whatsapp.trim())
      ) {
        toast.error(`Peserta ${i + 1}: Nomor WhatsApp tidak benar`)
        setActiveId(p.id)
        return
      }

      if (!/^\d{5}$/.test(p.kode_pos || "")) {
        toast.error(`Peserta ${i + 1}: Kode pos tidak valid`)
        setActiveId(p.id)
        return
      }

      if (
        p.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)
      ) {
        toast.error(`Peserta ${i + 1}: Format email tidak valid`)
        setActiveId(p.id)
        return
      }
    }

  let success = false

  await createPendaftaran(
    {
      // shared
      nama_instansi:   sharedData.nama_instansi,
      alamat_instansi: sharedData.alamat_instansi,
      jenis_produk:    sharedData.jenis_produk,
      setuju_syarat:   sharedData.setuju_syarat,
      billing_type:    participants.length > 1 ? sharedData.billing_type : 'together',
      skema_id:        skemaId,
      aksi,
      // array peserta
      participants,
    },
    () => { success = true },
    false,  // skipConfirm — Swal muncul sekali
    true    // skipToast
  )

  if (!success) return

  // ✅ Toast sekali
  toast.success(
    aksi === 'draft'
      ? `${participants.length} peserta berhasil disimpan sebagai draft`
      : sharedData.billing_type === 'split' && participants.length > 1
        ? `${participants.length} peserta berhasil diajukan (tagihan terpisah)`
        : `${participants.length} peserta berhasil diajukan`
  )

  setParticipants([emptyParticipantLSP(0)])
  setNextId(1)
  setActiveId(0)
  setSharedData(initialSharedDataLSP)
  setStep(0)
  window.scrollTo({ top: 0, behavior: 'smooth' })

}, [participants, sharedData, skemaId, createPendaftaran])

  return (
    <div>
      <Stepper current={step} />

      {step === 0 && (
        <StepDataPesertaLSP
          participants={participants}
          setParticipants={setParticipants}
          nextId={nextId}
          setNextId={setNextId}
          isInstansi={isInstansi}
          detail={detail}
          jenisPelanggan={jenisPelanggan}
          activeId={activeId}
          setActiveId={setActiveId}
          onNext={goNext}
        />
      )}

      {step === 1 && (
        <StepDataBersamaLSP
          sharedData={sharedData}
          setSharedData={setSharedData}
          jenisPelanggan={jenisPelanggan}
          participantCount={participants.length}
          submitting={submitting}
          onBack={goBack}
          onSubmit={handleSubmitAll}
        />
      )}
    </div>
  )
}

export default FormLSPWizard
