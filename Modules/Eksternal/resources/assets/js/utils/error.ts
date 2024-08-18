import { AxiosError, isAxiosError } from "axios"
import { DefaultApiResponse } from "../types/api"

export const getErrorMessage = (error: unknown) => {
  const defaultErrorMessage = 'Terjadi kesalahan. Mohon coba lagi nanti'
  if (isAxiosError(error)) {
    const errorMessage = (error as AxiosError<DefaultApiResponse>).response?.data?.message
    return errorMessage || defaultErrorMessage
  }
  return defaultErrorMessage
}