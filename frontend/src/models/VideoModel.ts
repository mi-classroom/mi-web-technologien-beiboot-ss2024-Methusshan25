import axios, { AxiosResponse } from "axios";

const url = 'https://les-backend.onrender.com'

export function generateVideoSourceURL(projectName: string) : string {
    return url + projectName + "/video/uploadedVideo.mp4";
}

export async function uploadVideo(projectName: string, file: File) : Promise<Boolean> {
    const form = new FormData();
    form.append('projectName', projectName)
    form.append('video', file!!)
    console.log(projectName, file);
    let result = await axios.post(url + '/uploadVideo' ,form).then((res) => {
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
    let result = await axios.get(url + '/uploadVideo/' + projectName).then((res) => {
        return res;
    }).catch((err) => {
        return null;
    })
    return result
}