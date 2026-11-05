import React from "react"
import { toast } from "react-hot-toast"
import { ParticipantData, emptyParticipant } from "../../../types/pelatihan"
import FormDataPeserta from "./FormDataPeserta"
import { FormWizardActions } from "../../forms"
import { UserPlus, UserCheck, Trash2, Copy, Users } from "lucide-react"
import { StepPanel } from "../common"

interface Props {
  participants: ParticipantData[]
  setParticipants: React.Dispatch<React.SetStateAction<ParticipantData[]>>
  nextId: number
  setNextId: React.Dispatch<React.SetStateAction<number>>
  isInstansi: boolean
  detail: any
  jenisPelanggan: string | undefined
  activeId: number
  setActiveId: React.Dispatch<React.SetStateAction<number>>
  onNext: () => void
  onBack?: () => void
  profile?: any
  skemaName?: string
}

const StepDataPeserta: React.FC<Props> = ({
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
  onBack,
  profile,
  skemaName,
}) => {
  const addParticipant = () => {
    const newP = emptyParticipant(nextId)
    setParticipants((prev) => [...prev, newP])
    setActiveId(nextId)
    setNextId((prev) => prev + 1)
  }

  const duplicateParticipant = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const target = participants.find((p) => p.id === id)
    if (!target) return
    const duplicated: ParticipantData = {
      ...target,
      id: nextId,
      nama_lengkap: `${target.nama_lengkap} (Salinan)`,
      ktp_peserta: null,
      foto_peserta: null,
    }
    setParticipants((prev) => [...prev, duplicated])
    setActiveId(nextId)
    setNextId((prev) => prev + 1)
    toast.success("Data peserta berhasil diduplikasi. Silakan periksa & unggah berkas peserta.")
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

  const updateParticipantField = (id: number, field: keyof ParticipantData, value: any) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        return { ...p, [field]: value }
      })
    )
  }

  return (
    <div className="space-y-4">
      <StepPanel
        icon={Users}
        title="Data Peserta Pelatihan"
        description="Lengkapi biodata peserta dan unggah berkas persyaratan pelatihan."
      >
        <div className="space-y-6">
          {/* Tab Navigasi Multi-Peserta */}
          {isInstansi && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 scrollbar-none">
              {participants.map((p, index) => {
                const isActive = activeId === p.id
                return (
                  <div
                    key={p.id}
                    onClick={() => setActiveId(p.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer select-none ${
                      isActive
                        ? "bg-brand-600 text-white shadow-xs"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold border-2 border-dashed border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50/50 transition-all shrink-0 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tambah Peserta</span>
              </button>
            </div>
          )}

          {/* Render Peserta Aktif */}
          {participants.map((p) => (
            <div key={p.id} style={{ display: p.id === activeId ? "block" : "none" }}>
              <FormDataPeserta
                formData={p}
                onChange={(e) => updateParticipant(p.id, e)}
                onUpdateField={(field, val) => updateParticipantField(p.id, field, val)}
                jenisPelanggan={jenisPelanggan}
                detail={detail}
                fieldNamePrefix={String(p.id)}
              />
            </div>
          ))}
        </div>
      </StepPanel>

      {/* Action Footer (di luar card) */}
      <FormWizardActions
        canGoBack={true}
        onBack={onBack}
        onNext={onNext}
        backLabel="Sebelumnya"
        nextLabel="Selanjutnya"
      />
    </div>
  )
}

export default StepDataPeserta
