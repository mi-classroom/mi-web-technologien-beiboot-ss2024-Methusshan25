import axios, { AxiosResponse } from "axios";

export function generateVideoSourceURL(projectName: string) : string {
    return "http://localhost:8080/" + projectName + "/video/uploadedVideo.mp4";
}

export async function uploadVideo(projectName: string, file: File) : Promise<Boolean> {
    const form = new FormData();
    form.append('projectName', projectName)
    form.append('video', file!!)
    await fetch('http://localhost:8080/uploadVideo', {
        body: form,
        method: "POST"
    })
    .then(response => response.text())
    .then(text => {
        console.log(text)
        return true
    })
    .catch(error => {
        console.log(error)
        return false
    })
    return false;
}

export async function videoAvailable(projectName: string) : Promise<any>{
    let result = null;
    let response = await fetch('http://localhost:8080/uploadVideo/' + projectName)
    
    if(response.ok){
        let blob = await response.blob()
        result = new File([blob], "")
    }
    return result
}