import { useState } from "react";
import { Card, CardContent, Divider, Slide, Step, StepButton, Stepper, Typography, } from "@mui/material";
import "./Home.css"

function Home() {

    const [activeStep, setActiveStep] = useState(0);

    /**
     * Updates the activeStep parameter to the selected step
     * @param step New value of activeStep
     */
    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <>
            <Typography variant="h2">Welcome to LES - The longterm exposure simulator </Typography>
            <Divider sx={{ borderBottomWidth: 3, background: "white", marginBottom: 5 }}></Divider>
            <Typography variant="h4">This webservice makes a possible to simulate a longterm exposure with a video as the source. Following steps are required
                to use the service.
            </Typography>
            <Stepper sx={{ marginTop: 5}} activeStep={activeStep}>
                <Step onClick={handleStep(0)}>
                    <StepButton>Create project</StepButton>
                </Step>
                <Step onClick={handleStep(1)}>
                    <StepButton>Add Video to project</StepButton>
                </Step>
                <Step onClick={handleStep(2)}>
                    <StepButton>Select frames to use in longterm exposure</StepButton>
                </Step>
                <Step onClick={handleStep(3)}>
                    <StepButton>Blend selected images together</StepButton>
                </Step>
            </Stepper>
            {
                <>
                    <Slide direction="left" in={activeStep === 0}>
                        <Card className="manual-item" sx={{ marginTop: 5, border: "2px solid #dd33fa", background: "#303030", borderRadius: 5}}>
                            <CardContent>
                                <Typography color="text" variant="h5" sx={{ fontWeight: "bold" }}>Create project</Typography>
                                <Divider sx={{ borderBottomWidth: 2, background: "white", margin: "10px 0px" }}></Divider>
                                <Typography color="text" variant="h6">To create a project, click in the project overview on add project. A pop-up window will open and you can enter a 
                                    project name. Save it and the project is created.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Slide>
                    <Slide direction="left" in={activeStep === 1}>
                        <Card className="manual-item" sx={{ marginTop: 5, border: "2px solid #dd33fa", background: "#303030", borderRadius: 5, zIndex: -1 }}>
                            <CardContent>
                                <Typography color="text" variant="h5" sx={{ fontWeight: "bold" }}>Add Video to project</Typography>
                                <Divider sx={{ borderBottomWidth: 1, background: "white", margin: "10px 0px"}}></Divider>
                                <Typography variant="h6">After creating a project, a video source is needed. To add it, select the project and drag and drop
                                    the video into the upload area. After that the video will be processed and a new page opens.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Slide>
                    <Slide direction="left" in={activeStep === 2}>
                        <Card className="manual-item" sx={{ marginTop: 5, border: "2px solid #dd33fa", background: "#303030", borderRadius: 5, zIndex: -1 }}>
                            <CardContent>
                                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Select frames to use in longterm exposure</Typography>
                                <Divider sx={{ borderBottomWidth: 2, background: "white", margin: "10px 0px" }}></Divider>
                                <Typography variant="h6">In the Projectview, select all frames which should be used in blending process by using the slider. It is possible to manually
                                    add and remove frames. Frames can be highlighted in the blending process, by clicking the star-icon. 
                                </Typography>
                            </CardContent>
                        </Card>
                    </Slide>
                    <Slide direction="left" in={activeStep === 3}>
                        <Card className="manual-item" sx={{ marginTop: 5, border: "2px solid #dd33fa", background: "#303030", borderRadius: 5, zIndex: -1 }}>
                            <CardContent>
                                <Typography variant="h5" sx={{ fontWeight: "bold" }}>Blend selected images together</Typography>
                                <Divider sx={{ borderBottomWidth: 2, background: "white", margin: "10px 0px" }}></Divider>
                                <Typography variant="h6">To blend the images together, click "create image" in the right end corner. The result will be saved and can be downloaded.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Slide>
                </>
            }
        </>
    )
}

export default Home;