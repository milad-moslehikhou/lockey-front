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
        ex.data.errors.forEach((e: any) => {
          if (e.code === 'authorization')
            snackbarFn({
              severity: 'error',
              message: e.detail,
            })
          else
            setError &&
              setError(e.attr, {
                type: 'server',
                message: e.detail,
              })
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
