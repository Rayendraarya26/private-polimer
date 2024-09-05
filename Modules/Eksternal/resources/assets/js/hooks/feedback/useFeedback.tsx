import { useCallback, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { getErrorMessage } from "../../utils/error"
import { getFeedbackDetail } from "../../services/feedbacks"
import useHookForm from "../useHookForm"
import * as yup from 'yup'
import { FeedbackStructure } from "../../types/feedbacks"

type FeedbackFieldItem = {
  id: string
  required: boolean
  value?: string | number | null
}

export type FeedbackFormFields = {
  feedbacks: Array<FeedbackFieldItem>
}

const collectFieldItem = (feedbackItem: FeedbackStructure, callback: (field: FeedbackFieldItem) => void) => {
  if (feedbackItem.id) {
    callback({
      id: feedbackItem.id,
      required: feedbackItem.input_type ? !!feedbackItem.required : false,
      value: ''
    })
  }
  (feedbackItem.child || []).map((r: FeedbackStructure) => collectFieldItem(r, callback))
}

const collectFeedbackValues = (
  feedbackItem: FeedbackStructure,
  values: Record<string, string | number | null>
): FeedbackStructure => {
  let value: string | number | null = null

  if (feedbackItem.input_type === 'textarea') value = values[feedbackItem.id]
  if (feedbackItem.input_type && ['number','range'].includes(feedbackItem.input_type)) {
    const parsedInt = parseInt(`${values[feedbackItem.id] || '0'}`)
    value = (values?.[feedbackItem.id] && !isNaN(parsedInt)) ? parsedInt : value
  }

  return {
    ...feedbackItem,
    ...(feedbackItem.input_type ? { value } : {}),
    child: feedbackItem.child ? (feedbackItem.child || []).map(r => collectFeedbackValues(r, values)) : null
  } as FeedbackStructure
}

export default () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [feedbacks, setFeedbacks] = useState<FeedbackStructure[]>([])

  const validationSchema: yup.SchemaOf<FeedbackFormFields> = useMemo(() => {
    return yup.object({
      feedbacks: yup.array().of(
        yup.object().shape({
          id: yup.string().required('ID wajib diisi'),
          required: yup.boolean().default(true),
          value: yup.string().when('required', {
            is: true,
            then: yup.string().required('Field ini wajib diisi'),
            otherwise: yup.string().nullable().optional().default('')
          })
        })
      )
    })
  }, [])

  const { errors, rhf, form } = useHookForm<FeedbackFormFields>({ feedbacks: [] }, validationSchema)

  const getFeedback = useCallback(
    async (uuid: string) => {
      try {
        setLoading(true)
        const results = await getFeedbackDetail(uuid)
        const fields: FeedbackFieldItem[] = []
        await results.map(r => collectFieldItem(r, (field) => fields.push(field)))
        rhf.setValue('feedbacks', fields)
        setFeedbacks(results)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const onSubmit = rhf.handleSubmit(
    async (payload) => {
      const values = (payload as FeedbackFormFields).feedbacks.reduce((obj, r) => ({
        ...obj,
        [r.id]: r?.value || null
      }), {} as Record<string, string | number | null>)
      const collectedFeedbackValues = await feedbacks.map(r => collectFeedbackValues(r, values))
      console.log(collectedFeedbackValues) // TODO: send to api
    }
  )

  return {
    loading,
    feedbacks,
    getFeedback,
    rhf,
    form,
    errors,
    onSubmit
  }
}