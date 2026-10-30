import { useState, useEffect, useRef, useCallback } from "react"
import {
  saveHalalDraft,
  getHalalDraft,
  deleteHalalDraft,
} from "../utils/indexedDB"
import { FormHalalPayload } from "../types/halal"

export interface HalalDraftData {
  currentStep: number
  payload: FormHalalPayload
}

export const useHalalDraft = (userId: string = "guest") => {
  const draftKey = `draft_halal_${userId}`
  const [existingDraft, setExistingDraft] = useState<any | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const debounceTimeRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkDraft = async () => {
      try {
        const draft = await getHalalDraft(draftKey)
        if (draft) {
          setExistingDraft(draft)
        }
      } catch (err) {
        console.error("Gagal memuat draft halal dari IndexedDB:", err)
        setError("Gagal memuat draft data")
      }
    }

    checkDraft()
  }, [draftKey])

  const autoSave = useCallback(
    (data: HalalDraftData) => {
      if (debounceTimeRef.current) {
        clearTimeout(debounceTimeRef.current)
      }

      setIsSaving(true)
      debounceTimeRef.current = setTimeout(async () => {
        try {
          await saveHalalDraft({
            draftId: draftKey,
            ...data,
          })
          setLastSaved(new Date())
        } catch (err) {
          console.error("Gagal menyimpan draft halal ke IndexedDB:", err)
        } finally {
          setIsSaving(false)
        }
      }, 1000)
    },
    [draftKey]
  )

  const saveManual = useCallback(
    async (data: HalalDraftData): Promise<boolean> => {
      if (debounceTimeRef.current) {
        clearTimeout(debounceTimeRef.current)
      }
      setIsSaving(true)
      try {
        await saveHalalDraft({
          draftId: draftKey,
          ...data,
        })
        setLastSaved(new Date())
        return true
      } catch (err) {
        console.error("Gagal menyimpan draft manual halal ke IndexedDB:", err)
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
      await deleteHalalDraft(draftKey)
      setExistingDraft(null)
      setLastSaved(null)
    } catch (err) {
      console.error("Gagal menghapus draft halal dari IndexedDB:", err)
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
