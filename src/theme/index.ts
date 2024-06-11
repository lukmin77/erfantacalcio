import type { ThemeOptions } from '@mui/material/styles';

//https://www.color-hex.com/color-palettes/popular.php
//Coffee and Test tubes Color Palette
//https://www.color-hex.com/color-palette/1040208
//Misc Colors I love Color Palette
//https://www.color-hex.com/color-palette/1041153
export const themeOptions: ThemeOptions = {
  palette: {
      primary: {
        light: '#2e865f', //green
        main: '#2e865f', //green
        dark: '#e65b1c', //dark orange
      },
      secondary: {
        light: '#757575', //gray
        main: '#757575', //gray
        dark: '#757575', //gray
      },
      info: {
        light: '#faf6e5', //yellow
        main: '#f7dc6f', //yellow
        dark: '#ff6b6b' //red
      },
      success: {
        light: '#95de64', //verde acceso chiaro
        main: '#52c41a',
        dark: '#237804'
      },
      error: {
        light: '#ff7875', //rosso chiaro quasi rosa
        main: '#f5222d',
        dark: '#a8071a'
      },
      warning: {
        light: '#ffd666', //arancione chiaro
        main: '#faad14',
        dark: '#ad6800'
      },
      text:{
        primary: '#000000',
        secondary: '#000000',
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
        color: '#f7dc6f',
        fontWeight: 600,
        fontSize: '2.0rem',
        lineHeight: 1.21
      },
      h2: {
        color: '#2e865f',
        fontWeight: 600,
        fontSize: '1.675rem',
        lineHeight: 1.27
      },
      h3: {
        color: '#2e865f',
        fontWeight: 600,
        fontSize: '1.4rem',
        lineHeight: 1.33
      },
      h4: {
        color: '#2e865f',
        fontWeight: 600,
        fontSize: '1.2rem',
        lineHeight: 1.4
      },
      h5: {
        color: '#2e865f',
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.5
      },
      h6: {
        color: '#2e865f',
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.57
      },
      caption: {
        color: '#f7dc6f',
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66
      },
      body1: {
        color: '#595858', //grigio scuro
        fontSize: '0.75rem',
        lineHeight: 1.57
      },
      body2: {
        color: '#2e865f', //verde scuro
        fontSize: '0.75rem',
        lineHeight: 1.66
      },
      subtitle1: {
        color: '#f7dc6f',
        fontSize: '0.875rem',
        fontWeight: 600,
        lineHeight: 1.57
      },
      subtitle2: {
        color: '#f7dc6f',
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