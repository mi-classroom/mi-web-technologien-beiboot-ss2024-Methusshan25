import { Button, Grid, IconButton, Pagination, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { IImageSelectorProps } from "../interfaces/IImageSelectorProps";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useImageViewModel } from "../ViewModel/ImageViewModel";
import Selecto from "react-selecto";

const ImageSelector = ({ projectName, sendImage, blendedImageExists }: IImageSelectorProps) => {

    const {pageCount,
        currentImages, refreshKey, setSelectStatus, setHighlightStatus, changeHighlightStrength, imagesLoaded, currentPage, setCurrentPage, sendImagesToBlend
    } = useImageViewModel(projectName, sendImage, blendedImageExists);
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
                            setSelectStatus(parseInt(id));
                    });
                }}
            />
            {
                imagesLoaded &&
                <>
                    <Tooltip title="Generate image with the selected frames">
                        <Button variant="contained" onClick={sendImagesToBlend} sx={{ marginTop: 10, float: "right", right: -90}}>Create Image</Button>
                    </Tooltip>
                    <Grid container spacing={2} key={refreshKey}>
                        {
                            currentImages.map((image, index) => (
                                <Grid item xs={2} key={index}>
                                    <Tooltip title={"Image " + image.index} placement="top">
                                        <img id={image.index + ""} loading="lazy" decoding="async" src={image.data} width={200} onClick={() => setSelectStatus(image.index)} className={`${image.selected ? "selected" : "unselected"}`}></img>
                                    </Tooltip>
                                    <IconButton disabled={!image.selected ? true : false} sx={{ color: `${image.highlighted ? "#dd33fa" : "white"}` }}
                                        onClick={() => setHighlightStatus(image.index)}>
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