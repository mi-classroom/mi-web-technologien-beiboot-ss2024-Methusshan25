export interface ICopyProps{
    open: boolean,
    setOpen: (isOpen: boolean) => void;
    projectName: string;
    launchNotification: (message: string) => void
}