import * as React from 'react'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import { TextField } from '@mui/material'

const filter = createFilterOptions<iElements>()

export interface iElements {
  id: number | null
  label: string
}

interface AutocompleteTextboxProps {
  onItemSelected: (
    idGiocatore: number | undefined,
    inputValue: string | undefined,
  ) => void
  items: iElements[]
}

export default function AutocompleteTextbox({
  onItemSelected,
  items,
}: AutocompleteTextboxProps) {
  return (
    <React.Fragment>
      <Autocomplete
        size="small"
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            onItemSelected(undefined, newValue)
          } else if (newValue?.label && newValue.id === 0) {
            onItemSelected(undefined, newValue.label)
          } else if (newValue?.id && newValue.id > 0) {
            onItemSelected(newValue.id, undefined)
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params)
          if (
            params.inputValue !== '' &&
            items.find((c) => c.label === params.inputValue) === undefined
          ) {
            filtered.push({
              id: 0,
              label: params.inputValue,
            })
          }

          return filtered
        }}
        id="search_items"
        options={items}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option
          }
          if (option.label) {
            return option.label
          }
          return option.label
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        sx={{ width: 300 }}
        freeSolo
        renderInput={(params) => <TextField {...params} label="Cerca" />}
      />
    </React.Fragment>
  )
}
