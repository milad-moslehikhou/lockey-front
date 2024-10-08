import React, { useState } from 'react'
import { Chip, TextField, Stack } from '@mui/material'

interface IInputChipsProps {
  inputLable: string
  chips: string[]
  setChips: React.Dispatch<React.SetStateAction<string[]>>
}

const InputChips = ({ inputLable, chips, setChips }: IInputChipsProps) => {
  const [chip, setChip] = useState('')

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.key === 'Enter' && chip && chip.trim() !== '') {
      const index = chips.indexOf(chip)
      if (index > -1) {
        setChip('')
        return
      }
      setChips([...chips, chip.replace(',', '')])
      setChip('')
    }
  }

  const handleDelete = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const deleteChip = event.currentTarget.parentElement?.innerText
    setChips(chips.filter(item => item !== deleteChip))
    setChip('')
  }

  return (
    <>
      <TextField
        label={inputLable}
        value={chip}
        variant='standard'
        fullWidth
        onChange={e => {
          setChip(e.target.value)
        }}
        onKeyUp={handleKeyUp}
      />
      <Stack
        sx={{ mt: 2 }}
        direction='row'
        spacing={0.5}
      >
        {chips.map(item => {
          return (
            <Chip
              key={item}
              label={item}
              onDelete={handleDelete}
            />
          )
        })}
      </Stack>
    </>
  )
}

export default InputChips
