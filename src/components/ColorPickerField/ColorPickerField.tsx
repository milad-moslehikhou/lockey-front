import * as React from 'react'
import { TextField, TextFieldProps, InputAdornment } from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import { DEFAULT_COLOR_CONVERTER } from '../../constant'
import { colorConverters } from '../../helpers/common'
import ColorPickerDialog from './ColorPickerDialog'

interface ColorPickerProps {
  convert?: keyof typeof colorConverters
  onColorChange: (color: string) => void
}

const ColorPickerField = React.forwardRef<HTMLDivElement, ColorPickerProps & TextFieldProps>(function ColorPickerField(
  inProps,
  ref
) {
  const {
    // ColorPicker
    convert = DEFAULT_COLOR_CONVERTER,
    onColorChange,

    // Text field
    value,
    ...rest
  } = inProps

  const [internalValue, setInternalValue] = React.useState<string>((value as string) || '')
  const [showPicker, setShowPicker] = React.useState<boolean>(false)

  return (
    <>
      <TextField
        value={value === undefined ? internalValue : (value as string)}
        autoComplete='off'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <FolderIcon
                sx={{
                  color: value === undefined ? internalValue : (value as string),
                }}
              />
            </InputAdornment>
          ),
        }}
        onFocus={() => setShowPicker(true)}
        onChange={e => {
          setInternalValue(e.target.value)
          onColorChange(e.target.value)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            setShowPicker(false)
          }
        }}
        ref={ref}
        {...rest}
      />
      {showPicker && (
        <ColorPickerDialog
          value={value === undefined ? internalValue : (value as string)}
          onChange={color => {
            const newValue = colorConverters[convert](color)
            setInternalValue(newValue)
            onColorChange(newValue)
          }}
          onSubmit={() => setShowPicker(false)}
        />
      )}
    </>
  )
})

export default ColorPickerField
