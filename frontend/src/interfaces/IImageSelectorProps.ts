export interface IImageSelectorProps {
    projectName: string
    blendedImageExists : boolean,
    sendImage : (data : string) => void
    launchNotification: (message: string) => void
}