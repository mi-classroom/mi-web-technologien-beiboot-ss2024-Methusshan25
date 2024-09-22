import FileUpload from "../components/ProjectDetailView";
import Navbar from "../components/Navbar";
import '../App.css';
import { CircularProgress, Typography } from "@mui/material";

import { useLocation, useParams } from "react-router-dom";

import { IProject } from "../interfaces/IProject";
import { ThemeProvider } from "@emotion/react";
import MainTheme from "../themes/mainTheme";
import { useCallback, useEffect, useState } from "react";
import { useProjectViewModel } from "../ViewModel/ProjectViewModel";

export const UploadImage = () => {

  const {useGetProject} = useProjectViewModel()
  const { id } = useParams();
  const [project, setProject] = useState<IProject>({projectName: "Filler", imageCount: 0, videoExists: false, blendedImageExists: false})
  const [loading, setLoading] = useState<boolean>(true);

  const loadProject = useCallback(async () => {
    if(id != undefined){
      let projectSave = await useGetProject(id);
      if(projectSave != undefined && projectSave != null){
        setProject(projectSave);
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
      loadProject()
  }, [loading])
  return (
    <ThemeProvider theme={MainTheme}>
      <div className="FileUpload">
        <Navbar />
        {loading &&
          <CircularProgress></CircularProgress>
        }
        {
          !loading &&
          <>
            <Typography variant="h3">Upload - {project.projectName}</Typography>
            <FileUpload project={project} />
          </>
        }
      </div>
    </ThemeProvider>
  )
}

export default UploadImage;