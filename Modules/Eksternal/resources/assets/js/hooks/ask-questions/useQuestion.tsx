import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { getQuestionDetail, submitQuestion } from "../../services/ask-questions"
import { getErrorMessage } from "../../utils/error"

export default (uuid: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [detail, setDetail] = useState<unknown | undefined>(undefined)

  const getQuestion = useCallback(
    async () => {
      try {
        setLoading(true)
        const results = await getQuestionDetail(uuid)
        setDetail(results)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    },
    [uuid]
  )

  const createQuestion = useCallback(
    async (question: string) => {
      try {
        setSubmitting(true)
        const results = await submitQuestion({ pertanyaan: question })
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
    detail,
    getQuestion,
    createQuestion
  }
}