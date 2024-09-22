
import { Button, Typography, Box, LinearProgress, Snackbar, SnackbarCloseReason, SnackbarContent} from "@mui/material";
import {useState, useEffect} from "react";
import "./Slide.css";
import ImageSelector from './ImageSelector';
import UploadArea from "./UploadArea";
import { IProjectDetailViewProps } from "../interfaces/IProjectDetailViewProps";

const ProjectDetailView = ({project} : IProjectDetailViewProps) => {
    const [imagesUploaded, setImagesUploaded] = useState<Boolean>();
    const [loading, setLoading] = useState<Boolean>(false);
    const [blendedImage, setBlendedImage] = useState<string>("")
    const [uploadedVideo, setUploadedVideo] = useState<string>("")
    const [loadingImage, setLoadingImage] = useState<Boolean>(false);
    const [state, setState] = useState<number>(0);
    const [openNotification, setOpenNotification] = useState<boolean>(false)
    const [notificationMessage, setNotificationMessage] = useState<string>("");

    useEffect(() => {
        if (project.imageCount > 0) {
            setImagesUploaded(true);
        }
        if (project.videoExists) {
            setUploadedVideo("http://localhost:8080/" + project.projectName + "/video/uploadedVideo.mp4")
        }
        setState(Math.random());
    }, [project.projectName, uploadedVideo])


    /**
     * Updates the blendedImage parameter with the given image
     * @param image image which will be the value of blendedImage
     */
    const handleReceivedImage = (image: string) => {
        setBlendedImage(image);
    }
    
    /**
     * Launches a notification containing the given message
     * @param message Message of the notification
     */
    const launchNotification = (message : string) => {
        setNotificationMessage(message);
        setOpenNotification(true);
    }

    /**
     * Closes the notificaiton
     * @param event Event triggert by closing process 
     * @param reason Reason of the close
     */
    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenNotification(false);
    };

    if (imagesUploaded) {
        return (
            <>
                <div id="uploaded-content">
                    {
                        uploadedVideo &&
                        <video style={{ border: "5px solid #dd33fa" }} controls>
                            <source src={uploadedVideo} type="video/mp4"></source>
                        </video>
                    }
                    {
                        blendedImage &&
                        <img loading="lazy" style={{border: "5px solid #dd33fa" }} src={blendedImage}></img>

                    }
                    {
                        !blendedImage &&
                        <div id="imagePlaceholder">
                            <Typography variant="h5" color="white">No Blended Image available</Typography>
                        </div>
                    }

                </div>
                <ImageSelector blendedImage={blendedImage} launchNotification={launchNotification} blendedImageExists={project.blendedImageExists} sendImage={handleReceivedImage} projectName={project.projectName}></ImageSelector>
                {
                    loadingImage &&
                    <LinearProgress sx={{ mt: 8 }}></LinearProgress>
                }
                <Snackbar
                    open={openNotification}
                    color="success"
                    autoHideDuration={3000}
                    onClose={handleClose}
                >
                    <SnackbarContent
                        message={notificationMessage}
                        sx={{ backgroundColor: 'lightgreen', color: 'black' }}
                    />
                </Snackbar >
            </>
        )
    } else {
        return (
            <>
                <UploadArea projectName={project.projectName} uploadVerification={setImagesUploaded}></UploadArea>
                {
                    loading &&
                    <>
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress sx={{ mt: 2 }} />
                        </Box>
                    </>
                }
            </>
        )
    }
}

export default ProjectDetailView