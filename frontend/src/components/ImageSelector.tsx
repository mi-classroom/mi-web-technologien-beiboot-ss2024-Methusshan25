import { Button, Grid, Icon, IconButton, Pagination, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { IImageSelectorProps } from "../interfaces/IImageSelectorProps";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useImageViewModel } from "../ViewModel/ImageViewModel";
import Selecto from "react-selecto";
import ImageDetail from "./ImageDetail";
import { useState } from "react";
import CopyDialog from "./CopyDialog";
import "./Slide.css";


const ImageSelector = ({ projectName, sendImage, blendedImageExists, launchNotification, blendedImage }: IImageSelectorProps) => {

    const [openCopy, setOpenCopy] = useState<boolean>(false);

    const { pageCount, currentImages, refreshKey, swapSelectStatus, swapHighlightStatus, changeHighlightStrength, imagesLoaded, currentPage,
        setCurrentPage, sendImagesToBlend, open, setOpen, fullscreenImage, selectAllImagesOnPage, deselectAllImagesOnPage, handleOpen
    } = useImageViewModel(projectName, sendImage, blendedImageExists, launchNotification);

    /**
     * Downloads the image in blendedImage as in jpg format
     */
    const downloadImage = () => {
        var a = document.createElement("a");
        a.href = blendedImage;
        a.download = "blendedImage.jpg";
        a.click()
    }

    return (
        <>
            <Selecto
                // The container to add a selection element
                container={document.body}
                // The area to drag selection element (default: container)
                dragContainer={window}
                // Targets to select. You can register a queryselector or an Element.
                selectableTargets={[".unselected"]}
                // Whether to select by click (default: true)
                keyContainer={window}
                // The rate at which the target overlaps the drag area to be selected. (default: 100)
                hitRate={100}
                onSelect={e => {
                    e.added.forEach(el => {
                        let id = el.getAttribute("id")
                        if (id != null)
                            swapSelectStatus(parseInt(id));
                    });
                }}
            />
            {
                imagesLoaded &&
                <>
                    <div id="imageButtons">
                        <Tooltip title="Generate image with the selected frames">
                            <Button variant="contained" onClick={sendImagesToBlend}>Create Image</Button>
                        </Tooltip>
                        <Tooltip title="Download blended image">
                            <Button variant="contained" onClick={downloadImage}>Download</Button>
                        </Tooltip>
                    </div>
                    <div id="buttonContainerSelectCopy">
                        <div id="selectButtons">
                            <Tooltip title="Select all frames of this page">
                                <Button variant="contained" onClick={selectAllImagesOnPage}>Select Page</Button>
                            </Tooltip>
                            <Tooltip title="Deselect all frames of this page">
                                <Button variant="contained" color="warning" onClick={deselectAllImagesOnPage} >Deselect Page</Button>
                            </Tooltip>
                        </div>
                        <div id="copyButton">
                            <Tooltip title="Creates a copy of this project with different fps">
                                <Button variant="contained" onClick={() => setOpenCopy(true)}>Create Copy</Button>
                            </Tooltip>
                        </div>
                    </div>
                    <CopyDialog projectName={projectName} open={openCopy} setOpen={setOpenCopy} launchNotification={launchNotification}></CopyDialog>
                    <ImageDetail open={open} setOpen={setOpen} imgSrc={fullscreenImage} ></ImageDetail>
                    <Grid container spacing={2} key={refreshKey}>
                        {
                            currentImages.map((image, index) => (
                                <Grid item xs={2} key={index}>
                                    <IconButton onClick={() => handleOpen(image.data)} sx={{
                                        float: "right", top: 45, left: 5, backgroundColor: "rgba(0,0,0,0.5)", // Set the background color
                                        color: "white", // Set the icon color
                                        '&:hover': {
                                            backgroundColor: "rgba(50, 50, 50, 0.5)", // Background color on hover
                                        },
                                    }}>
                                        <FullscreenIcon fontSize="medium"></FullscreenIcon>
                                    </IconButton>
                                    <Tooltip title={"Image " + image.index} placement="top">
                                        <img id={image.index + ""} loading="lazy" decoding="async" src={image.data} width={200} onClick={() => swapSelectStatus(image.index)} className={`${image.selected ? "selected" : "unselected"}`}></img>
                                    </Tooltip>
                                    <IconButton disabled={!image.selected ? true : false} sx={{ color: `${image.highlighted ? "#dd33fa" : "white"}` }}
                                        onClick={() => swapHighlightStatus(image.index)}>
                                        <Tooltip title="Highlight frame">
                                            <StarBorderIcon></StarBorderIcon>
                                        </Tooltip>
                                    </IconButton>
                                    {
                                        image.highlighted &&
                                        <ToggleButtonGroup
                                            sx={{ height: 20 }}
                                            color="primary"
                                            exclusive
                                            value={image.highlightStrength}
                                            onChange={(event, newStrength) => changeHighlightStrength(event, newStrength, image.index)}
                                        >
                                            <Tooltip title="Frame will be added 10 times">
                                                <ToggleButton value={1}>10 x</ToggleButton>
                                            </Tooltip>
                                            <Tooltip title="Frame will be added 20 times">
                                                <ToggleButton value={2}>20 x</ToggleButton>
                                            </Tooltip>
                                            <Tooltip title="Frame will be added 30 times">
                                                <ToggleButton value={3}>30 x</ToggleButton>
                                            </Tooltip>
                                        </ToggleButtonGroup>
                                    }
                                </Grid>
                            ))
                        }
                    </Grid>
                    <Pagination sx={{ display: "flex", alignSelf: "center", justifyContent: "center" }} color="primary" page={currentPage} count={pageCount} onChange={(e, value) => { setCurrentPage(value) }} shape="rounded" />
                </>
            }
        </>
    )
}
export default ImageSelector;