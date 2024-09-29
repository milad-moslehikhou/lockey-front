import * as React from 'react'
import { Autocomplete, AutocompleteChangeReason, TextField } from '@mui/material'
import { AutoCompleteFieldOptionsType } from '../../types/component'

interface AutoCompleteFieldProps {
  label: string
  value: any
  error: boolean
  helperText: string | undefined
  options: AutoCompleteFieldOptionsType[]
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: AutoCompleteFieldOptionsType[],
    reason: AutocompleteChangeReason
  ) => void
}

const AutoCompleteField = ({ label, options, value, error, helperText, onChange }: AutoCompleteFieldProps) => {
  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      getOptionKey={options => options.value}
      disableCloseOnSelect
      filterSelectedOptions
      style={{ width: '100%' }}
      onChange={onChange}
      renderInput={params => (
        <TextField
          {...params}
          variant='standard'
          error={error}
          helperText={helperText}
          label={label}
          placeholder={label}
        />
      )}
    />
  )
}

export default AutoCompleteField
