import { getImages, getBlendedImage, getTotalFrameCount, generateBlendedImage, generateFrames } from "../models/ImageModel";
import { IImage } from "../interfaces/IImage";
import { useCallback, useEffect, useState } from "react";
import { IHighlight } from "../interfaces/IHighlight";

interface ImageViewModel {
    pageCount: number
    setPageCount: (pageCount: number) => void
    currentImages: IImage[],
    selectedImages: number[],
    highlightedImages: IHighlight[],
    setHighlightedImages: (highlights: IHighlight[]) => void
    refreshKey: number,
    setRefreshKey: (key: any) => void
    frameCount: number,
    setFrameCount: (frameCount: number) => void
    getFrameCount: () => void
    imagesLoaded: boolean
    currentPage: number,
    setCurrentPage: (page: number) => void
    open: boolean,
    setOpen: (isOpen: boolean) => void,
    fullscreenImage: string,
    setFullscreenImage: (fullscreenImage: string) => void
    setImagesLoaded: (value: boolean) => void
    updateImages: (pCurrentPage: number) => void
    swapSelectStatus: (index: number) => void
    swapHighlightStatus: (index: number) => void
    changeHighlightStrength: (event: React.MouseEvent<HTMLElement>, newStrength: Number, index: Number) => void
    updateSelected: (images: IImage[]) => IImage[]
    setCurrentImages: (images: IImage[]) => void
    generateImageString: (projectName: string) => Promise<string[]>
    sendImagesToBlend: () => void
    handleOpen: (imgSource: string) => void
    selectAllImagesOnPage: () => void
    deselectAllImagesOnPage: () => void
    useGetImages: (projectName: string, min: number, count: number) => Promise<Array<IImage>>;
    useGetBlendedImage: (projectName: string) => Promise<string>
    useGetTotalFrameCount: (projectName: string) => Promise<number>
    useGenerateBlendedImage: (projectName: string, selectedImages: string, highlightedImages: string) => Promise<string | null>
    useGenerateFrames: (projectName: string, fps: string) => Promise<Boolean>
}

