const DB_NAME = "BBSPJIKKP_Polimer_DB"
const DB_VERSION = 1
const STORE_NAME = "sertifikasi_drafts"

// Inisialisasi IndexedDB
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "draftId" })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const saveSertifikasiDraft = async (draft: any): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)
    const request = store.put({
      ...draft,
      updatedAt: new Date().toISOString(),
    })

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const getSertifikasiDraft = async (draftId: string): Promise<any | null> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(draftId)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export const deleteSertifikasiDraft = async (draftId: string): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(draftId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
