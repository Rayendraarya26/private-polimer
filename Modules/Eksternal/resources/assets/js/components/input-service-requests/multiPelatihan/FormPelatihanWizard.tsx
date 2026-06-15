import React, { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { toast } from "react-hot-toast"
import Swal from "sweetalert2"
import useProfile from "../../../hooks/useProfile"
import usePelatihan from "../../../hooks/service-requests/usePelatihan"
import { useLSP } from "../../../hooks/service-requests/useLSP"
import { ProfileClientType } from "../../../types/profile"
import {
  ParticipantData,
  SharedData,
  emptyParticipant,
  initialSharedData
} from "../../../types/pelatihan"
import StepDataPeserta from "./StepDataPeserta"
import StepDataBersama from "./StepDataBersama"

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
`

const StepperWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`

const StepCircle = styled.div<{ $active: boolean; $done: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;

  border: 2px solid
    ${({ $active, $done }) =>
      $done ? "#198754" : $active ? "#0d6efd" : "#dee2e6"};

  background:
    ${({ $active, $done }) =>
      $done ? "#198754" : $active ? "#0d6efd" : "transparent"};

  color:
    ${({ $active, $done }) =>
      ($done || $active) ? "#fff" : "#adb5bd"};
`

const StepLabel = styled.span<{ $active: boolean; $done: boolean }>`
  font-size: 0.85rem;
  font-weight: ${({ $active }) => $active ? 600 : 400};

  color:
    ${({ $active, $done }) =>
      $done ? "#198754" : $active ? "#0d6efd" : "#adb5bd"};

  margin-left: 10px;
`

const StepLine = styled.div<{ $done: boolean }>`
  flex: 1;
  height: 2px;
  background: ${({ $done }) => $done ? "#198754" : "#dee2e6"};
  margin: 0 12px;
`

const STEPS = ["Data Peserta", "Informasi & Persetujuan"]
const Stepper: React.FC<{ current: number }> = ({ current }) => (
  <StepperWrap>
    {STEPS.map((label, i) => (
      <React.Fragment key={i}>
        <StepItem>
          <StepCircle
            $active={current === i}
            $done={current > i}
          >
            {current > i ? "✓" : i + 1}
          </StepCircle>
          <StepLabel
            $active={current === i}
            $done={current > i}
          >
            {label}
          </StepLabel>
        </StepItem>
        {i < STEPS.length - 1 && (
          <StepLine $done={current > i} />
        )}
      </React.Fragment>
    ))}
  </StepperWrap>
)

interface Props {
  skemaId: string
  kapabilitas: number
}
const FormPelatihanWizard: React.FC<Props> = ({
  skemaId,
  kapabilitas
}) => {
  const MAX_SIZE = 3 * 1024 * 1024
  const { profile } = useProfile()
  const detail = profile?.detail
  const jenisPelanggan = detail?.type
  const isInstansi =
    jenisPelanggan !== ProfileClientType.PERORANGAN
  const {
    submitting,
    createPendaftaran
  } = usePelatihan()
  const {
    createPendaftaran: createPendaftaranLSP
  } = useLSP()
  const [step, setStep] = useState(0)
  const [nextId, setNextId] = useState(1)
  const [activeId, setActiveId] = useState(0)
  const [participants, setParticipants] =
    useState<ParticipantData[]>([
      emptyParticipant(0)
    ])
  const [sharedData, setSharedData] =
    useState<SharedData>(initialSharedData)
  useEffect(() => {
    if (!detail) return
    if (
      jenisPelanggan ===
      ProfileClientType.PERORANGAN
    ) {
      setParticipants([
        {
          ...emptyParticipant(0),
          nama_lengkap: detail.nama || "",
          gender: detail.jenis_kelamin || "",
          tempat_lahir: detail.tempat_lahir || "",
          tanggal_lahir: detail.tanggal_lahir || "",
          pendidikan: detail.pendidikan_terakhir || "",
          whatsapp: detail.whatsapp || "",
          email: detail.surel || "",
          nik_peserta: detail.nik
            ? String(detail.nik)
            : "",
          alamat_peserta: detail.alamat || "",
        }
      ])

    } else {
      setSharedData(prev => ({
        ...prev,
        nama_instansi: detail.nama || "",
        alamat_instansi: detail.alamat || "",
      }))

    }

  }, [detail, jenisPelanggan])
  const validateFileSize = (
    file: File | null | undefined,
    label: string,
    participantIndex: number
  ) => {
    if (!file) return true
    if (file.size > MAX_SIZE) {
      toast.error(
        `Peserta ${participantIndex + 1}: ${label} maksimal 3 MB`
      )
      return false
    }
    return true
  }
  const goNext = () => {
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i]
      if (!p.nama_lengkap)
        return toast.error(`Peserta ${i + 1}: Nama Lengkap belum diisi`), setActiveId(p.id)
      if (!p.gender)
        return toast.error(`Peserta ${i + 1}: Jenis Kelamin belum dipilih`), setActiveId(p.id)
      if (!p.tempat_lahir)
        return toast.error(`Peserta ${i + 1}: Tempat Lahir belum diisi`), setActiveId(p.id)
      if (!p.tanggal_lahir)
        return toast.error(`Peserta ${i + 1}: Tanggal Lahir belum diisi`), setActiveId(p.id)
      if (!p.pendidikan)
        return toast.error(`Peserta ${i + 1}: Pendidikan belum dipilih`), setActiveId(p.id)
      if (
        p.whatsapp &&
        !/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(p.whatsapp.trim())
      ) {
        toast.error(`Peserta ${i+1}: WhatsApp tidak valid`)
        setActiveId(p.id)
        return
      }
      if (!p.email)
        return toast.error(`Peserta ${i + 1}: Email belum diisi`), setActiveId(p.id)
      if (!p.nik_peserta)
        return toast.error(`Peserta ${i + 1}: NIK belum diisi`), setActiveId(p.id)
      if (!p.agama)
        return toast.error(`Peserta ${i + 1}: Agama belum dipilih`), setActiveId(p.id)
      if (!p.alamat_peserta)
        return toast.error(`Peserta ${i + 1}: Alamat belum diisi`), setActiveId(p.id)
      if (!p.ktp_peserta)
        return toast.error(`Peserta ${i + 1}: Upload KTP belum dilakukan`), setActiveId(p.id)
      if (!p.foto_peserta)
        return toast.error(`Peserta ${i + 1}: Upload Foto belum dilakukan`), setActiveId(p.id)
      if (!validateFileSize(p.ktp_peserta, "KTP", i))
        return setActiveId(p.id)
      if (!validateFileSize(p.foto_peserta, "Foto", i))
        return setActiveId(p.id)
      if (!/^\d{16}$/.test(p.nik_peserta))
        return toast.error(`Peserta ${i + 1}: NIK harus 16 digit`), setActiveId(p.id)
      if (
        !/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(p.whatsapp.trim())
      ) {
        toast.error(`Peserta ${i + 1}: Nomor WhatsApp tidak benar`)
        setActiveId(p.id)
        return
      }
      if (
        p.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)
      ) {
        return toast.error(`Peserta ${i + 1}: Format email tidak valid`), setActiveId(p.id)
      }
    }
    setStep(1)
  }
  const goBack = () => setStep(0)
  const handleSubmitAll = useCallback(async (
    aksi: "draft" | "ajukan"
  ) => {
    const isUjiKompetensi =
      Number(kapabilitas) === 1 &&
      sharedData.program ===
      "Pelatihan dan Uji Kompetensi"
    for (let i = 0; i < participants.length; i++) {
      const p = participants[i]
      if (!sharedData.nama_instansi)
        return toast.error("Nama usaha belum diisi")
      if (!sharedData.alamat_instansi)
        return toast.error("Alamat belum diisi")
      if (!sharedData.jenis_produk)
        return toast.error("Jenis produk belum diisi")
      if (!sharedData.masalah_materi)
        return toast.error("Permasalahan materi belum diisi")
      if (!sharedData.hal_dipelajari)
        return toast.error("Hal yang dipelajari belum diisi")
      if (!sharedData.program)
        return toast.error("Program belum dipilih")
      if (!sharedData.setuju_syarat)
        return toast.error("Persetujuan belum dicentang")
      if (isUjiKompetensi) {
        if (!p.kewarganegaraan)
          return toast.error(`Peserta ${i + 1}: Kewarganegaraan belum diisi`)
        if (!p.jabatan)
          return toast.error(`Peserta ${i + 1}: Jabatan belum diisi`)
        if (!p.pengalaman_kerja)
          return toast.error(`Peserta ${i + 1}: Pengalaman kerja belum diisi`)
        if (!p.kode_pos)
          return toast.error(`Peserta ${i + 1}: Kode pos belum diisi`)
        if (!p.ijazah)
          return toast.error(`Peserta ${i + 1}: Ijazah belum diupload`)
        if (!p.apl_01)
          return toast.error(`Peserta ${i + 1}: APL-01 belum diupload`)
        if (!p.apl_02)
          return toast.error(`Peserta ${i + 1}: APL-02 belum diupload`)
        if (!validateFileSize(p.ijazah, "Ijazah", i))
          return
        if (!validateFileSize(p.apl_01, "APL-01", i))
          return
        if (!validateFileSize(p.apl_02, "APL-02", i))
          return
        if (
          !/^\d{5}$/.test(p.kode_pos || "")
        ) {
          return toast.error(
            `Peserta ${i + 1}: Kode pos tidak valid`
          )
        }
      }
    }
    const confirm = await Swal.fire({
      title: "Konfirmasi Pengajuan",
      text: "Apakah Anda yakin semua data sudah benar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Kirim",
      cancelButtonText: "Periksa Kembali",
      reverseButtons: true
    })

    if (!confirm.isConfirmed) return
    let success = false
    await createPendaftaran(
      {
        ...sharedData,
        participants,
        billing_type: sharedData.billing_type,
        skema_id: skemaId,
        aksi
      },
      () => {
        success = true
      },
      true,
      true
    )
    if (!success) return
    if (isUjiKompetensi) {
      let successLSP = false
      await createPendaftaranLSP(
        {
          ...sharedData,
          participants,
          billing_type: sharedData.billing_type,
          skema_id: skemaId,
          aksi
        },
        () => {
          successLSP = true
        },
        true,
        true
      )
      if (!successLSP) return
    }
      toast.success(
        aksi === 'draft'
          ? `${participants.length} peserta berhasil disimpan sebagai draft`
          : sharedData.billing_type === 'split' && participants.length > 1
            ? `${participants.length} peserta berhasil diajukan (tagihan terpisah)`
            : `${participants.length} peserta berhasil diajukan`
      )
    setParticipants([emptyParticipant(0)])
    setSharedData(initialSharedData)
    setStep(0)
  }, [
    participants,
    sharedData,
    skemaId,
    kapabilitas,
    createPendaftaran,
    createPendaftaranLSP
  ])
  return (
    <div>
      <Stepper current={step} />
      {step === 0 && (
        <StepDataPeserta
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
        <StepDataBersama
          sharedData={sharedData}
          setSharedData={setSharedData}
          participants={participants}
          setParticipants={setParticipants}
          jenisPelanggan={jenisPelanggan}
          detail={detail}
          participantCount={participants.length}
          submitting={submitting}
          kapabilitas={kapabilitas}
          onBack={goBack}
          onSubmit={handleSubmitAll}
        />
      )}
    </div>
  )
}
export default FormPelatihanWizard