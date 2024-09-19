import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import {useState} from "react";
import { IProjectProps } from "../interfaces/IProjectProps";

function ProjectDialog({useAddProject, projects} : IProjectProps) {

    const [open, setOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    /**
     * Opens the dialog window
     */
    const handleClickOpen = () => {
        setOpen(true);
    };

    /**
     * Sets the newProjectName parameter to the value of the event
     * @param event Event containing the typed name
     */
    const handleTyping = (event : any) => {
        setNewProjectName(event.target.value)
    }

    /**
     * Closes the dialog window
     */
    const handleClose = () => {
        setOpen(false);
    };

    /**
     * Make an request to create a new project and closes the dialog window
     */
    const handleSave = () => {
        if(projects.map((project) => project.projectName).includes(newProjectName)){
            alert("Project with project name " + newProjectName + " does already exist");
        }
        else{
            useAddProject(newProjectName); 
            handleClose();
        }
    }

    return (
        <>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Add new project"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Enter the name of the new Project
                </DialogContentText>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="projectName"
                    name="email"
                    label="Project name"
                    fullWidth
                    variant="standard"
                    value={newProjectName}
                    onChange={handleTyping} />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="warning" onClick={handleClose}>Don't save</Button>
                <Button variant="contained" color="primary" onClick={handleSave} autoFocus>
                    Save
                </Button>
            </DialogActions>
        </Dialog><div id="buttonsProjectOverview">
            <Button variant="contained" sx={{ width: "200px" }} onClick={handleClickOpen}>Add Project</Button>
        </div></>
    )

}

export default ProjectDialog