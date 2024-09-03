import { memo, useCallback } from "react"
import { Button, Modal } from "react-bootstrap"
import useQuestion from "../../hooks/ask-questions/useQuestion"

type Props = {
  show: boolean
  id: string
  onClose: () => void
  onAfterClosed: () => void
}

const CloseQuestion: React.FC<Props> = ({ id, show, onClose, onAfterClosed }) => {
  const { submitting, closeQuestion } = useQuestion()

  const onCloseQuestion = useCallback(async () => {
    const res = await closeQuestion(id)
    if (res) onAfterClosed()
  }, [id])

  return (
    <>
      <Modal 
        show={show}
        centered
        onHide={submitting ? undefined : onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Konfirmasi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="w-100 d-flex flex-column gap-2">
          <p className="mb-0">Apakah anda yakin ingin menutup pertanyaan ini sekarang?</p>
          <div className="w-100 d-flex align-items-stretch gap-2">
            <Button 
              disabled={submitting}
              type="button"
              variant="danger"
              className="w-100"
              onClick={onCloseQuestion}
            >
              {submitting ? 'Memproses...' : 'Ya, tutup sekarang'}
            </Button>
            <Button 
              disabled={submitting}
              type="button"
              variant="light"
              className="w-100"
              onClick={submitting ? undefined : onClose}
            >
              Batal
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default memo(CloseQuestion)