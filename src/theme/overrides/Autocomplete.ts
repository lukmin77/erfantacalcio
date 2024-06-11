import type { Theme } from '@mui/material/styles';
// ==============================|| OVERRIDES - BADGE ||============================== //

export default function Autocomplete(theme: Theme) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          color: theme.palette.secondary.main,
        },
        listbox: {
          color: theme.palette.secondary.main,
        },
      }
    }
  };
}
