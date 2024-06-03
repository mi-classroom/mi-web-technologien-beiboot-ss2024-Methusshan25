import Navbar from "../components/Navbar";
import '../App.css';
import ProjectOverview from "../components/ProjectOverview";
import { Typography } from "@mui/material";


export const UploadImage = () => {
  return (
    <div>
      <Navbar />
      <ProjectOverview />
    </div>
  )
}

export default UploadImage;