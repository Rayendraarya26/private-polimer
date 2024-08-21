import { format } from "date-fns"
import { id } from "date-fns/locale/id"
import { memo, useEffect, useMemo } from "react"
import { Button, Form, Modal, Spinner } from "react-bootstrap"
import { Calendar, Send } from "react-feather"
import useProfile from "../../hooks/useProfile"
import clsx from "clsx"
import styled from "styled-components"
import useQuestion from "../../hooks/ask-questions/useQuestion"

const FloatingContainer = styled.form`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
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
  const { profile } = useProfile()
  const { loading, detail, getQuestion } = useQuestion()

  useEffect(() => {
    if (show && uuid) getQuestion(uuid)
  }, [show, uuid])

  const dummyResponses = useMemo(() => ([
    {
      content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut dolorum nam error aperiam, dolores, fugiat vitae nostrum cumque consectetur aliquam quasi amet atque officiis repudiandae quos repellendus eveniet fuga unde.',
      creator_id: '9c8d1f1a-9de6-424c'
    },
    {
      content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut dolorum nam error aperiam, dolores, fugiat vitae nostrum cumque consectetur aliquam quasi amet atque officiis repudiandae quos repellendus eveniet fuga unde.',
      creator_id: '9c8d1f1a-9de6-424c-b0fc-67b4b1b8a488'
    },
    {
      content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
      creator_id: '9c8d1f1a-9de6-424c'
    },
    {
      content: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut dolorum nam error aperiam, dolores, fugiat vitae nostrum cumque consectetur aliquam quasi amet atque officiis repudiandae quos repellendus eveniet fuga unde.',
      creator_id: '9c8d1f1a-9de6-424c'
    },
    {
      content: 'Lorem, ipsum dolor sit amet?',
      creator_id: '9c8d1f1a-9de6-424c-b0fc-67b4b1b8a488'
    }
  ]), [])

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
                  <div style={{ fontSize: '0.85rem' }}>
                    Topik: {detail.topik}
                  </div>
                  <div className="w-100 fw-semibold">
                    {detail.pertanyaan}
                  </div>
                  <div className="d-inline-flex align-items-center gap-2 text-muted justify-content-end">
                    <Calendar size={12}/>
                    <div style={{ fontSize: '0.75rem' }}>
                      {format(new Date(detail.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                    </div>
                  </div>
                  <div 
                    style={{ height: '36rem' }}
                    className="w-100 position-relative d-flex flex-column gap-3 overflow-y-auto border shadow-inset p-3 pb-0 rounded-2"
                  >
                    {dummyResponses.map(r => {
                      const isMyMessage = r.creator_id === profile?.id
                      return (
                        <div
                          className={clsx(
                            "w-100 d-flex",
                            isMyMessage ? 'justify-content-end' : 'justify-content-start'
                          )}
                        >
                          <div
                            style={{
                              width: 'fit-content',
                              maxWidth: '80%'
                            }}
                            className={clsx(
                              "border px-3 py-2 rounded d-flex flex-column gap-2",
                              isMyMessage ? 'bg-success text-white' : 'bg-light'
                            )}
                          >
                            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                              {r.content}
                            </p>
                            <div className="d-flex justify-content-end" style={{ fontSize: '0.75rem' }}>
                              {format(new Date(), 'dd MMMM yyyy, HH:mm', { locale: id })}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <FloatingContainer className="bg-white pt-3 border-top">
                      <Form.Control
                        as="textarea"
                        required
                        placeholder="Tulis pesan..."
                        rows={2}
                        style={{ resize: 'none' }}
                      />
                      <Button
                        type="submit"
                        variant="success"
                        className="px-3"
                        title="Kirim"
                      >
                        <Send/>
                      </Button>
                    </FloatingContainer>
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