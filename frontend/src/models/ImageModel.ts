import axios from "axios";
import { IImage } from "../interfaces/IImage";


/**
 * Makes request for images for all images from a project and filters and saves images that are in the given range.
 * @param projectName Name of the project whose images are requested
 * @param lowestIndex The lowest index of the filtered images 
 * @param numberOfImages The number of images that are returned
 * @returns Array with all images from the project that are in the given range
 *  */ 
export async function getImages(projectName: string, lowestIndex: number, numberOfImages: number): Promise<Array<IImage>> {
  let images: Array<IImage> = []
  await axios.get('http://localhost:8080/listImages/' + projectName).then(res => {
    res.data.forEach((image: any) => {
      let indexArray = image.split("frame")
      indexArray = indexArray[1].split(".")
      let imageIndex = indexArray[0];
      if (imageIndex >= lowestIndex && imageIndex < lowestIndex + numberOfImages && imageIndex < res.data.length) {
        images.push({
          index: imageIndex,
          name: image,
          data: "http://localhost:8080/" + projectName + "/" + image,
          selected: false,
          highlighted: false,
          highlightStrength: 0,
        })
      }
    })
    images.sort((a, b) => { return a.index - b.index })
    //console.log(images)
  }).catch(err => {
    console.log(err);
  })
  return images;
}

/**
 * Returns the total number of frames in the given project
 * @param projectName Refers to the project whose total number of frames is requested
 * @returns The number of all frames in the requested project
 */
export async function getTotalFrameCount(projectName: string): Promise<number> {
  let totalFrameCount = 0;
  await axios.get('http://localhost:8080/listImages/' + projectName).then(res => {
    totalFrameCount = res.data.length;
  }).catch(err => {
    console.log(err);
  })
  return totalFrameCount;
}

/**
 * Makes an request to split the video of the project into frames and returns if it was successful
 * @param projectName Refers to the project whose video is split into frames
 * @returns Success of the splitting process
 */
export async function generateFrames(projectName: string): Promise<Boolean> {
  await axios.get("http://localhost:8080/splitFrames/" + projectName).then(res => {
    console.log(res)
    return true;
  }).catch(err => {
    console.error(err)
    return false;
  })
  return true;
}

/**
 * Makes an request to generate an blended image with the frames in the project
 * @param projectName Refers to the project whose frames are blended together
 * @param selectedImages A string containing all the indices of frames, which are to use in the blending process
 * @param highlightedImages A string containing all the indices and highlight strengths of the frames, which are to be highlighted.
 * @returns The blended image in base64 format
 */
export async function generateBlendedImage(projectName: string, selectedImages: string, highlightedImages: string): Promise<string> {
  var result = "";
  const form = new FormData();
  form.append("framesToUse", selectedImages);
  form.append("framesToHighlight", highlightedImages);
  await axios.post('http://localhost:8080/blendImages/' + projectName, form).then((res) => {
    result = "data:image/jpeg;base64," + res.data;
  })
  return result
}

/**
 * Returns the blended image in the project 
 * @param projectName Refers to the project whose blended image is requested
 * @returns The requested image in base64 format
 */
export async function getBlendedImage(projectName: string): Promise<string> {
  var result = "";
  await axios.get('http://localhost:8080/blendedImage/' + projectName).then((res) => {
    result = "data:image/jpeg;base64," + res.data;
  })
  return result
}
