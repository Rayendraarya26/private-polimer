import { memo, useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { FeedbackInputType, FeedbackStructure } from "../../types/feedbacks"
import { FeedbackFormFields } from "../../hooks/feedback/useFeedback"
import { Form } from "react-bootstrap"
import styled from "styled-components"

type Props = {
  level: number
  data: FeedbackStructure
}

const FormControlWrapper = styled.div`
  width: 100%;
  @media screen and (min-width: 768px) {
    width: 50%;
  }
`

const FeedbackFieldItem: React.FC<Props> = ({ data, level }) => {
  const {
    register,
    setValue,
    // watch,
    getValues,
    formState: {errors}
  } = useFormContext<FeedbackFormFields>()

  const fieldIndex = useMemo<number>(() => {
    const fields = getValues('feedbacks')
    return fields.findIndex(r => r.id === data.id)
  }, [data])

  const isInvalid = !!(errors?.feedbacks?.[fieldIndex]?.value?.message || '')

  return (
    <>
      <div 
        className="d-flex flex-column gap-2 mb-4"
        style={{ paddingLeft: `${2 * level}rem` }}
      >
        <div className="w-full">
          {data.question}
        </div>
        {data.input_type === FeedbackInputType.TEXTAREA && (
          <FormControlWrapper>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Tulis..."
              isInvalid={isInvalid}
              required={data.required}
              {...register(`feedbacks.${fieldIndex}.value`)}
            />
          </FormControlWrapper>
        )}
        {data.input_type === FeedbackInputType.NUMBER && (
          <FormControlWrapper>
            <Form.Control
              type="number"
              placeholder="Masukkan nilai"
              isInvalid={isInvalid}
              required={data.required}
              {...register(`feedbacks.${fieldIndex}.value`)}
            />
          </FormControlWrapper>
        )}
        {data.input_type === FeedbackInputType.RANGE && (
          <>
            <div className="d-flex flex-column flex-lg-row gap-1 gap-lg-5">
              <Form.Check
                type='radio'
                label="Sangat Kurang"
                id={`radio-${data.id}-20`}
                isInvalid={isInvalid}
                required={data.required}
                value={20}
                onChange={e => 
                  e.target.checked && 
                    setValue(`feedbacks.${fieldIndex}.value`, 20, { shouldValidate: true })
                }
                name={`radio-${data.id}`}
              />
              <Form.Check
                type='radio'
                label="Kurang"
                id={`radio-${data.id}-40`}
                isInvalid={isInvalid}
                required={data.required}
                value={40}
                onChange={e => 
                  e.target.checked && 
                    setValue(`feedbacks.${fieldIndex}.value`, 40, { shouldValidate: true })
                }
                name={`radio-${data.id}`}
              />
              <Form.Check
                type='radio'
                label="Cukup"
                id={`radio-${data.id}-60`}
                isInvalid={isInvalid}
                required={data.required}
                value={60}
                onChange={e => 
                  e.target.checked && 
                    setValue(`feedbacks.${fieldIndex}.value`, 60, { shouldValidate: true })
                }
                name={`radio-${data.id}`}
              />
              <Form.Check
                type='radio'
                label="Baik"
                id={`radio-${data.id}-80`}
                isInvalid={isInvalid}
                required={data.required}
                value={80}
                onChange={e => 
                  e.target.checked && 
                    setValue(`feedbacks.${fieldIndex}.value`, 80, { shouldValidate: true })
                }
                name={`radio-${data.id}`}
              />
              <Form.Check
                type='radio'
                label="Sangat Baik"
                id={`radio-${data.id}-100`}
                isInvalid={isInvalid}
                required={data.required}
                value={100}
                onChange={e => 
                  e.target.checked && 
                    setValue(`feedbacks.${fieldIndex}.value`, 100, { shouldValidate: true })
                }
                name={`radio-${data.id}`}
              />
            </div>
          </>
        )}
        {!!data.input_type && isInvalid && (
          <small className="text-danger">
            {errors?.feedbacks?.[fieldIndex]?.value?.message || ''}
          </small>
        )}
      </div>
      {(data?.child || []).map(r => (
        <FeedbackFieldItem
          key={r.id}
          data={r}
          level={level + 1}
        />
      ))}
    </>
  )
}

export default memo(FeedbackFieldItem)