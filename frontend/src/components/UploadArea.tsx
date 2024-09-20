import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, LinearProgress, MenuItem, Select, Typography } from "@mui/material"
import { SetStateAction, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { IUploadAreaProps } from "../interfaces/IUploadAreaProps";
import { useVideoViewModel } from "../ViewModel/VideoViewModel";

const UploadArea = ({ projectName, uploadVerification }: IUploadAreaProps) => {

    type Nullable<T> = T | undefined | null;

    /**
     * If file is dropped into target area, the file parameter will be updates to the dropped file
     */
    const onDrop = useCallback((acceptedFiles: SetStateAction<Nullable<File>>[]) => {
        setFile(acceptedFiles[0])
    }, [])

    const { useVideoAvailable, file, setFile, removeFile, doVideoUpload, frameGeneration, loading, isVideoUploaded, setIsVideoUploaded, fps, handleFps, useGenerateVideoSourceURL } = useVideoViewModel(projectName, uploadVerification);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    /**
     * Checks if a video exists and updates the parameters depending if it exists
     */
    const isAvailable = useCallback(async () => {
        let videoFile = await useVideoAvailable(projectName);
        console.log(videoFile)
        if (videoFile != null) {
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
                    </Box>
                    <>
                        {
                            isVideoUploaded &&
                            <video width="80%" style={{
                                border: "5px solid #dd33fa", marginTop: 10, marginBottom: 2, display: "block",
                                marginLeft: "auto", marginRight: "auto"
                            }} controls>
                                <source src={useGenerateVideoSourceURL(projectName)} type="video/mp4"></source>
                            </video>
                        }
                    </>
                    <Box textAlign='center' sx={{ mt: 2, p: 0, opacity: `${isVideoUploaded ? 100 : 0}`}}>
                        <Button sx={{height: 55, mr: 1}} variant="contained" color="warning" onClick={() => frameGeneration(fps)}>Generate Frames</Button>
                        <FormControl>
                            <InputLabel>FPS</InputLabel>
                            <Select
                                value={fps}
                                label="Age"
                                onChange={handleFps}
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                                <MenuItem value={40}>40</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={60}>60</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {loading &&
                        <LinearProgress sx={{ marginTop: 5 }}></LinearProgress>
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