export function useImageViewModel(projectName: string, sendFunction?: (image: string) => void, blendedImageExists?: boolean, launchNotification?: (message: string) => void): ImageViewModel {

    const [pageCount, setPageCount] = useState<number>(0);
    const [currentImages, setCurrentImages] = useState<IImage[]>([{ index: 0, name: "FillName", data: "FillData", selected: false, highlighted: false, highlightStrength: 1 }]);
    const [selectedImages,] = useState<number[]>([]);
    const [highlightedImages, setHighlightedImages] = useState<IHighlight[]>([{ highlightedImage: 0, hightlightStrength: 0 }]);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [frameCount, setFrameCount] = useState<number>(0);
    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [open, setOpen] = useState<boolean>(false);
    const [fullscreenImage, setFullscreenImage] = useState<string>("");

    useEffect(() => {
        if (blendedImageExists) {
            getAndSendBlendedImage();
        }
    }, [])

    useEffect(() => {
        updateFrameAndPagecount();
        updateImages(currentPage);
    }, [frameCount, currentPage])

    /**
     * Generates an blended images and sends it to the parent
     */
    const sendImagesToBlend = async () => {
        let strings = await generateImageString();
        let image = await useGenerateBlendedImage(projectName, strings[0], strings[1]);
        if (sendFunction != undefined && image != null)
            sendFunction(image);
        if(launchNotification != undefined){
            launchNotification("Images successfully blended");
        }
    }

    /**
     * Requests the blended image and sends it to the parent
     */
    const getAndSendBlendedImage = useCallback(async () => {
        let image = await useGetBlendedImage(projectName);
        if (sendFunction != undefined)
            sendFunction(image);
    }, [])

    /**
     * If image is found in the selectedImages or highlightedImages array, the values of images are updated to match
     * @param images Array of images which will be updated
     * @returns Array with all updated images
     */
    const updateSelected = (images: IImage[]) => {
        selectedImages.forEach((imageId) => {
            let findIndex = images.findIndex((image) => image.index == imageId);
            if (findIndex != -1) {
                images[findIndex].selected = true;
            }
        })
        highlightedImages.forEach((highlight) => {
            let findIndex = images.findIndex((image) => image.index == highlight.highlightedImage);
            if (findIndex != -1) {
                images[findIndex].highlighted = true;
                images[findIndex].highlightStrength = highlight.hightlightStrength;
            }
        })
        return images;
    }

    /**
     * Changes the select status of the image with the given index
     * @param index Index of the image to be changed
     */
    const swapSelectStatus = (index: number) => {
        let fillerImages = currentImages;
        let findIndex = fillerImages.findIndex((image) => image.index == index);
        if (fillerImages[findIndex].selected) {
            fillerImages[findIndex].selected = false;
            fillerImages[findIndex].highlighted = false;
            let deleteIndex = selectedImages.findIndex((imageID) => imageID == index);
            selectedImages.splice(deleteIndex, 1);
            console.log("index:" + index + " findIndex: " + findIndex + " deleteIndex: " + deleteIndex + " selectedImages: " + selectedImages)
        }
        else {
            fillerImages[findIndex].selected = true;
            selectedImages.push(index);
        }
        setCurrentImages(fillerImages);
        setRefreshKey((prevKey: number) => prevKey + 1);
    }

    /**
     * Changes the highlight status of the image with the given index
     * @param index Index of the image to be changed
     */
    const swapHighlightStatus = (index: number) => {
        let fillerImages = currentImages;
        let findIndex = fillerImages.findIndex((image) => image.index == index);
        if (fillerImages[findIndex].highlighted) {
            fillerImages[findIndex].highlighted = false;
            let deleteIndex = highlightedImages.findIndex((image) => index == image.highlightedImage);;
            highlightedImages.splice(deleteIndex, 1);
        }
        else {
            fillerImages[findIndex].highlighted = true;
            highlightedImages.push({ highlightedImage: index, hightlightStrength: 0 });
        }
        setCurrentImages(fillerImages);
        setRefreshKey((prevKey: number) => prevKey + 1);
    }

    /**
     * Changes the highlight strength of an image
     * @param event Click-event when button pressed
     * @param newStrength The new highlight strength of the image
     * @param index The index of the image to be changed
     */
    const changeHighlightStrength = (event: React.MouseEvent<HTMLElement>, newStrength: Number, index: Number) => {
        event.preventDefault();
        let fillerImages = currentImages;
        let findIndex = fillerImages.findIndex((image) => image.index == index);
        if (newStrength != null) {
            fillerImages[findIndex].highlightStrength = newStrength;
            let findIndex2 = highlightedImages.findIndex((image) => image.highlightedImage == index);
            let copyHighlightedImages = highlightedImages;
            copyHighlightedImages[findIndex2].hightlightStrength = newStrength;
            setHighlightedImages(copyHighlightedImages);
        }
        setCurrentImages(fillerImages);
        setRefreshKey((prevKey: number) => prevKey + 1);
    }

    /**
     * Generated strings containing the indices of all selected and highlighted images. 
     * The highlight string also contains all highlight strengths.
     * @returns An array with both generated strings
     */
    const generateImageString = async (): Promise<string[]> => {
        var selectedString = "";
        var highlightedString = "";
        await useGetImages(projectName, 0, frameCount).then((res) => {
            res.forEach((image) => {
                let selected = selectedImages.find((selectedImage) => selectedImage == image.index);
                if (selected != undefined) {
                    selectedString += image.index + ",";
                }
                let highlight = highlightedImages.find((highlight) => highlight.highlightedImage == image.index);
                if (highlight != undefined) {
                    highlightedString += highlight.highlightedImage + ";" + highlight.hightlightStrength + ",";
                }
            })
        })
        return [selectedString, highlightedString];
    }

    /**
     * Requests the number of frames and updates the frameCount and pageCount variable
     */
    const updateFrameAndPagecount = useCallback(async () => {
        let frameCount = await useGetTotalFrameCount(projectName);
        setFrameCount(frameCount);
        setPageCount(Math.ceil((frameCount / 50)));
    }, [])

    /**
     * Sends an request to get all images for the given page
     * @param pCurrentPage Current page number
     */
    const updateImages = useCallback(async (pCurrentPage: number) => {
        setImagesLoaded(false);
        let newImages = await useGetImages(projectName, (pCurrentPage - 1) * 50, 50);
        let updatedImages = updateSelected(newImages);
        setCurrentImages(updatedImages);
        setImagesLoaded(true);
    }, [])

    /**
     * Opens the given Image in fullscreen view
     * @param imgSource Image to be seen in fullscreen view
     */
    const handleOpen = (imgSource: string) => {
        setFullscreenImage(imgSource);
        setOpen(true);
    }

    /**
     * Selects all images on the current page
     */
    const selectAllImagesOnPage = () => {
        currentImages.forEach(image => {
            if (!image.selected) {
                swapSelectStatus(image.index);
            }
        })
    }

    /**
     * Deselects all images on the current page
     */
    const deselectAllImagesOnPage = () => {
        currentImages.forEach(image => {
            if (image.selected) {
                if (image.highlighted) {
                    swapHighlightStatus(image.index);
                }
                swapSelectStatus(image.index);
            }
        })
    }

    /**
     * Makes request for images for all images from a project and filters and saves images that are in the given range.
     * @param projectName Name of the project whose images are requested
     * @param lowestIndex The lowest index of the filtered images 
     * @param numberOfImages The number of images that are returned
     * @returns Array with all images from the project that are in the given range 
    */
    async function useGetImages(projectName: string, lowestIndex: number, numberOfImages: number) {
        let images = await getImages(projectName, lowestIndex, numberOfImages);
        return images;
    }

    /**
     * Returns the blended image in the project 
     * @param projectName Refers to the project whose blended image is requested
     * @returns The requested image in base64 format
    */
    async function useGetBlendedImage(projectName: string) {
        let image = getBlendedImage(projectName);
        return image;
    }


    /**
     * Returns the total number of frames in the given project
     * @param projectName Refers to the project whose total number of frames is requested
     * @returns The number of all frames in the requested project
    */
    async function useGetTotalFrameCount(projectName: string) {
        let imageCount = await getTotalFrameCount(projectName);
        return imageCount;
    }

    /**
     * Makes an request to generate an blended image with the frames in the project
     * @param projectName Refers to the project whose frames are blended together
     * @param selectedImages A string containing all the indices of frames, which are to use in the blending process
     * @param highlightedImages A string containing all the indices and highlight strengths of the frames, which are to be highlighted.
     * @returns The blended image in base64 format
    */
    async function useGenerateBlendedImage(projectName: string, selectedImages: string, highlightedImages: string) {
        if (selectedImages == "") {
            alert("No images selected");
            return null
        } else {
            let image = await generateBlendedImage(projectName, selectedImages, highlightedImages);
            return image;
        }

    }

    /**
     * Makes an request to split the video of the project into frames and returns if it was successful
     * @param projectName Refers to the project whose video is split into frames
     * @param fps Frames per second, at which the images are split
     * @returns Success of the splitting process
    */
    async function useGenerateFrames(projectName: string, fps: string) {
        let framesGenerated = await generateFrames(projectName, fps);
        return framesGenerated;
    }

    return {
        useGetImages, useGetBlendedImage, useGetTotalFrameCount, useGenerateBlendedImage, useGenerateFrames, pageCount,
        setPageCount, currentImages, setCurrentImages, selectedImages, highlightedImages, setHighlightedImages, refreshKey,
        setRefreshKey, updateSelected, swapSelectStatus, swapHighlightStatus, changeHighlightStrength, frameCount, setFrameCount,
        generateImageString, getFrameCount: updateFrameAndPagecount, imagesLoaded, setImagesLoaded, updateImages,
        currentPage, setCurrentPage, sendImagesToBlend, open, setOpen, fullscreenImage, setFullscreenImage, handleOpen, selectAllImagesOnPage, deselectAllImagesOnPage
    }
}