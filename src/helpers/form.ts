import _ from 'lodash'

export const setStringOrNull = (v: unknown) => {
  if (_.isString(v) && _.isEmpty(v)) return undefined
  else return v
}

export const handleError = (e: any, setError: any) => {
  const error = e.data || e.error
  console.log(typeof error, e)
  if (typeof error === 'string') return 'Something has wrong!'
  if ('non_field_errors' in error) return error.non_field_errors.join(' ')
  if ('errors' in error) return error.errors.map((err: any) => err.detail).join(' ')
  if ('error' in error) return error.error
  Object.keys(error).forEach(field => {
    const messages = error[field]
    setError(field, {
      type: 'server',
      message: Array.isArray(messages) ? messages.join(' ') : messages,
    })
  })
  return null
}
