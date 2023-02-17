import { Alert, Box, Button, Paper, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Form, redirect, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export async function action({ request }){
    return 1;
}

export default function RegistrationPage(props){

    const { registerUser } = useContext(AuthContext);
    const [registerState, setRegisterState] = useState(0); /* -1 = invalid 0 = unsubmitted */

    const handleRegister = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const password2 = e.target.password2.value;
        const email = e.target.email.value;
        if(password===password2) setRegisterState( await registerUser(username, email, password) );
        else{
            setRegisterState(-1);
        }
    }


    if(registerState!==201)
    return(
    <Box>
        <Paper sx={{padding:1}}>
            <Form method="POST" onSubmit={handleRegister}>
                <h1>Register a new account</h1>
                { !registerState ? (<>
                <TextField fullWidth label="username" name="username" margin="normal" />
                <TextField fullWidth label="e-mail address" name="email" type="email" margin="normal" />
                <TextField fullWidth label="password" type="password" name="password" margin="normal"/>
                <TextField fullWidth label="confirm password" type="password" name="password2" margin="normal"/>
                </>
                ) 
                : (
                <>
                <TextField error fullWidth label="username" name="username" margin="normal" />
                <TextField error fullWidth label="e-mail address" name="email" type="email" margin="normal" />
                <TextField error fullWidth label="password" type="password" name="password" margin="normal"/>
                <TextField error fullWidth label="confirm password" type="password" name="password2" margin="normal"
                helperText="Something went wrong. Check if the email is correct, and if both passwords match"/>
                </>
                )
                }
                <Button variant="contained" sx={{margin: 1}} type="submit">Sign up</Button>
            </Form>
        </Paper>
    </Box>
    );
    else
    return(
        <Box>
        <Paper sx={{padding:1}}>
            <Form method="POST" onSubmit={handleRegister}>
                <h1>Register a new account</h1>
                <TextField disabled fullWidth label="username" name="username" margin="normal"/>
                <TextField disabled fullWidth label="e-mail address" name="email" type="email" margin="normal"/>
                <TextField disabled fullWidth label="password" type="password" name="password" margin="normal"/>
                <TextField disabled fullWidth label="confirm password" type="password" name="password2" margin="normal"/>
                <Alert severity="success">Accout created - now log in to fully use this app!</Alert>
            </Form>
        </Paper>
    </Box>
    );
}