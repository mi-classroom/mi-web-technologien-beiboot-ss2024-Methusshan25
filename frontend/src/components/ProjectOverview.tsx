import { Card, CardActions, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from "@mui/material";
import axios, { Axios } from "axios"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const ProjectOverview = () => {

    const [projects, setProjects] = useState<Array<IProject>>([{ projectName: "", imageCount: 0, videoExists: true, blendedImageExists: true }]);

    const [open, setOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    interface IProject {
        projectName: string,
        imageCount: number,
        videoExists: boolean,
        blendedImageExists: boolean
    }

    useEffect(() => {
        getProjects()
    }, [])

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

    const getProjects = async () => {
        try {
            await axios.get('http://localhost:8080/projects').then((project) => {
                var projects: Array<IProject> = [];
                project.data.forEach((project: any) => {
                    projects.push({
                        projectName: project.projectName,
                        imageCount: project.frameCount,
                        videoExists: project.videoExists,
                        blendedImageExists: project.blendedImageExists
                    })
                })
                setProjects(projects)
            }).catch((err) => {
                console.log(err)
            });
        } catch (err) {
            console.error("Promise rejected with err", err)
        }
    }




    return (
        <>
            <div>
                <Typography variant="h3">Projects</Typography>
                <div className="card-container">
                    {
                        projects.map((item) => (
                            <Card sx={{ marginBottom: "10px", border: "3px solid green" }}>
                                <CardContent>
                                    <Typography variant="h4">{item.projectName}</Typography>
                                    <Typography variant="h5">Framecount: {item.imageCount}</Typography>
                                    <Typography variant="h5" color={item.videoExists ? "green" : "red"}>{item.videoExists ? "Source Video exists" : "Source Video doesnt exist"}</Typography>
                                    <Typography variant="h5" color={item.blendedImageExists ? "green" : "red"}>{item.blendedImageExists ? "Blended image exists" : "Blended image doesnt exist"}</Typography>
                                </CardContent>
                                <CardActions>
                                    <Button variant="outlined">
                                        <Link className="linkToPage" to='/upload' state={item}>Select</Link>
                                    </Button>
                                </CardActions>
                            </Card>
                        ))
                    }
                </div>
            </div>
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
                        onChange={handleTyping}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Don't save</Button>
                    <Button onClick={saveProject} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <div id="buttonsProjectOverview">
                <Button variant="outlined" sx={{ width: "200px" }} onClick={handleClickOpen}>Add Project</Button>
                <Button variant="outlined" sx={{ width: "200px" }} onClick={getProjects}>Update</Button>
            </div>
        </>
    )

}

export default ProjectOverview