import { SetStateAction, useState } from "react";
import { generateVideoSourceURL, uploadVideo, videoAvailable } from "../models/VideoModel";
import { useImageViewModel } from "./ImageViewModel";
import { SelectChangeEvent } from "@mui/material";

type Nullable<T> = T | undefined | null;

interface VideoViewModel {
    useGenerateVideoSourceURL: (projectName: string) => string
    useUploadVideo: (projectName: string, file: File) => Promise<Boolean>
    useVideoAvailable: (projectName: string) => Promise<File | null>
    file: Nullable<File>,
    setFile: (file : SetStateAction<Nullable<File>>) => void
    isVideoUploaded : boolean,
    setIsVideoUploaded : (isVideoUploaded : boolean) => void
    loading : boolean,
    setLoading : (loading : boolean) => void
    fps: string,
    setFps: (event : string) => void,
    handleFps: (newFps : SelectChangeEvent) => void 
    removeFile : () => void
    doVideoUpload : () => void
    frameGeneration : (fps: string) => void
}


export function useVideoViewModel(projectName : string, uploadVerification? : (value : boolean) => void) : VideoViewModel{

    const [file, setFile] = useState<Nullable<File>>();
    const [isVideoUploaded, setIsVideoUploaded] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [fps, setFps] = useState<string>("30");

    const {useGenerateFrames} = useImageViewModel(projectName);

    /**
     * Removes the file from the file variable
     */
    const removeFile = () =>{
        setFile(null)
    } 

    /**
     * Updates the fps variable 
     * @param event Event triggered, when diffrent fps are selected
     */
    const handleFps = (event : SelectChangeEvent) => {
        setFps(event.target.value)
    }

    /**
     * Uploads the video and updates the isVideoUploaded parameter
     */
    const doVideoUpload = async () => {
        setLoading(true);
        if(file){
            await useUploadVideo(projectName, file).then((res) => {
                setIsVideoUploaded(true);
            }).catch(err =>{
                setIsVideoUploaded(false);
            });
        }
        setLoading(false)
    }

    /**
     * Sends request to generate frames and verifies the upload
     */
    const frameGeneration = async (fps: string) => {
        setLoading(true);
        await useGenerateFrames(projectName, fps);
        if(uploadVerification != undefined)
            uploadVerification(true);
        setLoading(false);

    }

    /**
     * Creates the url of the video of the project
     * @param projectName Name of the project whose video url has to be generated
     * @returns The url of the requested video
    */
    function useGenerateVideoSourceURL(projectName: string){
        let url = generateVideoSourceURL(projectName);
        return url;
    }

    /**
     * Makes a request to upload the video to the backend
     * @param projectName Name of the project the video will be attached to
     * @param file The file of the video which will be uploaded
     * @returns The success or failure of the upload
    */
    async function useUploadVideo(projectName: string, file: File){
        let isVideoUploaded = uploadVideo(projectName, file);
        return isVideoUploaded;
    }

    /**
     * Returns the video file or null whether it exists or not
     * @param projectName The project whose video is requested
     * @returns The video file if it exists
    */
    async function useVideoAvailable(projectName: string){
        let isVideoAvailable = videoAvailable(projectName);
        return isVideoAvailable
    }

    return {useGenerateVideoSourceURL, useUploadVideo, useVideoAvailable, file, setFile, isVideoUploaded, setIsVideoUploaded, loading, setLoading, 
        doVideoUpload, frameGeneration, removeFile, fps, setFps, handleFps}
}