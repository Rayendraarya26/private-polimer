import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { getErrorMessage } from "../../utils/error"
import { getQuestionResponses, submitQuestionResponse } from "../../services/ask-questions"
import { QuestionResponse } from "../../types/ask-questions"

export default (question_uuid: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [responses, setResponses] = useState<QuestionResponse[]>([])

  const getAllQuestionResponses = useCallback(
    async () => {
      try {
        setLoading(true)
        const results = await getQuestionResponses(question_uuid)
        setResponses(results)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    },
    [question_uuid]
  )

  const createQuestionResponse = useCallback(
    async (response: string) => {
      try {
        setSubmitting(true)
        const results = await submitQuestionResponse(question_uuid, { response })
        setResponses(current => [...current, results])
        setTimeout(() => {
          const el = document.getElementById(`response-${results.id}`)
          if (el) el.scrollIntoView()
        }, 100)
        return results
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setSubmitting(false)
      }
    },
    [question_uuid]
  )

  return {
    loading,
    submitting,
    responses,
    getAllQuestionResponses,
    createQuestionResponse
  }
}