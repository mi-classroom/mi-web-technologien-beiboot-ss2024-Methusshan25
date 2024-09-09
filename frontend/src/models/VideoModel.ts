import axios, { AxiosResponse } from "axios";

export function generateVideoSourceURL(projectName: string) : string {
    return "http://localhost:8080/" + projectName + "/video/uploadedVideo.mp4";
}

export async function uploadVideo(projectName: string, file: File) : Promise<Boolean> {
    const form = new FormData();
    form.append('projectName', projectName)
    form.append('video', file!!)
    console.log(projectName, file);
    let result = await axios.post('http://localhost:8080/uploadVideo' ,form).then((res) => {
        console.log(res)
        return true;
    }
    ).catch((err) => {
        console.log(err);
        return false; 
    })
    return result;
}

export async function videoAvailable(projectName: string) : Promise<any>{
    let result = await axios.get('http://localhost:8080/uploadVideo/' + projectName).then((res) => {
        return res;
    }).catch((err) => {
        return null;
    })
    return result
}