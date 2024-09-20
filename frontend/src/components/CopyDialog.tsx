import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,  CircularProgress } from "@mui/material";
import { useState } from "react";
import { useProjectViewModel } from "../ViewModel/ProjectViewModel";
import { ICopyProps } from "../interfaces/ICopyProps";

function CopyDialog({ projectName, open, setOpen, launchNotification }: ICopyProps) {

    const [newProjectName, setNewProjectName] = useState("");
    const [fps, setFps] = useState<string>("30");
    const [loading, setLoading] = useState<boolean>(false);
    const { projects, useCopyProject } = useProjectViewModel();

    /**
     * Sets the newProjectName parameter to the value of the event
     * @param event Event containing the typed name
     */
    const handleTyping = (event: any) => {
        setNewProjectName(event.target.value)
    }

    /**
     * Closes the dialog window
     */
    const handleClose = () => {
        setOpen(false);
    };

    const handleFps = (event: SelectChangeEvent) => {
        setFps(event.target.value)
    }

    /**
     * Make an request to create a new project and closes the dialog window
     */
    const handleCreateCopy = async () => {
        if (projects.map((project) => project.projectName).includes(newProjectName)) {
            alert("Project with project name " + newProjectName + " does already exist");
        }
        else if (newProjectName == "") {
            alert("New Project Name is empty");
        }
        else {
            setLoading(true);
            let result = await useCopyProject(newProjectName, projectName, parseInt(fps))
            handleClose();
            if(result == true){
                launchNotification("Project successfully copied");
            }
            setLoading(false);
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    {"Copy project" + projectName}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Enter the name of the new project
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="projectName"
                        sx={{
                            width: "80%",
                        }}
                        label="New project name"
                        variant="standard"
                        value={newProjectName}
                        onChange={handleTyping} />
                    <FormControl sx={{ float: "right" }}>
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
                    <>
                        {
                            loading &&
                            <CircularProgress></CircularProgress>
                        }
                    </>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="warning" onClick={handleClose}>Close</Button>
                    <Button variant="contained" color="primary" onClick={handleCreateCopy} autoFocus>
                        Create copy
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

export default CopyDialog