import axios from "axios";
import { IProject } from "../interfaces/IProject";

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

export async function removeProject(projectName: string){
  await axios.delete('http://localhost:8080/projects/' + projectName).then(() => {
    console.log("Project " + projectName + " removed");
  }).catch((err) => {
    console.error(err);
  });
}

export async function addProject(newProjectName: string){
  const form = new FormData();
  form.append('projectName', newProjectName)
  await axios.post('http://127.0.0.1:8080/projects', form).then((res) => {
    console.log(res)
  }).catch((err) => {
    console.error(err)
  })
}