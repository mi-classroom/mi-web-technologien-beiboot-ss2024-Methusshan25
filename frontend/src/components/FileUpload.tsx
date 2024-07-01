import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { Button, Typography, Box, Card, CardContent, CardMedia, Grid, Slider, LinearProgress, IconButton } from "@mui/material";
import axios from "axios";
import { useCallback, useState, useRef, useEffect, SyntheticEvent, SetStateAction } from "react";
import { useDropzone } from 'react-dropzone'

import "./Slide.css";

type Nullable<T> = T | undefined | null;

interface IImage {
    index: number,
    name: string,
    data: string,
    selected: boolean,
    highlighted: boolean
}

interface IProject {
    projectName: string,
    imageCount: number,
    videoExists: boolean,
    blendedImageExists: boolean
}

const FileUpload = (props: any) => {
    const [file, setFile] = useState<Nullable<File>>();
    const [images, setImages] = useState<Array<IImage>>([{ index: 0, name: "FillName", data: "FillData", selected: true, highlighted: false }]);
    const [imagesUploaded, setImagesUploaded] = useState<Boolean>();
    const [video, setVideo] = useState<Nullable<File>>();
    const [loading, setLoading] = useState<Boolean>(false);
    const [sliderValue, setSliderValue] = useState<number[]>([0, 25]);
    const [blendedImage, setBlendedImage] = useState<string>("")
    const [uploadedVideo, setUploadedVideo] = useState<string>("")
    const [isVideoUploaded, setIsVideoUploaded] = useState<Boolean>(false)
    const [loadingImage, setLoadingImage] = useState<Boolean>(false);
    const videoRef = useRef(null);

    const onDrop = useCallback((acceptedFiles: SetStateAction<Nullable<File>>[]) => {
        setFile(acceptedFiles[0])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    useEffect(() => {
        checkVideo()
        if (props.project.imageCount > 0) {
            getImages()
        }
        if (props.project.blendedImageExists) {
            createImage()
        }
        if (props.project.videoExists) {
            setUploadedVideo("http://localhost:8080/" + props.project.projectName + "/video/uploadedVideo.mp4")
        }
    }, [])

    const checkVideo = async () => {
        await axios.get('http://127.0.0.1:8080/uploadVideo/' + props.project.projectName).then((res) => {
            setVideo(res.data);
            setFile(res.data);
            console.log("Video found")
        }).catch((err) => {
            console.error(err);
        });
    }

    const uploadFile = async () => {
        setLoading(true)
        const form = new FormData();
        form.append('projectName', props.project.projectName)
        form.append('video', file!!)
        await axios.post('http://127.0.0.1:8080/uploadVideo', form).then((res) => {
            console.log(res)
            setIsVideoUploaded(true)
            setLoading(false)
        }).catch((err) => {
            console.error(err)
            setLoading(false)
        })
    }

    const removeFile = () => setFile(null)

    const generateFrames = async () => {
        setLoading(true)
        await axios.get("http://localhost:8080/splitFrames/" + props.project.projectName).then(res => {
            console.log(res)
        }).catch(err => {
            console.error(err)
        })
        getImages()
    }

    const getImages = async () => {
        setLoading(true);
        await axios.get('http://localhost:8080/listImages/' + props.project.projectName).then(res => {
            let images2: Array<IImage> = []
            res.data.forEach((image: any) => {

                let indexArray = image.split("frame")
                indexArray = indexArray[1].split(".")
                images2.push({
                    index: indexArray[0],
                    name: image,
                    data: "http://localhost:8080/" + props.project.projectName + "/" + image,
                    selected: true,
                    highlighted: false
                })
            })
            images2.sort((a, b) => { return a.index - b.index })
            console.log(images2)
            setImages(images2)
            setLoading(false)
            setImagesUploaded(true)
        }).catch(err => {
            setLoading(false);
            console.log(err);
        })
    }

    const changeSelectStatus = (index: any) => {
        var copy = [...images]
        if (copy[index].selected) {
            copy[index].selected = false
        } else {
            copy[index].selected = true
        }
        setImages(copy)
    }

    const changeHighlightStatus = (index: any) => {
        var copy = [...images]
        if (copy[index].highlighted) {
            copy[index].highlighted = false
        } else {
            copy[index].highlighted = true
        }
        setImages(copy)
    }

    const changeSelectedValue = (event: Event | SyntheticEvent, newValue: number | number[]) => {
        setSliderValue(newValue as number[])
    }

    const changeSelected = (event: Event | SyntheticEvent, newValue: number | number[]) => {
        setSliderValue(newValue as number[])
        images.forEach((image) => {
            if (image.index < sliderValue[0] || image.index > sliderValue[1]) {
                image.selected = false;
            } else {
                image.selected = true;
            }
        })
    }

    const createImage = async () => {
        setLoadingImage(true)
        var selectedImages = "";
        var highlightedImages = ""
        images.forEach((image) => {
            if (image.selected) {
                selectedImages += image.index + ","
            }
            if (image.highlighted) {
                highlightedImages += image.index + ","
            }
        })
        const form = new FormData();
        form.append('framesToUse', selectedImages)
        form.append('framesToHighlight', highlightedImages)
        console.log(highlightedImages)
        if (props.blendedImageExists) {
            await axios.get("http://127.0.0.1:8080/blendedImage/" + props.project.projectName).then((res) => {
                setBlendedImage("data:image/jpeg;base64," + res.data)
                setLoadingImage(false)
            })
        } else {
            await axios.post("http://127.0.0.1:8080/blendImages/" + props.project.projectName, form).then((res) => {
                setBlendedImage("data:image/jpeg;base64," + res.data)
                setLoadingImage(false)
            })
        }
    }


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
                        blendedImage &&
                        <img loading="lazy" style={{ width: "47%", border: "5px solid blue" }} src={blendedImage}></img>

                    }
                    {
                        !blendedImage &&
                        <div id="imagePlaceholder">
                            <Typography variant="h5" color="white">No Blended Image available</Typography>
                        </div>
                    }
                    {
                        uploadedVideo &&
                        <video width="47%" style={{ border: "5px solid blue" }} controls>
                            <source src={uploadedVideo} type="video/mp4"></source>
                        </video>
                    }
                </div>
                <Button variant="outlined" onClick={downloadImage} sx={{ float: "left", marginTop: "10px" }}>Download</Button>
                <div id="card-container">
                    {
                        images.map((item, index) => (
                            <Grid item sx={{ margin: "50px" }} xs={6} sm={6} md={2} lg={2}>
                                <Card key={index} className={`${item.selected ? "selected" : "unselected"}`}>
                                    <CardMedia>
                                        <img loading="lazy" src={item.data} width="300px"></img>
                                        {
                                            item.highlighted &&
                                            <IconButton sx={{ float: "right", color: "gold" }} onClick={() => changeHighlightStatus(index)}>
                                                <StarIcon></StarIcon>
                                            </IconButton>
                                        }
                                        {
                                            !item.highlighted &&
                                            <IconButton sx={{ float: "right", color: "gray" }} onClick={() => changeHighlightStatus(index)}>
                                                <StarOutlineIcon></StarOutlineIcon>
                                            </IconButton>
                                        }

                                    </CardMedia>
                                    <CardContent>
                                        <Grid container spacing={1}>
                                            <Grid item xs={8}>
                                                <Typography variant="h5">{"Frame: " + item.index}</Typography>
                                            </Grid>
                                            <Grid item xs>
                                                {item.selected &&
                                                    <Button variant="outlined" onClick={() => changeSelectStatus(index)} color="warning">Deselect</Button>
                                                }
                                                {!item.selected &&
                                                    <Button variant="outlined" onClick={() => changeSelectStatus(index)} color="success">Select</Button>
                                                }
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    }
                </div>
                <Slider min={0} max={images.length} value={sliderValue} valueLabelDisplay="on" onChange={changeSelectedValue} onChangeCommitted={changeSelected} sx={{ mt: 4 }}></Slider>
                <Button variant="outlined" onClick={createImage} sx={{ float: "right" }}>Create Image</Button>
                {
                    loadingImage &&
                    <LinearProgress sx={{ mt: 8 }}></LinearProgress>
                }
            </>
        )
    } else {
        return (
            <>
                {file &&
                    <>
                        <Typography variant="h5" textAlign='center' sx={{ mt: 2 }}>File {file.name} selected</Typography>
                        <Box textAlign='center' sx={{ mt: 2 }}>
                            <Button variant="contained" sx={{ mr: 1 }} onClick={uploadFile}>Upload File</Button>
                            <Button variant="contained" sx={{ mr: 1 }} color="warning" onClick={removeFile}>Remove File</Button>
                            <Button disabled={!isVideoUploaded} variant="contained" color="warning" onClick={generateFrames}>Generate Frames</Button>
                        </Box>
                    </>
                }
                {!file &&
                    <div className="dropzone" {...getRootProps()}>
                        <input {...getInputProps()}></input>
                        {
                            !isDragActive &&
                            <Typography variant="h4" textAlign='center'>Drag and Drop Videofiles to Upload</Typography>
                        }
                        {
                            isDragActive &&
                            <Typography variant="h4" textAlign='center'>Release the file</Typography>
                        }
                    </div>
                }
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

export default FileUpload