import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col gap-2"> 
            <Typography variant="h2">404 Not Found</Typography>
            <Link to='/'><Typography variant="h3">Home</Typography></Link>
        </div>
        
    );
}