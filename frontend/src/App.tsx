import Navbar from "./components/Navbar";
import Home from "./components/Home";
import './App.css';
import {ThemeProvider } from "@mui/material";
import MainTheme from "./themes/mainTheme"

function App() {

  return (
    <ThemeProvider theme={MainTheme}>
      <div id="root">
        <Navbar />
        <Home />
      </div>
    </ThemeProvider>
  );
}



export default App;
