import type { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableHead(theme: Theme) {
  return {
    MuiTableHead: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '2px',
          borderColor: theme.palette.divider,
          backgroundColor: '#faf6e5'
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
