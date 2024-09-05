export interface IImageSelectorProps {
    projectName: string
    blendedImageExists : boolean,
    sendImage : (data : string) => void
}