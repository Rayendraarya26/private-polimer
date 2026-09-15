import { useState, useEffect, useRef, useCallback } from "react"
import {
    saveSertifikasiDraft,
    getSertifikasiDraft,
    deleteSertifikasiDraft,
} from "../utils/indexedDB"

export const useSertifikasiDraft = (userId: string = "guest") => {
    const draftKey = `draft_sertifikasi_${userId}`
    const [existingDraft, setExistingDraft] = useState<any | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const debounceTimeRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const checkDraft = async () => {
            try {
                const draft = await getSertifikasiDraft(draftKey)
                if (draft) {
                    setExistingDraft(draft)
                }
            } catch (err) {
                console.error('Failed to load draft data:', err)
                setError('Failed to load draft data')
            }
        }

        checkDraft()
    }, [draftKey])

    const autoSave = useCallback(
        (formData: any) => {
            if (debounceTimeRef.current) {
                clearTimeout(debounceTimeRef.current)
            }

            setIsSaving(true)
            debounceTimeRef.current = setTimeout(async () => {
                try {
                    await saveSertifikasiDraft({
                        draftId: draftKey,
                        ...formData,
                    })
                    setLastSaved(new Date())
                } catch (err) {
                    console.error("Gagal menyimpan draft", err)
                } finally {
                    setIsSaving(false)
                }
            }, 1000)
        },
        [draftKey]
    )

    const clearDraft = async () => {
        try {
            await deleteSertifikasiDraft(draftKey)
            setExistingDraft(null)
            setLastSaved(null)
        } catch (err) {
            console.error('Failed to clear draft:', err)
            setError('Failed to clear draft')
        }
    }

    return {
        existingDraft,
        setExistingDraft,
        isSaving,
        error,
        lastSaved,
        autoSave,
        clearDraft,
    }
}
 