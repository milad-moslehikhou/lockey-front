export type ApiErrorsType = {
    type: string
    errors: Array<ApiErrorType>
  }

export type ApiErrorType = {
  code: string
  detail: string
  attr: string
}