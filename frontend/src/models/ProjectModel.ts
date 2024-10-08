import { IProject } from "../interfaces/IProject";

/**
 * Makes an request to the API to return all projects
 * @returns Array with all projects
 */
export async function fetchProjects(): Promise<Array<IProject>> {
  var projects: Array<IProject> = [];
  await fetch('http://localhost:8080/projects')
    .then(response => response.json())
    .then(data => {
      data.forEach((project: any) => {
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
  return projects;
}

/**
 * Returns the requested project
 * @param projectName Name of the requested project
 * @returns The requested project
 */
export async function getProject(projectName: string) : Promise<IProject | null>{
  return await fetch('http://localhost:8080/projects/' + projectName)
  .then(response => response.json())
  .then(json => {
    return {
      projectName : json.projectName,
      imageCount : json.frameCount,
      videoExists: json.videoExists,
      blendedImageExists: json.blendedImageExists
    }
  })
  .catch(error => {
    console.log(error)
    return null;
  })
}

/**
 * Makes an request to delete the given project
 * @param projectName Refers to the project which has to be removed
 */
export async function removeProject(projectName: string) {
  await fetch('http://localhost:8080/projects/' + projectName, {
    method: "DELETE"
  })
  .then(response => response.text())
  .then(text => console.log(text))
  .catch(error => console.log(error))

}

/**
 * Makes an request to create a project 
 * @param newProjectName Name of the new project
 */
export async function addProject(newProjectName: string) {
  const form = new FormData();
  form.append('projectName', newProjectName)
  await fetch('http://localhost:8080/projects', {
    body: form,
    method: "POST"
  })
  .then(response => response.text())
  .then(text => console.log(text))
  .catch(error => console.log(error))
}

/**
 * Copies a project with a different fps number
 * @param newProjectName Name of the new project
 * @param originalProjectName Name of the project which will be copied
 * @param fps Fps number of the copied project
 * @returns If copying process succeeded or failed
 */
export async function copyProject(newProjectName: string, originalProjectName: string, fps: number) : Promise<Boolean>{
  const form = new FormData();
  form.append('newProjectName', newProjectName)
  form.append('fps', fps.toString())
  return await fetch('http://localhost:8080/projects/' + originalProjectName, {
    body: form,
    method: "POST"
  })
  .then(response => response.text())
  .then(text => {
    console.log(text);
    return true;
  })
  .catch(error => {
    console.log(error)
    return false;
  })
}