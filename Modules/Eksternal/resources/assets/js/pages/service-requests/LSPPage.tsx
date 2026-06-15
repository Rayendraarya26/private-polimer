import { Card, Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { useEffect, useState } from "react"
import FormPelatihanMulti from "../../components/input-service-requests/multiLSP/FormLSPWizard"
import { getSkemalsp } from "../../services/lsp"


const LSPPage = () => {
  const navigate = useNavigate()


  const [selectedSkema, setSelectedSkema] = useState("")
  const [skemaList, setSkemaList] = useState<any[]>([])


  useEffect(() => {
    const fetchSkema = async () => {
      try {
        const data = await getSkemalsp()
        setSkemaList(data)
      } catch (error) {
        console.error("Gagal mengambil skema LSP", error)
      }
    }


    fetchSkema()
  }, [])

  return (
    <div className="w-100">
      <Head title="LSP" />
      <Card>
        {/* HEADER */}
        <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/permohonan")}
          >
            ← Kembali
          </Button>
        </Card.Header>
        <Card.Body>
          {/* DROPDOWN SKEMA */}
          <Form.Group className="mb-2">
            <Form.Label>Pilih Skema LSP</Form.Label>
            <Form.Select
              value={selectedSkema}
              onChange={(e) => setSelectedSkema(e.target.value)}
            >
              <option value="">-- Pilih Skema --</option>
              {skemaList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.lingkup}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* FORM */}
          {selectedSkema && (
            <FormPelatihanMulti skemaId={selectedSkema} />
          )}
        </Card.Body>
      </Card>
    </div>
  )
}
export default LSPPage
