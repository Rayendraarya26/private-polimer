import React, { useState } from "react"
import styled from "styled-components"
import { Button } from "react-bootstrap"
import { toast } from "react-hot-toast"
import { ParticipantData, emptyParticipant } from "../../../types/pelatihan"
import FormDataPeserta from "./FormDataPeserta"




const TabBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  border-bottom: 2px solid #dee2e6;
  margin-bottom: 1.5rem;
`
const Tab = styled.button<{ $active: boolean }>`
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px;
  border: 1px solid ${({ $active }) => ($active ? '#0d6efd' : '#dee2e6')};
  border-bottom: ${({ $active }) => ($active ? '2px solid #fff' : '1px solid #dee2e6')};
  border-radius: 8px 8px 0 0;
  background: ${({ $active }) => ($active ? '#fff' : '#f8f9fa')};
  color: ${({ $active }) => ($active ? '#0d6efd' : '#6c757d')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-size: 0.875rem; cursor: pointer;
  position: relative; bottom: -2px; transition: all 0.15s;
  &:hover { background: ${({ $active }) => ($active ? '#fff' : '#e9ecef')}; }
`
const CloseBtn = styled.span`
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%; font-size: 12px;
  color: #adb5bd; transition: background 0.1s, color 0.1s;
  &:hover { background: #dc3545; color: #fff; }
`
const AddTabBtn = styled.button`
  display: flex; align-items: center; gap: 4px;
  padding: 6px 12px; border: 1px dashed #adb5bd;
  border-radius: 8px 8px 0 0; background: transparent;
  color: #6c757d; font-size: 0.8rem; cursor: pointer;
  position: relative; bottom: -2px; transition: all 0.15s;
  &:hover { border-color: #0d6efd; color: #0d6efd; background: #e7f1ff; }
`




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
}




const StepDataPeserta: React.FC<Props> = ({
  participants, setParticipants, nextId, setNextId,
  isInstansi, detail, jenisPelanggan,
  activeId, setActiveId, onNext,
}) => {
  const [pilihanProfil, setPilihanProfil] = useState<Record<number, string>>({})




  const addParticipant = () => {
    const newP = emptyParticipant(nextId)
    setParticipants(prev => [...prev, newP])
    setActiveId(nextId)
    setNextId(prev => prev + 1)
  }




  const removeParticipant = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (participants.length === 1) return
    setParticipants(prev => {
      const next = prev.filter(p => p.id !== id)
      if (activeId === id) setActiveId(next[next.length - 1].id)
      return next
    })
  }




  const updateParticipant = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const file = type === 'file' ? (e.target as HTMLInputElement).files?.[0] ?? null : null
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false




    setParticipants(prev => prev.map(p => {
      if (p.id !== id) return p
      if (type === 'file') return { ...p, [name]: file }
      if (type === 'checkbox') return { ...p, [name]: checked }
      return { ...p, [name]: value }
    }))
  }
  const updateParticipantField = (id: number, name: string, value: string) => {
    setParticipants(prev => prev.map(p =>
      p.id !== id ? p : { ...p, [name]: value }
    ))
  }
  const handlePilihanProfil = (id: number, e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setPilihanProfil(prev => ({ ...prev, [id]: val }))
    if (val === 'pimpinan') {
      const { pimpinan, surel, whatsapp } = detail || {}
      setParticipants(prev => prev.map(p => p.id !== id ? p : {
        ...p, nama_lengkap: pimpinan || '', email: surel || '', whatsapp: whatsapp || ''
      }))
      if (!pimpinan) toast.error("Nama Pimpinan kosong di profil.")
    } else if (val === 'penanggung_jawab') {
      const { pj_nama, pj_surel, pj_whatsapp } = detail || {}
      setParticipants(prev => prev.map(p => p.id !== id ? p : {
        ...p, nama_lengkap: pj_nama || '', email: pj_surel || '', whatsapp: pj_whatsapp || ''
      }))
      if (!pj_nama) toast.error("Nama Penanggung Jawab kosong di profil.")
    } else {
      setParticipants(prev => prev.map(p => p.id !== id ? p : {
        ...p, nama_lengkap: '', email: '', whatsapp: ''
      }))
    }
  }
  return (
    <div>
      {isInstansi && (
        <TabBar>
          {participants.map((p, index) => (
            <Tab
              key={p.id} type="button"
              $active={activeId === p.id}
              onClick={() => setActiveId(p.id)}
            >
              Peserta {index + 1}
              {participants.length > 1 && (
                <CloseBtn onClick={(e) => removeParticipant(p.id, e)}>✕</CloseBtn>
              )}
            </Tab>
          ))}
          <AddTabBtn type="button" onClick={addParticipant}>+ Tambah Peserta</AddTabBtn>
        </TabBar>
      )}
      {participants.map((p) => {
        const profil = pilihanProfil[p.id] || 'Manual'
        const disabled = !isInstansi || profil !== 'Manual'
        return (
          <div key={p.id} style={{ display: p.id === activeId ? 'block' : 'none' }}>
            <FormDataPeserta
              formData={p}
              onChange={(e) => updateParticipant(p.id, e)}
              onFieldChange={(name, value) => updateParticipantField(p.id, name, value)}
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
      <div className="d-flex justify-content-end mt-4">
        <Button type="button" onClick={onNext}>
          Lanjut →
        </Button>
      </div>
    </div>
  )
}
export default StepDataPeserta