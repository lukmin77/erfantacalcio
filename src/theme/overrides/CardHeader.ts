// ==============================|| OVERRIDES - CARD CONTENT ||============================== //

export default function CardHeader() {
  return {
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '1px',
          backgroundColor: '#faf6e5',
          '&:last-child': {
            paddingBottom: 0
          }
        }
      }
    }
  };
}
