import { Card, Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import Head from "../../components/common/Head"
import { useEffect, useState } from "react"
import FormPelatihanMulti from "../../components/input-service-requests/multiPelatihan/FormPelatihanWizard"
import { getSkemaPelatihan } from "../../services/pelatihan"


const PelatihanPage = () => {
  const navigate = useNavigate()
  const [selectedSkema, setSelectedSkema] = useState("")
  const [skemaList, setSkemaList] = useState<any[]>([])

  useEffect(() => {
    const fetchSkema = async () => {
      try {
        const data = await getSkemaPelatihan()
        setSkemaList(data)
      } catch (error) {
        console.error("Gagal mengambil skema pelatihan", error)
      }
    }

    fetchSkema()
  }, [])

  const selectedSkemaData = skemaList.find((s) => s.id === selectedSkema)
  const kapabilitas = selectedSkemaData?.kapabilitas ?? 0 

  return (
    <div className="w-100">
      <Head title="Pelatihan" />
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
            <Form.Label>Pilih Skema Pelatihan</Form.Label>
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
            <FormPelatihanMulti 
            skemaId={selectedSkema}
            kapabilitas={kapabilitas}
             />
          )}
        </Card.Body>
      </Card>
    </div>
  )
}
export default PelatihanPage
