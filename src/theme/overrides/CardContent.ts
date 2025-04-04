// ==============================|| OVERRIDES - CARD CONTENT ||============================== //

export default function CardContent() {
  return {
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '1px',
          '&:last-child': {
            paddingBottom: 10,
          },
        },
      },
    },
  }
}
