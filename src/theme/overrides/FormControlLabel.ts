// ==============================|| OVERRIDES - FORM CONTROL LABEL ||============================== //

import { type Theme } from '@mui/material/styles'

export default function FormControlLabel(theme: Theme) {
  return {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: theme.palette.primary.dark,
        },
      },
    },
  }
}
