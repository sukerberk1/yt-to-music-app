import { Container } from "@mui/system";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Typography } from "@mui/material";

export default function ErrorPage(){
    return(
    <Container sx={{height: '100vh', display: 'flex', flexFlow: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <ErrorOutlineIcon style={{textAlign: 'center', fontSize: 96}}/>
            <Typography variant="h2" >
                Unexpected error happened! :(
            </Typography>
            
    </Container>
    );
}