import { useState, useEffect, useRef, useCallback } from "react"
import {
  saveKonsultasiAtDraft,
  getKonsultasiAtDraft,
  deleteKonsultasiAtDraft,
} from "../utils/indexedDB"

export interface KonsultasiAtDraftData {
  layananKode: string
  layananLainnya?: string
  catatanDokumen?: string
  uploadedFiles?: File[]
  currentStep?: number
}

export const useKonsultasiAtDraft = (userId: string = "guest") => {
  const draftKey = `draft_konsultasi_at_${userId}`
  const [existingDraft, setExistingDraft] = useState<any | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const debounceTimeRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkDraft = async () => {
      try {
        const draft = await getKonsultasiAtDraft(draftKey)
        if (draft) {
          setExistingDraft(draft)
        }
      } catch (err) {
        console.error("Gagal memuat draft konsultasi AT:", err)
        setError("Gagal memuat draft data")
      }
    }

    checkDraft()
  }, [draftKey])

  const autoSave = useCallback(
    (formData: KonsultasiAtDraftData) => {
      if (debounceTimeRef.current) {
        clearTimeout(debounceTimeRef.current)
      }

      setIsSaving(true)
      debounceTimeRef.current = setTimeout(async () => {
        try {
          await saveKonsultasiAtDraft({
            draftId: draftKey,
            ...formData,
          })
          setLastSaved(new Date())
        } catch (err) {
          console.error("Gagal menyimpan draft konsultasi AT:", err)
        } finally {
          setIsSaving(false)
        }
      }, 1000)
    },
    [draftKey]
  )

  const saveManual = useCallback(
    async (formData: KonsultasiAtDraftData): Promise<boolean> => {
      if (debounceTimeRef.current) {
        clearTimeout(debounceTimeRef.current)
      }
      setIsSaving(true)
      try {
        await saveKonsultasiAtDraft({
          draftId: draftKey,
          ...formData,
        })
        setLastSaved(new Date())
        return true
      } catch (err) {
        console.error("Gagal menyimpan draft manual konsultasi AT:", err)
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [draftKey]
  )

  const clearDraft = async () => {
    try {
      if (debounceTimeRef.current) {
        clearTimeout(debounceTimeRef.current)
      }
      await deleteKonsultasiAtDraft(draftKey)
      setExistingDraft(null)
      setLastSaved(null)
    } catch (err) {
      console.error("Gagal menghapus draft konsultasi AT:", err)
      setError("Gagal menghapus draft data")
    }
  }

  return {
    existingDraft,
    setExistingDraft,
    isSaving,
    error,
    lastSaved,
    autoSave,
    saveManual,
    clearDraft,
  }
}

export default useKonsultasiAtDraft
