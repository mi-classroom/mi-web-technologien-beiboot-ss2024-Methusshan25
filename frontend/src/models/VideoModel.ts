/**
 * Creates the url of the video of the project
 * @param projectName Name of the project whose video url has to be generated
 * @returns The url of the requested video
 */

export function generateVideoSourceURL(projectName: string) : string {
    return "http://localhost:8080/" + projectName + "/video/uploadedVideo.mp4";
}

/**
 * Makes a request to upload the video to the backend
 * @param projectName Name of the project the video will be attached to
 * @param file The file of the video which will be uploaded
 * @returns The success or failure of the upload
 */
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

/**
 * Returns the video file or null whether it exists or not
 * @param projectName The project whose video is requested
 * @returns The video file if it exists
 */
export async function videoAvailable(projectName: string) : Promise<any>{
    let result = null;
    let response = await fetch('http://localhost:8080/' + projectName + "/video/uploadedVideo.mp4")
    
    if(response.ok){
        let blob = await response.blob()
        result = new File([blob], "")
    }
    return result
}