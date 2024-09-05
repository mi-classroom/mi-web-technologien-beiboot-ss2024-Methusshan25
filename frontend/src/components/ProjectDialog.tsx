import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import axios from "axios"
import {useState } from "react";
import { IProjectProps } from "../interfaces/IProjectProps";

function ProjectDialog({useAddProject} : IProjectProps) {

    const [open, setOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleTyping = (event : any) => {
        setNewProjectName(event.target.value)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        useAddProject(newProjectName); 
        handleClose();
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