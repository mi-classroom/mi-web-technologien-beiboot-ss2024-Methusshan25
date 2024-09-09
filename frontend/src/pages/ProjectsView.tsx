import Navbar from "../components/Navbar";
import '../App.css';
import ProjectList from "../components/ProjectList";
import ProjectDialog from "../components/ProjectDialog";
import { ThemeProvider } from "@mui/material";
import MainTheme from "../themes/mainTheme";

import { useProjectViewModel } from "../ViewModel/ProjectViewModel";


export const ProjectsView = () => {

  const {projects, useRemoveProject, useAddProject} = useProjectViewModel();

  return (
    <ThemeProvider theme={MainTheme}>
      <div>
        <Navbar />
        <ProjectList projects={projects} useRemoveProject={useRemoveProject} useAddProject={function (newProjectName: string): void {
          throw new Error("Function not implemented.");
        } } />
        <ProjectDialog useAddProject={useAddProject} projects={[]} useRemoveProject={function (projectName: string): void {
          throw new Error("Function not implemented.");
        } } />
      </div>
    </ThemeProvider>
  )
}

export default ProjectsView;