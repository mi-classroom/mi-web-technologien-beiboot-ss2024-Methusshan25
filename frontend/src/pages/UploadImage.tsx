import FileUpload from "../components/ProjectDetailView";
import Navbar from "../components/Navbar";
import '../App.css';
import { Typography } from "@mui/material";

import { useLocation } from "react-router-dom";

import { IProject } from "../interfaces/IProject";
import { ThemeProvider } from "@emotion/react";
import MainTheme from "../themes/mainTheme";

export const UploadImage = () => {

  const location = useLocation()

  const project: IProject = location.state;

  return (
    <ThemeProvider theme={MainTheme}>
      <div className="FileUpload">
        <Navbar />
        <Typography variant="h3">Upload - {project.projectName}</Typography>
        <FileUpload project={project} />
      </div>
    </ThemeProvider>
  )
}

export default UploadImage;