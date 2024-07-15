import Navbar from "../components/Navbar";
import '../App.css';
import ProjectList from "../components/ProjectList";
import ProjectDialog from "../components/ProjectDialog";
import { IProject } from "../interfaces/IProject";
import { useState } from "react";
import axios from "axios";
import { ThemeProvider } from "@mui/material";
import MainTheme from "../themes/mainTheme";


export const ProjectsView = () => {

  const [projects, setProjects] = useState<Array<IProject>>([{ projectName: "", imageCount: 0, videoExists: true, blendedImageExists: true }]);

  const getProjects = async () => {
    try {
      await axios.get('http://localhost:8080/projects').then((project) => {
        var projects: Array<IProject> = [];
        project.data.forEach((project: any) => {
          projects.push({
            projectName: project.projectName,
            imageCount: project.frameCount,
            videoExists: project.videoExists,
            blendedImageExists: project.blendedImageExists
          })
        })
        setProjects(projects)
      }).catch((err) => {
        console.log(err)
      });
    } catch (err) {
      console.error("Promise rejected with err", err)
    }
  }

  return (
    <ThemeProvider theme={MainTheme}>
      <div>
        <Navbar />
        <ProjectList projects={projects} getProjects={getProjects} />
        <ProjectDialog projects={projects} getProjects={getProjects} />
      </div>
    </ThemeProvider>
  )
}

export default ProjectsView;