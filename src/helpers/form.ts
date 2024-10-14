import _ from 'lodash'
import { UseFormSetError } from 'react-hook-form'

export const setStringOrNull = (v: unknown) => {
  if (_.isString(v) && _.isEmpty(v)) return undefined
  else return v
}

export const handleException = (ex: any, snackbarFn: any, setError?: UseFormSetError<any>) => {
  console.log(ex)
  if (ex && ex.data && ex.data.type) {
    switch (ex.data.type) {
      case 'validation_error':
        let errors: any = {}
        ex.data.errors.forEach((e: any) => {
          if (e.code === 'authorization')
            snackbarFn({
              severity: 'error',
              message: e.detail,
            })
          else e.attr in errors ? (errors[e.attr] = errors[e.attr] + '\n' + e.detail) : (errors[e.attr] = e.detail)
        })
        setError &&
          Object.keys(errors).forEach(ek => {
            setError(ek, { type: 'server', message: errors[ek] })
          })
        break
      case 'client_error':
        snackbarFn({
          severity: 'error',
          message: ex.data.errors.map((e: any) => e.detail).join('\n'),
        })
        break
      case 'server_error':
        snackbarFn({
          severity: 'error',
          message: ex.data.errors.map((e: any) => e.detail).join('\n'),
        })
        break
    }
  }
  return null
}
