import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { Button, Typography, Box, Card, CardContent, CardMedia, Grid, Slider, LinearProgress, IconButton, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, ThemeProvider, Input } from "@mui/material";
import axios from "axios";
import { useCallback, useState, useRef, useEffect, SyntheticEvent, SetStateAction, ChangeEvent, KeyboardEvent } from "react";
import { useDropzone } from 'react-dropzone'
import MainTheme from '../themes/mainTheme';

import "./Slide.css";
import { Margin } from '@mui/icons-material';

type Nullable<T> = T | undefined | null;

interface IImage {
    index: number,
    name: string,
    data: string,
    selected: boolean,
    highlighted: boolean,
    highlightStrength: Number,
}


const FileUpload = (props: any) => {
    const [file, setFile] = useState<Nullable<File>>();
    const [images, setImages] = useState<Array<IImage>>([{ index: 0, name: "FillName", data: "FillData", selected: true, highlighted: false, highlightStrength: 0 }]);
    const [imagesUploaded, setImagesUploaded] = useState<Boolean>();
    const [video, setVideo] = useState<Nullable<File>>();
    const [loading, setLoading] = useState<Boolean>(false);
    const [sliderValue, setSliderValue] = useState<number[]>([0, 25]);
    const [blendedImage, setBlendedImage] = useState<string>("")
    const [uploadedVideo, setUploadedVideo] = useState<string>("")
    const [isVideoUploaded, setIsVideoUploaded] = useState<Boolean>(false)
    const [loadingImage, setLoadingImage] = useState<Boolean>(false);
    const [state, setState] = useState<number>(0);

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
            setUploadedVideo("http://localhost:8080" + props.project.projectName + "/video/uploadedVideo.mp4")
        }
        setState(Math.random());
    }, [])

    const checkVideo = async () => {
        await axios.get('http://localhost:8080/uploadVideo/' + props.project.projectName).then((res) => {
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
        await axios.post('http://localhost:8080/uploadVideo', form).then((res) => {
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
                    highlighted: false,
                    highlightStrength: 0,
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

    const changeSliderValue = (event: Event | SyntheticEvent, newValue: number | number[]) => {
        event.preventDefault()
        setSliderValue(newValue as number[])
    }

    const changeSliderValueComitted = (event: Event | SyntheticEvent, newValue: number | number[]) => {
        event.preventDefault()
        setSliderValue(newValue as number[])
        markSelectedImages()
    }

    const markSelectedImages = () => {
        images.forEach((image) => {
            if (image.index < sliderValue[0] || image.index > sliderValue[1]) {
                image.selected = false;
            } else {
                image.selected = true;
            }
        })
        setState(Math.random());
    }

    const handleHighlightStrength = (event: ChangeEvent, index: any) => {
        var copy = [...images]
        copy[index - 1].highlightStrength = parseInt((event.target as HTMLInputElement).value.split("x")[0]);
        setImages(copy)
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
                highlightedImages += image.index + ";" + image.highlightStrength + ","

            }
        })
        const form = new FormData();
        form.append('framesToUse', selectedImages)
        form.append('framesToHighlight', highlightedImages)
        console.log(highlightedImages)
        if (props.blendedImageExists) {
            await axios.get("http://localhost:8080/blendedImage/" + props.project.projectName).then((res) => {
                setBlendedImage("data:image/jpeg;base64," + res.data)
                setLoadingImage(false)
            })
        } else {
            await axios.post("http://localhost:8080/blendImages/" + props.project.projectName, form).then((res) => {
                setBlendedImage("data:image/jpeg;base64," + res.data)
                setLoadingImage(false)
            })
        }
    }

    const handleTopInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setSliderValue([sliderValue[0], parseInt(event.target.value)]);
    }

    const handleBottomInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setSliderValue([parseInt(event.target.value), sliderValue[1]]);
    }

    const handleBlur = () => {
        markSelectedImages()
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
                        uploadedVideo &&
                        <video width="47%" style={{ border: "5px solid #dd33fa" }} controls>
                            <source src={uploadedVideo} type="video/mp4"></source>
                        </video>
                    }
                    {
                        blendedImage &&
                        <img loading="lazy" style={{ width: "47%", border: "5px solid #dd33fa" }} src={blendedImage}></img>

                    }
                    {
                        !blendedImage &&
                        <div id="imagePlaceholder">
                            <Typography variant="h5" color="white">No Blended Image available</Typography>
                        </div>
                    }

                </div>
                <Button variant="contained" onClick={downloadImage} sx={{ float: "right", right: "60px", marginTop: "10px", marginBottom: "10px" }}>Download</Button>
                <div id="card-container" key={state}>
                    {
                        images.map((item, index) => (
                            <Grid item sx={{ margin: "50px" }} xs={6} sm={6} md={2} lg={2}>
                                <ThemeProvider theme={MainTheme}>
                                    <Card key={index} className={`${item.selected ? "selected" : "unselected"}`} sx={{ background: "#303030" }}>
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
                                                <IconButton sx={{ float: "right", color: "white" }} onClick={() => changeHighlightStatus(index)}>
                                                    <StarOutlineIcon></StarOutlineIcon>
                                                </IconButton>
                                            }
                                            <FormControl disabled={!item.highlighted} sx={{ ml: 2 }}>
                                                <FormLabel id="demo-row-radio-buttons-group-label">Hightlight Strength</FormLabel>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                                    name="row-radio-buttons-group"
                                                    onChange={(event) => handleHighlightStrength(event, item.index)}
                                                >
                                                    <FormControlLabel value="1x" control={<Radio />} label="1x" />
                                                    <FormControlLabel value="2x" control={<Radio />} label="2x" />
                                                    <FormControlLabel value="3x" control={<Radio />} label="3x" />
                                                </RadioGroup>
                                            </FormControl>

                                        </CardMedia>
                                        <CardContent>
                                            <Grid container spacing={1}>
                                                <Grid item xs={8} sx={{ ml: 0 }}>
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
                                </ThemeProvider>
                            </Grid>
                        ))
                    }
                </div>
                <Box>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item>
                            <Input
                                value={sliderValue[0]}
                                size='small'
                                sx={{width: 50}}
                                onChange={handleBottomInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: images.length,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                  }}
                                
                            />
                        </Grid>
                        <Grid item xs>
                            <Slider min={0} max={images.length} value={sliderValue} valueLabelDisplay="on" onChange={changeSliderValue} onChangeCommitted={changeSliderValueComitted} sx={{ mt: 4, width: "96%"}}></Slider>
                        </Grid>
                        <Grid item>
                            <Input
                                value={sliderValue[1]}
                                sx={{width: 50}}
                                onChange={handleTopInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: images.length,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                  }}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Button variant="contained" onClick={createImage} sx={{ float: "right", marginBottom: "20px", right: "60px" }}>Create Image</Button>
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