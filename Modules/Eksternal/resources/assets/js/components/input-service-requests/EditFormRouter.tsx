import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../../utils/api"


import EditFormPelatihan from "./EditFormPelatihan"
import EditFormLSP from "./EditFormLSP"


const EditFormRouter = () => {
  const { id } = useParams()


  const [loading, setLoading] = useState(true)
  const [formType, setFormType] = useState<string | null>(null)


  useEffect(() => {
    const fetchPermohonan = async () => {
      try {
        setLoading(true)


        const response = await api.get(`/eksternal/permohonan/${id}`)


        console.log("DETAIL PERMOHONAN:", response.data)


        const detail = response?.data?.results?.detail


        const formableType = detail?.formable_type || ""


        setFormType(formableType)


      } catch (error) {
        console.error("Gagal ambil data permohonan:", error)


        setFormType(null)


      } finally {
        setLoading(false)
      }
    }


    if (id) {
      fetchPermohonan()
    }
  }, [id])


  // LOADING
  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>
  }


  // NORMALIZE TYPE
  const normalizedType = formType?.toLowerCase() || ""


  console.log("FORM TYPE:", normalizedType)


  // FORM PELATIHAN
  if (normalizedType.includes("formpelatihan")) {
    return <EditFormPelatihan />
  }


  // FORM LSP
  if (normalizedType.includes("formlsp")) {
    return <EditFormLSP />
  }


  // FALLBACK
  return (
    <div style={{ padding: 40 }}>
      <h3>Layanan tidak ditemukan</h3>


      <p>
        Form type: <strong>{formType}</strong>
      </p>
    </div>
  )
}


export default EditFormRouter

