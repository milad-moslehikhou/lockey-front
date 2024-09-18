import _ from 'lodash'

export const setStringOrNull = (v: unknown) => {
  if (_.isString(v) && _.isEmpty(v)) return undefined
  else return v
}

export const handleError = (e: any, setError: any) => {
  const err = e.data || e.error
  console.log(typeof err, e)
  if (typeof err === 'string') return 'Something has wrong!'
  if ('non_field_errors' in err) return err.non_field_errors.join(' ')
  if ('message' in err) return err.message
  if ('error' in err) return err.error
  Object.keys(err).forEach(field => {
    const messages = err[field]
    setError(field, {
      type: 'server',
      message: Array.isArray(messages) ? messages.join(' ') : messages,
    })
  })
  return null
}
