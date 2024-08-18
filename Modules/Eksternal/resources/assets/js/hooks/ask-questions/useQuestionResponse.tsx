import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { getErrorMessage } from "../../utils/error"
import { getQuestionResponses, submitQuestionResponse } from "../../services/ask-questions"

export default (uuid: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [responses, setResponses] = useState<unknown[]>([])

  const getAllQuestionResponses = useCallback(
    async () => {
      try {
        setLoading(true)
        const results = await getQuestionResponses(uuid)
        setResponses(results)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    },
    [uuid]
  )

  const createQuestionResponse = useCallback(
    async (question_uuid: string, response: string) => {
      try {
        setSubmitting(true)
        const results = await submitQuestionResponse(question_uuid, { response })
        return results
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setSubmitting(false)
      }
    },
    [uuid]
  )

  return {
    loading,
    submitting,
    responses,
    getAllQuestionResponses,
    createQuestionResponse
  }
}