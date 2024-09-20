import { createTheme } from "@mui/material";
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
  typography: {
    "fontFamily": `"Staatliches", sans-serif`
  },
  components: {
    MuiDialog: {
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
    MuiCssBaseline: {
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
    MuiToggleButtonGroup: {
      styleOverrides: {
        grouped: {
          '&:not(:first-of-type)': {
            borderLeft: '1px solid #fff', // Border between buttons
          },
          '&:not(:last-of-type)': {
            borderRight: 'none', // Remove right border from all except last button
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners for each button
          backgroundColor: '#dd33fa', // Default background color of buttons
          color: '#fff', // Default text color
          '&.Mui-selected': {
            backgroundColor: '#ee8aff', // Background color when selected
            color: '#fff', // Text color when selected
          },
          '&:hover': {
            backgroundColor: '#ee8aff', // Background color on hover
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#ee8aff', // Background color when selected and hovered
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          border: '2px solid #dd33fa',           // Text color white
          borderRadius: '8px',
          '&:hover':{        
            borderRadius: '8px',
          },
          '&.Mui-focused': {
            color: '#fff',            // Text color white
          },
        },
        icon: {
          color: '#dd33fa',             // Change the color of the dropdown icon to white
        },
      },
    },

    // Customize the MUI MenuItem component
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#000',
          '&.Mui-selected': {
            backgroundColor: "#ee8aff", // Background color when selected
            color: '#000',
            '&:hover': {
              backgroundColor: "#dd33fa",
              color: "#000"
          },
          },
          '&:hover': {
            backgroundColor: "lightgray",
            color: "#000"
          },
        },
      },
    },
  },
})

export default MainTheme