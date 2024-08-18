export type DefaultApiResponse<T = unknown> = {
  code: number
  message: string
  results: T
}
