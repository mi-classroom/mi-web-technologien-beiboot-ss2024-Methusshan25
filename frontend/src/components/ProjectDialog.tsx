import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import axios from "axios"
import {useState } from "react";
import { IProjectProps } from "../interfaces/IProjectProps";

function ProjectDialog({getProjects} : IProjectProps) {

    const [open, setOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleTyping = (event : any) => {
        setNewProjectName(event.target.value)
    }

    const saveProject = async() => {
        const form = new FormData();
        form.append('projectName', newProjectName)
        await axios.post('http://127.0.0.1:8080/projects', form).then((res) => {
            console.log(res)
            getProjects()
            handleClose()
        }).catch((err) => {
            console.error(err)
        })
    }

    const handleClose = () => {
        setOpen(false);
    };

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
                <Button variant="contained" color="primary" onClick={saveProject} autoFocus>
                    Save
                </Button>
            </DialogActions>
        </Dialog><div id="buttonsProjectOverview">
            <Button variant="contained" sx={{ width: "200px" }} onClick={handleClickOpen}>Add Project</Button>
            <Button variant="contained" sx={{ width: "200px" }} onClick={getProjects}>Update</Button>
        </div></>
    )

}

export default ProjectDialog