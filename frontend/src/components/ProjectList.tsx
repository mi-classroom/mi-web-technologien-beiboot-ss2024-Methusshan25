import { Card, CardActions, CardContent, Typography, Button } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { IProjectProps } from "../interfaces/IProjectProps";
import axios from "axios";


const ProjectList = ({ projects, getProjects }: IProjectProps) => {

    useEffect(() => {
        getProjects()
    }, [])

    const removeProject = async (id: String) => {
        await axios.delete('http://localhost:8080/projects/' + id).then(() => {
            console.log("Project " + id + " removed")
            getProjects()
        }).catch((err) => {
            console.error(err);
        });
    }


    return (
        <>
            <div>
                <Typography color="primary" variant="h3">Projects</Typography>
                <div className="card-container">
                    {
                        projects.map((project: any) => (
                            <>
                                {
                                    project.projectName != "" &&
                                    <Card sx={{ margin: "10px 0px", border: "3px solid purple", borderRadius: "20px", background: "#303030", boxShadow: "revert" }}>
                                        <CardContent>
                                            <Typography variant="h4">{project.projectName}</Typography>
                                            <Typography variant="h5">Framecount: {project.imageCount}</Typography>
                                            <Typography variant="h5" color={project.videoExists ? "green" : "red"}>{project.videoExists ? "Source Video exists" : "Source Video doesnt exist"}</Typography>
                                            <Typography variant="h5" color={project.blendedImageExists ? "green" : "red"}>{project.blendedImageExists ? "Blended image exists" : "Blended image doesnt exist"}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button color="primary" variant="contained">
                                                <Link style={{ color: 'white' }} className="linkToPage" to={'/upload/' + project.projectName} state={project}>
                                                    Select
                                                </Link>
                                            </Button>
                                            <Button color="warning" variant="contained" onClick={() => removeProject(project.projectName)}>
                                                Delete
                                            </Button>
                                        </CardActions>
                                    </Card>
                                }
                                {
                                    project.projectName == "" &&
                                    <Typography variant="h3" sx={{textAlign: "center", marginBottom: "20px"}}>No projects </Typography>
                                }
                            </>
                        ))
                    }
                </div>
            </div>
        </>
    )

}

export default ProjectList