import { useState, useEffect, useRef, useCallback } from "react"
import {
  savePelatihanDraft,
  getPelatihanDraft,
  deletePelatihanDraft,
} from "../utils/indexedDB"
import { ParticipantData, SharedData } from "../types/pelatihan"

export interface PelatihanDraftData {
  step: number
  selectedSkema: string
  participants: ParticipantData[]
  sharedData: SharedData
  nextId?: number
  activeId?: number
}

export const usePelatihanDraft = (userId: string = "guest") => {
  const draftKey = `draft_pelatihan_${userId}`
  const [existingDraft, setExistingDraft] = useState<PelatihanDraftData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const debounceTimeRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkDraft = async () => {
      try {
        const draft = await getPelatihanDraft(draftKey)
        if (draft) {
          setExistingDraft(draft)
        }
      } catch (err) {
        console.error("Gagal memuat draft pelatihan dari IndexedDB:", err)
        setError("Gagal memuat draft data")
      }
    }

    checkDraft()
  }, [draftKey])

  const autoSave = useCallback(
    (data: PelatihanDraftData) => {
      if (debounceTimeRef.current) {
        clearTimeout(debounceTimeRef.current)
      }

      setIsSaving(true)
      debounceTimeRef.current = setTimeout(async () => {
        try {
          await savePelatihanDraft({
            draftId: draftKey,
            ...data,
          })
          setLastSaved(new Date())
        } catch (err) {
          console.error("Gagal menyimpan draft pelatihan ke IndexedDB:", err)
        } finally {
          setIsSaving(false)
        }
      }, 1000)
    },
    [draftKey]
  )

  const saveManual = useCallback(
    async (data: PelatihanDraftData): Promise<boolean> => {
      if (debounceTimeRef.current) {
        clearTimeout(debounceTimeRef.current)
      }
      setIsSaving(true)
      try {
        await savePelatihanDraft({
          draftId: draftKey,
          ...data,
        })
        setLastSaved(new Date())
        return true
      } catch (err) {
        console.error("Gagal menyimpan draft manual pelatihan ke IndexedDB:", err)
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
      await deletePelatihanDraft(draftKey)
      setExistingDraft(null)
      setLastSaved(null)
    } catch (err) {
      console.error("Gagal menghapus draft pelatihan dari IndexedDB:", err)
      setError("Gagal menghapus draft data")
    }
  }

  return {
    existingDraft,
    isSaving,
    error,
    lastSaved,
    autoSave,
    saveManual,
    clearDraft,
  }
}

