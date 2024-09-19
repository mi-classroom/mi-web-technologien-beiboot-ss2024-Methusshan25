import { IImage } from "../interfaces/IImage";

/**
 * Makes request for images for all images from a project and filters and saves images that are in the given range.
 * @param projectName Name of the project whose images are requested
 * @param min The lowest index of the filtered images 
 * @param count The number of images that are returned
 * @returns Array with all images from the project that are in the given range
 *  */ 
export async function getImages(projectName: string, min: number, count: number): Promise<Array<IImage>> {
  let images: Array<IImage> = []
  await fetch('http://localhost:8080/frames/' + projectName)
  .then(response => response.json())
  .then(data => {
    data.forEach((image : any) => {
      let indexArray = image.split("frame")
      indexArray = indexArray[1].split(".")
      let imageIndex = indexArray[0];
      if (imageIndex >= min && imageIndex < min + count && imageIndex < data.length) {
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
  })
  .catch(error => console.log(error))
  return images;
}

/**
 * Returns the total number of frames in the given project
 * @param projectName Refers to the project whose total number of frames is requested
 * @returns The number of all frames in the requested project
 */
export async function getTotalFrameCount(projectName: string): Promise<number> {
  let totalFrameCount = 0;
  await fetch('http://localhost:8080/frames/' + projectName)
  .then(response => response.json())
  .then(data => {
    totalFrameCount = data.length
  }).catch(error => {
    console.log(error)
    totalFrameCount = -1
  }) 
  return totalFrameCount;
}

/**
 * Makes an request to split the video of the project into frames and returns if it was successful
 * @param projectName Refers to the project whose video is split into frames
 * @returns Success of the splitting process
 */
export async function generateFrames(projectName: string, fps: string): Promise<Boolean> {
  return await fetch("http://localhost:8080/splitFrames/" + projectName + "?fps=" + fps)
  .then(response => response.text())
  .then(text => {
    console.log(text);
    return true;
  })
  .catch(error => {
    console.log(error)
    return false;
  })
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
  await fetch('http://localhost:8080/blendImages/' + projectName, {
    body: form,
    method: "POST"
  })
  .then(response => response.text())
  .then(text => result = "data:image/jpeg;base64," + text)
  .catch(error => console.log(error))
  return result
  
}

/**
 * Returns the blended image in the project 
 * @param projectName Refers to the project whose blended image is requested
 * @returns The requested image in base64 format
 */
export async function getBlendedImage(projectName: string): Promise<string> {
  var result = "";
  await fetch('http://localhost:8080/blendedImage/' + projectName)
  .then(response => response.text())
  .then(text => result = "data:image/jpeg;base64," + text)
  .catch(error => {
    console.log(error)
  })
  return result
}
