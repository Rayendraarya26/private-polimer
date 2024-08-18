import { yupResolver } from '@hookform/resolvers/yup'
import { DeepRequired, FieldErrorsImpl, UseFormProps, useForm } from 'react-hook-form'
import { AnyObjectSchema } from 'yup'
import Lazy from 'yup/lib/Lazy'

const useHookForm = <T extends object>(
  defaultValue: T,
  validationSchema: AnyObjectSchema | Lazy<never, unknown>,
  useFormConfig?: UseFormProps
) => {
  const form = useForm({
    ...useFormConfig,
    defaultValues: defaultValue,
    resolver: yupResolver(validationSchema)
  })
  const {
    formState: { errors, ...formState },
    ...rhf
  } = form

  return {
    errors: errors as Partial<FieldErrorsImpl<DeepRequired<T>>>,
    rhf: { ...formState, ...rhf },
    form
  }
}

export default useHookForm
