import { IProject } from "../interfaces/IProject";

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


export async function removeProject(projectName: string) {
  await fetch('http://localhost:8080/projects/' + projectName, {
    method: "DELETE"
  })
  .then(response => response.text())
  .then(text => console.log(text))
  .catch(error => console.log(error))

}

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