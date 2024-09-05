import { useParams } from "react-router-dom"
import useFeedback from "../../hooks/feedback/useFeedback"
import { memo, useEffect } from "react"
import { FormProvider } from "react-hook-form"
import FeedbackFieldItem from "../../components/feedbacks/FeedbackFieldItem"
import { Button, Card } from "react-bootstrap"

const FeedbackDetailPage: React.FC = () => {
  const { uuid } = useParams()
  const { form, feedbacks, getFeedback, onSubmit } = useFeedback()

  useEffect(() => {
    if (uuid) getFeedback(uuid)
  }, [uuid])

  return (
    <>
      <FormProvider {...form}>
        <Card>
          <Card.Header className="bg-transparent">
            <div className="w-100 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-2">
              <Card.Title className="pt-2">Submit Feedback</Card.Title>
            </div>
          </Card.Header>
          <Card.Body>
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
          <Card.Footer>
            <div className="w-100 d-flex justify-content-end">
              <Button 
                type="button"
                variant="primary"
                onClick={onSubmit}
                size="lg"
              >
                Submit Feedback
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </FormProvider>
    </>
  )
}

export default memo(FeedbackDetailPage)