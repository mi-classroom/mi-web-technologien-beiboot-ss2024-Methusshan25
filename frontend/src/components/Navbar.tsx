import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';


function Navbar() {


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Button variant='text' sx={{ fontSize: "2em", color: "white" }} href="/">LES</Button>
          <Button sx={{ position: 'absolute', right: 10, top: 15, borderRadius: 3 }} variant='contained' color='secondary' href="/projects">Projects</Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

export default Navbar;
