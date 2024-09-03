import { memo, useCallback, useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { Send, Star } from "react-feather"
import useQuestion from "../../hooks/ask-questions/useQuestion"

type Props = {
  show: boolean
  id: string
  onClose: () => void
  onAfterReview: () => void
}

const ReviewQuestion: React.FC<Props> = ({ id, show, onClose, onAfterReview }) => {
  const [rating, setRating] = useState<number>(0)
  const [testimoni, setTestimoni] = useState<string>('')
  const { submitting, reviewQuestion } = useQuestion()

  useEffect(() => {
    if (show) {
      setRating(0)
      setTestimoni('')
    }
  }, [show])

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!rating || rating <= 3 && !testimoni) return
    const res = await reviewQuestion(id, { rating, testimoni })
    if (res) onAfterReview()
  }, [id, rating, testimoni])

  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        centered
      >
        <Form onSubmit={onSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              Beri Penilaian
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label>
                Rating <span className="text-danger">*</span>
              </Form.Label>
              <div className="w-100">
                <div className="d-inline-flex align-items-center gap-3">
                  {[1,2,3,4,5].map(v => (
                    <Star
                      key={v}
                      fill={rating >= v ? 'gold' : 'white'}
                      className="text-warning"
                      onClick={() => setRating(v)}
                    />
                  ))}
                </div>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Feedback {rating > 4 ? <span>(Opsional)</span> : <span className="text-danger">*</span>}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                required={rating <= 3}
                value={testimoni}
                onChange={e => setTestimoni((e.target.value || ''))}
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

export default memo(ReviewQuestion)
