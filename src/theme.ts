import { createTheme } from '@mui/material/styles';

import type {} from '@mui/x-date-pickers/themeAugmentation';

export default function theme (font: string) {
  return createTheme({  
    typography: {
      //fontFamily: 'Gotish',
      //fontFamily: 'Izbushka',
      fontFamily: font,
      fontSize: 20,
    },
    palette: {
      primary: {
        main: '#375215',
      },
      secondary: {
        main: '#964718',
      },
    },
    components: {
      MuiDatePicker: {
        styleOverrides: {
          root: {
            backgroundColor: 'red',
          },
        },
      },
    },
  });
}