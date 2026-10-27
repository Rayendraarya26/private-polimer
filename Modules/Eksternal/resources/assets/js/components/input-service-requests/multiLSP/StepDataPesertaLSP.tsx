import React, { useState } from "react"
import { toast } from "react-hot-toast"
import { ParticipantLSP, emptyParticipantLSP } from "../../../types/lsp"
import FormDataPesertaLSP from "./FormDataPesertaLSP"
import { Button } from "../../ui/Button"
import { UserPlus, UserCheck, Trash2, ArrowRight, Copy } from "lucide-react"

interface Props {
  participants: ParticipantLSP[]
  setParticipants: React.Dispatch<React.SetStateAction<ParticipantLSP[]>>
  nextId: number
  setNextId: React.Dispatch<React.SetStateAction<number>>
  isInstansi: boolean
  detail: any
  jenisPelanggan: string | undefined
  activeId: number
  setActiveId: React.Dispatch<React.SetStateAction<number>>
  onNext: () => void
  profile?: any
}

const StepDataPesertaLSP: React.FC<Props> = ({
  participants,
  setParticipants,
  nextId,
  setNextId,
  isInstansi,
  detail,
  jenisPelanggan,
  activeId,
  setActiveId,
  onNext,
  profile,
}) => {
  const [pilihanProfil, setPilihanProfil] = useState<Record<number, string>>({ 0: "saya" })

  const addParticipant = () => {
    const newP = emptyParticipantLSP(nextId)
    setParticipants((prev) => [...prev, newP])
    setActiveId(nextId)
    setNextId((prev) => prev + 1)
  }

  const duplicateParticipant = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const target = participants.find((p) => p.id === id)
    if (!target) return
    const duplicated: ParticipantLSP = {
      ...target,
      id: nextId,
      nama_lengkap: `${target.nama_lengkap} (Salinan)`,
      ktp_peserta: null,
      ijazah: null,
      apl_01: null,
      apl_02: null,
      upload_lainya: null,
    }
    setParticipants((prev) => [...prev, duplicated])
    setActiveId(nextId)
    setNextId((prev) => prev + 1)
    toast.success("Data peserta berhasil diduplikasi. Silakan periksa & unggah berkas asesi.")
  }

  const removeParticipant = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (participants.length === 1) return
    setParticipants((prev) => {
      const next = prev.filter((p) => p.id !== id)
      if (activeId === id) setActiveId(next[next.length - 1].id)
      return next
    })
  }

  const updateParticipant = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const file = type === "file" ? (e.target as HTMLInputElement).files?.[0] ?? null : null
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : false
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        if (type === "file") return { ...p, [name]: file }
        if (type === "checkbox") return { ...p, [name]: checked }
        return { ...p, [name]: value }
      })
    )
  }

  const updateParticipantField = (id: number, field: keyof ParticipantLSP, value: any) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        return { ...p, [field]: value }
      })
    )
  }

  const handlePilihanProfil = (id: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setPilihanProfil((prev) => ({ ...prev, [id]: val }))

    if (val === "pimpinan") {
      const { pimpinan, surel, whatsapp } = detail || {}
      setParticipants((prev) =>
        prev.map((p) =>
          p.id !== id
            ? p
            : {
                ...p,
                nama_lengkap: pimpinan || "",
                email: surel || "",
                whatsapp: whatsapp || "",
              }
        )
      )
      if (!pimpinan) toast.error("Nama Pimpinan kosong di profil.")
    } else if (val === "penanggung_jawab") {
      const { pj_nama, pj_surel, pj_whatsapp } = detail || {}
      setParticipants((prev) =>
        prev.map((p) =>
          p.id !== id
            ? p
            : {
                ...p,
                nama_lengkap: pj_nama || "",
                email: pj_surel || "",
                whatsapp: pj_whatsapp || "",
              }
        )
      )
      if (!pj_nama) toast.error("Nama Penanggung Jawab kosong di profil.")
    } else if (val === "saya") {
      const { whatsapp } = detail || {}
      setParticipants((prev) =>
        prev.map((p) =>
          p.id !== id
            ? p
            : {
                ...p,
                nama_lengkap: profile?.name || detail?.nama || "",
                email: profile?.email || detail?.surel || "",
                whatsapp: whatsapp || "",
              }
        )
      )
    } else {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id !== id
            ? p
            : {
                ...p,
                nama_lengkap: "",
                email: "",
                whatsapp: "",
              }
        )
      )
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Tab Navigasi Multi-Peserta */}
      {isInstansi && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-thin">
          {participants.map((p, index) => {
            const isActive = activeId === p.id
            return (
              <div
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer select-none ${
                  isActive
                    ? "bg-brand-600 text-white shadow-xs ring-2 ring-brand-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>
                  Peserta {index + 1}
                  {p.nama_lengkap ? `: ${p.nama_lengkap.split(" ")[0]}` : ""}
                </span>

                <div className="flex items-center gap-0.5 ml-1">
                  <span
                    onClick={(e) => duplicateParticipant(p.id, e)}
                    className={`p-1 rounded-md transition-colors ${
                      isActive ? "hover:bg-white/20 text-white" : "hover:bg-slate-200 text-slate-500"
                    }`}
                    title="Duplikasi data peserta ini"
                  >
                    <Copy className="w-3 h-3" />
                  </span>

                  {participants.length > 1 && (
                    <span
                      onClick={(e) => removeParticipant(p.id, e)}
                      className={`p-1 rounded-md transition-colors ${
                        isActive ? "hover:bg-rose-500/30 text-white" : "hover:bg-rose-100 text-rose-500"
                      }`}
                      title="Hapus peserta ini"
                    >
                      <Trash2 className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          <button
            type="button"
            onClick={addParticipant}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border-2 border-dashed border-slate-300 text-slate-600 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50/50 transition-all shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Tambah Peserta</span>
          </button>
        </div>
      )}

      {/* Render Peserta Aktif */}
      {participants.map((p) => {
        const profil = pilihanProfil[p.id] || "Manual"
        const disabled = !isInstansi || profil !== "Manual"
        return (
          <div key={p.id} style={{ display: p.id === activeId ? "block" : "none" }}>
            <FormDataPesertaLSP
              formData={p}
              onChange={(e) => updateParticipant(p.id, e)}
              onUpdateField={(field, val) => updateParticipantField(p.id, field, val)}
              jenisPelanggan={jenisPelanggan}
              detail={detail}
              pilihanProfil={profil}
              onPilihanProfilChange={(e) => handlePilihanProfil(p.id, e)}
              isFieldDisabled={disabled}
              fieldNamePrefix={String(p.id)}
            />
          </div>
        )
      })}

      {/* Action Footer */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="shadow-sm font-bold text-xs px-6"
        >
          Lanjut ke Data Instansi & Persetujuan
        </Button>
      </div>
    </div>
  )
}

export default StepDataPesertaLSP