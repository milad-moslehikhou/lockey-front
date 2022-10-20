import * as React from 'react'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'


interface ISearchInputProps {
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

const SearchInput = ({ onChange }: ISearchInputProps) => {

  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '450px',
      }}
    >
      <InputBase
        id='search'
        placeholder="Search"
        onChange={onChange}
        onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }}
        sx={{
          marginLeft: 1,
          flex: 1
        }}
      />
      <IconButton
        type="button"
        sx={{
          padding: '10px'
        }}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

export default SearchInput