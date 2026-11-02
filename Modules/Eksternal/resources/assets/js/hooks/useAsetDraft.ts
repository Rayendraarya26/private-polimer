import { useState, useEffect, useRef, useCallback } from "react"
import {
  saveAsetDraft,
  getAsetDraft,
  deleteAsetDraft,
} from "../utils/indexedDB"

export interface AsetDraftData {
  jenisSewa: string
  tanggalMulai: string
  tanggalSelesai: string
  durasiHari: number
  keperluanPenggunaan: string
  catatanTambahan: string
  pemohonNama: string
  pemohonNikNib: string
  pemohonAlamat: string
  pemohonTelepon: string
  pemohonEmail: string
  fileSuratPermohonan?: File | null
  setujuPernyataan: boolean
  currentStep: number
}

export const useAsetDraft = (userId: string = "guest") => {
  const draftKey = `draft_sewa_aset_${userId}`
  const [existingDraft, setExistingDraft] = useState<any | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const debounceTimeRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkDraft = async () => {
      try {
        const draft = await getAsetDraft(draftKey)
        if (draft) {
          setExistingDraft(draft)
        }
      } catch (err) {
        console.error("Gagal memuat draft sewa aset dari IndexedDB:", err)
        setError("Gagal memuat draft data")
      }
    }

    checkDraft()
  }, [draftKey])

  const autoSave = useCallback(
    (formData: AsetDraftData) => {
      if (debounceTimeRef.current) {
        clearTimeout(debounceTimeRef.current)
      }

      setIsSaving(true)
      debounceTimeRef.current = setTimeout(async () => {
        try {
          await saveAsetDraft({
            draftId: draftKey,
            ...formData,
          })
          setLastSaved(new Date())
        } catch (err) {
          console.error("Gagal menyimpan draft sewa aset ke IndexedDB:", err)
        } finally {
          setIsSaving(false)
        }
      }, 1000)
    },
    [draftKey]
  )

  const saveManual = useCallback(
    async (formData: AsetDraftData): Promise<boolean> => {
      if (debounceTimeRef.current) {
        clearTimeout(debounceTimeRef.current)
      }
      setIsSaving(true)
      try {
        await saveAsetDraft({
          draftId: draftKey,
          ...formData,
        })
        setLastSaved(new Date())
        return true
      } catch (err) {
        console.error("Gagal menyimpan draft manual sewa aset ke IndexedDB:", err)
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
      await deleteAsetDraft(draftKey)
      setExistingDraft(null)
      setLastSaved(null)
    } catch (err) {
      console.error("Gagal menghapus draft sewa aset dari IndexedDB:", err)
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

export default useAsetDraft

