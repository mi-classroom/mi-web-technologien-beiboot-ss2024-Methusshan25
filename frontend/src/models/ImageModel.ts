import { IImage } from "../interfaces/IImage";

export async function getImages(projectName: string, min: number, count: number): Promise<Array<IImage>> {
  let images: Array<IImage> = []
  await fetch('http://localhost:8080/listImages/' + projectName)
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

export async function getTotalFrameCount(projectName: string): Promise<number> {
  let totalFrameCount = 0;
  await fetch('http://localhost:8080/listImages/' + projectName)
  .then(response => response.json())
  .then(data => {
    totalFrameCount = data.length
  }).catch(error => {
    console.log(error)
    totalFrameCount = -1
  }) 
  return totalFrameCount;
}

export async function generateFrames(projectName: string, fps: number): Promise<Boolean> {
  await fetch("http://localhost:8080/splitFrames/" + projectName + "?fps=" + fps)
  .then(response => response.text())
  .then(text => {
    console.log(text);
    return true;
  })
  .catch(error => {
    console.log(error)
    return false;
  })
  return false;
}

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
