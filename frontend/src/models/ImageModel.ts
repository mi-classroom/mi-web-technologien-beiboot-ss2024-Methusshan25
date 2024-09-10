import axios from "axios";
import { IImage } from "../interfaces/IImage";

const url = 'https://les-backend.onrender.com'

export async function getImages(projectName: string, min: number, count: number): Promise<Array<IImage>> {
  let images: Array<IImage> = []
  await axios.get(url + '/listImages/' + projectName).then(res => {
    res.data.forEach((image: any) => {
      let indexArray = image.split("frame")
      indexArray = indexArray[1].split(".")
      let imageIndex = indexArray[0];
      if (imageIndex >= min && imageIndex < min + count && imageIndex < res.data.length) {
        images.push({
          index: imageIndex,
          name: image,
          data: url + projectName + "/" + image,
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

export async function getTotalFrameCount(projectName: string): Promise<number> {
  let totalFrameCount = 0;
  await axios.get(url + '/listImages/' + projectName).then(res => {
    totalFrameCount = res.data.length;
  }).catch(err => {
    console.log(err);
  })
  return totalFrameCount;
}

export async function generateFrames(projectName: string): Promise<Boolean> {
  await axios.get(url + "/splitFrames/" + projectName).then(res => {
    console.log(res)
    return true;
  }).catch(err => {
    console.error(err)
    return false;
  })
  return true;
}

export async function generateBlendedImage(projectName: string, selectedImages: string, highlightedImages: string): Promise<string> {
  var result = "";
  const form = new FormData();
  form.append("framesToUse", selectedImages);
  form.append("framesToHighlight", highlightedImages);
  await axios.post(url + '/blendImages/' + projectName, form).then((res) => {
    result = "data:image/jpeg;base64," + res.data;
  })
  return result
}

export async function getBlendedImage(projectName: string): Promise<string> {
  var result = "";
  await axios.get(url + '/blendedImage/' + projectName).then((res) => {
    result = "data:image/jpeg;base64," + res.data;
  })
  return result
}
