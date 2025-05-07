import type { Theme } from '@mui/material/styles'
// ==============================|| OVERRIDES - BADGE ||============================== //

export default function Autocomplete(theme: Theme) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          color: theme.palette.primary.dark,
        },
        listbox: {
          color: theme.palette.primary.dark,
        },
      },
    },
  }
}
