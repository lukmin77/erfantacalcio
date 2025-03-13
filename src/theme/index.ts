import type { ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
      primary: {
        light: 'rgb(42, 195, 201)', 
        main: 'rgb(43, 139, 143)', 
        dark: 'rgb(29, 80, 82)', 
      },
      secondary: {
        light: 'rgb(253, 252, 173)', 
        main: 'rgb(253, 251, 94)',
        dark: 'rgb(241, 237, 2)',
      },
      info: {
        light: 'rgb(199, 239, 255)', 
        main: 'rgb(101, 203, 243)', 
        dark: 'rgb(3, 126, 175)', 
      },
      success: {
        light: 'rgb(12, 236, 79)',
        main: 'rgb(8, 204, 67)',
        dark: 'rgb(3, 148, 47)'
      },
      error: {
        light: 'rgb(248, 92, 92)', 
        main: 'rgb(241, 55, 55)',
        dark: 'rgb(165, 27, 27)'
      },
      warning: {
        light: 'rgb(253, 252, 173)', 
        main: 'rgb(252, 206, 0)',
        dark: 'rgb(241, 137, 2)',
      },
      text:{
        primary: 'rgb(29, 80, 82)',
        secondary: 'rgb(29, 80, 82)',
      }
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 768,
        md: 1024,
        lg: 1266,
        xl: 1536
      }
    },
    direction: "ltr",
    mixins: {
      toolbar: {
        minHeight: 60,
        paddingTop: 8,
        paddingBottom: 8
      }
    },
    typography: {
      htmlFontSize: 16,
      fontFamily:  [
        '"Segoe UI Emoji"',
        '"Segoe UI"',
        '"Segoe UI Symbol"',
        '-apple-system',
        'BlinkMacSystemFont',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        
      ].join(','),
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 600,
      h1: {
        color: "rgb(252, 248, 10)",
        fontWeight: 600,
        fontSize: '2.0rem',
        lineHeight: 1.21
      },
      h2: {
        color: 'rgb(3, 126, 175)',
        fontWeight: 600,
        fontSize: '1.675rem',
        lineHeight: 1.27
      },
      h3: {
        color: 'rgb(3, 126, 175)',
        fontWeight: 600,
        fontSize: '1.4rem',
        lineHeight: 1.33
      },
      h4: { //titolo classifica
        color: 'rgb(3, 126, 175)',
        fontWeight: 600,
        fontSize: '1.1rem',
        lineHeight: 1.4
      },
      h5: { //titolo card partite
        color: 'rgb(3, 126, 175)',
        fontWeight: 600,
        fontSize: '0.9rem',
        lineHeight: 1.5
      },
      h6: {
        color: 'rgb(3, 126, 175)',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.57
      },
      caption: {
        color: '',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66
      },
      body1: {
        color: 'rgb(3, 126, 175)', //grigio scuro
        fontSize: '0.75rem',
        lineHeight: 1.57
      },
      body2: {
        color: 'rgb(3, 126, 175)', //verde scuro
        fontSize: '0.75rem',
        lineHeight: 1.66
      },
      subtitle1: {
        color: 'rgb(3, 126, 175)',
        fontSize: '0.875rem',
        fontWeight: 600,
        lineHeight: 1.57
      },
      subtitle2: {
        color: 'rgb(3, 126, 175)',
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 1.66
      },
      overline: {
        lineHeight: 1.66
      },
      button: {
        textTransform: 'capitalize',
        fontSize: '0.975rem'
      }
    }
  };