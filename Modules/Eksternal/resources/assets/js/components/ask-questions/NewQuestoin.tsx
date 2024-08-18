import { memo, useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { Plus, Send } from "react-feather"
import styled from "styled-components"

const FloatingContainer = styled.div`
  position: sticky;
  bottom: 0;
  left: 100%;
  width: fit-content;
  padding: 2px;
`

const NewQuestoin: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false)
  const [question, setQuestion] = useState<string>('')

  useEffect(() => {
    if (showForm) setQuestion('')
  }, [showForm])

  return (
    <>
      <FloatingContainer>
        <Button 
          onClick={() => setShowForm(true)}
          className="rounded-circle"
          style={{ width: '5rem', aspectRatio: '1/1' }}
        >
          <Plus size={42}/>
        </Button>
      </FloatingContainer>
      <Modal 
        show={showForm}
        onHide={() => setShowForm(false)}
      >
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>
              Ajukan Pertanyaan Baru
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Pertanyaan</Form.Label>
              <Form.Control 
                as="textarea"
                rows={4}
                required
                value={question}
                onChange={e => setQuestion((e.target.value || '').trim())}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              size="lg"
              variant="primary"
              type="submit"
            >
              <Send size={20}/>
              &nbsp;&nbsp;Kirim
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}

export default memo(NewQuestoin)