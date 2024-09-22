export interface IImageSelectorProps {
    projectName: string
    blendedImageExists : boolean,
    blendedImage: string,
    sendImage : (data : string) => void
    launchNotification: (message: string) => void
}