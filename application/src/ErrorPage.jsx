import { Container } from "@mui/system";
import { Paper } from "@mui/material";
import ReportIcon from '@mui/icons-material/Report';

export default function ErrorPage(){
    return(
    <Container>
        <Paper variant="outlined" square >
            <ReportIcon/><br/>
            Unexpected error happened! :(
        </Paper>
    </Container>
    );
}