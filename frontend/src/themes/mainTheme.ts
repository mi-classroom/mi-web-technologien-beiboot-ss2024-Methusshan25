import { createTheme} from "@mui/material";
import { pink, purple } from "@mui/material/colors";
import background from "../assets/background-image.jpg"

const MainTheme = createTheme({
  palette: {
    primary: purple,
    secondary: pink,
    success: pink,
    text: {
      primary: "#fff"
    }
  },
  typography:{
    "fontFamily": `"Staatliches", sans-serif`
  },
  components: {
    MuiDialog:{
      styleOverrides: {
        paper: {
          backgroundColor: "#303030"
        }
      }
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          color: 'white', // Set text color
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#dd33fa', // Set text color
        },
      },
    },
    MuiCssBaseline:{
      styleOverrides: {
        body: {
          backgroundImage: `url(${background})`
        }
      }
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: 'gray', // Customize color of the Stepper icon when inactive
          '&.Mui-completed': {
            color: '#dd33fa', // Customize color of the Stepper icon when completed
          },
          '&.Mui-active': {
            color: '#dd33fa', // Customize color of the Stepper icon when active
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: 'gray',
          '&.Mui-active': {
            color: '#dd33fa', // Customize color of the Step label when active
          },
          '&.Mui-completed': {
            color: '#dd33fa', // Customize color of the Step label when completed
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: 'white', // Customize color of the FormLabel when inactive
          '&.Mui-focused': {
            color: 'white', // Customize color of the FormLabel when focused
          },
          '&.Mui-disabled': {
            color: 'gray', // Customize color of the FormLabel when focused
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          color: 'white', // Customize color of the FormControlLabel when inactive
          '&.Mui-focused': {
            color: 'white', // Customize color of the FormControlLabel when focused
          },
          '&.Mui-disabled': {
            color: 'gray', // Customize color of the FormControlLabel when disabled
          },
        },
        label: {
          '&.Mui-focused': {
            color: 'white', // Customize color of the label text when focused
          },
          '&.Mui-disabled': {
            color: 'gray', // Customize color of the label text when disabled
          },
        },
      },
    },
  },
})

export default MainTheme