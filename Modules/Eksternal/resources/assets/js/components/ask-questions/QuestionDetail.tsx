import { format } from "date-fns"
import { id } from "date-fns/locale/id"
import { memo, useCallback, useEffect, useState } from "react"
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap"
import { Calendar, Send, Star, X } from "react-feather"
import clsx from "clsx"
import styled from "styled-components"
import useQuestion from "../../hooks/ask-questions/useQuestion"
import useQuestionResponse from "../../hooks/ask-questions/useQuestionResponse"
import { QuestionStatus } from "../../types/ask-questions"

const FloatingContainer = styled.form`
  padding-bottom: 0.98rem;
  display: flex;
  gap: 1rem;
`

type Props = {
  show: boolean
  id: string
  onClose: () => void
}

const QuestionDetail: React.FC<Props> = ({ show, id: uuid, onClose }) => {
  const [responseMessage, setResponseMessage] = useState<string>('')
  const { loading, detail, getQuestion } = useQuestion()
  const { loading: loadingResponses, submitting, responses, createQuestionResponse, getAllQuestionResponses } = useQuestionResponse(uuid)

  useEffect(() => {
    if (show && uuid) {
      setResponseMessage('')
      getQuestion(uuid)
      getAllQuestionResponses()
    }
  }, [show, uuid])

  const onSubmit = useCallback(async () => {
    await createQuestionResponse(responseMessage.trim())
    setResponseMessage('')
  }, [createQuestionResponse, getAllQuestionResponses, responseMessage])

  return (
    <>
      <Modal 
        size="lg"
        show={show}
        onHide={onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Pertanyaan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="w-100 d-flex flex-column gap-2">
          {loading ? (
            <div className="w-100 p-5 d-flex justify-content-center">
              <Spinner 
                animation="border"
                variant="primary"
              />
            </div>
          ) : (
            <>
              {detail ? (
                <>
                  {detail.status === QuestionStatus.CLOSED && (
                    <Alert variant="danger">
                      <div className="d-inline-flex align-items-start gap-2">
                        <X/><p className="mb-0">Sesi pertanyaan ini telah ditutup oleh {detail.closed_by_name}</p>
                      </div>
                    </Alert>
                  )}
                  <div className="fw-semibold">
                    Topik: {detail.topik}
                  </div>
                  <div 
                    style={{ fontSize: '0.85rem' }}
                    className="fw-light"
                  >
                    Layanan: {detail.layanan || '-'}
                  </div>
                  {detail.rating && (
                    <div className="d-flex flex-column gap-1 py-2">
                      <div className="fw-semibold">Penilaian:</div>
                      <div className="d-inline-flex align-items-center gap-2">
                        {[1,2,3,4,5].map(v => (
                          <Star 
                            key={v}
                            className="text-warning"
                            fill={parseInt(detail.rating) >= v ? 'gold' : 'white'}
                          />
                        ))}
                      </div>
                      <p 
                        className="mb-0"
                        style={{ fontSize: '0.85rem' }}
                      >
                        Feedback: {detail?.testimoni || '-'}
                      </p>
                    </div>
                  )}
                  <div className="d-inline-flex align-items-center gap-2 text-muted justify-content-end">
                    <Calendar size={12}/>
                    <div style={{ fontSize: '0.75rem' }}>
                      {format(new Date(detail.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                    </div>
                  </div>
                  <div 
                    className="w-100 border shadow-inset pb-0 rounded-2"
                  >
                    <div 
                      style={{ height: '26rem' }}
                      className="w-100 position-relative d-flex flex-column gap-3 p-3 overflow-y-auto"
                    >
                      {loadingResponses && (
                        <div className="w-100 d-flex" style={{ height: '25rem' }}>
                          <Spinner className="m-auto" variant="primary"/>
                        </div>
                      )}
                      {!loadingResponses && responses.length < 1 && (
                        <div className="w-100 d-flex" style={{ height: '25rem' }}>
                          <div className="m-auto" style={{ fontSize: '0.85rem' }}>Belum ada pesan</div>
                        </div>
                      )}
                      {!loadingResponses && responses.map(r => {
                        return (
                          <div
                            key={r.id}
                            id={`response-${r.id}`}
                            className={clsx(
                              "w-100 d-flex",
                              r.is_author ? 'justify-content-end' : 'justify-content-start'
                            )}
                          >
                            <div
                              style={{
                                width: 'fit-content',
                                maxWidth: '80%'
                              }}
                              className={clsx(
                                "border px-3 py-2 rounded d-flex flex-column gap-2",
                                r.is_author ? 'bg-success text-white' : 'bg-light'
                              )}
                            >
                              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                {r.pesan}
                              </p>
                              <div className="d-flex justify-content-end" style={{ fontSize: '0.75rem' }}>
                                {format(new Date(r.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {detail.status === QuestionStatus.OPENED && (
                      <FloatingContainer 
                        className="bg-white border-top p-3"
                        onSubmit={e => {
                          e.preventDefault()
                          onSubmit()
                        }}
                      >
                        <Form.Control
                          as="textarea"
                          required
                          placeholder="Tulis pesan..."
                          rows={2}
                          style={{ resize: 'none' }}
                          value={responseMessage}
                          onChange={e => setResponseMessage((e.target.value || ''))}
                        />
                        <Button
                          type="submit"
                          variant="success"
                          className="px-3"
                          title="Kirim"
                          disabled={submitting}
                        >
                          <Send/>
                        </Button>
                      </FloatingContainer>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-100 p-5 d-flex justify-content-center">
                  <div className="fs-6">Data tidak ditemukan</div>
                </div>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default memo(QuestionDetail)