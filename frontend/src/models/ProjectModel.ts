import axios from "axios";
import { IProject } from "../interfaces/IProject";

/**
 * Makes an request to the API to return all projects
 * @returns Array with all projects
 */
export async function fetchProjects(): Promise<Array<IProject>> {
  var projects: Array<IProject> = [];
  try {
    await axios.get('http://localhost:8080/projects').then((project) => {
      project.data.forEach((project: any) => {
        projects.push({
          projectName: project.projectName,
          imageCount: project.frameCount,
          videoExists: project.videoExists,
          blendedImageExists: project.blendedImageExists
        })
      })
    }).catch((err) => {
      console.log(err)
    });
  } catch (err) {
    console.error("Promise rejected with err", err);
  }
  return projects;
}

/**
 * Makes an request to delete the given project
 * @param projectName Refers to the project which has to be removed
 */
export async function removeProject(projectName: string){
  await axios.delete('http://localhost:8080/projects/' + projectName).then(() => {
    console.log("Project " + projectName + " removed");
  }).catch((err) => {
    console.error(err);
  });
}

/**
 * Makes an request to create a project 
 * @param newProjectName Name of the new project
 */
export async function addProject(newProjectName: string){
  const form = new FormData();
  form.append('projectName', newProjectName)
  await axios.post('http://127.0.0.1:8080/projects', form).then((res) => {
    console.log(res)
  }).catch((err) => {
    console.error(err)
  })
}