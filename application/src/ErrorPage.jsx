import { Container } from "@mui/system";
import ReportIcon from '@mui/icons-material/Report';

export default function ErrorPage(){
    return(
    <Container>
            <ReportIcon style={{textAlign: 'center', fontSize: 56}}/><br/>
            Unexpected error happened! :(
    </Container>
    );
}