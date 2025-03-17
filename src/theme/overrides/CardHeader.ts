// ==============================|| OVERRIDES - CARD CONTENT ||============================== //

export default function CardHeader() {
  return {
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "1px",
          backgroundColor: 'rgb(253, 252, 173)',
          color: 'rgb(43, 139, 143)',
          "&:last-child": {
            paddingBottom: 0,
          },
          "& .MuiCardHeader-subheader": {
            color: 'rgb(43, 139, 143)',
          },
        },
      },
    },
  };
}
