const DB_NAME = "BBSPJIKKP_Polimer_DB"
const DB_VERSION = 6
const STORE_NAME = "sertifikasi_drafts"
const KONSULTASI_STORE_NAME = "konsultasi_at_drafts"
const HALAL_STORE_NAME = "halal_drafts"
const ASET_STORE_NAME = "aset_drafts"
const LSP_STORE_NAME = "lsp_drafts"
const PELATIHAN_STORE_NAME = "pelatihan_drafts"

// Inisialisasi IndexedDB
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "draftId" })
      }
      if (!db.objectStoreNames.contains(KONSULTASI_STORE_NAME)) {
        db.createObjectStore(KONSULTASI_STORE_NAME, { keyPath: "draftId" })
      }
      if (!db.objectStoreNames.contains(HALAL_STORE_NAME)) {
        db.createObjectStore(HALAL_STORE_NAME, { keyPath: "draftId" })
      }
      if (!db.objectStoreNames.contains(ASET_STORE_NAME)) {
        db.createObjectStore(ASET_STORE_NAME, { keyPath: "draftId" })
      }
      if (!db.objectStoreNames.contains(LSP_STORE_NAME)) {
        db.createObjectStore(LSP_STORE_NAME, { keyPath: "draftId" })
      }
      if (!db.objectStoreNames.contains(PELATIHAN_STORE_NAME)) {
        db.createObjectStore(PELATIHAN_STORE_NAME, { keyPath: "draftId" })
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

export const saveKonsultasiAtDraft = async (draft: any): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(KONSULTASI_STORE_NAME, "readwrite")
    const store = tx.objectStore(KONSULTASI_STORE_NAME)
    const request = store.put({
      ...draft,
      updatedAt: new Date().toISOString(),
    })

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const getKonsultasiAtDraft = async (draftId: string): Promise<any | null> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(KONSULTASI_STORE_NAME, "readonly")
    const store = tx.objectStore(KONSULTASI_STORE_NAME)
    const request = store.get(draftId)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export const deleteKonsultasiAtDraft = async (draftId: string): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(KONSULTASI_STORE_NAME, "readwrite")
    const store = tx.objectStore(KONSULTASI_STORE_NAME)
    const request = store.delete(draftId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const saveHalalDraft = async (draft: any): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HALAL_STORE_NAME, "readwrite")
    const store = tx.objectStore(HALAL_STORE_NAME)
    const request = store.put({
      ...draft,
      updatedAt: new Date().toISOString(),
    })

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const getHalalDraft = async (draftId: string): Promise<any | null> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HALAL_STORE_NAME, "readonly")
    const store = tx.objectStore(HALAL_STORE_NAME)
    const request = store.get(draftId)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export const deleteHalalDraft = async (draftId: string): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HALAL_STORE_NAME, "readwrite")
    const store = tx.objectStore(HALAL_STORE_NAME)
    const request = store.delete(draftId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const saveAsetDraft = async (draft: any): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASET_STORE_NAME, "readwrite")
    const store = tx.objectStore(ASET_STORE_NAME)
    const request = store.put({
      ...draft,
      updatedAt: new Date().toISOString(),
    })

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const getAsetDraft = async (draftId: string): Promise<any | null> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASET_STORE_NAME, "readonly")
    const store = tx.objectStore(ASET_STORE_NAME)
    const request = store.get(draftId)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export const deleteAsetDraft = async (draftId: string): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASET_STORE_NAME, "readwrite")
    const store = tx.objectStore(ASET_STORE_NAME)
    const request = store.delete(draftId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const saveLspDraft = async (draft: any): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LSP_STORE_NAME, "readwrite")
    const store = tx.objectStore(LSP_STORE_NAME)
    const request = store.put({
      ...draft,
      updatedAt: new Date().toISOString(),
    })

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const getLspDraft = async (draftId: string): Promise<any | null> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LSP_STORE_NAME, "readonly")
    const store = tx.objectStore(LSP_STORE_NAME)
    const request = store.get(draftId)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export const deleteLspDraft = async (draftId: string): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LSP_STORE_NAME, "readwrite")
    const store = tx.objectStore(LSP_STORE_NAME)
    const request = store.delete(draftId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const savePelatihanDraft = async (draft: any): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PELATIHAN_STORE_NAME, "readwrite")
    const store = tx.objectStore(PELATIHAN_STORE_NAME)
    const request = store.put({
      ...draft,
      updatedAt: new Date().toISOString(),
    })

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const getPelatihanDraft = async (draftId: string): Promise<any | null> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PELATIHAN_STORE_NAME, "readonly")
    const store = tx.objectStore(PELATIHAN_STORE_NAME)
    const request = store.get(draftId)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export const deletePelatihanDraft = async (draftId: string): Promise<void> => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PELATIHAN_STORE_NAME, "readwrite")
    const store = tx.objectStore(PELATIHAN_STORE_NAME)
    const request = store.delete(draftId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}



