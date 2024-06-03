import FileUpload from "../components/FileUpload";
import Navbar from "../components/Navbar";
import '../App.css';
import { Typography } from "@mui/material";

import { useLocation } from "react-router-dom";

interface IProject{
  projectName: string,
  imageCount: number,
  videoExists: boolean,
  blendedImageExists: boolean
}

export const UploadImage = () => {

  const location = useLocation()

  const project : IProject = location.state;

  return (
    <div className="FileUpload">
      <Navbar />
      <Typography variant="h3">Upload - {project.projectName}</Typography>
      <FileUpload project={project} />
    </div>
  )
}

export default UploadImage;