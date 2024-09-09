import { Dialog } from "@mui/material";

interface IDetail {
    open: boolean,
    setOpen: (isOpen: boolean) => void,
    imgSrc: string
}

const ImageDetail = ({ open, setOpen, imgSrc }: IDetail) => {

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" disableScrollLock={true}>
            <img src={imgSrc}></img>
        </Dialog>
    )
}
export default ImageDetail;