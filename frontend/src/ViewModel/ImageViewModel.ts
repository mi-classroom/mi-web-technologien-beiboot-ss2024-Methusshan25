import { getImages, getBlendedImage, getTotalFrameCount, generateBlendedImage, generateFrames } from "../models/ImageModel";
import { IImage } from "../interfaces/IImage";
import { useCallback, useEffect, useState } from "react";
import { IHighlight } from "../interfaces/IHighlight";

interface ImageViewModel {
    pageCount: number
    setPageCount: (pageCount : number) => void
    currentImages: IImage[],
    selectedImages: number[],
    highlightedImages: IHighlight[],
    setHighlightedImages: (highlights : IHighlight[]) => void
    refreshKey: number,
    setRefreshKey: (key : any) => void
    frameCount: number,
    setFrameCount: (frameCount : number) => void
    getFrameCount: () => void 
    imagesLoaded: boolean
    currentPage : number,
    setCurrentPage : (page : number) => void 
    setImagesLoaded: (value : boolean) => void
    updateImages : (pCurrentPage : number) => void
    setSelectStatus: (index : number) => void
    setHighlightStatus: (index : number) => void
    changeHighlightStrength: (event: React.MouseEvent<HTMLElement>, newStrength: Number, index: Number) => void
    updateSelected: (images : IImage[]) => IImage[]
    setCurrentImages: (images : IImage[]) => void
    generateImageString: (projectName : string) => Promise<string[]>
    sendImagesToBlend: () => void
    useGetImages: (projectName: string, min: number, count : number) => Promise<Array<IImage>>;
    useGetBlendedImage: (projectName: string) => Promise<string>
    useGetTotalFrameCount: (projectName: string) => Promise<number>
    useGenerateBlendedImage: (projectName: string, selectedImages: string, highlightedImages: string) => Promise<string>
    useGenerateFrames: (projectName: string) => Promise<Boolean>
}

export function useImageViewModel(projectName : string, sendFunction?: (image : string) => void, blendedImageExists? : boolean) : ImageViewModel {

    const [pageCount, setPageCount] = useState<number>(0);
    const [currentImages, setCurrentImages] = useState<IImage[]>([{ index: 0, name: "FillName", data: "FillData", selected: false, highlighted: false, highlightStrength: 1 }]);
    const [selectedImages,] = useState<number[]>([]);
    const [highlightedImages, setHighlightedImages] = useState<IHighlight[]>([{ highlightedImage: 0, hightlightStrength: 0 }]);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [frameCount, setFrameCount] = useState<number>(0);
    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        if (blendedImageExists) {
            getAndSendBlendedImage()
        }
    }, [])

    useEffect(() => {
        getFrameCount();
        updateImages(currentPage);
    }, [frameCount, currentPage])

    const sendImagesToBlend = async () => {
        let strings = await generateImageString()
        let image = await useGenerateBlendedImage(projectName, strings[0], strings[1]);
        if(sendFunction != undefined)
            sendFunction(image);
    }

    const getAndSendBlendedImage = useCallback(async () => {
        let image = await useGetBlendedImage(projectName);
        if(sendFunction != undefined)
            sendFunction(image);
    }, [])

    const updateSelected = (images: IImage[]) => {
        selectedImages.forEach((imageId) => {
            let findIndex = images.findIndex((image) => image.index == imageId)
            if (findIndex != -1) {
                images[findIndex].selected = true;
            }
        })
        highlightedImages.forEach((highlight) => {
            let findIndex = images.findIndex((image) => image.index == highlight.highlightedImage)
            if (findIndex != -1) {
                images[findIndex].highlighted = true;
                images[findIndex].highlightStrength = highlight.hightlightStrength;
            }
        })
        return images;
    }

    const setSelectStatus = (index: number) => {
        let fillerImages = currentImages;
        let findIndex = fillerImages.findIndex((image) => image.index == index);
        if (fillerImages[findIndex].selected) {
            fillerImages[findIndex].selected = false;
            fillerImages[findIndex].highlighted = false;
            let deleteIndex = selectedImages.indexOf(index);
            selectedImages.splice(deleteIndex, 1);
        }
        else {
            fillerImages[findIndex].selected = true;
            selectedImages.push(index);
        }
        setCurrentImages(fillerImages);
        setRefreshKey((prevKey: number) => prevKey + 1);
    }

    const setHighlightStatus = (index: number) => {
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

    const changeHighlightStrength = (event: React.MouseEvent<HTMLElement>, newStrength: Number, index: Number) => {
        let fillerImages = currentImages;
        let findIndex = fillerImages.findIndex((image) => image.index == index);
        if (newStrength != null) {
            fillerImages[findIndex].highlightStrength = newStrength;
            let findIndex2 = highlightedImages.findIndex((image) => image.highlightedImage == index)
            let copyHighlightedImages = highlightedImages;
            copyHighlightedImages[findIndex2].hightlightStrength = newStrength;
            setHighlightedImages(copyHighlightedImages);
        }
        setCurrentImages(fillerImages);
        setRefreshKey((prevKey: number) => prevKey + 1);
    }

    const generateImageString = async (): Promise<string[]> => {
        var selectedString = "";
        var highlightedString = "";
        await useGetImages(projectName, 0, frameCount).then((res) => {
            res.forEach((image) => {
                if (selectedImages.find((selectedImage) => selectedImage == image.index) != undefined) {
                    selectedString += image.index + ",";
                }
                if (image.highlighted) {
                    highlightedString += image.index + ";" + image.highlightStrength + ",";
                }
            })
        })
        return [selectedString, highlightedString];
    }

    const getFrameCount = useCallback(async () => {
        let frameCount = await useGetTotalFrameCount(projectName);
        setFrameCount(frameCount);
        console.log(frameCount);
        setPageCount(Math.ceil((frameCount / 50)));
    }, [])

    const updateImages = useCallback(async (pCurrentPage: number) => {
        setImagesLoaded(false);
        let newImages = await useGetImages(projectName, (pCurrentPage - 1) * 50, 50);
        let updatedImages = updateSelected(newImages);
        setCurrentImages(updatedImages);
        setImagesLoaded(true);
    }, [])

    async function useGetImages(projectName: string, min: number, count : number){
        let images = await getImages(projectName, min, count);
        return images;
    }

    async function useGetBlendedImage(projectName : string){
        let image = getBlendedImage(projectName);
        return image;
    }

    async function useGetTotalFrameCount(projectName: string){
        let imageCount = await getTotalFrameCount(projectName);
        return imageCount;
    }

    async function useGenerateBlendedImage(projectName: string, selectedImages : string, highlightedImages: string){
        let image = await generateBlendedImage(projectName, selectedImages, highlightedImages);
        return image;
    }

    async function useGenerateFrames(projectName : string){
        let framesGenerated = await generateFrames(projectName);
        return framesGenerated;
    }

    return {useGetImages, useGetBlendedImage, useGetTotalFrameCount, useGenerateBlendedImage, useGenerateFrames, pageCount, 
        setPageCount, currentImages, setCurrentImages, selectedImages, highlightedImages, setHighlightedImages, refreshKey, 
        setRefreshKey, updateSelected, setSelectStatus, setHighlightStatus, changeHighlightStrength, frameCount, setFrameCount,
        generateImageString, getFrameCount, imagesLoaded, setImagesLoaded, updateImages, currentPage, setCurrentPage, sendImagesToBlend}
}