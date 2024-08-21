import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { getQuestionDetail, getQuestionTopics, submitQuestion } from "../../services/ask-questions"
import { getErrorMessage } from "../../utils/error"
import { QuestionDetail, QuestionTopic } from "../../types/ask-questions"

export default () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [topics, setTopics] = useState<QuestionTopic[]>([])
  const [detail, setDetail] = useState<QuestionDetail | undefined>(undefined)

  const getQuestionTopic = useCallback(
    async () => {
      try {
        setLoading(true)
        const results = await getQuestionTopics()
        setTopics(results)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getQuestion = useCallback(
    async (uuid: string) => {
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
    []
  )

  const createQuestion = useCallback(
    async (topic: string, question: string, callback: () => void) => {
      try {
        setSubmitting(true)
        const results = await submitQuestion({ topik: topic, pertanyaan: question })
        callback()
        return results
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setSubmitting(false)
      }
    },
    []
  )

  return {
    loading,
    submitting,
    detail,
    topics,
    getQuestion,
    getQuestionTopic,
    createQuestion
  }
}