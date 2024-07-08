import { Card, CardActions, CardContent, Typography, Button } from "@mui/material";
import axios, { Axios } from "axios"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const ProjectOverview = () => {

    const [projects, setProjects] = useState<Array<IProject>>([{ projectName: "", imageCount: 0, videoExists: true, blendedImageExists: true }]);

    interface IProject {
        projectName: string,
        imageCount: number,
        videoExists: boolean,
        blendedImageExists: boolean
    }

    useEffect(() => {
        getProjects()
    }, [])


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
            <div id="buttonsProjectOverview">
                <Button variant="outlined" sx={{ width: "200px" }} onClick={getProjects}>Add Project</Button>
                <Button variant="outlined" sx={{ width: "200px" }} onClick={getProjects}>Update</Button>
            </div>
        </>
    )

}

export default ProjectOverview