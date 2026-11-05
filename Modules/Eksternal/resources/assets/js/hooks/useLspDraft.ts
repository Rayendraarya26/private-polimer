import { useState, useEffect, useRef, useCallback } from "react"
import {
  saveLspDraft,
  getLspDraft,
  deleteLspDraft,
} from "../utils/indexedDB"
import { ParticipantLSP, SharedDataLSP } from "../types/lsp"

export interface LspDraftData {
  step: number
  selectedSkema: string
  participants: ParticipantLSP[]
  sharedData: SharedDataLSP
  nextId?: number
  activeId?: number
}

export const useLspDraft = (userId: string = "guest") => {
  const draftKey = `draft_lsp_${userId}`
  const [existingDraft, setExistingDraft] = useState<LspDraftData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const debounceTimeRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkDraft = async () => {
      try {
        const draft = await getLspDraft(draftKey)
        if (draft) {
          setExistingDraft(draft)
        }
      } catch (err) {
        console.error("Gagal memuat draft LSP dari IndexedDB:", err)
        setError("Gagal memuat draft data")
      }
    }

    checkDraft()
  }, [draftKey])

  const autoSave = useCallback(
    (data: LspDraftData) => {
      if (debounceTimeRef.current) {
        clearTimeout(debounceTimeRef.current)
      }

      setIsSaving(true)
      debounceTimeRef.current = setTimeout(async () => {
        try {
          await saveLspDraft({
            draftId: draftKey,
            ...data,
          })
          setLastSaved(new Date())
        } catch (err) {
          console.error("Gagal menyimpan draft LSP ke IndexedDB:", err)
        } finally {
          setIsSaving(false)
        }
      }, 1000)
    },
    [draftKey]
  )

  const saveManual = useCallback(
    async (data: LspDraftData): Promise<boolean> => {
      if (debounceTimeRef.current) {
        clearTimeout(debounceTimeRef.current)
      }
      setIsSaving(true)
      try {
        await saveLspDraft({
          draftId: draftKey,
          ...data,
        })
        setLastSaved(new Date())
        return true
      } catch (err) {
        console.error("Gagal menyimpan draft manual LSP ke IndexedDB:", err)
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
      await deleteLspDraft(draftKey)
      setExistingDraft(null)
      setLastSaved(null)
    } catch (err) {
      console.error("Gagal menghapus draft LSP dari IndexedDB:", err)
      setError("Gagal menghapus draft data")
    }
  }

  return {
    existingDraft,
    autoSave,
    saveManual,
    clearDraft,
    isSaving,
    lastSaved,
    error,
  }
}

