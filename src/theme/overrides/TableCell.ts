import type { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme: Theme) {
  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.800rem',
          padding: '3px',
          borderColor: theme.palette.divider,
        },
        head: {
          fontWeight: 600,
          paddingTop: '0px',
          paddingBottom: '2px'
        }
      }
    }
  };
}
