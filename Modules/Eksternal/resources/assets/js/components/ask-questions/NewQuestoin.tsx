import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { Plus, Send } from "react-feather"
import styled from "styled-components"
import useQuestion from "../../hooks/ask-questions/useQuestion"
import toast from "react-hot-toast"

const FloatingContainer = styled.div`
  position: sticky;
  bottom: 0;
  left: 100%;
  width: fit-content;
  padding: 2px;
`

type Props = {
  onAfterAdded: () => void
}

const NewQuestoin: React.FC<Props> = ({ onAfterAdded }) => {
  const [showForm, setShowForm] = useState<boolean>(false)
  const [topic, setTopic] = useState<string>('')
  const [question, setQuestion] = useState<string>('')
  const { submitting, topics, createQuestion, getQuestionTopic } = useQuestion()

  const selectedTopic = useMemo(() => {
    return topics.find(r => r.id === topic)
  }, [topics, topic])

  useEffect(() => {
    if (showForm) {
      getQuestionTopic()
      setTopic('')
      setQuestion('')
    }
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
        <Form 
          onSubmit={useCallback((e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (!selectedTopic) return
            createQuestion(selectedTopic.name, question, () => {
              setShowForm(false)
              onAfterAdded()
              toast.success('Pertanyaan berhasil di ajukan')
            })
          }, [selectedTopic, question])}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Ajukan Pertanyaan Baru
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label>Topik</Form.Label>
              <Form.Select
                required
                value={topic}
                onChange={e => setTopic((e.target.value || '').trim())}
              >
                <option value='' disabled>-- Pilih Topik Pertanyaan --</option>
                {topics.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Form.Select>
              <p style={{ fontSize: '0.75rem' }} className="pt-2 mb-0">{selectedTopic?.desc}</p>
            </Form.Group>
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
              disabled={submitting}
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