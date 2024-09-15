import { Box, Button, LinearProgress, Typography } from "@mui/material"
import { SetStateAction, useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { IUploadAreaProps } from "../interfaces/IUploadAreaProps";
import { useVideoViewModel } from "../ViewModel/VideoViewModel";

const UploadArea = ({projectName, uploadVerification} : IUploadAreaProps) => {

    type Nullable<T> = T | undefined | null;

    const onDrop = useCallback((acceptedFiles: SetStateAction<Nullable<File>>[]) => {
        setFile(acceptedFiles[0])
    }, [])

    const {useVideoAvailable, file, setFile, removeFile, doVideoUpload, frameGeneration, loading, isVideoUploaded, setIsVideoUploaded} = useVideoViewModel(projectName, uploadVerification);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const isAvailable = useCallback(async () => {
        let videoFile = await useVideoAvailable(projectName);
        console.log(videoFile)
        if(videoFile != null){
            setIsVideoUploaded(true);
            setFile(videoFile);
        }
    }, [])

    useEffect(() => {
        isAvailable()
    }, [])

    return (
        <>
            {file &&
                <>
                    <Typography variant="h5" textAlign='center' sx={{ mt: 2 }}>File {file.name} selected</Typography>
                    <Box textAlign='center' sx={{ mt: 2 }}>
                        <Button variant="contained" sx={{ mr: 1 }} onClick={doVideoUpload}>Upload File</Button>
                        <Button variant="contained" sx={{ mr: 1 }} color="warning" onClick={removeFile}>Remove File</Button>
                        <Button disabled={!isVideoUploaded} variant="contained" color="warning" onClick={frameGeneration}>Generate Frames</Button>
                    </Box>
                    {loading && 
                        <LinearProgress sx={{marginTop: 5}}></LinearProgress>
                    }
                </>
            }
            {!file &&
                <>
                    <div className="dropzone" {...getRootProps()}>
                    <input {...getInputProps()}></input>
                    {
                        !isDragActive &&
                        <Typography variant="h4" textAlign='center'>Drag and Drop Videofiles to Upload</Typography>
                    }
                    {
                        isDragActive &&
                        <Typography variant="h4" textAlign='center'>Release the file</Typography>
                    }
                    </div>
                </>
            }
        </>
    )

}
export default UploadArea;