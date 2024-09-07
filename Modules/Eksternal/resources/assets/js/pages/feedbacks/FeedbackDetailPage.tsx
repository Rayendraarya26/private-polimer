import { useNavigate, useParams } from "react-router-dom"
import useFeedback from "../../hooks/feedback/useFeedback"
import { memo, useEffect } from "react"
import { FormProvider } from "react-hook-form"
import FeedbackFieldItem from "../../components/feedbacks/FeedbackFieldItem"
import { Button, Card, Spinner } from "react-bootstrap"
import styled from "styled-components"
import { ArrowLeft } from "react-feather"

const FallbackContainer = styled.div`
  width: 100%;
  height: 85dvh;
  display: grid;
  place-items: center;
`

const FeedbackDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { uuid } = useParams()
  const { form, rhf, feedbacks, getFeedback, onSubmit, loading, submitting } = useFeedback()

  useEffect(() => {
    if (uuid) {
      getFeedback(uuid)
      rhf.setValue('uuid', uuid)
    }
  }, [uuid])

  return (
    <>
      <FormProvider {...form}>
        <Card>
          <Card.Header className="bg-transparent">
            <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-2">
              <Card.Title className="pt-2">
                <div className="d-inline-flex align-items-center gap-2">
                  <ArrowLeft 
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(-1)}
                  />
                  <div>Form Feedback</div>
                </div>
              </Card.Title>
            </div>
          </Card.Header>
          <Card.Body>
            {loading && (
              <FallbackContainer>
                <Spinner 
                  animation="border"
                  variant="primary"
                />
              </FallbackContainer>
            )}
            <div>
              {feedbacks.map(r => (
                <FeedbackFieldItem
                  key={r.id}
                  level={0}
                  data={r}
                />
              ))}
            </div>
          </Card.Body>
          {feedbacks.length > 0 && (  
            <Card.Footer>
              <div className="w-100 d-flex justify-content-end">
                <Button 
                  type="button"
                  variant="primary"
                  disabled={submitting}
                  onClick={onSubmit}
                  size="lg"
                >
                  {submitting ? 'Memproses...' : 'Simpan Feedback'}
                </Button>
              </div>
            </Card.Footer>
          )}
        </Card>
      </FormProvider>
    </>
  )
}

export default memo(FeedbackDetailPage)