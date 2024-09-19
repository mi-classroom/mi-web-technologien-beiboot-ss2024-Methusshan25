
import { Button, Typography, Box, LinearProgress, Snackbar, SnackbarCloseReason, SnackbarContent } from "@mui/material";
import { useState, useEffect } from "react";
import "./Slide.css";
import ImageSelector from './ImageSelector';
import UploadArea from "./UploadArea";

const ProjectDetailView = (props: any) => {
    const [imagesUploaded, setImagesUploaded] = useState<Boolean>();
    const [loading, setLoading] = useState<Boolean>(false);
    const [blendedImage, setBlendedImage] = useState<string>("")
    const [uploadedVideo, setUploadedVideo] = useState<string>("")
    const [loadingImage, setLoadingImage] = useState<Boolean>(false);
    const [state, setState] = useState<number>(0);
    const [openNotification, setOpenNotification] = useState<boolean>(false)
    const [notificationMessage, setNotificationMessage] = useState<string>("");

    useEffect(() => {
        if (props.project.imageCount > 0) {
            setImagesUploaded(true);
        }
        if (props.project.videoExists) {
            setUploadedVideo("http://localhost:8080/" + props.project.projectName + "/video/uploadedVideo.mp4")
        }
        setState(Math.random());
    }, [])


    /**
     * Updates the blendedImage parameter with the given image
     * @param image image which will be the value of blendedImage
     */
    const handleReceivedImage = (image: string) => {
        setBlendedImage(image);
    }

    const launchNotification = (message : string) => {
        setNotificationMessage(message);
        setOpenNotification(true);
    }

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenNotification(false);
    };


    /**
     * Downloads the image in blendedImage as in jpg format
     */
    const downloadImage = () => {
        var a = document.createElement("a");
        a.href = blendedImage;
        a.download = "blendedImage.jpg";
        a.click()
    }

    if (imagesUploaded) {
        return (
            <>
                <div id="uploaded-content">
                    {
                        uploadedVideo &&
                        <video width="49.5%" style={{ border: "5px solid #dd33fa" }} controls>
                            <source src={uploadedVideo} type="video/mp4"></source>
                        </video>
                    }
                    {
                        blendedImage &&
                        <img loading="lazy" style={{ width: "49.5%", border: "5px solid #dd33fa" }} src={blendedImage}></img>

                    }
                    {
                        !blendedImage &&
                        <div id="imagePlaceholder">
                            <Typography variant="h5" color="white">No Blended Image available</Typography>
                        </div>
                    }

                </div>
                <Button variant="contained" onClick={downloadImage} sx={{ float: "right", right: "0px", marginTop: "10px", marginBottom: "10px" }}>Download</Button>
                <ImageSelector launchNotification={launchNotification} blendedImageExists={props.project.blendedImageExists} sendImage={handleReceivedImage} projectName={props.project.projectName}></ImageSelector>
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
                <UploadArea projectName={props.project.projectName} uploadVerification={setImagesUploaded}></UploadArea>
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