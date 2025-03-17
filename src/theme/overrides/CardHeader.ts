import type { Theme } from '@mui/material/styles';

// ==============================|| OVERRIDES - CARD CONTENT ||============================== //

export default function CardHeader(theme: Theme) {
  return {
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "1px",
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.primary.main,
          "&:last-child": {
            paddingBottom: 0,
          },
          "& .MuiCardHeader-subheader": {
            color: theme.palette.primary.main,
          },
        },
      },
    },
  };
}
