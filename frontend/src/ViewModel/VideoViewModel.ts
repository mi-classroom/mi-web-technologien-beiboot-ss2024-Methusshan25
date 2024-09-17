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
    fps: number,
    setFps: (pFps : number) => void
    removeFile : () => void
    doVideoUpload : () => void
    frameGeneration : (fps : number) => void
    handleFps: (event : SelectChangeEvent) => void
}


export function useVideoViewModel(projectName : string, uploadVerification? : (value : boolean) => void) : VideoViewModel{

    const [file, setFile] = useState<Nullable<File>>();
    const [isVideoUploaded, setIsVideoUploaded] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [fps, setFps] = useState<number>(30);

    const {useGenerateFrames} = useImageViewModel(projectName);

    const removeFile = () => setFile(null)

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

    const frameGeneration = async (fps: number) => {
        setLoading(true);
        await useGenerateFrames(projectName, fps);
        if(uploadVerification != undefined)
            uploadVerification(true);
        setLoading(false);

    }

    const handleFps = (event : SelectChangeEvent) => {
        setFps(parseInt(event.target.value))
    }

    function useGenerateVideoSourceURL(projectName: string){
        let url = generateVideoSourceURL(projectName);
        return url;
    }

    async function useUploadVideo(projectName: string, file: File){
        let isVideoUploaded = uploadVideo(projectName, file);
        return isVideoUploaded;
    }

    async function useVideoAvailable(projectName: string){
        let isVideoAvailable = videoAvailable(projectName);
        return isVideoAvailable
    }

    return {useGenerateVideoSourceURL, useUploadVideo, useVideoAvailable, file, setFile, isVideoUploaded, setIsVideoUploaded, loading, 
        setLoading, fps, setFps, doVideoUpload, frameGeneration, removeFile, handleFps}
}